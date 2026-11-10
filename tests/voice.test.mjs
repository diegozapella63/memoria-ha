import { describe, it, before, after } from "node:test";
import assert from "node:assert/strict";
import { Readable } from "node:stream";
import { Voice, readRaw, VOICE_RATE, MAX_VOICE_BYTES } from "../memoria/rootfs/app/lib/voice.js";
import { fakeLog, httpServer, json, closedPort } from "./_helpers.mjs";

const STATES = [
  { entity_id: "stt.home_assistant_cloud", state: "unknown", attributes: { friendly_name: "Home Assistant Cloud" } },
  { entity_id: "stt.faster_whisper", state: "unknown", attributes: { friendly_name: "faster-whisper" } },
  { entity_id: "stt.faster_whisper", state: "unknown", attributes: { friendly_name: "repeated" } },
  { entity_id: "stt.no_name", state: "unknown", attributes: {} },
  { entity_id: "stt.Bad-Id", state: "unknown", attributes: {} },
  { entity_id: "light.sala", state: "on", attributes: {} },
];
const PIPES = {
  pipelines: [
    { id: "p0", name: "Sem fala", language: "pt", stt_engine: null },
    { id: "p1", name: "Home Assistant", language: "pt", stt_engine: "stt.home_assistant_cloud", stt_language: "pt-BR" },
    { id: "p2", name: "Casa Wyoming", language: "pt-PT", stt_engine: "wyoming_local" },
    { id: "p3", name: "Whisper", language: "pt", stt_engine: "stt.faster_whisper", stt_language: "pt" },
  ],
  preferred_pipeline: "p1",
};

/** Languages each engine names (GET /api/stt/<engine>); POST answers with `answer`. */
let langs = {};
let answer = () => [200, { result: "success", text: " Comprar pilhas e pão " }];
let rest;
before(async () => {
  rest = await httpServer((req, res) => {
    const m = req.url.match(/^\/api\/stt\/(.+)$/);
    if (!m) return json(res, 404, {});
    const engine = decodeURIComponent(m[1]);
    if (req.method === "GET") {
      const l = langs[engine];
      if (l instanceof Error) return json(res, 500, {});
      return json(res, 200, { languages: l || [] });
    }
    const [status, body] = answer(engine);
    if (typeof body === "string") return res.writeHead(status).end(body);
    json(res, status, body);
  });
});
after(() => rest.close());

function voice({ states = STATES, pipes = PIPES, pick = "", statesFail = false, pipesFail = false } = {}) {
  const calls = [];
  const ha = {
    async send(msg) {
      calls.push(msg.type);
      if (msg.type === "get_states") {
        if (statesFail) throw new Error("states down");
        return states;
      }
      if (msg.type === "assist_pipeline/pipeline/list") {
        if (pipesFail) throw new Error("unknown command");
        return pipes;
      }
      throw new Error(msg.type);
    },
  };
  const log = fakeLog();
  const sel = { pick };
  const v = new Voice({ ha, rest: `${rest.url}/api`, token: "tok", log, pick: () => sel.pick });
  return { v, calls, log, sel };
}

