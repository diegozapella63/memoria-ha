# MemorIA 1.10.0: Blocos em blocos ou em lista. At the right of the count, the quick choice (two buttons, the same size):
# Em lista shows one line per block (its color, the name, the folhas, whose and when it opens) and Novo bloco at the end;
# the category filter still works; the choice is kept on this device (after reloading). 390 and 320 px, light and dark.
#
# Uses the preview (no server): cd frontend && npm run build, then
#   python3 tests/vista_check.py [folder for the screenshots]
import os, sys, tempfile
from pathlib import Path
from playwright.sync_api import sync_playwright

REPO = Path(__file__).resolve().parent.parent
PREVIEW = (REPO / "preview" / "memoria-preview.html").as_uri()
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


OVER = """(el) => {
  const W = window.innerWidth, bad = [];
  for (const e of el.renderRoot.querySelectorAll(".page *")) {
    if (e.closest(".cat-filter, .who-filter, .tline")) continue;
    const r = e.getBoundingClientRect();
    if (r.width && (r.right > W + 1 || r.left < -1)) bad.push(e.tagName.toLowerCase() + "." + [...e.classList].join(".") + " " + Math.round(r.left) + ".." + Math.round(r.right));
  }
  if (document.documentElement.scrollWidth > W) bad.push("page " + document.documentElement.scrollWidth);
  return bad.slice(0, 4);
}"""


def texts(loc):
    return [" ".join(t.split()) for t in loc.all_inner_texts()]


with sync_playwright() as p:
    b = p.chromium.launch()
    for scheme, w in (("light", 390), ("dark", 390), ("dark", 320)):
        tag = f"{scheme} {w}px"
        ctx = b.new_context(viewport={"width": w, "height": 844}, device_scale_factor=2, color_scheme=scheme, has_touch=True, is_mobile=True)
        pg = ctx.new_page()
        errs = []
        pg.on("pageerror", lambda e: errs.append(str(e)))
        pg.goto(PREVIEW)
        a = pg.locator("memoria-app")
        a.locator(".page-title").first.wait_for()
        pg.wait_for_timeout(500)
        a.locator("nav .tab", has_text="Blocos").click()
        pg.wait_for_timeout(500)

        # ---- the quick choice, at the right of the count
        tog = a.locator(".page .status .view-toggle button")
        check(tog.count() == 2 and [tog.nth(i).get_attribute("aria-label") for i in range(2)] == ["Em blocos", "Em lista"], f"{tag}: Em blocos and Em lista at the top")
        check(tog.nth(0).get_attribute("aria-pressed") == "true" and a.locator(".shelf .cover").count() > 1, f"{tag}: the covers to begin with")
        boxes = [tog.nth(i).bounding_box() for i in range(2)]
        st = a.locator(".page .status").first.bounding_box()
        check(abs(boxes[0]["width"] - boxes[1]["width"]) < 1 and abs(boxes[0]["y"] - boxes[1]["y"]) < 1 and boxes[1]["x"] + boxes[1]["width"] > st["x"] + st["width"] - 6, f"{tag}: the same size, side by side, at the right ({boxes})")
        st_text = a.locator(".page .status").first.inner_text().strip()
        check(st_text == f"{len(texts(a.locator('.shelf .cover:not(.add)')))} blocos · 6 folhas", f"{tag}: the count stays (the buttons have no text) ({st_text!r})")
        names = texts(a.locator(".shelf .cover:not(.add) .sticker b"))

        # ---- Em lista
        tog.nth(1).click()
        pg.wait_for_timeout(400)
        rows = a.locator(".shelf-list .block-row:not(.add)")
        labels = texts(rows.locator(".label"))
        check(a.locator(".shelf").count() == 0 and labels == names, f"{tag}: Em lista: the same blocks, in the same order ({labels})")
        hints = texts(rows.locator(".hint"))
        check(all(" folha" in h for h in hints) and any("Sem horário" in h or ":" in h or "Manhã" in h or "Noite" in h or "Tarde" in h for h in hints), f"{tag}: each with its folhas and when ({hints[:3]})")
        tiles = rows.locator(".tile").evaluate_all("(els) => els.map((e) => getComputedStyle(e).backgroundColor)")
        check(len(set(tiles)) > 1, f"{tag}: each in its color ({tiles[:3]})")
        check(texts(a.locator(".shelf-list .block-row.add")) == ["Novo bloco"], f"{tag}: Novo bloco at the end")
        check(tog.nth(1).get_attribute("aria-pressed") == "true", f"{tag}: Em lista marked")
        check(a.evaluate(OVER) == [], f"{tag}: nothing out of the screen {a.evaluate(OVER)}")
        pg.screenshot(path=str(SHOTS / f"vista-{scheme}-{w}-lista.png"))

        # the category filter still works
        chips = a.locator(".cat-filter .pick")
        if chips.count() > 1:
            chips.nth(1).click()
            pg.wait_for_timeout(300)
            check(len(texts(a.locator(".shelf-list .block-row:not(.add) .label"))) < len(labels), f"{tag}: the category filter in the list")
            chips.nth(0).click()
            pg.wait_for_timeout(300)

        # opening one
        rows.first.click()
        pg.wait_for_timeout(500)
        check(a.evaluate("(el) => el._view().name") == "block", f"{tag}: a line opens the block")
        pg.go_back()
        pg.wait_for_timeout(500)

        # ---- kept on this device
        pg.reload()
        a.locator(".page-title").first.wait_for()
        pg.wait_for_timeout(400)
        a.locator("nav .tab", has_text="Blocos").click()
        pg.wait_for_timeout(400)
        check(a.locator(".shelf-list").count() == 1, f"{tag}: still in a list after reloading")
        a.locator(".page .status .view-toggle button").nth(0).click()
        pg.wait_for_timeout(300)
        check(a.locator(".shelf .cover").count() > 1 and a.locator(".shelf-list").count() == 0, f"{tag}: Em blocos: the covers again")
        check(not errs, f"{tag}: no page errors {errs}")
        ctx.close()
    b.close()

print(f"{n_ok} checks passed" if not failed else f"{len(failed)} FAILED, {n_ok} passed")
print(f"screenshots in {SHOTS}")
sys.exit(1 if failed else 0)
