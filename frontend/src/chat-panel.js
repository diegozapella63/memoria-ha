// Conversa in the MemorIA (like the ResolvIA and the CronologIA): the button beside the microphone, the chat sheet,
// what goes to the AI (the screen, the notebooks and their sheets) and what its cards do (create a sheet in a block,
// add to a sheet), only after a tap. The chat itself is frontend/src/chat.js, the same file as the other apps.
// Mixed into <memoria-app>.
import { html, nothing, unsafeSVG } from "../vendor/lit-all.min.js";
import { ICONS } from "./icons.js";
import { renderChat } from "./chat.js";
import { Recorder, micError, VOICE_RATE, VOICE_MAX_S } from "./voice.js";
import { fold, clip, firstLine, newId } from "./util.js";
import { linksToText } from "../../memoria/rootfs/app/lib/links.js";
import { periodAt, periodTimes, PERIODS } from "../../memoria/rootfs/app/lib/schedule.js";

const icon = (name, cls = "") =>
  html`<svg class="i ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${unsafeSVG(ICONS[name] || ICONS.notebook)}</svg>`;
const SAVE_KEY = "memoria-conversa";
const pad = (n) => String(n).padStart(2, "0");
const ymd = (ms) => {
  const d = new Date(ms);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

export const ChatMixin = (Base) =>
  class extends Base {
    /** {messages, draft, busy, error}: kept while the app is open (and in this tab, across reloads). */
    _chatState() {
      if (!this._chat) {
        let messages = [];
        try {
          messages = JSON.parse(sessionStorage.getItem(SAVE_KEY) || "[]");
        } catch (e) {
          /* private mode */
        }
        this._chat = { messages: Array.isArray(messages) ? messages : [], draft: "", busy: false, error: "", rec: null };
      }
      return this._chat;
    }

    _setChat(changes) {
      this._chat = { ...this._chatState(), ...changes };
      if ("messages" in changes) {
        try {
          sessionStorage.setItem(SAVE_KEY, JSON.stringify(this._chat.messages.slice(-30)));
        } catch (e) {
          /* private mode */
        }
      }
      this.requestUpdate();
    }

    /** Beside the microphone (with Usar IA on). */
    _renderChatBtn() {
      if (!this._aiOn() || !this.api || !this.api.chat) return nothing;
      return html`<button class="mic-top chat-top" aria-label="Conversar com a IA" title="Conversar com a IA" @click=${() => this._openChat()}>${icon("message-circle")}</button>`;
    }

    _openChat() {
      this._haptic("light");
      this._openSheet("chat", {});
      this._chatScroll = true;
      this.updateComplete.then(() => {
        const ta = this.renderRoot.querySelector(".chat-input textarea");
        if (ta && window.matchMedia && window.matchMedia("(hover: hover) and (pointer: fine)").matches) ta.focus();
      });
    }

    _renderChatSheet() {
      const c = this._chatState();
      const v = this._voice || {};
      return renderChat({
        lit: { html, nothing },
        icon,
        messages: c.messages,
        draft: c.draft,
        busy: c.busy,
        error: c.error,
        voice: { ready: !!v.ready && this._micOk(), on: c.rec === "on", starting: c.rec === "starting" },
        examples: this._chatExamples(),
        onDraft: (t) => this._setChat({ draft: t }),
        onSend: (t) => this._chatSend(t),
        onMic: () => this._chatMic(),
        onAction: (k, j) => this._chatDo(k, j),
        onAll: (k) => this._chatDoAll(k),
        onClear: () => this._setChat({ messages: [], error: "" }),
        onClose: () => this._closeSheet(),
      });
    }

    /** Microphone available (https or the app; not plain http). */
    _micOk() {
      return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
    }

    _chatExamples() {
      const b = this._chatOpenBlock();
      if (b) return [`Resuma o bloco ${clip(b.name, 24)}`, "O que eu anotei de mais importante?"];
      return ["O que abre agora?", "O que eu anotei esta semana?", `Crie uma folha no ${clip((this._blocks()[0] || { name: "Diário" }).name, 20)} com uma lista de compras`];
    }

    /** The block on screen (its own screen, or the one open in Agora). */
    _chatOpenBlock() {
      const v = this._view();
      if (v.name === "block") return this._block(v.id);
      if (v.name === "now" && this._pad) return this._block(this._pad.block);
      return null;
    }

    /** Where the person is, in words for the AI. */
    _chatScreen() {
      const v = this._view();
      const pagePart = () => {
        if (!this._pad) return "";
        const list = this._pagesOf(this._pad.block);
        const page = this._pad.page !== "new" ? this._page(this._pad.page) : null;
        return page ? `, na folha ${list.indexOf(page) + 1} de ${list.length}` : ", numa folha nova";
      };
      if (v.name === "block") {
        const b = this._block(v.id);
        return b ? `o bloco "${b.name}"${pagePart()}` : "um bloco";
      }
      if (v.name === "now") {
        const b = this._pad && this._block(this._pad.block);
        return b ? `Agora, com o bloco "${b.name}" aberto${pagePart()}` : "Agora (nenhum bloco)";
      }
      if (v.name === "shelf") return "Blocos (a estante com todos os blocos e o Seu dia)";
      if (v.name === "search") return this._query ? `Buscar, procurando "${this._query}"` : "Buscar";
      if (v.name === "more") return "Mais (o menu: Categorias, Relatório, Configurações e Sobre)";
      if (v.name === "categorias") return "Mais › Categorias (as categorias dos blocos)";
      if (v.name === "config") return "Mais › Configurações (integrações, dados, aparência e opções)";
      if (v.name === "sobre") return "Mais › Sobre (CorrerIA Code, quem faz o app, os outros apps da família e o GitHub)";
      return "o MemorIA";
    }

    /** The notebooks for the AI: the block on screen first, each sheet with its title and text (links as names). */
    _chatContext() {
      const open = this._chatOpenBlock();
      const periods = periodTimes(this._data);
      const now = new Date(this._now);
      const min = now.getHours() * 60 + now.getMinutes();
      const per = PERIODS.find((p) => p.id === periodAt(min, periods));
      const { cur } = this._slot();
      const curBlock = cur && cur.entries[0] ? this._block(cur.entries[0].block) : null;
      const blocks = this._blocks().slice();
      blocks.sort((a, b) => Number(b === open) - Number(a === open));
      return {
        tela: this._chatScreen(),
        agora: `${per ? per.label.toLowerCase() : ""}${curBlock ? `; o bloco do momento é "${curBlock.name}"` : ""}`,
        blocos: blocks.map((b) => {
          const pages = this._pagesOf(b.id);
          const cat = this._cat(b.category);
          return {
            id: b.id,
            nome: b.name,
            categoria: cat ? cat.name : "",
            abre: this._whenParts(b, false)
              .map((p) => (p.icon === "clock" ? `às ${p.label}` : `${p.label.toLowerCase()} (${p.time})`))
              .join(", ")
              .replace(/^(.)/, (x) => (x ? `abre ${x}` : x)),
            aberto: b === open,
            total: pages.length,
            folhas: pages.slice(-(b === open ? 60 : 20)).map((p) => ({
              n: pages.indexOf(p) + 1,
              titulo: firstLine(linksToText(p.text)),
              texto: linksToText(p.text, { domain: true }),
              escrita: ymd(p.created),
              horarios: (p.times || []).join(", "),
            })),
          };
        }),
      };
    }

    async _chatSend(text) {
      const c = this._chatState();
      if (c.busy) return;
      const messages = [...c.messages, { role: "user", text }];
      this._setChat({ messages, draft: "", busy: true, error: "" });
      this._chatScroll = true;
      try {
        const out = await this.api.chat(
          messages.map((m) => ({ role: m.role, text: m.text || (m.actions || []).map((a) => a.label).join("; ") })),
          this._chatContext(),
        );
        const actions = (out.actions || []).map((a) => ({ ...a, label: this._chatLabel(a), icon: a.tipo === "acrescentar" ? "list-plus" : "notebook-pen", state: "todo" }));
        this._setChat({ messages: [...this._chatState().messages, { role: "ia", text: out.reply || "", actions }], busy: false });
      } catch (err) {
        this._setChat({ busy: false, error: err.message || "A IA não respondeu. Tente de novo." });
      }
      this._chatScroll = true;
    }

    _chatLabel(a) {
      const what = clip(firstLine(linksToText(a.texto)) || "", 50);
      if (a.tipo === "acrescentar") return `Acrescentar "${what}" na folha ${a.folha} de ${clip(a.nome, 24)}`;
      return `Criar folha "${what}" em ${clip(a.nome, 24)}`;
    }

    _setAction(k, j, changes) {
      const messages = this._chatState().messages.map((m, n) => (n === k ? { ...m, actions: m.actions.map((a, i) => (i === j ? { ...a, ...changes } : a)) } : m));
      this._setChat({ messages });
    }

    /** One card's button: creates the sheet or adds to it, as writing on the screen would. */
    async _chatDo(k, j) {
      const a = ((this._chatState().messages[k] || {}).actions || [])[j];
      if (!a || a.state === "done" || a.state === "doing") return;
      this._setAction(k, j, { state: "doing", note: "" });
      const b = this._block(a.bloco);
      let ok = false;
      let note = "";
      if (!b) note = "Esse bloco não existe mais.";
      else if (a.tipo === "criar") {
        const now = Date.now();
        const page = { id: newId(), block: b.id, text: a.texto, times: [], created: now, updated: now };
        this._putPage(page);
        this._queueSave(page.id, 0);
        ok = true;
      } else {
        const page = this._pagesOf(b.id)[a.folha - 1];
        if (!page || fold(firstLine(linksToText(page.text))) !== fold(a.titulo)) note = "Essa folha mudou. Peça de novo.";
        else {
          this._putPage({ ...page, text: `${page.text.replace(/\s+$/, "")}\n${a.texto}` });
          this._queueSave(page.id, 0);
          ok = true;
        }
      }
      this._setAction(k, j, { state: ok ? "done" : "failed", note: ok ? "" : note || "Não deu certo." });
      if (ok) this._haptic("success");
    }

    async _chatDoAll(k) {
      const acts = (this._chatState().messages[k] || {}).actions || [];
      for (let j = 0; j < acts.length; j++) if (acts[j].state !== "done") await this._chatDo(k, j);
    }

    /** The microphone of the chat: talk, then what was understood is sent. */
    async _chatMic() {
      const c = this._chatState();
      if (c.rec === "on") {
        const rec = this._chatRec;
        this._chatRec = null;
        clearTimeout(this._chatRecTimer);
        if (!rec) return this._setChat({ rec: null });
        const pcm = rec.stop();
        this._setChat({ rec: null });
        if (pcm.length < VOICE_RATE * 0.4) return this._setChat({ error: "Não ouvi nada. Toque no microfone e fale." });
        this._setChat({ busy: true, error: "" });
        try {
          const r = await this.api.voiceText(pcm);
          this._setChat({ busy: false });
          if (r && r.text) this._chatSend(r.text);
        } catch (err) {
          this._setChat({ busy: false, error: err.message || "Não consegui transcrever." });
        }
        return;
      }
      if (c.rec) return;
      const rec = new Recorder(() => {});
      this._chatRec = rec;
      this._setChat({ rec: "starting", error: "" });
      try {
        await rec.start();
      } catch (err) {
        rec.cancel();
        this._chatRec = null;
        return this._setChat({ rec: null, error: micError(err) });
      }
      if (this._chatRec !== rec) return rec.cancel();
      this._setChat({ rec: "on" });
      this._chatRecTimer = setTimeout(() => this._chatState().rec === "on" && this._chatMic(), VOICE_MAX_S * 1000);
    }

    /** Leaving the chat stops the microphone. */
    _chatStop() {
      clearTimeout(this._chatRecTimer);
      if (this._chatRec) this._chatRec.cancel();
      this._chatRec = null;
      if (this._chat && this._chat.rec) this._chat = { ...this._chat, rec: null };
    }

    /** After each render: the chat scrolls to the newest message. */
    _chatAfterRender() {
      if (!this._chatScroll || this._sheet !== "chat") return;
      this._chatScroll = false;
      const log = this.renderRoot.querySelector(".chat-log");
      if (log) log.scrollTop = log.scrollHeight;
    }
  };
