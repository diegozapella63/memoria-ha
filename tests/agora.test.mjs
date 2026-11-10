// The Agora from now on (1.13.0): what holds now first, then the next two times, past midnight too (ahead), and the
// same for the other apps of the family (trechos, GET /api/integracao/agora). An invented house (Ana and Beto).
import { test } from "node:test";
import assert from "node:assert/strict";
import { buildSchedule, ahead } from "../memoria/rootfs/app/lib/schedule.js";
import { trechos, panelOf, MAX_TEXT_OUT, clockOf } from "../memoria/rootfs/app/lib/integracao.js";
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
    papel: "pautado",
    letra: "mao",
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
  // 1.20.0: MEMORIA_HOST takes the place of the hostname (the tests of Atalho no celular)
  process.env.MEMORIA_HOST = "a1b2c3d4-memoria";
  try {
    assert.equal(panelOf(), "/app/a1b2c3d4_memoria");
  } finally {
    delete process.env.MEMORIA_HOST;
  }
});

// ---------- 1.14.0: Fica no Agora (how long a time holds) and the marks of the Agora (only for that time of the sheet)
import { currentAt, nextAfter, occurrence } from "../memoria/rootfs/app/lib/schedule.js";
import { Store } from "../memoria/rootfs/app/lib/store.js";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

test("Fica no Agora: past its time, nothing holds until the next start", () => {
  const d = casa();
  d.blocks[2].dur = 120; // Inglês 19:30 for 2 h: until 21:30
  const entries = buildSchedule(d);
  let cur = currentAt(entries, at(20));
  assert.deepEqual([cur.min, cur.end], [at(19, 30), at(21, 30)]);
  assert.equal(currentAt(entries, at(21, 30)), null, "21:30: over");
  assert.equal(currentAt(entries, at(23)), null);
  assert.equal(currentAt(entries, at(4)), null, "after midnight too: not the one of yesterday");
  assert.equal(currentAt(entries, at(5)).min, at(5), "the next one starts as always");
  assert.equal(currentAt(entries, at(10)).end, null, "Até o próximo: no end");
  // nothing now: the next ones, none of them now
  const g = ahead(entries, at(23));
  assert.deepEqual(times(g), ["05:00", "09:00", "19:30"]);
  assert.deepEqual(g.map((x) => [x.now, x.tomorrow]), [[false, true], [false, true], [false, true]]);
  assert.deepEqual(times(ahead(entries, at(4))), ["05:00", "09:00", "19:30"]);
  assert.equal(nextAfter(entries, at(23)).min, at(5));
  // a sheet with a time and the block of the same time: the longest holds (one until the next: until the next)
  d.blocks[1].times = ["19:30"];
  assert.equal(currentAt(buildSchedule(d), at(23)).min, at(19, 30), "Reforma até o próximo keeps 19:30 on");
  d.blocks[1].dur = 240;
  assert.equal(currentAt(buildSchedule(d), at(23)).end, at(23, 30));
  // only one time a day, over: the next is it, tomorrow
  const one = { blocks: [{ id: "b1", name: "Janta", times: ["18:00"], dur: 240 }], pages: [] };
  assert.equal(currentAt(buildSchedule(one), at(23)), null);
  assert.deepEqual([nextAfter(buildSchedule(one), at(23)).min, nextAfter(buildSchedule(one), at(23)).tomorrow], [at(18), true]);
  assert.equal(nextAfter(buildSchedule(one), at(19)), null, "on: it is the one of all day");
  // a duration that isn't a choice counts as Até o próximo
  assert.equal(currentAt(buildSchedule({ blocks: [{ id: "b1", name: "X", times: ["18:00"], dur: 7 }], pages: [] }), at(3)).min, at(18));
});

test("the time a start comes: the one of now started today or yesterday; one peeked at, its next time", () => {
  const now = new Date(2026, 10, 9, 6, 52);
  assert.equal(occurrence(at(18), now, true), "2026-11-08T18:00", "18:00 still on at 06:52: since yesterday");
  assert.equal(occurrence(at(6), now, true), "2026-11-09T06:00");
  assert.equal(occurrence(at(7), now, false), "2026-11-09T07:00", "the next 07:00 is today");
  assert.equal(occurrence(at(6), now, false), "2026-11-10T06:00", "the next 06:00 is tomorrow");
  assert.equal(occurrence(at(23, 30), new Date(2026, 11, 31, 23, 45), false), "2027-01-01T23:30", "across the year");
});

