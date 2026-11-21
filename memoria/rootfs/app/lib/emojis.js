// 1.41.0: the emojis of the Relatório in PDF. The PDF is made here, with Helvetica, which has no emojis; so the page
// of the Relatório draws each emoji it shows once (48 × 48, with transparency) and sends the picture, which is kept in
// /data/emojis (one small file for each emoji). The PDF puts the picture where the emoji is; one without a picture is
// left out, as before. They are pictures of how the phone draws its emojis: nothing of the notes goes in them.
import fs from "node:fs";
import path from "node:path";
import { EMOJI_RE } from "./report.js";

export const SIZE = 48;
const BYTES = SIZE * SIZE * 4;
const MAX_FILES = 800;
const MAX_ONCE = 150;

/** One emoji exactly (as EMOJI_RE reads it), up to 40 letters. */
export function oneEmoji(s) {
  if (typeof s !== "string" || !s || s.length > 40) return false;
  const m = s.match(EMOJI_RE);
  return !!m && m.length === 1 && m[0] === s;
}

/** The name of its file: the code points, "2615-fe0f.rgba". */
export const fileOf = (e) => `${[...e].map((c) => c.codePointAt(0).toString(16)).join("-")}.rgba`;

export class Emojis {
  constructor(dataDir, log = null) {
    this.dir = path.join(dataDir, "emojis");
    this.log = log;
  }

  /** Map(emoji -> {w, h, rgba}) of the ones asked that have a picture. */
  load(list) {
    const out = new Map();
    for (const e of list || []) {
      if (!oneEmoji(e)) continue;
      try {
        const rgba = fs.readFileSync(path.join(this.dir, fileOf(e)));
        if (rgba.length === BYTES) out.set(e, { w: SIZE, h: SIZE, rgba });
      } catch (err) {
        /* no picture yet */
      }
    }
    return out;
  }

  /** The ones of the list without a picture. */
  missing(list) {
    const have = this.load(list);
    return (list || []).filter((e) => oneEmoji(e) && !have.has(e));
  }

  /**
   * Keeps the pictures sent: {emoji: base64 of 48 × 48 × 4 bytes (RGBA)}. Only one emoji as the key, only the right
   * size, not all transparent, and not over one already kept. Returns how many were kept.
   */
  save(glifos) {
    if (!glifos || typeof glifos !== "object" || Array.isArray(glifos)) return 0;
    let n = 0;
    let have = null;
    for (const [e, b64] of Object.entries(glifos).slice(0, MAX_ONCE)) {
      if (!oneEmoji(e) || typeof b64 !== "string" || b64.length > BYTES * 2) continue;
      const rgba = Buffer.from(b64, "base64");
      if (rgba.length !== BYTES) continue;
      let ink = false;
      for (let i = 3; i < BYTES; i += 4) if (rgba[i] > 8) { ink = true; break; }
      if (!ink) continue;
      const file = path.join(this.dir, fileOf(e));
      if (fs.existsSync(file)) continue;
      if (have == null) {
        fs.mkdirSync(this.dir, { recursive: true });
        have = fs.readdirSync(this.dir).length;
      }
      if (have >= MAX_FILES) break;
      const tmp = `${file}.tmp`;
      fs.writeFileSync(tmp, rgba, { mode: 0o600 });
      fs.renameSync(tmp, file);
      have++;
      n++;
    }
    return n;
  }
}
