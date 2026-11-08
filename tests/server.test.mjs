// The server of the MemorIA with the Home Assistant simulated (dev/fake-ha.mjs): the categories over the WebSocket
// (every screen hears the change) and Mais › Relatório as a page and as a PDF. An invented house.
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import fs from "node:fs";
import net from "node:net";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { casa } from "./fixtures/casa.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const procs = [];
let base = "";

const freePort = () =>
  new Promise((resolve) => {
    const s = net.createServer();
    s.listen(0, "127.0.0.1", () => {
      const { port } = s.address();
      s.close(() => resolve(port));
    });
  });

function start(file, env, ready) {
  const p = spawn(process.execPath, [file], { cwd: ROOT, env: { ...process.env, ...env }, stdio: ["ignore", "pipe", "pipe"] });
  procs.push(p);
  return new Promise((resolve, reject) => {
    let out = "";
    const timer = setTimeout(() => reject(new Error(`${file} did not start: ${out}`)), 8000);
    const on = (d) => {
      out += d;
      if (ready.test(out)) {
        clearTimeout(timer);
        resolve();
      }
    };
    p.stdout.on("data", on);
    p.stderr.on("data", on);
  });
}

before(async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "memoria-srv-"));
  fs.mkdirSync(path.join(dir, "media"));
  fs.writeFileSync(path.join(dir, "memoria.json"), JSON.stringify(casa(Date.now())));
  const haPort = await freePort();
  const port = await freePort();
  await start("dev/fake-ha.mjs", { FAKE_HA_PORT: String(haPort), FAKE_MEDIA_DIR: path.join(dir, "media"), FAKE_STT_TEXT: "Comprar pão e regar as plantas" }, /fake Home Assistant/);
  await start(
    "memoria/rootfs/app/server.js",
    {
      MEMORIA_DEV: "1",
      PORT: String(port),
      HA_WS_URL: `ws://127.0.0.1:${haPort}/api/websocket`,
      HA_REST_URL: `http://127.0.0.1:${haPort}/api`,
      HA_TOKEN: "dev",
      DATA_DIR: dir,
      MEDIA_DIR: path.join(dir, "media"),
      SHARE_DIR: path.join(dir, "share"),
    },
    /ouvindo na porta/,
  );
  base = `http://127.0.0.1:${port}`;
});

after(() => {
  for (const p of procs) p.kill();
});

/** A screen of the app: the WebSocket of the MemorIA. */
async function screen() {
  const ws = new WebSocket(`${base.replace("http", "ws")}/ws`);
  await new Promise((resolve, reject) => {
    ws.onopen = resolve;
    ws.onerror = reject;
  });
  let next = 1;
  const pending = new Map();
  const events = [];
  ws.onmessage = (m) => {
    const msg = JSON.parse(m.data);
    if (msg.type === "event") events.push(msg.event);
    else if (pending.has(msg.id)) {
      const { resolve, reject } = pending.get(msg.id);
      pending.delete(msg.id);
      if (msg.success) resolve(msg.result);
      else reject(Object.assign(new Error(msg.error.message), { code: msg.error.code }));
    }
  };
  const call = (type, payload = {}) =>
    new Promise((resolve, reject) => {
      const id = next++;
      pending.set(id, { resolve, reject });
      ws.send(JSON.stringify({ id, type, ...payload }));
    });
  return { ws, call, events };
}

const waitFor = async (fn, ms = 2000) => {
  const t0 = Date.now();
  while (Date.now() - t0 < ms) {
    if (fn()) return true;
    await new Promise((r) => setTimeout(r, 20));
  }
  return false;
};

test("categories over the WebSocket: the other screens hear them", async () => {
  const a = await screen();
  const b = await screen();
  const boot = await a.call("memoria/bootstrap");
  assert.equal(boot.version, fs.readFileSync(path.join(ROOT, "memoria/config.yaml"), "utf8").match(/version: "([\d.]+)"/)[1]);
  assert.deepEqual(boot.data.categories.map((c) => c.name), ["Casa", "Estudos"]);
  await b.call("memoria/subscribe");
  const cat = await a.call("memoria/category/save", { category: { name: "Saúde", color: "rosa" } });
  assert.equal(cat.name, "Saúde");
  assert.ok(await waitFor(() => b.events.some((e) => e.kind === "category" && e.category.id === cat.id)));
  await assert.rejects(a.call("memoria/category/save", { category: { name: "saude" } }), /Já existe/);
  const block = await a.call("memoria/block/save", { block: { id: "ideias00001", category: cat.id } });
  assert.equal(block.category, cat.id);
  await assert.rejects(a.call("memoria/block/save", { block: { id: "ideias00001", category: "naoexiste1" } }), /categoria não existe/);
  const del = await a.call("memoria/category/delete", { category_id: cat.id });
  assert.deepEqual(del.blocks.map((x) => x.id), ["ideias00001"]);
  assert.ok(await waitFor(() => b.events.some((e) => e.kind === "category_deleted" && e.id === cat.id && e.blocks.length === 1)));
  a.ws.close();
  b.ws.close();
});

