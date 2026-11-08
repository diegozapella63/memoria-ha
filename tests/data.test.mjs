// Exportar and the backup (memoria/rootfs/app/lib/data.js): the category of each block goes along.
import { test } from "node:test";
import assert from "node:assert/strict";
import { toCSV, toMarkdown, backupZip, parseImport } from "../memoria/rootfs/app/lib/data.js";
import { normalize } from "../memoria/rootfs/app/lib/store.js";
import { casa } from "./fixtures/casa.mjs";

test("CSV: the columns Categoria, De quem é and Arquivado em (1.9.0)", () => {
  const data = casa();
  data.blocks[2].owner = "Beto";
  data.blocks[3].archived = new Date(2026, 9, 20, 15, 0).getTime();
  const csv = toCSV(data).toString("utf8");
  const lines = csv.replace(/^﻿/, "").split("\r\n");
  assert.equal(lines[0], "Bloco;Categoria;De quem é;Arquivado em;Folha;Título;Escrita em;Editada em;Horários;Texto");
  assert.ok(lines[1].startsWith("Mercado;Casa;Todos;;1;Lista da semana;"));
  assert.ok(lines.some((l) => l.startsWith("Inglês;Estudos;Beto;;1;Aula 12;")));
  assert.ok(lines.some((l) => l.startsWith("Ideias soltas;;Todos;20/10/2026;1;Viagem de férias;")));
});

test("Markdown of a block: its category, whose it is and when it was archived", () => {
  const data = casa();
  assert.match(toMarkdown(data, data.blocks[0], data.periods), /^# Mercado\n\nCategoria: Casa\n\nAbre sozinho: manhã \(05:00\)/);
  assert.doesNotMatch(toMarkdown(data, data.blocks[3], data.periods), /Categoria|De quem é|Arquivado/);
  data.blocks[0].owner = "Ana";
  data.blocks[0].archived = new Date(2026, 9, 20, 15, 0).getTime();
  // archived: it doesn't open by itself
  assert.match(toMarkdown(data, data.blocks[0], data.periods), /^# Mercado\n\nCategoria: Casa\n\nDe quem é: Ana\n\nArquivado em 20\/10\/2026\n\n## Folha 1/);
});

test("the backup (ZIP) brings the categories, the owners and the archived blocks back", () => {
  const data = casa();
  data.blocks[2].owner = "Beto";
  data.blocks[3].archived = 1790000000000;
  const zip = backupZip(data, "1.9.0");
  const raw = parseImport(zip, "memoria-backup.zip");
  const back = normalize(raw);
  assert.deepEqual(back.categories.map((c) => c.name), ["Casa", "Estudos"]);
  assert.equal(back.blocks.find((b) => b.name === "Mercado").category, "catcasa0001");
  assert.equal(back.blocks.find((b) => b.name === "Inglês").owner, "Beto");
  assert.equal(back.blocks.find((b) => b.name === "Ideias soltas").archived, 1790000000000);
  // an old backup: everyone's and not archived
  const old = normalize(parseImport(backupZip(casa(), "1.8.0"), "memoria-velho.zip"));
  assert.ok(old.blocks.every((b) => !("owner" in b) && !("archived" in b)));
});

test("links stay readable in the export: the CSV title has the name, the text keeps the address", () => {
  const data = casa();
  data.pages[0].text = "[Receita da vó](https://receitas.com.br/23)\n\nfarinha";
  const lines = toCSV(data).toString("utf8").split("\r\n");
  assert.ok(lines[1].startsWith("Mercado;Casa;Todos;;1;Receita da vó;"));
  assert.ok(lines[1].includes("[Receita da vó](https://receitas.com.br/23)"));
  assert.match(toMarkdown(data, data.blocks[0], data.periods), /\[Receita da vó\]\(https:\/\/receitas\.com\.br\/23\)/);
});
