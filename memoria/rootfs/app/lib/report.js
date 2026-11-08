// Mais › Relatório: the notebooks (blocks) and their sheets, to see, print or download as PDF, like the reports of the
// other apps of the family (ResolvIA, GerencIA): the header of the apps (a card with the stripe in the color of the
// app, the icon, MemorIA · anotações, the title, the count and when), the choice of the category and of the block,
// Voltar and Baixar PDF, the charts (by category, by block), a part per block with its sheets and, at the end, the
// mark of CorrerIA Code as in Mais › Sobre. The PDF is made here (the app Home Assistant on the phone doesn't print
// a page): the same parts, and the mark and the page at the foot of each page.
import { Pdf, wrap, textWidth } from "./pdf.js";
import { parseLinks, linksToText, domainOf } from "./links.js";

// The colors of the app (frontend/src/util.js PALETTE)
export const PALETTE = {
  vermelho: "#FF5A4F", coral: "#FF8A65", rosa: "#FF77A9", framboesa: "#E8508A", laranja: "#FFA23E",
  ouro: "#F2C14E", lilas: "#B99BFF", azul: "#62B5FF", menta: "#4ED3A6", grafite: "#B9ADAE",
};
const PERIOD_LABEL = { manha: "manhã", tarde: "tarde", noite: "noite" };
const DEFAULT_COLOR = "#B99BFF";

