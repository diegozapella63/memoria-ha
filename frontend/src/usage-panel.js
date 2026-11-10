// Mais › Configurações › Integrações › Uso da IA, like the EconomIA: today, 7 days and this month,
// a bar per day (tap to see that day), the kinds of call and the last calls.
// Shared by the CronologIA and the ResolvIA (same file in both).
import { html, nothing } from "../vendor/lit-all.min.js";

const WD = ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"];
const KIND = { mensagem: "Mensagens", fotos: "Fotos", sugestao: "Sugestões", conversa: "Conversa" };
const RESULT = { erro: "erro", cota: "sem cota", formato: "resposta fora do formato" };
const pad = (n) => String(n).padStart(2, "0");
const ymdOf = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const dayOf = (s) => {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
};
const n1 = (v) => String(Math.round(v * 10) / 10).replace(".", ",");
/** 850 tokens, 1,2 mil tokens. */
export const kTokens = (n) => (n >= 1000 ? `${n1(n / 1000)} mil` : String(Math.round(n || 0)));
const calls = (n) => `${n} ${n === 1 ? "chamada" : "chamadas"}`;
const aiName = (id, names = {}) => names[id] || (id || "").replace(/^ai_task\./, "").replace(/_/g, " ") || "padrão do Home Assistant";
const when = (iso, now) => {
  const d = new Date(iso);
  if (!Number.isFinite(d.getTime())) return "";
  const t = `${pad(d.getHours())}:${pad(d.getMinutes())}`;
  return ymdOf(d) === ymdOf(now) ? `hoje ${t}` : `${pad(d.getDate())}/${pad(d.getMonth() + 1)} ${t}`;
};

function provider(ids) {
  const j = ids.join(" ").toLowerCase();
  if (/google|gemini/.test(j)) return html`Consumo exato e cota: <a href="https://console.cloud.google.com/apis/dashboard" target="_blank" rel="noopener">Google Cloud Console</a>.`;
  if (/openai|chatgpt|gpt/.test(j)) return html`Consumo exato e custo: <a href="https://platform.openai.com/usage" target="_blank" rel="noopener">platform.openai.com/usage</a>.`;
  if (/anthropic|claude/.test(j)) return html`Consumo exato e custo: <a href="https://platform.claude.com/usage" target="_blank" rel="noopener">Claude Console</a>.`;
  return "O consumo exato fica no painel do provedor da IA.";
}

/**
 * u: the summary from the server (null while loading); day: the chosen bar; onDay(day);
 * head: the section heading; app: "CronologIA" | "ResolvIA"; using: the AI entity in use;
 * names: {entity_id: friendly name} of the AI tasks.
 */
export function usagePanel({ u, day, onDay, head, app, using = "", names = {} }) {
  if (!u || !u.hoje) return html`<div class="panel uso-panel" id="uso-ia">${head}<p class="panel-lead">Carregando…</p></div>`;
  const now = new Date();
  const today = ymdOf(now);
  const sub = (t) =>
    t.cota ? html`<span class="s alert">${t.cota} ${t.cota > 1 ? "vezes" : "vez"} sem cota</span>` : t.erros ? html`<span class="s alert">${t.erros} com erro</span>` : html`<span class="s">≈ ${kTokens(t.tokens)} tokens</span>`;
  const tile = (k, t) => html`<div class="uso-tile"><span class="k">${k}</span><span class="v">${t.chamadas || 0}</span>${sub(t)}</div>`;
  const days = u.dias || [];
  const max = Math.max(1, ...days.map((d) => d.chamadas || 0));
  const sel = days.find((d) => d.dia === day) || days.find((d) => d.dia === today) || { dia: today, chamadas: 0, erros: 0, cota: 0 };
  const label = (d) => (d.dia === today ? "hoje" : WD[dayOf(d.dia).getDay()]);
  const tipos = (u.semana && u.semana.tipos) || {};
  const ids = [...Object.keys((u.mes && u.mes.ias) || {}), ...Object.keys((u.semana && u.semana.ias) || {}), using];
  const last = u.ultimas || [];
  return html`<div class="panel uso-panel" id="uso-ia">
    ${head}
    <div class="uso-tiles">${tile("Hoje", u.hoje)}${tile("7 dias", u.semana)}${tile("Este mês", u.mes)}</div>
    <div class="uso-chart" role="group" aria-label="Chamadas de IA nos últimos 7 dias">
      ${days.map((d) => {
        const h = d.chamadas ? Math.max(4, Math.round((d.chamadas / max) * 100)) : 0;
        return html`<button type="button" class="uso-bar ${d.dia === today ? "today" : ""}" aria-pressed=${d.dia === sel.dia ? "true" : "false"} aria-label="${label(d)}: ${calls(d.chamadas)}" @click=${() => onDay(d.dia)}><i style="height:${h}%"></i></button>`;
      })}
    </div>
    <div class="uso-days" aria-hidden="true">${days.map((d) => html`<span>${label(d)}</span>`)}</div>
    <p class="uso-cap" aria-live="polite">${sel.dia === today ? "Hoje" : `${WD[dayOf(sel.dia).getDay()]}, ${pad(dayOf(sel.dia).getDate())}/${pad(dayOf(sel.dia).getMonth() + 1)}`}: <b>${calls(sel.chamadas)}</b>${sel.erros ? `, ${sel.erros} com erro` : ""}${sel.cota ? `, ${sel.cota} sem cota` : ""}.</p>
    ${Object.keys(tipos).length
      ? html`<ul class="uso-kinds">${Object.keys(tipos)
          .sort((a, b) => tipos[b] - tipos[a])
          .map((k) => html`<li>${KIND[k] || k} <b>${tipos[k]}</b></li>`)}</ul>`
      : nothing}
    <details class="uso-last">
      <summary>Últimas chamadas</summary>
      <ul>
        ${last.length
          ? last.map(
              (c) => html`<li><b>${KIND[c.tipo] || c.tipo}</b><span>${aiName(c.ia, names)}</span>${RESULT[c.resultado] ? html`<span class="r-err">${RESULT[c.resultado]}</span>` : nothing}
                <span class="t">${n1(c.segundos)} s · ≈ ${kTokens(c.tokens)} tokens${c.imagens ? ` · ${c.imagens} ${c.imagens > 1 ? "imagens" : "imagem"}` : ""} · ${when(c.quando, now)}</span></li>`,
            )
          : html`<li>Nenhuma chamada ainda.</li>`}
      </ul>
    </details>
    <p class="uso-note">${provider(ids)}</p>
  </div>`;
}