describe("Voice.options: the speech-to-text engines", () => {
  it("lists the stt entities and the engines of the voice assistants, once each", async () => {
    const { v } = voice();
    const o = await v.options();
    assert.deepEqual(o.list, [
      { id: "stt.home_assistant_cloud", name: "Home Assistant Cloud", language: "pt-BR" },
      { id: "stt.faster_whisper", name: "faster-whisper", language: "pt" },
      { id: "stt.no_name", name: "stt.no_name", language: null },
      { id: "wyoming_local", name: "Casa Wyoming (assistente de voz)", language: "pt-PT" },
    ]);
    assert.deepEqual(o.auto, { engine: "stt.home_assistant_cloud", language: "pt-BR", name: "Home Assistant Cloud" });
  });

  it("automatic = the engine of the preferred assistant; else the first assistant with one; else the first engine", async () => {
    assert.equal((await voice({ pipes: { ...PIPES, preferred_pipeline: "p3" } }).v.options()).auto.engine, "stt.faster_whisper");
    assert.equal((await voice({ pipes: { ...PIPES, preferred_pipeline: "p0" } }).v.options()).auto.engine, "stt.home_assistant_cloud", "the preferred one has no speech-to-text");
    const noPipes = await voice({ pipes: { pipelines: [] } }).v.options();
    assert.deepEqual(noPipes.auto, { engine: "stt.home_assistant_cloud", language: null, name: "Home Assistant Cloud" });
    assert.equal((await voice({ pipes: {}, states: [] }).v.options()).auto, null);
  });

  it("an assistant's own engine is named after the assistant", async () => {
    const o = await voice({ pipes: { ...PIPES, preferred_pipeline: "p2" } }).v.options();
    assert.deepEqual(o.auto, { engine: "wyoming_local", language: "pt-PT", name: "Casa Wyoming" });
  });

  it("keeps working (and warns) when Home Assistant fails one of the questions", async () => {
    const a = voice({ pipesFail: true });
    const o = await a.v.options();
    assert.equal(o.list.length, 3);
    assert.equal(o.auto.engine, "stt.home_assistant_cloud");
    assert.match(a.log.of("warn")[0], /Assistentes de voz: unknown command/);
    const b = voice({ statesFail: true });
    assert.deepEqual((await b.v.options()).list.map((x) => x.id), ["stt.home_assistant_cloud", "wyoming_local", "stt.faster_whisper"]);
    assert.match(b.log.of("warn")[0], /Fala para texto: states down/);
  });

  it("keeps the answer for a minute", async (t) => {
    t.mock.timers.enable({ apis: ["Date"], now: 1_000_000 });
    const { v, calls } = voice();
    await v.options();
    t.mock.timers.tick(59_999);
    await v.options();
    assert.equal(calls.length, 2);
    t.mock.timers.tick(1);
    await v.options();
    assert.equal(calls.length, 4);
    v.forget();
    await v.options();
    assert.equal(calls.length, 6);
  });
});

describe("Voice.languageFor: Portuguese as each engine names it", () => {
  const cases = [
    [["en-US", "pt-BR", "pt-PT"], "pt-BR"],
    [["en", "PT_br"], "PT_br"],
    [["en", "es", "pt"], "pt"],
    [["pt-PT", "pt"], "pt"],
    [["pt-PT", "pt-AO"], "pt-PT"],
    [["en", "es"], "pt-BR"],
    [[], "pt-BR"],
  ];
  for (const [list, want] of cases) {
    it(`${JSON.stringify(list)} -> ${want}`, async () => {
      langs = { "stt.x": list };
      assert.equal(await voice().v.languageFor("stt.x"), want);
    });
  }

  it("asks with the token, encodes the engine, and remembers the answer", async () => {
    langs = { "weird/engine": ["pt"] };
    rest.requests.length = 0;
    const { v } = voice();
    assert.equal(await v.languageFor("weird/engine"), "pt");
    assert.equal(await v.languageFor("weird/engine"), "pt");
    assert.equal(rest.requests.length, 1);
    assert.equal(rest.requests[0].url, "/api/stt/weird%2Fengine");
    assert.equal(rest.requests[0].headers.authorization, "Bearer tok");
  });

  it("a failure gives pt-BR without remembering it", async () => {
    langs = { "stt.x": new Error("boom") };
    rest.requests.length = 0;
    const { v } = voice();
    assert.equal(await v.languageFor("stt.x"), "pt-BR");
    langs = { "stt.x": ["pt"] };
    assert.equal(await v.languageFor("stt.x"), "pt");
    assert.equal(rest.requests.length, 2);
  });

  it("offline: pt-BR and a warning", async () => {
    const port = await closedPort();
    const log = fakeLog();
    const v = new Voice({ ha: { send: async () => ({}) }, rest: `http://127.0.0.1:${port}/api`, token: "t", log });
    assert.equal(await v.languageFor("stt.x"), "pt-BR");
    assert.match(log.of("warn")[0], /Fala para texto \(stt\.x\)/);
  });
});