const pad = (n) => String(n).padStart(2, "0");
const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const okColor = (c, fallback = DEFAULT_COLOR) => (/^#[0-9a-f]{6}$/i.test(c || "") ? c : fallback);
const day = (ms) => {
  const d = new Date(ms);
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
};
const whenGenerated = (ms) => {
  const d = new Date(ms);
  return `${day(ms)} às ${pad(d.getHours())}:${pad(d.getMinutes())}`;
};
const byCreated = (a, b) => a.created - b.created || (a.id < b.id ? -1 : 1);

/** How a line of a sheet reads in the PDF: each link as its name and site ("Receita (site.com.br)"). */
export const readable = (text) => linksToText(text, { domain: true });

/** A line of a sheet in the page: each link as its name and site, a link that opens outside. */
export function lineHtml(text) {
  return parseLinks(text)
    .map((p) => (p.type === "text" ? esc(p.text) : `<a href="${esc(p.url)}" target="_blank" rel="noopener noreferrer">${esc(p.name ? `${p.name} (${domainOf(p.url)})` : p.label)}</a>`))
    .join("");
}

/** The lines of a sheet (as written): the first one with text is its title; the rest keeps its line breaks. */
export function sheetParts(text) {
  const lines = String(text || "").replace(/\r\n?/g, "\n").split("\n");
  const i = lines.findIndex((l) => l.trim());
  if (i < 0) return { title: "", body: [] };
  const body = lines.slice(i + 1);
  while (body.length && !body[0].trim()) body.shift();
  while (body.length && !body[body.length - 1].trim()) body.pop();
  return { title: lines[i].trim(), body };
}

/** "abre de manhã (05:00), à noite (18:00) e às 07:00". */
export function opensText(b, periods) {
  const parts = [
    ...(b.periods || []).map((id) => `${id === "manha" ? "de" : "à"} ${PERIOD_LABEL[id] || id}${periods && periods[id] ? ` (${periods[id]})` : ""}`),
    ...(b.times || []).map((t) => `às ${t}`),
  ];
  if (!parts.length) return "";
  return `abre ${parts.length > 1 ? `${parts.slice(0, -1).join(", ")} e ${parts[parts.length - 1]}` : parts[0]}`;
}

/**
 * What goes in the report. categoria: "" (all), a category id or "sem" (the blocks without one); bloco: a block id
 * (one of those), or "" for all. Only sheets with text. Returns {at, categories, blocks, cat, block, sections, total,
 * pages}: categories and blocks are the choices of the page (blocks: the ones of the category chosen).
 */
export function anotacoes(data, { categoria = "", bloco = "", now = Date.now() } = {}) {
  const cats = [...(data.categories || [])].sort((a, b) => a.order - b.order || a.name.localeCompare(b.name, "pt-BR"));
  const catById = new Map(cats.map((c) => [c.id, c]));
  const all = [...(data.blocks || [])].sort((a, b) => a.order - b.order || a.created - b.created);
  const hasNone = all.some((b) => !catById.has(b.category));
  const cat = categoria === "sem" ? (cats.length && hasNone ? "sem" : "") : catById.has(categoria) ? categoria : "";
  const inCat = (b) => !cat || (cat === "sem" ? !catById.has(b.category) : b.category === cat);
  const blocks = all.filter(inCat);
  const block = blocks.some((b) => b.id === bloco) ? bloco : "";
  const pagesOf = (id) => (data.pages || []).filter((p) => p.block === id && String(p.text || "").trim()).sort(byCreated);
  const sections = (block ? blocks.filter((b) => b.id === block) : blocks).map((b) => {
    const c = catById.get(b.category);
    const pages = pagesOf(b.id).map((p, k) => ({ n: k + 1, id: p.id, created: p.created, updated: p.updated, times: p.times || [], ...sheetParts(p.text) }));
    return { id: b.id, name: b.name, color: PALETTE[b.color] || DEFAULT_COLOR, category: c ? c.name : "", categoryColor: c ? PALETTE[c.color] || PALETTE.grafite : "", opens: opensText(b, data.periods), pages };
  });
  const total = sections.reduce((n, s) => n + s.pages.length, 0);
  return {
    at: now,
    categories: cats.map((c) => ({ id: c.id, name: c.name, color: PALETTE[c.color] || PALETTE.grafite })),
    hasNone,
    blocks: blocks.map((b) => ({ id: b.id, name: b.name })),
    cat,
    catName: cat === "sem" ? "Sem categoria" : cat ? catById.get(cat).name : "",
    block,
    sections,
    total,
  };
}

/** "Trabalho · 2 blocos · 5 folhas" (the count of the header, with what was chosen). */
export function countText(rep) {
  const n = plural(rep.total, "folha", "folhas");
  if (rep.block) return `${rep.sections[0].name} · ${n}`;
  return [rep.catName, plural(rep.sections.length, "bloco", "blocos"), n].filter(Boolean).join(" · ");
}

// ------------------------------------------------------------------ charts (the same look as the ResolvIA's)

/** Rows shown before "+N"; it only folds when that hides two or more. */
const TOP = 6;
const rank = (rows) =>
  rows
    .map((r, k) => [r, k])
    .filter(([r]) => r.n > 0)
    .sort((a, b) => b[0].n - a[0].n || a[1] - b[1])
    .map(([r]) => r);
export const foldTop = (rows) => (rows.length <= TOP + 1 ? { shown: rows, more: 0, moreN: 0 } : { shown: rows.slice(0, TOP), more: rows.length - TOP, moreN: rows.slice(TOP).reduce((n, r) => n + r.n, 0) });
const share = (n, of) => (n && of ? Math.max(1, Math.round((n / of) * 100)) : 0);

/** The charts of what is in the report: sheets by category (two or more groups) and by block (two or more blocks). */
export function graficos(rep) {
  if (!rep.total) return [];
  const chart = (title, rows, unit) => ({ title, rows, unit, max: Math.max(0, ...rows.map((x) => x.n)), total: rows.reduce((n, x) => n + x.n, 0) });
  const out = [];
  if (rep.categories.length && !rep.block) {
    const groups = new Map();
    for (const s of rep.sections) {
      const k = s.category || "";
      const g = groups.get(k) || { name: s.category || "Sem categoria", n: 0, color: s.categoryColor || "#aab3bd" };
      g.n += s.pages.length;
      groups.set(k, g);
    }
    const rows = rank([...groups.values()]);
    if (rows.length > 1) out.push(chart("Por categoria", rows, ["categoria", "categorias"]));
  }
  const byBlock = rank(rep.sections.map((s) => ({ name: s.name, n: s.pages.length, color: s.color })));
  if (byBlock.length > 1) out.push(chart("Por bloco", byBlock, ["bloco", "blocos"]));
  return out;
}

function chartHtml(c) {
  const f = foldTop(c.rows);
  const split = [...f.shown, ...(f.more ? [{ name: `+${plural(f.more, c.unit[0], c.unit[1])}`, n: f.moreN, color: "var(--g2)" }] : [])];
  const bar = split.length > 1 ? `<div class="split" role="img" aria-label="${esc(c.title)}: ${esc(split.map((x) => `${x.name} ${x.n}`).join(", "))}">${split.map((x) => `<i style="flex:${x.n} 1 0;background:${x.color}"></i>`).join("")}</div>` : "";
  const rows = f.shown
    .map((x) => `<div class="gl"><span class="nm"><b>${esc(x.name)}</b></span><span class="v">${x.n}</span><span class="bar"><i style="width:${share(x.n, c.max)}%;background:${x.color}"></i></span></div>`)
    .join("");
  const more = f.more ? `<p class="gpe">+${plural(f.more, c.unit[0], c.unit[1])}: <b>${f.moreN}</b></p>` : "";
  return `<section class="g"><h3>${esc(c.title)}</h3>${bar}${rows}${more}</section>`;
}

// ------------------------------------------------------------------ the page

/** The lightning of CorrerIA Code (Lucide zap), in a box of 24. */
const ZAP = [[13, 2], [3, 14], [12, 14], [11, 22], [21, 10], [12, 10]];

/** The icon of the app (the notebook sheet with the rings, the lines and the clock), in the color of the app. */
const ICON = (cor) => `<svg class="ic" viewBox="0 0 32 32" aria-hidden="true">
<path d="M10 3h15a4 4 0 0 1 4 4v16.5L22.5 30H10a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4z" fill="${cor}"/>
<path d="M22.5 30v-4.6a1.9 1.9 0 0 1 1.9-1.9H29z" fill="#000" fill-opacity=".28"/>
<path d="M12 10h11M12 14.5h8M12 19h4" stroke="#1a1210" stroke-width="2.2" stroke-linecap="round"/>
<circle cx="21" cy="20" r="4.2" fill="#1a1210"/><path d="M21 17.9v2.3l1.5 1" fill="none" stroke="${cor}" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M3.2 8H9M3.2 13H9M3.2 18H9M3.2 23H9" stroke="currentColor" stroke-width="2.1" stroke-linecap="round"/></svg>`;

/** Baixar PDF from the frame of the app in Home Assistant (the same as the ResolvIA's): a link on the top page. */
export const BAIXAR =
  "try{var d=window.top.document,a=d.createElement('a');a.href=this.href;a.download=this.getAttribute('download')||'';a.target='_blank';a.style.display='none';" +
  "d.body.appendChild(a);a.dispatchEvent(new MouseEvent('click'));d.body.removeChild(a);var b=this;b.textContent='Baixando…';" +
  "setTimeout(function(){b.textContent='Baixar PDF'},4000);return false}catch(e){return true}";

/** The mark of CorrerIA Code (as in Mais › Sobre). */
const MARCA = `<footer class="marca"><span class="raio" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M${ZAP.map((p) => p.join(" ")).join("L")}Z"/></svg></span>` +
  `<span><b class="nome">Correr<i>IA</i> Code</b><small>desenvolvimento de softwares</small></span></footer>`;

// The choice of the page is kept for the next time (the app opens the report with it): memoria.relatorio
const CHOOSE =
  "var u=new window.URL(window.location.href),k=this.name,v=this.value;if(v)u.searchParams.set(k,v);else u.searchParams.delete(k);" +
  "if(k==='categoria')u.searchParams.delete('bloco');" +
  "try{localStorage.setItem('memoria.relatorio',JSON.stringify({categoria:u.searchParams.get('categoria')||'',bloco:u.searchParams.get('bloco')||''}))}catch(e){}" +
  "location.replace(u.href)";

/** The name of the PDF: anotacoes-2026-11-08.pdf (anotacoes-diario-2026-11-08.pdf for a block or a category). */
export function pdfName(rep) {
  const d = new Date(rep.at);
  const date = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const what = rep.block ? rep.sections[0].name : rep.catName;
  const slug = String(what || "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
  return `anotacoes-${slug ? `${slug}-` : ""}${date}.pdf`;
}

const query = (rep, extra = {}) => {
  const q = new URLSearchParams();
  if (rep.cat) q.set("categoria", rep.cat);
  if (rep.block) q.set("bloco", rep.block);
  for (const [k, v] of Object.entries(extra)) if (v) q.set(k, v);
  return q.toString();
};

/**
 * The page (HTML). tema: "claro" | "escuro" (the one of the app; none: the one of the device); cor: the color of the
 * app (#rrggbb). On paper it is always light.
 */
export function reportHtml(rep, { tema = null, cor = DEFAULT_COLOR } = {}) {
  const accent = okColor(cor);
  const attr = tema === "claro" ? ' data-theme="light"' : tema === "escuro" ? ' data-theme="dark"' : "";
  const pdfHref = `relatorio.pdf?${query(rep, { cor: accent })}`;
  const catSel = rep.categories.length
    ? `<select name="categoria" aria-label="Categoria" onchange="${CHOOSE}"><option value=""${rep.cat ? "" : " selected"}>Todas as categorias</option>` +
      rep.categories.map((c) => `<option value="${esc(c.id)}"${rep.cat === c.id ? " selected" : ""}>${esc(c.name)}</option>`).join("") +
      (rep.hasNone ? `<option value="sem"${rep.cat === "sem" ? " selected" : ""}>Sem categoria</option>` : "") +
      `</select>`
    : "";
  const blockSel =
    `<select name="bloco" aria-label="Bloco" onchange="${CHOOSE}"><option value=""${rep.block ? "" : " selected"}>${rep.cat ? "Todos os blocos dela" : "Todos os blocos"}</option>` +
    rep.blocks.map((b) => `<option value="${esc(b.id)}"${rep.block === b.id ? " selected" : ""}>${esc(b.name)}</option>`).join("") +
    `</select>`;
  const page = (p) => {
    const meta = [`Folha ${p.n}`, day(p.created), ...(p.times.length ? [`às ${p.times.join(", ")}`] : [])].join(" · ");
    return `<article class="folha"><p class="fm">${esc(meta)}</p><h3>${lineHtml(p.title)}</h3>${p.body.length ? `<div class="tx">${p.body.map(lineHtml).join("\n")}</div>` : ""}</article>`;
  };
  const section = (s) => {
    const sub = [s.category, plural(s.pages.length, "folha", "folhas"), s.opens].filter(Boolean).join(" · ");
    return `<section class="bloco" style="--b:${s.color}"><h2><span>${esc(s.name)}</span><small>${esc(sub)}</small></h2>${s.pages.length ? s.pages.map(page).join("") : `<p class="vazio">Nenhuma folha escrita neste bloco.</p>`}</section>`;
  };
  const charts = graficos(rep);
  const claro = "--bg:#f6f7f9;--card:#fff;--fg:#141a22;--mut:#5b6573;--linha:#e3e7ec;--linha2:#eef1f4;--borda:#d6dbe2;--g2:#aab3bd";
  const escuro = "--bg:#0f1318;--card:#161c23;--fg:#e8edf3;--mut:#9aa6b4;--linha:#2a3340;--linha2:#1f2732;--borda:#334051;--g2:#66727f";
  return `<!doctype html><html lang="pt-BR"${attr}><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light dark">
<title>Relatório de anotações · MemorIA</title>
<style>
@font-face{font-family:Barlow;font-weight:400;src:url(fonts/barlow-400.woff2) format("woff2")}
@font-face{font-family:Barlow;font-weight:600;src:url(fonts/barlow-600.woff2) format("woff2")}
@font-face{font-family:"Barlow Condensed";font-weight:700;src:url(fonts/barlow-condensed-700.woff2) format("woff2")}
:root{--a:${accent};${claro};color-scheme:light}
:root[data-theme="dark"]{${escuro};color-scheme:dark}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){${escuro};color-scheme:dark}}
*{box-sizing:border-box}
body{font:15px/1.45 Barlow,system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;color:var(--fg);background:var(--bg);margin:0;padding:20px 16px 48px}
main{max-width:860px;margin:0 auto}
.barra{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:18px}
.barra a,.barra select{font:inherit;font-size:14px;font-weight:600;min-height:44px;min-width:0;padding:8px 10px;border-radius:12px;border:1px solid var(--borda);background:var(--card);color:var(--fg);text-decoration:none;cursor:pointer;text-align:center}
.barra a{display:flex;align-items:center;justify-content:center;line-height:1.2}
.barra select{grid-column:1/-1;text-align:left;font-size:15px;padding:10px 14px;text-overflow:ellipsis}
.barra .pdf{background:var(--a);border-color:transparent;color:#1a1210}
.cab{display:flex;gap:14px;align-items:center;background:var(--card);border:1px solid var(--linha);border-left:6px solid var(--a);border-radius:16px;padding:16px 18px;margin-bottom:14px}
.cab .ic{width:52px;height:52px;flex:none;color:var(--fg)}
.cab .app{font:600 13.5px/1.2 Barlow,sans-serif;color:var(--mut)}
.cab .app .wm{font:700 19px/1 "Barlow Condensed",Barlow,sans-serif;color:var(--fg);letter-spacing:.01em}
.cab .app .wm b{color:var(--a)}
.cab h1{font:700 30px/1.05 "Barlow Condensed",Barlow,sans-serif;margin:4px 0 4px;letter-spacing:-.01em}
.cab p{margin:0;color:var(--mut);font-size:13.5px}
section{background:var(--card);border:1px solid var(--linha);border-radius:16px;padding:6px 16px 10px;margin-top:14px}
h2{display:flex;flex-wrap:wrap;align-items:baseline;justify-content:space-between;gap:4px 12px;border-bottom:2px solid var(--b,var(--a));padding:8px 0 6px;margin:0 0 4px}
h2 span{font:700 20px/1.2 "Barlow Condensed",Barlow,sans-serif}
h2 small{color:var(--mut);font-size:13px;font-weight:400}
.folha{padding:10px 0 12px;border-bottom:1px solid var(--linha2)}
.folha:last-child{border-bottom:0}
.fm{margin:0;color:var(--mut);font-size:12.5px}
.folha h3{margin:2px 0 0;font-size:16px;font-weight:600;line-height:1.3;overflow-wrap:anywhere}
.tx{margin-top:4px;white-space:pre-wrap;overflow-wrap:anywhere;font-size:14.5px}
.folha a{color:inherit;text-decoration-color:var(--a);text-decoration-thickness:2px;text-underline-offset:2px}
.vazio{color:var(--mut);margin:10px 0}
.graficos{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,320px),1fr));gap:14px;margin-top:14px;align-items:start}
.graficos section{margin:0;padding:12px 16px}
.g h3{font:700 20px/1.2 "Barlow Condensed",Barlow,sans-serif;margin:2px 0 10px}
.split{display:flex;gap:2px;height:10px;margin:0 0 8px}
.split i{display:block;min-width:4px}
.split i:first-child{border-radius:5px 0 0 5px}
.split i:last-child{border-radius:0 5px 5px 0}
.gl{display:grid;grid-template-columns:minmax(0,1fr) auto;column-gap:12px;row-gap:6px;align-items:center;padding:7px 0}
.nm{display:flex;align-items:baseline;gap:8px;min-width:0;overflow:hidden}
.nm b{font-size:15px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.v{font:700 19px/1 "Barlow Condensed",Barlow,sans-serif;text-align:right;font-variant-numeric:tabular-nums}
.bar{grid-column:1/-1;height:7px;border-radius:4px;background:var(--linha2);overflow:hidden}
.bar i{display:block;height:100%;border-radius:4px}
.gpe{margin:6px 0 2px;font-size:13px;color:var(--mut)}
.gpe b{color:var(--fg);font-weight:600}
.marca{display:flex;align-items:center;justify-content:center;gap:12px;margin-top:28px;padding-top:20px;border-top:1px solid var(--linha)}
.raio{display:grid;place-items:center;width:34px;height:34px;flex:none;border-radius:11px;background:var(--a);transform:rotate(-8deg);box-shadow:0 8px 18px -10px var(--a)}
.raio svg{width:19px;height:19px;fill:#1a1210}
.marca .nome{display:block;font:700 20px/1 "Barlow Condensed",Barlow,sans-serif;color:var(--fg)}
.marca .nome i{font-style:normal;color:var(--a)}
.marca small{display:block;margin-top:4px;color:var(--mut);font-size:10.5px;font-weight:600;letter-spacing:.14em;text-transform:uppercase}
@media print{:root,:root[data-theme],:root:not([data-theme="light"]){${claro};--bg:#fff;color-scheme:light} .barra{display:none} body{padding:0} .folha,.marca{break-inside:avoid-page} .cab,section{border-color:#d6dbe2} .raio{box-shadow:none}}
</style><script src="selectsheet.js"></script></head><body><main>
<div class="barra">
${catSel}${blockSel}
<a href="./" onclick="if(history.length>1){history.back();return false}">Voltar</a><a class="pdf" href="${esc(pdfHref)}" download="${esc(pdfName(rep))}" onclick="${BAIXAR}">Baixar PDF</a>
</div>
<header class="cab">${ICON(accent)}<div><div class="app"><span class="wm">Memor<b>IA</b></span> · anotações</div><h1>Relatório de anotações</h1><p>${esc(countText(rep))} · ${whenGenerated(rep.at)}</p></div></header>
${charts.length ? `<div class="graficos">${charts.map(chartHtml).join("")}</div>` : ""}
${rep.sections.length ? rep.sections.map(section).join("") : `<p class="vazio">Nenhum bloco ainda.</p>`}
${MARCA}
</main></body></html>`;
}

// ------------------------------------------------------------------ the PDF

/** A square of side s with round corners (r), turned by deg around its center (cx, cy): points for Pdf.path. */
function tiltedSquare(cx, cy, s, r, deg) {
  const a = (deg * Math.PI) / 180;
  const h = s / 2 - r;
  const pts = [];
  for (const [ox, oy, start] of [[h, h, 0], [-h, h, 90], [-h, -h, 180], [h, -h, 270]]) {
    for (let k = 0; k <= 6; k++) {
      const t = ((start + k * 15) * Math.PI) / 180;
      pts.push([ox + r * Math.cos(t), oy + r * Math.sin(t)]);
    }
  }
  return pts.map(([x, y]) => [cx + x * Math.cos(a) - y * Math.sin(a), cy + x * Math.sin(a) + y * Math.cos(a)]);
}

/** A circle as points (for Pdf.path). */
const circle = (cx, cy, r, k = 20) => Array.from({ length: k }, (_, i) => [cx + r * Math.cos((i * 2 * Math.PI) / k), cy + r * Math.sin((i * 2 * Math.PI) / k)]);

/** The report as a PDF (A4, always light). cor: the color of the app. */
export function reportPdf(rep, { cor = DEFAULT_COLOR } = {}) {
  const A = okColor(cor);
  const C = { fg: "#141a22", mut: "#5b6573", line: "#e3e7ec", line2: "#eef1f4", card: "#f6f7f9" };
  const pdf = new Pdf({ title: "Relatório de anotações · MemorIA", producer: "MemorIA" });
  const M = 40;
  const W = pdf.W - 2 * M;
  const BOTTOM = pdf.H - 64; // the foot: a line and the mark of CorrerIA Code
  let y = M;

  // the icon of the app: the notebook sheet, the rings, the lines and the clock
  const icon = (x, top, s) => {
    const u = s / 32;
    const P = (px, py) => [x + px * u, top + py * u];
    pdf.rect(...P(6, 3), 23 * u, 27 * u, { fill: A, r: 4 * u });
    // the folded corner: the corner cut off (the color of the card behind), then the flap
    pdf.path([P(22.5, 30.3), P(29.3, 23.5), P(29.3, 30.3)], { fill: C.card, close: true });
    pdf.path([P(22.5, 30), P(22.5, 25.4), P(24.4, 23.5), P(29, 23.5)], { fill: "#c9c9c9", close: true });
    for (const [x1, y1, x2] of [[12, 10, 23], [12, 14.5, 20], [12, 19, 16]]) pdf.line(...P(x1, y1), ...P(x2, y1), { color: "#1a1210", width: 2.2 * u, cap: 1 });
    pdf.path(circle(...P(21, 20), 4.2 * u), { fill: "#1a1210", close: true });
    pdf.path([P(21, 17.9), P(21, 20.2), P(22.5, 21.2)], { stroke: A, width: 1.3 * u, round: true });
    for (const ry of [8, 13, 18, 23]) pdf.line(...P(3.2, ry), ...P(9, ry), { color: C.fg, width: 2.1 * u, cap: 1 });
  };

  // the header
  const h = 88;
  pdf.rect(M, y, W, h, { fill: C.card, stroke: C.line, r: 10 });
  pdf.rect(M, y, 5, h, { fill: A });
  icon(M + 18, y + 18, 52);
  const tx = M + 84;
  pdf.text(tx, y + 24, "Memor", { size: 15, bold: true, color: C.fg });
  const w1 = textWidth("Memor", 15, true);
  pdf.text(tx + w1, y + 24, "IA", { size: 15, bold: true, color: A });
  pdf.text(tx + w1 + textWidth("IA", 15, true) + 6, y + 24, "· anotações", { size: 10, color: C.mut });
  pdf.text(tx, y + 52, "Relatório de anotações", { size: 22, bold: true, color: C.fg });
  pdf.text(tx, y + 72, `${countText(rep)} · ${whenGenerated(rep.at)}`, { size: 10, color: C.mut });
  y += h + 14;

  const newPage = () => {
    pdf.addPage();
    y = M;
    pdf.text(M, y + 10, "Relatório de anotações · MemorIA", { size: 9, color: C.mut });
    y += 26;
  };

  // the charts, two by two, each in a card
  const ROW = 24;
  const chartH = (c) => {
    const f = foldTop(c.rows);
    return 34 + (f.shown.length + (f.more ? 1 : 0) > 1 ? 16 : 0) + f.shown.length * ROW + (f.more ? 15 : 0) + 4;
  };
  const drawChart = (c, x, top, w, hh) => {
    const f = foldTop(c.rows);
    pdf.rect(x, top, w, hh, { stroke: C.line, r: 8 });
    const ix = x + 12;
    const iw = w - 24;
    pdf.text(ix, top + 20, c.title, { size: 12.5, bold: true, color: C.fg });
    let cy = top + 30;
    const split = [...f.shown, ...(f.more ? [{ n: f.moreN, color: "#aab3bd" }] : [])];
    if (split.length > 1) {
      const sum = split.reduce((n, p) => n + p.n, 0);
      const gap = 1.5;
      const room = iw - gap * (split.length - 1);
      let sx = ix;
      for (const p of split) {
        const pw = Math.max(3, (p.n / sum) * room);
        pdf.rect(sx, cy, pw, 7, { fill: p.color, r: 1.5 });
        sx += pw + gap;
      }
      cy += 16;
    }
    for (const p of f.shown) {
      pdf.text(ix, cy + 10, wrap(p.name, iw - 40, 10)[0] || "", { size: 10, color: C.fg });
      pdf.text(ix + iw, cy + 10, String(p.n), { size: 11, bold: true, color: C.fg, align: "right" });
      pdf.rect(ix, cy + 15, iw, 4, { fill: C.line2, r: 2 });
      pdf.rect(ix, cy + 15, Math.max(2, (iw * share(p.n, c.max)) / 100), 4, { fill: p.color, r: 2 });
      cy += ROW;
    }
    if (f.more) pdf.text(ix, cy + 9, `+${plural(f.more, c.unit[0], c.unit[1])}: ${f.moreN}`, { size: 9, color: C.mut });
  };
  const charts = graficos(rep);
  for (let k = 0; k < charts.length; k += 2) {
    const pair = charts.slice(k, k + 2);
    const hh = Math.max(...pair.map(chartH));
    if (y + hh > BOTTOM) newPage();
    const cw = (W - 12) / 2;
    pair.forEach((c, i) => drawChart(c, M + i * (cw + 12), y, cw, hh));
    y += hh + 12;
  }
  if (charts.length) y += 6;

  const sectionHead = (s, cont = false) => {
    const meta = [s.category, plural(s.pages.length, "folha", "folhas"), s.opens].filter(Boolean).join(" · ");
    const title = `${s.name}${cont ? " (continuação)" : ""}`;
    pdf.text(M, y + 14, title, { size: 14, bold: true, color: C.fg });
    const room = W - textWidth(title, 14, true) - 16;
    const metaLine = wrap(meta, Math.max(80, room), 9)[0] || "";
    pdf.text(M + W, y + 14, metaLine, { size: 9, color: C.mut, align: "right" });
    pdf.line(M, y + 21, M + W, y + 21, { color: s.color, width: 1.5 });
    y += 30;
  };

  for (const s of rep.sections) {
    if (y + 70 > BOTTOM) newPage();
    sectionHead(s);
    if (!s.pages.length) {
      pdf.text(M, y + 10, "Nenhuma folha escrita neste bloco.", { size: 10, color: C.mut });
      y += 26;
      continue;
    }
    s.pages.forEach((p, i) => {
      const meta = [`Folha ${p.n}`, day(p.created), ...(p.times.length ? [`às ${p.times.join(", ")}`] : [])].join(" · ");
      const title = wrap(readable(p.title), W, 11.5, true);
      if (y + 16 + title.length * 15 + 14 > BOTTOM) {
        newPage();
        sectionHead(s, true);
      }
      pdf.text(M, y + 10, meta, { size: 8.5, color: C.mut });
      y += 14;
      for (const t of title) {
        pdf.text(M, y + 11, t, { size: 11.5, bold: true, color: C.fg });
        y += 15;
      }
      for (const raw of p.body) {
        const lines = raw.trim() ? wrap(readable(raw), W, 10.5) : [""];
        for (const t of lines) {
          if (y + 14 > BOTTOM) {
            newPage();
            sectionHead(s, true);
          }
          if (t) pdf.text(M, y + 11, t, { size: 10.5, color: C.fg });
          y += t ? 14 : 8;
        }
      }
      y += 8;
      if (i < s.pages.length - 1) {
        pdf.line(M, y, M + W, y, { color: C.line2 });
        y += 8;
      }
    });
    y += 14;
  }
  if (!rep.sections.length) pdf.text(M, y + 10, "Nenhum bloco ainda.", { size: 11, color: C.mut });

  // the foot of each page: the mark of CorrerIA Code (as in Mais › Sobre) and, with more than one, the page
  const total = pdf.pages.length;
  const what = "DESENVOLVIMENTO DE SOFTWARES";
  const nameW = textWidth("Correr", 10.5, true) + textWidth("IA", 10.5, true) + textWidth(" Code", 10.5, true);
  const blockW = 16 + 8 + Math.max(nameW, textWidth(what, 6, true, 0.9));
  pdf.pages.forEach((ops, i) => {
    pdf.ops = ops;
    const fy = pdf.H - 34;
    pdf.line(M, fy - 16, M + W, fy - 16, { color: C.line });
    const bx = pdf.W / 2 - blockW / 2;
    pdf.path(tiltedSquare(bx + 8, fy + 1, 16, 4, -8), { fill: A, close: true });
    pdf.path(ZAP.map(([zx, zy]) => [(zx - 12) * 0.46, (zy - 12) * 0.46]).map(([zx, zy]) => {
      const a = (-8 * Math.PI) / 180;
      return [bx + 8 + zx * Math.cos(a) - zy * Math.sin(a), fy + 1 + zx * Math.sin(a) + zy * Math.cos(a)];
    }), { fill: "#1a1210", close: true });
    const x0 = bx + 24;
    pdf.text(x0, fy, "Correr", { size: 10.5, bold: true, color: C.fg });
    pdf.text(x0 + textWidth("Correr", 10.5, true), fy, "IA", { size: 10.5, bold: true, color: A });
    pdf.text(x0 + textWidth("CorrerIA", 10.5, true), fy, " Code", { size: 10.5, bold: true, color: C.fg });
    pdf.text(x0, fy + 9, what, { size: 6, bold: true, color: C.mut, spacing: 0.9 });
    if (total > 1) pdf.text(M + W, fy + 4, `página ${i + 1} de ${total}`, { size: 8, color: C.mut, align: "right" });
  });
  return pdf.build();
}
