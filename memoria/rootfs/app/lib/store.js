// MemorIA data in /data/memoria.json: notebooks ("blocos"), pages, the day's
// periods and app settings. Everything is validated here.
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { DEFAULT_PERIODS, PAPERS, PERIODS, normTime } from "./schedule.js";

const COLORS = ["vermelho", "coral", "rosa", "framboesa", "laranja", "ouro", "lilas", "azul", "menta", "grafite"];
const PERIOD_IDS = PERIODS.map((p) => p.id);
const MAX_TEXT = 50000;
const MAX_PAGES = 20000;
const MAX_BLOCKS = 200;

const newId = () => crypto.randomBytes(6).toString("hex");
const fail = (message) => {
  const err = new Error(message);
  err.code = "invalid_format";
  throw err;
};
const str = (v, max, field) => {
  if (typeof v !== "string") fail(`${field} precisa ser texto`);
  return v.slice(0, max);
};
const times = (list) => {
  if (list == null) return [];
  if (!Array.isArray(list)) fail("horários inválidos");
  const out = [];
  for (const t of list) {
    const n = normTime(t);
    if (!n) fail(`horário inválido: ${t}`);
    if (!out.includes(n)) out.push(n);
  }
  return out.sort().slice(0, 24);
};

function sample(now) {
  const b1 = { id: newId(), name: "Diário", color: "lilas", paper: "pautado", periods: ["noite"], times: [], order: 0, created: now, updated: now };
  const b2 = { id: newId(), name: "Rascunhos", color: "azul", paper: "quadriculado", periods: ["manha", "tarde"], times: [], order: 1, created: now, updated: now };
  const p1 = {
    id: newId(),
    block: b1.id,
    text: "Bem-vindo ao MemorIA!\n\nEste bloco abre sozinho à noite. Toque na borda direita da folha para virar a página e começar outra.",
    times: [],
    created: now,
    updated: now,
  };
  return { blocks: [b1, b2], pages: [p1] };
}

export class Store {
  constructor(dir, log) {
    this.file = path.join(dir, "memoria.json");
    this.log = log;
    this.timer = null;
    fs.mkdirSync(dir, { recursive: true });
    let raw = null;
    try {
      raw = JSON.parse(fs.readFileSync(this.file, "utf8"));
    } catch (err) {
      if (err.code !== "ENOENT") this.log.warn(`Não consegui ler ${this.file}: ${err.message}`);
    }
    const now = Date.now();
    const first = !raw || typeof raw !== "object";
    const seed = first ? sample(now) : null;
    this.data = {
      version: 1,
      periods: { ...DEFAULT_PERIODS, ...((raw && raw.periods) || {}) },
      app: (raw && raw.app && typeof raw.app === "object" && raw.app) || {},
      blocks: (raw && Array.isArray(raw.blocks) && raw.blocks) || seed.blocks,
      pages: (raw && Array.isArray(raw.pages) && raw.pages) || (seed ? seed.pages : []),
    };
    if (first) this.save();
  }

