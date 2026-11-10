import { describe, it, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";
import { HAClient } from "../memoria/rootfs/app/lib/ha.js";
import { fakeLog, flushPromises } from "./_helpers.mjs";

/** Stands in for the global WebSocket (the connection to Home Assistant). */
class FakeWS {
  static all = [];
  static fail = false;
  constructor(url) {
    if (FakeWS.fail) throw new Error("bad url");
    this.url = url;
    this.sent = [];
    this.closed = false;
    FakeWS.all.push(this);
  }
  send(text) {
    this.sent.push(JSON.parse(text));
  }
  close() {
    if (this.closed) return;
    this.closed = true;
    this.onclose && this.onclose();
  }
  receive(msg) {
    this.onmessage({ data: typeof msg === "string" || Buffer.isBuffer(msg) ? msg : JSON.stringify(msg) });
  }
  last(type) {
    return [...this.sent].reverse().find((m) => !type || m.type === type);
  }
}
const ws = () => FakeWS.all.at(-1);

let saved;
beforeEach(() => {
  saved = globalThis.WebSocket;
  globalThis.WebSocket = FakeWS;
  FakeWS.all = [];
  FakeWS.fail = false;
});
afterEach(() => {
  globalThis.WebSocket = saved;
});

/** A client connected and authenticated (unless auth: false). */
function client(t, { auth = true } = {}) {
  t.mock.timers.enable({ apis: ["setTimeout"] });
  const log = fakeLog();
  const ha = new HAClient("ws://ha/api/websocket", "secret", log);
  const events = [];
  ha.on("ready", () => events.push("ready"));
  ha.on("disconnected", () => events.push("disconnected"));
  ha.start();
  if (auth) {
    ws().receive({ type: "auth_required" });
    ws().receive({ type: "auth_ok", ha_version: "2026.10.2" });
  }
  return { ha, log, events };
}

describe("HAClient: connecting", () => {
  it("needs a global WebSocket", () => {
    globalThis.WebSocket = undefined;
    assert.throws(() => new HAClient("ws://x", "t", fakeLog()).start(), /global WebSocket/);
  });

  it("authenticates with the token and becomes ready", (t) => {
    const { ha, log, events } = client(t, { auth: false });
    assert.equal(ws().url, "ws://ha/api/websocket");
    ws().receive({ type: "auth_required" });
    assert.deepEqual(ws().sent, [{ type: "auth", access_token: "secret" }]);
    assert.equal(ha.ready, false);
    ws().receive({ type: "auth_ok", ha_version: "2026.10.2" });
    assert.equal(ha.ready, true);
    assert.deepEqual(events, ["ready"]);
    assert.match(log.of("info")[0], /Connected to Home Assistant 2026\.10\.2/);
  });

  it("whenReady waits for the authentication", async (t) => {
    const { ha } = client(t, { auth: false });
    let done = false;
    ha.whenReady().then(() => (done = true));
    await flushPromises();
    assert.equal(done, false);
    ws().receive({ type: "auth_ok" });
    await flushPromises();
    assert.equal(done, true);
    await ha.whenReady();
  });

  it("a rejected token is logged and the connection closed (then retried)", (t) => {
    const { ha, log } = client(t, { auth: false });
    ws().receive({ type: "auth_invalid", message: "Invalid access token" });
    assert.match(log.of("error")[0], /rejected the token: Invalid access token/);
    assert.equal(ws().closed, true);
    assert.equal(ha.ready, false);
    t.mock.timers.tick(1000);
    assert.equal(FakeWS.all.length, 2);
  });

  it("reconnects forever with a growing wait (1 s, 2 s, 4 s … up to 30 s), back to 1 s after success", (t) => {
    const { ha, events } = client(t);
    ws().close();
    assert.deepEqual(events, ["ready", "disconnected"]);
    const waits = [];
    for (let i = 0; i < 7; i++) {
      const before = FakeWS.all.length;
      let waited = 0;
      while (FakeWS.all.length === before) {
        t.mock.timers.tick(500);
        waited += 500;
      }
      waits.push(waited);
      ws().close();
    }
    assert.deepEqual(waits, [1000, 2000, 4000, 8000, 16000, 30000, 30000]);
    assert.deepEqual(events, ["ready", "disconnected"], "only a ready connection says it was lost");
    t.mock.timers.tick(30000);
    ws().receive({ type: "auth_ok" });
    assert.equal(ha.backoff, 1000);
  });

  it("a connection refused with only 'error' (Node's WebSocket sends no 'close') is retried too, once per failure", (t) => {
    const { ha, events } = client(t);
    ws().close();
    t.mock.timers.tick(1000);
    assert.equal(FakeWS.all.length, 2, "first try");
    // Home Assistant still restarting: refused, and Node's WebSocket only says "error"
    ws().onerror({ type: "error" });
    t.mock.timers.tick(2000);
    assert.equal(FakeWS.all.length, 3, "tried again after 2 s");
    // the browser way: error, then close: still one new try, not two
    ws().onerror({ type: "error" });
    ws().close();
    t.mock.timers.tick(8000);
    assert.equal(FakeWS.all.length, 4, "one try for one failure");
    ws().receive({ type: "auth_required" });
    ws().receive({ type: "auth_ok" });
    assert.equal(ha.ready, true);
    assert.deepEqual(events, ["ready", "disconnected", "ready"]);
  });

  it("stop() closes and does not reconnect", (t) => {
    const { ha } = client(t);
    ha.stop();
    t.mock.timers.tick(60_000);
    assert.equal(FakeWS.all.length, 1);
  });

  it("a WebSocket that cannot even be created is retried", (t) => {
    t.mock.timers.enable({ apis: ["setTimeout"] });
    FakeWS.fail = true;
    const log = fakeLog();
    const ha = new HAClient("ws://x", "t", log);
    ha.start();
    assert.match(log.of("warn")[0], /Could not open ws:\/\/x: bad url/);
    FakeWS.fail = false;
    t.mock.timers.tick(1000);
    assert.equal(FakeWS.all.length, 1);
    ha.stop();
  });
});

describe("HAClient: commands", () => {
  it("send() numbers each command and resolves with its result", async (t) => {
    const { ha } = client(t);
    const a = ha.send({ type: "get_states" });
    const b = ha.send({ type: "get_config" });
    await flushPromises();
    const [m1, m2] = ws().sent.slice(1);
    assert.deepEqual(m1, { type: "get_states", id: 1 });
    assert.deepEqual(m2, { type: "get_config", id: 2 });
    ws().receive({ id: 2, type: "result", success: true, result: { tz: "x" } });
    ws().receive({ id: 1, type: "result", success: true, result: [1, 2] });
    assert.deepEqual(await a, [1, 2]);
    assert.deepEqual(await b, { tz: "x" });
  });

  it("a failed command rejects with Home Assistant's message and code", async (t) => {
    const { ha } = client(t);
    const p = ha.send({ type: "call_service" });
    await flushPromises();
    ws().receive({ id: 1, type: "result", success: false, error: { code: "service_validation_error", message: "Item not found" } });
    await assert.rejects(p, { message: "Item not found", code: "service_validation_error" });
    const q = ha.send({ type: "x" });
    await flushPromises();
    ws().receive({ id: 2, type: "result", success: false });
    await assert.rejects(q, { message: "Request failed" });
  });

  it("reads batched messages, binary frames, and ignores junk and unknown ids", async (t) => {
    const { ha } = client(t);
    const a = ha.send({ type: "a" });
    const b = ha.send({ type: "b" });
    await flushPromises();
    ws().receive("not json");
    ws().receive({ id: 99, type: "result", success: true, result: "nobody" });
    ws().receive({ type: "pong" });
    ws().receive([
      { id: 1, type: "result", success: true, result: "A" },
      { id: 2, type: "result", success: true, result: "B" },
    ]);
    assert.deepEqual([await a, await b], ["A", "B"]);
    const c = ha.send({ type: "c" });
    await flushPromises();
    ws().receive(Buffer.from(JSON.stringify({ id: 3, type: "result", success: true, result: "C" })));
    assert.equal(await c, "C");
  });

  it("send() waits for the connection; sendNow() fails at once", async (t) => {
    const { ha } = client(t, { auth: false });
    const p = ha.send({ type: "get_states" });
    await assert.rejects(ha.sendNow({ type: "x" }), { code: "disconnected" });
    await flushPromises();
    assert.equal(ws().sent.length, 0);
    ws().receive({ type: "auth_ok" });
    await flushPromises();
    assert.equal(ws().last().type, "get_states");
    ws().receive({ id: ws().last().id, type: "result", success: true, result: "ok" });
    assert.equal(await p, "ok");
  });

  it("times out (30 s by default, or the given time)", async (t) => {
    const { ha } = client(t);
    const p = ha.send({ type: "slow" });
    const q = ha.send({ type: "slower" }, 120_000);
    await flushPromises();
    t.mock.timers.tick(30_000);
    await assert.rejects(p, { code: "timeout", message: /did not answer in time/ });
    t.mock.timers.tick(89_999);
    assert.equal(ha.pending.size, 1);
    t.mock.timers.tick(1);
    await assert.rejects(q, { code: "timeout" });
    assert.equal(ha.pending.size, 0);
  });

  it("a lost connection fails what was waiting, with code 'disconnected'", async (t) => {
    const { ha } = client(t);
    const p = ha.send({ type: "x" });
    await flushPromises();
    ws().close();
    await assert.rejects(p, { code: "disconnected" });
    assert.equal(ha.pending.size, 0);
  });
});

describe("HAClient: subscriptions", () => {
  it("subscribes, delivers its events, and survives a reconnect", async (t) => {
    const { ha } = client(t);
    const got = [];
    const sub = ha.subscribe({ type: "subscribe_events", event_type: "state_changed" }, (e) => got.push(e));
    const first = ws().last();
    assert.deepEqual(first, { type: "subscribe_events", event_type: "state_changed", id: 1 });
    ws().receive({ id: 1, type: "result", success: true });
    await sub.ready;
    ws().receive({ id: 1, type: "event", event: "e1" });
    ws().receive({ id: 2, type: "event", event: "not mine" });
    ws().close();
    t.mock.timers.tick(1000);
    ws().receive({ type: "auth_ok" });
    const again = ws().last();
    assert.equal(again.type, "subscribe_events");
    assert.notEqual(again.id, 1);
    ws().receive({ id: 1, type: "event", event: "old id" });
    ws().receive({ id: again.id, type: "event", event: "e2" });
    assert.deepEqual(got, ["e1", "e2"]);
  });

  it("a subscription made before the connection starts when it is ready", async (t) => {
    const { ha } = client(t, { auth: false });
    const got = [];
    ha.subscribe({ type: "todo/item/subscribe", entity_id: "todo.casa" }, (e) => got.push(e));
    assert.equal(ws().sent.length, 0);
    ws().receive({ type: "auth_ok" });
    const m = ws().last();
    assert.equal(m.type, "todo/item/subscribe");
    ws().receive({ id: m.id, type: "event", event: { items: [] } });
    assert.deepEqual(got, [{ items: [] }]);
  });

  it("a refused subscription calls onError, rejects ready, and is not tried again", async (t) => {
    const { ha } = client(t);
    const errors = [];
    const sub = ha.subscribe({ type: "todo/item/subscribe", entity_id: "todo.x" }, () => {}, (e) => errors.push(e.code));
    ws().receive({ id: ws().last().id, type: "result", success: false, error: { code: "invalid_entity_id", message: "not found" } });
    await assert.rejects(sub.ready, { code: "invalid_entity_id" });
    assert.deepEqual(errors, ["invalid_entity_id"]);
    assert.equal(ha.subs.size, 0);
    ws().close();
    t.mock.timers.tick(1000);
    ws().receive({ type: "auth_ok" });
    assert.equal(ws().sent.filter((m) => m.type === "todo/item/subscribe").length, 0);
  });

  it("unsubscribe stops the events, tells Home Assistant once, and is not re-created", async (t) => {
    const { ha } = client(t);
    const got = [];
    const sub = ha.subscribe({ type: "subscribe_events" }, (e) => got.push(e));
    const id = ws().last().id;
    sub.unsubscribe();
    sub.unsubscribe();
    assert.deepEqual(ws().sent.filter((m) => m.type === "unsubscribe_events").map((m) => m.subscription), [id]);
    ws().receive({ id, type: "event", event: "late" });
    assert.deepEqual(got, []);
    ws().close();
    t.mock.timers.tick(1000);
    ws().receive({ type: "auth_ok" });
    assert.equal(ws().sent.filter((m) => m.type === "subscribe_events").length, 0);
  });

  it("unsubscribing while disconnected sends nothing", (t) => {
    const { ha } = client(t);
    const sub = ha.subscribe({ type: "subscribe_events" }, () => {});
    ws().close();
    const n = FakeWS.all.length;
    sub.unsubscribe();
    assert.equal(FakeWS.all.length, n);
    assert.equal(ha.subs.size, 0);
  });
});
