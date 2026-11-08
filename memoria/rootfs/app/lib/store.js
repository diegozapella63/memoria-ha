// MemorIA data in /data/memoria.json: notebooks ("blocos"), pages, the day's
// periods and app settings. Everything is validated here. Like the other apps,
// a copy goes to /data/versoes every 10 minutes of use (the 60 most recent)
// and before importing, restoring or erasing.
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { DEFAULT_PERIODS, PAPERS, PERIODS, normTime } from "./schedule.js";

const COLORS = ["vermelho", "coral", "rosa", "framboesa", "laranja", "ouro", "lilas", "azul", "menta", "grafite"];
const PERIOD_IDS = PERIODS.map((p) => p.id);
const MAX_TEXT = 50000;
const MAX_PAGES = 20000;
const MAX_BLOCKS = 200;
const MAX_CATEGORIES = 50;
const MAX_VERSIONS = 60;
const VERSION_EVERY = 10 * 60 * 1000;
const ID_RE = /^[a-z0-9]{6,32}$/i;
const pad = (n) => String(n).padStart(2, "0");
export const stamp = (d = new Date()) => `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`;

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

const looseTimes = (list) => (Array.isArray(list) ? [...new Set(list.map(normTime).filter(Boolean))].sort().slice(0, 24) : []);
const when = (v, fallback) => (Number.isFinite(v) && v > 0 ? v : fallback);

const catKey = (name) =>
  name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();

/** The categories of the blocks (Mais › Categorias): [{id, name, color, order, created, updated}], names unique. */
function normCategories(list, now) {
  const out = [];
  const ids = new Set();
  const names = new Set();
  for (const c of Array.isArray(list) ? list : []) {
    if (out.length >= MAX_CATEGORIES) break;
    if (!c || typeof c !== "object") continue;
    const name = typeof c.name === "string" ? c.name.replace(/\s+/g, " ").trim().slice(0, 40) : "";
    if (!name || names.has(catKey(name))) continue;
    const id = typeof c.id === "string" && ID_RE.test(c.id) && !ids.has(c.id) ? c.id : newId();
    ids.add(id);
    names.add(catKey(name));
    out.push({
      id,
      name,
      color: COLORS.includes(c.color) ? c.color : "grafite",
      order: Number.isInteger(c.order) ? c.order : out.length,
      created: when(c.created, now),
      updated: when(c.updated, now),
    });
  }
  return out;
}

