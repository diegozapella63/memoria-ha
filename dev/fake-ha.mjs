// A tiny fake of Home Assistant, enough to develop and test MemorIA without a
// real Home Assistant: the websocket API (AI tasks, the Conversa, the voice assistants), the REST call that
// sets sensor.memoria_agora, the speech-to-text of Falar (the transcript is FAKE_STT_TEXT; FAKE_NO_STT=1:
// no speech-to-text) and the people of the house, Ana (user u-ana) and Beto (u-beto).
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
  // Conversa: answers the last thing the person said; "crie uma folha no BLOCO com TEXTO" and
  // "acrescente TEXTO na folha N do BLOCO" become actions
  if (/: conversa$/.test(d.task_name || "") && d.structure && d.structure.resposta) {
    aiCalls.push({ entity_id: d.entity_id, files: [], chat: d.instructions });
    if (process.env.FAKE_AI_CHAT_FAIL) fail("home_assistant_error", "IA fora do ar");
    const last = ((d.instructions || "").match(/Pessoa: (.*)$/) || [])[1] || "";
    console.log("fake AI chat", JSON.stringify({ entity_id: d.entity_id, last }));
    let m;
    const acoes = [];
    let resposta;
    if ((m = /crie uma folha no (.+?) com (.+)$/i.exec(last))) {
      acoes.push(`criar | ${m[1]} | ${m[2].replace(/;\s*/g, "\\n")}`);
      resposta = `Posso criar uma folha em ${m[1]}.`;
    } else if ((m = /acrescente (.+?) na folha (\d+) do (.+?)$/i.exec(last))) {
      acoes.push(`acrescentar | ${m[3]} | ${m[2]} | ${m[1]}`);
      resposta = `Posso acrescentar na folha ${m[2]} de ${m[3]}.`;
    } else {
      const tela = ((d.instructions || "").match(/A pessoa está na tela: (.*)\./) || [])[1] || "?";
      resposta = `Resposta de teste para "${last}" (tela: ${tela}).`;
    }
    return { context: { id: "ctx" }, response: { conversation_id: "c1", data: { resposta, acoes } } };
  }
  if (!d.structure || !d.structure.text) fail("service_validation_error", "structure missing");
  const files = (d.attachments || []).map((a) => {
    const prefix = "media-source://media_source/local/";
    if (!a.media_content_id.startsWith(prefix)) fail("service_validation_error", "bad media id");
    const p = path.join(MEDIA_DIR, a.media_content_id.slice(prefix.length));
    if (!fs.existsSync(p)) fail("service_validation_error", `attachment not found: ${p}`);
    return { path: p, bytes: fs.statSync(p).size, type: a.media_content_type };
  });
  if (files.length && d.entity_id === "ai_task.ollama_ai_task") fail("home_assistant_error", "This entity does not support attachments");
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
            // the people of the house (De quem é), invented; FAKE_NO_PEOPLE=1: none
            ...(process.env.FAKE_NO_PEOPLE
              ? []
              : [
                  { entity_id: "person.ana", state: "home", attributes: { friendly_name: "Ana", user_id: "u-ana" } },
                  { entity_id: "person.beto", state: "not_home", attributes: { friendly_name: "Beto", user_id: "u-beto" } },
                ]),
            ...(WITH_AI
              ? [
                  { entity_id: "ai_task.google_ai_task", state: "unknown", attributes: { friendly_name: "Google AI Task", supported_features: 3 } },
                  // A text-only AI (no attachments), like many local models.
                  { entity_id: "ai_task.ollama_ai_task", state: "unknown", attributes: { friendly_name: "Ollama AI Task", supported_features: 1 } },
                ]
              : []),
            ...(process.env.FAKE_NO_STT
              ? []
              : [
                  { entity_id: "stt.home_assistant_cloud", state: "unknown", attributes: { friendly_name: "Home Assistant Cloud" } },
                  { entity_id: "stt.faster_whisper", state: "unknown", attributes: { friendly_name: "faster-whisper" } },
                ]),
            ...states.values(),
          ]);
        case "assist_pipeline/pipeline/list":
          return ok(process.env.FAKE_NO_STT ? { pipelines: [], preferred_pipeline: null } : { pipelines: [{ id: "p1", name: "Home Assistant", language: "pt", stt_engine: "stt.home_assistant_cloud", stt_language: "pt-BR" }], preferred_pipeline: "p1" });
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
  // Falar: speech-to-text like Home Assistant's REST API
  const stt = req.url.match(/^\/api\/stt\/(stt\.[a-z0-9_]+)$/);
  if (stt && req.headers.authorization !== `Bearer ${TOKEN}`) return res.writeHead(401).end("401: Unauthorized");
  if (stt && req.method === "GET") {
    res.writeHead(200, { "content-type": "application/json" });
    return res.end(JSON.stringify({ languages: stt[1] === "stt.faster_whisper" ? ["en", "es", "pt"] : ["en-US", "pt-BR", "pt-PT"], formats: ["wav"], codecs: ["pcm"], sample_rates: [16000], bit_rates: [16], channels: [1] }));
  }
  if (stt && req.method === "POST") {
    let bytes = 0;
    req.on("data", (c) => (bytes += c.length));
    req.on("end", () => {
      // like the Supervisor's proxy: only "X-Speech-Content", spelled exactly like that, reaches Home Assistant
      const raw = req.rawHeaders;
      const at = raw.findIndex((h, i) => i % 2 === 0 && h === "X-Speech-Content");
      const head = at >= 0 ? String(raw[at + 1]) : "";
      console.log("stt", stt[1], bytes, head);
      if (!head) return res.writeHead(400).end("Missing X-Speech-Content header");
      const lang = stt[1] === "stt.faster_whisper" ? /language=pt(;|$)/ : /language=pt-BR/;
      if (!/format=wav/.test(head) || !/sample_rate=16000/.test(head) || !lang.test(head)) return res.writeHead(415).end("Unsupported");
      res.writeHead(200, { "content-type": "application/json" });
      res.end(JSON.stringify({ text: process.env.FAKE_STT_TEXT || "Lembrar de comprar pão, regar as plantas e ligar para a Ana às seis", result: "success" }));
    });
    return;
  }
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
