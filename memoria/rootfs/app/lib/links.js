// Links in the sheets (1.6.0). A sheet keeps its text as written; a link is either a bare address in it
// (https://…, www.…) or one added with a name, kept as [Nome](https://…). Outside the editor, each link shows as a
// short chip (the name, or the site and a bit of the address) instead of the long address. Only http and https.
// Shared by the screen (frontend), the report and the sensor.

const MAX_NAME = 120;
const TRAIL = /[.,;:!?…'"»”’*]$/;
// [Nome](https://…) — the address may have balanced parentheses (Wikipedia) — or a bare address.
const LINK_RE = /\[([^[\]\n]{1,200})\]\((https?:\/\/[^\s()<>]+(?:\([^\s()<>]*\)[^\s()<>]*)*)\)|((?:https?:\/\/|www\.)[^\s<>"]+)/gi;

const count = (s, ch) => s.split(ch).length - 1;

/** The address as a link the app opens, or null (only http/https, with a real host). */
function safeUrl(href) {
  let u;
  try {
    u = new URL(href);
  } catch (e) {
    return null;
  }
  if (u.protocol !== "http:" && u.protocol !== "https:") return null;
  const host = u.hostname;
  if (!host || (!host.includes(".") && host !== "localhost")) return null;
  if (host.split(".").some((part) => !part || /^-|-$/.test(part))) return null;
  return u.href;
}

/** A bare address found in the text: without the punctuation that ends a sentence around it. */
function trimBare(raw) {
  let s = raw;
  for (;;) {
    const last = s.slice(-1);
    if (TRAIL.test(s)) s = s.slice(0, -1);
    else if (last === ")" && count(s, "(") < count(s, ")")) s = s.slice(0, -1);
    else if (last === "]" && count(s, "[") < count(s, "]")) s = s.slice(0, -1);
    else break;
  }
  return s;
}

const decode = (s) => {
  try {
    return decodeURIComponent(s);
  } catch (e) {
    return s;
  }
};
const clip = (s, n) => (s.length > n ? `${s.slice(0, n - 1).trimEnd()}…` : s);

/** The site of an address, without www: "google.com". */
export function domainOf(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch (e) {
    return "";
  }
}

/**
 * A short name for an address: the site and the first part of the path ("youtube.com/watch…"), or, for a search,
 * the site and what was searched ("google.com · receita de bolo").
 */
export function shortUrl(url) {
  let u;
  try {
    u = new URL(url);
  } catch (e) {
    return clip(String(url || ""), 32);
  }
  const host = u.host.replace(/^www\./, "");
  const q = ["q", "query", "search_query", "p", "k"].map((k) => u.searchParams.get(k)).find((v) => v && v.trim());
  if (q) return clip(`${host} · ${q.trim().replace(/\s+/g, " ")}`, 40);
  const segs = u.pathname.split("/").filter(Boolean).map(decode);
  if (!segs.length) return clip(host + (u.search || u.hash ? "/…" : ""), 36);
  // the last part of the path says the most (the article, the video, the recipe)
  const label = segs.length > 1 ? `${host}/…/${segs[segs.length - 1]}` : `${host}/${segs[0]}`;
  return clip(label + (label.length < 36 && (u.search || u.hash) ? "…" : ""), 36);
}

/**
 * The text in parts: [{type: "text", text, start}] and [{type: "link", url, name, label, start, end}] (start and end:
 * where it is in the text, so the editor can put the cursor where it was tapped).
 */
export function parseLinks(text) {
  const s = String(text || "");
  const out = [];
  let from = 0;
  const pushText = (end) => {
    if (end > from) out.push({ type: "text", text: s.slice(from, end), start: from });
  };
  LINK_RE.lastIndex = 0;
  let m;
  while ((m = LINK_RE.exec(s))) {
    let start = m.index;
    let end = start + m[0].length;
    let url = null;
    let name = "";
    if (m[2]) {
      url = safeUrl(m[2]);
      name = m[1].replace(/\s+/g, " ").trim();
      if (!name || !url) {
        // not a good [Nome](address): look again from the next letter (a bare address inside it still counts)
        LINK_RE.lastIndex = start + 1;
        continue;
      }
    } else {
      // an address right after a letter or a digit is part of a word (e.g. "xhttps://"): not a link
      if (start > 0 && /[\p{L}\p{N}@/]/u.test(s[start - 1])) continue;
      const raw = trimBare(m[3]);
      end = start + raw.length;
      if (/^www\./i.test(raw)) url = raw.length > 4 ? safeUrl(`https://${raw}`) : null;
      else url = safeUrl(raw);
      LINK_RE.lastIndex = end;
    }
    if (!url) continue;
    pushText(start);
    out.push({ type: "link", url, name: clip(name, MAX_NAME), label: name ? clip(name, 40) : shortUrl(url), start, end });
    from = end;
  }
  pushText(s.length);
  return out;
}

/** Whether the text has a link. */
export const hasLinks = (text) => parseLinks(text).some((p) => p.type === "link");

/**
 * The text with each link as it reads outside the app: the name, or the short address; with domain (the report,
 * the PDF), "Nome (site)".
 */
export function linksToText(text, { domain = false } = {}) {
  return parseLinks(text)
    .map((p) => (p.type === "text" ? p.text : p.name ? (domain ? `${p.name} (${domainOf(p.url)})` : p.name) : p.label))
    .join("");
}

/** What was typed in Link (Adicionar link) as an address, or null: "site.com/x" becomes "https://site.com/x". */
export function normalizeUrl(input) {
  const s = String(input || "").trim();
  if (!s || /\s/.test(s)) return null;
  if (/^https?:\/\//i.test(s)) return safeUrl(s);
  if (/^[a-z][a-z0-9+.-]*:/i.test(s) && !/^[^:/]+:\d+(\/|$)/.test(s)) return null; // another scheme (javascript:, mailto:…)
  return safeUrl(`https://${s.replace(/^\/+/, "")}`);
}

/** The link as it is kept in the sheet: [Nome](https://…), or just the address without a name. */
export function linkMarkdown(url, name = "") {
  const n = String(name || "").replace(/[[\]]/g, "").replace(/\s+/g, " ").trim().slice(0, MAX_NAME);
  return n ? `[${n}](${String(url).replace(/\(/g, "%28").replace(/\)/g, "%29")})` : url;
}
