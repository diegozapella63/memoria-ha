// Minimal RFC 6455 WebSocket server (text frames, ping/pong, close).
// Zero dependencies so the app image only needs Node.js.
import crypto from "node:crypto";
import { EventEmitter } from "node:events";

const GUID = "258EAFA5-E914-47DA-95CA-C5AB0DC85B11";
const MAX_MESSAGE = 4 * 1024 * 1024;

/** Complete the handshake for an HTTP upgrade request. Returns a WsConnection or null. */
export function acceptUpgrade(req, socket, head) {
  const key = req.headers["sec-websocket-key"];
  const upgrade = (req.headers.upgrade || "").toLowerCase();
  if (upgrade !== "websocket" || !key || req.headers["sec-websocket-version"] !== "13") {
    socket.end("HTTP/1.1 400 Bad Request\r\nConnection: close\r\n\r\n");
    return null;
  }
  const accept = crypto.createHash("sha1").update(key + GUID).digest("base64");
  socket.write(
    "HTTP/1.1 101 Switching Protocols\r\n" +
      "Upgrade: websocket\r\n" +
      "Connection: Upgrade\r\n" +
      `Sec-WebSocket-Accept: ${accept}\r\n\r\n`,
  );
  return new WsConnection(socket, head);
}

export class WsConnection extends EventEmitter {
  constructor(socket, head) {
    super();
    this.socket = socket;
    this.buffer = head && head.length ? Buffer.from(head) : Buffer.alloc(0);
    this.fragments = [];
    this.fragmentSize = 0;
    this.closed = false;
    socket.setNoDelay(true);
    socket.setKeepAlive(true, 30000);
    socket.on("data", (chunk) => this._onData(chunk));
    socket.on("close", () => this._finish());
    socket.on("error", () => this._finish());
    if (this.buffer.length) setImmediate(() => this._onData(Buffer.alloc(0)));
    // Keep idle proxies (ingress) from dropping the connection.
    this.heartbeat = setInterval(() => this._frame(0x9, Buffer.alloc(0)), 25000);
  }

  _finish() {
    if (this.closed) return;
    this.closed = true;
    clearInterval(this.heartbeat);
    this.emit("close");
  }

  _onData(chunk) {
    if (chunk.length) this.buffer = this.buffer.length ? Buffer.concat([this.buffer, chunk]) : chunk;
    for (;;) {
      const buf = this.buffer;
      if (buf.length < 2) return;
      const fin = (buf[0] & 0x80) !== 0;
      const opcode = buf[0] & 0x0f;
      const masked = (buf[1] & 0x80) !== 0;
      let len = buf[1] & 0x7f;
      let offset = 2;
      if (len === 126) {
        if (buf.length < 4) return;
        len = buf.readUInt16BE(2);
        offset = 4;
      } else if (len === 127) {
        if (buf.length < 10) return;
        const big = buf.readBigUInt64BE(2);
        if (big > BigInt(MAX_MESSAGE)) return this.close(1009);
        len = Number(big);
        offset = 10;
      }
      if (!masked) return this.close(1002); // clients must mask
      if (len > MAX_MESSAGE) return this.close(1009);
      if (buf.length < offset + 4 + len) return;
      const mask = buf.subarray(offset, offset + 4);
      const payload = Buffer.from(buf.subarray(offset + 4, offset + 4 + len));
      for (let i = 0; i < payload.length; i++) payload[i] ^= mask[i & 3];
      this.buffer = buf.subarray(offset + 4 + len);
      this._onFrame(fin, opcode, payload);
      if (this.closed) return;
    }
  }

  _onFrame(fin, opcode, payload) {
    if (opcode === 0x8) {
      this._frame(0x8, payload.subarray(0, 2));
      this.socket.end();
      this._finish();
      return;
    }
    if (opcode === 0x9) return this._frame(0xa, payload);
    if (opcode === 0xa) return;
    if (opcode === 0x1 || opcode === 0x2 || opcode === 0x0) {
      this.fragments.push(payload);
      this.fragmentSize += payload.length;
      if (this.fragmentSize > MAX_MESSAGE) return this.close(1009);
      if (!fin) return;
      const data = Buffer.concat(this.fragments).toString("utf8");
      this.fragments = [];
      this.fragmentSize = 0;
      this.emit("message", data);
    }
  }

  _frame(opcode, payload) {
    if (this.closed || this.socket.destroyed) return;
    const len = payload.length;
    let header;
    if (len < 126) {
      header = Buffer.from([0x80 | opcode, len]);
    } else if (len < 65536) {
      header = Buffer.alloc(4);
      header[0] = 0x80 | opcode;
      header[1] = 126;
      header.writeUInt16BE(len, 2);
    } else {
      header = Buffer.alloc(10);
      header[0] = 0x80 | opcode;
      header[1] = 127;
      header.writeBigUInt64BE(BigInt(len), 2);
    }
    this.socket.write(Buffer.concat([header, payload]));
  }

  send(text) {
    this._frame(0x1, Buffer.from(text, "utf8"));
  }

  close(code = 1000) {
    if (this.closed) return;
    const b = Buffer.alloc(2);
    b.writeUInt16BE(code, 0);
    this._frame(0x8, b);
    this.socket.end();
    this._finish();
  }
}
