// The server of the MemorIA with the Home Assistant simulated (dev/fake-ha.mjs): the categories over the WebSocket
// (every screen hears the change), Mais › Relatório as a page and as a PDF and the tools of the CorrerIA
// (/api/integracao/ferramentas, with the key of share/memoria/correria.json). An invented house.
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
let dir = "";

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
  dir = fs.mkdtempSync(path.join(os.tmpdir(), "memoria-srv-"));
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
      // the Home Assistant user of the screens (the fake Home Assistant has Ana, u-ana, and Beto, u-beto)
      MEMORIA_DEV_USER_ID: "u-ana",
    },
    /ouvindo na porta/,
  );
  base = `http://127.0.0.1:${port}`;
});

after(() => {
  for (const p of procs) p.kill();
});

/** A screen of the app: the WebSocket of the MemorIA (headers: as the ingress of Home Assistant sends them). */
async function screen(headers = null) {
  const ws = headers ? new WebSocket(`${base.replace("http", "ws")}/ws`, { headers }) : new WebSocket(`${base.replace("http", "ws")}/ws`);
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

test("CorrerIA: the key turns the file and the tools on and off; every screen hears what they change", async () => {
  const shareFile = path.join(dir, "share", "correria.json");
  const tools = (key, init = {}) => fetch(`${base}/api/integracao/ferramentas`, { ...init, headers: { authorization: `Bearer ${key}`, "x-app": "CorrerIA", "content-type": "application/json", ...(init.headers || {}) } });
  const call = (key, nome, argumentos = {}) => tools(key, { method: "POST", body: JSON.stringify({ nome, argumentos, pessoa: { id: "person.ana", nome: "Ana" }, cliente: "Claude" }) });
  // off (the default): no file, 401
  assert.equal(fs.existsSync(shareFile), false);
  let res = await tools("qualquer");
  assert.equal(res.status, 401);
  assert.match((await res.json()).erro, /CorrerIA desligado/);

  const a = await screen();
  const b = await screen();
  await b.call("memoria/subscribe");
  await a.call("memoria/settings/save", { app: { correria: true } });
  assert.ok(fs.existsSync(shareFile));
  assert.equal(fs.statSync(shareFile).mode & 0o777, 0o600);
  const info = JSON.parse(fs.readFileSync(shareFile, "utf8"));
  const version = fs.readFileSync(path.join(ROOT, "memoria/config.yaml"), "utf8").match(/version: "([\d.]+)"/)[1];
  assert.deepEqual(Object.keys(info).sort(), ["app", "assunto", "chave", "ferramentas", "gravado_em", "ip_url", "nome", "url", "versao"]);
  assert.equal(info.app, "memoria");
  assert.equal(info.nome, "MemorIA");
  assert.equal(info.versao, version);
  assert.equal(info.ferramentas, "/api/integracao/ferramentas");
  assert.match(info.url, /^http:\/\/[^/]+:\d+$/);
  assert.match(info.gravado_em, /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/);
  assert.ok(info.chave.length >= 32);
  const keyFile = path.join(dir, "correria.key");
  assert.equal(fs.readFileSync(keyFile, "utf8").trim(), info.chave);
  assert.equal(fs.statSync(keyFile).mode & 0o777, 0o600);

  // a wrong key, or none
  assert.equal((await tools(`${info.chave}x`)).status, 401);
  assert.equal((await fetch(`${base}/api/integracao/ferramentas`)).status, 401);
  // the list
  res = await tools(info.chave);
  assert.equal(res.status, 200);
  const list = await res.json();
  assert.match(list.instrucoes, /memoria_resumo/);
  assert.equal(list.ferramentas.length, 12);
  // a read
  res = await call(info.chave, "resumo");
  assert.equal(res.status, 200);
  assert.ok(JSON.parse((await res.json()).texto).blocos.some((x) => x.id === "mercado0001"));
  // a write: the other screen hears the sheet and who used it
  res = await call(info.chave, "nova_folha", { bloco: "Mercado", texto: "Feira de domingo\nbanana e maçã" });
  assert.equal(res.status, 200);
  const created = (await res.json()).texto;
  assert.match(created, /^Folha criada: folha 3 de Mercado \(“Feira de domingo”\)\. id: [a-f0-9]{12}$/);
  const id = created.match(/id: (\w+)$/)[1];
  assert.ok(await waitFor(() => b.events.some((e) => e.kind === "page" && e.page.id === id && e.page.text === "Feira de domingo\nbanana e maçã")));
  assert.ok(await waitFor(() => b.events.some((e) => e.kind === "correria" && e.ultimo.cliente === "Claude")));
  const boot = await a.call("memoria/bootstrap");
  assert.equal(boot.correria.ultimo.cliente, "Claude");
  assert.ok(boot.data.pages.some((p) => p.id === id));
  // errors: a bad argument says what works (400), no such tool (404), not JSON (400), another method (405)
  res = await call(info.chave, "ler_bloco", { bloco: "Academia" });
  assert.equal(res.status, 400);
  assert.match((await res.json()).erro, /^Bloco não encontrado: Academia\. Os blocos: Mercado \(mercado0001\)/);
  res = await call(info.chave, "voar");
  assert.equal(res.status, 404);
  assert.equal((await res.json()).erro, "Ferramenta desconhecida: voar.");
  res = await tools(info.chave, { method: "POST", body: "{nada" });
  assert.equal(res.status, 400);
  assert.equal((await tools(info.chave, { method: "PUT", body: "{}" })).status, 405);
  // it doesn't depend on Usar IA (the AI is the CorrerIA's, the Claude's or the Gemini's)
  await a.call("memoria/settings/save", { app: { ai_off: true } });
  res = await call(info.chave, "apagar_folha", { folha: id });
  assert.equal(res.status, 200);
  assert.ok(await waitFor(() => b.events.some((e) => e.kind === "page_deleted" && e.id === id)));
  await a.call("memoria/settings/save", { app: { ai_off: null } });

  // off again: the file goes and the same key no longer works
  await a.call("memoria/settings/save", { app: { correria: null } });
  assert.equal(fs.existsSync(shareFile), false);
  assert.equal((await tools(info.chave)).status, 401);
  // on again: the same key
  await a.call("memoria/settings/save", { app: { correria: true } });
  assert.equal(JSON.parse(fs.readFileSync(shareFile, "utf8")).chave, info.chave);
  await a.call("memoria/settings/save", { app: { correria: null } });
  a.ws.close();
  b.ws.close();
});

test("De quem é: the people of the house and the person of each login; a block's owner and Arquivar over the WebSocket", async () => {
  const a = await screen();
  const b = await screen({ "x-remote-user-id": "u-beto", "x-remote-user-display-name": "Beto" });
  const other = await screen({ "x-remote-user-id": "u-tablet" });
  let boot = await a.call("memoria/bootstrap");
  assert.deepEqual(boot.people, ["Ana", "Beto"]);
  assert.equal(boot.user.person, "Ana");
  boot = await b.call("memoria/bootstrap");
  assert.equal(boot.user.person, "Beto");
  assert.equal(boot.user.name, "Beto");
  // a login that is not a person of the house (a shared tablet): no person, it sees every block
  assert.deepEqual(await other.call("memoria/people"), { people: ["Ana", "Beto"], person: "" });
  await b.call("memoria/subscribe");
  let block = await a.call("memoria/block/save", { block: { id: "ingles00001", owner: "Beto" } });
  assert.equal(block.owner, "Beto");
  assert.ok(await waitFor(() => b.events.some((e) => e.kind === "block" && e.block.id === "ingles00001" && e.block.owner === "Beto")));
  block = await a.call("memoria/block/save", { block: { id: "ingles00001", archived: true } });
  assert.ok(block.archived > 0);
  assert.equal(block.owner, "Beto", "archiving keeps the owner");
  assert.ok(await waitFor(() => b.events.some((e) => e.kind === "block" && e.block.id === "ingles00001" && e.block.archived)));
  boot = await other.call("memoria/bootstrap");
  assert.equal(boot.data.blocks.find((x) => x.id === "ingles00001").archived, block.archived);
  assert.equal(boot.data.pages.filter((p) => p.block === "ingles00001").length, 1, "nothing deleted");
  block = await a.call("memoria/block/save", { block: { id: "ingles00001", archived: false, owner: "" } });
  assert.equal("archived" in block, false);
  assert.equal("owner" in block, false);
  a.ws.close();
  b.ws.close();
  other.ws.close();
});

test("CorrerIA: the summary's block of the moment is the one of the person who asks; de is a person of the house", async () => {
  const a = await screen();
  await a.call("memoria/settings/save", { app: { correria: true } });
  const key = JSON.parse(fs.readFileSync(path.join(dir, "share", "correria.json"), "utf8")).chave;
  const call = (nome, argumentos, pessoa) =>
    fetch(`${base}/api/integracao/ferramentas`, { method: "POST", headers: { authorization: `Bearer ${key}`, "content-type": "application/json" }, body: JSON.stringify({ nome, argumentos, pessoa, cliente: "WhatsApp" }) }).then(async (r) => ({ status: r.status, body: await r.json() }));
  // the person by the id (person.beto), whatever the name says
  let r = await call("resumo", {}, { id: "person.beto", nome: "Beto Silva" });
  assert.equal(r.status, 200);
  assert.equal(JSON.parse(r.body.texto).agora.pessoa, "Beto");
  r = await call("resumo", {}, { id: "", nome: "ana" });
  assert.equal(JSON.parse(r.body.texto).agora.pessoa, "Ana");
  // someone who is not a person of the house: the Agora of anyone
  r = await call("resumo", {}, { id: "", nome: "Visita" });
  assert.equal(JSON.parse(r.body.texto).agora.pessoa, undefined);
  r = await call("editar_bloco", { bloco: "Reforma", de: "Carla" }, { id: "person.ana", nome: "Ana" });
  assert.equal(r.status, 400);
  assert.equal(r.body.erro, "Pessoa não encontrada: Carla. As pessoas da casa: Ana, Beto. Vazio ou Todos: de todos.");
  r = await call("editar_bloco", { bloco: "Reforma", de: "beto" }, { id: "person.ana", nome: "Ana" });
  assert.equal(r.status, 200);
  assert.match(r.body.texto, /^Bloco alterado: Reforma da cozinha · categoria Casa · de Beto ·/);
  r = await call("editar_bloco", { bloco: "Reforma", de: "" }, { id: "person.ana", nome: "Ana" });
  assert.equal(r.status, 200);
  await a.call("memoria/settings/save", { app: { correria: null } });
  a.ws.close();
});