/** Validates a whole data file (an import, a backup or an old version). */
export function normalize(raw, current = {}) {
  if (!raw || typeof raw !== "object" || !Array.isArray(raw.blocks) || !Array.isArray(raw.pages)) {
    const err = new Error("Esse arquivo não parece um backup do MemorIA.");
    err.code = "invalid_format";
    throw err;
  }
  const now = Date.now();
  const categories = normCategories(raw.categories, now);
  const catIds = new Set(categories.map((c) => c.id));
  const blockIds = new Set();
  const blocks = [];
  for (const b of raw.blocks) {
    if (blocks.length >= MAX_BLOCKS) break;
    if (!b || typeof b !== "object") continue;
    const id = typeof b.id === "string" && ID_RE.test(b.id) && !blockIds.has(b.id) ? b.id : newId();
    blockIds.add(id);
    blocks.push({
      id,
      name: (typeof b.name === "string" ? b.name.slice(0, 60).trim() : "") || "Sem nome",
      color: COLORS.includes(b.color) ? b.color : "lilas",
      paper: PAPERS.includes(b.paper) ? b.paper : "pautado",
      periods: [...new Set((Array.isArray(b.periods) ? b.periods : []).filter((p) => PERIOD_IDS.includes(p)))],
      times: looseTimes(b.times),
      ...(catIds.has(b.category) ? { category: b.category } : {}),
      order: Number.isInteger(b.order) ? b.order : blocks.length,
      created: when(b.created, now),
      updated: when(b.updated, now),
    });
  }
  const pageIds = new Set();
  const pages = [];
  for (const p of raw.pages) {
    if (pages.length >= MAX_PAGES) break;
    if (!p || typeof p !== "object" || !blockIds.has(p.block)) continue;
    const id = typeof p.id === "string" && ID_RE.test(p.id) && !pageIds.has(p.id) ? p.id : newId();
    pageIds.add(id);
    const created = when(p.created, now);
    pages.push({
      id,
      block: p.block,
      text: typeof p.text === "string" ? p.text.slice(0, MAX_TEXT) : "",
      times: looseTimes(p.times),
      created,
      updated: when(p.updated, created),
    });
  }
  const periods = { ...DEFAULT_PERIODS };
  for (const id of PERIOD_IDS) {
    const t = raw.periods && normTime(raw.periods[id]);
    if (t) periods[id] = t;
  }
  const a = raw.app && typeof raw.app === "object" ? raw.app : {};
  const app = {};
  if (COLORS.includes(a.accent)) app.accent = a.accent;
  if (a.accent_daily === false) app.accent_daily = false;
  if (typeof a.hand === "boolean") app.hand = a.hand;
  if (typeof a.sensor === "boolean") app.sensor = a.sensor;
  if (a.ai_off === true) app.ai_off = true;
  // The AI and the speech-to-text belong to this Home Assistant, not to the file.
  if (current.ai_entity) app.ai_entity = current.ai_entity;
  if (current.voice_engine) app.voice_engine = current.voice_engine;
  return { version: 1, periods, app, categories, blocks, pages };
}

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
    this.versionsDir = path.join(dir, "versoes");
    this.log = log;
    this.timer = null;
    this.lastVersion = 0;
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
      categories: (raw && Array.isArray(raw.categories) && raw.categories) || [],
      blocks: (raw && Array.isArray(raw.blocks) && raw.blocks) || seed.blocks,
      pages: (raw && Array.isArray(raw.pages) && raw.pages) || (seed ? seed.pages : []),
    };
    if (first) this.save();
  }

  save() {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => this.flush(), 500);
  }

  flush({ version = true } = {}) {
    clearTimeout(this.timer);
    this.timer = null;
    if (version) this.version("auto");
    const tmp = `${this.file}.tmp`;
    try {
      fs.writeFileSync(tmp, JSON.stringify(this.data));
      fs.renameSync(tmp, this.file);
    } catch (err) {
      this.log.error(`Não consegui salvar ${this.file}: ${err.message}`);
    }
  }

  /** Copies the file as it is now to /data/versoes (at most every 10 min unless forced). */
  version(reason = "auto", force = false) {
    if (!force && Date.now() - this.lastVersion < VERSION_EVERY) return null;
    if (!fs.existsSync(this.file)) return null;
    try {
      fs.mkdirSync(this.versionsDir, { recursive: true });
      const name = `memoria-${stamp()}-${reason}.json`;
      fs.copyFileSync(this.file, path.join(this.versionsDir, name));
      this.lastVersion = Date.now();
      const all = fs.readdirSync(this.versionsDir).filter((f) => /^memoria-.*\.json$/.test(f)).sort();
      for (const old of all.slice(0, Math.max(0, all.length - MAX_VERSIONS))) fs.rmSync(path.join(this.versionsDir, old), { force: true });
      return name;
    } catch (err) {
      this.log.warn(`Não consegui guardar uma versão: ${err.message}`);
      return null;
    }
  }

  /** Swaps everything for `raw` (import, restore), keeping a copy of what was there. */
  replaceAll(raw, reason) {
    const next = normalize(raw, this.data.app);
    if (this.timer) this.flush({ version: false });
    this.version(reason, true);
    this.data = next;
    this.flush({ version: false });
    return this.data;
  }

  erase() {
    return this.replaceAll({ ...this.data, blocks: [], pages: [] }, "antes-de-apagar");
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
    if ("category" in input) {
      // "" or null = sem categoria
      if (input.category && !this.category(input.category)) fail("categoria não existe");
      if (input.category) b.category = input.category;
      else delete b.category;
    }
    if ("order" in input && Number.isInteger(input.order)) b.order = input.order;
    b.updated = now;
    if (existing) {
      if (!("category" in b)) delete existing.category;
      Object.assign(existing, b);
    } else this.data.blocks.push(b);
    this.save();
    return existing || b;
  }

  category(id) {
    return this.data.categories.find((c) => c.id === id);
  }

  /** Mais › Categorias: a new one ({name, color}) or a change ({id, name?, color?}). */
  saveCategory(input) {
    if (!input || typeof input !== "object") fail("categoria inválida");
    const now = Date.now();
    const existing = input.id ? this.category(input.id) : null;
    if (input.id && !existing) fail("categoria não existe");
    if (!existing && this.data.categories.length >= MAX_CATEGORIES) fail("categorias demais");
    const c = existing ? { ...existing } : { id: newId(), created: now, order: this.data.categories.length, color: "grafite" };
    if ("name" in input || !existing) {
      const name = str(input.name == null ? "" : input.name, 200, "nome").replace(/\s+/g, " ").trim().slice(0, 40);
      if (!name) fail("Dê um nome à categoria.");
      if (this.data.categories.some((x) => x.id !== c.id && catKey(x.name) === catKey(name))) fail(`Já existe a categoria ${name}.`);
      c.name = name;
    }
    if ("color" in input) c.color = COLORS.includes(input.color) ? input.color : c.color;
    if ("order" in input && Number.isInteger(input.order)) c.order = input.order;
    c.updated = now;
    if (existing) Object.assign(existing, c);
    else this.data.categories.push(c);
    this.save();
    return existing || c;
  }

  /** Deletes a category; its blocks stay, without a category. Returns those blocks. */
  deleteCategory(id) {
    const before = this.data.categories.length;
    this.data.categories = this.data.categories.filter((c) => c.id !== id);
    if (this.data.categories.length === before) fail("categoria não existe");
    const now = Date.now();
    const changed = [];
    for (const b of this.data.blocks) {
      if (b.category !== id) continue;
      delete b.category;
      b.updated = now;
      changed.push(b);
    }
    this.save();
    return changed;
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
      // Cor do dia: on unless turned off
      if ("accent_daily" in app) next.accent_daily = app.accent_daily === false ? false : undefined;
      if ("hand" in app) next.hand = Boolean(app.hand);
      if ("sensor" in app) next.sensor = Boolean(app.sensor);
      // "" = the AI Home Assistant prefers.
      if ("ai_entity" in app) next.ai_entity = /^ai_task\.[a-z0-9_]+$/.test(app.ai_entity || "") ? app.ai_entity : undefined;
      // Usar IA (on unless turned off): off, no reading by AI, no Falar, no Conversa
      if ("ai_off" in app) next.ai_off = app.ai_off === true ? true : undefined;
      // Falar: the speech-to-text ("" = the one of the voice assistant)
      if ("voice_engine" in app) next.voice_engine = /^stt\.[a-z0-9_]+$/.test(app.voice_engine || "") ? app.voice_engine : undefined;
      this.data.app = Object.fromEntries(Object.entries(next).filter(([, v]) => v !== undefined));
    }
    this.save();
    return { periods: this.data.periods, app: this.data.app };
  }
}
