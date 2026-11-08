// Mais › Relatório (memoria/rootfs/app/lib/report.js): what goes in, the page and the PDF. An invented house.
import { test } from "node:test";
import assert from "node:assert/strict";
import { anotacoes, countText, sheetParts, pdfName, reportHtml, reportPdf, graficos } from "../memoria/rootfs/app/lib/report.js";
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
  assert.match(h, />Voltar<\/a>/);
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
