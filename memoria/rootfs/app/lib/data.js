// Exports, backups in the share folder, imports and the list of versions,
// the same set the other apps (InventarIA, GerencIA) offer in "Dados".
import fs from "node:fs";
import path from "node:path";
import { makeZip, readZip } from "./zip.js";

const pad = (n) => String(n).padStart(2, "0");
const BACKUP_RE = /^memoria-[\w-]+\.zip$/;
const VERSION_RE = /^memoria-(\d{8})-(\d{6})-?([\w-]*)\.json$/;

/** "2026-10-19-0020", for file names. */
export const fileStamp = (d = new Date()) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}`;
const dateTime = (ms) => {
  const d = new Date(ms);
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
};
const firstLine = (text) => ((text || "").split("\n").find((l) => l.trim()) || "").trim();
const byCreated = (a, b) => a.created - b.created || (a.id < b.id ? -1 : 1);

function orderedBlocks(data) {
  return [...data.blocks].sort((a, b) => a.order - b.order || a.created - b.created);
}

function pagesOf(data, blockId) {
  return data.pages.filter((p) => p.block === blockId).sort(byCreated);
}

/** CSV for Excel: ";" separated, with BOM, one row per page. */
export function toCSV(data) {
  const q = (v) => {
    const s = String(v == null ? "" : v);
    return /[";\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const rows = [["Bloco", "Folha", "Título", "Escrita em", "Editada em", "Horários", "Texto"]];
  for (const b of orderedBlocks(data)) {
    pagesOf(data, b.id).forEach((p, i) => {
      rows.push([b.name, i + 1, firstLine(p.text), dateTime(p.created), dateTime(p.updated), (p.times || []).join(" "), p.text]);
    });
  }
  return Buffer.from("﻿" + rows.map((r) => r.map(q).join(";")).join("\r\n") + "\r\n", "utf8");
}

/** One Markdown file per block, pages in order. */
export function toMarkdown(data, block, periods) {
  const when = [
    ...(block.periods || []).map((id) => `${{ manha: "manhã", tarde: "tarde", noite: "noite" }[id]} (${periods[id]})`),
    ...(block.times || []),
  ];
  const head = `# ${block.name}\n\n${when.length ? `Abre sozinho: ${when.join(", ")}\n\n` : ""}`;
  const pages = pagesOf(data, block.id).map((p, i) => {
    const extra = (p.times || []).length ? ` · às ${p.times.join(", ")}` : "";
    return `## Folha ${i + 1} · ${dateTime(p.created)}${extra}\n\n${p.text.trim()}`;
  });
  return `${head}${pages.join("\n\n---\n\n")}\n`;
}