describe("Voice.engine and status", () => {
  it("automatic: the assistant's engine with its language (no extra question)", async () => {
    rest.requests.length = 0;
    const { v } = voice();
    assert.deepEqual(await v.engine(), { engine: "stt.home_assistant_cloud", language: "pt-BR", name: "Home Assistant Cloud", chosen: false });
    assert.equal(rest.requests.length, 0);
  });

  it("chosen in the app: that engine, with its language", async () => {
    const { v } = voice({ pick: "stt.faster_whisper" });
    assert.deepEqual(await v.engine(), { engine: "stt.faster_whisper", language: "pt", name: "faster-whisper", chosen: true });
  });

  it("chosen but without a known language: asks the engine", async () => {
    langs = { "stt.no_name": ["en", "pt-BR"] };
    const { v } = voice({ pick: "stt.no_name" });
    assert.equal((await v.engine()).language, "pt-BR");
  });

  it("the automatic engine without a language asks it too", async () => {
    langs = { "stt.home_assistant_cloud": ["pt-PT"] };
    const { v } = voice({ pipes: { pipelines: [] } });
    assert.deepEqual(await v.engine(), { engine: "stt.home_assistant_cloud", language: "pt-PT", name: "Home Assistant Cloud", chosen: false });
  });

  it("a chosen engine that is gone falls back to the automatic one, and status says it is missing", async () => {
    const { v } = voice({ pick: "stt.gone" });
    assert.equal((await v.engine()).engine, "stt.home_assistant_cloud");
    const s = await v.status();
    assert.equal(s.ready, true);
    assert.equal(s.missing, true);
    assert.equal(s.selected, "stt.gone");
    assert.equal(s.chosen, false);
  });

  it("follows a new choice right away (the cache is per choice)", async () => {
    const { v, sel } = voice();
    assert.equal((await v.engine()).engine, "stt.home_assistant_cloud");
    sel.pick = "stt.faster_whisper";
    assert.equal((await v.engine()).engine, "stt.faster_whisper");
  });

  it("status: what the screen needs", async () => {
    const s = await voice({ pick: "stt.faster_whisper" }).v.status();
    assert.deepEqual(s, {
      ready: true,
      engine: "stt.faster_whisper",
      language: "pt",
      name: "faster-whisper",
      chosen: true,
      selected: "stt.faster_whisper",
      missing: false,
      options: [
        { id: "stt.home_assistant_cloud", name: "Home Assistant Cloud" },
        { id: "stt.faster_whisper", name: "faster-whisper" },
        { id: "stt.no_name", name: "stt.no_name" },
        { id: "wyoming_local", name: "Casa Wyoming (assistente de voz)" },
      ],
      auto: { engine: "stt.home_assistant_cloud", name: "Home Assistant Cloud" },
    });
  });

  it("status without any engine explains how to get one", async () => {
    const s = await voice({ states: [], pipes: { pipelines: [] } }).v.status();
    assert.equal(s.ready, false);
    assert.match(s.reason, /assistente de voz com fala para texto/);
    assert.deepEqual(s.options, []);
    assert.equal(s.auto, null);
  });

  it("status({fresh: true}) asks Home Assistant again", async () => {
    const { v, calls } = voice();
    await v.status();
    const n = calls.length;
    await v.status();
    assert.equal(calls.length, n);
    await v.status({ fresh: true });
    assert.ok(calls.length > n);
  });
});

