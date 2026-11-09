# MemorIA 1.14.0: Fica no Agora and the marks of the Agora, in the preview (Ana; the clock of the page set by the test).
#  - a sheet with a time (Diário, 22:00) gets "Fica no Agora: 1 h" in its menu (⋯): at 22:30 the status says until 23:00;
#    at 23:10 the Agora has nothing ("Nada agora", the next times to peek), not the sheet of 22:00 until the morning;
#  - ticking a box in the Agora is only for this time of the sheet: the text doesn't change (Blocos shows it unticked),
#    and the next day at 22:00 it starts clean.
# 390 and 320 px, light and dark.
#
# Uses the preview (no server): cd frontend && npm run build, then
#   python3 tests/tempo_check.py [folder for the screenshots]
import os, sys, tempfile
from datetime import datetime, timedelta, timezone
from pathlib import Path
from playwright.sync_api import sync_playwright

REPO = Path(__file__).resolve().parent.parent
PREVIEW = os.environ.get("MEMORIA_PREVIEW_URL") or (REPO / "preview" / "memoria-preview.html").as_uri()
SHOTS = Path(sys.argv[1] if len(sys.argv) > 1 else os.environ.get("MEMORIA_SHOTS", Path(tempfile.gettempdir()) / "memoria-shots"))
SHOTS.mkdir(parents=True, exist_ok=True)
BRT = timezone(timedelta(hours=-3))

n_ok, failed = 0, []


def check(c, label):
    global n_ok
    print(("PASS " if c else "FAIL ") + label, flush=True)
    if c:
        n_ok += 1
    else:
        failed.append(label)


OVER = """(el) => {
  const W = window.innerWidth, bad = [];
  for (const e of el.renderRoot.querySelectorAll(".page *, .sheet *")) {
    if (e.closest(".tline")) continue;
    const r = e.getBoundingClientRect();
    if (r.width && (r.right > W + 1 || r.left < -1)) bad.push(e.tagName.toLowerCase() + "." + [...e.classList].join(".") + " " + Math.round(r.left) + ".." + Math.round(r.right));
  }
  if (document.documentElement.scrollWidth > W) bad.push("page " + document.documentElement.scrollWidth);
  return bad.slice(0, 4);
}"""
CHIPS = "(el) => [...el.renderRoot.querySelectorAll('.tline .tchip')].map((c) => c.querySelector('b').textContent.trim() + (c.classList.contains('on') ? '*' : ''))"
CHECKED = "(el) => [...el.renderRoot.querySelectorAll('.page .ink-view .chk')].map((c) => c.getAttribute('aria-checked'))"


def status(a):
    return " ".join(a.locator(".page .status").first.inner_text().split())


