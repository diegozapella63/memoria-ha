// campovalor.js (igual no ResolvIA, na CronologIA e no MemorIA): o campo fechado sem nada escolhido nem escrito
// (o dono: "quando retraído sem selecionar nada deve estar como nenhum… em todos os apps")
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { vazioDe } from "../frontend/src/campovalor.js";

describe("campovalor: vazioDe", () => {
  it("Sem categoria, Ninguém, Nenhuma de uma palavra feminina, senão Nenhum", () => {
    assert.equal(vazioDe("Categoria"), "Sem categoria");
    assert.equal(vazioDe(" Quem faz "), "Ninguém");
    for (const t of ["Notas", "Observações", "Lista do ResolvIA", "Cor", "Fotos", "Dose"]) assert.equal(vazioDe(t), "Nenhuma", t);
    for (const t of ["Valor", "Detalhes", "Equipamento", "Cômodo", ""]) assert.equal(vazioDe(t), "Nenhum", t);
  });
});
