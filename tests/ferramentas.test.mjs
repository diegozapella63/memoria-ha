// The tools of the CorrerIA (memoria/rootfs/app/lib/ferramentas.js): the list, each tool on an invented house (Ana and
// Beto, tests/fixtures/casa.mjs) and the errors that say what works. The clock is fixed (mock.timers).
import { test, mock, before, after } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { Store } from "../memoria/rootfs/app/lib/store.js";
import { callTool, listTools, ToolError, UnknownTool, FERRAMENTAS } from "../memoria/rootfs/app/lib/ferramentas.js";
import { appendText, appendLink, freeColor } from "../memoria/rootfs/app/lib/writing.js";
import { casa } from "./fixtures/casa.mjs";

const log = { info() {}, warn() {}, error() {} };
const NOW = new Date(2026, 10, 8, 10, 30); // Sunday, 8 Nov 2026, 10:30 (local)

before(() => mock.timers.enable({ apis: ["Date"], now: NOW.getTime() }));
after(() => mock.timers.reset());

function house() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "memoria-tools-"));
  fs.writeFileSync(path.join(dir, "memoria.json"), JSON.stringify(casa(NOW.getTime())));
  return new Store(dir, log);
}
const run = (store, nome, argumentos = {}) => callTool(nome, argumentos, { store, now: NOW });
const read = (store, nome, argumentos) => JSON.parse(run(store, nome, argumentos).texto);
const bad = (store, nome, argumentos, re) => assert.throws(() => run(store, nome, argumentos), (err) => err instanceof ToolError && re.test(err.message));

test("the list follows the contract: 12 tools, reads first, JSON Schema, grava and apaga", () => {
  const { instrucoes, ferramentas } = listTools();
  assert.match(instrucoes, /memoria_resumo/);
  assert.equal(ferramentas.length, 12);
  assert.deepEqual(ferramentas.slice(0, 4).map((f) => f.nome), ["resumo", "buscar", "ler_bloco", "ler_folha"]);
  for (const f of ferramentas) {
    assert.match(f.nome, /^[a-z0-9_]{1,40}$/);
    assert.ok(f.titulo && f.titulo.length < 40, f.nome);
    assert.ok(f.descricao.length > 20, f.nome);
    assert.equal(f.entrada.type, "object");
    assert.equal(f.entrada.additionalProperties, false);
    for (const r of f.entrada.required) assert.ok(r in f.entrada.properties, `${f.nome}: ${r}`);
    assert.equal(typeof f.grava, "boolean");
    assert.equal(typeof f.apaga, "boolean");
    if (f.apaga) assert.equal(f.grava, true);
  }
  assert.deepEqual(ferramentas.filter((f) => f.apaga).map((f) => f.nome), ["apagar_folha"]);
  assert.deepEqual(ferramentas.filter((f) => !f.grava).map((f) => f.nome), ["resumo", "buscar", "ler_bloco", "ler_folha"]);
  assert.equal(FERRAMENTAS.length, 12);
  assert.throws(() => run(house(), "voar"), (err) => err instanceof UnknownTool && err.message === "Ferramenta desconhecida: voar.");
});

test("resumo: categories, blocks with their last sheets and ids, and the block of the moment", () => {
  const r = read(house(), "resumo");
  assert.equal(r.hoje, "2026-11-08 10:30");
  // 10:30: the sheet of the Mercado with its own time (09:00) is on; next, Inglês at 19:30
  assert.deepEqual(r.agora, { periodo: "manhã", bloco: "Mercado", bloco_id: "mercado0001", desde: "09:00", folha_id: "pg000000002", proximo: "19:30 Inglês" });
  assert.deepEqual(r.categorias, [
    { id: "catcasa0001", nome: "Casa", blocos: 2 },
    { id: "catestudo01", nome: "Estudos", blocos: 1 },
  ]);
  assert.deepEqual(r.blocos.map((b) => b.nome), ["Mercado", "Reforma da cozinha", "Inglês", "Ideias soltas"]);
  const m = r.blocos[0];
  assert.equal(m.categoria, "Casa");
  assert.equal(m.abre, "abre de manhã (05:00)");
  assert.equal(m.folhas, 2);
  assert.deepEqual(m.ultimas[1], { n: 2, id: "pg000000002", titulo: "Churrasco do Beto", editada: "2026-11-07", horarios: "09:00" });
  assert.equal(r.blocos[3].categoria, undefined);
  assert.equal(r.blocos[3].ultimas[1].titulo, "(folha em branco)");
  assert.equal(r.total_folhas, 6);
  assert.equal(r.mostrando_folhas, 6);
});

