// Arrastar o dedo para o lado troca de aba, como nos apps do celular (CronologIA e ResolvIA).
// Só no celular (no computador há a barra lateral) e só fora do que já anda para o lado:
// a grade do mês, uma fileira que rola, um campo, a alça de reordenar.

const DESK = "(min-width: 1000px)";

/** Where the finger went down, or null when this touch is not for changing tabs. */
export function swipeStart(e, skip = "") {
  if (!e.touches || e.touches.length !== 1) return null;
  if (window.matchMedia && window.matchMedia(DESK).matches) return null;
  const t = e.touches[0];
  // the edges belong to the phone (Voltar) and to the menu of the Home Assistant
  if (t.clientX < 24 || t.clientX > window.innerWidth - 24) return null;
  const stop = `input, textarea, select, [contenteditable], .grip, [data-noswipe]${skip ? `, ${skip}` : ""}`;
  for (const el of e.composedPath()) {
    if (el === e.currentTarget) break;
    if (!(el instanceof Element)) continue;
    if (el.matches(stop)) return null;
    const st = getComputedStyle(el);
    if ((st.overflowX === "auto" || st.overflowX === "scroll") && el.scrollWidth > el.clientWidth + 2) return null;
  }
  return { x: t.clientX, y: t.clientY, at: Date.now() };
}

/** 1 = to the next tab (finger to the left), -1 = to the previous one, 0 = not a swipe. */
export function swipeEnd(e, s) {
  if (!s || !e.changedTouches || !e.changedTouches.length) return 0;
  const t = e.changedTouches[0];
  const dx = t.clientX - s.x;
  const dy = t.clientY - s.y;
  if (Math.abs(dx) < 70 || Math.abs(dx) < Math.abs(dy) * 2 || Date.now() - s.at > 800) return 0;
  return dx < 0 ? 1 : -1;
}

/** The new tab comes in from the side the finger went. */
export async function slideIn(host, name, dir) {
  for (let k = 0; k < 30 && host._view().name !== name; k++) await new Promise((r) => setTimeout(r, 16));
  await host.updateComplete;
  const page = host.renderRoot.querySelector("main > .page, main > section");
  if (!page || !page.animate) return;
  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  page.animate(
    [
      { opacity: 0, transform: `translateX(${dir > 0 ? 40 : -40}px)` },
      { opacity: 1, transform: "none" },
    ],
    { duration: 280, easing: "cubic-bezier(0.2, 0.8, 0.2, 1)" },
  );
}
