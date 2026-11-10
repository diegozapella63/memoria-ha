import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { EventEmitter } from "node:events";
import { acceptUpgrade, WsConnection } from "../memoria/rootfs/app/lib/ws.js";

class FakeSocket extends EventEmitter {
  constructor() {
    super();
    this.out = [];
    this.ended = false;
    this.destroyed = false;
  }
  setNoDelay() {}
  setKeepAlive() {}
  write(b) {
    this.out.push(Buffer.isBuffer(b) ? b : Buffer.from(b));
  }
  end(b) {
    if (b) this.write(b);
    this.ended = true;
  }
  /** The frames the server wrote: [{opcode, fin, payload}] */
  frames() {
    const all = Buffer.concat(this.out);
    const out = [];
    let p = 0;
    while (p < all.length) {
      const fin = (all[p] & 0x80) !== 0;
      const opcode = all[p] & 0x0f;
      assert.equal(all[p + 1] & 0x80, 0, "server frames are never masked");
      let len = all[p + 1] & 0x7f;
      let off = p + 2;
      if (len === 126) {
        len = all.readUInt16BE(p + 2);
        off = p + 4;
      } else if (len === 127) {
        len = Number(all.readBigUInt64BE(p + 2));
        off = p + 10;
      }
      out.push({ fin, opcode, payload: all.subarray(off, off + len), header: off - p });
      p = off + len;
    }
    return out;
  }
}

/** A frame as a browser sends it (masked). */
function frame(opcode, payload, { fin = true, mask = true, key = [1, 2, 3, 4] } = {}) {
  const data = Buffer.isBuffer(payload) ? payload : Buffer.from(payload);
  const len = data.length;
  let head;
  if (len < 126) head = Buffer.from([(fin ? 0x80 : 0) | opcode, (mask ? 0x80 : 0) | len]);
  else if (len < 65536) {
    head = Buffer.alloc(4);
    head[0] = (fin ? 0x80 : 0) | opcode;
    head[1] = (mask ? 0x80 : 0) | 126;
    head.writeUInt16BE(len, 2);
  } else {
    head = Buffer.alloc(10);
    head[0] = (fin ? 0x80 : 0) | opcode;
    head[1] = (mask ? 0x80 : 0) | 127;
    head.writeBigUInt64BE(BigInt(len), 2);
  }
  if (!mask) return Buffer.concat([head, data]);
  const masked = Buffer.from(data);
  for (let i = 0; i < masked.length; i++) masked[i] ^= key[i & 3];
  return Buffer.concat([head, Buffer.from(key), masked]);
}

function conn(t, head) {
  t.mock.timers.enable({ apis: ["setInterval"] });
  const socket = new FakeSocket();
  const c = new WsConnection(socket, head);
  const messages = [];
  let closes = 0;
  c.on("message", (m) => messages.push(m));
  c.on("close", () => closes++);
  return { c, socket, messages, closes: () => closes };
}

describe("acceptUpgrade", () => {
  const req = (headers) => ({ headers: { upgrade: "websocket", "sec-websocket-key": "dGhlIHNhbXBsZSBub25jZQ==", "sec-websocket-version": "13", ...headers } });

  it("answers the handshake with the RFC 6455 accept key", (t) => {
    t.mock.timers.enable({ apis: ["setInterval"] });
    const socket = new FakeSocket();
    const ws = acceptUpgrade(req({ upgrade: "WebSocket" }), socket, Buffer.alloc(0));
    assert.ok(ws instanceof WsConnection);
    const text = socket.out[0].toString();
    assert.match(text, /^HTTP\/1\.1 101 Switching Protocols\r\n/);
    assert.match(text, /\r\nSec-WebSocket-Accept: s3pPLMBiTxaQ9kYGzzhZRbK\+xOo=\r\n\r\n$/);
    ws.close();
  });

  it("refuses requests that are not WebSocket version 13", () => {
    for (const h of [{ upgrade: "h2c" }, { upgrade: undefined }, { "sec-websocket-key": undefined }, { "sec-websocket-version": "8" }]) {
      const socket = new FakeSocket();
      assert.equal(acceptUpgrade(req(h), socket), null);
      assert.match(socket.out[0].toString(), /^HTTP\/1\.1 400 Bad Request/);
      assert.equal(socket.ended, true);
    }
  });
});

describe("WsConnection: reading", () => {
  it("unmasks a text frame", (t) => {
    const { c, socket, messages } = conn(t);
    socket.emit("data", frame(1, "olá, mundo"));
    assert.deepEqual(messages, ["olá, mundo"]);
    c.close();
  });

  it("waits for the rest of a frame split in pieces, and reads several frames in one chunk", (t) => {
    const { c, socket, messages } = conn(t);
    const bytes = Buffer.concat([frame(1, '{"id":1}'), frame(1, '{"id":2}')]);
    for (const b of bytes) socket.emit("data", Buffer.from([b]));
    assert.deepEqual(messages, ['{"id":1}', '{"id":2}']);
    socket.emit("data", Buffer.concat([frame(1, "a"), frame(1, "b"), frame(1, "c")]));
    assert.deepEqual(messages.slice(2), ["a", "b", "c"]);
    c.close();
  });

  it("joins a fragmented message (continuation frames), even with a ping in between", (t) => {
    const { c, socket, messages } = conn(t);
    socket.emit("data", frame(1, "Com", { fin: false }));
    socket.emit("data", frame(9, "p"));
    socket.emit("data", frame(0, "pr", { fin: false }));
    socket.emit("data", frame(0, "as"));
    assert.deepEqual(messages, ["Compras"]);
    c.close();
  });

  it("reads 16-bit and 64-bit lengths", (t) => {
    const { c, socket, messages } = conn(t);
    socket.emit("data", frame(1, "m".repeat(300)));
    socket.emit("data", frame(1, "g".repeat(70_000)));
    assert.equal(messages[0].length, 300);
    assert.equal(messages[1].length, 70_000);
    c.close();
  });

  it("a multi-byte character split across fragments comes out whole", (t) => {
    const { c, socket, messages } = conn(t);
    const b = Buffer.from("ção");
    socket.emit("data", frame(1, b.subarray(0, 2), { fin: false }));
    socket.emit("data", frame(0, b.subarray(2)));
    assert.deepEqual(messages, ["ção"]);
    c.close();
  });

  it("delivers a frame that came with the handshake", async (t) => {
    const { c, messages } = conn(t, frame(1, "cedo"));
    assert.deepEqual(messages, []);
    await new Promise((r) => setImmediate(r));
    assert.deepEqual(messages, ["cedo"]);
    c.close();
  });
});

