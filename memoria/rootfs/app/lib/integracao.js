// What holds now, for the other apps of the family (the CronologIA shows it in its Agora): this app always writes
// share/memoria/integracao.json ({app, nome, url, ip_url, chave, versao, agora, painel, gravado_em}; 600, atomic; the
// key is its own, in /data/integracao.key, apart from the one of the CorrerIA) and answers GET /api/integracao/agora
// with Authorization: Bearer <chave>: the sheet of now and of the next two times, for a person, like the Agora here.
import os from "node:os";
import path from "node:path";
import { addressOf, keyIn, bearerIs, writePrivate, localIso } from "./correria.js";
import { PERIODS, buildSchedule, ahead, occurrence, minutesOf, fmtMin } from "./schedule.js";
import { linksToText } from "./links.js";
import { firstLine, checkOf, CHECK_TODO, CHECK_DONE } from "./writing.js";

export const ROUTE = "/api/integracao/agora";
export const MAX_TEXT_OUT = 1500;
const byCreated = (a, b) => a.created - b.created || (a.id < b.id ? -1 : 1);
const KIND = { page: "trecho", period: "periodo", time: "horario" };

/** The address of this app in Home Assistant (/app/<slug> since 2026.2): hostname a1b2c3d4-memoria -> a1b2c3d4_memoria. */
export function panelOf(h = os.hostname()) {
  return /^[a-z0-9]+-memoria$/.test(h) ? `/app/${h.replace("-", "_")}` : null;
}

/** The text with the lines ticked in the Agora for that time of the sheet (only the boxes change). */
function withMarks(text, lines) {
  if (!lines || !lines.length) return text;
  const set = new Set(lines);
  return text
    .split("\n")
    .map((l) => {
      const c = checkOf(l);
      if (!c || !set.has(l.slice(c.len).replace(/\s+/g, " ").trim())) return l;
      return `${c.indent}${c.done ? CHECK_TODO : CHECK_DONE} ${l.slice(c.len)}`;
    })
    .join("\n");
}

/**
 * The trechos of a person (their blocks and everyone's; "": every block): what holds at `now` (with fim, the time it
 * stops, when it has a Fica no Agora; past it, none holds) and the next start times, past midnight too, three in all.
 * A sheet with a time is that sheet; a block with a period or a time, its last sheet (the one the Agora opens; none
 * yet: folha_id null and no text). The text of the one of now has the boxes ticked in the Agora for this time.
 */
export function trechos(data, { person = "", now = new Date() } = {}) {
  const min = minutesOf(now);
  const blocks = new Map(((data && data.blocks) || []).map((b) => [b.id, b]));
  const pages = (data && data.pages) || [];
  return ahead(buildSchedule(data, { person }), min).flatMap((g) => {
    const e = g.main;
    const b = blocks.get(e.block);
    if (!b) return [];
    const page = e.page ? pages.find((p) => p.id === e.page) : pages.filter((p) => p.block === b.id).sort(byCreated).pop();
    const m = page && g.now && data.marks && data.marks[page.id];
    const marked = m && m.at === occurrence(g.min, now, true) ? withMarks(page.text || "", m.lines) : page ? page.text || "" : "";
    const text = page ? linksToText(marked).trim() : "";
    const out = {
      inicio: fmtMin(g.min),
      agora: g.now,
      ontem: g.yesterday,
      amanha: g.tomorrow,
      bloco: b.name,
      bloco_id: b.id,
      cor: b.color || "lilas",
      folha_id: page ? page.id : null,
      titulo: firstLine(text).slice(0, 200),
      texto: text.length > MAX_TEXT_OUT ? `${text.slice(0, MAX_TEXT_OUT - 1).trimEnd()}…` : text,
      tipo: KIND[e.kind] || "horario",
    };
    if (g.now && g.end != null) out.fim = fmtMin(g.end);
    if (e.kind === "period") out.periodo = (PERIODS.find((p) => p.id === e.period) || {}).label || "";
    out.outros = g.entries.length - 1;
    return [out];
  });
}

export class Integracao {
  constructor({ dataDir, shareDir, port, version, log, internalUrl = process.env.MEMORIA_URL_INTERNA || "" }) {
    this.keyFile = path.join(dataDir, "integracao.key");
    this.shareFile = path.join(shareDir, "integracao.json");
    this.port = port;
    this.version = version;
    this.log = log;
    this.internalUrl = internalUrl;
    this._key = "";
  }

  key() {
    if (!this._key) this._key = keyIn(this.keyFile);
    return this._key;
  }

  /** Writes share/memoria/integracao.json (at the start: the address can change when the app is reinstalled). */
  publish() {
    try {
      const body = { app: "memoria", nome: "MemorIA", ...addressOf(this.port, this.internalUrl), chave: this.key(), versao: this.version, agora: ROUTE, painel: panelOf(), gravado_em: localIso() };
      writePrivate(this.shareFile, JSON.stringify(body, null, 1));
    } catch (err) {
      this.log.warn(`Integração: não consegui gravar ${this.shareFile}: ${err.message}`);
    }
  }

  authorized(headers) {
    return bearerIs(headers, this.key());
  }
}
