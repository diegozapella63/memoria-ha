# MemorIA 1.15.0: Buscar already shows the blocks (of De quem, without the archived ones unless Incluir arquivados);
# Selecionar (or holding a finger on a block) marks several and Alterar changes the category and whose they are at once,
# like the ResolvIA (each field starting on Manter), with Desfazer; Back leaves Selecionar. And Nova (+) has Novo bloco.
# Ana in the preview: Trabalho, Diário (hers) and Ideias; Treino is Beto's, Viagem archived. 390 and 320 px, light/dark.
#
# Uses the preview (no server): cd frontend && npm run build, then
#   python3 tests/buscar_check.py [folder for the screenshots]
import os, sys, tempfile
from pathlib import Path
from playwright.sync_api import sync_playwright

REPO = Path(__file__).resolve().parent.parent
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


OVER = """(el) => {
  const W = window.innerWidth, bad = [];
  for (const e of el.renderRoot.querySelectorAll(".page *, .sheet *")) {
    if (e.closest(".chip-row")) continue;
    const r = e.getBoundingClientRect();
    if (r.width && (r.right > W + 1 || r.left < -1)) bad.push(e.tagName.toLowerCase() + "." + [...e.classList].join(".") + " " + Math.round(r.left) + ".." + Math.round(r.right));
  }
  if (document.documentElement.scrollWidth > W) bad.push("page " + document.documentElement.scrollWidth);
  return bad.slice(0, 4);
}"""
NAMES = "(el) => [...el.renderRoot.querySelectorAll('.search-blocks .block-row .label')].map((x) => x.textContent.trim())"
PRESSED = "(el) => [...el.renderRoot.querySelectorAll('.search-blocks .block-row.selr.on .label')].map((x) => x.textContent.trim())"
BLOCK = "(el) => Object.fromEntries(el._data.blocks.map((b) => [b.name, [b.category || '', b.owner || '']]))"

