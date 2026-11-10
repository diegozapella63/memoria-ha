import { describe, it, before, after } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { AiUsage, resultOf } from "../memoria/rootfs/app/lib/usage.js";
import { tmpDir, fakeLog, local, httpServer, json, closedPort } from "./_helpers.mjs";

describe("resultOf: how a call ended", () => {
  it("ok, quota, format or error", () => {
    assert.equal(resultOf(null), "ok");
    assert.equal(resultOf(undefined), "ok");
    for (const m of ["Quota exceeded", "sem cota", "HTTP 429", "RESOURCE_EXHAUSTED", "resource exhausted", "Rate limit reached", "ratelimit", "Too Many Requests"]) assert.equal(resultOf(new Error(m)), "cota", m);
    assert.equal(resultOf({ code: "429" }), "cota");
    for (const m of ["Unexpected token < in JSON", "invalid json", "could not parse", "fora do formato"]) assert.equal(resultOf(new Error(m)), "formato", m);
    assert.equal(resultOf({ code: "formato", message: "A IA não devolveu sugestões" }), "formato");
    assert.equal(resultOf(new Error("timeout")), "erro");
    assert.equal(resultOf({}), "erro");
  });
});

function usage(t, { now = local(2026, 11, 2, 10, 0), rest = "", token = "", enabled = () => true } = {}) {
  t.mock.timers.enable({ apis: ["Date"], now: now.getTime() });
  const dir = tmpDir("memoria-usage-");
  const log = fakeLog();
  const u = new AiUsage({ dir, sensor: "sensor.memoria_ia_hoje", label: "MemorIA", rest, token, log, enabled });
  return { u, dir, log, disk: () => JSON.parse(fs.readFileSync(path.join(dir, "uso_ia.json"), "utf8")) };
}

describe("AiUsage.record", () => {
  it("adds the call to today's totals and to the last calls", (t) => {
    const { u, disk } = usage(t);
    u.record({ kind: "mensagem", entity: "ai_task.google", input: 1000, output: 203, images: 0, seconds: 1.234, result: "ok" });
    u.record({ kind: "fotos", entity: "ai_task.google", input: 400, output: 0, images: 2, seconds: 3.06, result: "erro" });
    u.record({ kind: "mensagem", entity: null, input: 4, output: 0, images: 0, seconds: 0.5, result: "cota" });
    const d = disk();
    assert.deepEqual(d.dias["2026-11-02"], { chamadas: 3, tokens: 301 + 100 + 1, imagens: 2, segundos: 4.8, erros: 1, cota: 1, tipos: { mensagem: 2, fotos: 1 }, ias: { "ai_task.google": 2, "padrão do Home Assistant": 1 } });
    assert.equal(d.ultimas.length, 3);
    assert.deepEqual(d.ultimas[0], { quando: new Date(local(2026, 11, 2, 10, 0)).toISOString(), tipo: "mensagem", ia: "padrão do Home Assistant", resultado: "cota", segundos: 0.5, tokens: 1, imagens: 0 });
    assert.equal(d.ultimas[2].tipo, "mensagem");
    assert.equal(d.ultimas[2].ia, "ai_task.google");
  });

  it("'formato' counts as an error, 'cota' does not", (t) => {
    const { u, disk } = usage(t);
    u.record({ kind: "sugestao", entity: "x", result: "formato" });
    assert.equal(disk().dias["2026-11-02"].erros, 1);
    assert.equal(disk().dias["2026-11-02"].cota, 0);
  });

  it("keeps the last 40 calls and 120 days", (t) => {
    const { u, dir, disk } = usage(t);
    const dias = {};
    for (let i = 0; i < 130; i++) {
      const d = new Date(2026, 5, 1 + i);
      dias[`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`] = { chamadas: 1 };
    }
    fs.writeFileSync(path.join(dir, "uso_ia.json"), JSON.stringify({ dias, ultimas: Array.from({ length: 45 }, (_, i) => ({ n: i })) }));
    u.record({ kind: "mensagem", entity: "x" });
    const out = disk();
    assert.equal(Object.keys(out.dias).length, 120);
    assert.ok(out.dias["2026-11-02"], "today is kept");
    assert.equal(Object.keys(out.dias).sort()[0], "2026-06-12", "the oldest days go first (06-01..10-08 + today = 131 days)");
    assert.equal(out.ultimas.length, 40);
    assert.equal(out.ultimas[1].n, 0);
  });

  it("survives a broken file and an unwritable folder", (t) => {
    const { u, dir, disk, log } = usage(t);
    fs.writeFileSync(path.join(dir, "uso_ia.json"), "{broken");
    u.record({ kind: "mensagem", entity: "x" });
    assert.equal(disk().dias["2026-11-02"].chamadas, 1);
    fs.rmSync(path.join(dir, "uso_ia.json"));
    fs.mkdirSync(path.join(dir, "uso_ia.json.tmp"));
    u.record({ kind: "mensagem", entity: "x" });
    assert.match(log.of("warn")[0], /Uso da IA/);
  });
});

