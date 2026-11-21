// lib/correria.js (the same file of the ResolvIA and the CronologIA): the key of the CorrerIA, the file
// share/memoria/correria.json and who used it last.
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { Correria, sameKey, ipOf, localIso, ROTA, bearerIs, addressOf, keyIn, writePrivate } from "../memoria/rootfs/app/lib/correria.js";
import { tmpDir, fakeLog, local } from "./_helpers.mjs";

const NETS = { lo: [{ family: "IPv4", internal: true, address: "127.0.0.1" }], eth0: [{ family: "IPv6", internal: false, address: "fe80::1" }, { family: "IPv4", internal: false, address: "172.30.33.7" }] };

const ABOUT = { app: "memoria", nome: "MemorIA", assunto: "blocos de anotações da casa" };
const other = (dir) => new Correria({ about: ABOUT, dir, dataDir: path.join(dir, "data"), port: 1, version: "1", log: fakeLog() });

function make({ on = true, url = "", nets = NETS } = {}) {
  const dir = tmpDir();
  const state = { on };
  const log = fakeLog();
  const c = new Correria({ about: ABOUT, dir: path.join(dir, "share", "memoria"), dataDir: path.join(dir, "data"), port: 8099, version: "9.9.9", log,
    enabled: () => state.on, url, host: () => "a0d7b954-memoria", ip: () => ipOf(nets) });
  return { c, dir, state, log, file: path.join(dir, "share", "memoria", "correria.json"), keyFile: path.join(dir, "data", "correria.key") };
}
const mode = (f) => fs.statSync(f).mode & 0o777;

describe("correria: helpers", () => {
  it("localIso is the local time without a zone", () => assert.equal(localIso(local(2026, 11, 8, 9, 41, 5)), "2026-11-08T09:41:05"));
  it("sameKey compares in constant time; anything else is no", () => {
    assert.equal(sameKey("abc", "abc"), true);
    assert.equal(sameKey("abd", "abc"), false);
    assert.equal(sameKey("abcd", "abc"), false);
    assert.equal(sameKey(undefined, "abc"), false);
    assert.equal(sameKey("abc", ""), false);
    assert.equal(sameKey("abc", null), false);
  });
  it("ipOf: the first IPv4 that is not the loopback", () => {
    assert.equal(ipOf(NETS), "172.30.33.7");
    assert.equal(ipOf({ lo: NETS.lo, x: undefined }), null);
    assert.equal(ipOf(null), null);
    assert.equal(ipOf({ eth0: [{ family: 4, internal: false, address: "10.0.0.2" }] }), "10.0.0.2", "Node 18 writes the family as a number");
  });
  it("the helpers of share/<app>/integracao.json too (the same file in the MemorIA and the CronologIA)", () => {
    const dir = tmpDir();
    const f = path.join(dir, "x", "integracao.json");
    writePrivate(f, "{}");
    assert.equal(fs.readFileSync(f, "utf8"), "{}");
    assert.equal(mode(f), 0o600);
    assert.deepEqual(fs.readdirSync(path.dirname(f)), ["integracao.json"], "no temp file left");
    const k = keyIn(path.join(dir, "k.key"));
    assert.equal(keyIn(path.join(dir, "k.key")), k);
    assert.equal(bearerIs({ authorization: `Bearer ${k}` }, k), true);
    assert.equal(bearerIs({ authorization: k }, k), false);
    assert.deepEqual(addressOf(8099, "", () => "casa", () => null), { url: "http://casa:8099", ip_url: null });
  });
});

