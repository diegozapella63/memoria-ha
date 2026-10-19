// Pure helpers shared by the MemorIA screens.

export const PALETTE = [
  { id: "vermelho", label: "Vermelho", fill: "#FF5A4F", ink: "#C42A1F" },
  { id: "coral", label: "Coral", fill: "#FF8A65", ink: "#C2410C" },
  { id: "rosa", label: "Rosa", fill: "#FF77A9", ink: "#BE185D" },
  { id: "framboesa", label: "Framboesa", fill: "#E8508A", ink: "#A3124F" },
  { id: "laranja", label: "Laranja", fill: "#FFA23E", ink: "#B45309" },
  { id: "ouro", label: "Ouro", fill: "#F2C14E", ink: "#8A6100" },
  { id: "lilas", label: "Lilás", fill: "#B99BFF", ink: "#6D3FD6" },
  { id: "azul", label: "Azul", fill: "#62B5FF", ink: "#0B67A8" },
  { id: "menta", label: "Menta", fill: "#4ED3A6", ink: "#0E7A57" },
  { id: "grafite", label: "Grafite", fill: "#B9ADAE", ink: "#5E5253" },
];
export const colorById = (id) => PALETTE.find((c) => c.id === id);

export function hexToRgba(hex, alpha) {
  const h = hex.replace("#", "");
  const n = parseInt(h.length === 3 ? h.replace(/./g, (c) => c + c) : h, 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
}

export function colorVars(color, dark, prefix = "c") {
  return `--${prefix}:${color.fill};--${prefix}i:${dark ? color.fill : color.ink};--${prefix}s:${hexToRgba(color.fill, dark ? 0.17 : 0.15)};`;
}


// ---------- text ----------

export const fold = (s) =>
  (s || "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();

// Same length as the input, so indexes map back to the original string.
export const foldKeepLength = (s) =>
  Array.from(s || "", (ch) => {
    const f = ch.normalize("NFD")[0] || ch;
    return f.toLowerCase().length === 1 ? f.toLowerCase() : ch;
  }).join("");

export const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;

export const clip = (s, n = 38) => (s.length > n ? s.slice(0, n - 1).trimEnd() + "…" : s);

// ---------- dates ----------

const WEEKDAYS = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
const MONTHS = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];

const pad = (n) => String(n).padStart(2, "0");
export const ymd = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
export const hm = (d) => `${pad(d.getHours())}:${pad(d.getMinutes())}`;

export function fromYmd(s) {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function addDays(date, n) {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  d.setDate(d.getDate() + n);
  return d;
}

/** "hoje, 14:32" / "ontem" / "sex, 17 out" — how a page shows when it was written. */
export function writtenAt(ms, now = new Date()) {
  const d = new Date(ms);
  const days = Math.round((new Date(now.getFullYear(), now.getMonth(), now.getDate()) - new Date(d.getFullYear(), d.getMonth(), d.getDate())) / 86400000);
  if (days === 0) return `hoje, ${hm(d)}`;
  if (days === 1) return `ontem, ${hm(d)}`;
  const wd = WEEKDAYS[d.getDay()].slice(0, 3).toLowerCase();
  const base = `${wd}, ${d.getDate()} ${MONTHS[d.getMonth()]}`;
  return d.getFullYear() === now.getFullYear() ? base : `${base} ${d.getFullYear()}`;
}

export const newId = () =>
  Array.from(crypto.getRandomValues(new Uint8Array(6)), (b) => b.toString(16).padStart(2, "0")).join("");

export const firstLine = (text) => ((text || "").split("\n").find((l) => l.trim()) || "").trim();

export function greeting(name, now = new Date()) {
  const h = now.getHours();
  const hello = h >= 5 && h < 12 ? "Bom dia" : h >= 12 && h < 18 ? "Boa tarde" : "Boa noite";
  const first = (name || "").trim().split(/\s+/)[0];
  return first ? `${hello}, ${first}` : hello;
}


// ---------- photos ----------

/** Shrink a photo before upload (keeps text readable, saves bandwidth). */
export async function prepareImage(file, max = 1800) {
  const toBase64 = (blob) =>
    new Promise((resolve, reject) => {
      const r = new FileReader();
      r.onload = () => resolve(String(r.result).split(",")[1] || "");
      r.onerror = () => reject(r.error);
      r.readAsDataURL(blob);
    });
  try {
    const bmp = await createImageBitmap(file, { imageOrientation: "from-image" });
    const scale = Math.min(1, max / Math.max(bmp.width, bmp.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bmp.width * scale);
    canvas.height = Math.round(bmp.height * scale);
    canvas.getContext("2d").drawImage(bmp, 0, 0, canvas.width, canvas.height);
    if (bmp.close) bmp.close();
    const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.86));
    return { mime: "image/jpeg", data: await toBase64(blob), url: URL.createObjectURL(blob) };
  } catch (e) {
    return { mime: file.type || "image/jpeg", data: await toBase64(file), url: URL.createObjectURL(file) };
  }
}