describe("AiUsage.summary", () => {
  it("today, the last 7 days, this month, day by day, and the last 12 calls", (t) => {
    const { u, dir } = usage(t);
    const days = {
      "2026-10-26": { chamadas: 100 },
      "2026-10-27": { chamadas: 1, erros: 1, tipos: { fotos: 1 }, ias: { a: 1 } },
      "2026-10-31": { chamadas: 2, cota: 1, tokens: 10.5, segundos: 1.25 },
      "2026-11-01": { chamadas: 3, imagens: 2, tipos: { fotos: 2, mensagem: 1 }, ias: { a: 2, b: 1 } },
      "2026-11-02": { chamadas: 4, tokens: 99, tipos: { mensagem: 4 }, ias: { b: 4 } },
    };
    fs.writeFileSync(path.join(dir, "uso_ia.json"), JSON.stringify({ dias: days, ultimas: Array.from({ length: 20 }, (_, i) => ({ n: i })) }));
    const s = u.summary(local(2026, 11, 2, 18, 0));
    assert.equal(s.hoje.chamadas, 4);
    assert.deepEqual(s.hoje.tipos, { mensagem: 4 });
    assert.equal(s.semana.chamadas, 1 + 2 + 3 + 4, "27/10 to 02/11");
    assert.deepEqual(s.semana.tipos, { fotos: 3, mensagem: 5 });
    assert.deepEqual(s.semana.ias, { a: 3, b: 5 });
    assert.equal(s.semana.tokens, 109.5);
    assert.equal(s.mes.chamadas, 7);
    assert.deepEqual(s.dias.map((d) => d.dia), ["2026-10-27", "2026-10-28", "2026-10-29", "2026-10-30", "2026-10-31", "2026-11-01", "2026-11-02"]);
    assert.deepEqual(s.dias[0], { dia: "2026-10-27", chamadas: 1, erros: 1, cota: 0 });
    assert.deepEqual(s.dias[1], { dia: "2026-10-28", chamadas: 0, erros: 0, cota: 0 });
    assert.equal(s.ultimas.length, 12);
    assert.equal(s.desde, "2026-10-26");
    assert.equal(s.sensor, "sensor.memoria_ia_hoje");
    assert.equal(s.sensor_on, true);
  });

  it("the week crosses month and year ends", (t) => {
    const { u } = usage(t);
    assert.deepEqual(u.summary(local(2027, 1, 3)).dias.map((d) => d.dia), ["2026-12-28", "2026-12-29", "2026-12-30", "2026-12-31", "2027-01-01", "2027-01-02", "2027-01-03"]);
    assert.equal(u.summary(local(2028, 3, 2)).dias[4].dia, "2028-02-29");
  });

  it("empty without a file", (t) => {
    const { u } = usage(t, { enabled: () => false });
    const s = u.summary(local(2026, 11, 2));
    assert.equal(s.hoje.chamadas, 0);
    assert.equal(s.desde, null);
    assert.deepEqual(s.ultimas, []);
    assert.equal(s.sensor_on, false);
  });
});

describe("AiUsage: the sensor in Home Assistant", () => {
  let ha;
  let status = 200;
  before(async () => {
    ha = await httpServer((req, res) => json(res, status, {}));
  });
  after(() => ha.close());

  it("publishes today's calls as sensor.memoria_ia_hoje", async (t) => {
    ha.requests.length = 0;
    status = 200;
    const { u } = usage(t, { rest: `${ha.url}/api`, token: "tok" });
    u.record({ kind: "mensagem", entity: "ai_task.x", input: 40, output: 0 });
    await u.publish();
    const posts = ha.requests.filter((r) => r.method === "POST");
    assert.ok(posts.length >= 1);
    const last = posts.at(-1);
    assert.equal(last.url, "/api/states/sensor.memoria_ia_hoje");
    assert.equal(last.headers.authorization, "Bearer tok");
    const body = JSON.parse(last.body);
    assert.equal(body.state, 1);
    assert.equal(body.attributes.friendly_name, "MemorIA: chamadas de IA hoje");
    assert.equal(body.attributes.tokens_texto_estimados, 10);
    assert.deepEqual(body.attributes.por_tipo, { mensagem: 1 });
    assert.equal(body.attributes.ultima_chamada, new Date(local(2026, 11, 2, 10, 0)).toISOString());
  });

  it("publishes nothing when the sensors are off or there is no token", async (t) => {
    ha.requests.length = 0;
    await usage(t, { rest: `${ha.url}/api`, token: "tok", enabled: () => false }).u.publish();
    t.mock.timers.reset();
    await usage(t, { rest: `${ha.url}/api`, token: "" }).u.publish();
    assert.equal(ha.requests.length, 0);
  });

  it("warns once a day when Home Assistant refuses", async (t) => {
    status = 500;
    const { u, log } = usage(t, { rest: `${ha.url}/api`, token: "tok" });
    await u.publish();
    await u.publish();
    assert.deepEqual(log.of("warn"), ["Sensor sensor.memoria_ia_hoje: HTTP 500"]);
    status = 200;
  });

  it("remove() deletes the sensor, and is quiet offline", async (t) => {
    ha.requests.length = 0;
    await usage(t, { rest: `${ha.url}/api`, token: "tok" }).u.remove();
    assert.deepEqual(ha.requests.map((r) => [r.method, r.url]), [["DELETE", "/api/states/sensor.memoria_ia_hoje"]]);
    t.mock.timers.reset();
    const port = await closedPort();
    await assert.doesNotReject(usage(t, { rest: `http://127.0.0.1:${port}/api`, token: "tok" }).u.remove());
  });
});