  save() {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => this.flush(), 500);
  }

  flush() {
    clearTimeout(this.timer);
    this.timer = null;
    const tmp = `${this.file}.tmp`;
    try {
      fs.writeFileSync(tmp, JSON.stringify(this.data));
      fs.renameSync(tmp, this.file);
    } catch (err) {
      this.log.error(`Não consegui salvar ${this.file}: ${err.message}`);
    }
  }

  block(id) {
    return this.data.blocks.find((b) => b.id === id);
  }

  page(id) {
    return this.data.pages.find((p) => p.id === id);
  }

  saveBlock(input) {
    if (!input || typeof input !== "object") fail("bloco inválido");
    const now = Date.now();
    const existing = input.id ? this.block(input.id) : null;
    if (!existing && this.data.blocks.length >= MAX_BLOCKS) fail("blocos demais");
    const b = existing ? { ...existing } : { id: newId(), created: now, order: this.data.blocks.length };
    if ("name" in input || !existing) b.name = str(input.name || "Novo bloco", 60, "nome").trim() || "Sem nome";
    if ("color" in input || !existing) b.color = COLORS.includes(input.color) ? input.color : "lilas";
    if ("paper" in input || !existing) b.paper = PAPERS.includes(input.paper) ? input.paper : "pautado";
    if ("periods" in input || !existing) {
      const ps = Array.isArray(input.periods) ? input.periods.filter((p) => PERIOD_IDS.includes(p)) : [];
      b.periods = [...new Set(ps)];
    }
    if ("times" in input || !existing) b.times = times(input.times);
    if ("order" in input && Number.isInteger(input.order)) b.order = input.order;
    b.updated = now;
    if (existing) Object.assign(existing, b);
    else this.data.blocks.push(b);
    this.save();
    return existing || b;
  }

  deleteBlock(id) {
    const before = this.data.blocks.length;
    this.data.blocks = this.data.blocks.filter((b) => b.id !== id);
    if (this.data.blocks.length === before) fail("bloco não existe");
    const removed = this.data.pages.filter((p) => p.block === id).map((p) => p.id);
    this.data.pages = this.data.pages.filter((p) => p.block !== id);
    this.save();
    return removed;
  }

  savePage(input) {
    if (!input || typeof input !== "object") fail("página inválida");
    const now = Date.now();
    const existing = input.id ? this.page(input.id) : null;
    if (!existing && this.data.pages.length >= MAX_PAGES) fail("páginas demais");
    const blockId = "block" in input ? input.block : existing && existing.block;
    if (!this.block(blockId)) fail("bloco não existe");
    // Keep the client's id for new pages, so the device that created it can follow it.
    const id = existing ? existing.id : typeof input.id === "string" && /^[a-z0-9]{6,32}$/i.test(input.id) ? input.id : newId();
    // A new page may bring its creation time (written offline, or restored with Undo).
    const created = Number.isFinite(input.created) && input.created > 0 && input.created <= now ? input.created : now;
    const p = existing ? { ...existing } : { id, created, text: "", times: [] };
    p.block = blockId;
    if ("text" in input) p.text = str(input.text, MAX_TEXT, "texto");
    if ("times" in input) p.times = times(input.times);
    // Last write wins, but never let an older edit overwrite a newer one.
    if (existing && Number.isFinite(input.base) && input.base < existing.updated && "text" in input && input.text !== existing.text) {
      const err = new Error("Esta página mudou em outro aparelho");
      err.code = "conflict";
      err.page = existing;
      throw err;
    }
    p.updated = now;
    if (existing) Object.assign(existing, p);
    else this.data.pages.push(p);
    this.save();
    return existing || p;
  }

  deletePage(id) {
    const before = this.data.pages.length;
    this.data.pages = this.data.pages.filter((p) => p.id !== id);
    if (this.data.pages.length === before) return false;
    this.save();
    return true;
  }

  saveSettings({ periods, app }) {
    if (periods && typeof periods === "object") {
      const next = { ...this.data.periods };
      for (const id of PERIOD_IDS) {
        if (id in periods) {
          const t = normTime(periods[id]);
          if (!t) fail(`horário inválido para ${id}`);
          next[id] = t;
        }
      }
      this.data.periods = next;
    }
    if (app && typeof app === "object") {
      const next = { ...this.data.app };
      if ("accent" in app) next.accent = COLORS.includes(app.accent) ? app.accent : undefined;
      if ("hand" in app) next.hand = Boolean(app.hand);
      if ("sensor" in app) next.sensor = Boolean(app.sensor);
      // "" = the AI Home Assistant prefers.
      if ("ai_entity" in app) next.ai_entity = /^ai_task\.[a-z0-9_]+$/.test(app.ai_entity || "") ? app.ai_entity : undefined;
      this.data.app = Object.fromEntries(Object.entries(next).filter(([, v]) => v !== undefined));
    }
    this.save();
    return { periods: this.data.periods, app: this.data.app };
  }
}
