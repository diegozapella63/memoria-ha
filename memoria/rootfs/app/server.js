// MemorIA app server.
// - Serves the notebook UI through Home Assistant ingress.
// - Keeps notebooks ("blocos") and pages in /data/memoria.json and pushes every
//   change live to all open screens.
// - Reads pasted messages and photos with the AI configured in Home Assistant.
// - Falar (speech-to-text of Home Assistant) and the Conversa with the AI.
// - Publishes sensor.memoria_agora with what is "on" right now.
// - Exports, backups in share/memoria, imports and automatic versions.
// - Mais › Relatório: the blocks and their sheets as a page and as a PDF.
// - Integrações › CorrerIA: the tools (read and write the blocks) for the WhatsApp, the Claude and the Gemini.
// - De quem é: the people of the house (person.* of Home Assistant) and the person using each screen, whose Agora
//   shows only their blocks and everyone's.
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { acceptUpgrade } from "./lib/ws.js";
import { HAClient } from "./lib/ha.js";
import { Store } from "./lib/store.js";
import { AI } from "./lib/ai.js";
import { Voice, readRaw, MAX_VOICE_BYTES } from "./lib/voice.js";
import { Sensor } from "./lib/sensor.js";
import { AiUsage, resultOf } from "./lib/usage.js";
import { VERSION } from "./lib/version.js";
import { Backups, backupZip, toCSV, parseImport, listVersions, readVersion, fileStamp } from "./lib/data.js";
import { anotacoes, reportHtml, reportPdf, pdfName } from "./lib/report.js";
import { Correria, ROUTE as TOOLS_ROUTE } from "./lib/correria.js";
import { Integracao, ROUTE as NOW_ROUTE, trechos, clockOf } from "./lib/integracao.js";
import { listTools, callTool, ToolError, UnknownTool } from "./lib/ferramentas.js";
import { sameName } from "./lib/schedule.js";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const WWW = path.join(HERE, "www");
const DEV = process.env.MEMORIA_DEV === "1";
const PORT = Number(process.env.PORT || 8099);
const HA_URL = process.env.HA_WS_URL || "ws://supervisor/core/websocket";
const HA_REST = process.env.HA_REST_URL || "http://supervisor/core/api";
const TOKEN = process.env.SUPERVISOR_TOKEN || process.env.HA_TOKEN || "";
const DATA_DIR = process.env.DATA_DIR || "/data";
const MEDIA_DIR = process.env.MEDIA_DIR || "/media";
const SHARE_DIR = process.env.SHARE_DIR || "/share/memoria";
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
const voice = new Voice({ ha, rest: HA_REST, token: TOKEN, log, pick: () => store.data.app.voice_engine || "" });
// Mais › Configurações › Integrações › Usar IA: off, nothing goes to the AI
const aiOff = () => store.data.app.ai_off === true;
const offError = () => Object.assign(new Error("A IA está desligada em Mais › Configurações › Integrações."), { code: "ai_off" });
const sensor = new Sensor({ store, log, restUrl: HA_REST, token: TOKEN, enabled: () => store.data.app.sensor !== false });
// Uso da IA (1.17.0, like the other apps): the calls to ai_task counted here; sensor.memoria_ia_hoje only when turned on
const usage = new AiUsage({ dir: DATA_DIR, sensor: "sensor.memoria_ia_hoje", label: "MemorIA", rest: HA_REST, token: TOKEN, log, enabled: () => store.data.app.sensor_ia === true });
/** One call to the AI, for Uso da IA: kind (mensagem, fotos, conversa), characters in and out, images, since when. */
function countAi(kind, { entity = "", input = 0, output = 0, images = 0, started, err = null }) {
  usage.record({ kind, entity: entity || store.data.app.ai_entity || "", input, output, images, seconds: (Date.now() - started) / 1000, result: resultOf(err) });
}
const backups = new Backups({ dir: SHARE_DIR });
// Mais › Configurações › Integrações › CorrerIA (off unless turned on; it doesn't need Usar IA: the AI is the CorrerIA's,
// the Claude's or the Gemini's)
const correria = new Correria({ dataDir: DATA_DIR, shareDir: SHARE_DIR, port: PORT, version: VERSION, log });
const correriaOn = () => store.data.app.correria === true;
// the other apps of the family (the CronologIA): what holds now, always on, with the key of share/memoria/integracao.json
const integracao = new Integracao({ dataDir: DATA_DIR, shareDir: SHARE_DIR, port: PORT, version: VERSION, log });
const watchers = new Set(); // {session, id}