test("buscar: accents don't matter; by block, category and period; the most recent first", () => {
  const s = house();
  let r = read(s, "buscar", { texto: "cafe" });
  assert.equal(r.encontradas, 1);
  assert.deepEqual(
    { ...r.folhas[0], trecho: undefined },
    { id: "pg000000001", bloco: "Mercado", bloco_id: "mercado0001", n: 1, titulo: "Lista da semana", trecho: undefined, editada: "2026-11-05 10:30" },
  );
  assert.match(r.folhas[0].trecho, /Café/);
  r = read(s, "buscar", { texto: "PÃO" });
  assert.deepEqual(r.folhas.map((f) => f.id), ["pg000000002", "pg000000001"]);
  assert.equal(r.folhas[0].horarios, "09:00");
  assert.equal(read(s, "buscar", { texto: "pão", bloco: "reforma" }).encontradas, 0);
  assert.deepEqual(read(s, "buscar", { categoria: "estudos" }).folhas.map((f) => f.id), ["pg000000004"]);
  // written or changed yesterday (the blank sheet doesn't count without a text to look for)
  assert.deepEqual(read(s, "buscar", { de: "ontem", ate: "2026-11-07" }).folhas.map((f) => f.id), ["pg000000002"]);
  // nothing: the latest sheets, with a limit
  r = read(s, "buscar", { limite: 2 });
  assert.equal(r.encontradas, 5);
  assert.equal(r.mostrando, 2);
  bad(s, "buscar", { limite: 0 }, /limite: de 1 a 200/);
  bad(s, "buscar", { categoria: "Saúde" }, /^Categoria não encontrada: Saúde\. As categorias: Casa \(catcasa0001\), Estudos \(catestudo01\)\./);
  bad(s, "buscar", { de: "31/02/2026" }, /de: data inválida/);
  bad(s, "buscar", { de: "2026-11-08", ate: "2026-11-01" }, /vem antes/);
});

test("ler_bloco and ler_folha: by id, by name, by number (-1 the last); errors list what there is", () => {
  const s = house();
  const b = read(s, "ler_bloco", { bloco: "merc" });
  assert.equal(b.id, "mercado0001");
  assert.equal(b.folhas_no_bloco, 2);
  assert.match(b.folhas[0].texto, /^Lista da semana\n\n- Arroz/);
  assert.equal(b.folhas[1].escrita, "2026-11-07 10:30");
  bad(s, "ler_bloco", { bloco: "Academia" }, /^Bloco não encontrado: Academia\. Os blocos: Mercado \(mercado0001\), Reforma da cozinha \(reforma0001\), Inglês \(ingles00001\), Ideias soltas \(ideias00001\)\.$/);
  bad(s, "ler_bloco", {}, /Falta o bloco/);
  let f = read(s, "ler_folha", { bloco: "Mercado", numero: -1 });
  assert.equal(f.id, "pg000000002");
  assert.equal(f.n, 2);
  assert.equal(f.de, 2);
  assert.deepEqual(f.horarios, ["09:00"]);
  f = read(s, "ler_folha", { folha: "pg000000004" });
  assert.equal(f.bloco, "Inglês");
  assert.equal(f.titulo, "Aula 12");
  bad(s, "ler_folha", { bloco: "Mercado", numero: 5 }, /O bloco Mercado tem 2 folhas: numero de 1 a 2/);
  bad(s, "ler_folha", { bloco: "Mercado" }, /Diga a folha/);
  bad(s, "ler_folha", {}, /Diga a folha/);
  bad(s, "ler_folha", { folha: "naoexiste01" }, /Folha não encontrada: naoexiste01/);
});

