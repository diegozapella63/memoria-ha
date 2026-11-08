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
