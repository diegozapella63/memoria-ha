# MemorIA 1.23.0, the pattern of the family: an icon in everything (the title of each screen and each window, each
# option, each field of a window, each button with words), no line between the options of a section, what depends on
# a switch in a box under it (the AI under Usar IA, the last use under the CorrerIA), the arrow on the tabs that don't
# fit, and every section folds with a tap on its heading, kept on the device. 390 and 320 px, light and dark.
#
# Uses the preview (no server): cd frontend && npm run build, then
#   tests/e2e/run.sh secoes        (served over http: the closed sections are kept across a reload)
import os, sys, tempfile
from pathlib import Path
from playwright.sync_api import sync_playwright

REPO = Path(__file__).resolve().parent.parent
PREVIEW = os.environ.get("MEMORIA_PREVIEW_URL") or (REPO / "preview" / "memoria-preview.html").as_uri()
SHOTS = Path(sys.argv[1] if len(sys.argv) > 1 else os.environ.get("MEMORIA_SHOTS", Path(tempfile.gettempdir()) / "memoria-shots"))
SHOTS.mkdir(parents=True, exist_ok=True)

n_ok, failed = 0, []


def check(c, label):
    global n_ok
    print(("PASS " if c else "FAIL ") + label, flush=True)
    if c:
        n_ok += 1
    else:
        failed.append(label)


# what has words and no icon: buttons, the titles of the options and of the fields, the screen and the window
NO_ICON = """(el) => {
  const root = el.renderRoot, out = [];
  const vis = (e) => e.getClientRects().length && getComputedStyle(e).visibility !== 'hidden';
  for (const b of root.querySelectorAll('button')) {
    if (!vis(b) || b.closest('.day-row, .block-row, .row, .cover, .shelf, .leaf, .pad, .uso-chart, .swatches, .tags, .sw-paper, .now-pick, .cat-pick .pick.list, .cat-filter .pick.list')) continue;
    const t = b.textContent.trim().replace(/\\s+/g, ' ');
    if (t && !b.querySelector('svg, img, .dot, .sw-paper')) out.push('botão: ' + t.slice(0, 30));
  }
  for (const l of root.querySelectorAll('.panel .row .label, .flabel')) if (vis(l) && !l.closest('.row:has(> .tile)') && !l.querySelector('svg')) out.push('título: ' + l.textContent.trim().slice(0, 30));
  for (const h of root.querySelectorAll('.page-title, .sheet-head h3')) if (vis(h) && !h.querySelector('svg')) out.push('janela: ' + h.textContent.trim());
  return [...new Set(out)];
}"""