with sync_playwright() as p:
    b = p.chromium.launch()
    for scheme, w in (("dark", 390), ("light", 320)):
        tag = f"{scheme} {w}px"
        ctx = b.new_context(viewport={"width": w, "height": 844}, device_scale_factor=2, color_scheme=scheme, has_touch=True, is_mobile=True)
        pg = ctx.new_page()
        errs = []
        pg.on("pageerror", lambda e: errs.append(str(e)))
        pg.goto(PREVIEW)
        a = pg.locator("memoria-app")
        a.locator(".page-title").first.wait_for()
        a.locator("nav .tab", has_text="Buscar").click()
        pg.wait_for_timeout(500)
        sheet = a.locator(".sheet")

        # ---- the blocks come already
        check(a.evaluate(NAMES) == ["Trabalho", "Diário", "Ideias"], f"{tag}: Buscar shows Ana's blocks and everyone's ({a.evaluate(NAMES)})")
        check(a.locator(".sel-head .sel-n").inner_text().strip() == "3 blocos", f"{tag}: how many")
        hint = a.locator(".search-blocks .block-row .hint").first.inner_text()
        check(hint.startswith("Trabalho · "), f"{tag}: the category in the line ({hint})")
        check(a.evaluate(OVER) == [], f"{tag}: inside the screen {a.evaluate(OVER)}")
        pg.screenshot(path=str(SHOTS / f"buscar-{scheme}-{w}-blocos.png"))
        a.locator(".search-box input").fill("diar")
        pg.wait_for_timeout(300)
        check(a.evaluate(NAMES) == ["Diário"], f"{tag}: a word filters the blocks by name, accents don't matter ({a.evaluate(NAMES)})")
        a.locator(".search-box input").fill("")
        pg.wait_for_timeout(300)
        a.locator(".search-blocks .block-row").first.click()
        pg.wait_for_timeout(500)
        check(a.evaluate("(el) => el._view().name") == "block", f"{tag}: a tap opens the block")
        pg.go_back()
        pg.wait_for_timeout(500)

        # ---- Selecionar: two blocks, Alterar the category and whose they are at once, Desfazer
        before = a.evaluate(BLOCK)
        a.locator("[data-sel-start]").click()
        pg.wait_for_timeout(300)
        check(a.locator(".search-blocks .block-row.selr").count() == 3, f"{tag}: each line becomes a mark")
        check(a.locator("[data-sel-change]").is_disabled(), f"{tag}: nothing marked: Alterar off")
        a.locator(".search-blocks .block-row.selr", has_text="Diário").click()
        a.locator(".search-blocks .block-row.selr", has_text="Ideias").click()
        pg.wait_for_timeout(300)
        check(a.evaluate(PRESSED) == ["Diário", "Ideias"], f"{tag}: a tap marks (and doesn't open)")
        check(a.locator(".sel-head .sel-n").inner_text().strip() == "2 selecionados", f"{tag}: how many marked")
        check(a.locator("[data-sel-change]").inner_text().strip() == "Alterar 2 blocos", f"{tag}: Alterar 2 blocos")
        nav = a.locator("nav").bounding_box()
        bar = a.locator(".sel-bar").bounding_box()
        check(bar["y"] + bar["height"] <= nav["y"] + 1, f"{tag}: the bar above the tabs ({bar}, {nav})")
        check(a.evaluate(OVER) == [], f"{tag}: selecting, inside the screen {a.evaluate(OVER)}")
        pg.screenshot(path=str(SHOTS / f"buscar-{scheme}-{w}-selecionar.png"))
        a.locator("[data-sel-change]").click()
        sheet.wait_for()
        pg.wait_for_timeout(300)
        check(sheet.locator("h3").inner_text().strip() == "Alterar 2 blocos", f"{tag}: the window")
        heads = [t.strip() for t in sheet.locator(".flabel").all_inner_texts()]
        check(heads == ["Categoria", "De quem é"], f"{tag}: Categoria and De quem é ({heads})")
        ons = [t.strip() for t in sheet.locator(".bulk-pick .pick.on").all_inner_texts()]
        check(ons == ["Manter", "Manter"], f"{tag}: both start on Manter ({ons})")
        check(sheet.locator("[data-bulk-ok]").is_disabled(), f"{tag}: nothing changed: Aplicar off")
        sheet.locator(".bulk-pick").nth(0).locator(".pick", has_text="Trabalho").click()
        sheet.locator(".bulk-pick").nth(1).locator(".pick", has_text="Beto").click()
        pg.wait_for_timeout(200)
        check(not sheet.locator("[data-bulk-ok]").is_disabled(), f"{tag}: something chosen: Aplicar on")
        cut = a.evaluate("(el) => [...el.renderRoot.querySelectorAll('.bulk-pick .pick span')].filter((x) => x.scrollWidth > x.clientWidth + 1).map((x) => x.textContent)")
        check(cut == [], f"{tag}: nothing cut in the window {cut}")
        check(a.evaluate(OVER) == [], f"{tag}: the window inside the screen {a.evaluate(OVER)}")
        pg.screenshot(path=str(SHOTS / f"buscar-{scheme}-{w}-alterar.png"))
        sheet.locator("[data-bulk-ok]").click()
        pg.wait_for_timeout(900)
        now = a.evaluate(BLOCK)
        check(now["Diário"] == ["cattrabalho", "Beto"] and now["Ideias"] == ["cattrabalho", "Beto"], f"{tag}: both in Trabalho, of Beto ({now})")
        check(now["Trabalho"] == before["Trabalho"], f"{tag}: the one not marked stays")
        toast = a.locator(".toast")
        check("2 blocos alterados" in toast.inner_text(), f"{tag}: the notice ({toast.inner_text()})")
        check(a.locator(".sel-bar").count() == 0, f"{tag}: Selecionar ends")
        check(a.evaluate(NAMES) == ["Trabalho"], f"{tag}: Ana's list: Beto's blocks leave it ({a.evaluate(NAMES)})")
        toast.locator("button").click()
        pg.wait_for_timeout(900)
        check(a.evaluate(BLOCK) == before, f"{tag}: Desfazer: as before")

        # ---- holding a finger starts Selecionar with that one; Todos/Nenhum; Back leaves
        a.locator(".search-blocks .block-row", has_text="Ideias").click(button="right")
        pg.wait_for_timeout(300)
        check(a.evaluate(PRESSED) == ["Ideias"], f"{tag}: holding: Selecionar with it marked ({a.evaluate(PRESSED)})")
        check(a.evaluate("(el) => el._view().name") == "search", f"{tag}: and it doesn't open")
        a.locator("[data-sel-all]").click()
        pg.wait_for_timeout(200)
        check(len(a.evaluate(PRESSED)) == 3 and a.locator("[data-sel-all]").inner_text().strip() == "Nenhum", f"{tag}: Todos, then Nenhum")
        a.locator("[data-sel-all]").click()
        pg.wait_for_timeout(200)
        check(a.evaluate(PRESSED) == [], f"{tag}: Nenhum")
        pg.go_back()
        pg.wait_for_timeout(400)
        check(a.locator(".sel-bar").count() == 0 and a.evaluate("(el) => el._view().name") == "search", f"{tag}: Back leaves Selecionar, stays in Buscar")
        # only one person's view: Todos shows Beto's Treino too
        a.locator(".who-filter .pick", has_text="Todos").click()
        pg.wait_for_timeout(300)
        check(a.evaluate(NAMES) == ["Treino", "Trabalho", "Diário", "Ideias"], f"{tag}: De quem Todos: Beto's too ({a.evaluate(NAMES)})")
        a.locator(".search-opts .pick").click()
        pg.wait_for_timeout(300)
        check("Viagem" in a.evaluate(NAMES), f"{tag}: Incluir arquivados: the archived one too")
        a.locator(".search-opts .pick").click()
        a.locator(".who-filter .pick", has_text="Ana").click()
        pg.wait_for_timeout(300)

        # ---- Nova (+): Novo bloco
        a.locator("nav .tab.fab").click()
        sheet.wait_for()
        pg.wait_for_timeout(400)
        opts = [t.split("\n")[0].strip() for t in sheet.locator(".imp-opt b").all_inner_texts()]
        check(opts[-1] == "Novo bloco", f"{tag}: Nova has Novo bloco ({opts})")
        sheet.locator("[data-new-block]").click()
        pg.wait_for_timeout(400)
        check(sheet.locator("h3").inner_text().strip() == "Novo bloco", f"{tag}: it opens Novo bloco")
        pg.go_back()
        pg.wait_for_timeout(400)
        check(a.locator(".sheet").count() == 0, f"{tag}: Back closes it")
        check(not errs, f"{tag}: no page errors {errs}")
        ctx.close()
    b.close()

print(f"{n_ok} checks passed" if not failed else f"{len(failed)} FAILED, {n_ok} passed")
print(f"screenshots in {SHOTS}")
sys.exit(1 if failed else 0)