test("Mais › Relatório: the page and the PDF", async () => {
  let res = await fetch(`${base}/relatorio?categoria=catcasa0001&tema=escuro&cor=%234ED3A6`);
  assert.equal(res.status, 200);
  assert.match(res.headers.get("content-type"), /text\/html/);
  const page = await res.text();
  assert.match(page, /data-theme="dark"/);
  assert.match(page, /Casa · 2 blocos · 3 folhas/);
  assert.match(page, /--a:#4ED3A6/);
  res = await fetch(`${base}/relatorio.pdf?bloco=mercado0001&cor=%234ED3A6`);
  assert.equal(res.status, 200);
  assert.equal(res.headers.get("content-type"), "application/pdf");
  assert.match(res.headers.get("content-disposition"), /attachment; filename="anotacoes-mercado-\d{4}-\d{2}-\d{2}\.pdf"/);
  const pdf = Buffer.from(await res.arrayBuffer());
  assert.equal(pdf.subarray(0, 8).toString("latin1"), "%PDF-1.4");
  res = await fetch(`${base}/selectsheet.js`);
  assert.equal(res.status, 200);
  assert.match(await res.text(), /Caixas de seleção no visual do app/);
  res = await fetch(`${base}/relatorio`, { method: "POST" });
  assert.equal(res.status, 404);
});

test("Falar: the speech-to-text of Home Assistant", async () => {
  const a = await screen();
  const st = await a.call("memoria/voice/status");
  assert.equal(st.ready, true);
  assert.equal(st.engine, "stt.home_assistant_cloud");
  assert.equal(st.language, "pt-BR");
  assert.deepEqual(st.options.map((o) => o.id).sort(), ["stt.faster_whisper", "stt.home_assistant_cloud"]);
  // the engine chosen in the app, with its language
  await a.call("memoria/settings/save", { app: { voice_engine: "stt.faster_whisper" } });
  const st2 = await a.call("memoria/voice/status", { fresh: true });
  assert.equal(st2.engine, "stt.faster_whisper");
  assert.equal(st2.language, "pt");
  const pcm = Buffer.alloc(16000 * 2); // one second
  let res = await fetch(`${base}/api/voice`, { method: "POST", headers: { "content-type": "application/octet-stream" }, body: pcm });
  assert.equal(res.status, 200);
  assert.equal((await res.json()).text, "Comprar pão e regar as plantas");
  res = await fetch(`${base}/api/voice`, { method: "POST", body: Buffer.alloc(100) });
  assert.equal(res.status, 409);
  assert.match((await res.json()).error, /Não ouvi nada/);
  await a.call("memoria/settings/save", { app: { voice_engine: null } });
  a.ws.close();
});

test("Conversa: the answer and the actions, checked against the blocks", async () => {
  const a = await screen();
  const context = {
    tela: "Agora",
    blocos: [{ id: "mercado0001", nome: "Mercado", aberto: true, total: 2, folhas: [{ n: 1, titulo: "Lista da semana", texto: "Lista da semana" }, { n: 2, titulo: "Churrasco do Beto", texto: "Churrasco do Beto" }] }],
  };
  let out = await a.call("memoria/ai/chat", { messages: [{ role: "user", text: "crie uma folha no Mercado com Feira; banana; maçã" }], context });
  assert.equal(out.reply, "Posso criar uma folha em Mercado.");
  assert.deepEqual(out.actions, [{ tipo: "criar", bloco: "mercado0001", nome: "Mercado", texto: "Feira\nbanana\nmaçã" }]);
  assert.equal(out.provider, "Google AI Task");
  out = await a.call("memoria/ai/chat", { messages: [{ role: "user", text: "acrescente pão de alho na folha 2 do Mercado" }], context });
  assert.deepEqual(out.actions, [{ tipo: "acrescentar", bloco: "mercado0001", nome: "Mercado", folha: 2, titulo: "Churrasco do Beto", texto: "pão de alho" }]);
  out = await a.call("memoria/ai/chat", { messages: [{ role: "user", text: "o que tem aqui?" }], context });
  assert.match(out.reply, /tela: Agora/);
  assert.deepEqual(out.actions, []);
  await assert.rejects(a.call("memoria/ai/chat", { messages: [], context }), /Escreva alguma coisa/);
  a.ws.close();
});

test("Usar IA off: no reading, no Falar, no Conversa", async () => {
  const a = await screen();
  await a.call("memoria/settings/save", { app: { ai_off: true } });
  await assert.rejects(a.call("memoria/ai/chat", { messages: [{ role: "user", text: "oi" }], context: {} }), /A IA está desligada/);
  let res = await fetch(`${base}/api/voice`, { method: "POST", body: Buffer.alloc(32000) });
  assert.equal(res.status, 409);
  assert.match((await res.json()).error, /A IA está desligada/);
  res = await fetch(`${base}/api/extract`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ text: "oi" }) });
  assert.equal(res.status, 409);
  assert.equal((await res.json()).code, "ai_off");
  await a.call("memoria/settings/save", { app: { ai_off: null } });
  const out = await a.call("memoria/ai/chat", { messages: [{ role: "user", text: "oi" }], context: {} });
  assert.match(out.reply, /Resposta de teste/);
  a.ws.close();
});
