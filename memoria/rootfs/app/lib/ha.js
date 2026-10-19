// Connection to Home Assistant Core's websocket API (through the Supervisor
// proxy when running as an app). Reconnects forever and re-creates
// subscriptions after each reconnect.
import { EventEmitter } from "node:events";

export class HAClient extends EventEmitter {
  constructor(url, token, log) {
    super();
    this.url = url;
    this.token = token;
    this.log = log;
    this.ws = null;
    this.ready = false;
    this.nextId = 1;
    this.pending = new Map(); // id -> {resolve, reject, timer}
    this.subs = new Set(); // active subscription records
    this.subsById = new Map(); // upstream id -> record
    this.waiters = [];
    this.backoff = 1000;
    this.stopped = false;
  }

  start() {
    if (typeof WebSocket !== "function") {
      throw new Error("This Node.js has no global WebSocket (needs Node 22.4+)");
    }
    this._connect();
  }

  stop() {
    this.stopped = true;
    if (this.ws) this.ws.close();
  }

  _connect() {
    if (this.stopped) return;
    let ws;
    try {
      ws = new WebSocket(this.url);
    } catch (err) {
      this.log.warn(`Could not open ${this.url}: ${err.message}`);
      this._scheduleReconnect();
      return;
    }
    this.ws = ws;
    ws.onmessage = (ev) => {
      let msg;
      try {
        msg = JSON.parse(typeof ev.data === "string" ? ev.data : Buffer.from(ev.data).toString());
      } catch (e) {
        return;
      }
      const list = Array.isArray(msg) ? msg : [msg];
      for (const m of list) this._onMessage(m);
    };
    ws.onclose = () => this._onClose();
    ws.onerror = () => {};
  }

  _onMessage(msg) {
    switch (msg.type) {
      case "auth_required":
        this.ws.send(JSON.stringify({ type: "auth", access_token: this.token }));
        return;
      case "auth_ok":
        this.ready = true;
        this.backoff = 1000;
        this.log.info(`Connected to Home Assistant ${msg.ha_version || ""}`.trim());
        for (const sub of this.subs) this._startSub(sub);
        for (const w of this.waiters.splice(0)) w();
        this.emit("ready");
        return;
      case "auth_invalid":
        this.log.error(`Home Assistant rejected the token: ${msg.message || ""}`);
        this.ws.close();
        return;
      case "result": {
        const p = this.pending.get(msg.id);
        if (!p) return;
        this.pending.delete(msg.id);
        clearTimeout(p.timer);
        if (msg.success) p.resolve(msg.result);
        else {
          const err = new Error((msg.error && msg.error.message) || "Request failed");
          err.code = msg.error && msg.error.code;
          p.reject(err);
        }
        return;
      }
      case "event": {
        const sub = this.subsById.get(msg.id);
        if (sub) sub.onEvent(msg.event);
        return;
      }
      default:
    }
  }

  _onClose() {
    const wasReady = this.ready;
    this.ready = false;
    this.ws = null;
    this.subsById.clear();
    for (const [, p] of this.pending) {
      clearTimeout(p.timer);
      const err = new Error("Lost connection to Home Assistant");
      err.code = "disconnected";
      p.reject(err);
    }
    this.pending.clear();
    if (wasReady) {
      this.log.warn("Disconnected from Home Assistant, retrying…");
      this.emit("disconnected");
    }
    this._scheduleReconnect();
  }

  _scheduleReconnect() {
    if (this.stopped) return;
    setTimeout(() => this._connect(), this.backoff);
    this.backoff = Math.min(this.backoff * 2, 30000);
  }

  whenReady() {
    if (this.ready) return Promise.resolve();
    return new Promise((resolve) => this.waiters.push(resolve));
  }

  _raw(msg, timeout = 30000) {
    const id = this.nextId++;
    return {
      id,
      promise: new Promise((resolve, reject) => {
        const timer = setTimeout(() => {
          this.pending.delete(id);
          const err = new Error("Home Assistant did not answer in time");
          err.code = "timeout";
          reject(err);
        }, timeout);
        this.pending.set(id, { resolve, reject, timer });
        this.ws.send(JSON.stringify({ ...msg, id }));
      }),
    };
  }

  /** Send a command and wait for its result. Waits for the connection if needed. */
  async send(msg, timeout) {
    await this.whenReady();
    return this._raw(msg, timeout).promise;
  }

  /** Same as send() but fails immediately when disconnected. */
  sendNow(msg, timeout) {
    if (!this.ready) {
      const err = new Error("Not connected to Home Assistant");
      err.code = "disconnected";
      return Promise.reject(err);
    }
    return this._raw(msg, timeout).promise;
  }

  /**
   * Subscribe; survives reconnects. Returns {ready: Promise, unsubscribe()}.
   * onError is called when Home Assistant refuses the subscription.
   */
  subscribe(msg, onEvent, onError) {
    const sub = { msg, onEvent, onError, id: null, active: true };
    let resolveReady;
    let rejectReady;
    sub.ready = new Promise((res, rej) => {
      resolveReady = res;
      rejectReady = rej;
    });
    sub.ready.catch(() => {});
    sub.settle = { resolveReady, rejectReady };
    this.subs.add(sub);
    if (this.ready) this._startSub(sub);
    return {
      ready: sub.ready,
      unsubscribe: () => {
        if (!sub.active) return;
        sub.active = false;
        this.subs.delete(sub);
        if (sub.id != null) {
          this.subsById.delete(sub.id);
          if (this.ready) {
            this.sendNow({ type: "unsubscribe_events", subscription: sub.id }).catch(() => {});
          }
        }
      },
    };
  }

  _startSub(sub) {
    if (!sub.active || !this.ready) return;
    const { id, promise } = this._raw(sub.msg);
    sub.id = id;
    this.subsById.set(id, sub);
    promise.then(
      () => sub.settle.resolveReady(),
      (err) => {
        if (err.code === "disconnected") return; // retried on reconnect
        this.subs.delete(sub);
        this.subsById.delete(id);
        sub.active = false;
        sub.settle.rejectReady(err);
        if (sub.onError) sub.onError(err);
      },
    );
  }
}