test("nova_folha and acrescentar: the same rules as the screen (title, \\n, end of the sheet)", () => {
  const s = house();
  const out = run(s, "nova_folha", { bloco: "Inglês", texto: "Aula 13\\nPresent perfect", horarios: ["7:30"] });
  assert.match(out.texto, /^Folha criada: folha 2 de Inglês \(“Aula 13”\)\. Abre sozinha às 07:30\. id: [a-f0-9]{12}$/);
  assert.equal(out.events.length, 1);
  assert.equal(out.events[0].kind, "page");
  const page = out.events[0].page;
  assert.equal(page.text, "Aula 13\nPresent perfect");
  assert.deepEqual(page.times, ["07:30"]);
  assert.equal(s.page(page.id).block, "ingles00001");
  bad(s, "nova_folha", { bloco: "Inglês", texto: "   " }, /Falta o texto/);
  bad(s, "nova_folha", { bloco: "Inglês", texto: "x", horarios: ["25:00"] }, /Horário inválido: 25:00/);
  const add = run(s, "acrescentar", { bloco: "Mercado", numero: 1, texto: "- Azeite" });
  assert.match(add.texto, /^Acrescentado na folha 1 de Mercado \(“Lista da semana”\)\. id: pg000000001$/);
  assert.match(s.page("pg000000001").text, /- Pão integral\n- Azeite$/);
  // a blank sheet gets the text without a line before it
  run(s, "acrescentar", { folha: "pg000000006", texto: "Ideia nova" });
  assert.equal(s.page("pg000000006").text, "Ideia nova");
  bad(s, "acrescentar", { folha: "pg000000001", texto: "x".repeat(50001) }, /grande demais/);
  s.flush();
});

test("editar_folha: the whole text, a piece (a whole line goes with its break), times and moving", () => {
  const s = house();
  let out = run(s, "editar_folha", { folha: "pg000000001", trocar: "- Café", por: "" });
  assert.match(out.texto, /^Alterada \(um trecho apagado\): folha 1 de Mercado/);
  assert.equal(s.page("pg000000001").text, "Lista da semana\n\n- Arroz e feijão\n- Frutas para a Ana\n- Pão integral");
  run(s, "editar_folha", { folha: "pg000000001", trocar: "Arroz e feijão", por: "Arroz, feijão e lentilha" });
  assert.match(s.page("pg000000001").text, /- Arroz, feijão e lentilha\n/);
  bad(s, "editar_folha", { folha: "pg000000001", trocar: "Chocolate" }, /Trecho não encontrado na folha: “Chocolate”/);
  bad(s, "editar_folha", { folha: "pg000000001", texto: "a", trocar: "b" }, /não os dois/);
  bad(s, "editar_folha", { folha: "pg000000001", texto: "  " }, /memoria_apagar_folha/);
  bad(s, "editar_folha", { folha: "pg000000001" }, /Diga o que muda/);
  out = run(s, "editar_folha", { folha: "pg000000003", texto: "Orçamentos\nMarceneiro: fechado.", horarios: ["08:00"] });
  assert.equal(s.page("pg000000003").text, "Orçamentos\nMarceneiro: fechado.");
  assert.deepEqual(s.page("pg000000003").times, ["08:00"]);
  out = run(s, "editar_folha", { folha: "pg000000005", mover_para: "Reforma da cozinha", horarios: [] });
  assert.match(out.texto, /^Alterada \(sem horários; movida de Ideias soltas\): folha 1 de Reforma da cozinha \(“Viagem de férias”\)/);
  assert.equal(s.page("pg000000005").block, "reforma0001");
  bad(s, "editar_folha", { folha: "pg000000005", mover_para: "Reforma da cozinha" }, /já está no bloco Reforma da cozinha/);
  s.flush();
});

