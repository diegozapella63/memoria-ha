# MemorIA 1.20.0: Mais › Configurações › Opções › Atalho no celular. The path of the panel (/app/<slug>) with Copiar,
# and the steps of the Home Assistant app (Gerenciar atalhos › Atalho fixado › Painel). Outside Home Assistant (the
# preview as it is) no card; ?atalho= gives the preview a path. 390 and 320 px, light and dark.
#
# Uses the preview (no server): cd frontend && npm run build, then
#   python3 tests/atalho_check.py [folder for the screenshots]
import os, sys, tempfile
from pathlib import Path
from playwright.sync_api import sync_playwright

REPO = Path(__file__).resolve().parent.parent
PREVIEW = os.environ.get("MEMORIA_PREVIEW_URL") or (REPO / "preview" / "memoria-preview.html").as_uri()
SHOTS = Path(sys.argv[1] if len(sys.argv) > 1 else os.environ.get("MEMORIA_SHOTS", Path(tempfile.gettempdir()) / "memoria-shots"))
SHOTS.mkdir(parents=True, exist_ok=True)
PATH = "/app/a1b2c3d4_memoria"

n_ok, failed = 0, []


def check(c, label):
    global n_ok
    print(("PASS " if c else "FAIL ") + label, flush=True)
    if c:
        n_ok += 1
    else:
        failed.append(label)


def options(a, pg):
    a.locator("nav .tab", has_text="Mais").click()
    pg.wait_for_timeout(450)
    a.locator(".more-row", has_text="Configurações").click()
    pg.wait_for_timeout(400)
    a.locator(".more-tabs button", has_text="Opções").click()
    pg.wait_for_timeout(400)


with sync_playwright() as p:
    b = p.chromium.launch()
    # outside Home Assistant: no card
    pg = b.new_page(viewport={"width": 390, "height": 844})
    pg.goto(PREVIEW)
    a = pg.locator("memoria-app")
    a.locator(".page-title").first.wait_for()
    options(a, pg)
    check(a.locator("#atalho").count() == 0, "outside Home Assistant: no Atalho no celular")
    pg.close()
    for scheme, w in (("dark", 390), ("light", 320)):
        tag = f"{scheme} {w}px"
        ctx = b.new_context(viewport={"width": w, "height": 844}, device_scale_factor=2, color_scheme=scheme, has_touch=True, is_mobile=True)
        pg = ctx.new_page()
        errs = []
        pg.on("pageerror", lambda e: errs.append(str(e)))
        pg.goto(f"{PREVIEW}?atalho={PATH}")
        a = pg.locator("memoria-app")
        a.locator(".page-title").first.wait_for()
        pg.wait_for_timeout(500)
        options(a, pg)
        card = a.locator("#atalho")
        check(card.count() == 1, f"{tag}: Atalho no celular in Opções")
        ids = a.evaluate("(el) => [...el.renderRoot.querySelectorAll('section.page .panel')].map((x) => x.id)")
        check(ids and ids[-1] == "atalho", f"{tag}: the last one ({ids})")
        txt = " ".join(card.inner_text().split())
        check("abre o MemorIA direto" in txt and "Configurações › Aplicativo complementar › Gerenciar atalhos" in txt and "Atalho fixado" in txt and "Painel" in txt,
              f"{tag}: the steps of the Home Assistant app ({txt[:140]})")
        inp = card.locator("#mm-atalho")
        check(inp.input_value() == PATH, f"{tag}: the path")
        card.scroll_into_view_if_needed()
        bi, bb = inp.bounding_box(), card.get_by_role("button", name="Copiar").bounding_box()
        check(bb["y"] > bi["y"] + bi["height"] - 1 and abs(bb["width"] - bi["width"]) < 2, f"{tag}: Copiar under the path, as wide")
        check(inp.evaluate("(e) => e.scrollWidth <= e.clientWidth"), f"{tag}: the whole path in sight (not cut)")
        check(pg.evaluate("document.documentElement.scrollWidth <= innerWidth"), f"{tag}: nothing wider than the screen")
        card.get_by_role("button", name="Copiar").click()
        pg.wait_for_timeout(400)
        check(a.evaluate("(el) => el.renderRoot.activeElement && el.renderRoot.activeElement.id") == "mm-atalho"
              or "copiado" in (a.locator(".toast").first.inner_text() if a.locator(".toast").count() else ""), f"{tag}: Copiar copies or leaves the path selected")
        card.screenshot(path=str(SHOTS / f"atalho-{scheme}-{w}.png"))
        check(not errs, f"{tag}: no page errors {errs}")
        ctx.close()
    b.close()

print(f"{n_ok} checks passed" + (f", FAILED: {failed}" if failed else ""))
sys.exit(1 if failed else 0)
