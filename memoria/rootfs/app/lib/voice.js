/**
 * Falar: what you say goes to the speech-to-text of Home Assistant and comes back as text,
 * which the AI then reads like a pasted message. The engine is the one chosen in the app
 * (Mais › Integrações › Falar), or else the one of the preferred Assist pipeline
 * (Configurações › Assistentes de voz; with Home Assistant Cloud, stt.home_assistant_cloud),
 * with its language; without a pipeline, the first stt.* entity.
 *
 * The audio comes from the app as raw PCM, 16 kHz, 16-bit, mono (what Assist sends too).
 */
import http from "node:http";
import https from "node:https";

const coded = (code, message) => Object.assign(new Error(message), { code });

/**
 * POST with the header names exactly as written. The Supervisor's proxy (http://supervisor/core/api)
 * only passes on "X-Speech-Content" spelled like that, and fetch() sends header names in lower case.
 */
function postRaw(url, headers, body, timeoutMs) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const lib = u.protocol === "https:" ? https : http;
    const req = lib.request(u, { method: "POST", headers: { ...headers, "Content-Length": body.length }, timeout: timeoutMs }, (res) => {
      const chunks = [];
      res.on("data", (c) => chunks.push(c));
      res.on("end", () => resolve({ status: res.statusCode, text: Buffer.concat(chunks).toString("utf8") }));
      res.on("error", reject);
    });
    req.on("timeout", () => req.destroy(new Error("tempo esgotado")));
    req.on("error", reject);
    req.end(body);
  });
}

export const VOICE_RATE = 16000;
const MIN_BYTES = VOICE_RATE * 2 * 0.4; // under 0.4 s: nothing was said
export const MAX_VOICE_BYTES = VOICE_RATE * 2 * 125; // a bit over 2 minutes

export class Voice {
  /** @param {{ha: {send: Function}, rest: string, token: string, log: object, pick?: () => string}} o */
  constructor({ ha, rest, token, log, pick = () => "" }) {
    this.ha = ha;
    this.rest = rest;
    this.token = token;
    this.log = log;
    // the engine chosen in the app ("" = the one of the voice assistant)
    this.pick = pick;
    this.cache = null;
    this.optCache = null;
    this.langs = new Map();
  }

  forget() {
    this.cache = null;
    this.optCache = null;
  }

  /**
   * The speech-to-text engines of Home Assistant: the stt.* entities and the ones the voice
   * assistants use; `auto` is the one of the preferred assistant. Kept a minute.
   */
  async options() {
    if (this.optCache && Date.now() - this.optCache.at < 60000) return this.optCache.value;
    let pipes = [];
    let preferred = null;
    try {
      const r = await this.ha.send({ type: "assist_pipeline/pipeline/list" });
      pipes = (r && r.pipelines) || [];
      preferred = r && r.preferred_pipeline;
    } catch (err) {
      this.log.warn(`Assistentes de voz: ${err.message}`);
    }
    let states = [];
    try {
      states = (await this.ha.send({ type: "get_states" }, 15000)) || [];
    } catch (err) {
      this.log.warn(`Fala para texto: ${err.message}`);
    }
    const list = [];
    for (const st of states) {
      if (/^stt\.[a-z0-9_]+$/.test(st.entity_id) && !list.some((x) => x.id === st.entity_id)) {
        list.push({ id: st.entity_id, name: (st.attributes && st.attributes.friendly_name) || st.entity_id, language: null });
      }
    }
    for (const p of pipes) {
      if (!p.stt_engine) continue;
      const known = list.find((x) => x.id === p.stt_engine);
      // the language the voice assistant uses with it
      if (known) known.language = known.language || p.stt_language || null;
      else list.push({ id: p.stt_engine, name: p.name ? `${p.name} (assistente de voz)` : p.stt_engine, language: p.stt_language || p.language || null });
    }
    const p = pipes.find((x) => x.id === preferred && x.stt_engine) || pipes.find((x) => x.stt_engine);
    let auto = null;
    if (p) {
      const e = list.find((x) => x.id === p.stt_engine);
      auto = { engine: p.stt_engine, language: p.stt_language || p.language || null, name: (e && !/\(assistente de voz\)$/.test(e.name) && e.name) || p.name || p.stt_engine };
    } else if (list[0]) auto = { engine: list[0].id, language: list[0].language, name: list[0].name };
    const value = { list, auto };
    this.optCache = { at: Date.now(), value };
    return value;
  }

