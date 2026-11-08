# MemorIA 1.5.0: categories of the blocks. Mais › Categorias (a row of the menu, its own screen): add, rename,
# recolor and delete (confirmed; the blocks stay, without a category; Back, a tap outside and Cancelar return
# to the category). The block's sheet: Sem categoria, the categories and Nova (written right there). Blocos: chips by
# category (only with categories; Sem categoria when some block has none), the choice kept on this device; a new
# block from a filtered shelf goes into that category. Mais › Relatório in the preview only explains.
# 390 and 320 px, light and dark.
#
# Uses the preview (no server): cd frontend && npm run build, then
#   python3 tests/categorias_check.py [folder for the screenshots]
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
    if (e.closest(".cat-filter, .who-filter, .more-tabs")) continue;
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


with sync_playwright() as p:
    b = p.chromium.launch()
    for scheme, w in (("light", 390), ("dark", 390), ("dark", 320)):
        tag = f"{scheme} {w}px"
        ctx = b.new_context(viewport={"width": w, "height": 844}, device_scale_factor=2, color_scheme=scheme, has_touch=True, is_mobile=True)
        pg = ctx.new_page()
        errs = []
        pg.on("pageerror", lambda e: errs.append(str(e)))
        # 1.10.0: Blocos and Buscar start on the blocks of the person using it (Ana) and everyone's: here, every block
        ctx.add_init_script("localStorage.setItem('memoria.blocos.pessoa', '\"*\"'); localStorage.setItem('memoria.buscar.pessoa', '\"*\"')")
        pg.goto(PREVIEW)
        a = pg.locator("memoria-app")
        a.locator(".page-title").first.wait_for()
        pg.wait_for_timeout(500)

        # ---- the menu: Categorias, Relatório, Configurações, Sobre (the last)
        a.locator("nav .tab", has_text="Mais").click()
        pg.wait_for_timeout(500)
        rows = [r.split(" ")[0] for r in texts(a.locator(".more-menu .more-row b"))]
        check(rows == ["Categorias", "Relatório", "Configurações", "Sobre"], f"{tag}: the menu ({rows})")
        check(texts(a.locator(".more-row", has_text="Categorias").locator(".mb > span")) == ["Pessoal, Trabalho."], f"{tag}: Categorias says which")
        # Relatório in the preview: it explains (the page is made by the server)
        a.locator(".more-row", has_text="Relatório").click()
        pg.wait_for_timeout(500)
        toast = a.locator(".toast")
        check(toast.count() == 1 and "Na prévia o relatório não abre" in toast.inner_text() and view(a) == "more", f"{tag}: Relatório in the preview explains")

        # ---- Mais › Categorias
        a.locator(".more-row", has_text="Categorias").click()
        pg.wait_for_timeout(600)
        check(view(a) == "categorias" and a.locator(".page-title").first.inner_text().strip() == "Categorias", f"{tag}: Categorias open")
        check(a.locator(".uplink").inner_text().strip() == "Mais" and a.locator("nav .tab.on").inner_text().strip() == "Mais", f"{tag}: ‹ Mais, Mais lit")
        cats = texts(a.locator(".cat-row:not(.add) .grow"))
        check(cats == ["Pessoal 2 blocos: Treino, Diário", "Trabalho 1 bloco: Trabalho"], f"{tag}: the categories and their blocks ({cats})")
        check(a.locator(".cat-row.add").inner_text().strip() == "Nova categoria", f"{tag}: Nova categoria last")
        check(not a.evaluate(OVER), f"{tag}: Categorias: nothing past the edge {a.evaluate(OVER)}")
        pg.screenshot(path=str(SHOTS / f"categorias-{scheme}-{w}.png"))

        # new: an empty name can't be saved; a repeated one is refused
        a.locator(".cat-row.add").click()
        pg.wait_for_timeout(500)
        sheet = a.locator(".sheet")
        check(sheet.locator("h3").inner_text().strip() == "Nova categoria", f"{tag}: the sheet Nova categoria")
        check(a.evaluate("(el) => el.renderRoot.activeElement && el.renderRoot.activeElement.matches('.sheet input[type=text]')"), f"{tag}: the cursor in the name")
        save = sheet.locator(".btn.primary")
        check(save.is_disabled(), f"{tag}: no name, no saving")
        sheet.locator("input[type=text]").fill("pessoal")
        save.click()
        pg.wait_for_timeout(500)
        check("Já existe a categoria pessoal" in a.locator(".toast").inner_text() and a.evaluate("(el) => el._sheet") == "category", f"{tag}: a repeated name is refused, the sheet stays")
        sheet.locator("input[type=text]").fill("Estudos")
        sheet.locator(".sw[aria-label=Azul]").click()
        pg.screenshot(path=str(SHOTS / f"categoria-nova-{scheme}-{w}.png"))
        save.click()
        pg.wait_for_timeout(600)
        check(a.evaluate("(el) => el._sheet") is None and texts(a.locator(".cat-row:not(.add) .label"))[-1] == "Estudos", f"{tag}: Estudos created")
        check(a.evaluate("(el) => el._cats().find((c) => c.name === 'Estudos').color") == "azul", f"{tag}: in Azul")

        # rename
        a.locator(".cat-row", has_text="Estudos").click()
        pg.wait_for_timeout(500)
        check(sheet.locator("h3").inner_text().strip() == "Categoria" and sheet.locator("input[type=text]").input_value() == "Estudos", f"{tag}: the sheet of a category")
        sheet.locator("input[type=text]").fill("Cursos")
        sheet.locator(".btn.primary").click()
        pg.wait_for_timeout(600)
        check("Cursos" in texts(a.locator(".cat-row .label")), f"{tag}: renamed")

        # delete: Back, the X and Cancelar return to the category; Apagar leaves its blocks without one
        a.locator(".cat-row", has_text="Pessoal").click()
        pg.wait_for_timeout(500)
        for how in ("back", "fora", "cancelar"):
            sheet.locator(".btn.danger").click()
            pg.wait_for_timeout(500)
            check(a.evaluate("(el) => el._sheet") == "confirm" and "Os 2 blocos dela ficam sem categoria" in sheet.inner_text(), f"{tag}: Apagar asks first ({how})")
            if how == "back":
                pg.go_back()
            elif how == "fora":
                pg.touchscreen.tap(w / 2, 60)
            else:
                sheet.locator(".btn.outline", has_text="Cancelar").click()
            pg.wait_for_timeout(600)
            check(a.evaluate("(el) => el._sheet") == "category" and sheet.locator("input[type=text]").input_value() == "Pessoal", f"{tag}: {how} returns to the category")
        pg.screenshot(path=str(SHOTS / f"categoria-{scheme}-{w}.png"))
        sheet.locator(".btn.danger").click()
        pg.wait_for_timeout(400)
        pg.screenshot(path=str(SHOTS / f"categoria-apagar-{scheme}-{w}.png"))
        sheet.locator(".btn.danger-fill").click()
        pg.wait_for_timeout(700)
        check(a.evaluate("(el) => el._sheet") is None and "Pessoal" not in texts(a.locator(".cat-row .label")), f"{tag}: Pessoal deleted")
        check(a.evaluate("(el) => el._data.blocks.filter((b) => b.name === 'Treino' || b.name === 'Diário').every((b) => !b.category)"), f"{tag}: its blocks without a category")
        check(view(a) == "categorias", f"{tag}: still on Categorias")
        pg.go_back()
        pg.wait_for_timeout(500)
        check(view(a) == "more", f"{tag}: Back from Categorias: the menu ({view(a)})")

        # ---- the block's sheet: Sem categoria, the categories, Nova written there
        a.locator("nav .tab", has_text="Blocos").click()
        pg.wait_for_timeout(600)
        chips = texts(a.locator(".cat-filter .pick"))
        check(chips == ["Todos", "Trabalho", "Cursos", "Sem categoria"], f"{tag}: Blocos: the chips ({chips})")
        check(a.locator(".cat-filter .pick.on").inner_text().strip() == "Todos", f"{tag}: Todos at first")
        a.locator(".cover", has_text="Treino").click()
        pg.wait_for_timeout(600)
        check(a.locator(".detail-head .overline").inner_text().strip().lower().startswith("2 folhas"), f"{tag}: Treino has no category on its screen")
        a.locator(".detail-head .icon-btn[aria-label='Ajustes do bloco']").click()
        pg.wait_for_timeout(500)
        picks = texts(sheet.locator(".cat-pick .pick"))
        check(picks == ["Sem categoria", "Trabalho", "Cursos", "Nova"], f"{tag}: the block's sheet: {picks}")
        check(sheet.locator(".cat-pick .pick.on").inner_text().strip() == "Sem categoria", f"{tag}: Sem categoria marked")
        sheet.locator(".cat-pick .pick", has_text="Nova").click()
        pg.wait_for_timeout(400)
        nc = sheet.locator(".new-cat input")
        check(nc.count() == 1 and a.evaluate("(el) => el.renderRoot.activeElement && el.renderRoot.activeElement.matches('.new-cat input')"), f"{tag}: Nova: the name, with the cursor in it")
        nc.fill("Saúde")
        pg.screenshot(path=str(SHOTS / f"bloco-categoria-{scheme}-{w}.png"))
        check(not a.evaluate(OVER), f"{tag}: the block's sheet: nothing past the edge {a.evaluate(OVER)}")
        sheet.locator(".btn.primary", has_text="Salvar").click()
        pg.wait_for_timeout(800)
        made = a.evaluate("(el) => { const c = el._cats().find((x) => x.name === 'Saúde'); const b = el._data.blocks.find((x) => x.name === 'Treino'); return [!!c, c && b.category === c.id]; }")
        check(made == [True, True], f"{tag}: Saúde created and Treino in it ({made})")
        check(a.locator(".detail-head .overline").inner_text().strip().lower().startswith("saúde · 2 folhas"), f"{tag}: the block's screen says the category")
        a.locator(".detail-head .icon-btn[aria-label='Ajustes do bloco']").click()
        pg.wait_for_timeout(500)
        sheet.locator(".cat-pick .pick", has_text="Cursos").click()
        sheet.locator(".btn.primary", has_text="Salvar").click()
        pg.wait_for_timeout(700)
        check(a.evaluate("(el) => el._cat(el._data.blocks.find((x) => x.name === 'Treino').category).name") == "Cursos", f"{tag}: moved to Cursos")

        # ---- Blocos: the filter, kept on this device
        a.locator("nav .tab", has_text="Blocos").click()
        pg.wait_for_timeout(600)
        a.locator(".cat-filter .pick", has_text="Trabalho").click()
        pg.wait_for_timeout(400)
        covers = texts(a.locator(".cover:not(.add) .sticker b"))
        check(covers == ["Trabalho"], f"{tag}: Trabalho: its blocks ({covers})")
        check(a.locator(".page .status").first.inner_text().strip() == "1 bloco · 2 folhas", f"{tag}: the count of what is shown")
        check(not a.evaluate(OVER), f"{tag}: Blocos: nothing past the edge {a.evaluate(OVER)}")
        pg.screenshot(path=str(SHOTS / f"blocos-categoria-{scheme}-{w}.png"))
        a.locator(".cat-filter .pick", has_text="Sem categoria").click()
        pg.wait_for_timeout(400)
        covers = texts(a.locator(".cover:not(.add) .sticker b"))
        check(covers == ["Diário", "Ideias"], f"{tag}: Sem categoria ({covers})")
        a.locator(".cat-filter .pick", has_text="Cursos").click()
        pg.wait_for_timeout(300)
        pg.reload()
        a.locator(".page-title").first.wait_for()
        pg.wait_for_timeout(600)
        a.locator("nav .tab", has_text="Blocos").click()
        pg.wait_for_timeout(500)
        # the preview starts again from its sample (Pessoal back, Cursos gone): the kept choice that no longer exists is Todos
        check(a.locator(".cat-filter .pick.on").inner_text().strip() == "Todos", f"{tag}: a kept category that is gone: Todos")
        a.locator(".cat-filter .pick", has_text="Pessoal").click()
        # (a slow machine: the choice on screen, and so kept, before the reload)
        a.locator(".cat-filter .pick.on", has_text="Pessoal").wait_for(timeout=5000)
        pg.wait_for_timeout(300)
        pg.reload()
        a.locator(".page-title").first.wait_for()
        pg.wait_for_timeout(600)
        a.locator("nav .tab", has_text="Blocos").click()
        a.locator(".cat-filter").wait_for()
        pg.wait_for_timeout(500)
        check(a.locator(".cat-filter .pick.on").inner_text().strip() == "Pessoal", f"{tag}: the choice is kept after a reload")
        # a new block from here goes into Pessoal
        a.locator(".cover.add").click()
        pg.wait_for_timeout(500)
        check(sheet.locator(".cat-pick .pick.on").inner_text().strip() == "Pessoal", f"{tag}: a new block from Pessoal comes in Pessoal")
        pg.go_back()
        pg.wait_for_timeout(400)
        check(not errs, f"{tag}: no page errors {errs}")
        ctx.close()
    b.close()

print(f"{n_ok} checks passed" if not failed else f"{len(failed)} FAILED, {n_ok} passed")
print(f"screenshots in {SHOTS}")
sys.exit(1 if failed else 0)