export const usageStyles = `
  .uso-tiles { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; padding: 4px 0 12px; }
  .uso-tile { background: var(--rv-bg); border-radius: 12px; padding: 10px 12px; display: flex; flex-direction: column; gap: 2px; min-width: 0; }
  .uso-tile .k { font-size: 12px; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; color: var(--rv-muted); }
  .uso-tile .v { font-family: var(--rv-display); font-weight: 700; font-size: 30px; line-height: 1.05; color: var(--rv-text); font-variant-numeric: tabular-nums; }
  .uso-tile .s { font-size: 12.5px; color: var(--rv-muted); line-height: 1.3; }
  .uso-tile .s.alert { color: var(--rv-late); font-weight: 600; }
  .uso-chart { display: grid; grid-template-columns: repeat(7, minmax(0, 1fr)); gap: 2px; align-items: end; height: 118px; padding-top: 6px; border-bottom: 1px solid var(--rv-line); }
  .uso-bar { display: flex; flex-direction: column; justify-content: flex-end; align-items: center; height: 100%; background: none; border: 0; padding: 0 4px; cursor: pointer; -webkit-tap-highlight-color: transparent; }
  .uso-bar i { display: block; width: 100%; max-width: 26px; min-height: 2px; border-radius: 4px 4px 0 0; background: var(--rv-accent); opacity: 0.45; }
  .uso-bar.today i, .uso-bar[aria-pressed="true"] i { opacity: 1; }
  .uso-bar:focus-visible { outline: 2px solid var(--rv-accent); outline-offset: 2px; border-radius: 4px; }
  .uso-days { display: grid; grid-template-columns: repeat(7, minmax(0, 1fr)); gap: 2px; font-size: 12px; color: var(--rv-muted); text-align: center; padding-top: 4px; }
  .uso-cap { font-size: 13.5px; color: var(--rv-muted); margin: 0; padding: 8px 0 10px; }
  .uso-cap b { color: var(--rv-text); font-weight: 600; }
  .uso-kinds { display: flex; flex-wrap: wrap; gap: 5px; padding: 0 0 10px; margin: 0; list-style: none; }
  .uso-kinds li { font-size: 12.5px; padding: 2px 8px; border: 1px solid var(--rv-line); border-radius: 6px; color: var(--rv-muted); }
  .uso-kinds b { color: var(--rv-text); font-weight: 600; }
  .uso-last { padding: 2px 0 8px; }
  .uso-last summary { font-size: 14.5px; font-weight: 600; color: var(--rv-accent-ink); cursor: pointer; padding: 6px 0; }
  .uso-last ul { list-style: none; margin: 0; padding: 0; }
  .uso-last li { display: flex; flex-wrap: wrap; gap: 2px 10px; align-items: baseline; font-size: 13px; padding: 7px 0; border-top: 1px solid var(--rv-line); color: var(--rv-muted); }
  .uso-last li b { color: var(--rv-text); font-weight: 600; }
  .uso-last li .r-err { color: var(--rv-late); font-weight: 600; }
  .uso-last li .t { flex-basis: 100%; font-size: 12.5px; }
  .uso-note { font-size: 13px; line-height: 1.5; color: var(--rv-muted); margin: 0 0 10px; }
  .uso-note:last-child { margin-bottom: 16px; }
  .uso-note a { color: var(--rv-accent-ink); }
  .uso-note code { font-size: 12px; }
`;
