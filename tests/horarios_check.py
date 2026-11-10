# MemorIA 1.16.0: the times in the look of the app, never the clock of the phone (nor AM/PM):
#  - Mais › Configurações › Opções › Períodos do dia: each start is a box of choice (selectsheet.js) like the other
#    boxes of the app (height, corners, arrow), every half hour; the current one marked; choosing saves.
#  - + Horário exato (the block's sheet) and Escolher horário (the ⋯ of a sheet): the hour, then the minutes of that
#    hour, each in the sheet of the app; the X or the phone's Back adds nothing and leaves the window under it open.
#  - No native field of time or date and no <datalist> on any screen.
# 390 and 320 px, light and dark.
#
# Uses the preview (no server): cd frontend && npm run build, then
#   python3 tests/horarios_check.py [folder for the screenshots]
import os, re, sys, tempfile
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
    pg.wait_for_timeout(500)


OVER = """(el) => {
  const W = window.innerWidth, bad = [];
  for (const e of el.renderRoot.querySelectorAll(".page *, .sheet *")) {
    if (e.closest(".cat-filter, .who-filter, .more-tabs, .tline")) continue;
    const r = e.getBoundingClientRect();
    if (r.width && (r.right > W + 1 || r.left < -1)) bad.push(e.tagName.toLowerCase() + "." + [...e.classList].join(".") + " " + Math.round(r.left) + ".." + Math.round(r.right));
  }
  if (document.documentElement.scrollWidth > W) bad.push("page " + document.documentElement.scrollWidth);
  return bad.slice(0, 4);
}"""

# what the phone would open by itself: a field of time or date, a <datalist> (or a field tied to one)
NATIVE = """(el) => [...el.renderRoot.querySelectorAll('input[type=time], input[type=date], input[type=datetime-local], input[type=month], input[type=week], datalist, input[list]')].map((e) => e.outerHTML.slice(0, 80))"""

BOX = """(s) => { const c = getComputedStyle(s); return { h: Math.round(s.getBoundingClientRect().height), r: c.borderTopLeftRadius, b: c.borderTopWidth, img: c.backgroundImage.includes('gradient'), fs: c.fontSize, pe: c.pointerEvents }; }"""


def sheet_rows(pg):
    return [t.strip() for t in pg.locator(".ss-wrap.in .ss-opt").all_inner_texts()]


