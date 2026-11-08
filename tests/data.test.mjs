// Exportar and the backup (memoria/rootfs/app/lib/data.js): the category of each block goes along.
import { test } from "node:test";
import assert from "node:assert/strict";
import { toCSV, toMarkdown, backupZip, parseImport } from "../memoria/rootfs/app/lib/data.js";
import { normalize } from "../memoria/rootfs/app/lib/store.js";
import { casa } from "./fixtures/casa.mjs";

test("CSV: a Categoria column", () => {
  const csv = toCSV(casa()).toString("utf8");
  const lines = csv.replace(/^﻿/, "").split("\r\n");
  assert.equal(lines[0], "Bloco;Categoria;Folha;Título;Escrita em;Editada em;Horários;Texto");
  assert.ok(lines[1].startsWith("Mercado;Casa;1;Lista da semana;"));
  assert.ok(lines.some((l) => l.startsWith("Ideias soltas;;1;Viagem de férias;")));
});

test("Markdown of a block: its category", () => {
  const data = casa();
  assert.match(toMarkdown(data, data.blocks[0], data.periods), /^# Mercado\n\nCategoria: Casa\n\nAbre sozinho: manhã \(05:00\)/);
  assert.doesNotMatch(toMarkdown(data, data.blocks[3], data.periods), /Categoria/);
});

test("the backup (ZIP) brings the categories back", () => {
  const zip = backupZip(casa(), "1.5.0");
  const raw = parseImport(zip, "memoria-backup.zip");
  const back = normalize(raw);
  assert.deepEqual(back.categories.map((c) => c.name), ["Casa", "Estudos"]);
  assert.equal(back.blocks.find((b) => b.name === "Mercado").category, "catcasa0001");
});
