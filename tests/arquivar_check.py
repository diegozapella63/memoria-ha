# MemorIA 1.9.0: Arquivar bloco. In the block's sheet, "Arquivar bloco" (nothing is deleted): the block leaves the
# shelf, Agora (and its times), Nova and Buscar and waits under "Arquivados (N)", folded at the end of the shelf;
# Desfazer brings it back. Its own screen says "Arquivado em …" with Desarquivar. Buscar finds it only with
# "Incluir arquivados" (kept on this device). The phone's Back closes the sheet. 390 and 320 px, light and dark.
#
# Uses the preview (no server; the sample has Viagem archived): cd frontend && npm run build, then
#   python3 tests/arquivar_check.py [folder for the screenshots]
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


def covers(a):
    return texts(a.locator(".shelf .cover:not(.add) .sticker b"))


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

        # ---- Agora: the archived Viagem (08:00) never opens by itself
        check("Viagem" not in in_agora(a), f"{tag}: Viagem is not in the day of Agora ({in_agora(a)})")

        # ---- Blocos: the shelf without it, Arquivados (1) folded at the end
        a.locator("nav .tab", has_text="Blocos").click()
        pg.wait_for_timeout(500)
        check(covers(a) == ["Treino", "Trabalho", "Diário", "Ideias"], f"{tag}: the shelf without Viagem ({covers(a)})")
        check(a.locator(".page .status").first.inner_text().strip() == "4 blocos · 8 folhas", f"{tag}: the count leaves it out")
        head = a.locator(".arch-head")
        check(head.count() == 1 and " ".join(head.inner_text().split()) == "Arquivados 1" and head.get_attribute("aria-expanded") == "false", f"{tag}: Arquivados 1, folded")
        check(a.locator(".arch-row").count() == 0, f"{tag}: nothing under it until tapped")
        check(a.evaluate("(el) => { const r = el.renderRoot; const s = r.querySelector('.shelf').getBoundingClientRect(), h = r.querySelector('.arch-panel').getBoundingClientRect(); return h.top > s.bottom; }"), f"{tag}: after the shelf")
        head.click()
        pg.wait_for_timeout(300)
        rows = texts(a.locator(".arch-row"))
        check(len(rows) == 1 and rows[0].startswith("Viagem 2 folhas · arquivado em "), f"{tag}: the archived block, its sheets and since when ({rows})")
        check(head.get_attribute("aria-expanded") == "true", f"{tag}: open")
        a.locator(".arch-panel").scroll_into_view_if_needed()
        check(a.evaluate(OVER) == [], f"{tag}: nothing out of the screen on the shelf {a.evaluate(OVER)}")
        pg.screenshot(path=str(SHOTS / f"arquivar-{scheme}-{w}-blocos.png"))

        # ---- its own screen: Arquivado em …, Desarquivar
        a.locator(".arch-row").first.click()
        pg.wait_for_timeout(500)
        check(view(a) == "block" and a.locator(".detail-head h1").inner_text().strip() == "Viagem", f"{tag}: Viagem opens")
        card = a.locator(".arch-card")
        check(card.count() == 1 and "Arquivado em " in card.inner_text() and "Não abre sozinho." in card.inner_text(), f"{tag}: Arquivado em …, it doesn't open by itself ({card.inner_text() if card.count() else ''})")
        check(a.locator(".when-line").count() == 0, f"{tag}: no Abre sozinho")
        check(a.evaluate(OVER) == [], f"{tag}: nothing out of the screen on its screen {a.evaluate(OVER)}")
        pg.screenshot(path=str(SHOTS / f"arquivar-{scheme}-{w}-arquivado.png"))
        card.locator(".text-btn", has_text="Desarquivar").click()
        pg.wait_for_timeout(500)
        check(a.locator(".toast").inner_text().strip() == "Bloco de volta aos blocos", f"{tag}: Desarquivar says so")
        check(a.locator(".arch-card").count() == 0 and a.locator(".when-line").count() == 1, f"{tag}: back to normal (Abre sozinho: 08:00)")
        check("Viagem" in in_agora(a), f"{tag}: back in Agora at 08:00")

        # ---- Arquivar bloco in its sheet (with the rest of the sheet); the phone's Back closes the sheet
        a.locator('[aria-label="Ajustes do bloco"]').click()
        pg.wait_for_timeout(500)
        row = a.locator(".sheet .arch-toggle")
        check(row.count() == 1 and row.inner_text().strip() == "Arquivar bloco", f"{tag}: Arquivar bloco in the block's sheet")
        pg.go_back()
        pg.wait_for_timeout(400)
        check(a.evaluate("(el) => el._sheet") is None and view(a) == "block", f"{tag}: Back closes the sheet, the block stays")
        a.locator('[aria-label="Ajustes do bloco"]').click()
        pg.wait_for_timeout(500)
        a.locator(".sheet input[type=text]").first.fill("Viagem da serra")
        a.locator(".sheet").evaluate("(e) => e.scrollTop = 99999")
        pg.wait_for_timeout(200)
        if w == 320:
            check(a.evaluate(OVER) == [], f"{tag}: nothing out of the screen in the sheet {a.evaluate(OVER)}")
        pg.screenshot(path=str(SHOTS / f"arquivar-{scheme}-{w}-folha.png"))
        a.locator(".sheet .arch-toggle").click()
        pg.wait_for_timeout(700)
        check(view(a) == "shelf" and a.evaluate("(el) => el._sheet") is None, f"{tag}: back to Blocos ({view(a)})")
        toast = a.locator(".toast")
        check(toast.count() == 1 and "Bloco arquivado" in toast.inner_text() and toast.locator("button", has_text="Desfazer").count() == 1, f"{tag}: Bloco arquivado · Desfazer")
        state = a.evaluate("(el) => { const b = el._block('viagem00001'); return [b.name, !!b.archived, el._data.pages.filter((p) => p.block === b.id).length]; }")
        check(state == ["Viagem da serra", True, 2], f"{tag}: archived with the name changed in the sheet, sheets kept ({state})")
        check("Viagem da serra" not in covers(a), f"{tag}: off the shelf")
        toast.locator("button", has_text="Desfazer").click()
        pg.wait_for_timeout(500)
        check("Viagem da serra" in covers(a) and a.locator(".arch-head").count() == 0, f"{tag}: Desfazer brings it back ({covers(a)})")
        # archived again for the rest
        a.evaluate("(el) => el._setArchived(el._block('viagem00001'), true)")
        pg.wait_for_timeout(400)

        # ---- Nova: not a place for a new sheet
        a.locator("nav .tab.fab").click()
        pg.wait_for_timeout(500)
        targets = texts(a.locator(".sheet .chip-row .pick"))
        check("Viagem da serra" not in targets and len(targets) == 4, f"{tag}: Nova without the archived block ({targets})")
        pg.go_back()
        pg.wait_for_timeout(400)

        # ---- Buscar: only with Incluir arquivados (kept on this device)
        a.locator("nav .tab", has_text="Buscar").click()
        pg.wait_for_timeout(400)
        a.locator(".search-box input").fill("trilha")
        pg.wait_for_timeout(300)
        check(a.locator(".result").count() == 0 and "Nada encontrado" in a.locator(".page").inner_text(), f"{tag}: Buscar leaves it out")
        chip = a.locator(".search-opts .pick")
        check(chip.count() == 1 and chip.inner_text().strip() == "Incluir arquivados" and chip.get_attribute("aria-pressed") == "false", f"{tag}: Incluir arquivados, off")
        chip.click()
        pg.wait_for_timeout(300)
        metas = texts(a.locator(".result .r-meta"))
        check(len(metas) == 2 and all(m.startswith("Viagem da serra · arquivado · ") for m in metas), f"{tag}: with it, the sheets of the archived block, marked ({metas})")
        check(a.evaluate(OVER) == [], f"{tag}: nothing out of the screen in Buscar {a.evaluate(OVER)}")
        pg.screenshot(path=str(SHOTS / f"arquivar-{scheme}-{w}-buscar.png"))
        pg.reload()
        a.locator(".page-title").first.wait_for()
        pg.wait_for_timeout(500)
        a.locator("nav .tab", has_text="Buscar").click()
        pg.wait_for_timeout(400)
        check(a.locator(".search-opts .pick").get_attribute("aria-pressed") == "true", f"{tag}: the choice is kept")
        a.locator(".search-opts .pick").click()
        pg.wait_for_timeout(200)

        # ---- Agora with every block of Ana archived: it says where they are
        a.evaluate("async (el) => { for (const b of el._blocks()) await el.api.saveBlock({ id: b.id, archived: true }); }")
        pg.wait_for_timeout(500)
        a.locator("nav .tab", has_text="Agora").click()
        pg.wait_for_timeout(500)
        check(a.locator(".page .status").first.inner_text().strip() == "Nenhum bloco aqui", f"{tag}: Agora: Nenhum bloco aqui")
        check("Os blocos arquivados e os de outras pessoas ficam em Blocos." in a.locator(".page .empty").inner_text(), f"{tag}: and where they are")
        btns = a.locator(".page .sheet-actions .btn")
        widths = [round(x["width"]) for x in btns.evaluate_all("(els) => els.map((e) => e.getBoundingClientRect().toJSON())")]
        check(texts(btns) == ["Ver blocos", "Novo bloco"] and len(set(widths)) == 1, f"{tag}: Ver blocos and Novo bloco, the same width ({widths})")
        pg.screenshot(path=str(SHOTS / f"arquivar-{scheme}-{w}-agora-vazio.png"))
        btns.first.click()
        pg.wait_for_timeout(400)
        check(view(a) == "shelf" and a.locator(".arch-head .count").inner_text().strip() == "5", f"{tag}: Ver blocos: Arquivados 5")

        check(not errs, f"{tag}: no page errors {errs}")
        ctx.close()
    b.close()

print(f"{n_ok} checks passed" if not failed else f"{len(failed)} FAILED, {n_ok} passed")
print(f"screenshots in {SHOTS}")
sys.exit(1 if failed else 0)