test("the store: Fica no Agora on blocks and sheets, and the marks apart from the text", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "memoria-tempo-"));
  const s = new Store(dir, { warn() {}, info() {} });
  const b = s.saveBlock({ name: "Janta", times: ["18:00"], dur: 240 });
  assert.equal(b.dur, 240);
  assert.throws(() => s.saveBlock({ id: b.id, dur: 45 }), /tempo inválido/);
  assert.equal(s.saveBlock({ id: b.id, dur: 0 }).dur, undefined, "Até o próximo: not kept");
  const p = s.savePage({ block: b.id, text: "Janta\n☐ Arroz\n☐ Feijão", times: ["18:00"], dur: 120 });
  assert.equal(p.dur, 120);
  assert.equal(s.savePage({ id: p.id, dur: 0 }).dur, undefined);
  const at1 = occurrence(at(18), new Date(), true);
  assert.deepEqual(s.saveMarks(p.id, at1, ["Arroz", " Arroz ", "", 3]), { at: at1, lines: ["Arroz"] });
  assert.equal(s.page(p.id).text, "Janta\n☐ Arroz\n☐ Feijão", "the text doesn't change");
  assert.equal(s.saveMarks(p.id, at1, []), null, "nothing ticked: no marks");
  assert.equal(s.data.marks[p.id], undefined);
  s.saveMarks(p.id, at1, ["Feijão"]);
  assert.throws(() => s.saveMarks(p.id, "ontem", ["Arroz"]), /horário inválido/);
  assert.throws(() => s.saveMarks("nao-existe", at1, ["Arroz"]), /página não existe/);
  // a restore keeps them while they are fresh; old ones (over 3 days) and those of sheets gone are dropped
  const raw = JSON.parse(JSON.stringify(s.data));
  raw.marks.velha00001 = { at: at1, lines: ["X"] };
  raw.marks[p.id + "x"] = { at: "2020-01-01T18:00", lines: ["X"] };
  s.replaceAll(raw, "teste");
  assert.deepEqual(s.data.marks, { [p.id]: { at: at1, lines: ["Feijão"] } });
  assert.deepEqual(Object.keys(s.replaceAll({ ...raw, marks: { [p.id]: { at: "2020-01-01T18:00", lines: ["Arroz"] } } }, "teste").marks), []);
  s.saveMarks(p.id, at1, ["Arroz"]);
  s.deletePage(p.id);
  assert.deepEqual(s.data.marks, {}, "the sheet gone: its marks too");
  const p2 = s.savePage({ block: b.id, text: "☐ Suco" });
  s.saveMarks(p2.id, at1, ["Suco"]);
  s.deleteBlock(b.id);
  assert.deepEqual(s.data.marks, {}, "the block gone: the marks of its sheets too");
  clearTimeout(s.timer);
  fs.rmSync(dir, { recursive: true, force: true });
});

test("trechos for the CronologIA: fim with Fica no Agora, none now past it, and the boxes ticked in the Agora", () => {
  const d = casa();
  d.pages[1].text = "Churrasco do Beto\n☐ Carvão\n☐ Sal grosso";
  d.pages[1].dur = 180; // 09:00 for 3 h
  let out = trechos(d, { now: when(10) });
  assert.deepEqual([out[0].inicio, out[0].agora, out[0].fim], ["09:00", true, "12:00"]);
  assert.equal(out[1].fim, undefined, "only the one of now");
  d.marks = { [d.pages[1].id]: { at: "2026-11-08T09:00", lines: ["Carvão"] } };
  assert.equal(trechos(d, { now: when(10) })[0].texto, "Churrasco do Beto\n☑ Carvão\n☐ Sal grosso", "ticked in the Agora at 09:00 today");
  d.marks[d.pages[1].id].at = "2026-11-07T09:00";
  assert.equal(trechos(d, { now: when(10) })[0].texto, "Churrasco do Beto\n☐ Carvão\n☐ Sal grosso", "yesterday's marks: clean");
  out = trechos(d, { now: when(13) });
  assert.deepEqual(out.map((t) => [t.inicio, t.agora]), [["19:30", false], ["05:00", false], ["09:00", false]], "past 12:00: none now, the next three");
});

test("1.15.1: the clock of whoever is looking (their phone), the paper of the block and the letters of the sheets", () => {
  const fallback = new Date(2026, 10, 9, 14, 9);
  const c = clockOf("12:09", "2026-11-09", fallback);
  assert.deepEqual([c.getFullYear(), c.getMonth(), c.getDate(), c.getHours(), c.getMinutes()], [2026, 10, 9, 12, 9]);
  for (const [h, d] of [["", "2026-11-09"], ["12:09", ""], ["24:00", "2026-11-09"], ["12:9", "2026-11-09"], ["12:09", "2026-02-30"], ["12:09", "09/11/2026"]]) {
    assert.equal(clockOf(h, d, fallback), fallback, `${h} ${d}: the server's`);
  }
  // the server is ahead (another time zone): at its 20:00 the last one holds; at the phone's 13:30, the sheet of 09:00
  const data = casa();
  assert.equal(trechos(data, { now: when(20) })[0].inicio, "19:30");
  const t = trechos(data, { now: clockOf("13:30", "2026-11-08", when(20)) });
  assert.deepEqual([t[0].inicio, t[0].agora], ["09:00", true]);
  assert.deepEqual([t[0].papel, t[0].letra], ["pautado", "mao"]);
  data.blocks.forEach((b) => (b.paper = "quadriculado"));
  data.app = { ...(data.app || {}), hand: false };
  assert.deepEqual([trechos(data, { now: when(13, 30) })[0].papel, trechos(data, { now: when(13, 30) })[0].letra], ["quadriculado", "normal"]);
  data.blocks.forEach((b) => (b.paper = "<script>"));
  assert.equal(trechos(data, { now: when(13, 30) })[0].papel, "pautado", "an unknown paper: the default");
});
