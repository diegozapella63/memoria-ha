// A small PDF writer (no dependencies): A4 pages with text in Helvetica (regular and bold, WinAnsi, the accents of
// Portuguese), lines, rectangles (rounded too) and paths. Coordinates from the top-left, in points. It makes the
// report of the app a file to download, since the app Home Assistant on the phone doesn't print a page.
// The same file in the ResolvIA and the MemorIA (tools/iguais.py): the name of the app goes in `producer`.

// Widths of the characters 32..255 (WinAnsi) in 1/1000 of the size, from the metrics of the standard fonts
const REGULAR = [278,278,355,556,556,889,667,191,333,333,389,584,278,333,278,278,556,556,556,556,556,556,556,556,556,556,278,278,584,584,584,556,1015,667,667,722,722,667,611,778,722,278,500,667,556,833,722,778,667,778,722,667,611,722,667,944,667,667,611,278,278,278,469,556,333,556,556,500,556,556,278,556,556,222,222,500,222,833,556,556,556,556,333,500,278,556,500,722,500,500,500,334,260,334,584,350,556,350,222,556,333,1000,556,556,333,1000,667,333,1000,350,611,350,350,222,222,333,333,350,556,1000,333,1000,500,333,944,350,500,667,278,333,556,556,556,556,260,556,333,737,370,556,584,333,737,333,400,584,333,333,333,556,537,278,333,333,365,556,834,834,834,611,667,667,667,667,667,667,1000,722,667,667,667,667,278,278,278,278,722,722,778,778,778,778,778,584,778,722,722,722,722,667,667,611,556,556,556,556,556,556,889,500,556,556,556,556,278,278,278,278,556,556,556,556,556,556,556,584,611,556,556,556,556,500,556,500];
const BOLD = [278,333,474,556,556,889,722,238,333,333,389,584,278,333,278,278,556,556,556,556,556,556,556,556,556,556,333,333,584,584,584,611,975,722,722,722,722,667,611,778,722,278,556,722,611,833,722,778,667,778,722,667,611,722,667,944,667,667,611,333,278,333,584,556,333,556,611,556,611,556,333,611,611,278,278,556,278,889,611,611,611,611,389,556,333,611,556,778,556,556,500,389,280,389,584,350,556,350,278,556,500,1000,556,556,333,1000,667,333,1000,350,611,350,350,278,278,500,500,350,556,1000,333,1000,556,333,944,350,500,667,278,333,556,556,556,556,280,556,333,737,370,556,584,333,737,333,400,584,333,333,333,611,556,278,333,333,365,556,834,834,834,611,722,722,722,722,722,722,1000,722,667,667,667,667,278,278,278,278,722,722,778,778,778,778,778,584,778,722,722,722,722,667,667,611,556,556,556,556,556,556,889,556,556,556,556,556,278,278,278,278,611,611,611,611,611,611,611,584,611,611,611,611,611,556,611,556];

// the characters of WinAnsi outside Latin-1 (0x80..0x9F)
const EXTRA = { "€": 0x80, "‚": 0x82, "„": 0x84, "…": 0x85, "‘": 0x91, "’": 0x92, "“": 0x93, "”": 0x94, "•": 0x95, "–": 0x96, "—": 0x97, "™": 0x99 };

/** The byte of a character in WinAnsi ("?" when it has none). */
function byteOf(ch) {
  const c = ch.codePointAt(0);
  if (EXTRA[ch]) return EXTRA[ch];
  if ((c >= 32 && c < 127) || (c >= 0xa0 && c <= 0xff)) return c;
  return 63;
}

/** Text as WinAnsi bytes. */
export function winAnsi(s) {
  return Buffer.from([...String(s ?? "").normalize("NFC")].map(byteOf));
}

/** The width of a text in points (spacing: points between the letters). */
export function textWidth(s, size, bold = false, spacing = 0) {
  const t = bold ? BOLD : REGULAR;
  const bytes = winAnsi(s);
  let w = 0;
  for (const b of bytes) w += t[b - 32] || 0;
  return (w * size) / 1000 + spacing * Math.max(0, bytes.length - 1);
}