// De quem é: the people of the house (person.* in Home Assistant), [{id, name, user_id}] by name, kept for a minute
let peopleCache = { at: 0, list: null };
async function people(fresh = false) {
  if (!fresh && peopleCache.list && Date.now() - peopleCache.at < 60000) return peopleCache.list;
  // without Home Assistant right now: the last ones known (none: it fails, and the screen offers a name to write)
  if (!ha.ready && peopleCache.list) return peopleCache.list;
  const states = (await ha.sendNow({ type: "get_states" }, 15000)) || [];
  const list = states
    .filter((st) => /^person\.[a-z0-9_]+$/.test(st.entity_id || ""))
    .map((st) => ({ id: st.entity_id, name: String((st.attributes && st.attributes.friendly_name) || st.entity_id.slice(7)).slice(0, 80), user_id: (st.attributes && st.attributes.user_id) || null }))
    .sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));
  peopleCache = { at: Date.now(), list };
  return list;
}
const peopleSafe = (fresh) => people(fresh).catch(() => null);

/** The people for the screen: the names, and the person of this login ("": a login that is not a person of the house). */
async function peopleFor(user, fresh = false) {
  const list = (await peopleSafe(fresh)) || [];
  const me = user.id ? list.find((p) => p.user_id === user.id) : null;
  return { people: list.map((p) => p.name), person: me ? me.name : "" };
}

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
    this.user = {
      // MEMORIA_DEV_USER_ID: test hook (dev mode only) for the Home Assistant user behind ingress
      id: headers["x-remote-user-id"] || (DEV && process.env.MEMORIA_DEV_USER_ID) || "",
      name: headers["x-remote-user-display-name"] || headers["x-remote-user-name"] || "",
    };
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
        const [aiStatus, who] = await Promise.all([ai.status().catch((err) => ({ ready: false, images: false, entities: [], reason: err.message })), peopleFor(this.user)]);
        return this.result(id, { version: VERSION, user: { name: this.user.name, person: who.person }, people: who.people, ai: aiStatus, data: store.data, correria: { ultimo: correria.last } });
      }

      // De quem é (the block's sheet): the people of the house, fresh, and the person of this login
      case "memoria/people":
        return this.result(id, await peopleFor(this.user, true));

      case "memoria/ai/status": {
        return this.result(id, await ai.status());
      }

      case "memoria/voice/status":
        return this.result(id, await voice.status({ fresh: !!msg.fresh }));

      // Mais › Configurações › Integrações › Uso da IA
      case "memoria/usage":
        return this.result(id, usage.summary());

      // Conversa (the chat beside the microphone): one turn -> {reply, actions, provider}
      case "memoria/ai/chat": {
        if (aiOff()) throw offError();
        const started = Date.now();
        const input = JSON.stringify([msg.messages, msg.context]).length;
        let out;
        try {
          out = await ai.chat({ messages: msg.messages, context: msg.context });
        } catch (err) {
          if (err.code !== "invalid_format" && err.code !== "no_ai") countAi("conversa", { input, started, err });
          throw err;
        }
        countAi("conversa", { entity: out.entity, input, output: (out.reply || "").length + JSON.stringify(out.actions || []).length, started });
        log.info(`Conversa via ${out.provider}: ${out.actions.length} ações em ${((Date.now() - started) / 1000).toFixed(1)}s`);
        return this.result(id, out);
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

      // Marcar no Agora: the ticked lines of a sheet for one time of it (the text doesn't change)
      case "memoria/marks/save": {
        const pageId = String(msg.page_id || "");
        const marks = store.saveMarks(pageId, msg.at, msg.lines);
        this.result(id, marks);
        return broadcast({ kind: "marks", id: pageId, marks });
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

      case "memoria/category/save": {
        const category = store.saveCategory(msg.category);
        this.result(id, category);
        return broadcast({ kind: "category", category });
      }

      case "memoria/category/delete": {
        const catId = String(msg.category_id || "");
        const blocks = store.deleteCategory(catId);
        this.result(id, { blocks });
        return broadcast({ kind: "category_deleted", id: catId, blocks });
      }

      case "memoria/versions/list":
        return this.result(id, listVersions(store.versionsDir));

      case "memoria/versions/restore": {
        const raw = readVersion(store.versionsDir, String(msg.name || ""));
        replaced(store.replaceAll(raw, "antes-de-restaurar"), `versão ${msg.name}`);
        return this.result(id, counts());
      }

      case "memoria/backups/list":
        return this.result(id, backups.list());

      case "memoria/backups/create": {
        const out = backups.create(store.data, VERSION);
        log.info(`Backup criado em ${out.folder}/${out.name}`);
        return this.result(id, out);
      }

      case "memoria/backups/restore": {
        const raw = backups.read(String(msg.name || ""));
        replaced(store.replaceAll(raw, "antes-de-restaurar"), `backup ${msg.name}`);
        return this.result(id, counts());
      }

      case "memoria/data/erase": {
        replaced(store.erase(), "começar do zero");
        return this.result(id, counts());
      }

      case "memoria/settings/save": {
        if (msg.app && "voice_engine" in msg.app) voice.forget();
        const wasOn = correriaOn();
        const iaWas = store.data.app.sensor_ia === true;
        const settings = store.saveSettings({ periods: msg.periods, app: msg.app });
        if ((store.data.app.sensor_ia === true) !== iaWas) (iaWas ? usage.remove() : usage.publish()).catch(() => {});
        if (correriaOn() !== wasOn) {
          correria.publish(correriaOn());
          log.info(`CorrerIA ${correriaOn() ? "ligado" : "desligado"}`);
        }
        this.result(id, settings);
        return broadcast({ kind: "settings", ...settings });
      }

      default:
        return this.error(id, "unknown_command", `Comando desconhecido: ${type}`);
    }
  }
}

