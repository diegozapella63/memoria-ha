// MemorIA app server.
// - Serves the notebook UI through Home Assistant ingress.
// - Keeps notebooks ("blocos") and pages in /data/memoria.json and pushes every
//   change live to all open screens.
// - Reads pasted messages and photos with the AI configured in Home Assistant.
// - Publishes sensor.memoria_agora with what is "on" right now.
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { acceptUpgrade } from "./lib/ws.js";
import { HAClient } from "./lib/ha.js";
import { Store } from "./lib/store.js";
import { AI } from "./lib/ai.js";
import { Sensor } from "./lib/sensor.js";

const VERSION = "1.1.0";
const HERE = path.dirname(fileURLToPath(import.meta.url));
const WWW = path.join(HERE, "www");
const DEV = process.env.MEMORIA_DEV === "1";
const PORT = Number(process.env.PORT || 8099);
const HA_URL = process.env.HA_WS_URL || "ws://supervisor/core/websocket";
const HA_REST = process.env.HA_REST_URL || "http://supervisor/core/api";
const TOKEN = process.env.SUPERVISOR_TOKEN || process.env.HA_TOKEN || "";
const DATA_DIR = process.env.DATA_DIR || "/data";
const MEDIA_DIR = process.env.MEDIA_DIR || "/media";
const INGRESS_IPS = new Set(["172.30.32.2"]);
const MAX_UPLOAD = 30 * 1024 * 1024;

const stamp = () => new Date().toISOString().replace("T", " ").slice(0, 19);
const log = {
  info: (m) => console.log(`${stamp()} INFO ${m}`),
  warn: (m) => console.warn(`${stamp()} WARNING ${m}`),
  error: (m) => console.error(`${stamp()} ERROR ${m}`),
};
if (!TOKEN) log.error("Sem SUPERVISOR_TOKEN. O homeassistant_api está ligado no app?");

const store = new Store(DATA_DIR, log);
const ha = new HAClient(HA_URL, TOKEN, log);
const ai = new AI({ ha, log, mediaDir: MEDIA_DIR, selected: () => store.data.app.ai_entity || "" });
const sensor = new Sensor({ store, log, restUrl: HA_REST, token: TOKEN, enabled: () => store.data.app.sensor !== false });
const watchers = new Set(); // {session, id}

function broadcast(event) {
  for (const w of watchers) w.session.event(w.id, event);
  sensor.changed();
}

ha.on("ready", async () => {
  try {
    const config = await ha.send({ type: "get_config" });
    if (config && config.time_zone && process.env.TZ !== config.time_zone) {
      process.env.TZ = config.time_zone;
      log.info(`Fuso horário: ${config.time_zone}`);
    }
  } catch (err) {
    log.warn(`get_config falhou: ${err.message}`);
  }
  sensor.publish(true);
});

// ------------------------------------------------------------------ browser side

class Session {
  constructor(ws, headers) {
    this.ws = ws;
    this.subs = new Set();
    this.user = { name: headers["x-remote-user-display-name"] || headers["x-remote-user-name"] || "" };
    ws.on("message", (text) => this.onMessage(text));
    ws.on("close", () => {
      for (const w of [...watchers]) if (w.session === this) watchers.delete(w);
    });
  }

  send(obj) {
    this.ws.send(JSON.stringify(obj));
  }
  result(id, result = null) {
    this.send({ id, type: "result", success: true, result });
  }
  error(id, code, message, extra) {
    this.send({ id, type: "result", success: false, error: { code, message, ...(extra || {}) } });
  }
  event(id, event) {
    this.send({ id, type: "event", event });
  }

  async onMessage(text) {
    let msg;
    try {
      msg = JSON.parse(text);
    } catch (e) {
      return;
    }
    const { id, type } = msg || {};
    if (!Number.isInteger(id)) return;
    try {
      await this.handle(id, type, msg);
    } catch (err) {
      this.error(id, err.code || "failed", err.message || String(err), err.page ? { page: err.page } : null);
    }
  }

  async handle(id, type, msg) {
    switch (type) {
      case "ping":
        return this.send({ id, type: "pong" });

      case "memoria/bootstrap": {
        const aiStatus = await ai.status().catch((err) => ({ ready: false, images: false, entities: [], reason: err.message }));
        return this.result(id, { version: VERSION, user: this.user, ai: aiStatus, data: store.data });
      }

      case "memoria/ai/status": {
        return this.result(id, await ai.status());
      }

      case "memoria/subscribe": {
        const w = { session: this, id };
        watchers.add(w);
        return this.result(id);
      }

      case "unsubscribe_events": {
        for (const w of [...watchers]) if (w.session === this && w.id === msg.subscription) watchers.delete(w);
        return this.result(id);
      }

      case "memoria/page/save": {
        const page = store.savePage(msg.page);
        this.result(id, page);
        return broadcast({ kind: "page", page });
      }

      case "memoria/page/delete": {
        const pageId = String(msg.page_id || "");
        if (store.deletePage(pageId)) broadcast({ kind: "page_deleted", id: pageId });
        return this.result(id);
      }

      case "memoria/block/save": {
        const block = store.saveBlock(msg.block);
        this.result(id, block);
        return broadcast({ kind: "block", block });
      }

      case "memoria/block/delete": {
        const blockId = String(msg.block_id || "");
        const pages = store.deleteBlock(blockId);
        this.result(id, { pages });
        return broadcast({ kind: "block_deleted", id: blockId, pages });
      }

      case "memoria/settings/save": {
        const settings = store.saveSettings({ periods: msg.periods, app: msg.app });
        this.result(id, settings);
        return broadcast({ kind: "settings", ...settings });
      }

      default:
        return this.error(id, "unknown_command", `Comando desconhecido: ${type}`);
    }
  }
}