test("adicionar_link: the link of Adicionar link at the end; only http and https", () => {
  const s = house();
  const out = run(s, "adicionar_link", { folha: "pg000000005", url: "praias-exemplo.com.br/janeiro", nome: "Praias de janeiro" });
  assert.match(out.texto, /^Link adicionado na folha 1 de Ideias soltas \(“Viagem de férias”\): Praias de janeiro \(https:\/\/praias-exemplo\.com\.br\/janeiro\)\./);
  assert.match(s.page("pg000000005").text, /serra em julho\?\n\[Praias de janeiro\]\(https:\/\/praias-exemplo\.com\.br\/janeiro\)$/);
  const f = read(s, "ler_folha", { folha: "pg000000005" });
  assert.deepEqual(f.links, [{ nome: "Praias de janeiro", url: "https://praias-exemplo.com.br/janeiro" }]);
  bad(s, "adicionar_link", { folha: "pg000000005", url: "javascript:alert(1)" }, /^Esse link não abre/);
  s.flush();
});

test("apagar_folha: the sheet goes and its text comes back in the answer", () => {
  const s = house();
  const out = run(s, "apagar_folha", { bloco: "Ideias soltas", numero: 1 });
  assert.match(out.texto, /^Folha apagada: folha 1 de Ideias soltas \(“Viagem de férias”\)\. O texto era:\nViagem de férias/);
  assert.deepEqual(out.events, [{ kind: "page_deleted", id: "pg000000005" }]);
  assert.equal(s.page("pg000000005"), undefined);
  bad(s, "apagar_folha", { folha: "pg000000005" }, /Folha não encontrada/);
  s.flush();
});

test("novo_bloco, editar_bloco and nova_categoria: free color, category by name, what works", () => {
  const s = house();
  let out = run(s, "novo_bloco", { nome: "Receitas", categoria: "casa", periodos: ["noite"], horarios: ["18:30"] });
  const b = out.events[0].block;
  // the first color no block uses (the screen does the same)
  assert.deepEqual({ name: b.name, color: b.color, paper: b.paper, category: b.category, periods: b.periods, times: b.times }, { name: "Receitas", color: "vermelho", paper: "pautado", category: "catcasa0001", periods: ["noite"], times: ["18:30"] });
  assert.match(out.texto, /^Bloco criado: Receitas · categoria Casa · vermelho · pautado · abre à noite \(18:00\) e às 18:30\. id: /);
  out = run(s, "novo_bloco", { nome: "mercado", cor: "lilás" });
  assert.match(out.texto, /Atenção: já havia um bloco com esse nome \(Mercado \(mercado0001\)\)/);
  assert.equal(out.events[0].block.color, "lilas");
  bad(s, "novo_bloco", { nome: "X", cor: "roxo" }, /^Cor inválida: roxo\. As cores: vermelho, coral/);
  bad(s, "novo_bloco", { nome: "X", categoria: "Lazer" }, /Categoria não encontrada: Lazer/);
  bad(s, "novo_bloco", { nome: "X", periodos: ["madrugada"] }, /Use manha, tarde ou noite/);
  bad(s, "novo_bloco", { nome: " " }, /Falta o nome/);
  out = run(s, "editar_bloco", { bloco: "Ideias soltas", categoria: "Estudos", papel: "liso" });
  assert.match(out.texto, /^Bloco alterado: Ideias soltas · categoria Estudos · lilas · liso · não abre sozinho\. Antes: Ideias soltas · sem categoria · lilas · pautado/);
  assert.equal(s.block("ideias00001").category, "catestudo01");
  run(s, "editar_bloco", { bloco: "ideias00001", categoria: "" });
  assert.equal("category" in s.block("ideias00001"), false);
  bad(s, "editar_bloco", { bloco: "ideias00001" }, /Diga o que muda/);
  out = run(s, "nova_categoria", { nome: "Saúde" });
  assert.match(out.texto, /^Categoria criada: Saúde · vermelho\. id: /);
  assert.equal(out.events[0].kind, "category");
  bad(s, "nova_categoria", { nome: "casa" }, /^Já existe a categoria Casa \(catcasa0001\)\.$/);
  s.flush();
});