const counts = () => ({ blocks: store.data.blocks.length, pages: store.data.pages.length });

/** Everything changed at once (import, restore, erase): every screen reloads. */
function replaced(data, what) {
  log.info(`Dados trocados (${what}): ${data.blocks.length} blocos, ${data.pages.length} folhas`);
  broadcast({ kind: "reset", data });
}

// ------------------------------------------------------------------ HTTP

const FILES = {
  "/": ["index.html", "text/html; charset=utf-8"],
  "/index.html": ["index.html", "text/html; charset=utf-8"],
  "/memoria.js": ["memoria.js", "text/javascript; charset=utf-8"],
  "/selectsheet.js": ["selectsheet.js", "text/javascript; charset=utf-8"],
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
      if (aiOff()) throw offError();
      const images = Array.isArray(body.images) ? Math.min(6, body.images.length) : 0;
      const kind = images ? "fotos" : "mensagem";
      const input = typeof body.text === "string" ? body.text.length : 0;
      let out;
      try {
        out = await ai.extract({ text: body.text, images: body.images });
      } catch (err) {
        if (!["no_ai", "no_vision", "gone", "unavailable", "no_media", "ai_off"].includes(err.code)) countAi(kind, { input, images, started, err });
        throw err;
      }
      if (out.provider) countAi(kind, { entity: out.entity, input, output: out.text.length, images, started });
      log.info(`Leitura por IA via ${out.provider}: ${out.text.length} caracteres em ${((Date.now() - started) / 1000).toFixed(1)}s`);
      sendJson(res, 200, out);
    } catch (err) {
      log.warn(`Leitura por IA falhou: ${err.message}`);
      const setup = ["no_ai", "no_vision", "gone", "unavailable", "no_media", "ai_off"].includes(err.code);
      sendJson(res, setup ? 409 : 502, { error: err.message, code: err.code || "failed" });
    }
  });
}

/** POST /api/voice (raw PCM, 16 kHz, 16-bit, mono) -> {text, engine}: Falar, through the speech-to-text of Home Assistant */
async function handleVoice(req, res) {
  try {
    if (aiOff()) throw offError();
    const pcm = await readRaw(req, MAX_VOICE_BYTES);
    const started = Date.now();
    const out = await voice.text(pcm);
    log.info(`Falar via ${out.engine}: ${out.text.length} caracteres em ${((Date.now() - started) / 1000).toFixed(1)}s`);
    sendJson(res, 200, out);
  } catch (err) {
    log.warn(`Falar: ${err.message}`);
    const status = err.code === "too_big" ? 413 : ["invalid_format", "not_understood", "no_stt", "ai_off"].includes(err.code) ? 409 : 502;
    sendJson(res, status, { error: err.message, code: err.code || "failed" });
  }
}

