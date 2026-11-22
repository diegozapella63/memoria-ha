// As lembranças da casa (do CorrerIA) na frente das instruções da IA deste app, só com a opção CorrerIA ligada.
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { SO_MATERIAL, soMaterial, comLembrancas } from "../memoria/rootfs/app/lib/ai.js";
import { lerLembrancas, lembrancasTexto, TITULO } from "../memoria/rootfs/app/lib/lembrancas.js";

describe("IA: as lembranças da casa", () => {
  it("lê o arquivo do CorrerIA, limpa e guarda por um minuto", () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "lemb-"));
    const arq = path.join(dir, "lembrancas.json");
    assert.deepEqual(lerLembrancas(arq), [], "sem o arquivo");
    assert.equal(lembrancasTexto(arq, 1000), "");
    fs.writeFileSync(arq, JSON.stringify({ app: "correria", lembrancas: ["  Creme é   sempre Higiene ", "", null, "A feira é no sábado", "x".repeat(300)] }));
    assert.deepEqual(lerLembrancas(arq).slice(0, 2), ["Creme é sempre Higiene", "A feira é no sábado"]);
    assert.equal(lerLembrancas(arq)[2].length, 240);
    assert.equal(lembrancasTexto(arq, 2000), "", "ainda o de antes: relê só depois de um minuto");
    assert.ok(lembrancasTexto(arq, 70000).startsWith(`${TITULO}\n- Creme é sempre Higiene\n- A feira é no sábado\n- x`));
    fs.writeFileSync(arq, "{estragado");
    assert.deepEqual(lerLembrancas(arq), []);
    fs.writeFileSync(arq, JSON.stringify({ lembrancas: "não é lista" }));
    assert.deepEqual(lerLembrancas(arq), []);
  });

  it("vão logo depois da guarda, e só enquanto o app as oferece", () => {
    comLembrancas(() => `${TITULO}\n- Creme é sempre Higiene`);
    assert.equal(soMaterial("Leia a lista."), `${SO_MATERIAL}\n\n${TITULO}\n- Creme é sempre Higiene\n\nLeia a lista.`);
    assert.equal(soMaterial(soMaterial("Leia a lista.")), soMaterial("Leia a lista."), "uma vez só");
    comLembrancas(() => { throw new Error("fora"); });
    assert.equal(soMaterial("Leia a lista."), `${SO_MATERIAL}\n\nLeia a lista.`, "um erro ao ler não derruba a IA");
    comLembrancas(null);
    assert.equal(soMaterial("Leia a lista."), `${SO_MATERIAL}\n\nLeia a lista.`);
  });

  it("o servidor só oferece com a opção CorrerIA ligada", () => {
    const src = fs.readFileSync(new URL("../memoria/rootfs/app/server.js", import.meta.url), "utf8");
    assert.match(src, /comLembrancas\(\(\) => \(correriaOn\(\) \? lembrancasTexto\(\) : ""\)\);/);
  });
});
