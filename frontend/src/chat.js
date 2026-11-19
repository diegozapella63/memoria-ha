// Conversa: the chat with the AI beside the microphone (ResolvIA, CronologIA and MemorIA keep the same copy
// of this file). Each app gives the messages, what the AI proposes to do (cards with a button: nothing
// is done without a tap) and what happens on each button.
//
// messages: [{role: "user"|"ia", text, actions?: [{label, icon, state: "todo"|"doing"|"done"|"failed", note?}]}]
//
// Perguntas prontas: the questions of the app (examples) until the person edits them (Editar perguntas, kept on the
// device in <app>-perguntas); with an empty chat they are there, and the sparkles button by the box shows them at any
// moment. The state of the panel is here (one chat per page); onRedraw draws the chat again.
//
// The clip (with onAttach): Tirar foto, Escolher fotos and Escolher arquivo; the files chosen (files: [{nome, pdf,
// url}], from chatFiles) go with the next message (onSend) and their names stay in it (anexos). The round button on
// the right is the microphone with the box empty and Enviar with text or a file, as in WhatsApp.

const UI = { quick: false, editing: null, menu: false };
export const CHAT_MAX_FILES = 4;

/**
 * The files chosen (File objects) ready for the AI: [{nome, pdf, mime, data (base64), url}]. The photos become JPG
 * of up to 1600 px; a PDF goes as it is, alone (up to 15 MB). With `current`, up to CHAT_MAX_FILES in all.
 */
export async function chatFiles(list, current = []) {
  let out = current.slice();
  const b64 = (blob) =>
    new Promise((ok, fail) => {
      const r = new FileReader();
      r.onload = () => ok(String(r.result).split(",")[1] || "");
      r.onerror = () => fail(r.error);
      r.readAsDataURL(blob);
    });
  const errors = [];
  for (const f of Array.from(list || [])) {
    const pdf = f.type === "application/pdf" || /\.pdf$/i.test(f.name || "");
    if (pdf) {
      if (f.size > 15 * 1024 * 1024) {
        errors.push("Arquivo grande demais (até 15 MB).");
        continue;
      }
      out = [{ nome: f.name || "arquivo.pdf", pdf: true, mime: "application/pdf", data: await b64(f), url: "" }]; // um PDF vai sozinho
      continue;
    }
    if (f.type && !/^image\//.test(f.type)) {
      errors.push("Escolha uma foto ou um PDF.");
      continue;
    }
    if (out.length >= CHAT_MAX_FILES || out.some((x) => x.pdf)) {
      if (out.some((x) => x.pdf)) out = [];
      else {
        errors.push(`Até ${CHAT_MAX_FILES} arquivos por mensagem.`);
        break;
      }
    }
    try {
      const bmp = await createImageBitmap(f, { imageOrientation: "from-image" });
      const k = Math.min(1, 1600 / Math.max(bmp.width, bmp.height));
      const c = document.createElement("canvas");
      c.width = Math.max(1, Math.round(bmp.width * k));
      c.height = Math.max(1, Math.round(bmp.height * k));
      const g = c.getContext("2d");
      g.fillStyle = "#fff";
      g.fillRect(0, 0, c.width, c.height);
      g.drawImage(bmp, 0, 0, c.width, c.height);
      if (bmp.close) bmp.close();
      const blob = await new Promise((ok) => c.toBlob(ok, "image/jpeg", 0.86));
      out.push({ nome: f.name || `Foto ${out.length + 1}.jpg`, pdf: false, mime: "image/jpeg", data: await b64(blob), url: URL.createObjectURL(blob) });
    } catch (e) {
      errors.push("Não deu para abrir esta foto. Use JPG ou PNG.");
    }
  }
  return { files: out, error: errors[0] || "" };
}