/**
 * GET|POST /api/integracao/ferramentas: the CorrerIA (the WhatsApp, the Claude and the Gemini), with the key of
 * share/memoria/correria.json. GET lists the tools; POST {nome, argumentos, pessoa, cliente} runs one -> {texto}
 * (400 {erro}: a bad argument, saying what works; 404: no such tool). Every screen hears what changed.
 */
async function handleTools(req, res) {
  if (!correriaOn() || !correria.authorized(req.headers)) return sendJson(res, 401, { erro: "Chave inválida ou CorrerIA desligado no MemorIA." });
  if (req.method === "GET") return sendJson(res, 200, listTools());
  if (req.method !== "POST") return sendJson(res, 405, { erro: "Use GET ou POST." });
  let body;
  try {
    body = JSON.parse((await readRaw(req, 1024 * 1024)).toString("utf8") || "{}");
  } catch (err) {
    return sendJson(res, err.code === "too_big" ? 413 : 400, { erro: err.code === "too_big" ? "Pedido grande demais." : "JSON inválido." });
  }
  if (!body || typeof body !== "object") return sendJson(res, 400, { erro: "JSON inválido." });
  const cliente = String(body.cliente || "").replace(/\s+/g, " ").trim().slice(0, 40) || "CorrerIA";
  const pessoa = body.pessoa && typeof body.pessoa === "object" ? String(body.pessoa.nome || body.pessoa.id || "").slice(0, 60) : "";
  // De quem é: the person who asks, as a person of the house (by the id, person.ana, or the name)
  const house = await peopleSafe();
  let who = "";
  if (body.pessoa && typeof body.pessoa === "object") {
    const p = house && (house.find((x) => x.id === body.pessoa.id) || house.find((x) => sameName(x.name, body.pessoa.nome)));
    who = p ? p.name : house && house.length ? "" : String(body.pessoa.nome || "").replace(/\s+/g, " ").trim().slice(0, 80);
  }
  try {
    const out = callTool(body.nome, body.argumentos, { store, pessoa: who, people: house && house.map((p) => ({ id: p.id, name: p.name })) });
    for (const ev of out.events) broadcast(ev);
    sendJson(res, 200, { texto: out.texto });
    log.info(`CorrerIA: ${cliente}${pessoa ? ` (${pessoa})` : ""} usou ${body.nome}`);
  } catch (err) {
    if (err instanceof UnknownTool) sendJson(res, 404, { erro: err.message });
    else if (err instanceof ToolError) sendJson(res, 400, { erro: err.message });
    else {
      log.warn(`CorrerIA: ${body.nome} falhou: ${err.stack || err.message}`);
      sendJson(res, 500, { erro: `Não deu certo: ${err.message}` });
    }
  }
  broadcast({ kind: "correria", ultimo: correria.used(cliente) });
}

/**
 * GET /api/integracao/agora?usuario=<user id of Home Assistant>&pessoa=<person.x or name>&hora=HH:MM&dia=YYYY-MM-DD: the
 * CronologIA, with the key of share/memoria/integracao.json -> {versao, pessoa, trechos} (lib/integracao.js): the sheet of
 * now and of the next two times for that person, like their Agora here (theirs and everyone's; nobody of the house: every
 * block), at the clock of their phone (hora and dia, 1.15.1; without them, the server's).
 */
async function handleNow(req, res) {
  if (!integracao.authorized(req.headers)) return sendJson(res, 401, { erro: "Chave inválida." });
  if (req.method !== "GET") return sendJson(res, 405, { erro: "Use GET." });
  const q = new URL(req.url, "http://x").searchParams;
  const usuario = String(q.get("usuario") || "").slice(0, 80);
  const pessoa = String(q.get("pessoa") || "").replace(/\s+/g, " ").trim().slice(0, 80);
  let who = "";
  if (store.data.app.owners_off !== true && (usuario || pessoa)) {
    const house = await peopleSafe();
    const p = house && ((usuario && house.find((x) => x.user_id === usuario)) || (pessoa && house.find((x) => x.id === pessoa || sameName(x.name, pessoa))));
    // not a person of the house: every block, like the Agora of a shared tablet (no Home Assistant now: the name as it came)
    who = p ? p.name : house && house.length ? "" : /^person\./.test(pessoa) ? "" : pessoa;
  }
  sendJson(res, 200, { versao: VERSION, pessoa: who, trechos: trechos(store.data, { person: who, now: clockOf(q.get("hora"), q.get("dia")) }) });
}

