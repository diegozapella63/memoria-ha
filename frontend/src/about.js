// Mais › Sobre: CorrerIA Code (who makes the apps), the apps of the family with a line each and the
// GitHub. The same page in each app of the family: only `app` and `version` change.
import { html, css, unsafeSVG } from "../vendor/lit-all.min.js";
import { ICONS } from "./icons.js";

export const GITHUB = "https://github.com/diegozapella63";

/** The apps of the family, in order: [name, repository, icon, the line about it]. */
export const PRODUCTS = [
  ["CronologIA", "cronologia-ha", "calendar-days", "Agenda da família, remédios, rotinas e placar."],
  ["ResolvIA", "resolvia-ha", "list-checks", "Listas de tarefas com prazos, pontos e repetição."],
  ["GerencIA", "gerencia-ha", "wallet", "Finanças da casa: caixa, cartões e investimentos."],
  ["InventarIA", "inventario-ha", "package", "Inventário da casa: cômodos, itens e valores."],
  ["EconomIA", "economia-ha", "receipt", "Lista de compras com o melhor preço perto de casa."],
  ["MemorIA", "memoria-ha", "book-open", "Cadernos de anotação que abrem na hora certa."],
  ["CorrerIA", "correria-ha", "message-circle", "Pergunte e peça a qualquer app, no chat ou no WhatsApp."],
];

const icon = (name) =>
  html`<svg class="i" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${unsafeSVG(ICONS[name] || ICONS.info)}</svg>`;

/** "CronologIA" with the "IA" in the accent color (one piece: the name never breaks). */
const wordmark = (name) => html`<span class="ab-wm">${name.slice(0, -2)}<span>${name.slice(-2)}</span></span>`;

const link = (href, body, cls) => html`<a class=${cls} href=${href} target="_blank" rel="noopener">${body}</a>`;

/** The page. app: the name of this app (marked "Este app", with its version). */
export function aboutPage({ app, version }) {
  return html`<div class="about">
    <div class="about-hero">
      <span class="ab-mark" aria-hidden="true">${icon("zap")}</span>
      <h2 class="ab-name">Correr<span>IA</span> Code</h2>
      <p class="ab-what">desenvolvimento de softwares</p>
      <p class="ab-tag">Feito na correria, rodado pela IA.</p>
    </div>

    <div class="panel about-why">
      <div class="mais-head"><span class="mais-ic" aria-hidden="true">${icon("hourglass")}</span><h2>Por que CorrerIA?</h2></div>
      <p>Porque eu sou um programador sem tempo: vivo na correria. Então eu uso a IA para rodar tudo isso aqui. Ela escreve, testa e publica; eu dou as ideias e reclamo dos botões tortos.</p>
    </div>

    <div class="panel">
      <div class="mais-head"><span class="mais-ic" aria-hidden="true">${icon("layers")}</span><h2>Os apps</h2></div>
      <ul class="about-apps" aria-label="Os apps">
        ${PRODUCTS.map(
          ([name, repo, ic, line]) => html`<li>
            ${link(
              `${GITHUB}/${repo}`,
              html`<span class="mais-ic" aria-hidden="true">${icon(ic)}</span>
                <span class="mb"><b class="ab-app">${wordmark(name)}${name === app ? html`<em class="ab-here">Este app · v${version}</em>` : ""}</b><span>${line}</span></span>
                ${icon("external-link")}`,
              `ab-row${name === app ? " here" : ""}`,
            )}
          </li>`,
        )}
      </ul>
    </div>

    ${link(GITHUB, html`${icon("external-link")}Meu GitHub`, "btn primary ab-github")}
  </div>`;
}

export const aboutStyles = css`
  .about-hero {
    position: relative;
    overflow: hidden;
    text-align: center;
    padding: 30px 20px 26px;
    margin-bottom: 18px;
    border-radius: 22px;
    border: 1px solid var(--rv-line);
    background:
      radial-gradient(120% 90% at 50% 0%, var(--rv-accent-soft), transparent 70%),
      var(--rv-surface);
  }
  .ab-mark {
    display: inline-grid;
    place-items: center;
    width: 58px;
    height: 58px;
    border-radius: 18px;
    background: var(--rv-accent);
    color: var(--rv-on-accent);
    transform: rotate(-8deg);
    box-shadow: 0 10px 24px -12px var(--rv-accent);
  }
  .ab-mark .i {
    width: 30px;
    height: 30px;
    fill: currentColor;
    stroke-width: 1.4;
  }
  .ab-name {
    margin: 16px 0 4px;
    font-family: var(--rv-display);
    font-size: 34px;
    font-weight: 700;
    line-height: 1.05;
    color: var(--rv-text);
  }
  .ab-name span,
  .ab-wm span {
    color: var(--rv-accent-ink);
  }
  .ab-what {
    margin: 0;
    color: var(--rv-muted);
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.14em;
    text-transform: uppercase;
  }
  @media (max-width: 360px) {
    .ab-what {
      font-size: 11px;
      letter-spacing: 0.06em;
    }
  }
  .ab-tag {
    margin: 14px 0 0;
    color: var(--rv-text);
    font-size: 16px;
    font-style: italic;
  }
  .about-why p {
    margin: 0 0 16px;
    color: var(--rv-text);
    font-size: 15.5px;
    line-height: 1.55;
  }
  .about-apps {
    list-style: none;
    margin: 0 0 6px;
    padding: 0;
  }
  .ab-row {
    display: flex;
    align-items: center;
    gap: 14px;
    min-height: 68px;
    padding: 10px 0;
    color: inherit;
    text-decoration: none;
    border-top: 1px solid var(--rv-line);
  }
  .about-apps > li:first-child > .ab-row {
    border-top: 0;
  }
  .ab-row .mb {
    flex: 1;
    min-width: 0;
    display: grid;
    gap: 2px;
  }
  .ab-row b {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    gap: 4px 8px;
    font-family: var(--rv-display);
    font-size: 18px;
    font-weight: 600;
    line-height: 1.2;
  }
  .ab-row .mb > span {
    color: var(--rv-muted);
    font-size: 14px;
    line-height: 1.35;
  }
  .ab-row > .i {
    flex: none;
    width: 18px;
    height: 18px;
    color: var(--rv-faint);
  }
  .ab-here {
    font-family: var(--rv-body, inherit);
    font-size: 12px;
    font-style: normal;
    font-weight: 600;
    color: var(--rv-accent-ink);
    background: var(--rv-accent-soft);
    border-radius: 999px;
    padding: 2px 8px;
  }
  @media (hover: hover) {
    .ab-row:hover b {
      color: var(--rv-accent-ink);
    }
  }
  .ab-github {
    display: flex;
    width: 100%;
    margin: 4px 0 8px;
    text-decoration: none;
  }
  .ab-github .i {
    width: 19px;
    height: 19px;
  }
`;
