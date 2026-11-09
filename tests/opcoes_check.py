# MemorIA 1.11.0: Mais › Configurações › Opções › Blocos: Usar categorias and Controle por pessoa, both on to begin with.
# Usar categorias off: no category filter in Blocos, no Categoria in the block's sheet, no Categorias in Mais.
# Controle por pessoa off: no filter De quem (Blocos, Buscar), no "de Beto", no De quem é in the sheet, every block in
# everyone's Agora (Beto's Treino in Ana's). On again, everything back (nothing was lost). 390 and 320 px, light and dark.
#
# Uses the preview (no server): cd frontend && npm run build, then
#   python3 tests/opcoes_check.py [folder for the screenshots]
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


def texts(loc):
    return [" ".join(t.split()) for t in loc.all_inner_texts()]


def tab(a, pg, name):
    a.locator("nav .tab", has_text=name).click()
    pg.wait_for_timeout(450)


def options(a, pg):
    tab(a, pg, "Mais")
    a.locator(".more-row", has_text="Configurações").click()
    pg.wait_for_timeout(400)
    a.locator(".more-tabs button", has_text="Opções").click()
    pg.wait_for_timeout(400)


def in_agora(a):
    return a.evaluate("(el) => [...new Set(el._schedule().map((e) => el._block(e.block).name))]")


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

        # ---- both on to begin with
        options(a, pg)
        panel = a.locator("#organizar")
        labels = texts(panel.locator(".row .label"))
        check(labels == ["Usar categorias", "Controle por pessoa"], f"{tag}: Opções › Blocos: Usar categorias and Controle por pessoa ({labels})")
        cats_sw = panel.locator("input[aria-label='Usar categorias']")
        own_sw = panel.locator("input[aria-label='Controle por pessoa']")
        check(cats_sw.is_checked() and own_sw.is_checked(), f"{tag}: both on")
        pg.screenshot(path=str(SHOTS / f"opcoes-{scheme}-{w}.png"))

        # ---- Usar categorias off
        cats_sw.uncheck()
        pg.wait_for_timeout(400)
        check(texts(panel.locator(".row .hint"))[0] == "Desligado.", f"{tag}: Usar categorias: Desligado.")
        tab(a, pg, "Mais")
        rows = texts(a.locator(".more-menu .more-row"))
        check(not any(r.startswith("Categorias") for r in rows), f"{tag}: no Categorias in Mais ({rows})")
        tab(a, pg, "Blocos")
        check(a.locator(".cat-filter").count() == 0, f"{tag}: Blocos without the category filter")
        a.locator(".who-filter .pick", has_text="Todos").click()
        pg.wait_for_timeout(300)
        a.locator(".cover", has_text="Treino").click()
        pg.wait_for_timeout(500)
        check("Pessoal" not in a.locator(".detail-head .overline").inner_text(), f"{tag}: the block's screen without the category")
        a.locator('[aria-label="Ajustes do bloco"]').click()
        pg.wait_for_timeout(500)
        flabels = texts(a.locator(".sheet .flabel"))
        check("Categoria" not in flabels and "De quem é" in flabels, f"{tag}: the sheet without Categoria ({flabels})")
        pg.go_back()
        pg.wait_for_timeout(400)

        # ---- Controle por pessoa off
        options(a, pg)
        a.locator("#organizar input[aria-label='Controle por pessoa']").uncheck()
        pg.wait_for_timeout(400)
        check(texts(a.locator("#organizar .row .hint"))[1] == "Desligado: todo bloco é de todos.", f"{tag}: Controle por pessoa: every block is everyone's")
        check("Treino" in in_agora(a), f"{tag}: Beto's Treino in Ana's Agora ({in_agora(a)})")
        tab(a, pg, "Blocos")
        check(a.locator(".who-filter").count() == 0, f"{tag}: Blocos without De quem")
        smalls = texts(a.locator(".shelf .cover:not(.add) .sticker small"))
        check(len(smalls) == 4 and not any("de " in s for s in smalls), f"{tag}: every block, without whose ({smalls})")
        pg.screenshot(path=str(SHOTS / f"opcoes-{scheme}-{w}-blocos-desligado.png"))
        tab(a, pg, "Buscar")
        check(a.locator(".who-filter").count() == 0 and a.locator(".search-opts .pick").count() == 1, f"{tag}: Buscar without De quem, with Incluir arquivados")
        tab(a, pg, "Blocos")
        a.locator(".cover", has_text="Treino").click()
        pg.wait_for_timeout(500)
        check("de beto" not in a.locator(".detail-head .overline").inner_text().lower(), f"{tag}: the block's screen without whose")
        a.locator('[aria-label="Ajustes do bloco"]').click()
        pg.wait_for_timeout(500)
        flabels = texts(a.locator(".sheet .flabel"))
        check("De quem é" not in flabels and "Categoria" not in flabels, f"{tag}: the sheet without De quem é ({flabels})")
        a.locator(".sheet .sheet-actions .btn.primary").click()
        pg.wait_for_timeout(600)
        check(a.evaluate("(el) => el._block('treino00001').owner") == "Beto", f"{tag}: saving keeps whose it is")

        # ---- both on again: everything back
        options(a, pg)
        a.locator("#organizar input[aria-label='Usar categorias']").check()
        a.locator("#organizar input[aria-label='Controle por pessoa']").check()
        pg.wait_for_timeout(500)
        check("Treino" not in in_agora(a), f"{tag}: Treino out of Ana's Agora again")
        tab(a, pg, "Blocos")
        check(a.locator(".who-filter").count() == 1 and a.locator(".cat-filter").count() == 1, f"{tag}: De quem and the categories back")
        check(texts(a.locator(".who-filter .pick")) == ["Ana", "Beto", "Todos"], f"{tag}: Todos ({texts(a.locator('.who-filter .pick'))})")
        check(not errs, f"{tag}: no page errors {errs}")
        ctx.close()
    b.close()

print(f"{n_ok} checks passed" if not failed else f"{len(failed)} FAILED, {n_ok} passed")
print(f"screenshots in {SHOTS}")
sys.exit(1 if failed else 0)
