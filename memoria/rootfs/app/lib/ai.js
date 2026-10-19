// Turns a pasted message or photos of handwritten/printed pages into the text
// of a notebook page. Uses Home Assistant's own AI (AI Task) when configured;
// otherwise a Gemini API key from the app options.
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const GEN_DATA = 1;
const ATTACHMENTS = 2;

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
  constructor({ ha, log, mediaDir, optionsFile, geminiUrl }) {
    this.ha = ha;
    this.log = log;
    this.mediaDir = mediaDir;
    this.optionsFile = optionsFile;
    this.geminiUrl = geminiUrl || "https://generativelanguage.googleapis.com";
  }

  options() {
    try {
      return JSON.parse(fs.readFileSync(this.optionsFile, "utf8")) || {};
    } catch (e) {
      return {};
    }
  }

  mediaWritable() {
    try {
      fs.mkdirSync(path.join(this.mediaDir, "memoria"), { recursive: true });
      fs.accessSync(path.join(this.mediaDir, "memoria"), fs.constants.W_OK);
      return true;
    } catch (e) {
      return false;
    }
  }

  async haEntities() {
    try {
      const states = await this.ha.send({ type: "get_states" }, 15000);
      return states
        .filter((s) => s.entity_id.startsWith("ai_task.") && s.state !== "unavailable")
        .map((s) => ({ entity_id: s.entity_id, features: Number(s.attributes.supported_features) || 0 }))
        .filter((e) => e.features & GEN_DATA);
    } catch (e) {
      return [];
    }
  }

  async pickEntity(needImages) {
    const entities = await this.haEntities();
    const ok = entities.filter((e) => !needImages || e.features & ATTACHMENTS);
    if (!ok.length) return null;
    try {
      const prefs = await this.ha.send({ type: "ai_task/preferences/get" }, 10000);
      const pref = prefs && prefs.gen_data_entity_id;
      if (pref && ok.some((e) => e.entity_id === pref)) return pref;
    } catch (e) {
      /* older Home Assistant */
    }
    return ok[0].entity_id;
  }

  /** What the UI can offer. */
  async status() {
    const entities = await this.haEntities();
    const gemini = Boolean((this.options().gemini_api_key || "").trim());
    const haImages = entities.some((e) => e.features & ATTACHMENTS) && this.mediaWritable();
    if (entities.length) {
      return { available: true, provider: "ha", text: true, images: haImages || gemini };
    }
    if (gemini) return { available: true, provider: "gemini", text: true, images: true };
    return { available: false, provider: null, text: false, images: false };
  }

  async extract({ text, images }) {
    images = Array.isArray(images) ? images.slice(0, 6) : [];
    text = typeof text === "string" ? text.trim() : "";
    if (!text && !images.length) return { text: "", provider: null };
    const prompt = instructions({ text, images: images.length });

    const entity = await this.pickEntity(images.length > 0);
    const canHA = entity && (!images.length || this.mediaWritable());
    if (canHA) {
      try {
        return { text: await this._viaHA(entity, prompt, images), provider: `ha:${entity}` };
      } catch (err) {
        this.log.warn(`AI Task falhou (${err.message})${this.options().gemini_api_key ? ", tentando o Gemini" : ""}`);
        if (!this.options().gemini_api_key) throw err;
      }
    }
    if ((this.options().gemini_api_key || "").trim()) {
      return { text: await this._viaGemini(prompt, images), provider: "gemini" };
    }
    const err = new Error(
      images.length
        ? "Nenhuma IA que leia fotos está configurada. Configure o AI Task no Home Assistant ou uma chave do Gemini nas opções do app."
        : "Nenhuma IA configurada.",
    );
    err.code = "no_ai";
    throw err;
  }

  async _viaHA(entityId, prompt, images) {
    const files = [];
    try {
      const attachments = [];
      for (const img of images) {
        const ext = img.mime === "image/png" ? "png" : img.mime === "image/webp" ? "webp" : "jpg";
        const name = `import-${crypto.randomBytes(6).toString("hex")}.${ext}`;
        const full = path.join(this.mediaDir, "memoria", name);
        fs.mkdirSync(path.dirname(full), { recursive: true });
        fs.writeFileSync(full, Buffer.from(img.data, "base64"));
        files.push(full);
        attachments.push({ media_content_id: `media-source://media_source/local/memoria/${name}`, media_content_type: img.mime || "image/jpeg" });
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

  async _viaGemini(prompt, images) {
    const opts = this.options();
    const model = (opts.gemini_model || "gemini-flash-latest").trim();
    const parts = [{ text: prompt }];
    for (const img of images) parts.push({ inline_data: { mime_type: img.mime || "image/jpeg", data: img.data } });
    const res = await fetch(`${this.geminiUrl}/v1beta/models/${encodeURIComponent(model)}:generateContent`, {
      method: "POST",
      headers: { "content-type": "application/json", "x-goog-api-key": opts.gemini_api_key.trim() },
      body: JSON.stringify({
        contents: [{ role: "user", parts }],
        generationConfig: {
          temperature: 0.1,
          responseMimeType: "application/json",
          responseSchema: {
            type: "OBJECT",
            properties: { text: { type: "STRING" } },
            required: ["text"],
          },
        },
      }),
      signal: AbortSignal.timeout(90000),
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(`Gemini ${res.status}: ${(body.error && body.error.message) || res.statusText}`);
    }
    const textOut = ((body.candidates && body.candidates[0] && body.candidates[0].content && body.candidates[0].content.parts) || [])
      .map((p) => p.text || "")
      .join("");
    let parsed;
    try {
      parsed = JSON.parse(textOut);
    } catch (e) {
      parsed = textOut;
    }
    return cleanText(parsed);
  }
}
