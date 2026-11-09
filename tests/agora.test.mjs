// The Agora from now on (1.13.0): what holds now first, then the next two times, past midnight too (ahead), and the
// same for the other apps of the family (trechos, GET /api/integracao/agora). An invented house (Ana and Beto).
import { test } from "node:test";
import assert from "node:assert/strict";
import { buildSchedule, ahead } from "../memoria/rootfs/app/lib/schedule.js";
import { trechos, panelOf, MAX_TEXT_OUT } from "../memoria/rootfs/app/lib/integracao.js";
import { casa } from "./fixtures/casa.mjs";

const at = (h, m = 0) => h * 60 + m;
const when = (h, m = 0) => new Date(2026, 10, 8, h, m);
const times = (list) => list.map((g) => `${String(Math.floor(g.min / 60)).padStart(2, "0")}:${String(g.min % 60).padStart(2, "0")}`);

// the house: Mercado at 05:00 (Manhã), its sheet Churrasco do Beto at 09:00, Inglês at 19:30
test("ahead: the time of now first, then the next two, wrapping past midnight", () => {
  const entries = buildSchedule(casa());
  let g = ahead(entries, at(13, 30));
  assert.deepEqual(times(g), ["09:00", "19:30", "05:00"]);
  assert.deepEqual(g.map((x) => [x.now, x.yesterday, x.tomorrow]), [[true, false, false], [false, false, false], [false, false, true]]);
  // at 20:00 the last of the day holds: the next ones are tomorrow, never the ones that already passed today first
  g = ahead(entries, at(20));
  assert.deepEqual(times(g), ["19:30", "05:00", "09:00"]);
  assert.deepEqual(g.map((x) => x.tomorrow), [false, true, true]);
  // after midnight: the one of yesterday still holds, and the next ones are today
  g = ahead(entries, at(2));
  assert.deepEqual(times(g), ["19:30", "05:00", "09:00"]);
  assert.deepEqual(g.map((x) => [x.now, x.yesterday, x.tomorrow]), [[true, true, false], [false, false, false], [false, false, false]]);
  // right at a start time, that one holds
  assert.deepEqual(times(ahead(entries, at(9))), ["09:00", "19:30", "05:00"]);
});

test("ahead: never the same time twice; one time, nothing else; nothing with a time, nothing", () => {
  const entries = buildSchedule(casa());
  assert.deepEqual(times(ahead(entries, at(13), 5)), ["09:00", "19:30", "05:00"]);
  assert.deepEqual(times(ahead(entries, at(13), 1)), ["09:00"]);
  const one = casa();
  one.blocks.forEach((b) => ((b.periods = []), (b.times = [])));
  one.pages.forEach((p) => (p.times = []));
  one.blocks[2].times = ["19:30"];
  assert.deepEqual(times(ahead(buildSchedule(one), at(8))), ["19:30"]);
  one.blocks[2].times = [];
  assert.deepEqual(ahead(buildSchedule(one), at(8)), []);
});

test("ahead: blocks and sheets at the same time are one group", () => {
  const d = casa();
  d.blocks[1].times = ["09:00"]; // Reforma da cozinha at 09:00 too
  const g = ahead(buildSchedule(d), at(10));
  assert.equal(g[0].min, at(9));
  assert.deepEqual(g[0].entries.map((e) => e.block), ["mercado0001", "reforma0001"], "the sheet with its own time first");
});

test("trechos: the sheet of now and of the next two times, for the other apps", () => {
  const out = trechos(casa(), { now: when(13, 30) });
  assert.equal(out.length, 3);
  assert.deepEqual(out[0], {
    inicio: "09:00",
    agora: true,
    ontem: false,
    amanha: false,
    bloco: "Mercado",
    bloco_id: "mercado0001",
    cor: "laranja",
    folha_id: "pg000000002",
    titulo: "Churrasco do Beto",
    texto: "Churrasco do Beto\n\nCarvão, sal grosso, linguiça e pão de alho.",
    tipo: "trecho",
    outros: 0,
  });
  // a block with a time: its last sheet, the one the Agora opens
  assert.deepEqual([out[1].inicio, out[1].tipo, out[1].bloco, out[1].folha_id, out[1].titulo, out[1].agora], ["19:30", "horario", "Inglês", "pg000000004", "Aula 12", false]);
  // a block with a period, tomorrow
  assert.deepEqual([out[2].inicio, out[2].tipo, out[2].periodo, out[2].amanha], ["05:00", "periodo", "Manhã", true]);
  // after midnight, the one of yesterday
  const night = trechos(casa(), { now: when(1) });
  assert.deepEqual([night[0].inicio, night[0].ontem, night[1].amanha], ["19:30", true, false]);
});

test("trechos: links as their names, long text cut, a block without sheets, the person's blocks and everyone's", () => {
  const d = casa();
  d.pages[1].text = `Churrasco do Beto\n[Receita da farofa](https://exemplo.com.br/farofa)\n☐ Carvão\n☑ Sal grosso\n${"x".repeat(3000)}`;
  let out = trechos(d, { now: when(10) });
  assert.match(out[0].texto, /^Churrasco do Beto\nReceita da farofa\n☐ Carvão\n☑ Sal grosso\nx+…$/);
  assert.equal(out[0].texto.length, MAX_TEXT_OUT);
  // a block with a time and no sheet yet
  d.pages = d.pages.filter((p) => p.block !== "ingles00001");
  out = trechos(d, { now: when(10) });
  assert.deepEqual([out[1].bloco, out[1].folha_id, out[1].titulo, out[1].texto], ["Inglês", null, "", ""]);
  // Inglês is Beto's: not in Ana's, in Beto's; nobody in particular: every block
  d.blocks[2].owner = "Beto";
  assert.deepEqual(trechos(d, { person: "Ana", now: when(10) }).map((t) => t.bloco), ["Mercado", "Mercado"]);
  assert.deepEqual(trechos(d, { person: "Beto", now: when(10) }).map((t) => t.inicio), ["09:00", "19:30", "05:00"]);
  assert.equal(trechos(d, { now: when(10) }).length, 3);
  // an archived block never
  d.blocks[2].archived = Date.now();
  assert.equal(trechos(d, { person: "Beto", now: when(10) }).length, 2);
  assert.deepEqual(trechos({ blocks: [], pages: [] }), []);
});

test("the address of the app in Home Assistant", () => {
  assert.equal(panelOf("a1b2c3d4-memoria"), "/app/a1b2c3d4_memoria");
  assert.equal(panelOf("local-memoria"), "/app/local_memoria");
  assert.equal(panelOf("meu-computador"), null);
});