/** A text broken into lines that fit the width (a long word is cut). */
export function wrap(s, width, size, bold = false) {
  const out = [];
  let line = "";
  for (const word of String(s ?? "").split(/\s+/).filter(Boolean)) {
    const next = line ? `${line} ${word}` : word;
    if (textWidth(next, size, bold) <= width) {
      line = next;
      continue;
    }
    if (line) out.push(line);
    line = word;
    while (textWidth(line, size, bold) > width && line.length > 1) {
      let n = line.length - 1;
      while (n > 1 && textWidth(line.slice(0, n), size, bold) > width) n--;
      out.push(line.slice(0, n));
      line = line.slice(n);
    }
  }
  if (line) out.push(line);
  return out.length ? out : [""];
}

/** "#ff8a65" -> "1 0.541 0.396". */
export function rgb(hex) {
  const m = /^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(hex || "") || [0, "00", "00", "00"];
  return [m[1], m[2], m[3]].map((h) => +(parseInt(h, 16) / 255).toFixed(3)).join(" ");
}

const n = (v) => +v.toFixed(2);
// a literal string of PDF from bytes: ( ) \ escaped, the bytes outside ASCII in octal
const lit = (buf) => {
  let s = "(";
  for (const b of buf) s += b === 40 || b === 41 || b === 92 ? `\\${String.fromCharCode(b)}` : b < 32 || b > 126 ? `\\${b.toString(8).padStart(3, "0")}` : String.fromCharCode(b);
  return `${s})`;
};

export class Pdf {
  constructor({ width = 595.28, height = 841.89, title = "", producer = "" } = {}) {
    this.W = width;
    this.H = height;
    this.title = title;
    this.producer = producer;
    this.pages = [];
    this.addPage();
  }

  addPage() {
    this.ops = [];
    this.pages.push(this.ops);
    return this;
  }

  /** Text at x, with its baseline at y (from the top). align: left | right | center (x is that edge); spacing: points
   * between the letters (like letter-spacing). */
  text(x, y, s, { size = 11, bold = false, color = "#141a22", align = "left", spacing = 0 } = {}) {
    const w = align === "left" ? 0 : textWidth(s, size, bold, spacing);
    const left = align === "right" ? x - w : align === "center" ? x - w / 2 : x;
    // the spacing is kept by the graphics state: q … Q gives it back to the next texts
    const t = `BT /${bold ? "F2" : "F1"} ${size} Tf ${spacing ? `${n(spacing)} Tc ` : ""}${rgb(color)} rg ${n(left)} ${n(this.H - y)} Td ${lit(winAnsi(s))} Tj ET`;
    this.ops.push(spacing ? `q ${t} Q` : t);
    return this;
  }

  line(x1, y1, x2, y2, { color = "#e3e7ec", width = 0.8, cap = 0 } = {}) {
    this.ops.push(`q ${rgb(color)} RG ${width} w ${cap} J ${n(x1)} ${n(this.H - y1)} m ${n(x2)} ${n(this.H - y2)} l S Q`);
    return this;
  }