describe("correria: the key and the file", () => {
  it("the key is made once (32 random bytes), kept only for the owner and read again", () => {
    const { c, keyFile, dir } = make();
    const k = c.chave();
    assert.match(k, /^[A-Za-z0-9_-]{43}$/);
    assert.equal(mode(keyFile), 0o600);
    assert.equal(c.chave(), k);
    const again = other(dir);
    assert.equal(again.chave(), k);
    fs.writeFileSync(keyFile, "curta");
    const short = other(dir);
    assert.notEqual(short.chave(), "curta");
  });
  it("ensure: on and the file gone, written again; off, nothing", () => {
    const { c, file, state } = make();
    c.ensure();
    assert.equal(fs.existsSync(file), true);
    state.on = false;
    c.publish();
    c.ensure();
    assert.equal(fs.existsSync(file), false);
  });
  it("on: the file of the contract, atomic and only for the owner; off: it goes away", () => {
    const { c, file, state } = make();
    assert.equal(c.publish(), true);
    const j = JSON.parse(fs.readFileSync(file, "utf8"));
    assert.deepEqual({ ...j, gravado_em: "x" }, {
      app: "memoria",
      nome: "MemorIA",
      assunto: "blocos de anotações da casa",
      url: "http://a0d7b954-memoria:8099",
      ip_url: "http://172.30.33.7:8099",
      chave: c.chave(),
      versao: "9.9.9",
      ferramentas: ROTA,
      gravado_em: "x",
    });
    assert.match(j.gravado_em, /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/);
    assert.equal(mode(file), 0o600);
    assert.deepEqual(fs.readdirSync(path.dirname(file)), ["correria.json"], "no temp file left");
    state.on = false;
    assert.equal(c.publish(), false);
    assert.equal(fs.existsSync(file), false);
    assert.equal(c.publish(), false, "already gone");
  });
  it("the address: the one given (development), or the name of the machine (no spare without an address)", () => {
    assert.deepEqual(make({ url: "http://127.0.0.1:9000/" }).c.address(), { url: "http://127.0.0.1:9000", ip_url: null });
    assert.deepEqual(make({ nets: {} }).c.address(), { url: "http://a0d7b954-memoria:8099", ip_url: null });
  });
  it("a share folder it cannot write: warned once, and again after it worked", () => {
    const { c, dir, log } = make();
    fs.mkdirSync(path.join(dir, "share"), { recursive: true });
    fs.writeFileSync(path.join(dir, "share", "memoria"), "a file in the way");
    assert.equal(c.publish(), false);
    assert.equal(c.publish(), false);
    assert.equal(log.of("warn").length, 1);
    assert.match(log.of("warn")[0], /CorrerIA: não consegui gravar/);
    fs.rmSync(path.join(dir, "share", "memoria"));
    assert.equal(c.publish(), true);
    assert.equal(c.warned, false);
  });
});

describe("correria: who may use it", () => {
  it("only on, with Bearer and this key", () => {
    const { c, state } = make();
    const k = c.chave();
    assert.equal(c.authorized({ authorization: `Bearer ${k}` }), true);
    assert.equal(c.authorized({ authorization: `Bearer ${k}x` }), false);
    assert.equal(c.authorized({ authorization: `Basic ${k}` }), false);
    assert.equal(c.authorized({}), false);
    assert.equal(c.authorized(null), false);
    state.on = false;
    assert.equal(c.authorized({ authorization: `Bearer ${k}` }), false);
  });
  it("the last use is kept (who and which tool) and read again on start", () => {
    const { c, dir } = make();
    assert.equal(c.last, null);
    c.used("  Claude  ", "resumo");
    assert.deepEqual({ ...c.last, em: "x" }, { cliente: "Claude", em: "x", nome: "resumo" });
    c.used("", null);
    assert.equal(c.last.cliente, "CorrerIA");
    assert.equal(c.last.nome, "");
    const again = other(dir);
    assert.deepEqual(again.last, c.last);
    assert.deepEqual(c.state(), { on: true, ultimo: c.last }, "what the screen shows");
    fs.writeFileSync(path.join(dir, "data", "correria-uso.json"), JSON.stringify({ cliente: 3 }));
    assert.equal(other(dir).last, null);
    fs.rmSync(path.join(dir, "data", "correria-uso.json"));
    fs.writeFileSync(path.join(dir, "data", "correria_uso.json"), JSON.stringify({ cliente: "Gemini", em: "2026-11-08T10:00:00" }));
    assert.deepEqual(other(dir).last, { cliente: "Gemini", em: "2026-11-08T10:00:00", nome: "" }, "the file of before 2.55 is still read");
  });
  it("a data folder it cannot write only loses the last use", () => {
    const { c, dir } = make();
    fs.mkdirSync(path.join(dir, "data", "correria-uso.json"), { recursive: true });
    c.used("WhatsApp", "tarefas");
    assert.equal(c.last.cliente, "WhatsApp");
  });
});
