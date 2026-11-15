// Negrito e cor numa parte do texto (1.27.0) e, desde a 1.29.0, Maior. A folha guarda o texto como foi escrito, com as
// marcas: **negrito**, ++maior++ e {cor:texto} (as cores da paleta abaixo). Fora do editor, a parte aparece em negrito,
// maior ou na cor e as marcas somem; no relatório, nos títulos, na busca e nos outros apps fica só o texto. Shared by the screen (frontend), the report,
// the sensor and the integration, like links.js.

/** The colors of a part of the text (ids of the palette of the app). */
export const FORMAT_COLORS = ["vermelho", "laranja", "verde", "azul", "lilas"];
const COLOR_ALT = FORMAT_COLORS.join("|");
// **bold** or ++bigger++ (not starting or ending with a space) or {color:text} (one line, no braces inside)
const FMT = () => new RegExp(`\\*\\*(?=\\S)([^\\n]*?\\S)\\*\\*|\\+\\+(?=\\S)([^\\n]*?\\S)\\+\\+|\\{(${COLOR_ALT}):([^{}\\n]+)\\}`, "g");
// the marks that go around a part, by the kind of the bar
const PAIRS = { negrito: "**", maior: "++" };
const esc = (t) => t.replace(/[*+]/g, "\\$&");

/** Whether the text has a part in bold or in a color. */
export const hasFormat = (text) => FMT().test(String(text || ""));

/**
 * The parts of a piece of text: [{text, start (where the text of the part starts in the source), bold, big, color}]. The
 * marks are left out; a bold part can have a color inside and the other way round (and a bigger one too).
 */
export function parseFormat(s, base = 0, inherit = {}) {
  const src = String(s || "");
  const out = [];
  const re = FMT();
  let at = 0;
  let m;
  const plain = (from, to) => {
    if (to > from) out.push({ text: src.slice(from, to), start: base + from, bold: !!inherit.bold, big: !!inherit.big, color: inherit.color || "" });
  };
  while ((m = re.exec(src))) {
    plain(at, m.index);
    if (m[1] != null) out.push(...parseFormat(m[1], base + m.index + 2, { ...inherit, bold: true }));
    else if (m[2] != null) out.push(...parseFormat(m[2], base + m.index + 2, { ...inherit, big: true }));
    else out.push(...parseFormat(m[4], base + m.index + m[3].length + 2, { ...inherit, color: m[3] }));
    at = m.index + m[0].length;
  }
  plain(at, src.length);
  return out;
}

/**
 * 1.28.0: every character of the text, in runs: the marks (mark: true) and the text, each with its bold and color. While
 * writing, the screen draws these over the editor, so the bold and the colors show with the marks faint.
 */
