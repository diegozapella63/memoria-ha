/**
 * O campo fechado mostra, ao lado do título, o que está escolhido ou escrito ("Tipo · Evento"): igual no ResolvIA, na
 * CronologIA e no MemorIA (tools/iguais.py).
 *
 *   fieldValOf(field)        o texto: o equipamento escolhido (um: o nome; mais: o data-varios do campo, «Vários
 *                            equipamentos»), senão os botões marcados, senão o que foi escrito, senão as horas dos
 *                            botões de horário, senão o data-vazio do campo ("Sem prazo")
 *   paintFieldVals(root)     põe esse texto no data-val do título de cada campo que fecha (.sheet .field.dobravel);
 *                            um campo com a sua própria .fl-val (o título já diz) fica sem
 *
 * O CSS de cada app desenha o data-val depois do título, com o campo fechado:
 *   .sheet .field.dobravel.shut > .flabel[data-val]::before { content: "· " attr(data-val); order: 1; ... }
 */
const LABEL = ":scope > .flabel, :scope > .flabel-row > .flabel";
const MAX = 48;

const tidy = (t) => (t || "").replace(/\s+/g, " ").trim();
// o texto de um botão sem o que vem embaixo do nome (o horário de Manhã, uma contagem)
const SUB = "small, .pick-sub, .sub, .imp-sub, .badge, .count";
const textOf = (el) =>
  tidy([...el.childNodes].filter((n) => n.nodeType === 3 || (n.nodeType === 1 && !n.matches(SUB))).map((n) => n.textContent).join(" "));

export function fieldValOf(field) {
  // só o que é deste campo: nem o título, nem um campo dentro dele
  const own = (el) => el.closest(".field") === field && !el.closest(".flabel, .flabel-row");
  // o dono: "quando eu retraio e tem só um equipamento, coloca do lado o equipamento; senão, «Vários equipamentos»"
  const eqs = [...field.querySelectorAll(".eq-sel .eq-tx > b")].filter(own).map(textOf).filter(Boolean);
  if (eqs.length) return eqs.length === 1 ? eqs[0] : field.getAttribute("data-varios") || "Vários equipamentos";
  const picks = [...field.querySelectorAll(".on, .sel, [aria-pressed='true'], [aria-checked='true'], [aria-selected='true']")]
    .filter((b) => own(b) && b.matches("button, [role='radio'], [role='checkbox'], [role='option'], .pick, .pk, .chip, .swatch, .sw"))
    .map((b) => textOf(b) || b.getAttribute("title") || b.getAttribute("aria-label") || "")
    .concat([...field.querySelectorAll(".time-chip")].filter(own).map(textOf))
    .filter(Boolean);
  if (picks.length) return [...new Set(picks)].join(", ");
  const typed = [...field.querySelectorAll("textarea, input:not([type='checkbox']):not([type='radio']):not([type='file']):not([type='hidden']):not([type='range']), select")]
    .filter(own)
    .map((c) => (c.tagName === "SELECT" ? (c.selectedOptions[0] || {}).textContent : (c.value || "").split("\n")[0]))
    .map(tidy)
    .filter(Boolean);
  if (typed.length) return typed.join(" ");
  const hours = [...field.querySelectorAll(".pickf .pf-v")]
    .filter(own)
    .map((v) => tidy(v.textContent))
    .filter((t) => t && !/^--/.test(t))
    .join(" até ");
  return hours || field.getAttribute("data-vazio") || "";
}

export function paintFieldVals(root) {
  if (!root || !root.querySelectorAll) return;
  for (const field of root.querySelectorAll(".sheet .field.dobravel")) {
    const lab = field.querySelector(LABEL);
    if (!lab) continue;
    const v = lab.querySelector(".fl-val") ? "" : fieldValOf(field);
    const shown = v.length > MAX ? v.slice(0, MAX - 1) + "…" : v;
    if (shown) {
      if (lab.getAttribute("data-val") !== shown) lab.setAttribute("data-val", shown);
    } else if (lab.hasAttribute("data-val")) lab.removeAttribute("data-val");
  }
}
