// 1.27.0: Negrito e cor numa parte do texto (lib/format.js): as partes, o texto sem as marcas e o que a barra faz.
import { test } from "node:test";
import assert from "node:assert/strict";
import { hasFormat, parseFormat, stripFormat, formatText, formatAt, markRuns, FORMAT_COLORS } from "../memoria/rootfs/app/lib/format.js";
import { linksToText } from "../memoria/rootfs/app/lib/links.js";
import { readable, lineHtml } from "../memoria/rootfs/app/lib/report.js";

test("the parts: bold, a color, a color with bold inside; where each starts in the sheet", () => {
  assert.deepEqual(parseFormat("Café **forte** e {azul:leite **zero**}!"), [
    { text: "Café ", start: 0, bold: false, color: "" },
    { text: "forte", start: 7, bold: true, color: "" },
    { text: " e ", start: 14, bold: false, color: "" },
    { text: "leite ", start: 23, bold: false, color: "azul" },
    { text: "zero", start: 31, bold: true, color: "azul" },
    { text: "!", start: 38, bold: false, color: "" },
  ]);
  assert.deepEqual(parseFormat("**{vermelho:atenção}**"), [{ text: "atenção", start: 12, bold: true, color: "vermelho" }]);
  assert.ok(hasFormat("um **dois**") && hasFormat("{lilas:x}"));
  for (const t of ["a ** b ** c", "2 * 3 * 4", "{rosa:x}", "{azul:}", "**\n**", "{azul:a\nb}"]) assert.equal(hasFormat(t), false, t);
  assert.deepEqual(FORMAT_COLORS, ["vermelho", "laranja", "verde", "azul", "lilas"]);
});

test("without the marks: the titles, the report, the other apps", () => {
  assert.equal(stripFormat("**Feira** de {verde:sábado}"), "Feira de sábado");
  assert.equal(linksToText("**Receita** [Bolo](https://site.com/bolo)"), "Receita Bolo");
  assert.equal(readable("☐ **pão** {azul:quente}"), "[ ] pão quente");
  assert.equal(lineHtml("**a** <b>"), "a &lt;b&gt;");
});

test("Negrito: puts the marks on the selection and takes them again; without a selection, to write", () => {
  assert.deepEqual(formatText("Café forte", 5, 10, "negrito"), { text: "Café **forte**", s: 5, e: 14 });
  assert.deepEqual(formatText("Café **forte**", 5, 14, "negrito"), { text: "Café forte", s: 5, e: 10 });
  assert.deepEqual(formatText("Café **forte**", 7, 12, "negrito"), { text: "Café forte", s: 5, e: 10 }, "only the text between the marks");
  assert.deepEqual(formatText("ab", 1, 1, "negrito"), { text: "a****b", s: 3, e: 3 });
  assert.deepEqual(formatText("Café forte ", 5, 11, "negrito"), { text: "Café **forte** ", s: 5, e: 15 }, "the spaces stay outside");
  assert.equal(formatText("um\ndois", 0, 7, "negrito").text, "**um**\n**dois**", "each line");
});

test("a color: puts, changes, takes (the same one again or Sem cor)", () => {
  assert.deepEqual(formatText("leite", 0, 5, "azul"), { text: "{azul:leite}", s: 0, e: 12 });
  assert.deepEqual(formatText("{azul:leite}", 0, 12, "azul"), { text: "leite", s: 0, e: 5 });
  assert.deepEqual(formatText("{azul:leite}", 0, 12, "verde"), { text: "{verde:leite}", s: 0, e: 13 });
  assert.deepEqual(formatText("{azul:leite}", 6, 11, "verde"), { text: "{verde:leite}", s: 7, e: 12 }, "the text inside the marks");
  assert.deepEqual(formatText("{azul:leite}", 6, 11, "azul"), { text: "leite", s: 0, e: 5 });
  assert.deepEqual(formatText("{azul:leite}", 6, 11, "sem-cor"), { text: "leite", s: 0, e: 5 });
  assert.deepEqual(formatText("a {azul:b} c", 0, 12, "sem-cor"), { text: "a b c", s: 0, e: 5 }, "Sem cor in a longer selection");
  assert.deepEqual(formatText("a {azul:b} c", 0, 12, "verde"), { text: "{verde:a b c}", s: 0, e: 13 });
  assert.deepEqual(formatText("ab", 1, 1, "lilas"), { text: "a{lilas:}b", s: 8, e: 8 });
  assert.deepEqual(formatText("ab", 0, 2, "outra"), { text: "ab", s: 0, e: 2 }, "an unknown kind does nothing");
  assert.deepEqual(formatText("ab", 0, 2, "sem-cor"), { text: "ab", s: 0, e: 2 });
});