test("the rules shared with the screen (lib/writing.js)", () => {
  assert.equal(appendText("Lista\n- arroz  \n\n", "- café"), "Lista\n- arroz\n- café");
  assert.equal(appendText("", "oi"), "oi");
  assert.equal(appendLink("Bolo", "https://receitas-exemplo.com.br/bolo", "Bolo da vó"), "Bolo\n[Bolo da vó](https://receitas-exemplo.com.br/bolo)");
  assert.equal(freeColor([{ color: "vermelho" }, { color: "coral" }], ["vermelho", "coral", "rosa"], "lilas"), "rosa");
  assert.equal(freeColor([{ color: "vermelho" }], ["vermelho"], "lilas"), "lilas");
});

// ------------------------------------------------------------------ Arquivar bloco e De quem é (1.9.0)

test("arquivados: out of resumo and buscar unless asked, read when named, no writes until desarquivado", () => {
  const s = house();
  let out = run(s, "editar_bloco", { bloco: "Ideias", arquivado: true });
  assert.match(out.texto, /^Bloco arquivado \(as folhas continuam lá\): Ideias soltas · sem categoria · lilas · pautado · arquivado em 2026-11-08\. Antes: Ideias soltas · sem categoria · lilas · pautado · não abre sozinho\. id: ideias00001$/);
  assert.equal(out.events[0].block.archived, NOW.getTime());
  assert.equal(s.data.pages.filter((p) => p.block === "ideias00001").length, 2, "nothing deleted");
  let r = read(s, "resumo");
  assert.deepEqual(r.blocos.map((b) => b.nome), ["Mercado", "Reforma da cozinha", "Inglês"]);
  assert.equal(r.blocos_arquivados, 1);
  assert.equal(r.total_folhas, 4);
  r = read(s, "resumo", { arquivados: true });
  assert.deepEqual(r.blocos.map((b) => [b.nome, b.arquivado]), [["Mercado", undefined], ["Reforma da cozinha", undefined], ["Inglês", undefined], ["Ideias soltas", "2026-11-08"]]);
  assert.equal(r.blocos_arquivados, undefined);
  // buscar: only when asked, or in the archived block asked
  assert.equal(read(s, "buscar", { texto: "praia" }).encontradas, 0);
  r = read(s, "buscar", { texto: "praia", arquivados: true });
  assert.equal(r.encontradas, 1);
  assert.equal(r.folhas[0].arquivado, true);
  assert.equal(read(s, "buscar", { texto: "praia", bloco: "Ideias soltas" }).encontradas, 1);
  // read: when named (the ones in use first, then the archived)
  r = read(s, "ler_bloco", { bloco: "ideias" });
  assert.equal(r.arquivado, "2026-11-08");
  assert.equal(r.abre, undefined);
  assert.equal(read(s, "ler_folha", { folha: "pg000000005" }).bloco_arquivado, true);
  // no writes in it
  bad(s, "nova_folha", { bloco: "Ideias soltas", texto: "x" }, /^O bloco Ideias soltas está arquivado\. Para mexer nas folhas dele, desarquive antes com memoria_editar_bloco \(arquivado: false\)\.$/);
  bad(s, "acrescentar", { folha: "pg000000005", texto: "x" }, /está arquivado/);
  bad(s, "editar_folha", { folha: "pg000000005", texto: "x" }, /está arquivado/);
  bad(s, "adicionar_link", { folha: "pg000000005", url: "https://site.com.br" }, /está arquivado/);
  bad(s, "apagar_folha", { folha: "pg000000005" }, /está arquivado/);
  bad(s, "editar_folha", { folha: "pg000000001", mover_para: "Ideias soltas" }, /está arquivado/);
  bad(s, "editar_bloco", { bloco: "Ideias soltas", arquivado: true }, /^O bloco Ideias soltas já está arquivado\.$/);
  bad(s, "editar_bloco", { bloco: "Ideias soltas", arquivado: "sim" }, /^arquivado: true \(arquivar\) ou false \(desarquivar\)\.$/);
  // a block not found lists the archived ones too
  bad(s, "ler_bloco", { bloco: "Academia" }, /Os blocos: Mercado \(mercado0001\), .* Arquivados: Ideias soltas \(ideias00001\)\.$/);
  // a new block with the same name: the one in use wins
  const novo = run(s, "novo_bloco", { nome: "Ideias soltas" }).events[0].block;
  assert.equal(read(s, "ler_bloco", { bloco: "Ideias soltas" }).id, novo.id);
  // back
  out = run(s, "editar_bloco", { bloco: "ideias00001", arquivado: false });
  assert.match(out.texto, /^Bloco desarquivado: Ideias soltas · sem categoria · lilas · pautado · não abre sozinho\./);
  assert.equal("archived" in s.block("ideias00001"), false);
  assert.match(run(s, "nova_folha", { bloco: "ideias00001", texto: "De volta" }).texto, /^Folha criada: folha 3 de Ideias soltas/);
  s.flush();
});