/** The questions of the chat: the ones the person saved on this device, or the app's. */
export function chatQuestions(app, examples = []) {
  try {
    const v = JSON.parse(localStorage.getItem(`${app}-perguntas`) || "null");
    if (Array.isArray(v)) return v.filter((x) => typeof x === "string" && x.trim());
  } catch (e) {
    /* sem o armazenamento do aparelho: as do app */
  }
  return examples;
}

function saveQuestions(app, list) {
  try {
    if (list == null) localStorage.removeItem(`${app}-perguntas`);
    else localStorage.setItem(`${app}-perguntas`, JSON.stringify(list));
  } catch (e) {
    /* modo privado: fica até fechar */
  }
}

/** The chat. lit: {html, nothing}; icon(name). */
export function renderChat({ lit, icon, app = "", messages = [], draft = "", busy = false, error = "", voice = null, examples = [], models = [], files = [], onDraft, onSend, onMic, onAction, onAll, onClear, onClose, onAttach = null, onFileRemove = () => {}, onRedraw = () => {} }) {
  const { html, nothing } = lit;
  const send = () => {
    const t = (draft || "").trim();
    if ((t || files.length) && !busy) onSend(t);
  };
  const qs = app ? chatQuestions(app, examples) : examples;
  const redraw = (changes) => (Object.assign(UI, changes), onRedraw());
  const ask = (q) => {
    redraw({ quick: false });
    onSend(q);
  };
  // the questions: a tap asks; Editar perguntas (only with an app to keep them) turns them into a list to change
  const quickBlock = () => {
    const ed = UI.editing;
    if (ed) {
      const add = (el) => {
        const t = (ed.draft || "").trim();
        const box = el && el.closest(".chat-ed-new") && el.closest(".chat-ed-new").querySelector("input");
        if (box) box.value = ""; // (o valor do campo não volta sozinho: ele muda sem desenhar de novo)
        if (t) redraw({ editing: { list: [...ed.list, t], draft: "" } });
      };
      return html`<div class="chat-ed">
        <span class="chat-ed-h">${icon("pencil")}Perguntas prontas</span>
        ${ed.list.map((q, i) => html`<div class="chat-ed-row"><span>${q}</span><button type="button" class="icon-btn" aria-label=${`Tirar “${q}”`} @click=${() => redraw({ editing: { ...ed, list: ed.list.filter((_, j) => j !== i) } })}>${icon("x")}</button></div>`)}
        <div class="chat-ed-new">
          <input type="text" maxlength="120" .value=${ed.draft || ""} placeholder="Nova pergunta" aria-label="Nova pergunta" enterkeyhint="done"
            @input=${(e) => (ed.draft = e.target.value)} @keydown=${(e) => { if (e.key === "Enter") { e.preventDefault(); add(e.target); } }} />
          <button type="button" class="btn outline sm" @click=${(e) => add(e.currentTarget)}>${icon("plus")}Adicionar</button>
        </div>
        ${((more) => (more.length ? html`<span class="chat-ed-h chat-ed-mais">${icon("sparkles")}Mais perguntas (${more.length})</span>
          ${more.map((q) => html`<button type="button" class="chat-ed-row chat-ed-modelo" aria-label=${`Pôr “${q}”`} @click=${() => redraw({ editing: { ...ed, list: [...ed.list, q] } })}><span>${q}</span><span class="chat-ed-mais-ic">${icon("plus")}</span></button>`)}` : nothing))(
          // os modelos do app que ainda não estão na lista: um toque põe
          models.filter((q, i) => models.indexOf(q) === i && !ed.list.includes(q)),
        )}
        <div class="chat-ed-acts">
          <button type="button" class="btn outline sm" @click=${() => (saveQuestions(app, null), redraw({ editing: { list: examples.slice(), draft: "" } }))}>${icon("rotate-ccw")}Padrão</button>
          <button type="button" class="btn primary sm" @click=${() => {
            const list = ed.list.concat((ed.draft || "").trim() ? [(ed.draft || "").trim()] : []);
            saveQuestions(app, list.join("\n") === examples.join("\n") ? null : list); // as do app: seguem a tela
            redraw({ editing: null });
          }}>${icon("check")}Pronto</button>
        </div>
      </div>`;
    }
    return html`<div class="chat-ex">${qs.map((e) => html`<button type="button" class="pick" @click=${() => ask(e)}>${icon("sparkles")}<span>${e}</span></button>`)}</div>
      ${app ? html`<button type="button" class="text-btn chat-ed-open" @click=${() => redraw({ editing: { list: qs.slice(), draft: "" } })}>${icon("pencil")}Editar perguntas</button>` : nothing}`;
  };
  const actionRow = (m, k, a, j) => html`<div class="chat-act ${a.state || "todo"}">
    <span class="chat-act-ic">${icon(a.state === "done" ? "check" : a.state === "failed" ? "circle-alert" : a.icon || "sparkles")}</span>
    <span class="chat-act-tx">${a.label}${a.note ? html`<small>${a.note}</small>` : nothing}</span>
    ${a.state === "done" ? html`<span class="chat-act-ok">Feito</span>` : a.state === "doing" ? html`<span class="chat-act-ok">…</span>` : html`<button type="button" class="btn primary sm" @click=${() => onAction(k, j)}>${icon(a.state === "failed" ? "rotate-ccw" : "check")}${a.state === "failed" ? "Tentar de novo" : "Fazer"}</button>`}
  </div>`;
  const bubble = (m, k) => {
    const todo = (m.actions || []).filter((a) => a.state !== "done" && a.state !== "doing").length;
    const arqs = m.role === "user" && Array.isArray(m.anexos) ? m.anexos : [];
    return html`<div class="chat-msg ${m.role === "user" ? "me" : "ia"}">
      ${m.text || arqs.length ? html`<div class="chat-bubble">${arqs.map((n) => html`<span class="chat-arq">${icon("paperclip")}${n}</span>`)}${m.text || ""}</div>` : nothing}
      ${(m.actions || []).length
        ? html`<div class="chat-acts">
            ${m.actions.map((a, j) => actionRow(m, k, a, j))}
            ${todo > 1 ? html`<button type="button" class="btn outline sm chat-all" @click=${() => onAll(k)}>${icon("check")}Fazer todas (${todo})</button>` : nothing}
          </div>`
        : nothing}
    </div>`;
  };
  const rec = voice && voice.on;
  const clip = !!onAttach && !rec;
  const menu = clip && UI.menu;
  const attach = (kind) => (redraw({ menu: false }), onAttach(kind));
  // the round button on the right: the microphone with the box empty (listening: the check), Enviar with text or a file
  const micMode = !!(voice && voice.ready) && (rec || (!(draft || "").trim() && !files.length));
  return html`<div class="chat">
    <div class="chat-head">
      <span class="chat-title">${icon("message-circle")}Conversa</span>
      ${messages.length ? html`<button type="button" class="text-btn chat-nova" aria-label="Nova conversa" @click=${() => onClear()}>${icon("plus")}<span>Nova conversa</span></button>` : nothing}
      <button type="button" class="icon-btn" aria-label="Fechar" @click=${() => onClose()}>${icon("x")}</button>
    </div>
    <div class="chat-log">
      ${messages.length
        ? messages.map(bubble)
        : qs.length || app
          ? html`<div class="chat-empty">${quickBlock()}</div>`
          : nothing}
      ${busy ? html`<div class="chat-msg ia"><div class="chat-bubble typing"><i></i><i></i><i></i></div></div>` : nothing}
      ${error ? html`<div class="chat-error">${icon("circle-alert")}<span>${error}</span></div>` : nothing}
    </div>
    ${messages.length && (UI.quick || UI.editing) ? html`<div class="chat-quick">${quickBlock()}</div>` : nothing}
    ${menu
      ? html`<div class="chat-menu" role="menu">
          <button type="button" class="chat-op" role="menuitem" @click=${() => attach("camera")}>${icon("camera")}Tirar foto</button>
          <button type="button" class="chat-op" role="menuitem" @click=${() => attach("fotos")}>${icon("images")}Escolher fotos</button>
          <button type="button" class="chat-op" role="menuitem" @click=${() => attach("arquivo")}>${icon("file-text")}Escolher arquivo</button>
        </div>`
      : nothing}
    ${files.length
      ? html`<div class="chat-files">${files.map(
          (f, i) => html`<div class="chat-file">${f.pdf ? html`<span class="chat-pdf">${icon("file-text")}</span>` : html`<img src=${f.url} alt="" />`}<span class="chat-file-n">${f.nome}</span><button type="button" class="icon-btn" aria-label=${`Tirar ${f.nome}`} @click=${() => onFileRemove(i)}>${icon("x")}</button></div>`,
        )}</div>`
      : nothing}
    <form class="chat-input" @submit=${(e) => (e.preventDefault(), send())}>
      ${clip ? html`<button type="button" class="icon-btn chat-clip ${menu ? "on" : ""}" aria-label="Anexar" title="Anexar" aria-expanded=${menu ? "true" : "false"} ?disabled=${busy} @click=${() => redraw({ menu: !UI.menu, quick: false, editing: null })}>${icon("paperclip")}</button>` : nothing}
      <textarea rows="1" data-size="off" .value=${draft} placeholder=${rec ? "Ouvindo…" : "Pergunte o que quiser"} aria-label="Mensagem para a IA" ?disabled=${rec}
        @input=${(e) => onDraft(e.target.value)}
        @keydown=${(e) => {
          if (e.key === "Enter" && !e.shiftKey && !e.isComposing) {
            e.preventDefault();
            send();
          }
        }}></textarea>
      ${messages.length && (qs.length || app) && !rec
        ? html`<button type="button" class="icon-btn chat-qbtn ${UI.quick || UI.editing ? "on" : ""}" aria-label="Perguntas prontas" aria-expanded=${UI.quick || UI.editing ? "true" : "false"} title="Perguntas prontas" @click=${() => redraw({ quick: !(UI.quick || UI.editing), editing: null, menu: false })}>${icon("sparkles")}</button>`
        : nothing}
      ${micMode
        ? html`<button type="button" class="icon-btn chat-mic ${rec ? "on" : ""}" aria-label=${rec ? "Pronto: enviar o que falei" : "Falar"} ?disabled=${busy || voice.starting} @click=${() => onMic()}>${icon(rec ? "check" : "mic")}</button>`
        : html`<button type="submit" class="icon-btn chat-send" aria-label="Enviar" ?disabled=${busy || rec || !((draft || "").trim() || files.length)}>${icon("send")}</button>`}
    </form>
  </div>`;
}

