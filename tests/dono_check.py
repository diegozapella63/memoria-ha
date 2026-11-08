# MemorIA 1.9.0: De quem é. In the block's sheet, Todos or a person of the house (the people of Home Assistant; without
# them, a name to write). A block of a person opens by itself only in that person's Agora (and their Seu dia); Blocos
# still shows every block, with "de Beto" on the sticker and on the block's screen. A login that is not a person of
# the house (a shared tablet) sees every block. 390 and 320 px, light and dark.
#
# Uses the preview (no server; Ana uses it, Treino is Beto's, Diário is Ana's): cd frontend && npm run build, then
#   python3 tests/dono_check.py [folder for the screenshots]
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
  for (const e of el.renderRoot.querySelectorAll(".page *, .sheet *")) {
    if (e.closest(".cat-filter, .more-tabs, .tline")) continue;
    const r = e.getBoundingClientRect();
    if (r.width && (r.right > W + 1 || r.left < -1)) bad.push(e.tagName.toLowerCase() + "." + [...e.classList].join(".") + " " + Math.round(r.left) + ".." + Math.round(r.right));
  }
  if (document.documentElement.scrollWidth > W) bad.push("page " + document.documentElement.scrollWidth);
  return bad.slice(0, 4);
}"""


def view(a):
    return a.evaluate("(el) => el._view().name")


def texts(loc):
    return [" ".join(t.split()) for t in loc.all_inner_texts()]


def in_agora(a):
    return a.evaluate("(el) => [...new Set(el._schedule().map((e) => el._block(e.block).name))].sort()")


def open_sheet(a, pg, name):
    a.locator("nav .tab", has_text="Blocos").click()
    pg.wait_for_timeout(400)
    a.locator(".cover", has_text=name).click()
    pg.wait_for_timeout(500)
    a.locator('[aria-label="Ajustes do bloco"]').click()
    pg.wait_for_timeout(500)


def save(a, pg):
    a.locator(".sheet .sheet-actions .btn.primary").click()
    pg.wait_for_timeout(600)


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

        # ---- Agora is Ana's: her Diário and everyone's, not Beto's Treino
        check(a.evaluate("(el) => el._me()") == "Ana", f"{tag}: Ana uses the preview")
        check(in_agora(a) == ["Diário", "Trabalho"], f"{tag}: Agora: Diário and Trabalho, not Treino ({in_agora(a)})")
        chips = texts(a.locator(".tline .tchip"))
        check(not any("Treino" in c for c in chips), f"{tag}: no Treino in the line of the day ({chips})")

        # ---- Blocos: every block, whose on the sticker; Seu dia is Ana's
        a.locator("nav .tab", has_text="Blocos").click()
        pg.wait_for_timeout(500)
        stickers = texts(a.locator(".shelf .cover:not(.add) .sticker small"))
        check(stickers == ["2 folhas · de Beto", "2 folhas", "2 folhas · de Ana", "2 folhas"], f"{tag}: the shelf shows every block, with whose ({stickers})")
        day = texts(a.locator(".day-row .label"))
        check("Treino" not in day and "Diário" in day, f"{tag}: Seu dia without Beto's Treino ({day})")
        check(a.evaluate(OVER) == [], f"{tag}: nothing out of the screen on the shelf {a.evaluate(OVER)}")
        pg.screenshot(path=str(SHOTS / f"dono-{scheme}-{w}-blocos.png"))

        # ---- Treino's screen and sheet: de Beto; De quem é with Todos, Ana and Beto
        a.locator(".cover", has_text="Treino").click()
        pg.wait_for_timeout(500)
        check("de beto" in a.locator(".detail-head .overline").inner_text().lower(), f"{tag}: the block's screen says whose")
        a.locator('[aria-label="Ajustes do bloco"]').click()
        pg.wait_for_timeout(500)
        pick = a.locator(".sheet .owner-pick .pick")
        check(texts(pick) == ["Todos", "Ana", "Beto"], f"{tag}: De quem é: Todos and the people of the house ({texts(pick)})")
        check(pick.nth(2).get_attribute("aria-checked") == "true", f"{tag}: Beto chosen")
        widths = {round(x["width"]) for x in pick.evaluate_all("(els) => els.map((e) => e.getBoundingClientRect().toJSON())")}
        check(len(widths) == 1, f"{tag}: the choices with the same width ({widths})")
        hint = a.locator(".sheet .owner-pick + .field-hint")
        check(hint.count() == 1 and hint.inner_text().strip() == "Só aparece no Agora de Beto.", f"{tag}: Só aparece no Agora de Beto.")
        check(a.evaluate(OVER) == [], f"{tag}: nothing out of the screen in the sheet {a.evaluate(OVER)}")
        a.locator(".sheet .owner-pick").scroll_into_view_if_needed()
        pg.screenshot(path=str(SHOTS / f"dono-{scheme}-{w}-folha.png"))
        pick.nth(0).click()
        pg.wait_for_timeout(200)
        check(a.locator(".sheet .owner-pick + .field-hint").count() == 0, f"{tag}: Todos: no hint")
        save(a, pg)
        check(a.evaluate("(el) => 'owner' in el._block('treino00001')") is False, f"{tag}: Treino is everyone's now")
        check("Treino" in in_agora(a), f"{tag}: and opens in Ana's Agora ({in_agora(a)})")

        # ---- Diário to Beto: it leaves Ana's Agora (and it is still on the shelf)
        open_sheet(a, pg, "Diário")
        a.locator(".sheet .owner-pick .pick", has_text="Beto").click()
        save(a, pg)
        check(a.evaluate("(el) => el._block('diario00001').owner") == "Beto", f"{tag}: Diário is Beto's")
        check("Diário" not in in_agora(a), f"{tag}: out of Ana's Agora ({in_agora(a)})")
        a.locator("nav .tab", has_text="Agora").click()
        pg.wait_for_timeout(500)
        cur = a.evaluate("(el) => el._pad && el._block(el._pad.block).name")
        check(cur != "Diário", f"{tag}: Agora shows another block ({cur})")
        a.locator("nav .tab", has_text="Blocos").click()
        pg.wait_for_timeout(400)
        check(a.locator(".cover", has_text="Diário").count() == 1, f"{tag}: Diário still on the shelf")

        # ---- a new block is everyone's
        a.locator(".cover.add").click()
        pg.wait_for_timeout(500)
        check(a.locator(".sheet .owner-pick .pick.on").inner_text().strip() == "Todos", f"{tag}: a new block: Todos")
        pg.go_back()
        pg.wait_for_timeout(400)
        check(a.evaluate("(el) => el._sheet") is None, f"{tag}: Back closes the sheet")

        # ---- without the people of Home Assistant: the name is written
        a.evaluate("(el) => { el._people = []; el.api.people = async () => ({ people: [], person: 'Ana' }); }")
        open_sheet(a, pg, "Ideias")
        inp = a.locator('.sheet input[aria-label="De quem é"]')
        check(inp.count() == 1 and inp.get_attribute("placeholder") == "Todos" and a.locator(".sheet .owner-pick").count() == 0, f"{tag}: no people: a name to write, Todos when empty")
        inp.fill("Carla")
        pg.wait_for_timeout(200)
        check("Só aparece no Agora de Carla." in a.locator(".sheet").inner_text(), f"{tag}: the hint with the name written")
        save(a, pg)
        check(a.evaluate("(el) => el._block('ideias00001').owner") == "Carla", f"{tag}: saved as Carla's")

        # ---- a login that is not a person of the house (a shared tablet): every block
        a.evaluate("(el) => { el._user = { name: 'Tablet', person: '' }; el._cache = { ...el._cache, data: null }; el.requestUpdate(); }")
        pg.wait_for_timeout(300)
        check(in_agora(a) == ["Diário", "Trabalho", "Treino"], f"{tag}: a shared tablet sees every block ({in_agora(a)})")

        check(not errs, f"{tag}: no page errors {errs}")
        ctx.close()
    b.close()

print(f"{n_ok} checks passed" if not failed else f"{len(failed)} FAILED, {n_ok} passed")
print(f"screenshots in {SHOTS}")
sys.exit(1 if failed else 0)
