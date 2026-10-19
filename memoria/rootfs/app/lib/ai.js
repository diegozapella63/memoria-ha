// Turns a pasted message or photos of handwritten/printed pages into the text
// of a notebook page. Like the other apps (InventarIA, GerencIA, EconomIA), it
// only uses the AI configured in Home Assistant (ai_task.generate_data) and
// keeps no API key: the person picks which AI in Mais > Leitura por IA.
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const GEN_DATA = 1;
const ATTACHMENTS = 2;
// Photos wait here (inside /media, Home Assistant's "local" media source) only
// while the AI reads them.
const TMP_REL = "memoria/ia-temp";
export const ENTITY_RE = /^ai_task\.[a-z0-9_]+$/;

const coded = (code, message) => Object.assign(new Error(message), { code });

const STRUCTURE = {
  text: {
    description: "O texto da anotação, com quebras de linha.",
    required: true,
    selector: { text: { multiline: true } },
  },
};

function instructions({ text, images }) {
  if (images) {
    return [
      `Transcreva ${images > 1 ? "estas fotos de páginas" : "esta foto de uma página"} de caderno ou anotação (pode ser manuscrita, impressa ou um print).`,
      "Regras:",
      "- Copie o texto fielmente, em português do Brasil, na ordem em que aparece. Corrija só erros óbvios de leitura.",
      "- Mantenha as quebras de linha, listas e tópicos. Use \"- \" para itens de lista.",
      "- Se houver várias páginas, junte tudo na ordem, separando as páginas por uma linha em branco.",
      "- Não resuma, não comente e não invente nada. Se não houver texto legível, devolva o texto vazio.",
    ].join("\n");
  }
  return [
    "Transforme a mensagem abaixo numa anotação limpa de caderno, em português do Brasil.",
    "Regras:",
    "- Comece com uma primeira linha curta que sirva de título.",
    "- Mantenha todo o conteúdo útil, na ordem. Use \"- \" para listas.",
    "- Tire horários e nomes de quem mandou a mensagem, saudações e assinaturas.",
    "- Não invente nada.",
    `\nMensagem:\n"""\n${(text || "").slice(0, 20000)}\n"""`,
  ].join("\n");
}