const safeName = (name) =>
  (name || "Bloco")
    .replace(/[\\/:*?"<>|\u0000-\u001f]/g, "-")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 60) || "Bloco";

export function backupZip(data, version) {
  const files = [
    { name: "memoria.json", data: JSON.stringify(data, null, 1) },
    { name: "memoria.csv", data: toCSV(data) },
  ];
  const used = new Set();
  for (const b of orderedBlocks(data)) {
    let base = safeName(b.name);
    for (let n = 2; used.has(base.toLowerCase()); n++) base = `${safeName(b.name)} ${n}`;
    used.add(base.toLowerCase());
    files.push({ name: `blocos/${base}.md`, data: toMarkdown(data, b, data.periods) });
  }
  files.push({
    name: "LEIA-ME.txt",
    data:
      `Backup do MemorIA ${version} criado em ${dateTime(Date.now())}.\n` +
      "memoria.json tem tudo (blocos, folhas, horários e ajustes); memoria.csv abre no Excel;\n" +
      "a pasta blocos tem um arquivo de texto por bloco.\n" +
      "Para restaurar: Mais > Dados > Importar backup, e escolha este .zip.\n",
  });
  return makeZip(files);
}

/** A .zip backup or a .json file -> the raw data object (validated later by the store). */
export function parseImport(buf, fileName = "") {
  let text;
  const isZip = buf.length > 3 && buf[0] === 0x50 && buf[1] === 0x4b;
  if (isZip || /\.zip$/i.test(fileName)) {
    const entries = readZip(buf).filter((e) => !e.name.startsWith("__MACOSX/") && !path.basename(e.name).startsWith("._"));
    const entry = entries.find((e) => path.basename(e.name) === "memoria.json") || entries.find((e) => /\.json$/i.test(e.name));
    if (!entry) throw Object.assign(new Error("O .zip não tem o arquivo memoria.json."), { code: "invalid_format" });
    text = entry.data.toString("utf8");
  } else {
    text = buf.toString("utf8");
  }
  try {
    return JSON.parse(text.replace(/^﻿/, ""));
  } catch (e) {
    throw Object.assign(new Error("O arquivo não é um backup do MemorIA (.zip) nem um .json válido."), { code: "invalid_format" });
  }
}

// ------------------------------------------------------------------ share folder

export class Backups {
  constructor({ dir, folderLabel = "share/memoria" }) {
    this.dir = dir;
    this.folderLabel = folderLabel;
  }

  available() {
    try {
      fs.mkdirSync(this.dir, { recursive: true });
      fs.accessSync(this.dir, fs.constants.W_OK);
      return true;
    } catch (e) {
      return false;
    }
  }

  list() {
    if (!this.available()) return { available: false, folder: this.folderLabel, backups: [] };
    const backups = fs
      .readdirSync(this.dir)
      .filter((f) => BACKUP_RE.test(f))
      .map((name) => {
        const st = fs.statSync(path.join(this.dir, name));
        return { name, size: st.size, date: st.mtimeMs };
      })
      .sort((a, b) => b.date - a.date);
    return { available: true, folder: this.folderLabel, backups };
  }

  create(data, version) {
    if (!this.available()) throw Object.assign(new Error("A pasta share não está disponível para o app."), { code: "no_share" });
    let name = `memoria-${fileStamp()}.zip`;
    for (let n = 2; fs.existsSync(path.join(this.dir, name)); n++) name = `memoria-${fileStamp()}-${n}.zip`;
    fs.writeFileSync(path.join(this.dir, name), backupZip(data, version));
    return { name, folder: this.folderLabel };
  }

  read(name) {
    if (!BACKUP_RE.test(name || "")) throw Object.assign(new Error("Backup inválido."), { code: "invalid_format" });
    const full = path.join(this.dir, name);
    if (!fs.existsSync(full)) throw Object.assign(new Error("Esse backup não existe mais."), { code: "not_found" });
    return parseImport(fs.readFileSync(full), name);
  }
}

// ------------------------------------------------------------------ versions

export function listVersions(dir) {
  if (!fs.existsSync(dir)) return [];
  const out = [];
  for (const name of fs.readdirSync(dir).sort().reverse()) {
    const m = VERSION_RE.exec(name);
    if (!m) continue;
    try {
      const d = JSON.parse(fs.readFileSync(path.join(dir, name), "utf8"));
      const [, ymd, hms, reason] = m;
      const when = new Date(+ymd.slice(0, 4), +ymd.slice(4, 6) - 1, +ymd.slice(6, 8), +hms.slice(0, 2), +hms.slice(2, 4), +hms.slice(4, 6)).getTime();
      out.push({ name, when, reason: reason || "auto", blocks: (d.blocks || []).length, pages: (d.pages || []).length });
    } catch (e) {
      /* skip broken file */
    }
  }
  return out;
}

export function readVersion(dir, name) {
  if (!VERSION_RE.test(name || "")) throw Object.assign(new Error("Versão inválida."), { code: "invalid_format" });
  const full = path.join(dir, name);
  if (!fs.existsSync(full)) throw Object.assign(new Error("Essa versão não existe mais."), { code: "not_found" });
  return JSON.parse(fs.readFileSync(full, "utf8"));
}