with sync_playwright() as p:
    b = p.chromium.launch()
    for scheme, w in (("dark", 390), ("light", 320)):
        tag = f"{scheme} {w}px"
        ctx = b.new_context(viewport={"width": w, "height": 844}, device_scale_factor=2, color_scheme=scheme, has_touch=True, is_mobile=True, timezone_id="America/Sao_Paulo")
        pg = ctx.new_page()
        errs = []
        pg.on("pageerror", lambda e: errs.append(str(e)))

        def at(d, h, m=0):
            pg.clock.set_fixed_time(datetime(2026, 11, d, h, m, tzinfo=BRT))
            a.evaluate("(el) => { el._tick(); el._backToNow(); el.requestUpdate(); }")
            pg.wait_for_timeout(400)

        pg.clock.set_fixed_time(datetime(2026, 11, 9, 22, 30, tzinfo=BRT))
        pg.goto(PREVIEW)
        a = pg.locator("memoria-app")
        a.locator(".page-title").first.wait_for()
        pg.wait_for_timeout(500)
        # Ana's Diário (Noite, 18:00) gets a sheet of its own at 22:00, with boxes (and the block, no 22:00 of its own)
        pid = a.evaluate("""async (el) => {
          const b = el._data.blocks.find((x) => x.name === 'Diário');
          el._onEvent({ kind: 'block', block: await el.api.saveBlock({ id: b.id, times: [] }) });
          const p = await el.api.savePage({ block: b.id, text: 'Janta\\n☐ Arroz\\n☐ Feijão', times: ['22:00'] });
          return p.id; }""")
        at(9, 22, 30)
        check(a.locator(".page .ink-view").count() == 1 and "Janta" in a.locator(".page .ink-view").inner_text(), f"{tag}: 22:30: the sheet of 22:00 in the Agora")

        # ---- Fica no Agora: 1 h, in the menu of the sheet
        a.locator('.leaf-top [aria-label="Opções da folha"]').click()
        a.locator(".dur-pick").wait_for()
        opts = a.evaluate("(el) => [...el.renderRoot.querySelectorAll('.dur-pick .pick')].map((b) => b.textContent.trim())")
        check(opts == ["Até o próximo", "1 h", "2 h", "3 h", "4 h", "6 h", "8 h"], f"{tag}: the choices ({opts})")
        check(a.evaluate("(el) => el.renderRoot.querySelector('.dur-pick .pick.on').textContent.trim()") == "Até o próximo", f"{tag}: starts on Até o próximo")
        cut = a.evaluate("(el) => [...el.renderRoot.querySelectorAll('.dur-pick .pick')].filter((b) => b.scrollWidth > b.clientWidth + 1).map((b) => b.textContent.trim())")
        check(cut == [], f"{tag}: nothing cut {cut}")
        check(a.evaluate(OVER) == [], f"{tag}: the menu inside the screen {a.evaluate(OVER)}")
        a.locator(".dur-pick .pick", has_text="1 h").click()
        pg.wait_for_timeout(400)
        check(a.evaluate(f"(el) => el._data.pages.find((p) => p.id === '{pid}').dur") == 60, f"{tag}: saved (1 h)")
        pg.screenshot(path=str(SHOTS / f"tempo-{scheme}-{w}-menu.png"))
        pg.keyboard.press("Escape")
        a.evaluate("(el) => el._closeSheet()")
        pg.wait_for_timeout(500)
        at(9, 22, 30)
        check("desde 22:00 até 23:00" in status(a), f"{tag}: the status says until when ({status(a)})")

        # ---- the marks of the Agora: only for this time; the text stays
        a.locator(".page .ink-view .chk").first.click()
        pg.wait_for_timeout(400)
        check(a.evaluate(CHECKED) == ["true", "false"], f"{tag}: ticked in the Agora ({a.evaluate(CHECKED)})")
        text = a.evaluate(f"(el) => el._data.pages.find((p) => p.id === '{pid}').text")
        check(text == "Janta\n☐ Arroz\n☐ Feijão", f"{tag}: the text of the sheet doesn't change ({text!r})")
        check(a.evaluate(f"(el) => el._data.marks['{pid}'].at") == "2026-11-09T22:00", f"{tag}: kept for 22:00 of today")
        pg.screenshot(path=str(SHOTS / f"tempo-{scheme}-{w}-marcado.png"))
        a.evaluate(f"(el) => {{ const p = el._data.pages.find((x) => x.id === '{pid}'); el._openAt = {{ block: p.block, page: p.id }}; el._go('/bloco/' + p.block); }}")
        pg.wait_for_timeout(500)
        check(a.evaluate(CHECKED) == ["false", "false"], f"{tag}: in Blocos, the sheet as it is ({a.evaluate(CHECKED)})")
        a.locator("nav .tab", has_text="Agora").click()
        pg.wait_for_timeout(500)
        check(a.evaluate(CHECKED) == ["true", "false"], f"{tag}: back in the Agora, still ticked")

        # ---- 23:10: over; nothing now, not the sheet of 22:00 until the morning
        at(9, 23, 10)
        check(a.locator(".now-idle h3").count() == 1 and a.locator(".now-idle h3").inner_text().strip() == "Nada agora", f"{tag}: 23:10: Nada agora")
        check(status(a) == "Noite · nada agora · depois Trabalho às 05:00", f"{tag}: the status ({status(a)})")
        chips = a.evaluate(CHIPS)
        check(chips == ["05:00", "10:00", "12:00"], f"{tag}: the next times, none on ({chips})")
        check(a.evaluate(OVER) == [], f"{tag}: Nada agora inside the screen {a.evaluate(OVER)}")
        pg.screenshot(path=str(SHOTS / f"tempo-{scheme}-{w}-nada.png"))
        at(10, 6, 52)
        check(a.locator(".now-idle").count() == 0 and "Trabalho" in a.locator(".page .page-title").first.inner_text(), f"{tag}: 06:52: Trabalho (Manhã), not the sheet of 22:00")
        at(10, 4, 0)
        check(a.locator(".now-idle").count() == 1, f"{tag}: 04:00: still nothing (the 22:00 of yesterday is over)")
        a.locator(".tline .tchip").first.click()
        pg.wait_for_timeout(400)
        check(status(a).startswith("Espiando 05:00"), f"{tag}: a time to peek at ({status(a)})")
        a.locator(".now-btn").click()
        pg.wait_for_timeout(400)
        check(a.locator(".now-idle").count() == 1, f"{tag}: Voltar para agora: nothing now")

        # ---- the next day at 22:00: the sheet again, clean
        at(10, 22, 20)
        check(a.evaluate(CHECKED) == ["false", "false"], f"{tag}: the next day, clean ({a.evaluate(CHECKED)})")
        check(not errs, f"{tag}: no page errors {errs}")
        ctx.close()
    b.close()

print(f"{n_ok} checks passed" if not failed else f"{len(failed)} FAILED, {n_ok} passed")
print(f"screenshots in {SHOTS}")
sys.exit(1 if failed else 0)