export function markRuns(s, inherit = {}) {
  const src = String(s || "");
  const out = [];
  const re = FMT();
  let at = 0;
  let m;
  const put = (t, mark, st) => t && out.push({ text: t, mark, bold: !!st.bold, big: !!st.big, color: st.color || "" });
  while ((m = re.exec(src))) {
    put(src.slice(at, m.index), false, inherit);
    if (m[1] != null || m[2] != null) {
      const k = m[1] != null ? "**" : "++";
      const st = { ...inherit, [m[1] != null ? "bold" : "big"]: true };
      put(k, true, st);
      out.push(...markRuns(m[1] != null ? m[1] : m[2], st));
      put(k, true, st);
    } else {
      const st = { ...inherit, color: m[3] };
      put(`{${m[3]}:`, true, st);
      out.push(...markRuns(m[4], st));
      put("}", true, st);
    }
    at = m.index + m[0].length;
  }
  put(src.slice(at), false, inherit);
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
 * Formatting a selection of the editor: kind "negrito" or "maior" (puts or takes it), a color of FORMAT_COLORS (puts it,
 * changes it or, the same one again, takes it) or "sem-cor". Returns {text, s, e} (the new selection). Without a
 * selection, the marks go in with the cursor in the middle, to write.
 */
export function formatText(text, s, e, kind) {
  text = String(text || "");
  s = Math.max(0, Math.min(s, text.length));
  e = Math.max(s, Math.min(e, text.length));
  const sel = text.slice(s, e);
  const color = FORMAT_COLORS.includes(kind) ? kind : "";
  const k = PAIRS[kind];
  if (k) {
    // the selection already between the marks (inside or around): they go away
    if (text.slice(s - 2, s) === k && text.slice(e, e + 2) === k) return { text: text.slice(0, s - 2) + sel + text.slice(e + 2), s: s - 2, e: e - 2 };
    if (new RegExp(`^${esc(k)}[\\s\\S]+${esc(k)}$`).test(sel)) return { text: text.slice(0, s) + sel.slice(2, -2) + text.slice(e), s, e: e - 4 };
    if (s === e) return { text: `${text.slice(0, s)}${k}${k}${text.slice(e)}`, s: s + 2, e: s + 2 };
    return eachPiece(text, s, e, (p) => `${k}${p}${k}`);
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

const WORD = /[\p{L}\p{M}\p{N}_]/u;

/**
 * 1.28.0: Negrito or a color with the cursor in a word, without selecting (on the phone, selecting brings the menu of
 * the system over the app): the part with the cursor inside loses or changes its marks; otherwise the word under the
 * cursor gets them; between words, the marks go in to write, as in formatText. The cursor stays in the same place of
 * the text. Returns {text, s, e}.
 */
export function formatAt(text, pos, kind) {
  text = String(text || "");
  pos = Math.max(0, Math.min(pos, text.length));
  const color = FORMAT_COLORS.includes(kind) ? kind : "";
  const pair = PAIRS[kind];
  if (!pair && !color && kind !== "sem-cor") return { text, s: pos, e: pos };
  // the part with the cursor inside (from the first mark to the last)
  const re = pair ? new RegExp(`${esc(pair)}(?=\\S)([^\\n]*?\\S)${esc(pair)}`, "g") : new RegExp(`\\{(${COLOR_ALT}):([^{}\\n]+)\\}`, "g");
  let m;
  while ((m = re.exec(text))) {
    const a = m.index;
    const z = a + m[0].length;
    // right at the edge of the part counts, unless the cursor is touching another word there
    if (pos < a || pos > z || (pos === a && a > 0 && WORD.test(text[a - 1])) || (pos === z && z < text.length && WORD.test(text[z]))) continue;
    const head = pair ? 2 : m[1].length + 2;
    const inner = pair ? m[1] : m[2];
    const at = (p) => Math.max(a, Math.min(a + inner.length, p - head));
    if (pair || !color || color === m[1]) return { text: text.slice(0, a) + inner + text.slice(z), s: at(pos), e: at(pos) };
    const swapped = `{${color}:${inner}}`;
    const c = pos + (color.length - m[1].length);
    return { text: text.slice(0, a) + swapped + text.slice(z), s: Math.max(a, c), e: Math.max(a, c) };
  }
  if (!color && kind === "sem-cor") return { text, s: pos, e: pos };
  // Maior is for a title: the whole line of the cursor (without the spaces around it)
  if (kind === "maior") {
    const ls = text.lastIndexOf("\n", pos - 1) + 1;
    const le = text.indexOf("\n", pos) < 0 ? text.length : text.indexOf("\n", pos);
    const line = text.slice(ls, le);
    if (!line.trim()) return formatText(text, pos, pos, kind);
    const lead = line.length - line.trimStart().length;
    const r = formatText(text, ls + lead, ls + line.trimEnd().length, kind);
    const c = pos < ls + lead ? pos : pos + 2;
    return { text: r.text, s: c, e: c };
  }
  // the word under the cursor (or touching it)
  let a = pos;
  let z = pos;
  while (a > 0 && WORD.test(text[a - 1])) a--;
  while (z < text.length && WORD.test(text[z])) z++;
  if (a === z) return formatText(text, pos, pos, kind);
  const r = formatText(text, a, z, kind);
  const shift = r.text.indexOf(text.slice(a, z), a) - a;
  const c = pos + Math.max(0, shift);
  return { text: r.text, s: c, e: c };
}
