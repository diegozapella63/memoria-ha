# MemorIA 1.13.0: the line at the top of Agora starts with what holds now, then the next two times (past midnight
# too), never the times that already passed today first. The whole day stays in Blocos › Seu dia.
# Ana's Agora in the preview: Trabalho at 05:00 (Manhã), its sheet at 10:00, 12:00 (Tarde); Diário at 18:00 (Noite)
# and 22:00. 390 and 320 px, light and dark; the clock of the page is set by the test.
#
# Uses the preview (no server): cd frontend && npm run build, then
#   python3 tests/ordem_check.py [folder for the screenshots]
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
  for (const e of el.renderRoot.querySelectorAll(".page *")) {
    if (e.closest(".tline")) continue;
    const r = e.getBoundingClientRect();
    if (r.width && (r.right > W + 1 || r.left < -1)) bad.push(e.tagName.toLowerCase() + "." + [...e.classList].join(".") + " " + Math.round(r.left) + ".." + Math.round(r.right));
  }
  if (document.documentElement.scrollWidth > W) bad.push("page " + document.documentElement.scrollWidth);
  return bad.slice(0, 4);
}"""

CHIPS = """(el) => [...el.renderRoot.querySelectorAll('.tline .tchip')].map((c) => ({
  t: c.querySelector('b').textContent.trim(), on: c.classList.contains('on'), peek: c.classList.contains('peek'),
  left: Math.round(c.getBoundingClientRect().left) }))"""


def at(pg, a, h, m=0):
    """Sets the clock of the page and lets the app see it (the minute tick), back on Agora."""
    pg.clock.set_fixed_time(datetime(2026, 11, 8, h, m, tzinfo=BRT))
    a.evaluate("(el) => { el._tick(); el._backToNow(); el.requestUpdate(); }")
    pg.wait_for_timeout(400)


with sync_playwright() as p:
    b = p.chromium.launch()
    for scheme, w in (("light", 390), ("dark", 390), ("light", 320), ("dark", 320)):
        tag = f"{scheme} {w}px"
        ctx = b.new_context(viewport={"width": w, "height": 844}, device_scale_factor=2, color_scheme=scheme, has_touch=True, is_mobile=True, timezone_id="America/Sao_Paulo")
        pg = ctx.new_page()
        errs = []
        pg.on("pageerror", lambda e: errs.append(str(e)))
        pg.clock.set_fixed_time(datetime(2026, 11, 8, 20, 53, tzinfo=BRT))
        pg.goto(PREVIEW)
        a = pg.locator("memoria-app")
        a.locator(".page-title").first.wait_for()
        pg.wait_for_timeout(600)

        # ---- 20:53: Noite (18:00) holds; then 22:00 and, tomorrow, 05:00; not 05:00, 10:00 and 12:00 first
        chips = a.evaluate(CHIPS)
        check([c["t"] for c in chips] == ["18:00", "22:00", "05:00"], f"{tag}: 20:53: now, then the next two ({[c['t'] for c in chips]})")
        check(chips[0]["on"] and not any(c["on"] for c in chips[1:]), f"{tag}: the first one is the one of now")
        check(a.evaluate("(el) => el.renderRoot.querySelector('.tline').scrollLeft") == 0 and chips[0]["left"] >= 0, f"{tag}: the one of now is in sight, at the start ({chips[0]['left']})")
        status = " ".join(a.locator(".page .status").first.inner_text().split())
        check(status == "Noite · desde 18:00 · depois Diário às 22:00", f"{tag}: the status ({status})")
        check(a.evaluate(OVER) == [], f"{tag}: nothing out of the screen {a.evaluate(OVER)}")
        pg.screenshot(path=str(SHOTS / f"ordem-{scheme}-{w}-noite.png"))

        # ---- peeking at a next one keeps the order
        a.locator(".tline .tchip").nth(1).click()
        pg.wait_for_timeout(400)
        chips = a.evaluate(CHIPS)
        check([c["t"] for c in chips] == ["18:00", "22:00", "05:00"] and chips[1]["peek"], f"{tag}: peeking keeps the order ({chips})")
        a.locator(".now-btn").click()
        pg.wait_for_timeout(300)

        # ---- 23:10: 22:00, then tomorrow 05:00 and 10:00
        at(pg, a, 23, 10)
        check([c["t"] for c in a.evaluate(CHIPS)] == ["22:00", "05:00", "10:00"], f"{tag}: 23:10 ({[c['t'] for c in a.evaluate(CHIPS)]})")
        # ---- 03:00: 22:00 of yesterday still holds
        at(pg, a, 3)
        chips = a.evaluate(CHIPS)
        status = " ".join(a.locator(".page .status").first.inner_text().split())
        check([c["t"] for c in chips] == ["22:00", "05:00", "10:00"] and chips[0]["on"], f"{tag}: 03:00 ({[c['t'] for c in chips]})")
        check("desde ontem às 22:00" in status, f"{tag}: since yesterday ({status})")
        # ---- 13:00: Tarde, then 18:00 and 22:00
        at(pg, a, 13)
        check([c["t"] for c in a.evaluate(CHIPS)] == ["12:00", "18:00", "22:00"], f"{tag}: 13:00 ({[c['t'] for c in a.evaluate(CHIPS)]})")
        pg.screenshot(path=str(SHOTS / f"ordem-{scheme}-{w}-tarde.png"))

        # ---- the whole day is still in Blocos › Seu dia
        a.locator("nav .tab", has_text="Blocos").click()
        pg.wait_for_timeout(400)
        day = a.evaluate("(el) => [...el.renderRoot.querySelectorAll('.day-row b')].map((x) => x.textContent.trim())")
        check(day == ["05:00", "10:00", "12:00", "18:00", "22:00"], f"{tag}: Seu dia has the whole day ({day})")

        check(not errs, f"{tag}: no page errors {errs}")
        ctx.close()
    b.close()

print(f"{n_ok} checks passed" if not failed else f"{len(failed)} FAILED, {n_ok} passed")
print(f"screenshots in {SHOTS}")
sys.exit(1 if failed else 0)
