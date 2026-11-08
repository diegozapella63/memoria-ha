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

/** The first color of the palette nobody uses yet (a new block, a new category), or the fallback. */
export function freeColor(items, ids, fallback) {
  const used = new Set((items || []).map((x) => x.color));
  return ids.find((id) => !used.has(id)) || fallback;
}
