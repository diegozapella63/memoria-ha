// Links in the sheets (memoria/rootfs/app/lib/links.js): what is a link, its short name, the safe addresses only.
import { test } from "node:test";
import assert from "node:assert/strict";
import { parseLinks, hasLinks, linksToText, normalizeUrl, linkMarkdown, shortUrl, domainOf } from "../memoria/rootfs/app/lib/links.js";

const links = (t) => parseLinks(t).filter((p) => p.type === "link").map((p) => p.url);
const parts = (t) => parseLinks(t).map((p) => (p.type === "link" ? ["L", p.url, p.label] : ["T", p.text]));

test("a bare address inside a sentence, with the punctuation of the sentence left out", () => {
  assert.deepEqual(parts("Veja https://site.com.br/a, depois."), [["T", "Veja "], ["L", "https://site.com.br/a", "site.com.br/a"], ["T", ", depois."]]);
  for (const end of [".", ",", ";", ":", "!", "?", "…", '"', "'", "”", "»", "!!", "?)."]) {
    assert.deepEqual(links(`ok https://a.com/x${end}`), ["https://a.com/x"], `ending ${end}`);
  }
  assert.deepEqual(links("(https://a.com/x)"), ["https://a.com/x"]);
  assert.deepEqual(links("[https://a.com/x]"), ["https://a.com/x"]);
  assert.deepEqual(links("https://pt.wikipedia.org/wiki/Bolo_(culin%C3%A1ria)."), ["https://pt.wikipedia.org/wiki/Bolo_(culin%C3%A1ria)"]);
  assert.deepEqual(links("uma\nhttps://a.com\noutra https://b.com"), ["https://a.com/", "https://b.com/"]);
  assert.deepEqual(links("www.site.com.br/receita e WWW.OUTRO.COM"), ["https://www.site.com.br/receita", "https://www.outro.com/"]);
  assert.deepEqual(links("http://localhost:8123/lovelace/0"), ["http://localhost:8123/lovelace/0"]);
});

test("the parts keep where they are in the text", () => {
  const t = "a https://x.com/b c [Nome](https://y.com) d";
  for (const p of parseLinks(t)) {
    if (p.type === "text") assert.equal(t.slice(p.start, p.start + p.text.length), p.text);
    else assert.ok(t.slice(p.start, p.end).includes(p.url.replace(/\/$/, "")) || t.slice(p.start, p.end).startsWith("[Nome]"));
  }
  assert.equal(parseLinks(t).map((p) => (p.type === "text" ? p.text : t.slice(p.start, p.end))).join(""), t);
});

test("only http and https: javascript:, data:, mailto: and the like stay text", () => {
  for (const t of ["javascript:alert(1)", "[clique](javascript:alert(1))", "[x](data:text/html,<b>oi</b>)", "mailto:ana@exemplo.com", "ftp://a.com/x", "[x](JaVaScRiPt:alert(1))", "file:///etc/passwd", "[x](//a.com)"]) {
    assert.deepEqual(links(t), [], t);
    assert.equal(hasLinks(t), false, t);
  }
  // an address glued to a word is not a link; a host must look like one
  assert.deepEqual(links("xhttps://a.com"), []);
  assert.deepEqual(links("https://a e https://.com e https://a-.com"), []);
  assert.deepEqual(links("ana@www.site.com"), []);
  // a markdown with a bad address: the address inside it that is good is still a link, the rest stays text
  assert.deepEqual(parts("[x](http://a.com/<b>)"), [["T", "[x]("], ["L", "http://a.com/", "a.com"], ["T", "<b>)"]]);
});

test("[Nome](address): the name is the label; an empty name is no link", () => {
  assert.deepEqual(parts("Ver [Receita da vó](https://receitas.com.br/23-bolo.html)!"), [["T", "Ver "], ["L", "https://receitas.com.br/23-bolo.html", "Receita da vó"], ["T", "!"]]);
  assert.deepEqual(links("[Wiki](https://pt.wikipedia.org/wiki/Bolo_(x))"), ["https://pt.wikipedia.org/wiki/Bolo_(x)"]);
  const long = parseLinks(`[${"N".repeat(60)}](https://a.com)`)[0];
  assert.equal(long.label.length, 40);
  assert.ok(long.label.endsWith("…"));
  assert.deepEqual(parts("[ ](https://a.com)"), [["T", "[ ]("], ["L", "https://a.com/", "a.com"], ["T", ")"]]);
});

test("long addresses get a short name: the site and the last part, or what was searched", () => {
  const g = "https://www.google.com/search?q=receita+de+bolo+de+cenoura&sca_esv=a1b2c3d4e5&rlz=1C1GCEA&ei=AbCdEfGhIjKlMnOp&ved=0ahUKEwj&uact=5&oq=receita&gs_lp=Egxnd3Mtd2l6LXNlcnAiB3JlY2VpdGE";
  assert.equal(shortUrl(g), "google.com · receita de bolo de cenoura");
  assert.equal(parseLinks(`Busca: ${g}.`)[1].url, g);
  assert.equal(shortUrl("https://www.youtube.com/watch?v=abc"), "youtube.com/watch…");
  assert.equal(shortUrl("https://www.youtube.com/results?search_query=bolo+fofo"), "youtube.com · bolo fofo");
  assert.equal(shortUrl("https://pt.wikipedia.org/wiki/Bolo_(culin%C3%A1ria)"), "pt.wikipedia.org/…/Bolo_(culinária)");
  assert.equal(shortUrl("https://a.com/"), "a.com");
  assert.equal(shortUrl("https://a.com/?x=1"), "a.com/…");
  assert.ok(shortUrl(`https://muito-longo.com.br/${"x".repeat(200)}`).length <= 36);
  assert.equal(domainOf("https://www.receitas.com.br/x"), "receitas.com.br");
});

test("the text outside the app: links as their names (with the site in the report)", () => {
  const t = "Oi [Receita](https://www.receitas.com.br/bolo) e https://youtube.com/watch?v=1";
  assert.equal(linksToText(t), "Oi Receita e youtube.com/watch…");
  assert.equal(linksToText(t, { domain: true }), "Oi Receita (receitas.com.br) e youtube.com/watch…");
  assert.equal(linksToText("sem links"), "sem links");
  assert.equal(linksToText(""), "");
});

test("Adicionar link: what was typed becomes a safe address and the [Nome](address) of the sheet", () => {
  assert.equal(normalizeUrl(" https://site.com.br/a?b=1 "), "https://site.com.br/a?b=1");
  assert.equal(normalizeUrl("site.com.br/receita"), "https://site.com.br/receita");
  assert.equal(normalizeUrl("www.site.com"), "https://www.site.com/");
  assert.equal(normalizeUrl("localhost:8123/x"), "https://localhost:8123/x");
  for (const bad of ["", "  ", "javascript:alert(1)", "mailto:a@b.com", "data:text/html,x", "uma frase", "https://", "site", "ftp://a.com"]) assert.equal(normalizeUrl(bad), null, bad);
  assert.equal(linkMarkdown("https://a.com/x", "  Receita  da vó "), "[Receita da vó](https://a.com/x)");
  assert.equal(linkMarkdown("https://a.com/x", ""), "https://a.com/x");
  assert.equal(linkMarkdown("https://a.com/x", "[a]b"), "[ab](https://a.com/x)");
  // parentheses in the address don't break the link
  const md = linkMarkdown("https://pt.wikipedia.org/wiki/Bolo_(x))", "Wiki");
  assert.deepEqual(parts(md), [["L", "https://pt.wikipedia.org/wiki/Bolo_%28x%29%29", "Wiki"]]);
});