export function cleanText(raw) {
  let t = raw;
  if (t && typeof t === "object") t = t.text || t.body || t.content || "";
  if (Array.isArray(t)) t = t.join("\n");
  if (typeof t !== "string") return "";
  return t.replace(/\r\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim().slice(0, 50000);
}

export class AI {
  /** `selected()` returns the entity chosen in the app ("" = Home Assistant's default). */
  constructor({ ha, log, mediaDir, selected }) {
    this.ha = ha;
    this.log = log;
    this.mediaDir = mediaDir;
    this.selected = selected || (() => "");
  }

  tmpDir() {
    return path.join(this.mediaDir, TMP_REL);
  }

  mediaWritable() {
    try {
      fs.mkdirSync(this.tmpDir(), { recursive: true });
      fs.accessSync(this.tmpDir(), fs.constants.W_OK);
      return true;
    } catch (e) {
      return false;
    }
  }

  /** AI Task entities that generate data, the ones that read photos first. */
  async entities() {
    const states = await this.ha.send({ type: "get_states" }, 15000);
    return states
      .filter((s) => s.entity_id.startsWith("ai_task."))
      .map((s) => {
        const features = Number(s.attributes.supported_features) || 0;
        return {
          id: s.entity_id,
          name: s.attributes.friendly_name || s.entity_id,
          images: Boolean(features & ATTACHMENTS),
          available: s.state !== "unavailable",
          features,
        };
      })
      .filter((e) => e.features & GEN_DATA)
      .sort((a, b) => Number(b.images) - Number(a.images) || a.name.localeCompare(b.name, "pt-BR"));
  }

  async preferred() {
    try {
      const prefs = await this.ha.send({ type: "ai_task/preferences/get" }, 10000);
      return (prefs && prefs.gen_data_entity_id) || null;
    } catch (e) {
      return null; // older Home Assistant
    }
  }

  /**
   * Which entity reads a message (images=false) or photos (images=true).
   * With "Padrão do Home Assistant", the preferred AI of Home Assistant, or the
   * first one that can do the job.
   */
  async resolve(needImages, list) {
    const ents = list || (await this.entities());
    const sel = this.selected();
    if (!ents.length) throw coded("no_ai", "Nenhuma IA configurada no Home Assistant (integração com tarefa de IA).");
    if (sel) {
      const e = ents.find((x) => x.id === sel);
      if (!e) throw coded("gone", "A IA escolhida não está mais no Home Assistant. Escolha outra em Mais › Leitura por IA.");
      if (!e.available) throw coded("unavailable", `${e.name} está indisponível no Home Assistant.`);
      if (needImages && !e.images) throw coded("no_vision", `${e.name} não lê fotos. Escolha outra IA em Mais › Leitura por IA.`);
      return e;
    }
    const ok = ents.filter((e) => e.available && (!needImages || e.images));
    if (!ok.length) {
      throw needImages
        ? coded("no_vision", "Nenhuma IA do Home Assistant lê fotos. Use um modelo que entenda imagens.")
        : coded("unavailable", "As IAs do Home Assistant estão indisponíveis.");
    }
    const pref = await this.preferred();
    return ok.find((e) => e.id === pref) || ok[0];
  }

  /** For Mais › Leitura por IA (and to enable the photo buttons). */
  async status() {
    const sel = this.selected();
    const base = { ready: false, images: false, selected: sel, using: null, entities: [], reason: null };
    if (!this.ha.ready) return { ...base, reason: "Sem conexão com o Home Assistant." };
    let ents;
    try {
      ents = await this.entities();
    } catch (err) {
      return { ...base, reason: `Não deu para consultar o Home Assistant: ${err.message}` };
    }
    const out = { ...base, entities: ents.map(({ id, name, images, available }) => ({ id, name, images, available })) };
    let text;
    try {
      text = await this.resolve(false, ents);
    } catch (err) {
      return { ...out, reason: err.message };
    }
    out.ready = true;
    out.using = { id: text.id, name: text.name };
    try {
      const photo = await this.resolve(true, ents);
      out.images = this.mediaWritable();
      if (!out.images) out.reason = "A pasta media do Home Assistant não está disponível para o app.";
      else if (photo.id !== text.id) out.photos = { id: photo.id, name: photo.name };
    } catch (err) {
      out.reason = err.message;
    }
    return out;
  }

  async extract({ text, images }) {
    images = Array.isArray(images) ? images.slice(0, 6) : [];
    text = typeof text === "string" ? text.trim() : "";
    if (!text && !images.length) return { text: "", provider: null };
    if (!this.ha.ready) throw coded("no_ai", "Sem conexão com o Home Assistant.");
    const entity = await this.resolve(images.length > 0);
    if (images.length && !this.mediaWritable()) throw coded("no_media", "A pasta media do Home Assistant não está disponível para o app.");
    const prompt = instructions({ text, images: images.length });
    return { text: await this._viaHA(entity.id, prompt, images), provider: entity.name, entity: entity.id };
  }

  async _viaHA(entityId, prompt, images) {
    const files = [];
    try {
      const attachments = [];
      for (const img of images) {
        const ext = img.mime === "image/png" ? "png" : img.mime === "image/webp" ? "webp" : "jpg";
        const name = `foto-${crypto.randomBytes(6).toString("hex")}.${ext}`;
        const full = path.join(this.tmpDir(), name);
        fs.writeFileSync(full, Buffer.from(img.data, "base64"));
        files.push(full);
        attachments.push({ media_content_id: `media-source://media_source/local/${TMP_REL}/${name}`, media_content_type: img.mime || "image/jpeg" });
      }
      const data = { task_name: "MemorIA: transcrever anotação", instructions: prompt, structure: STRUCTURE, entity_id: entityId };
      if (attachments.length) data.attachments = attachments;
      const res = await this.ha.send(
        { type: "call_service", domain: "ai_task", service: "generate_data", service_data: data, return_response: true },
        120000,
      );
      const out = res && res.response ? res.response.data : null;
      return cleanText(out);
    } finally {
      for (const f of files) fs.rm(f, { force: true }, () => {});
    }
  }
}