test("1.28.0: with the cursor in a word, without selecting: the word; inside a part, the part; the cursor stays", () => {
  assert.deepEqual(formatAt("Café forte e leite", 6, "negrito"), { text: "Café **forte** e leite", s: 8, e: 8 });
  assert.deepEqual(formatAt("Café **forte** e leite", 9, "negrito"), { text: "Café forte e leite", s: 7, e: 7 }, "inside: the bold goes away");
  assert.deepEqual(formatAt("Café **forte** e leite", 5, "negrito"), { text: "Café forte e leite", s: 5, e: 5 }, "at the edge too");
  assert.deepEqual(formatAt("* Café - 0,5", 4, "negrito"), { text: "* **Café** - 0,5", s: 6, e: 6 }, "a list: only the word");
  assert.deepEqual(formatAt("Café forte", 10, "negrito"), { text: "Café **forte**", s: 12, e: 12 }, "at the end of the word: it, and the cursor inside to go on");
  assert.deepEqual(formatAt("a  b", 2, "negrito"), { text: "a **** b", s: 4, e: 4 }, "between words: the marks, to write");
  assert.deepEqual(formatAt("Café forte e leite", 15, "azul"), { text: "Café forte e {azul:leite}", s: 21, e: 21 });
  assert.deepEqual(formatAt("Café {azul:leite} x", 12, "azul"), { text: "Café leite x", s: 6, e: 6 }, "the same color: it goes away");
  assert.deepEqual(formatAt("Café {azul:leite} x", 12, "verde"), { text: "Café {verde:leite} x", s: 13, e: 13 }, "another color: it changes");
  assert.deepEqual(formatAt("Café {azul:leite} x", 12, "sem-cor"), { text: "Café leite x", s: 6, e: 6 });
  assert.deepEqual(formatAt("Café forte", 3, "sem-cor"), { text: "Café forte", s: 3, e: 3 }, "Sem cor without a color: nothing");
  assert.deepEqual(formatAt("ab", 1, "outra"), { text: "ab", s: 1, e: 1 });
});

test("1.28.0: the runs drawn while writing: every character, the marks apart, each with its bold and color", () => {
  const t = "Café **forte** e {azul:leite **zero**}!";
  const r = markRuns(t);
  assert.equal(r.map((x) => x.text).join(""), t, "nothing left out, nothing added");
  assert.deepEqual(
    r.map((x) => [x.text, x.mark, x.bold, x.color]),
    [
      ["Café ", false, false, ""],
      ["**", true, true, ""],
      ["forte", false, true, ""],
      ["**", true, true, ""],
      [" e ", false, false, ""],
      ["{azul:", true, false, "azul"],
      ["leite ", false, false, "azul"],
      ["**", true, true, "azul"],
      ["zero", false, true, "azul"],
      ["**", true, true, "azul"],
      ["}", true, false, "azul"],
      ["!", false, false, ""],
    ],
  );
  assert.deepEqual(markRuns(""), []);
  assert.deepEqual(markRuns("sem nada"), [{ text: "sem nada", mark: false, bold: false, color: "" }]);
});
