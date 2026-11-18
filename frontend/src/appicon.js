import { html } from "../vendor/lit-all.min.js";

// O ícone do app ao lado do nome, na barra lateral do computador (o mesmo desenho do ícone do add-on: o caderno com a
// espiral, as linhas e o relógio), na cor escolhida em Mais › Configurações › Aparência. A espiral fica na cor do texto,
// para aparecer no tema escuro.
export const appIcon = () => html`<svg class="app-ic" viewBox="0 0 32 32" aria-hidden="true">
  <path d="M9.5 3h14.5a5 5 0 0 1 5 5v14.5L21.5 30H9.5a5 5 0 0 1-5-5V8a5 5 0 0 1 5-5z" fill="var(--rv-accent)" />
  <path d="M21.5 30v-5.6a1.9 1.9 0 0 1 1.9-1.9H29z" fill="#000" fill-opacity=".28" />
  <g fill="#000" fill-opacity=".55">
    <rect x="11" y="8" width="13" height="2.3" rx="1.15" /><rect x="11" y="12.8" width="10" height="2.3" rx="1.15" /><rect x="11" y="17.6" width="5" height="2.3" rx="1.15" />
  </g>
  <circle cx="20.2" cy="21" r="4.6" fill="#000" fill-opacity=".72" />
  <path d="M20.2 18.6V21h2" fill="none" stroke="var(--rv-accent)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
  <g fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
    <path d="M7.2 7.2H4.2a1.3 1.3 0 0 0 0 2.6h3" /><path d="M7.2 13.2H4.2a1.3 1.3 0 0 0 0 2.6h3" /><path d="M7.2 19.2H4.2a1.3 1.3 0 0 0 0 2.6h3" /><path d="M7.2 25.2H4.2a1.3 1.3 0 0 0 0 2.6h3" />
  </g>
</svg>`;
