// A Memória da IA: uma memória só, da casa, compartilhada por todos os apps da família (share/familia/memoria_ia.json).
// lib/memoria-ia.js lê, guarda e apaga as frases; a IA daqui as recebe logo depois da guarda, com ou sem o CorrerIA.
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { SO_MATERIAL, soMaterial, comLembrancas } from "../memoria/rootfs/app/lib/ai.js";
import * as M from "../memoria/rootfs/app/lib/memoria-ia.js";

const novo = () => path.join(fs.mkdtempSync(path.join(os.tmpdir(), "mem-ia-")), "familia", "memoria_ia.json");

describe("Memória da IA: o arquivo da casa", () => {
  it("guarda, lê, não repete e apaga; o arquivo é só do dono", () => {
    const arq = novo();
    assert.deepEqual(M.ler(arq), [], "sem o arquivo");
    assert.equal(M.memoriaTexto(arq), "");
    const lista = M.lembrar("  O café é   sempre o da marca azul ", "MemorIA", "Ana", arq);
    assert.equal(lista.length, 1);
    assert.deepEqual([lista[0].texto, lista[0].app, lista[0].quem], ["O café é sempre o da marca azul", "MemorIA", "Ana"]);
    assert.match(lista[0].em, /^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d[+-]\d{4}$/);
    assert.equal(fs.statSync(arq).mode & 0o777, 0o600);
    const gravado = JSON.parse(fs.readFileSync(arq, "utf8"));
    assert.equal(gravado.versao, 1);
    assert.equal(gravado.lista[0].texto, "O café é sempre o da marca azul");
    assert.equal(M.lembrar("o CAFÉ é sempre o da marca azul", "MemorIA", "", arq).length, 1, "a mesma frase não entra duas vezes");
    assert.equal(M.lembrar("A feira é no sábado", "MemorIA", "", arq).length, 2);
    assert.equal("quem" in M.ler(arq, Date.now(), true)[1], false, "sem quem, sem o campo");
    assert.equal(M.memoriaTexto(arq), `${M.TITULO}\n- O café é sempre o da marca azul\n- A feira é no sábado`);
    assert.equal(M.esquecer(lista[0].id, arq).length, 1);
    assert.equal(M.esquecer("não existe", arq).length, 1);
    assert.deepEqual(M.estado(arq).lista.map((x) => x.texto), ["A feira é no sábado"]);
    assert.equal(M.estado(arq).max, 60);
  });

  it("diz o que vale: frase vazia, memória cheia, pasta que não grava", () => {
    const arq = novo();
    assert.throws(() => M.lembrar(" a ", "MemorIA", "", arq), (e) => e instanceof M.ErroMemoria && e.code === "invalid_format" && e.message === "Escreva o que é para lembrar.");
    fs.mkdirSync(path.dirname(arq), { recursive: true });
    fs.writeFileSync(arq, JSON.stringify({ lista: Array.from({ length: 70 }, (_, i) => ({ texto: `frase número ${i}` })) }));
    assert.equal(M.ler(arq, Date.now(), true).length, 60, "até 60");
    assert.throws(() => M.lembrar("mais uma frase", "MemorIA", "", arq), /já tem 60 frases/);
    const preso = path.join(path.dirname(arq), "arquivo.txt");
    fs.writeFileSync(preso, "x");
    assert.throws(() => M.lembrar("não tem onde gravar", "MemorIA", "", path.join(preso, "memoria_ia.json")), /Não consegui gravar a memória na pasta share/);
  });

  it("o que outro app escreveu vale aqui; o estragado é ignorado; a leitura fica guardada por meio minuto", () => {
    const arq = novo();
    fs.mkdirSync(path.dirname(arq), { recursive: true });
    fs.writeFileSync(arq, JSON.stringify({ versao: 1, lista: [{ id: "r1", texto: "A feira é no sábado", em: "2026-11-02T09:30:00-0300", app: "InventarIA" }, null, "solta", { texto: "x" }, { texto: "a feira é no SÁBADO" }, { texto: "y".repeat(300) }] }));
    const lista = M.ler(arq, 1000);
    assert.deepEqual(lista.map((x) => [x.id.length > 0, x.texto.length, x.app]), [[true, 19, "InventarIA"], [true, 240, ""]]);
    fs.writeFileSync(arq, "{estragado");
    assert.equal(M.ler(arq, 2000).length, 2, "ainda a de antes");
    assert.deepEqual(M.ler(arq, 40000), [], "depois de meio minuto, lê de novo");
    fs.writeFileSync(arq, JSON.stringify(["não é objeto"]));
    assert.deepEqual(M.ler(arq, 0, true), []);
  });

  it("os comandos da tela: get, add e del", () => {
    const arq = novo();
    assert.deepEqual(M.comando("get", {}, "MemorIA", "", arq), { lista: [], max: 60 });
    const r = M.comando("add", { texto: "O café é sempre o da marca azul" }, "MemorIA", "Ana", arq);
    assert.equal(r.lista[0].quem, "Ana");
    assert.deepEqual(M.comando("del", { frase: r.lista[0].id }, "MemorIA", "", arq).lista, []);
    assert.throws(() => M.comando("add", null, "MemorIA", "", arq), M.ErroMemoria);
    assert.equal(M.agoraIso(new Date(2026, 10, 2, 9, 30, 5)).slice(0, 19), "2026-11-02T09:30:05");
  });
});

