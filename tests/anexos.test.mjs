// The files of the clip of the Conversa and of Ler com IA (lib/anexos.js, the same in the ResolvIA, the CronologIA and
// the MemorIA): what the screen sends, checked, and the files in the media folder, removed after.
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { cleanFiles, writeAttachments, filesNote, fileNames, withFiles, MAX_FILES } from "../memoria/rootfs/app/lib/anexos.js";

const JPG = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 1, 2]).toString("base64");
const PDF = Buffer.from("%PDF-1.4 x").toString("base64");

describe("cleanFiles", () => {
  it("photos and a PDF, with a name (a data: address too)", () => {
    assert.deepEqual(cleanFiles([{ data: JPG, mime: "image/jpeg", nome: "  nota   do mercado.jpg " }, { data: `data:image/png;base64,${JPG}`, mime: "image/png" }]), [
      { data: JPG, mime: "image/jpeg", nome: "nota do mercado.jpg" },
      { data: JPG, mime: "image/png", nome: "foto.jpg" },
    ]);
    assert.deepEqual(cleanFiles([{ data: PDF, mime: "application/pdf" }]), [{ data: PDF, mime: "application/pdf", nome: "arquivo.pdf" }]);
    assert.deepEqual(cleanFiles(undefined), []);
  });
  it("refuses what the AI can't read, too many, and a PDF with photos", () => {
    assert.throws(() => cleanFiles([{ data: JPG, mime: "text/plain" }]), { code: "invalid_format", message: /não abriu/ });
    assert.throws(() => cleanFiles([{ data: "não é base64!", mime: "image/jpeg" }]), { code: "invalid_format" });
    assert.throws(() => cleanFiles([{ mime: "image/jpeg" }]), { code: "invalid_format" });
    assert.throws(() => cleanFiles(Array(MAX_FILES + 1).fill({ data: JPG, mime: "image/jpeg" })), { message: `No máximo ${MAX_FILES} arquivos de cada vez.` });
    assert.throws(() => cleanFiles([{ data: JPG, mime: "image/jpeg" }, { data: PDF, mime: "application/pdf" }]), { message: "Envie um PDF por vez." });
    assert.throws(() => cleanFiles([{ data: "A".repeat(21 * 1024 * 1024), mime: "image/jpeg" }]), { message: /até 15 MB/ });
  });
});

describe("writeAttachments", () => {
  it("writes each file for the AI (media-source) and done() removes them", () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "anexos-"));
    const sub = path.join(dir, "app", "ia-temp");
    const { attachments, done } = writeAttachments(sub, "app/ia-temp", cleanFiles([{ data: JPG, mime: "image/jpeg" }, { data: JPG, mime: "image/webp" }]));
    assert.equal(attachments.length, 2);
    assert.match(attachments[0].media_content_id, /^media-source:\/\/media_source\/local\/app\/ia-temp\/arq-[0-9a-f]{12}\.jpg$/);
    assert.equal(attachments[1].media_content_type, "image/webp");
    assert.deepEqual(fs.readFileSync(path.join(sub, attachments[0].media_content_id.split("/").pop())), Buffer.from(JPG, "base64"));
    done();
    assert.deepEqual(fs.readdirSync(sub), []);
    fs.rmSync(dir, { recursive: true, force: true });
  });
  it("a folder that can't be written: nothing is left behind", () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "anexos-"));
    const file = path.join(dir, "um-arquivo");
    fs.writeFileSync(file, "x");
    assert.throws(() => writeAttachments(path.join(file, "dentro"), "x", cleanFiles([{ data: JPG, mime: "image/jpeg" }])));
    fs.rmSync(dir, { recursive: true, force: true });
  });
});

describe("the conversation", () => {
  it("the note for the AI, the names kept and the message with the names", () => {
    assert.equal(filesNote(0), "");
    assert.match(filesNote(1), /mandou 1 arquivo \(foto ou PDF\)/);
    assert.match(filesNote(3), /mandou 3 arquivos/);
    assert.deepEqual(fileNames(["  a.jpg ", "", null, "b.pdf", "c", "d", "e"]), ["a.jpg", "b.pdf", "c", "d"]);
    assert.deepEqual(fileNames("a.jpg"), []);
    assert.equal(withFiles({ text: "o que é?", anexos: ["nota.jpg", "verso.jpg"] }), "[mandou nota.jpg, verso.jpg] o que é?");
    assert.equal(withFiles({ text: "", anexos: ["manual.pdf"] }), "[mandou manual.pdf]");
    assert.equal(withFiles({ text: "oi" }), "oi");
  });
});