with sync_playwright() as p:
    b = p.chromium.launch()
    for scheme, w in (("light", 390), ("dark", 390), ("light", 320), ("dark", 320)):
        tag = f"{scheme} {w}px"
        ctx = b.new_context(viewport={"width": w, "height": 844}, device_scale_factor=2, color_scheme=scheme, has_touch=True, is_mobile=True)
        pg = ctx.new_page()
        errs = []
        pg.on("pageerror", lambda e: errs.append(str(e)))
        pg.goto(PREVIEW)
        a = pg.locator("memoria-app")
        a.locator(".page-title").first.wait_for()
        pg.wait_for_timeout(500)
        natives = []

        # ---- the other boxes of the app (IA usada pelo app), to compare
        a.evaluate("(el) => el._go('/config')")
        pg.wait_for_timeout(700)
        natives += a.evaluate(NATIVE)
        other = a.locator("#leitura-ia select").evaluate(BOX)

        # ---- Opções › Períodos do dia
        a.evaluate("(el) => el._go('/config/opcoes')")
        pg.wait_for_timeout(700)
        natives += a.evaluate(NATIVE)
        boxes = a.locator("#periodos select")
        check(boxes.count() == 3, f"{tag}: Manhã, Tarde and Noite in boxes of choice")
        shown = [s.strip() for s in boxes.evaluate_all("(els) => els.map((s) => s.selectedOptions[0].textContent)")]
        check(shown == ["05:00", "12:00", "18:00"], f"{tag}: 24 h, no AM/PM ({shown})")
        look = boxes.nth(0).evaluate(BOX)
        check(look["pe"] == "none", f"{tag}: the box never gets the tap (the clock of the phone doesn't open)")
        check({k: look[k] for k in ("h", "r", "b", "img", "fs")} == {k: other[k] for k in ("h", "r", "b", "img", "fs")}, f"{tag}: closed, like the other boxes: height, corners, border, arrow, letter ({look} / {other})")
        bx = boxes.nth(2).bounding_box()
        check(bx["x"] + bx["width"] <= w - 16, f"{tag}: the box inside the card ({bx})")
        a.locator("#periodos").scroll_into_view_if_needed()
        check(a.evaluate(OVER) == [], f"{tag}: nothing out of the screen {a.evaluate(OVER)}")
        pg.screenshot(path=str(SHOTS / f"horarios-{scheme}-{w}-periodos.png"))
        tap(pg, boxes.nth(2))
        check(pg.locator(".ss-wrap.in .ss-head b").inner_text().strip() == "Começo da Noite", f"{tag}: the sheet of the app, Começo da Noite")
        rows = sheet_rows(pg)
        check(len(rows) == 48 and rows[0] == "00:00" and rows[-1] == "23:30" and all(re.fullmatch(r"\d\d:\d\d", r) for r in rows), f"{tag}: every half hour, 24 h ({rows[:3]}…{rows[-2:]})")
        on = pg.locator(".ss-wrap.in .ss-opt.on")
        check(on.count() == 1 and on.inner_text().strip() == "18:00", f"{tag}: the current one marked")
        pg.screenshot(path=str(SHOTS / f"horarios-{scheme}-{w}-periodos-janela.png"))
        tap(pg, pg.locator(".ss-wrap.in .ss-opt", has_text="19:30"))
        pg.wait_for_timeout(500)
        check(a.evaluate("(el) => el._data.periods.noite") == "19:30", f"{tag}: choosing saves (Noite at 19:30)")
        check(boxes.nth(2).evaluate("(s) => s.value") == "19:30" and a.evaluate("(el) => el._view().name") == "config", f"{tag}: the box says it, the screen stays")

        # ---- + Horário exato in the block's sheet: the hour, then the minutes
        a.evaluate("(el) => { el._go('/blocos'); el._openBlockSheet(el._block('ideias00001')); }")
        pg.wait_for_timeout(800)
        natives += a.evaluate(NATIVE)
        add = a.locator(".sheet .add-time")
        check(add.count() == 1 and add.inner_text().strip() == "Horário exato", f"{tag}: Horário exato in the block's sheet")
        tap(pg, add)
        check(pg.locator(".ss-wrap.in .ss-head b").inner_text().strip() == "Hora", f"{tag}: first the hour")
        rows = sheet_rows(pg)
        check(rows == [f"{h:02d}h" for h in range(24)], f"{tag}: 00h to 23h ({rows[:2]}…)")
        check(pg.locator(".ss-wrap.in .ss-opt.on").count() == 0, f"{tag}: none marked (any one counts)")
        pg.screenshot(path=str(SHOTS / f"horarios-{scheme}-{w}-hora.png"))
        tap(pg, pg.locator(".ss-wrap.in .ss-opt", has_text="21h"))
        pg.wait_for_timeout(400)
        check(pg.locator(".ss-wrap.in .ss-head b").inner_text().strip() == "Minutos", f"{tag}: then the minutes")
        rows = sheet_rows(pg)
        check(rows == [f"21:{m:02d}" for m in range(0, 60, 5)], f"{tag}: the minutes of 21h, every 5 ({rows[:2]}…)")
        pg.screenshot(path=str(SHOTS / f"horarios-{scheme}-{w}-minutos.png"))
        tap(pg, pg.locator(".ss-wrap.in .ss-opt", has_text="21:15"))
        pg.wait_for_timeout(400)
        check(pg.locator(".ss-wrap").count() == 0 and a.evaluate("(el) => el._sheet") == "block", f"{tag}: back to the block's sheet")
        chips = [t.strip() for t in a.locator(".sheet .time-chip").all_inner_texts()]
        check(chips == ["21:15"] and a.evaluate("(el) => el._form.times") == ["21:15"], f"{tag}: 21:15 in the block ({chips})")
        check(a.locator(".sheet .add-time").inner_text().strip() == "Outro horário", f"{tag}: Outro horário")
        # the X in the minutes: nothing added, the block's sheet stays
        tap(pg, a.locator(".sheet .add-time"))
        tap(pg, pg.locator(".ss-wrap.in .ss-opt", has_text="06h"))
        pg.wait_for_timeout(400)
        tap(pg, pg.locator(".ss-wrap.in .ss-x"))
        pg.wait_for_timeout(300)
        check(pg.locator(".ss-wrap").count() == 0 and a.evaluate("(el) => [el._sheet, el._form.times]") == ["block", ["21:15"]], f"{tag}: X adds nothing, the sheet stays")
        # the phone's Back in the hour: only that closes
        tap(pg, a.locator(".sheet .add-time"))
        pg.go_back()
        pg.wait_for_timeout(500)
        check(pg.locator(".ss-wrap").count() == 0 and a.evaluate("(el) => [el._sheet, el._form.times]") == ["block", ["21:15"]], f"{tag}: Back closes only the hour")
        # again after the X: any hour counts (06 again too)
        tap(pg, a.locator(".sheet .add-time"))
        tap(pg, pg.locator(".ss-wrap.in .ss-opt", has_text="06h"))
        pg.wait_for_timeout(400)
        tap(pg, pg.locator(".ss-wrap.in .ss-opt", has_text="06:30"))
        pg.wait_for_timeout(400)
        check(a.evaluate("(el) => el._form.times") == ["06:30", "21:15"], f"{tag}: the same hour again counts; in order")
        if w == 320:
            check(a.evaluate(OVER) == [], f"{tag}: nothing out of the screen in the sheet {a.evaluate(OVER)}")
        a.locator(".sheet .time-list").scroll_into_view_if_needed()
        pg.screenshot(path=str(SHOTS / f"horarios-{scheme}-{w}-bloco.png"))
        tap(pg, a.locator(".sheet .sheet-actions .btn.primary"))
        pg.wait_for_timeout(600)
        check(a.evaluate("(el) => el._block('ideias00001').times") == ["06:30", "21:15"], f"{tag}: saved with the block")

        # ---- Escolher horário in the ⋯ of a sheet
        a.evaluate("(el) => el._openPage('ideias00001')")
        pg.wait_for_timeout(800)
        a.evaluate("(el) => el._openPageMenu()")
        pg.wait_for_timeout(600)
        natives += a.evaluate(NATIVE)
        add = a.locator(".sheet .add-time")
        check(add.count() == 1 and add.inner_text().strip() == "Escolher horário", f"{tag}: Escolher horário in the ⋯ of the sheet")
        tap(pg, add)
        tap(pg, pg.locator(".ss-wrap.in .ss-opt", has_text="10h"))
        pg.wait_for_timeout(400)
        tap(pg, pg.locator(".ss-wrap.in .ss-opt", has_text="10:45"))
        pg.wait_for_timeout(600)
        page = a.evaluate("(el) => el._page(el._form.page).times")
        check(page == ["10:45"] and a.evaluate("(el) => el._sheet") == "pagemenu", f"{tag}: the sheet at 10:45 ({page})")
        pg.screenshot(path=str(SHOTS / f"horarios-{scheme}-{w}-folha.png"))

        # ---- the other screens: nothing native
        for path in ("/", "/blocos", "/buscar", "/mais", "/categorias", "/config/dados", "/config/aparencia", "/sobre"):
            a.evaluate("(el, p) => { el._closeSheet && el._closeSheet(); return el._go(p); }", path)
            pg.wait_for_timeout(400)
            natives += a.evaluate(NATIVE)
        a.evaluate("(el) => el._openSheet('new', {})")
        pg.wait_for_timeout(400)
        natives += a.evaluate(NATIVE)
        check(natives == [], f"{tag}: no field of time or date, no <datalist> ({natives[:3]})")
        check(not errs, f"{tag}: no page errors {errs}")
        ctx.close()
    b.close()

print(f"{n_ok} checks passed" if not failed else f"{len(failed)} FAILED, {n_ok} passed")
print(f"screenshots in {SHOTS}")
sys.exit(1 if failed else 0)
