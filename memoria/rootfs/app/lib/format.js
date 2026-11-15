// Negrito e cor numa parte do texto (1.27.0). A folha guarda o texto como foi escrito, com as marcas: **negrito** e
// {cor:texto} (as cores da paleta abaixo). Fora do editor, a parte aparece em negrito ou na cor e as marcas somem; no
// relatório, nos títulos, na busca e nos outros apps fica só o texto. Shared by the screen (frontend), the report,
// the sensor and the integration, like links.js.

/** The colors of a part of the text (ids of the palette of the app). */
export const FORMAT_COLORS = ["vermelho", "laranja", "verde", "azul", "lilas"];
const COLOR_ALT = FORMAT_COLORS.join("|");
// **bold** (not starting or ending with a space) or {color:text} (one line, no braces inside)
const FMT = () => new RegExp(`\\*\\*(?=\\S)([^\\n]*?\\S)\\*\\*|\\{(${COLOR_ALT}):([^{}\\n]+)\\}`, "g");

/** Whether the text has a part in bold or in a color. */
export const hasFormat = (text) => FMT().test(String(text || ""));

/**
 * The parts of a piece of text: [{text, start (where the text of the part starts in the source), bold, color}]. The
 * marks are left out; a bold part can have a color inside and the other way round.
 */
export function parseFormat(s, base = 0, inherit = {}) {
  const src = String(s || "");
  const out = [];
  const re = FMT();
  let at = 0;
  let m;
  const plain = (from, to) => {
    if (to > from) out.push({ text: src.slice(from, to), start: base + from, bold: !!inherit.bold, color: inherit.color || "" });
  };
  while ((m = re.exec(src))) {
    plain(at, m.index);
    if (m[1] != null) out.push(...parseFormat(m[1], base + m.index + 2, { ...inherit, bold: true }));
    else out.push(...parseFormat(m[3], base + m.index + m[2].length + 2, { ...inherit, color: m[2] }));
    at = m.index + m[0].length;
  }
  plain(at, src.length);
  return out;
}

/** The text without the marks (how it reads in the report, the titles and the other apps). */
export const stripFormat = (text) =>
  parseFormat(text)
    .map((p) => p.text)
    .join("");

/** Applies `fn(line)` to each non-empty piece of the lines of [s, e) (the spaces around each piece stay outside). */
function eachPiece(text, s, e, fn) {
  const sel = text.slice(s, e);
  const out = sel
    .split("\n")
    .map((line) => {
      const m = /^(\s*)([\s\S]*?)(\s*)$/.exec(line);
      return m[2] ? m[1] + fn(m[2]) + m[3] : line;
    })
    .join("\n");
  return { text: text.slice(0, s) + out + text.slice(e), s, e: s + out.length };
}

/**
 * Formatting a selection of the editor: kind "negrito" (puts or takes the bold), a color of FORMAT_COLORS (puts it,
 * changes it or, the same one again, takes it) or "sem-cor". Returns {text, s, e} (the new selection). Without a
 * selection, the marks go in with the cursor in the middle, to write.
 */
export function formatText(text, s, e, kind) {
  text = String(text || "");
  s = Math.max(0, Math.min(s, text.length));
  e = Math.max(s, Math.min(e, text.length));
  const sel = text.slice(s, e);
  const color = FORMAT_COLORS.includes(kind) ? kind : "";
  if (kind === "negrito") {
    // the selection already between ** (inside or around): the bold goes away
    if (text.slice(s - 2, s) === "**" && text.slice(e, e + 2) === "**") return { text: text.slice(0, s - 2) + sel + text.slice(e + 2), s: s - 2, e: e - 2 };
    if (/^\*\*[\s\S]+\*\*$/.test(sel)) return { text: text.slice(0, s) + sel.slice(2, -2) + text.slice(e), s, e: e - 4 };
    if (s === e) return { text: `${text.slice(0, s)}****${text.slice(e)}`, s: s + 2, e: s + 2 };
    return eachPiece(text, s, e, (p) => `**${p}**`);
  }
  if (!color && kind !== "sem-cor") return { text, s, e };
  // the selection is the text of a color: change the color, or take it (the same one, or Sem cor)
  const before = /\{([a-z]+):$/.exec(text.slice(Math.max(0, s - 12), s));
  if (before && FORMAT_COLORS.includes(before[1]) && text[e] === "}") {
    const open = s - before[0].length;
    if (!color || color === before[1]) return { text: text.slice(0, open) + sel + text.slice(e + 1), s: open, e: open + sel.length };
    const head = `{${color}:`;
    return { text: text.slice(0, open) + head + sel + text.slice(e), s: open + head.length, e: open + head.length + sel.length };
  }
  // the selection is a whole color part, with its marks (as it stays after putting it): the same toggle
  const whole = new RegExp(`^\\{(${COLOR_ALT}):([^{}\\n]+)\\}$`).exec(sel);
  if (whole) {
    if (!color || color === whole[1]) return { text: text.slice(0, s) + whole[2] + text.slice(e), s, e: s + whole[2].length };
    const swapped = `{${color}:${whole[2]}}`;
    return { text: text.slice(0, s) + swapped + text.slice(e), s, e: s + swapped.length };
  }
  // the colors inside the selection go away (Sem cor, or before the new one)
  const bare = sel.replace(new RegExp(`\\{(?:${COLOR_ALT}):([^{}\\n]+)\\}`, "g"), "$1");
  if (!color) return { text: text.slice(0, s) + bare + text.slice(e), s, e: s + bare.length };
  if (s === e) {
    const head = `{${color}:`;
    return { text: `${text.slice(0, s)}${head}}${text.slice(e)}`, s: s + head.length, e: s + head.length };
  }
  const t = text.slice(0, s) + bare + text.slice(e);
  return eachPiece(t, s, s + bare.length, (p) => `{${color}:${p.replace(/[{}]/g, "")}}`);
}
