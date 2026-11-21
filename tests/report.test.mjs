// Mais › Relatório (memoria/rootfs/app/lib/report.js): what goes in, the page and the PDF. An invented house.
import { test } from "node:test";
import assert from "node:assert/strict";
import { anotacoes, countText, sheetParts, pdfName, reportHtml, reportPdf, graficos, lineHtml, lineRuns, wrapRuns } from "../memoria/rootfs/app/lib/report.js";
import { casa } from "./fixtures/casa.mjs";

const NOW = new Date(2026, 10, 8, 10, 30).getTime();

test("all the blocks, in order, only the sheets with text", () => {
  const rep = anotacoes(casa(), { now: NOW });
  assert.deepEqual(rep.sections.map((s) => s.name), ["Mercado", "Reforma da cozinha", "Inglês", "Ideias soltas"]);
  assert.deepEqual(rep.sections.map((s) => s.pages.length), [2, 1, 1, 1]);
  assert.equal(rep.total, 5);
  assert.equal(countText(rep), "4 blocos · 5 folhas");
  const m = rep.sections[0];
  assert.equal(m.category, "Casa");
  assert.equal(m.opens, "abre de manhã (05:00)");
  assert.equal(rep.sections[2].opens, "abre às 19:30");
  assert.equal(m.pages[0].title, "Lista da semana");
  assert.deepEqual(m.pages[0].body, ["- Arroz e feijão", "- Café", "- Frutas para a Ana", "- Pão integral"]);
  assert.deepEqual(m.pages[1].times, ["09:00"]);
});

test("by category, without one, by block; a choice that doesn't exist is all", () => {
  const data = casa();
  let rep = anotacoes(data, { categoria: "catcasa0001", now: NOW });
  assert.deepEqual(rep.sections.map((s) => s.name), ["Mercado", "Reforma da cozinha"]);
  assert.deepEqual(rep.blocks.map((b) => b.name), ["Mercado", "Reforma da cozinha"], "the blocks to choose are the category's");
  assert.equal(countText(rep), "Casa · 2 blocos · 3 folhas");
  rep = anotacoes(data, { categoria: "sem", now: NOW });
  assert.deepEqual(rep.sections.map((s) => s.name), ["Ideias soltas"]);
  assert.equal(rep.catName, "Sem categoria");
  rep = anotacoes(data, { categoria: "catcasa0001", bloco: "reforma0001", now: NOW });
  assert.deepEqual(rep.sections.map((s) => s.name), ["Reforma da cozinha"]);
  assert.equal(countText(rep), "Reforma da cozinha · 1 folha");
  // a block outside the category chosen: the whole category
  rep = anotacoes(data, { categoria: "catcasa0001", bloco: "ingles00001", now: NOW });
  assert.equal(rep.block, "");
  assert.equal(rep.sections.length, 2);
  rep = anotacoes(data, { categoria: "naoexiste1", bloco: "naoexiste2", now: NOW });
  assert.equal(rep.cat, "");
  assert.equal(rep.sections.length, 4);
  // without categories, "sem" is all
  rep = anotacoes({ ...data, categories: [] }, { categoria: "sem", now: NOW });
  assert.equal(rep.cat, "");
  assert.equal(rep.sections[0].category, "");
});

test("sheetParts: the first line with text is the title; blank lines around the body go", () => {
  assert.deepEqual(sheetParts("\n\n  Título  \n\n\nlinha 1\n\nlinha 2\n\n"), { title: "Título", body: ["linha 1", "", "linha 2"] });
  assert.deepEqual(sheetParts("   \n "), { title: "", body: [] });
  assert.deepEqual(sheetParts("a\r\nb"), { title: "a", body: ["b"] });
});