describe("WsConnection: control frames and limits", () => {
  it("answers a ping with a pong carrying the same data; ignores pongs", (t) => {
    const { c, socket } = conn(t);
    socket.emit("data", frame(9, "hi"));
    socket.emit("data", frame(10, "x"));
    assert.deepEqual(socket.frames().map((f) => [f.opcode, f.payload.toString()]), [[10, "hi"]]);
    c.close();
  });

  it("echoes a close and closes once", (t) => {
    const { c, socket, closes } = conn(t);
    const code = Buffer.alloc(2);
    code.writeUInt16BE(1001);
    socket.emit("data", frame(8, code));
    assert.deepEqual(socket.frames().map((f) => [f.opcode, f.payload.readUInt16BE(0)]), [[8, 1001]]);
    assert.equal(socket.ended, true);
    assert.equal(closes(), 1);
    socket.emit("close");
    assert.equal(closes(), 1);
    assert.equal(c.closed, true);
  });

  it("what arrives after the close is discarded (RFC 6455)", (t) => {
    const { socket, messages } = conn(t);
    const code = Buffer.alloc(2);
    code.writeUInt16BE(1000);
    socket.emit("data", frame(8, code));
    socket.emit("data", frame(1, '{"id":9,"type":"resolvia/points/get"}'));
    assert.deepEqual(messages, []);
  });

  it("closes with 1002 on an unmasked frame", (t) => {
    const { socket, messages, closes } = conn(t);
    socket.emit("data", frame(1, "x", { mask: false }));
    assert.deepEqual(messages, []);
    assert.equal(socket.frames()[0].payload.readUInt16BE(0), 1002);
    assert.equal(closes(), 1);
  });

  it("closes with 1009 on a message over 4 MB (one frame or fragments)", (t) => {
    const big = conn(t);
    const head = Buffer.alloc(10);
    head[0] = 0x81;
    head[1] = 0x80 | 127;
    head.writeBigUInt64BE(BigInt(4 * 1024 * 1024 + 1), 2);
    big.socket.emit("data", head);
    assert.equal(big.socket.frames()[0].payload.readUInt16BE(0), 1009);
    t.mock.timers.reset();
    const frag = conn(t);
    const part = Buffer.alloc(1024 * 1024, 0x61);
    for (let i = 0; i < 4; i++) frag.socket.emit("data", frame(i ? 0 : 1, part, { fin: false }));
    assert.equal(frag.closes(), 0);
    frag.socket.emit("data", frame(0, Buffer.from("a"), { fin: false }));
    assert.equal(frag.closes(), 1);
    assert.equal(frag.socket.frames().at(-1).payload.readUInt16BE(0), 1009);
  });

  it("a dropped socket (close or error) ends the connection once", (t) => {
    const a = conn(t);
    a.socket.emit("error", new Error("reset"));
    a.socket.emit("close");
    assert.equal(a.closes(), 1);
  });
});

describe("WsConnection: writing", () => {
  it("frames text with the shortest length header", (t) => {
    const { c, socket } = conn(t);
    c.send("a".repeat(125));
    c.send("b".repeat(126));
    c.send("c".repeat(65_535));
    c.send("d".repeat(65_536));
    const f = socket.frames();
    assert.deepEqual(f.map((x) => [x.opcode, x.fin, x.header, x.payload.length]), [
      [1, true, 2, 125],
      [1, true, 4, 126],
      [1, true, 4, 65_535],
      [1, true, 10, 65_536],
    ]);
    c.close();
  });

  it("sends UTF-8", (t) => {
    const { c, socket } = conn(t);
    c.send("ção ✓");
    assert.equal(socket.frames()[0].payload.toString("utf8"), "ção ✓");
    c.close();
  });

  it("close(code) sends the code, ends the socket, and nothing is sent after", (t) => {
    const { c, socket, closes } = conn(t);
    c.close(4000);
    c.close(4001);
    c.send("late");
    const f = socket.frames();
    assert.equal(f.length, 1);
    assert.equal(f[0].opcode, 8);
    assert.equal(f[0].payload.readUInt16BE(0), 4000);
    assert.equal(closes(), 1);
  });

  it("does not write to a destroyed socket", (t) => {
    const { c, socket } = conn(t);
    socket.destroyed = true;
    c.send("x");
    assert.equal(socket.out.length, 0);
    c.close();
  });

  it("pings every 25 s to keep proxies from dropping it, and stops after close", (t) => {
    const { c, socket } = conn(t);
    t.mock.timers.tick(25_000);
    t.mock.timers.tick(25_000);
    assert.deepEqual(socket.frames().map((f) => [f.opcode, f.payload.length]), [
      [9, 0],
      [9, 0],
    ]);
    c.close();
    t.mock.timers.tick(100_000);
    assert.equal(socket.frames().filter((f) => f.opcode === 9).length, 2);
  });
});