with sync_playwright() as p:
    b = p.chromium.launch()
    for scheme, w in (("dark", 390), ("light", 320)):
        tag = f"{scheme} {w}px"
        ctx = b.new_context(viewport={"width": w, "height": 844}, device_scale_factor=2, color_scheme=scheme, has_touch=True, is_mobile=True)
        pg = ctx.new_page()
        errs = []
        pg.on("pageerror", lambda e: errs.append(str(e)))
        pg.goto(PREVIEW)
        a = pg.locator("memoria-app")
        a.locator(".page-title").first.wait_for()
        go = lambda path: (a.evaluate("(el, p) => el._go(p)", path), pg.wait_for_timeout(450))

        # ---- icons on every screen
        for path in ("", "/blocos", "/buscar", "/mais", "/categorias", "/config", "/config/dados", "/config/aparencia", "/config/opcoes", "/sobre"):
            go(path)
            miss = a.evaluate(NO_ICON)
            check(not miss, f"{tag} {path or '/'}: an icon on every title and button {miss[:4]}")
        # ---- the windows: Novo bloco, Nova (the choice and Colar mensagem), Ajustes do bloco, a confirmation
        go("/blocos")
        a.evaluate("(el) => el._openBlockSheet()")
        pg.wait_for_timeout(400)
        miss = a.evaluate(NO_ICON)
        check(a.locator(".sheet-head h3 svg.sh-ic").count() == 1 and not miss, f"{tag}: Novo bloco: the title, the fields and Criar bloco with icons {miss[:4]}")
        a.evaluate("(el) => el._closeSheet()")
        pg.wait_for_timeout(300)
        a.evaluate("(el) => el._openNew()")
        pg.wait_for_timeout(400)
        miss = a.evaluate(NO_ICON)
        check(a.locator(".sheet-head h3 svg.sh-ic").count() == 1 and not miss, f"{tag}: Nova folha with icons {miss[:4]}")
        a.evaluate("(el) => el._closeSheet()")
        pg.wait_for_timeout(300)
        a.evaluate("(el) => el._openSheet('confirm', { title: 'Apagar bloco?', text: 'x', label: 'Apagar bloco', danger: true, run: () => el._closeSheet() })")
        pg.wait_for_timeout(300)
        icons = a.evaluate("(el) => [...el.renderRoot.querySelectorAll('.sheet .sh-ic, .sheet .sheet-actions .btn svg')].length")
        check(icons == 3, f"{tag}: a confirmation: the icon on the title, on Cancelar and on Apagar ({icons})")
        a.evaluate("(el) => el._closeSheet()")
        pg.wait_for_timeout(300)

        # ---- Integrações: no line between the options; the AI and the CorrerIA in a box under the switch
        go("/config")
        lines = a.evaluate("(el) => [...el.renderRoot.querySelectorAll('.panel > .row')].filter((r) => !r.querySelector(':scope > .tile') && parseFloat(getComputedStyle(r).borderTopWidth) > 0).length")
        check(lines == 0, f"{tag}: no line between the options ({lines})")
        check(a.locator("#leitura-ia > .sub-op > .sub-box .ai-state").count() == 1 and a.locator("#leitura-ia .sub-box select").count() == 1 and a.locator("#leitura-ia .sub-box .ai-actions .btn").count() == 1, f"{tag}: the state, the choice and Verificar de novo of the AI in the box under Usar IA")
        check(a.locator("#leitura-ia .field-hint").count() == 0, f"{tag}: without the note about Padrão do Home Assistant")
        sw = a.locator("#correria input[role=switch]")
        if not sw.is_checked():
            sw.click()
            pg.wait_for_timeout(400)
        check(a.locator("#correria > .sub-op > .sub-box .correria-uso").count() == 1, f"{tag}: the last use of the CorrerIA in the box under the switch")
        sw.click()
        pg.wait_for_timeout(300)

        # ---- the tabs: at 320 px they don't fit, the arrow at the end
        cls = a.evaluate("(el) => el.renderRoot.querySelector('.tabs-wrap').className")
        fits = a.evaluate("(el) => { const t = el.renderRoot.querySelector('.more-tabs'); return t.scrollWidth <= t.clientWidth + 2 }")
        check(("tem-dir" in cls) == (not fits), f"{tag}: the arrow only when the tabs don't fit ({cls}, fits {fits})")

        # ---- folding: Falar closes with a tap on its heading, and stays closed after opening the app again
        heads = a.evaluate("(el) => [...el.renderRoot.querySelectorAll('.panel > .mais-head')].map((h) => [h.getAttribute('role'), h.getAttribute('aria-expanded'), getComputedStyle(h, '::after').width])")
        check(heads and all(h == ["button", "true", "20px"] for h in heads), f"{tag}: every section with the arrow, open ({len(heads)})")
        card = a.locator("#leitura-ia")
        h0 = card.bounding_box()["height"]
        card.locator(":scope > .mais-head").click()
        pg.wait_for_timeout(300)
        h1 = card.bounding_box()["height"]
        check(card.locator(":scope > .mais-head").get_attribute("aria-expanded") == "false" and not card.locator(".sub-box").is_visible() and h1 < h0 - 40, f"{tag}: a tap closes IA do Home Assistant ({h0:.0f} → {h1:.0f})")
        if w == 390:
            pg.screenshot(path=str(SHOTS / f"secoes-fechada-{scheme}.png"))
        pg.reload()
        a.locator(".page-title").first.wait_for()
        go("/config")
        if os.environ.get("MEMORIA_PREVIEW_URL"):
            check(a.locator("#leitura-ia > .mais-head").get_attribute("aria-expanded") == "false", f"{tag}: still closed after opening the app again")
        a.evaluate("(el) => el._fechadas = null")
        a.evaluate("(el) => { el._fechadas = new Set(['leitura-ia']); el.requestUpdate() }")
        pg.wait_for_timeout(200)
        a.locator("#leitura-ia > .mais-head").focus()
        pg.keyboard.press("Enter")
        pg.wait_for_timeout(300)
        check(a.locator("#leitura-ia > .mais-head").get_attribute("aria-expanded") == "true" and a.locator("#leitura-ia .sub-box").is_visible(), f"{tag}: Enter on the heading opens it again")
        check(pg.evaluate("() => localStorage.getItem('memoria-fechadas')") == "[]", f"{tag}: open again, nothing kept")
        check(not errs, f"{tag}: no page errors {errs[:3]}")
        ctx.close()
    b.close()

print(f"{n_ok} checks passed" if not failed else f"{len(failed)} FAILED, {n_ok} passed")
sys.exit(1 if failed else 0)