function download(res, body, type, name) {
  res.writeHead(200, {
    "Content-Type": type,
    "Content-Length": body.length,
    "Content-Disposition": `attachment; filename="${name}"`,
    "Cache-Control": "no-store",
  });
  res.end(body);
}

function handleExport(fmt, res) {
  const name = `memoria-${fileStamp()}`;
  if (fmt === "json") return download(res, Buffer.from(JSON.stringify(store.data, null, 1)), "application/json; charset=utf-8", `${name}.json`);
  if (fmt === "csv") return download(res, toCSV(store.data), "text/csv; charset=utf-8", `${name}.csv`);
  if (fmt === "zip") return download(res, backupZip(store.data, VERSION), "application/zip", `${name}.zip`);
  res.writeHead(404).end("Not found");
}

/** POST /api/import (body = the .zip or .json file, header x-file-name). */
function handleImport(req, res) {
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
  req.on("end", () => {
    if (aborted) return;
    let name = "";
    try {
      name = decodeURIComponent(req.headers["x-file-name"] || "");
    } catch (e) {
      /* keep empty */
    }
    try {
      const raw = parseImport(Buffer.concat(chunks), name);
      replaced(store.replaceAll(raw, "antes-de-importar"), `importado de ${name || "arquivo"}`);
      sendJson(res, 200, counts());
    } catch (err) {
      log.warn(`Importação falhou: ${err.message}`);
      sendJson(res, 400, { error: err.message, code: err.code || "failed" });
    }
  });
}

/**
 * Mais › Relatório: the blocks (?categoria=, ?bloco=) and their sheets, as a page (?tema=claro|escuro, ?cor=#rrggbb,
 * the ones of the app) or as a PDF to download (the app Home Assistant on the phone doesn't print a page).
 */
function handleReport(url, res, pdf) {
  const rep = anotacoes(store.data, { categoria: url.searchParams.get("categoria") || "", bloco: url.searchParams.get("bloco") || "" });
  const cor = url.searchParams.get("cor");
  if (pdf) {
    const file = reportPdf(rep, { cor });
    res.writeHead(200, { "Content-Type": "application/pdf", "Content-Disposition": `attachment; filename="${pdfName(rep)}"`, "Cache-Control": "no-store", "Content-Length": file.length, "X-Content-Type-Options": "nosniff" });
    return res.end(file);
  }
  const tema = url.searchParams.get("tema");
  const body = Buffer.from(reportHtml(rep, { tema: tema === "claro" || tema === "escuro" ? tema : null, cor }), "utf8");
  res.writeHead(200, { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store", "Content-Length": body.length, "X-Content-Type-Options": "nosniff" });
  res.end(body);
}

const server = http.createServer((req, res) => {
  // the other apps of Home Assistant (the CorrerIA) come through the internal network, with the key
  if (req.url.split("?")[0] === NOW_ROUTE) {
    handleNow(req, res).catch((err) => {
      log.warn(`Integração: ${err.message}`);
      if (!res.headersSent) sendJson(res, 500, { erro: "Não deu certo." });
    });
    return;
  }
  if (req.url.split("?")[0] === TOOLS_ROUTE) {
    handleTools(req, res).catch((err) => {
      log.warn(`CorrerIA: ${err.message}`);
      if (!res.headersSent) sendJson(res, 500, { erro: "Não deu certo." });
    });
    return;
  }
  if (!allowed(req)) {
    res.writeHead(403).end("Forbidden");
    return;
  }
  const url = new URL(req.url, "http://x");
  if (url.pathname === "/api/extract" && req.method === "POST") return handleExtract(req, res);
  if (url.pathname === "/api/import" && req.method === "POST") return handleImport(req, res);
  if (url.pathname === "/api/voice" && req.method === "POST") return handleVoice(req, res);
  const exp = url.pathname.match(/^\/api\/export\/(json|csv|zip)$/);
  if (exp && req.method === "GET") return handleExport(exp[1], res);
  if ((url.pathname === "/relatorio" || url.pathname === "/relatorio.pdf") && req.method === "GET") {
    try {
      return handleReport(url, res, url.pathname.endsWith(".pdf"));
    } catch (err) {
      log.warn(`Relatório: ${err.message}`);
      if (!res.headersSent) res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" }).end("Não deu para montar o relatório.");
      return;
    }
  }
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
// the file of the CorrerIA with this version and address (or none, when off)
correria.publish(correriaOn());
// the file of the other apps (the CronologIA), always
integracao.publish();
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
