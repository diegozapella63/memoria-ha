// Mais › Aparência like the InventarIA: the theme as three buttons of choice of the height of the family (the icon
// beside the name; on a narrow phone, only the name) and the app color as tag-shaped swatches with their names.
// Shared by the CronologIA and the ResolvIA (same file in both).
import { html } from "../vendor/lit-all.min.js";

const TAG = "M8 0h20a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H8L0 13V7z";
const HOLE = "M9.7 10a2.7 2.7 0 1 0-5.4 0a2.7 2.7 0 1 0 5.4 0z";

/**
 * Cor do dia: one color of the palette for each day (the same all day, on every device; the next one
 * tomorrow), from the local date. The gray ones are left out.
 */
export function colorOfDay(palette, date = new Date()) {
  const list = palette.filter((c) => c.id !== "grafite");
  const day = Math.floor(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86400000);
  return list[((day % list.length) + list.length) % list.length];
}

/** Sistema / Claro / Escuro. icon(name) draws an app icon. */
export function themePicker({ theme, onTheme, icon }) {
  return html`<div class="seg themes" role="radiogroup" aria-label="Tema">
    ${[
      ["auto", "Sistema", "smartphone"],
      ["light", "Claro", "sun"],
      ["dark", "Escuro", "moon"],
    ].map(([k, label, ic]) => html`<button type="button" class=${theme === k ? "on" : ""} role="radio" aria-checked=${theme === k ? "true" : "false"} @click=${() => onTheme(k)}>${icon(ic)}<span>${label}</span></button>`)}
  </div>`;
}

/** The colors of the palette ({id, label, fill}) as tags; the chosen one has a ring and a check. */
export function colorPicker({ palette, value, onPick }) {
  return html`<div class="tag-swatches" role="radiogroup" aria-label="Cor do app">
    ${palette.map(
      (c) => html`<button type="button" class="tsw ${value === c.id ? "on" : ""}" role="radio" aria-checked=${value === c.id ? "true" : "false"} style="--a:${c.fill}" @click=${() => onPick(c.id)}>
        <svg viewBox="-5 -5 40 30" aria-hidden="true"><path class="sw-ring" d=${TAG}></path><path class="sw-gap" d=${TAG}></path><path class="sw-fill" d=${TAG + HOLE}></path><path class="sw-check" d="m14.6 10.3 3.2 3.2 6.5-6.9"></path></svg>
        <span>${c.label}</span>
      </button>`,
    )}
  </div>`;
}

export const lookStyles = `
  .seg.themes { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); width: 100%; margin: 2px 0 18px; }
  .seg.themes { min-height: 50px; }
  .seg.themes button { display: flex; flex-direction: row; align-items: center; justify-content: center; gap: 7px; height: auto; min-height: 0; padding: 0 6px; font-size: 15px; }
  .seg.themes button .i { width: 18px; height: 18px; margin: 0; flex: none; }
  @media (max-width: 380px) { .seg.themes button .i { display: none; } }
  .seg.themes button.on .i { color: var(--rv-accent-ink); }
  .tag-swatches { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 4px; margin: 0 -6px 14px; }
  .tsw { --sw-bg: var(--rv-surface); position: relative; display: grid; justify-items: center; gap: 4px; padding: 8px 2px 7px; border-radius: 10px; background: var(--sw-bg); cursor: pointer; -webkit-tap-highlight-color: transparent; min-width: 0; }
  @media (hover: hover) { .tsw:hover { --sw-bg: var(--rv-surface-2); } }
  .tsw svg { width: 48px; height: 36px; overflow: visible; }
  .tsw .sw-fill { fill: var(--a); fill-rule: evenodd; stroke: color-mix(in srgb, var(--a) 80%, #000); stroke-width: 1; }
  .tsw .sw-ring, .tsw .sw-gap, .tsw .sw-check { fill: none; stroke-linejoin: round; stroke-linecap: round; visibility: hidden; }
  .tsw .sw-ring { stroke: var(--rv-text); stroke-width: 7; }
  .tsw .sw-gap { stroke: var(--sw-bg); stroke-width: 3.6; }
  .tsw .sw-check { stroke: rgba(20, 20, 20, 0.85); stroke-width: 2.4; }
  .tsw span { font-size: 13px; line-height: 1.2; color: var(--rv-muted); white-space: nowrap; letter-spacing: -0.01em; }
  @media (max-width: 420px) { .tsw span { font-size: 12px; } .tag-swatches { margin: 0 -10px 14px; gap: 2px; } }
  .tsw.on .sw-ring, .tsw.on .sw-gap, .tsw.on .sw-check { visibility: visible; }
  .tsw.on span { color: var(--rv-text); font-weight: 600; }
  .tsw:focus-visible { outline: 2px solid var(--rv-accent); outline-offset: 0; }
`;
