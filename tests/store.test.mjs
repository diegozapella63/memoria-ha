// The data of the MemorIA (memoria/rootfs/app/lib/store.js): settings, validation and import.
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { Store, normalize } from "../memoria/rootfs/app/lib/store.js";
import { buildSchedule, currentAt, opensFor, ownerName } from "../memoria/rootfs/app/lib/schedule.js";
import { Sensor } from "../memoria/rootfs/app/lib/sensor.js";

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

// ------------------------------------------------------------------ Usar IA and Falar (1.7.0)

test("Usar IA: on unless turned off; Falar: a stt.* engine or the automatic one", () => {
  const { store } = fresh();
  let s = store.saveSettings({ app: { ai_off: true, voice_engine: "stt.home_assistant_cloud" } });
  assert.equal(s.app.ai_off, true);
  assert.equal(s.app.voice_engine, "stt.home_assistant_cloud");
  s = store.saveSettings({ app: { ai_off: null, voice_engine: "javascript:alert(1)" } });
  assert.equal("ai_off" in s.app, false);
  assert.equal("voice_engine" in s.app, false);
  store.saveSettings({ app: { voice_engine: "stt.faster_whisper", ai_entity: "ai_task.google_ai_task" } });
  // the AI and the speech-to-text belong to this Home Assistant, not to the file imported
  const back = store.replaceAll({ blocks: [], pages: [], app: { ai_off: true, voice_engine: "stt.outro", ai_entity: "ai_task.outra" } }, "teste");
  assert.equal(back.app.voice_engine, "stt.faster_whisper");
  assert.equal(back.app.ai_entity, "ai_task.google_ai_task");
  assert.equal(back.app.ai_off, true);
  store.flush();
});

// ------------------------------------------------------------------ Integrações › CorrerIA (1.8.0)

test("CorrerIA: off unless turned on; it belongs to this Home Assistant, not to an imported file", () => {
  const { store } = fresh();
  assert.equal(store.data.app.correria, undefined);
  let s = store.saveSettings({ app: { correria: "sim" } });
  assert.equal("correria" in s.app, false);
  s = store.saveSettings({ app: { correria: true } });
  assert.equal(s.app.correria, true);
  // an import (or Começar do zero) keeps it on; a file that brings it on doesn't turn it on
  assert.equal(store.replaceAll({ blocks: [], pages: [], app: {} }, "teste").app.correria, true);
  assert.equal(store.erase().app.correria, true);
  s = store.saveSettings({ app: { correria: null } });
  assert.equal("correria" in s.app, false);
  assert.equal(store.replaceAll({ blocks: [], pages: [], app: { correria: true } }, "teste").app.correria, undefined);
  store.flush();
});

// ------------------------------------------------------------------ Arquivar bloco e De quem é (1.9.0)

test("Arquivar bloco: kept with when, nothing deleted; false brings it back; an old file is not archived", () => {
  const { store } = fresh();
  const diario = store.data.blocks[0];
  const pages = store.data.pages.length;
  let b = store.saveBlock({ id: diario.id, archived: true });
  assert.ok(Number.isFinite(b.archived) && b.archived > 0);
  const when = b.archived;
  // saving the sheet again (name, color…) keeps it archived, and since when
  b = store.saveBlock({ id: diario.id, name: "Diário antigo", archived: true });
  assert.equal(b.archived, when);
  b = store.saveBlock({ id: diario.id, color: "azul" });
  assert.equal(b.archived, when);
  assert.equal(store.data.pages.length, pages);
  b = store.saveBlock({ id: diario.id, archived: false });
  assert.equal("archived" in b, false);
  assert.equal("archived" in normalize({ blocks: [{ id: "abc123", name: "A" }], pages: [] }).blocks[0], false);
  assert.equal(normalize({ blocks: [{ id: "abc123", name: "A", archived: 1790000000000 }], pages: [] }).blocks[0].archived, 1790000000000);
  assert.equal("archived" in normalize({ blocks: [{ id: "abc123", name: "A", archived: "sim" }], pages: [] }).blocks[0], false);
  store.flush();
});

