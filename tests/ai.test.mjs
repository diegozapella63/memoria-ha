// MemorIA 1.34.0: which AI of Home Assistant answers: the one for conversing (and reading text) and the one for photos
// and PDFs (none chosen: the same as for conversing). A Home Assistant of mentira, two AIs (one reads photos).
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { AI } from "../memoria/rootfs/app/lib/ai.js";

const STATES = [
  { entity_id: "ai_task.conversa", state: "unknown", attributes: { friendly_name: "Conversa", supported_features: 1 } },
  { entity_id: "ai_task.leitura", state: "unknown", attributes: { friendly_name: "Leitura", supported_features: 3 } },
];
const ha = { ready: true, send: async (m) => (m.type === "get_states" ? STATES : m.type === "ai_task/preferences/get" ? { gen_data_entity_id: "ai_task.conversa" } : null) };
const log = { info() {}, warn() {}, error() {} };
const mk = (sel, photos) => new AI({ ha, log, mediaDir: fs.mkdtempSync(path.join(os.tmpdir(), "memoria-ai-")), selected: () => sel, selectedPhotos: () => photos });

describe("AI: one for conversing, one for photos and PDFs", () => {
  it("photos go to the one chosen for them; none chosen, to the one for conversing; the default of Home Assistant without any", async () => {
    assert.deepEqual([(await mk("ai_task.conversa", "ai_task.leitura").resolve(false)).id, (await mk("ai_task.conversa", "ai_task.leitura").resolve(true)).id], ["ai_task.conversa", "ai_task.leitura"]);
    assert.equal((await mk("ai_task.leitura", "").resolve(true)).id, "ai_task.leitura");
    await assert.rejects(mk("ai_task.conversa", "").resolve(true), { code: "no_vision" }, "the one for conversing doesn't read photos: says so");
    assert.deepEqual([(await mk("", "").resolve(false)).id, (await mk("", "").resolve(true)).id], ["ai_task.conversa", "ai_task.leitura"]);
    const st = await mk("ai_task.conversa", "ai_task.leitura").status();
    assert.deepEqual([st.selected, st.selected_photos, st.using.id, st.photos.id], ["ai_task.conversa", "ai_task.leitura", "ai_task.conversa", "ai_task.leitura"]);
  });
});

describe("AI: what the screen is told when something is missing", () => {
  const withHa = (h, o = {}) => new AI({ ha: h, log, mediaDir: o.mediaDir || fs.mkdtempSync(path.join(os.tmpdir(), "memoria-ai-")), selected: () => o.sel || "", selectedPhotos: () => o.photos || "" });
  const states = (list, prefs = async () => null) => ({ ready: true, send: async (m) => (m.type === "get_states" ? list : m.type === "ai_task/preferences/get" ? prefs() : null) });
  const off = (s) => ({ ...s, state: "unavailable" });

  it("no connection, a Home Assistant that does not answer, no AI at all", async () => {
    assert.equal((await withHa({ ready: false }).status()).reason, "Sem conexão com o Home Assistant.");
    const broken = await withHa({ ready: true, send: async () => { throw new Error("tempo esgotado"); } }).status();
    assert.deepEqual([broken.ready, broken.reason], [false, "Não deu para consultar o Home Assistant: tempo esgotado"]);
    const none = await withHa(states([])).status();
    assert.deepEqual([none.ready, none.entities, none.reason], [false, [], "Nenhuma IA configurada no Home Assistant (integração com tarefa de IA)."]);
  });

  it("every AI unavailable; none reads photos; an older Home Assistant (no preferred AI): the first that can", async () => {
    const down = withHa(states(STATES.map(off)));
    await assert.rejects(down.resolve(false), { code: "unavailable", message: "As IAs do Home Assistant estão indisponíveis." });
    await assert.rejects(down.resolve(true), { code: "no_vision" });
    const text = await withHa(states([STATES[0]])).status();
    assert.deepEqual([text.ready, text.images, text.using.id, text.reason], [true, false, "ai_task.conversa", "Nenhuma IA do Home Assistant lê fotos. Use um modelo que entenda imagens."]);
    const old = withHa(states(STATES, async () => { throw new Error("unknown command"); }));
    assert.equal(await old.preferred(), null);
    assert.equal((await old.resolve(false)).id, "ai_task.leitura", "the ones that read photos come first");
  });

  it("the media folder out of reach: the AI answers, but no photos", async () => {
    const file = path.join(fs.mkdtempSync(path.join(os.tmpdir(), "memoria-ai-")), "um-arquivo");
    fs.writeFileSync(file, "x");
    const ai = withHa(states(STATES), { mediaDir: file });
    assert.equal(ai.mediaWritable(), false);
    const st = await ai.status();
    assert.deepEqual([st.ready, st.images, st.reason], [true, false, "A pasta media do Home Assistant não está disponível para o app."]);
  });
});