test("De quem é: de in novo_bloco and editar_bloco (a person of the house); resumo shows it and its agora is the person's", () => {
  const s = house();
  const people = [
    { id: "person.ana", name: "Ana" },
    { id: "person.beto", name: "Beto" },
  ];
  const call = (nome, argumentos, extra = {}) => callTool(nome, argumentos, { store: s, now: NOW, people, ...extra });
  let out = call("editar_bloco", { bloco: "Mercado", de: "ana" });
  assert.match(out.texto, /^Bloco alterado: Mercado · categoria Casa · de Ana · laranja · pautado · abre de manhã \(05:00\)\. Antes: Mercado · categoria Casa · laranja/);
  assert.equal(s.block("mercado0001").owner, "Ana");
  out = call("novo_bloco", { nome: "Treino", de: "person.beto", horarios: ["07:00"] });
  const treino = out.events[0].block;
  assert.equal(treino.owner, "Beto");
  assert.throws(() => call("editar_bloco", { bloco: "Mercado", de: "Carla" }), (err) => err instanceof ToolError && err.message === "Pessoa não encontrada: Carla. As pessoas da casa: Ana, Beto. Vazio ou Todos: de todos.");
  // 10:30: for Beto, his Treino (07:00); for Ana, the sheet of the Mercado at 09:00; for anyone, the same as Ana
  let r = JSON.parse(call("resumo", {}, { pessoa: "Beto" }).texto);
  assert.deepEqual(r.agora, { periodo: "manhã", pessoa: "Beto", bloco: "Treino", bloco_id: treino.id, desde: "07:00", proximo: "19:30 Inglês" });
  r = JSON.parse(call("resumo", {}, { pessoa: "Ana" }).texto);
  assert.equal(r.agora.bloco, "Mercado");
  assert.equal(r.agora.folha_id, "pg000000002");
  r = JSON.parse(call("resumo", {}).texto);
  assert.equal(r.agora.pessoa, undefined);
  assert.equal(r.agora.bloco, "Mercado");
  assert.deepEqual(r.blocos.map((b) => [b.nome, b.de]), [["Mercado", "Ana"], ["Reforma da cozinha", undefined], ["Inglês", undefined], ["Ideias soltas", undefined], ["Treino", "Beto"]]);
  assert.equal(read(s, "ler_bloco", { bloco: "Treino" }).de, "Beto");
  // Todos (or empty): everyone's again
  call("editar_bloco", { bloco: "Mercado", de: "Todos" });
  assert.equal("owner" in s.block("mercado0001"), false);
  // without the people of Home Assistant, the name as written
  callTool("editar_bloco", { bloco: "Mercado", de: "Carla" }, { store: s, now: NOW });
  assert.equal(s.block("mercado0001").owner, "Carla");
  s.flush();
});
