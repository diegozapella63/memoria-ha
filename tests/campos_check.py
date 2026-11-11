# MemorIA 1.21.0, the rule of the family: the text fields (Colar mensagem, the text of the review) grow by pulling the
# corner and keep the size on the device (textareas.js, the same file in every app); opened again, the field comes back
# as it was left. The sheet of the notepad (it fills the page) and the box of the Conversa (it grows by itself) stay
# out. Verificar de novo at the width of the card on the phone, 250 px on the computer. 390 px dark and 1280 px light.
#
# Uses the preview (no server): cd frontend && npm run build, then
#   python3 tests/campos_check.py [folder for the screenshots]
import os, sys, tempfile
from pathlib import Path
from playwright.sync_api import sync_playwright

REPO = Path(__file__).resolve().parent.parent
PREVIEW = os.environ.get("MEMORIA_PREVIEW_URL") or (REPO / "preview" / "memoria-preview.html").as_uri()
SHOTS = Path(sys.argv[1] if len(sys.argv) > 1 else os.environ.get("MEMORIA_SHOTS", Path(tempfile.gettempdir()) / "memoria-shots"))
SHOTS.mkdir(parents=True, exist_ok=True)
WIDTHS = """(el, s) => [...el.renderRoot.querySelectorAll(s)].map((b) => { const p = b.closest('.panel'), cs = getComputedStyle(p); return [Math.round(b.getBoundingClientRect().width), Math.round(p.getBoundingClientRect().width - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight))]; })"""
PASTE = "dialog textarea, .sheet textarea"

n_ok, failed = 0, []


def check(c, label):
    global n_ok
    print(("PASS " if c else "FAIL ") + label, flush=True)
    if c:
        n_ok += 1
    else:
        failed.append(label)


def config(a, pg):
    a.locator("nav .tab", has_text="Mais").click()
    pg.wait_for_timeout(450)
    a.locator(".more-row", has_text="Configurações").click()
    pg.wait_for_timeout(500)


def paste(a, pg):
    a.locator("nav .tab.fab").click()
    pg.wait_for_timeout(500)
    a.locator(".imp-opt", has_text="Colar mensagem").click()
    pg.wait_for_timeout(400)
    return a.locator("textarea[placeholder^='Cole aqui a mensagem']")


with sync_playwright() as p:
    b = p.chromium.launch()
    ctx = b.new_context(viewport={"width": 390, "height": 844}, device_scale_factor=2, color_scheme="dark", has_touch=True, is_mobile=True)
    pg = ctx.new_page()
    errs = []
    pg.on("pageerror", lambda e: errs.append(str(e)))
    pg.goto(PREVIEW)
    a = pg.locator("memoria-app")
    a.locator(".page-title").first.wait_for()
    pg.wait_for_timeout(500)

    # Verificar de novo at the width of the card
    config(a, pg)
    w = a.evaluate(WIDTHS, ".ai-actions .btn")
    check(w and all(abs(x - y) <= 4 for x, y in w), f"390 px: Verificar de novo at the width of the card ({w})")
    a.locator(".ai-actions .btn").first.scroll_into_view_if_needed()
    pg.screenshot(path=str(SHOTS / "campos-verificar-390.png"))

    # Colar mensagem: grows, and keeps the size
    ta = paste(a, pg)
    check(ta.evaluate("(e) => getComputedStyle(e).resize") == "vertical", "Colar mensagem: can be enlarged")
    note = " ".join(a.locator(".sheet").all_inner_texts())
    check("Você revisa" not in note and "limpa a mensagem" not in note, "Colar mensagem: no note that only takes room")
    ta.evaluate("(e) => { e.style.height = '260px'; }")
    pg.wait_for_timeout(700)
    pg.go_back()
    pg.wait_for_timeout(500)
    ta = paste(a, pg)
    h = ta.evaluate("(e) => Math.round(parseFloat(e.style.height))")
    check(h == 260, f"opened again, the size it was left ({h})")
    keys = pg.evaluate("Object.keys(localStorage).filter((k) => k.startsWith('textareas:'))")
    check(keys == ["textareas:MemorIA:Cole aqui a mensagem do WhatsApp, e-mail ou anotação…"], f"kept in the device, with the name of the app ({keys})")
    pg.go_back()
    pg.wait_for_timeout(500)

    # the sheet of the notepad fills the page: out
    a.evaluate("(el) => el._openPage('ideias00001', 'new')")
    pg.wait_for_timeout(800)
    check(a.locator("textarea.ink").evaluate("(e) => getComputedStyle(e).resize") == "none", "the sheet of the notepad stays out")
    check(not errs, f"no page errors {errs}")
    ctx.close()

    # the computer: 250 px
    pg = b.new_page(viewport={"width": 1280, "height": 900})
    pg.goto(PREVIEW)
    a = pg.locator("memoria-app")
    a.locator(".page-title").first.wait_for()
    pg.wait_for_timeout(500)
    a.evaluate("(el) => el._go('/config')")
    pg.wait_for_timeout(600)
    w = a.evaluate(WIDTHS, ".ai-actions .btn")
    check(w and all(x == 250 for x, _ in w), f"computer: Verificar de novo with 250 px ({w})")
    b.close()

print(f"{n_ok} checks passed" if not failed else f"{len(failed)} FAILED of {n_ok + len(failed)}")
print(f"screenshots in {SHOTS}")
sys.exit(1 if failed else 0)