  /** The language to ask an engine for: Portuguese as it names it (pt-BR, pt…), from GET /api/stt/<engine>. */
  async languageFor(engine) {
    if (this.langs.has(engine)) return this.langs.get(engine);
    let lang = "pt-BR";
    try {
      const res = await fetch(`${this.rest}/stt/${encodeURIComponent(engine)}`, { headers: { authorization: `Bearer ${this.token}` }, signal: AbortSignal.timeout(15000) });
      const j = res.ok ? await res.json() : {};
      const all = Array.isArray(j.languages) ? j.languages.map(String) : [];
      lang = all.find((l) => /^pt[-_]br$/i.test(l)) || all.find((l) => /^pt$/i.test(l)) || all.find((l) => /^pt[-_]/i.test(l)) || "pt-BR";
      if (res.ok) this.langs.set(engine, lang);
    } catch (err) {
      this.log.warn(`Fala para texto (${engine}): ${err.message}`);
    }
    return lang;
  }

  /** {engine, language, name, chosen} of the speech-to-text to use, or null. Kept a minute. */
  async engine() {
    const want = this.pick() || "";
    if (this.cache && this.cache.want === want && Date.now() - this.cache.at < 60000) return this.cache.value;
    const o = await this.options();
    const chosen = want && o.list.find((x) => x.id === want);
    let value = null;
    if (chosen) value = { engine: chosen.id, language: chosen.language || (await this.languageFor(chosen.id)), name: chosen.name, chosen: true };
    else if (o.auto) value = { ...o.auto, language: o.auto.language || (await this.languageFor(o.auto.engine)), chosen: false };
    this.cache = { at: Date.now(), want, value };
    return value;
  }

  /** What the screens need: whether Falar works and with what, and the engines to choose from. */
  async status({ fresh = false } = {}) {
    if (fresh) this.forget();
    const want = this.pick() || "";
    const o = await this.options();
    const e = await this.engine();
    const base = {
      selected: want,
      missing: !!want && !o.list.some((x) => x.id === want),
      options: o.list.map(({ id, name }) => ({ id, name })),
      auto: o.auto ? { engine: o.auto.engine, name: o.auto.name } : null,
    };
    if (!e) return { ready: false, reason: "Para falar, o Home Assistant precisa de um assistente de voz com fala para texto (Configurações › Assistentes de voz; com o Home Assistant Cloud ele já vem pronto).", ...base };
    return { ready: true, engine: e.engine, language: e.language, name: e.name, chosen: e.chosen, ...base };
  }

  /** Raw PCM (16 kHz, 16-bit, mono) to text. */
  async text(pcm) {
    if (!pcm || pcm.length < MIN_BYTES) throw coded("invalid_format", "Não ouvi nada. Toque no microfone e fale.");
    if (pcm.length > MAX_VOICE_BYTES) throw coded("invalid_format", "Fale até 2 minutos de cada vez.");
    const e = await this.engine();
    if (!e) throw coded("no_stt", (await this.status()).reason);
    const res = await postRaw(
      `${this.rest}/stt/${encodeURIComponent(e.engine)}`,
      {
        Authorization: `Bearer ${this.token}`,
        "Content-Type": "application/octet-stream",
        "X-Speech-Content": `format=wav; codec=pcm; sample_rate=${VOICE_RATE}; bit_rate=16; channel=1; language=${e.language}`,
      },
      pcm,
      90000,
    );
    if (res.status < 200 || res.status >= 300) {
      this.forget();
      const detail = res.text.slice(0, 200);
      this.log.warn(`Fala para texto (${e.engine}): ${res.status} ${detail}`);
      throw coded("failed", res.status === 415 || res.status === 400 ? `A fala para texto não aceitou o áudio (${detail || res.status}).` : `A fala para texto do Home Assistant falhou (${res.status}${detail ? `: ${detail}` : ""}).`);
    }
    let j = {};
    try {
      j = JSON.parse(res.text);
    } catch (err) {
      /* not JSON */
    }
    const text = String(j.text || "").trim();
    if (j.result !== "success" || !text) throw coded("not_understood", "Não entendi. Tente de novo, mais perto do microfone.");
    return { text, engine: e.engine, name: e.name };
  }
}

/** Reads a raw body up to `max` bytes. */
export function readRaw(req, max) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    let big = false;
    req.on("data", (c) => {
      size += c.length;
      // too long: stop keeping it, but read to the end so the answer reaches the browser; far too long: close
      if (big) {
        if (size > max * 4) req.destroy();
        return;
      }
      if (size > max) {
        big = true;
        chunks.length = 0;
        return;
      }
      chunks.push(c);
    });
    req.on("end", () => (big ? reject(coded("too_big", "Fale até 2 minutos de cada vez.")) : resolve(Buffer.concat(chunks))));
    req.on("error", reject);
  });
}
