// Mais › Configurações › Integrações › Memória da IA: o que a casa pediu para a IA lembrar em toda conversa. Uma memória
// só, da casa, compartilhada por todos os apps da família (o servidor guarda na pasta share do Home Assistant:
// lib/memoria-ia.js). O cartão vem logo depois do IA, só com Usar IA ligado: escrever uma frase, ver a lista, apagar.
// Arquivo igual nos apps em Node (tools/iguais.py). Quem usa oferece _memoriaIaCall(acao, payload) -> {lista, max}
// (acao: get, add {texto}, del {frase: o id dela}), e tem o _secHead e o _showToast.
import { html, nothing, unsafeSVG } from "../vendor/lit-all.min.js";
import { ICONS } from "./icons.js";

const icon = (name, cls = "") =>
  html`<svg class="i ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${unsafeSVG(ICONS[name] || ICONS.star || "")}</svg>`;

export const MEMORIA_IA_LEAD = "Uma memória só, da casa, compartilhada por todos os apps: o que você escreve aqui a IA lembra em toda conversa, em qualquer um deles.";

/** "02/11/2026 09:30 · ResolvIA · Ana" de uma frase {em, app, quem}. */
export function memoriaIaDe(x) {
  const t = /^(\d{4})-(\d\d)-(\d\d)T(\d\d):(\d\d)/.exec((x && x.em) || "");
  return [t ? `${t[3]}/${t[2]}/${t[1]} ${t[4]}:${t[5]}` : "", x && x.app, x && x.quem].filter(Boolean).join(" · ");
}

export const memoriaIaStyles = `
  .mem-ia .mem-campo { display: flex; flex-direction: column; gap: 8px; margin-top: 4px; }
  .mem-ia .mem-campo .label { display: flex; align-items: center; gap: 8px; }
  .mem-ia textarea { width: 100%; box-sizing: border-box; height: 50px; min-height: 50px; resize: vertical; padding: 13px 14px; border-radius: 12px;
    border: 1px solid var(--rv-line-strong); background: var(--rv-surface-2); color: var(--rv-text); font: inherit; }
  .mem-ia textarea:focus { outline: none; border-color: var(--rv-accent); }
  .mem-ia .ai-actions { margin-top: 10px; }
  .mem-ia .mem-lista { list-style: none; margin: 14px 0 0; padding: 0; }
  .mem-ia .mem-lista li { display: flex; align-items: center; gap: 10px; padding: 10px 0; border-top: 1px solid var(--rv-line); }
  .mem-ia .mem-lista li:first-child { border-top: 0; padding-top: 0; }
  .mem-ia .mem-lista li > span { flex: 1; min-width: 0; display: flex; flex-direction: column; overflow-wrap: anywhere; }
  .mem-ia .mem-lista small { color: var(--rv-muted); font-size: 13px; }
  .mem-ia .mem-del { flex: none; width: 44px; height: 44px; padding: 0; display: grid; place-items: center; border-radius: 12px;
    border: 1px solid var(--rv-line-strong); background: transparent; color: var(--rv-text); cursor: pointer; }
  .mem-ia .mem-del svg { width: 20px; height: 20px; }
`;

export const MemoriaIaMixin = (Base) =>
  class extends Base {
    /** Reads the list once (and again with again = true: another app may have written). */
    _memoriaIaLoad(again = false) {
      if (this._memIa !== undefined && !again) return;
      if (this._memIa === undefined) this._memIa = null;
      this._memoriaIaDo("get");
    }

    async _memoriaIaDo(acao, payload = {}) {
      try {
        const r = await this._memoriaIaCall(acao, payload);
        this._memIa = { lista: Array.isArray(r && r.lista) ? r.lista : [], max: (r && r.max) || 60 };
      } catch (e) {
        if (acao !== "get") this._showToast((e && e.message) || "Não consegui salvar");
        return false;
      }
      this.requestUpdate();
      return true;
    }

    async _memoriaIaAdd() {
      const ta = this.renderRoot && this.renderRoot.querySelector("#mem-ia-texto");
      if (!ta) return;
      if (await this._memoriaIaDo("add", { texto: ta.value })) {
        ta.value = "";
        this._showToast("A IA vai lembrar");
      }
    }

    async _memoriaIaDel(id) {
      if (await this._memoriaIaDo("del", { frase: id })) this._showToast("Apagado da memória");
    }

    _renderMemoriaIa() {
      this._memoriaIaLoad();
      const lista = (this._memIa && this._memIa.lista) || [];
      return html`<div class="panel mem-ia" id="memoria-ia">
        ${this._secHead("sparkles", "Memória da IA", MEMORIA_IA_LEAD)}
        <div class="mem-campo">
          <label class="label" for="mem-ia-texto">${icon("star", "lbl-ic")}O que lembrar</label>
          <textarea id="mem-ia-texto" rows="1" maxlength="240" data-size="off" placeholder="O café é sempre o da marca azul" aria-label="O que lembrar"></textarea>
        </div>
        <div class="ai-actions"><button class="btn primary" id="mem-ia-salvar" @click=${() => this._memoriaIaAdd()}>${icon("check")}Salvar</button></div>
        ${lista.length
          ? html`<ul class="mem-lista">${lista.map(
              (x) => html`<li><span><b>${x.texto}</b><small>${memoriaIaDe(x)}</small></span><button class="mem-del" aria-label="Apagar" @click=${() => this._memoriaIaDel(x.id)}>${icon("trash")}</button></li>`
            )}</ul>`
          : nothing}
      </div>`;
    }
  };
