// The data of the MemorIA (memoria/rootfs/app/lib/store.js): settings, validation and import.
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { Store, normalize } from "../memoria/rootfs/app/lib/store.js";

const log = { info() {}, warn() {}, error() {} };
const tmp = () => fs.mkdtempSync(path.join(os.tmpdir(), "memoria-test-"));

function fresh() {
  const dir = tmp();
  const store = new Store(dir, log);
  return { dir, store };
}

test("a new store starts with the two sample blocks", () => {
  const { store } = fresh();
  assert.deepEqual(store.data.blocks.map((b) => b.name), ["Diário", "Rascunhos"]);
  store.flush();
});

test("Cor do dia: on unless turned off; choosing a color turns it off; null turns it back on", () => {
  const { store } = fresh();
  assert.equal(store.data.app.accent_daily, undefined);
  let s = store.saveSettings({ app: { accent: "azul", accent_daily: false } });
  assert.equal(s.app.accent, "azul");
  assert.equal(s.app.accent_daily, false);
  s = store.saveSettings({ app: { accent_daily: null } });
  assert.equal("accent_daily" in s.app, false);
  assert.equal(s.app.accent, "azul");
  // anything but false means on
  s = store.saveSettings({ app: { accent_daily: true } });
  assert.equal("accent_daily" in s.app, false);
  store.flush();
});

test("Cor do dia off survives an import; junk is dropped", () => {
  const out = normalize({ blocks: [], pages: [], app: { accent: "menta", accent_daily: false, hand: "sim" } });
  assert.deepEqual(out.app, { accent: "menta", accent_daily: false });
  const on = normalize({ blocks: [], pages: [], app: { accent_daily: "no" } });
  assert.deepEqual(on.app, {});
});

test("settings: periods are validated", () => {
  const { store } = fresh();
  assert.throws(() => store.saveSettings({ periods: { manha: "25:99" } }), /horário inválido/);
  const s = store.saveSettings({ periods: { manha: "6:30" } });
  assert.equal(s.periods.manha, "06:30");
  store.flush();
});

// ------------------------------------------------------------------ Categorias (1.5.0)

test("categories: create, rename, recolor; names unique without minding case and accents", () => {
  const { store } = fresh();
  const casa = store.saveCategory({ name: "  Casa  ", color: "menta" });
  assert.equal(casa.name, "Casa");
  assert.equal(casa.color, "menta");
  assert.match(casa.id, /^[a-z0-9]{6,32}$/);
  const est = store.saveCategory({ name: "Estudos" });
  assert.equal(est.color, "grafite");
  assert.throws(() => store.saveCategory({ name: "casa" }), /Já existe a categoria casa/);
  assert.throws(() => store.saveCategory({ name: "Éstudos" }), /Já existe/);
  assert.throws(() => store.saveCategory({ name: "   " }), /Dê um nome/);
  assert.throws(() => store.saveCategory({ id: "naoexiste1", name: "X" }), /não existe/);
  const renamed = store.saveCategory({ id: casa.id, name: "Casa e jardim", color: "nope" });
  assert.equal(renamed.name, "Casa e jardim");
  assert.equal(renamed.color, "menta", "an unknown color keeps the old one");
  // the same name for itself is fine
  assert.equal(store.saveCategory({ id: est.id, name: "estudos" }).name, "estudos");
  assert.equal(store.data.categories.length, 2);
  assert.equal(store.saveCategory({ name: "x".repeat(80) }).name.length, 40);
  store.flush();
});

test("categories: a block goes into one, out of it, and a deleted one leaves its blocks without a category", () => {
  const { store } = fresh();
  const cat = store.saveCategory({ name: "Trabalho", color: "laranja" });
  const [b1, b2] = store.data.blocks;
  assert.equal(store.saveBlock({ id: b1.id, category: cat.id }).category, cat.id);
  store.saveBlock({ id: b2.id, category: cat.id });
  assert.throws(() => store.saveBlock({ id: b1.id, category: "naoexiste1" }), /categoria não existe/);
  // other changes keep the category
  assert.equal(store.saveBlock({ id: b1.id, name: "Diário de bordo" }).category, cat.id);
  assert.equal("category" in store.saveBlock({ id: b2.id, category: "" }), false);
  store.saveBlock({ id: b2.id, category: cat.id });
  const changed = store.deleteCategory(cat.id);
  assert.deepEqual(changed.map((b) => b.id).sort(), [b1.id, b2.id].sort());
  assert.ok(store.data.blocks.every((b) => !("category" in b)));
  assert.equal(store.data.categories.length, 0);
  assert.throws(() => store.deleteCategory(cat.id), /não existe/);
  // a new block can come with a category
  const c2 = store.saveCategory({ name: "Casa" });
  assert.equal(store.saveBlock({ name: "Mercado", category: c2.id }).category, c2.id);
  store.flush();
});

test("categories: Começar do zero keeps them; an import brings and validates them", () => {
  const { store } = fresh();
  store.saveCategory({ name: "Casa", color: "menta" });
  store.erase();
  assert.equal(store.data.blocks.length, 0);
  assert.deepEqual(store.data.categories.map((c) => c.name), ["Casa"]);
  const out = normalize({
    categories: [
      { id: "catcasa0001", name: "Casa", color: "menta" },
      { id: "catcasa0001", name: "Repetido", color: "azul" },
      { id: "catdup00001", name: "CASA" },
      { name: "", color: "azul" },
      null,
      { id: "!", name: "Estudos", color: "roxo" },
    ],
    blocks: [
      { id: "bloco000001", name: "Mercado", category: "catcasa0001" },
      { id: "bloco000002", name: "Solto", category: "naoexiste1" },
    ],
    pages: [],
  });
  assert.equal(out.categories.length, 3);
  assert.deepEqual(out.categories.map((c) => c.name), ["Casa", "Repetido", "Estudos"]);
  assert.notEqual(out.categories[1].id, "catcasa0001", "a repeated id gets a new one");
  assert.equal(out.categories[2].color, "grafite");
  assert.equal(out.blocks[0].category, "catcasa0001");
  assert.equal("category" in out.blocks[1], false, "an unknown category is dropped");
  assert.deepEqual(normalize({ blocks: [], pages: [] }).categories, []);
  store.flush();
});

test("categories: at most 50", () => {
  const { store } = fresh();
  for (let i = 0; i < 50; i++) store.saveCategory({ name: `C${i}` });
  assert.throws(() => store.saveCategory({ name: "Mais uma" }), /categorias demais/);
  store.flush();
});