test("De quem é: a name, or everyone's (empty or Todos); an old file is everyone's", () => {
  const { store } = fresh();
  const id = store.data.blocks[0].id;
  let b = store.saveBlock({ id, owner: "  Ana   Souza " });
  assert.equal(b.owner, "Ana Souza");
  b = store.saveBlock({ id, name: "Diário da Ana" });
  assert.equal(b.owner, "Ana Souza", "the sheet without owner keeps it");
  b = store.saveBlock({ id, owner: "todos" });
  assert.equal("owner" in b, false);
  store.saveBlock({ id, owner: "Beto" });
  b = store.saveBlock({ id, owner: "" });
  assert.equal("owner" in b, false);
  assert.equal(normalize({ blocks: [{ id: "abc123", name: "A", owner: "Beto" }], pages: [] }).blocks[0].owner, "Beto");
  assert.equal("owner" in normalize({ blocks: [{ id: "abc123", name: "A", owner: 7 }], pages: [] }).blocks[0], false);
  assert.equal("owner" in normalize({ blocks: [{ id: "abc123", name: "A" }], pages: [] }).blocks[0], false);
  store.flush();
});

test("the Agora (buildSchedule): never an archived block; with a person, theirs and everyone's", () => {
  const data = {
    periods: { manha: "05:00", tarde: "12:00", noite: "18:00" },
    blocks: [
      { id: "todos00001", name: "Casa", periods: ["manha"], times: [], order: 0 },
      { id: "ana0000001", name: "Diário da Ana", periods: ["noite"], times: [], order: 1, owner: "Ana" },
      { id: "beto000001", name: "Treino do Beto", periods: [], times: ["07:00"], order: 2, owner: "Beto" },
      { id: "velho00001", name: "Viagem", periods: [], times: ["08:00"], order: 3, archived: 1790000000000 },
    ],
    pages: [{ id: "pgvelho001", block: "velho00001", text: "Roteiro", times: ["09:00"], created: 1, updated: 1 }],
  };
  const ids = (person) => [...new Set(buildSchedule(data, { person }).map((e) => e.block))];
  // nobody in particular (a shared tablet, the sensor): every block not archived, nor its sheets with a time
  assert.deepEqual(ids(""), ["todos00001", "beto000001", "ana0000001"]);
  assert.deepEqual(ids("Ana"), ["todos00001", "ana0000001"]);
  assert.deepEqual(ids("beto"), ["todos00001", "beto000001"], "accents and case don't matter");
  assert.equal(opensFor(data.blocks[1], "Beto"), false);
  assert.equal(opensFor(data.blocks[3], ""), false);
  assert.equal(ownerName(" Todos "), "");
});

test("sensor.memoria_agora: an archived block never is the block of the moment", () => {
  const { store } = fresh();
  const [diario, rascunhos] = store.data.blocks;
  store.saveBlock({ id: diario.id, periods: [], times: ["07:00"] });
  store.saveBlock({ id: rascunhos.id, periods: [], times: ["06:00"] });
  const sensor = new Sensor({ store, log, restUrl: "", token: "", enabled: () => true });
  const at = new Date(2026, 10, 8, 7, 30);
  assert.equal(sensor.state(at).state, "Diário");
  store.saveBlock({ id: diario.id, archived: true });
  assert.equal(sensor.state(at).state, "Rascunhos");
  // a block of a person still counts for the sensor (a panel is like a shared tablet)
  store.saveBlock({ id: diario.id, archived: false, owner: "Ana" });
  assert.equal(sensor.state(at).state, "Diário");
  store.flush();
});

// ------------------------------------------------------------------ Agora (1.10.1)

test("Agora: a sheet with its own time opens its block, even a block without times, for its owner", () => {
  const data = {
    periods: { manha: "05:00", tarde: "12:00", noite: "18:00" },
    blocks: [
      { id: "geral00001", name: "Anotações da casa", periods: [], times: [], order: 0 },
      { id: "comida0001", name: "Cardápio", periods: [], times: [], order: 1, owner: "Beto" },
    ],
    pages: [
      { id: "pgjanta001", block: "comida0001", text: "Janta", times: ["18:00"], created: 1, updated: 1 },
      { id: "pggeral001", block: "geral00001", text: "Lembretes", times: [], created: 2, updated: 2 },
    ],
  };
  // Beto: the sheet at 18:00 is the one of the moment (and since yesterday at 18:00 in the afternoon)
  const beto = buildSchedule(data, { person: "Beto" });
  assert.deepEqual(beto.map((e) => [e.min, e.block, e.page, e.kind]), [[18 * 60, "comida0001", "pgjanta001", "page"]]);
  const cur = currentAt(beto, 14 * 60);
  assert.equal(cur.main.page, "pgjanta001");
  assert.ok(cur.min > 14 * 60, "it started yesterday");
  // Ana: nothing with a time is hers or everyone's, so nothing is the block of the moment (no block without a time)
  assert.deepEqual(buildSchedule(data, { person: "Ana" }), []);
  assert.equal(currentAt(buildSchedule(data, { person: "Ana" }), 14 * 60), null);
});