describe("Memória da IA: na IA e na tela", () => {
  it("vai logo depois da guarda, em toda instrução", () => {
    comLembrancas(() => `${M.TITULO}\n- A feira é no sábado`);
    assert.equal(soMaterial("Leia a lista."), `${SO_MATERIAL}\n\n${M.TITULO}\n- A feira é no sábado\n\nLeia a lista.`);
    assert.equal(soMaterial(soMaterial("Leia a lista.")), soMaterial("Leia a lista."), "uma vez só");
    comLembrancas(() => { throw new Error("fora"); });
    assert.equal(soMaterial("Leia a lista."), `${SO_MATERIAL}\n\nLeia a lista.`, "um erro ao ler não derruba a IA");
    comLembrancas(null);
    assert.equal(soMaterial("Leia a lista."), `${SO_MATERIAL}\n\nLeia a lista.`);
  });

  it("o servidor oferece sempre, sem depender do CorrerIA, e do arquivo da casa", () => {
    const src = fs.readFileSync(new URL("../memoria/rootfs/app/server.js", import.meta.url), "utf8");
    assert.match(src, /comLembrancas\(\(\) => memoriaIa\.memoriaTexto\(MEMORIA_ARQ\)\);/);
    assert.match(src, /"familia", "memoria_ia\.json"\)/);
    assert.doesNotMatch(src, /lembrancas\.json/);
  });

  it("o cartão diz que a memória é compartilhada e vem logo depois do IA, só com Usar IA ligado", () => {
    const tela = fs.readFileSync(new URL("../frontend/src/memoria-ia.js", import.meta.url), "utf8");
    assert.match(tela, /MEMORIA_IA_LEAD = "Uma memória só, da casa, compartilhada por todos os apps: /);
    // a lista é lida de novo quando a última leitura tem mais de meio minuto (outro app pode ter escrito)
    assert.match(tela, /MEMORIA_IA_RELER_MS = 30000;/);
    assert.match(tela, /if \(this\._memIaAt && now - this\._memIaAt < MEMORIA_IA_RELER_MS\) return;/);
    const app = fs.readdirSync(new URL("../frontend/src/", import.meta.url)).map((f) => fs.readFileSync(new URL(`../frontend/src/${f}`, import.meta.url), "utf8")).join("\n");
    assert.match(app, /this\._renderAiPanel\(\)\} \$\{[^}]*this\._aiOn\(\)[^}]*\? this\._renderMemoriaIa\(\) : nothing\}/);
  });
});
