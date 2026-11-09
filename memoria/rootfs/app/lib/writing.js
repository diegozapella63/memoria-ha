// The small rules of writing in the notebooks, shared by the screen (frontend) and the tools of the CorrerIA
// (lib/ferramentas.js), so a sheet changed from the WhatsApp, the Claude or the Gemini comes out as if written here.
import { linkMarkdown } from "./links.js";

/** Without accents and in lower case: Buscar finds "café" with "cafe". */
export const fold = (s) =>
  (s || "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();

/** The first line with text: the title of a sheet. */
export const firstLine = (text) => ((text || "").split("\n").find((l) => l.trim()) || "").trim();

/** Adds to the end of a sheet, on a new line (the card of the Conversa, Adicionar link). */
export function appendText(text, add) {
  const base = String(text || "").replace(/\s+$/, "");
  return base ? `${base}\n${add}` : String(add);
}

/** Adicionar link: the link (an address already checked by normalizeUrl) at the end of the sheet, with its name. */
export const appendLink = (text, url, name = "") => appendText(text, linkMarkdown(url, name));

/**
 * Caixas de marcar: a line that starts with ☐ is to do and with ☑ is done (also [ ] and [x], as other apps and the
 * IAs write lists). The box sits after the indent; the text of the item comes after a space.
 */
export const CHECK_RE = /^([ \t]*)(☐|☑|\[ \]|\[[xX]\])[ \t]?/;
export const CHECK_TODO = "☐";
export const CHECK_DONE = "☑";

/** The box of a line: {indent, done, len (of the indent, the box and the space)}, or null. */
export function checkOf(line) {
  const m = CHECK_RE.exec(String(line || ""));
  return m ? { indent: m[1], done: m[2] === CHECK_DONE || /x/i.test(m[2]), len: m[0].length } : null;
}

/** Whether the sheet has a box. */
export const hasChecks = (text) => String(text || "").split("\n").some((l) => CHECK_RE.test(l));

/** Marks (or unmarks) the box of the line n of the sheet; a line without a box stays as it is. */
export function toggleCheck(text, n) {
  const lines = String(text || "").split("\n");
  const c = lines[n] != null ? checkOf(lines[n]) : null;
  if (!c) return String(text || "");
  lines[n] = `${c.indent}${c.done ? CHECK_TODO : CHECK_DONE} ${lines[n].slice(c.len)}`;
  return lines.join("\n");
}

/** The first color of the palette nobody uses yet (a new block, a new category), or the fallback. */
export function freeColor(items, ids, fallback) {
  const used = new Set((items || []).map((x) => x.color));
  return ids.find((id) => !used.has(id)) || fallback;
}