  /** A rectangle (rounded with r), filled and/or stroked. */
  rect(x, y, w, h, { fill = null, stroke = null, width = 0.8, r = 0 } = {}) {
    const k = 0.5523 * r;
    const X = x;
    const Y = this.H - y - h; // bottom
    const p = !r
      ? `${n(X)} ${n(Y)} ${n(w)} ${n(h)} re`
      : [
          `${n(X + r)} ${n(Y)} m`,
          `${n(X + w - r)} ${n(Y)} l`,
          `${n(X + w - r + k)} ${n(Y)} ${n(X + w)} ${n(Y + r - k)} ${n(X + w)} ${n(Y + r)} c`,
          `${n(X + w)} ${n(Y + h - r)} l`,
          `${n(X + w)} ${n(Y + h - r + k)} ${n(X + w - r + k)} ${n(Y + h)} ${n(X + w - r)} ${n(Y + h)} c`,
          `${n(X + r)} ${n(Y + h)} l`,
          `${n(X + r - k)} ${n(Y + h)} ${n(X)} ${n(Y + h - r + k)} ${n(X)} ${n(Y + h - r)} c`,
          `${n(X)} ${n(Y + r)} l`,
          `${n(X)} ${n(Y + r - k)} ${n(X + r - k)} ${n(Y)} ${n(X + r)} ${n(Y)} c h`,
        ].join(" ");
    const paint = fill && stroke ? "B" : fill ? "f" : "S";
    this.ops.push(`q ${fill ? `${rgb(fill)} rg` : ""} ${stroke ? `${rgb(stroke)} RG ${width} w` : ""} ${p} ${paint} Q`);
    return this;
  }

  /** A path of points [[x, y], ...] (from the top), filled or stroked. */
  path(points, { fill = null, stroke = null, width = 1, close = false, round = false } = {}) {
    const p = points.map(([x, y], i) => `${n(x)} ${n(this.H - y)} ${i ? "l" : "m"}`).join(" ") + (close ? " h" : "");
    this.ops.push(`q ${round ? "1 J 1 j" : ""} ${fill ? `${rgb(fill)} rg` : ""} ${stroke ? `${rgb(stroke)} RG ${width} w` : ""} ${p} ${fill && stroke ? "B" : fill ? "f" : "S"} Q`);
    return this;
  }

  /** The file. */
  build() {
    const objs = [];
    const add = (body) => objs.push(body) && objs.length;
    const catalog = add(null);
    const pagesId = add(null);
    const f1 = add("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>");
    const f2 = add("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>");
    const kids = [];
    for (const ops of this.pages) {
      const content = Buffer.from(ops.join("\n"), "latin1");
      const c = add(Buffer.concat([Buffer.from(`<< /Length ${content.length} >>\nstream\n`), content, Buffer.from("\nendstream")]));
      kids.push(add(`<< /Type /Page /Parent ${pagesId} 0 R /MediaBox [0 0 ${this.W} ${this.H}] /Resources << /Font << /F1 ${f1} 0 R /F2 ${f2} 0 R >> >> /Contents ${c} 0 R >>`));
    }
    objs[catalog - 1] = `<< /Type /Catalog /Pages ${pagesId} 0 R >>`;
    objs[pagesId - 1] = `<< /Type /Pages /Kids [${kids.map((k) => `${k} 0 R`).join(" ")}] /Count ${kids.length} >>`;
    const info = add(Buffer.concat([Buffer.from("<< /Producer "), Buffer.from(lit(winAnsi(this.producer)), "latin1"), Buffer.from(" /Title "), Buffer.from(lit(winAnsi(this.title)), "latin1"), Buffer.from(" >>")]));
    const parts = [Buffer.from("%PDF-1.4\n%\xe2\xe3\xcf\xd3\n", "latin1")];
    let off = parts[0].length;
    const xref = [];
    objs.forEach((body, i) => {
      xref.push(off);
      const b = Buffer.concat([Buffer.from(`${i + 1} 0 obj\n`), Buffer.isBuffer(body) ? body : Buffer.from(body, "latin1"), Buffer.from("\nendobj\n")]);
      parts.push(b);
      off += b.length;
    });
    const tail = `xref\n0 ${objs.length + 1}\n0000000000 65535 f \n${xref.map((o) => `${String(o).padStart(10, "0")} 00000 n \n`).join("")}trailer\n<< /Size ${objs.length + 1} /Root ${catalog} 0 R /Info ${info} 0 R >>\nstartxref\n${off}\n%%EOF\n`;
    parts.push(Buffer.from(tail, "latin1"));
    return Buffer.concat(parts);
  }
}