test("the charts: by category (with Sem categoria) and by block, most first", () => {
  const g = graficos(anotacoes(casa(), { now: NOW }));
  assert.deepEqual(g.map((c) => c.title), ["Por categoria", "Por bloco"]);
  assert.deepEqual(g[0].rows.map((r) => [r.name, r.n]), [["Casa", 3], ["Estudos", 1], ["Sem categoria", 1]]);
  assert.deepEqual(g[1].rows.map((r) => r.name), ["Mercado", "Reforma da cozinha", "Inglês", "Ideias soltas"]);
  // one block: no charts
  assert.deepEqual(graficos(anotacoes(casa(), { bloco: "mercado0001", now: NOW })), []);
  assert.deepEqual(graficos(anotacoes({ ...casa(), pages: [] }, { now: NOW })), []);
});

test("the name of the PDF", () => {
  assert.equal(pdfName(anotacoes(casa(), { now: NOW })), "anotacoes-2026-11-08.pdf");
  assert.equal(pdfName(anotacoes(casa(), { bloco: "reforma0001", now: NOW })), "anotacoes-reforma-da-cozinha-2026-11-08.pdf");
  assert.equal(pdfName(anotacoes(casa(), { categoria: "catestudo01", now: NOW })), "anotacoes-estudos-2026-11-08.pdf");
  assert.equal(pdfName(anotacoes(casa(), { categoria: "sem", now: NOW })), "anotacoes-sem-categoria-2026-11-08.pdf");
});

