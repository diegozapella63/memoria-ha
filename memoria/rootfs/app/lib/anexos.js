// Fotos e PDF que vão para a IA (o clipe da Conversa e o Ler com IA): o que a tela manda, conferido, e os arquivos
// na pasta media do Home Assistant (a IA lê pelo media-source), apagados depois. Igual no ResolvIA, na CronologIA e
// no MemorIA (tools/iguais.py).
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

/** What the AI reads: the photos (JPG, PNG, WebP) and the PDF, with the extension of the file in the media folder. */
export const MIMES = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "application/pdf": "pdf" };
export const MAX_FILES = 4;
const MAX_BYTES = 15 * 1024 * 1024;
const coded = (code, message) => Object.assign(new Error(message), { code });

/**
 * The files of one message, as the screen sends them: [{data (base64, or a data: address), mime, nome?}] ->
 * [{data, mime, nome}]. Up to `max` photos or one PDF; a wrong one is refused with a message for the person.
 */
export function cleanFiles(raw, max = MAX_FILES) {
  const list = Array.isArray(raw) ? raw : [];
  if (list.length > max) throw coded("invalid_format", `No máximo ${max} arquivos de cada vez.`);
  const out = list.map((f) => {
    const mime = f && typeof f.mime === "string" && MIMES[f.mime] ? f.mime : "";
    const data = f && typeof f.data === "string" ? f.data.replace(/^data:[^,]*,/, "").replace(/\s+/g, "") : "";
    if (!mime || !data || !/^[A-Za-z0-9+/]+={0,2}$/.test(data) || data.length * 0.75 > MAX_BYTES) {
      throw coded("invalid_format", "Um dos arquivos não abriu. Use uma foto (JPG ou PNG) ou um PDF, até 15 MB.");
    }
    const nome = String((f && f.nome) || "").replace(/\s+/g, " ").trim().slice(0, 80) || (mime === "application/pdf" ? "arquivo.pdf" : "foto.jpg");
    return { data, mime, nome };
  });
  if (out.length > 1 && out.some((f) => f.mime === "application/pdf")) throw coded("invalid_format", "Envie um PDF por vez.");
  return out;
}

const remove = (paths) => {
  for (const p of paths) {
    try {
      fs.rmSync(p, { force: true });
    } catch (e) {
      /* already gone */
    }
  }
};

/**
 * Writes the files in the folder `dir` (the media folder of Home Assistant, at `rel`) and gives the attachments of
 * ai_task.generate_data and done(), that removes them (after the AI reads).
 */
export function writeAttachments(dir, rel, files) {
  const paths = [];
  const attachments = [];
  try {
    fs.mkdirSync(dir, { recursive: true });
    for (const f of files) {
      const name = `arq-${crypto.randomBytes(6).toString("hex")}.${MIMES[f.mime] || "jpg"}`;
      const full = path.join(dir, name);
      fs.writeFileSync(full, Buffer.from(f.data, "base64"));
      paths.push(full);
      attachments.push({ media_content_id: `media-source://media_source/local/${rel}/${name}`, media_content_type: f.mime || "image/jpeg" });
    }
  } catch (err) {
    remove(paths);
    throw err;
  }
  return { attachments, done: () => remove(paths) };
}

/** For the instructions: what the person sent with the last message ("" without files). */
export function filesNote(n) {
  if (!n) return "";
  return `Com a última mensagem, a pessoa mandou ${n === 1 ? "1 arquivo" : `${n} arquivos`} (foto ou PDF), que vão junto: olhe o que está neles para responder.`;
}

/** The names of the files of a message of the conversation (the screen keeps them and sends them back). */
export function fileNames(raw) {
  return Array.isArray(raw)
    ? raw
        .map((x) => String(x == null ? "" : x).replace(/\s+/g, " ").trim().slice(0, 80))
        .filter(Boolean)
        .slice(0, MAX_FILES)
    : [];
}

/** A message of the person in the conversation for the AI: "[mandou nota.jpg] o texto". */
export function withFiles(m) {
  const names = fileNames(m && m.anexos);
  return `${names.length ? `[mandou ${names.join(", ")}] ` : ""}${(m && m.text) || ""}`.trim();
}