export const chatStyles = `
  .chat { display: flex; flex-direction: column; height: min(78vh, 680px); margin: -4px -4px 0; }
  .chat-head { display: flex; align-items: center; gap: 10px; padding: 0 0 10px; }
  .chat-title { display: inline-flex; align-items: center; gap: 8px; flex: 1; font-weight: 700; font-size: 18px; }
  .chat-title .i { width: 30px; height: 30px; padding: 6px; border-radius: 9px; background: var(--rv-accent-soft); color: var(--rv-accent-ink, var(--rv-accent)); }
  .chat-head .text-btn { display: inline-flex; align-items: center; gap: 6px; white-space: nowrap; }
  @media (max-width: 340px) { .chat-nova span { display: none; } }
  .chat-head .text-btn .i { width: 16px; height: 16px; }
  .chat-log { flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 10px; padding: 6px 2px 12px; overscroll-behavior: contain; }
  .chat-empty { margin: auto 0 0; color: var(--rv-muted); font-size: 15px; line-height: 1.45; }
  .chat-empty p { margin: 0 0 12px; }
  .chat-ex { display: flex; flex-wrap: wrap; gap: 8px; }
  .chat-ex .pick { font-size: 14px; padding: 8px 12px; min-height: 0; display: inline-flex; align-items: center; gap: 6px; }
  .chat-ex .pick .i { width: 16px; height: 16px; flex: none; color: var(--rv-accent-ink, var(--rv-accent)); }
  .chat-msg { display: flex; flex-direction: column; gap: 6px; max-width: 88%; }
  .chat-msg.me { align-self: flex-end; align-items: flex-end; }
  .chat-msg.ia { align-self: flex-start; }
  .chat-bubble { padding: 10px 14px; border-radius: 18px; font-size: 15.5px; line-height: 1.42; white-space: pre-wrap; overflow-wrap: anywhere; }
  .chat-msg.me .chat-bubble { background: var(--rv-accent); color: var(--rv-on-accent, #fff); border-bottom-right-radius: 6px; }
  .chat-msg.ia .chat-bubble { background: color-mix(in srgb, var(--rv-muted) 14%, transparent); color: var(--rv-text); border-bottom-left-radius: 6px; }
  .chat-bubble.typing { display: inline-flex; gap: 5px; padding: 14px 16px; }
  .chat-bubble.typing i { width: 7px; height: 7px; border-radius: 50%; background: var(--rv-muted); animation: chat-dot 1.2s infinite ease-in-out; }
  .chat-bubble.typing i:nth-child(2) { animation-delay: 0.15s; }
  .chat-bubble.typing i:nth-child(3) { animation-delay: 0.3s; }
  @keyframes chat-dot { 0%, 80%, 100% { opacity: 0.25; transform: translateY(0); } 40% { opacity: 1; transform: translateY(-3px); } }
  .chat-acts { display: grid; gap: 8px; width: 100%; min-width: min(300px, 80vw); }
  .chat-act { display: flex; align-items: center; gap: 10px; padding: 8px 8px 8px 10px; border-radius: 14px; border: 1.5px solid var(--rv-line); }
  .chat-act.done { opacity: 0.7; }
  .chat-act.failed { border-color: var(--rv-late, #e5484d); }
  .chat-act-ic { width: 30px; height: 30px; border-radius: 9px; display: grid; place-items: center; flex: none; background: var(--rv-accent-soft); color: var(--rv-accent-ink, var(--rv-accent)); }
  .chat-act-ic .i { width: 16px; height: 16px; }
  .chat-act-tx { flex: 1; min-width: 0; display: flex; flex-direction: column; font-size: 14.5px; font-weight: 600; }
  .chat-act-tx small { font-weight: 400; font-size: 12.5px; color: var(--rv-muted); }
  .chat-act-ok { font-size: 13px; font-weight: 600; color: var(--rv-muted); padding: 0 8px; }
  .chat-act .btn.sm { min-height: 36px; padding: 0 14px; gap: 6px; }
  .chat-act .btn.sm .i, .chat-all .i { width: 16px; height: 16px; }
  .chat-all { justify-self: start; }
  .chat-error { display: flex; gap: 8px; align-items: flex-start; font-size: 14px; color: var(--rv-late, #e5484d); }
  .chat-error .i { width: 18px; height: 18px; flex: none; }
  .chat-input { display: flex; align-items: flex-end; gap: 8px; padding-top: 10px; border-top: 1px solid var(--rv-line); }
  .chat-input textarea { flex: 1; min-width: 0; resize: none; max-height: 120px; min-height: 46px; padding: 12px 14px; border-radius: 16px; border: 1.5px solid var(--rv-line-strong, var(--rv-line)); background: var(--rv-input-bg, transparent); color: var(--rv-text); font: inherit; font-size: 16px; line-height: 1.35; field-sizing: content; }
  .chat-input textarea:focus { outline: none; border-color: var(--rv-accent); }
  .chat-input .icon-btn { width: 46px; height: 46px; flex: none; border-radius: 14px; }
  .chat-send { background: var(--rv-accent); color: var(--rv-on-accent, #fff); }
  .chat-send:disabled { opacity: 0.4; }
  .chat-mic.on { background: var(--rv-late, #e5484d); color: #fff; }
  .chat-qbtn.on, .chat-clip.on { background: var(--rv-accent-soft); color: var(--rv-accent-ink, var(--rv-accent)); }
  .chat-input textarea::placeholder { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .chat-menu { display: grid; gap: 2px; margin-top: 8px; padding: 6px; border-radius: 16px; border: 1.5px solid var(--rv-line); }
  .chat-op { display: flex; align-items: center; gap: 12px; min-height: 50px; padding: 0 12px; border-radius: 12px; font: inherit; font-size: 16px; color: var(--rv-text); text-align: left; background: none; border: 0; cursor: pointer; }
  .chat-op:active { background: var(--rv-accent-soft); }
  .chat-op .i { width: 20px; height: 20px; color: var(--rv-accent-ink, var(--rv-accent)); }
  .chat-files { display: grid; gap: 6px; margin-top: 8px; }
  .chat-file { display: flex; align-items: center; gap: 10px; padding: 4px 4px 4px 6px; border-radius: 12px; border: 1.5px solid var(--rv-line); font-size: 14px; }
  .chat-file img, .chat-file .chat-pdf { width: 36px; height: 36px; border-radius: 8px; object-fit: cover; flex: none; display: grid; place-items: center; color: var(--rv-accent-ink, var(--rv-accent)); }
  .chat-file-n { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .chat-file .icon-btn { width: 36px; height: 36px; flex: none; }
  .chat-arq { display: flex; align-items: center; gap: 6px; font-weight: 600; font-size: 14px; }
  .chat-arq .i { width: 15px; height: 15px; flex: none; }
  .chat-quick { max-height: 42vh; overflow-y: auto; padding: 10px 2px; border-top: 1px solid var(--rv-line); }
  .chat-ed-open { display: inline-flex; align-items: center; gap: 6px; margin-top: 10px; }
  .chat-ed-open .i { width: 16px; height: 16px; }
  .chat-ed { display: grid; gap: 8px; color: var(--rv-text); }
  .chat-ed-h { display: inline-flex; align-items: center; gap: 8px; font-weight: 700; font-size: 15px; }
  .chat-ed-h .i { width: 18px; height: 18px; color: var(--rv-accent-ink, var(--rv-accent)); }
  .chat-ed-row { display: flex; align-items: center; gap: 8px; padding: 4px 0 4px 12px; border-radius: 12px; border: 1.5px solid var(--rv-line); font-size: 14.5px; }
  .chat-ed-row span { flex: 1; min-width: 0; overflow-wrap: anywhere; }
  .chat-ed-row .icon-btn { width: 40px; height: 40px; flex: none; }
  .chat-ed-new { display: flex; gap: 8px; }
  .chat-ed-mais { margin-top: 6px; }
  .chat-ed-modelo { width: 100%; background: none; color: inherit; font: inherit; font-size: 14.5px; text-align: left; cursor: pointer; border-style: dashed; padding-right: 0; }
  .chat-ed-mais-ic { width: 40px; height: 40px; flex: none !important; display: grid; place-items: center; color: var(--rv-accent-ink, var(--rv-accent)); }
  .chat-ed-mais-ic .i { width: 20px; height: 20px; }
  .chat-ed-new input { flex: 1; min-width: 0; min-height: 44px; padding: 0 12px; border-radius: 12px; border: 1.5px solid var(--rv-line-strong, var(--rv-line)); background: var(--rv-input-bg, transparent); color: var(--rv-text); font: inherit; font-size: 15px; }
  .chat-ed-new input:focus { outline: none; border-color: var(--rv-accent); }
  .chat-ed-acts { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
  .chat-ed .btn.sm { min-height: 44px; justify-content: center; gap: 6px; }
  .chat-ed .btn.sm .i { width: 16px; height: 16px; }
`;