test("the page: the header of the apps, the choices, Voltar and Baixar PDF, the blocks and the mark of CorrerIA Code", () => {
  const rep = anotacoes(casa(), { categoria: "catcasa0001", now: NOW });
  const h = reportHtml(rep, { tema: "escuro", cor: "#62B5FF" });
  assert.match(h, /<html lang="pt-BR" data-theme="dark">/);
  assert.match(h, /--a:#62B5FF/);
  assert.match(h, /<span class="wm">Memor<b>IA<\/b><\/span> · anotações/);
  assert.match(h, /<h1>Relatório de anotações<\/h1><p>Casa · 2 blocos · 3 folhas · 08\/11\/2026 às 10:30<\/p>/);
  assert.match(h, /<select name="categoria"[^>]*>.*<option value="catcasa0001" selected>Casa<\/option>.*<option value="sem">Sem categoria<\/option><\/select>/s);
  assert.match(h, /<select name="bloco"[^>]*><option value="" selected>Todos os blocos dela<\/option><option value="mercado0001">Mercado<\/option><option value="reforma0001">Reforma da cozinha<\/option><\/select>/);
  assert.match(h, /href="relatorio\.pdf\?categoria=catcasa0001&amp;cor=%2362B5FF" download="anotacoes-casa-2026-11-08\.pdf"/);
  assert.match(h, /<span>Voltar<\/span><\/a>/);
  assert.match(h, /localStorage\.setItem\('memoria\.relatorio'/);
  assert.match(h, /<script src="selectsheet\.js"><\/script>/);
  assert.match(h, /Correr<i>IA<\/i> Code<\/b><small>desenvolvimento de softwares<\/small>/);
  assert.equal((h.match(/class="folha"/g) || []).length, 3);
  assert.doesNotMatch(h, /Inglês/);
  // light, no theme (the device's), a bad color
  assert.match(reportHtml(rep, { tema: "claro" }), /data-theme="light"/);
  assert.match(reportHtml(rep, {}), /<html lang="pt-BR"><head>/);
  assert.match(reportHtml(rep, { cor: "red;}" }), /--a:#B99BFF/);
  // without categories, no box for them
  assert.doesNotMatch(reportHtml(anotacoes({ ...casa(), categories: [] }, { now: NOW })), /name="categoria"/);
});

test("the page escapes what was written", () => {
  const data = casa();
  data.blocks[0].name = "<b>Mercado</b>";
  data.pages[0].text = 'Lista "<script>alert(1)</script>"\n& mais';
  const h = reportHtml(anotacoes(data, { now: NOW }));
  assert.doesNotMatch(h, /<script>alert/);
  assert.match(h, /&lt;b&gt;Mercado&lt;\/b&gt;/);
  assert.match(h, /&amp; mais/);
});

test("the PDF: a file with the header, the sheets and the page at the foot", () => {
  const data = casa();
  // a long sheet: more than one page
  data.pages.push({ id: "pglonga0001", block: "ingles00001", text: `Vocabulário\n\n${Array.from({ length: 120 }, (_, i) => `Palavra ${i + 1}: uma frase de exemplo bem comprida para quebrar a linha no PDF.`).join("\n")}`, times: [], created: NOW - 3600000, updated: NOW - 3600000 });
  const pdf = reportPdf(anotacoes(data, { now: NOW }), { cor: "#4ED3A6" });
  const s = pdf.toString("latin1");
  assert.ok(s.startsWith("%PDF-1.4"));
  assert.ok(s.trimEnd().endsWith("%%EOF"));
  assert.match(s, /\/Producer \(MemorIA\)/);
  assert.match(s, /\(Relat\\363rio de anota\\347\\365es\)/);
  assert.match(s, /\(Memor\)/);
  assert.match(s, /\(Lista da semana\)/);
  assert.match(s, /\(Palavra 120: /);
  const pages = Number(/\/Count (\d+)/.exec(s)[1]);
  assert.ok(pages >= 3, `pages ${pages}`);
  assert.match(s, new RegExp(`\\(p\\\\341gina ${pages} de ${pages}\\)`));
  assert.match(s, /\(DESENVOLVIMENTO DE SOFTWARES\)/);
  assert.match(s, /\(Ingl\\352s \\\(continua\\347\\343o\\\)\)/);
  // empty
  const empty = reportPdf(anotacoes({ ...data, blocks: [], pages: [] }, { now: NOW })).toString("latin1");
  assert.match(empty, /\(Nenhum bloco ainda\.\)/);
  assert.doesNotMatch(empty, /p\\341gina 1 de/);
});

test("links in the report: the name and the site, never the long address in the text", () => {
  const data = casa();
  data.pages[0].text = "Lista da semana\n\nOfertas: https://www.google.com/search?q=ofertas+mercado&sca_esv=a1b2c3&ei=XyZ\n[Receita](https://www.receitas.com.br/bolo-de-cenoura)";
  const rep = anotacoes(data, { bloco: "mercado0001", now: NOW });
  const h = reportHtml(rep);
  assert.match(h, /<a href="https:\/\/www\.google\.com\/search\?q=ofertas\+mercado&amp;sca_esv=a1b2c3&amp;ei=XyZ" target="_blank" rel="noopener noreferrer">google\.com · ofertas mercado<\/a>/);
  assert.match(h, /<a href="https:\/\/www\.receitas\.com\.br\/bolo-de-cenoura" target="_blank" rel="noopener noreferrer">Receita \(receitas\.com\.br\)<\/a>/);
  assert.doesNotMatch(h.replace(/href="[^"]*"/g, ""), /sca_esv/);
  const pdf = reportPdf(rep).toString("latin1");
  assert.match(pdf, /\(Receita \\\(receitas\.com\.br\\\)\)/);
  assert.match(pdf, /\(Ofertas: google\.com \\267 ofertas mercado\)/);
  assert.doesNotMatch(pdf, /sca_esv/);
  // javascript: stays text, escaped
  data.pages[0].text = "Lista\n\n[x](javascript:alert(1))";
  assert.doesNotMatch(reportHtml(anotacoes(data, { now: NOW })), /href="javascript/);
});

test("Arquivar bloco and De quem é (1.9.0): the archived out of all but a choice (last); whose under the name", () => {
  const data = casa();
  data.blocks[3].archived = NOW - 86400000; // Ideias soltas
  data.blocks[0].owner = "Ana"; // Mercado
  let rep = anotacoes(data, { now: NOW });
  assert.deepEqual(rep.sections.map((s) => s.name), ["Mercado", "Reforma da cozinha", "Inglês"]);
  assert.equal(countText(rep), "3 blocos · 4 folhas");
  assert.deepEqual(rep.blocks.map((b) => [b.name, !!b.archived]), [["Mercado", false], ["Reforma da cozinha", false], ["Inglês", false], ["Ideias soltas", true]]);
  const h = reportHtml(rep);
  // 1.16.0: the archived ones at the end, under Arquivados (N), like at the end of Blocos
  assert.match(h, /<option value="ingles00001">Inglês<\/option><optgroup label="Arquivados \(1\)"><option value="ideias00001">Ideias soltas<\/option><\/optgroup><\/select>/);
  assert.doesNotMatch(reportHtml(anotacoes({ ...data, blocks: data.blocks.map((b) => ({ ...b, archived: undefined })) }, { now: NOW })), /optgroup/);
  // the boxes closed like the ones of the app: no arrow of the phone, the arrow of the app
  assert.match(h, /\.barra select\{[^}]*appearance:none;-webkit-appearance:none;[^}]*background-image:linear-gradient/);
  assert.match(h, /<h2><span><span class="hic"><svg class="i"[^>]*>.*?<\/svg><\/span>Mercado<\/span><small>Casa · de Ana · 2 folhas · abre de manhã \(05:00\)<\/small><\/h2>/);
  // 1.23.0: every section and button with its icon (the charts, each block, Voltar and Baixar PDF)
  assert.match(h, /return false\}"><svg class="i"[^>]*><path d="m15 18-6-6 6-6"\/><\/svg><span>Voltar<\/span><\/a>/);
  assert.match(h, /<svg class="i"[^>]*>.*?<\/svg><span>Baixar PDF<\/span><\/a>/);
  // chosen: it comes, marked
  rep = anotacoes(data, { bloco: "ideias00001", now: NOW });
  assert.deepEqual(rep.sections.map((s) => s.name), ["Ideias soltas"]);
  assert.match(reportHtml(rep), /<small>1 folha · arquivado<\/small>/);
  assert.match(reportPdf(rep).toString("latin1"), /\(1 folha \\267 arquivado\)/);
  // the archived ones count for Sem categoria (it can be chosen)
  rep = anotacoes(data, { categoria: "sem", now: NOW });
  assert.equal(rep.cat, "sem");
  assert.deepEqual(rep.sections, []);
  assert.match(reportHtml(rep), /<p class="vazio">Só blocos arquivados: escolha um no alto\.<\/p>/);
});

// 1.40.0: the bold, the bigger and the colors of a sheet show in the Relatório too (the page and the PDF)
const FORMATADA = "++Feira++ de **sábado**\n{azul:Levar sacolas} e **{vermelho:não esquecer}** o pão\n\n☐ **Leite** 🥛 em [Mercado](https://mercado.example.com/ofertas)";

test("the page: bold, bigger and colors as on the sheet, in the title too; the marks never show", () => {
  const data = casa();
  data.pages[0].text = FORMATADA;
  const h = reportHtml(anotacoes(data, { now: NOW }));
  assert.match(h, /<h3><span class="fg">Feira<\/span> de <span class="fb">sábado<\/span><\/h3>/);
  assert.match(h, /<div class="tx"><span class="fc-azul">Levar sacolas<\/span> e <span class="fb fc-vermelho">não esquecer<\/span> o pão\n\n☐ <span class="fb">Leite<\/span> 🥛 em <a href="https:\/\/mercado\.example\.com\/ofertas"/);
  assert.doesNotMatch(h.slice(h.indexOf("<article"), h.indexOf("</article>")), /\*\*|\+\+|\{azul:/);
  // the ink of each color on the light paper, on the dark one, and the light one again when printing
  assert.match(h, /\.folha \.fb\{font-weight:700\}\.folha \.fg\{font-size:1\.25em/);
  assert.match(h, /\.fc-azul\{color:#0b67a8\}/);
  assert.match(h, /:root\[data-theme="dark"\] \.fc-azul\{color:#62b5ff\}/);
  assert.match(h, /@media \(prefers-color-scheme:dark\)\{[^}]*:root:not\(\[data-theme="light"\]\) \.fc-vermelho\{color:#ff7a70\}/);
  assert.match(h, /@media print\{[^@]*\.fc-azul\{color:#0b67a8\}/);
  assert.equal(lineHtml("{verde:<i>} ++a++"), '<span class="fc-verde">&lt;i&gt;</span> <span class="fg">a</span>', "what was written is escaped inside a part too");
});

test("the PDF: each part with its bold, size and color; the links, the boxes and the emojis as before", () => {
  const data = casa();
  data.pages[0].text = FORMATADA;
  const s = reportPdf(anotacoes(data, { now: NOW })).toString("latin1");
  assert.match(s, /BT \/F2 14\.375 Tf 0\.078 0\.102 0\.133 rg 40 [\d.]+ Td \(Feira\) Tj ET/, "the bigger part of the title: 1.25 of its size");
  assert.match(s, /BT \/F2 11\.5 Tf 0\.078 0\.102 0\.133 rg [\d.]+ [\d.]+ Td \(de s\\341bado\) Tj ET/, "the rest of the title, bold as always");
  assert.match(s, /BT \/F1 10\.5 Tf 0\.043 0\.404 0\.659 rg 40 [\d.]+ Td \(Levar sacolas\) Tj ET/, "blue, not bold");
  assert.match(s, /BT \/F2 10\.5 Tf 0\.769 0\.165 0\.122 rg [\d.]+ [\d.]+ Td \(n\\343o esquecer\) Tj ET/, "bold and red");
  assert.match(s, /BT \/F1 10\.5 Tf 0\.078 0\.102 0\.133 rg [\d.]+ [\d.]+ Td \(o p\\343o\) Tj ET/);
  assert.match(s, /Td \(\[ \]\) Tj ET\nBT \/F2 10\.5 Tf [\d. ]+ rg [\d.]+ [\d.]+ Td \(Leite\) Tj ET\nBT \/F1 10\.5 Tf [\d. ]+ rg [\d.]+ [\d.]+ Td \(em Mercado \\\(mercado\.example\.com\\\)\) Tj ET/);
  assert.doesNotMatch(s, /\(\*\*|\+\+\)|azul:/, "no marks");
  // the pieces of a line, one after the other on the same baseline
  const y = (re) => Number(re.exec(s)[1]);
  assert.equal(y(/ ([\d.]+) Td \(Levar sacolas\)/), y(/ ([\d.]+) Td \(o p\\343o\)/));
});

test("the runs of a line and how they break: the look of each word is kept, and a look is one piece of text", () => {
  assert.deepEqual(lineRuns("☑ **Pão** 🍞 {azul:quente}"), [{ text: "[x] ", bold: false, big: false, color: "" }, { text: "Pão", bold: true, big: false, color: "" }, { text: "  ", bold: false, big: false, color: "" }, { text: "quente", bold: false, big: false, color: "azul" }]);
  assert.deepEqual(lineRuns(""), []);
  const lines = wrapRuns(lineRuns("um dois **três quatro** cinco {verde:seis sete oito} nove"), 80, 10.5);
  assert.ok(lines.length > 1);
  assert.equal(lines.map((l) => l.map((r) => r.text).join(" ")).join(" "), "um dois três quatro cinco seis sete oito nove", "nothing lost");
  for (const l of lines) {
    assert.equal(l[0].x, 0, "each line starts at the margin");
    for (let i = 1; i < l.length; i++) assert.ok(l[i].x > l[i - 1].x && (l[i].bold !== l[i - 1].bold || l[i].color !== l[i - 1].color), "a new piece only when the look changes");
  }
  assert.ok(lines.flat().some((r) => r.bold && /três|quatro/.test(r.text)) && lines.flat().some((r) => r.color === "verde"));
  // a part of a word in bold stays glued to the rest; a word wider than the line is cut; a title is all bold
  assert.deepEqual(wrapRuns(lineRuns("Su**per**"), 200, 10.5).map((l) => l.map((r) => [r.text, r.bold, r.x > 0])), [[["Su", false, false], ["per", true, true]]]);
  assert.ok(wrapRuns(lineRuns("Inconstitucionalissimamente"), 40, 10.5).length > 1);
  assert.deepEqual(wrapRuns(lineRuns("++Lista++ da feira"), 300, 11.5, true).map((l) => l.map((r) => [r.text, r.bold, r.size])), [[["Lista", true, 14.375], ["da feira", true, 11.5]]]);
  assert.deepEqual(wrapRuns([], 100, 10.5), []);
});