describe("Voice.text: audio to text", () => {
  const pcm = (seconds) => Buffer.alloc(Math.round(VOICE_RATE * 2 * seconds), 1);

  it("sends the raw audio with the exact header names the Supervisor proxy passes on", async () => {
    rest.requests.length = 0;
    answer = () => [200, { result: "success", text: " Comprar pilhas e pão " }];
    const audio = pcm(1);
    const out = await voice().v.text(audio);
    assert.deepEqual(out, { text: "Comprar pilhas e pão", engine: "stt.home_assistant_cloud", name: "Home Assistant Cloud" });
    const req = rest.requests.find((r) => r.method === "POST");
    assert.equal(req.url, "/api/stt/stt.home_assistant_cloud");
    const raw = Object.fromEntries(req.rawHeaders.reduce((acc, h, i) => (i % 2 ? acc : [...acc, [h, req.rawHeaders[i + 1]]]), []));
    assert.equal(raw["X-Speech-Content"], "format=wav; codec=pcm; sample_rate=16000; bit_rate=16; channel=1; language=pt-BR");
    assert.equal(raw.Authorization, "Bearer tok");
    assert.equal(raw["Content-Type"], "application/octet-stream");
    assert.equal(raw["Content-Length"], String(audio.length));
    assert.ok(req.body.equals(audio));
  });

  it("uses the language of the chosen engine", async () => {
    rest.requests.length = 0;
    await voice({ pick: "stt.faster_whisper" }).v.text(pcm(1));
    const req = rest.requests.find((r) => r.method === "POST");
    assert.match(req.headers["x-speech-content"], /language=pt$/);
  });

  it("refuses audio that is too short or too long", async () => {
    const { v } = voice();
    await assert.rejects(v.text(null), { code: "invalid_format", message: /Não ouvi nada/ });
    await assert.rejects(v.text(Buffer.alloc(VOICE_RATE * 2 * 0.4 - 1)), { code: "invalid_format", message: /Não ouvi nada/ });
    await assert.rejects(v.text(Buffer.alloc(MAX_VOICE_BYTES + 1)), { code: "invalid_format", message: /2 minutos/ });
    assert.equal(MAX_VOICE_BYTES, 16000 * 2 * 125);
  });

  it("without an engine: no_stt with the explanation", async () => {
    await assert.rejects(voice({ states: [], pipes: {} }).v.text(pcm(1)), { code: "no_stt", message: /assistente de voz/ });
  });

  it("an answer without text, or not a success, is 'not understood'", async () => {
    for (const body of [{ result: "error", text: "x" }, { result: "success", text: "  " }, "not json", {}]) {
      answer = () => [200, body];
      await assert.rejects(voice().v.text(pcm(1)), { code: "not_understood" }, JSON.stringify(body));
    }
  });

  it("explains a refused audio and a failing Home Assistant, and forgets the engine", async () => {
    answer = () => [415, "Unsupported"];
    await assert.rejects(voice().v.text(pcm(1)), { code: "failed", message: "A fala para texto não aceitou o áudio (Unsupported)." });
    answer = () => [400, ""];
    await assert.rejects(voice().v.text(pcm(1)), { code: "failed", message: "A fala para texto não aceitou o áudio (400)." });
    answer = () => [500, "boom"];
    const { v, calls, log } = voice();
    await assert.rejects(v.text(pcm(1)), { code: "failed", message: "A fala para texto do Home Assistant falhou (500: boom)." });
    assert.match(log.of("warn")[0], /500 boom/);
    assert.equal(v.cache, null);
    const n = calls.length;
    answer = () => [200, { result: "success", text: "ok" }];
    await v.text(pcm(1));
    assert.ok(calls.length > n, "asked Home Assistant again");
  });
});

describe("readRaw", () => {
  it("joins the body", async () => {
    const out = await readRaw(Readable.from([Buffer.from("ab"), Buffer.from("cd")]), 10);
    assert.equal(out.toString(), "abcd");
  });

  it("stops a body that is too big", async () => {
    const req = Readable.from([Buffer.alloc(6), Buffer.alloc(6)]);
    await assert.rejects(readRaw(req, 10), { code: "too_big" });
  });

  it("too big: reads to the end before saying so (the 413 reaches the browser); far too big: closes", async () => {
    const { EventEmitter } = await import("node:events");
    const fake = () => Object.assign(new EventEmitter(), { destroyed: false, destroy() { this.destroyed = true; } });
    const r = fake();
    const p = readRaw(r, 4).catch((x) => x);
    r.emit("data", Buffer.from("abc"));
    r.emit("data", Buffer.from("def"));
    assert.equal(r.destroyed, false, "not cut in the middle of the upload");
    r.emit("end");
    assert.equal((await p).code, "too_big");
    const big = fake();
    const q = readRaw(big, 4).catch((x) => x);
    big.emit("data", Buffer.alloc(10));
    big.emit("data", Buffer.alloc(10));
    assert.equal(big.destroyed, true, "over 4 times the limit");
    big.emit("end");
    assert.equal((await q).code, "too_big");
  });

  it("passes on a stream error", async () => {
    const req = new Readable({ read() {} });
    const p = readRaw(req, 10);
    req.destroy(new Error("cut"));
    await assert.rejects(p, /cut/);
  });
});
