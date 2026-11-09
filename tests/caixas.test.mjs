// Caixas de marcar (1.12.0): memoria/rootfs/app/lib/writing.js (☐ a fazer, ☑ feito; também [ ] e [x]) e o PDF do
// relatório (lib/report.js: as caixas como [ ] e [x], sem os emojis, que a Helvetica do PDF não tem).
import { test } from "node:test";
import assert from "node:assert/strict";
import { checkOf, hasChecks, toggleCheck, CHECK_TODO, CHECK_DONE } from "../memoria/rootfs/app/lib/writing.js";
import { readable } from "../memoria/rootfs/app/lib/report.js";

test("checkOf: a caixa no começo da linha (depois do recuo), com o espaço", () => {
  assert.deepEqual(checkOf("☐ Pão"), { indent: "", done: false, len: 2 });
  assert.deepEqual(checkOf("  ☑ Leite"), { indent: "  ", done: true, len: 4 });
  assert.deepEqual(checkOf("[ ] Feira"), { indent: "", done: false, len: 4 });
  assert.deepEqual(checkOf("[x] Feira"), { indent: "", done: true, len: 4 });
  assert.deepEqual(checkOf("[X]Feira"), { indent: "", done: true, len: 3 });
  assert.equal(checkOf("Pão ☐"), null, "só no começo da linha");
  assert.equal(checkOf("✅ Feito"), null, "um emoji não é caixa");
  assert.equal(checkOf(""), null);
});

test("hasChecks: alguma linha com caixa", () => {
  assert.equal(hasChecks("Compras\n☐ Pão"), true);
  assert.equal(hasChecks("Compras\n- Pão"), false);
  assert.equal(hasChecks(""), false);
});

test("toggleCheck: marca e desmarca a linha n; o resto fica como está", () => {
  const t = "Compras\n☐ Pão\n  [ ] Leite\nObs.";
  assert.equal(toggleCheck(t, 1), `Compras\n${CHECK_DONE} Pão\n  [ ] Leite\nObs.`);
  assert.equal(toggleCheck(toggleCheck(t, 1), 1), `Compras\n${CHECK_TODO} Pão\n  [ ] Leite\nObs.`);
  assert.equal(toggleCheck(t, 2), `Compras\n☐ Pão\n  ${CHECK_DONE} Leite\nObs.`, "[ ] vira ☑, com o recuo");
  assert.equal(toggleCheck(t, 3), t, "uma linha sem caixa não muda");
  assert.equal(toggleCheck(t, 9), t);
});

test("PDF: as caixas como [ ] e [x], sem emojis (a Helvetica não tem), o recuo fica", () => {
  assert.equal(readable("☐ Pão 🍞"), "[ ] Pão ");
  assert.equal(readable("  ☑ Leite"), "  [x] Leite");
  assert.equal(readable("🛒 Feira de domingo ✅"), " Feira de domingo ");
  assert.equal(readable("Marca® e Coisa™ © 2026"), "Marca® e Coisa™ © 2026", "o que a Helvetica tem fica");
  assert.equal(readable("Viagem ✈️ e 👍🏽 ok"), "Viagem e ok");
});