// ------------------------------------------------------------------ HTTP

const FILES = {
  "/": ["index.html", "text/html; charset=utf-8"],
  "/index.html": ["index.html", "text/html; charset=utf-8"],
  "/memoria.js": ["memoria.js", "text/javascript; charset=utf-8"],
};

function allowed(req) {
  if (DEV) return true;
  const ip = (req.socket.remoteAddress || "").replace(/^::ffff:/, "");
  return INGRESS_IPS.has(ip);
}

function sendJson(res, status, obj) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" });
  res.end(JSON.stringify(obj));
}

/** POST /api/extract {text?, images?: [{data(base64), mime}]} -> {text, provider} */
function handleExtract(req, res) {
  const chunks = [];
  let size = 0;
  let aborted = false;
  req.on("data", (c) => {
    size += c.length;
    if (size > MAX_UPLOAD) {
      aborted = true;
      sendJson(res, 413, { error: "Arquivo grande demais" });
      req.destroy();
      return;
    }
    chunks.push(c);
  });
  req.on("end", async () => {
    if (aborted) return;
    let body;
    try {
      body = JSON.parse(Buffer.concat(chunks).toString("utf8"));
    } catch (e) {
      return sendJson(res, 400, { error: "JSON inválido" });
    }
    const started = Date.now();
    try {
      const out = await ai.extract({ text: body.text, images: body.images });
      log.info(`Leitura por IA via ${out.provider}: ${out.text.length} caracteres em ${((Date.now() - started) / 1000).toFixed(1)}s`);
      sendJson(res, 200, out);
    } catch (err) {
      log.warn(`Leitura por IA falhou: ${err.message}`);
      const setup = ["no_ai", "no_vision", "gone", "unavailable", "no_media"].includes(err.code);
      sendJson(res, setup ? 409 : 502, { error: err.message, code: err.code || "failed" });
    }
  });
}

const server = http.createServer((req, res) => {
  if (!allowed(req)) {
    res.writeHead(403).end("Forbidden");
    return;
  }
  const url = new URL(req.url, "http://x");
  if (url.pathname === "/api/extract" && req.method === "POST") return handleExtract(req, res);
  const font = url.pathname.match(/^\/fonts\/([a-z0-9-]+\.woff2)$/);
  const file = font ? [`fonts/${font[1]}`, "font/woff2", true] : FILES[url.pathname];
  if (!file || (req.method !== "GET" && req.method !== "HEAD")) {
    res.writeHead(404).end("Not found");
    return;
  }
  const full = path.join(WWW, file[0]);
  fs.stat(full, (err, st) => {
    if (err) {
      res.writeHead(404).end("Not found");
      return;
    }
    const etag = `"${st.size.toString(16)}-${st.mtimeMs.toString(16)}"`;
    const headers = {
      "Content-Type": file[1],
      "Cache-Control": file[2] ? "public, max-age=604800" : "no-cache",
      ETag: etag,
      "X-Content-Type-Options": "nosniff",
    };
    if (req.headers["if-none-match"] === etag) {
      res.writeHead(304, headers).end();
      return;
    }
    res.writeHead(200, { ...headers, "Content-Length": st.size });
    if (req.method === "HEAD") return res.end();
    fs.createReadStream(full).pipe(res);
  });
});

server.on("upgrade", (req, socket, head) => {
  const pathname = new URL(req.url, "http://x").pathname;
  if (!allowed(req) || pathname !== "/ws") {
    socket.end("HTTP/1.1 403 Forbidden\r\nConnection: close\r\n\r\n");
    return;
  }
  const ws = acceptUpgrade(req, socket, head);
  if (ws) new Session(ws, req.headers);
});

server.listen(PORT, () => log.info(`MemorIA ${VERSION} ouvindo na porta ${PORT}${DEV ? " (modo dev)" : ""}`));
ha.start();
sensor.start();

const shutdown = () => {
  log.info("Encerrando…");
  store.flush();
  ha.stop();
  server.close();
  setTimeout(() => process.exit(0), 300);
};
process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
