# MemorIA 1.19.0: one height, the same in every app of the family (50 px): the buttons, the fields, the boxes of
# choice and the choices in buttons (the tabs of Configurações, Tema, the times of now) in the four tabs of
# Configurações and in Adicionar, on the phone (390 and 320 px) and on the computer. Out of it: the buttons with only
# an icon, the tiles and the options of the AI, the rows of the lists, the switches and the colors.
#
# Uses the preview (no server): cd frontend && npm run build, then
#   python3 tests/alturas_check.py [folder for the screenshots]
import os, sys, tempfile
from pathlib import Path
from playwright.sync_api import sync_playwright

REPO = Path(__file__).resolve().parent.parent
PREVIEW = os.environ.get("MEMORIA_PREVIEW_URL") or (REPO / "preview" / "memoria-preview.html").as_uri()
SHOTS = Path(sys.argv[1] if len(sys.argv) > 1 else os.environ.get("MEMORIA_SHOTS", Path(tempfile.gettempdir()) / "memoria-shots"))
SHOTS.mkdir(parents=True, exist_ok=True)
H = 50
CONTROLS = ".btn, .select, .seg, .pick, .field input[type=text], .search-box, .quick form, .tchip, .new-strip button"
MEASURE = """(sel) => { const out = [];
  const walk = (root) => { root.querySelectorAll(sel).forEach((e) => { const r = e.getBoundingClientRect();
      if (r.width > 4 && e.offsetHeight && getComputedStyle(e).visibility !== 'hidden' && !e.closest('.imp-tiles, .imp-options')) out.push([e.offsetHeight, e.className + ' ' + (e.textContent || e.placeholder || '').replace(/\\s+/g, ' ').trim().slice(0, 30)]); });
    root.querySelectorAll('*').forEach((e) => e.shadowRoot && walk(e.shadowRoot)); };
  walk(document); return out; }"""

n_ok, failed = 0, []


def check(c, label):
    global n_ok
    print(("PASS " if c else "FAIL ") + label, flush=True)
    if c:
        n_ok += 1
    else:
        failed.append(label)


def off(pg, where):
    hs = pg.evaluate(MEASURE, CONTROLS)
    bad = [x for x in hs if x[0] != H]
    check(hs and not bad, f"{where}: {len(hs)} controls, all {H} px {bad[:4]}")


with sync_playwright() as p:
    b = p.chromium.launch()
    for w, h in ((390, 844), (320, 700), (1280, 860)):
        pg = b.new_page(viewport={"width": w, "height": h})
        pg.goto(PREVIEW)
        pg.wait_for_timeout(1500)
        off(pg, f"{w} px › Agora")
        pg.get_by_role("button", name="Mais", exact=True).locator("visible=true").first.click()
        pg.wait_for_timeout(400)
        pg.get_by_text("Configurações", exact=True).first.click()
        pg.wait_for_timeout(400)
        for tab in ("Integrações", "Dados", "Aparência", "Opções"):
            pg.locator(".more-tabs button", has_text=tab).click()
            pg.wait_for_timeout(400)
            off(pg, f"{w} px › {tab}")
        pg.screenshot(path=str(SHOTS / f"alturas-{w}.png"))
        if w < 1000:
            pg.locator(".tab.fab").first.click()
            pg.wait_for_timeout(700)
            off(pg, f"{w} px › Adicionar")
        pg.close()
    b.close()
print(f"\n{n_ok} passed, {len(failed)} failed")
sys.exit(1 if failed else 0)
