// Same typography as InventarIA (Barlow / Barlow Condensed) plus Caveat for the
// handwriting on the notebook pages. Font files ship inside the app.
// @font-face does not work inside shadow roots, so it goes in document.head.
import barlow400 from "../fonts/barlow-400.woff2";
import barlow500 from "../fonts/barlow-500.woff2";
import barlow600 from "../fonts/barlow-600.woff2";
import cond500 from "../fonts/barlow-condensed-500.woff2";
import cond600 from "../fonts/barlow-condensed-600.woff2";
import cond700 from "../fonts/barlow-condensed-700.woff2";
import caveat from "../fonts/caveat-var.woff2";

const FALLBACK = `system-ui, -apple-system, "Segoe UI", Roboto, sans-serif`;
export const FONT_BODY = `"MM Barlow", ${FALLBACK}`;
export const FONT_DISPLAY = `"MM Barlow Condensed", ${FALLBACK}`;
export const FONT_HAND = `"MM Caveat", "Segoe Print", "Bradley Hand", cursive`;

export function ensureFonts() {
  if (document.getElementById("memoria-fonts")) return;
  const face = (family, src, weight) =>
    `@font-face{font-family:"${family}";src:url(${JSON.stringify(src)}) format("woff2");font-weight:${weight};font-style:normal;font-display:swap}`;
  const style = document.createElement("style");
  style.id = "memoria-fonts";
  style.textContent = [
    face("MM Barlow", barlow400, 400),
    face("MM Barlow", barlow500, 500),
    face("MM Barlow", barlow600, "600 900"),
    face("MM Barlow Condensed", cond500, 500),
    face("MM Barlow Condensed", cond600, 600),
    face("MM Barlow Condensed", cond700, "700 900"),
    face("MM Caveat", caveat, "400 700"),
  ].join("\n");
  document.head.appendChild(style);
}
