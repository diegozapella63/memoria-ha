// A tiny fake of Home Assistant, enough to develop and test MemorIA without a
// real Home Assistant: the websocket API (AI tasks) and the REST call that sets
// sensor.memoria_agora.
//   node dev/fake-ha.mjs
//   (ws://127.0.0.1:8123/api/websocket and http://127.0.0.1:8123/api, token "dev")
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { acceptUpgrade } from "../memoria/rootfs/app/lib/ws.js";

const PORT = Number(process.env.FAKE_HA_PORT || 8123);
const TOKEN = process.env.FAKE_HA_TOKEN || "dev";
// The app writes photos here (same folder Home Assistant sees as /media).
const MEDIA_DIR = process.env.FAKE_MEDIA_DIR || process.env.MEDIA_DIR || "./.data/media";
const WITH_AI = process.env.FAKE_HA_NO_AI !== "1";
const states = new Map(); // entity_id -> state set through the REST API
const aiCalls = [];

function fail(code, message) {
  const e = new Error(message);
  e.code = code;
  throw e;
}

// Pretend AI: checks the attachments exist where Home Assistant would look for them.
function fakeAI(msg) {
  if (!WITH_AI) fail("not_found", "Service not found");
  if (!msg.return_response) fail("service_validation_error", "return_response required");
  const d = msg.service_data || {};
  if (!d.structure || !d.structure.text) fail("service_validation_error", "structure missing");
  const files = (d.attachments || []).map((a) => {
    const prefix = "media-source://media_source/local/";
    if (!a.media_content_id.startsWith(prefix)) fail("service_validation_error", "bad media id");
    const p = path.join(MEDIA_DIR, a.media_content_id.slice(prefix.length));
    if (!fs.existsSync(p)) fail("service_validation_error", `attachment not found: ${p}`);
    return { path: p, bytes: fs.statSync(p).size, type: a.media_content_type };
  });
  aiCalls.push({ entity_id: d.entity_id, files });
  console.log("fake AI call", JSON.stringify({ entity_id: d.entity_id, files }));
  let text;
  if (files.length) {
    // Alternate answers so "more photos" can be tested.
    const photoCalls = aiCalls.filter((c) => c.files.length).length;
    text = photoCalls % 2 ? "Receita do bolo de cenoura\n\n3 cenouras\n4 ovos\n1 xícara de óleo" : "Modo de preparo\n\nBater tudo e assar por 40 minutos.";
  } else {
    const m = (d.instructions || "").split('"""')[1] || "";
    const lines = m.split("\n").map((l) => l.replace(/^\[[^\]]*\]\s*[^:]+:\s*/, "").trim()).filter(Boolean);
    text = lines.length > 1 ? `${lines[0]}\n\n${lines.slice(1).join("\n")}` : lines.join("\n");
  }
  return { context: { id: "ctx" }, response: { conversation_id: "c1", data: { text } } };
}

class Conn {
  constructor(ws) {
    this.ws = ws;
    this.auth = false;
    ws.on("message", (t) => this.onMessage(JSON.parse(t)));
    this.send({ type: "auth_required", ha_version: "2026.10.2" });
  }
  send(o) {
    this.ws.send(JSON.stringify(o));
  }
  onMessage(msg) {
    if (!this.auth) {
      if (msg.type === "auth" && msg.access_token === TOKEN) {
        this.auth = true;
        return this.send({ type: "auth_ok", ha_version: "2026.10.2" });
      }
      this.send({ type: "auth_invalid", message: "Invalid access token" });
      return this.ws.close();
    }
    const ok = (result = null) => this.send({ id: msg.id, type: "result", success: true, result });
    try {
      switch (msg.type) {
        case "ping":
          return this.send({ id: msg.id, type: "pong" });
        case "get_states":
          return ok([
            { entity_id: "light.sala", state: "on", attributes: {} },
            ...(WITH_AI ? [{ entity_id: "ai_task.google_ai_task", state: "unknown", attributes: { supported_features: 3 } }] : []),
            ...states.values(),
          ]);
        case "ai_task/preferences/get":
          return ok({ gen_data_entity_id: WITH_AI ? "ai_task.google_ai_task" : null });
        case "get_config":
          return ok({ time_zone: process.env.FAKE_HA_TZ || "America/Sao_Paulo", version: "2026.10.2" });
        case "call_service":
          if (msg.domain === "ai_task") return ok(fakeAI(msg));
          fail("not_found", "Service not found");
          break;
        default:
          fail("unknown_command", `Unknown command ${msg.type}`);
      }
    } catch (err) {
      this.send({ id: msg.id, type: "result", success: false, error: { code: err.code || "error", message: err.message } });
    }
  }
}

const server = http.createServer((req, res) => {
  const m = req.url.match(/^\/api\/states\/([a-z_]+\.[a-z0-9_]+)$/);
  if (!m) return res.writeHead(404).end();
  if (req.headers.authorization !== `Bearer ${TOKEN}`) return res.writeHead(401).end("401: Unauthorized");
  if (req.method === "GET") {
    const st = states.get(m[1]);
    res.writeHead(st ? 200 : 404, { "content-type": "application/json" });
    return res.end(JSON.stringify(st || { message: "Entity not found." }));
  }
  if (req.method !== "POST") return res.writeHead(405).end();
  const chunks = [];
  req.on("data", (c) => chunks.push(c));
  req.on("end", () => {
    let body;
    try {
      body = JSON.parse(Buffer.concat(chunks).toString("utf8"));
    } catch (e) {
      return res.writeHead(400).end("Invalid JSON");
    }
    if (typeof body.state !== "string" && typeof body.state !== "number") return res.writeHead(400).end("No state specified.");
    const existed = states.has(m[1]);
    const st = { entity_id: m[1], state: String(body.state), attributes: body.attributes || {}, last_changed: new Date().toISOString() };
    states.set(m[1], st);
    console.log("state set", m[1], "=", st.state);
    res.writeHead(existed ? 200 : 201, { "content-type": "application/json" });
    res.end(JSON.stringify(st));
  });
});
server.on("upgrade", (req, socket, head) => {
  const ws = acceptUpgrade(req, socket, head);
  if (ws) new Conn(ws);
});
server.listen(PORT, () => console.log(`fake Home Assistant on http://127.0.0.1:${PORT} (token "${TOKEN}")`));
