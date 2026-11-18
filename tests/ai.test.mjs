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
