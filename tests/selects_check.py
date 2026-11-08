# MemorIA 1.3.0 (1.4.0: in Mais › Configurações › Integrações): the boxes of choice open a sheet in the look of the app (frontend/src/selectsheet.js, the same
# file in all the apps of the family), never the window of the phone: the options in rows, the current one marked
# in the color of the app, light and dark; choosing goes into the box (the app hears change as always); the Back of
# the phone, the X and a tap outside close only the sheet. On a computer, a card in the middle; the keyboard too.
#
# Uses the preview (no server): cd frontend && npm run build, then
#   python3 tests/selects_check.py [folder for the screenshots]
import os, sys, tempfile
from pathlib import Path
from playwright.sync_api import sync_playwright

REPO = Path(__file__).resolve().parent.parent
# the preview over http (tests/visual.sh): Chromium does not always keep what a file:// page saves across a reload
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


def tap(pg, loc):
    loc.scroll_into_view_if_needed()
    bx = loc.bounding_box()
    pg.touchscreen.tap(bx["x"] + bx["width"] / 2, bx["y"] + bx["height"] / 2)
    pg.wait_for_timeout(450)


with sync_playwright() as p:
    b = p.chromium.launch()
    for scheme in ("light", "dark"):
        ctx = b.new_context(viewport={"width": 390, "height": 844}, device_scale_factor=2, color_scheme=scheme, has_touch=True, is_mobile=True)
        pg = ctx.new_page()
        errs = []
        pg.on("pageerror", lambda e: errs.append(str(e)))
        pg.goto(PREVIEW)
        pg.wait_for_timeout(1500)
        a = pg.locator("memoria-app")
        a.evaluate("(el) => el._go('/config')")
        pg.wait_for_timeout(900)
        sel = a.locator("#leitura-ia select")
        check(sel.count() == 1, f"{scheme}: IA usada pelo app")
        check(sel.evaluate("(s) => getComputedStyle(s).pointerEvents") == "none", f"{scheme}: the box never gets the tap (the window of the phone doesn't open)")
        opts = [o.strip() for o in sel.locator("option").all_inner_texts()]
        tap(pg, sel)
        sheet = pg.locator(".ss-wrap.in .ss-sheet")
        check(sheet.count() == 1, f"{scheme}: a tap opens the sheet")
        check(sheet.locator(".ss-head b").inner_text().strip() == "IA usada pelo app", f"{scheme}: its title is the name of the box")
        rows = [t.strip() for t in sheet.locator(".ss-opt").all_inner_texts()]
        check(rows == opts, f"{scheme}: the options in rows ({rows})")
        on = sheet.locator(".ss-opt.on")
        check(on.count() == 1 and on.inner_text().strip() == opts[0], f"{scheme}: the current one is marked")
        bg = sheet.evaluate("(s) => getComputedStyle(s).backgroundColor")
        check(bg == ("rgb(28, 25, 33)" if scheme == "dark" else "rgb(255, 255, 255)"), f"{scheme}: the colors of the app's own windows ({bg})")
        ck = on.locator("svg").evaluate("(s) => getComputedStyle(s).color")
        check(ck not in ("rgb(0, 0, 0)", "rgb(100, 181, 246)"), f"{scheme}: the mark in the color of the app ({ck})")
        bx = sheet.bounding_box()
        check(abs(bx["y"] + bx["height"] - 844) < 2 and bx["width"] >= 389, f"{scheme}: from the bottom, the width of the phone ({bx})")
        pg.screenshot(path=str(SHOTS / f"mmss-{scheme}.png"))
        tap(pg, sheet.locator(".ss-opt", has_text="Ollama"))
        pg.wait_for_timeout(900)
        check(pg.locator(".ss-wrap").count() == 0, f"{scheme}: choosing closes the sheet")
        check(sel.evaluate("(s) => s.value") == "ai_task.ollama_ai_task" and "Ollama" in a.locator("#leitura-ia .ai-state").inner_text(), f"{scheme}: the choice goes into the box and the app uses it")
        # Back: only the sheet
        tap(pg, sel)
        pg.go_back()
        pg.wait_for_timeout(600)
        check(pg.locator(".ss-wrap").count() == 0 and a.evaluate("(el) => el._view().name") == "config", f"{scheme}: Back closes only the sheet")
        check(sel.evaluate("(s) => s.value") == "ai_task.ollama_ai_task", f"{scheme}: Back changes nothing")
        tap(pg, sel)
        tap(pg, pg.locator(".ss-x"))
        check(pg.locator(".ss-wrap").count() == 0 and a.evaluate("(el) => el._view().name") == "config", f"{scheme}: the X closes it")
        tap(pg, sel)
        pg.touchscreen.tap(195, 60)
        pg.wait_for_timeout(450)
        check(pg.locator(".ss-wrap").count() == 0 and a.evaluate("(el) => el._view().name") == "config", f"{scheme}: a tap outside closes it")
        tap(pg, sel)
        tap(pg, pg.locator(".ss-opt").first)
        pg.wait_for_timeout(700)
        check(sel.evaluate("(s) => s.value") == "", f"{scheme}: back to the default")
        check(not errs, f"{scheme}: no page errors {errs}")
        ctx.close()
    # a computer: a card in the middle; the mouse and the keyboard
    ctx = b.new_context(viewport={"width": 1280, "height": 900})
    pg = ctx.new_page()
    errs = []
    pg.on("pageerror", lambda e: errs.append(str(e)))
    pg.goto(PREVIEW)
    pg.wait_for_timeout(1500)
    a = pg.locator("memoria-app")
    a.evaluate("(el) => el._go('/config')")
    pg.wait_for_timeout(900)
    sel = a.locator("#leitura-ia select")
    sel.scroll_into_view_if_needed()
    bx = sel.bounding_box()
    pg.mouse.click(bx["x"] + bx["width"] / 2, bx["y"] + bx["height"] / 2)
    pg.wait_for_timeout(400)
    sheet = pg.locator(".ss-wrap.in .ss-sheet")
    sb = sheet.bounding_box() if sheet.count() else None
    check(sb and abs(sb["x"] + sb["width"] / 2 - 640) < 2 and abs(sb["y"] + sb["height"] / 2 - 450) < 2 and sb["width"] <= 440, f"computer: a card in the middle ({sb})")
    pg.keyboard.press("Escape")
    pg.wait_for_timeout(500)
    check(pg.locator(".ss-wrap").count() == 0 and sel.evaluate("(s) => s.getRootNode().activeElement === s"), "computer: Esc closes it, the focus back on the box")
    pg.keyboard.press("Enter")
    pg.wait_for_timeout(400)
    pg.keyboard.press("ArrowDown")
    pg.keyboard.press("Enter")
    pg.wait_for_timeout(900)
    check(pg.locator(".ss-wrap").count() == 0 and sel.evaluate("(s) => s.selectedIndex") == 1, "computer: Enter opens, the arrows and Enter choose")
    check(not errs, f"computer: no page errors {errs}")
    ctx.close()
    b.close()

print(f"{n_ok} checks passed" if not failed else f"{len(failed)} FAILED, {n_ok} passed")
sys.exit(1 if failed else 0)
