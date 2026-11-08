# MemorIA 1.10.1: Agora, the buttons of the sheets and the name of a block.
# - Agora: a sheet with its own time opens its block (also a block without times) for its owner; when nothing with a
#   time is this person's (or everyone's), no block pretends to be the one of the moment: "Nada com horário", and
#   whose the blocks with a time are. A login that is not a person of the house sees them.
# - The block's screen: "Abre sozinho no Agora de Beto: folha 2 às 18:00".
# - The choices of the block's sheet (Categoria, De quem é, Manhã/Tarde/Noite) and of Nova (No bloco): a grid of
#   buttons of the same size.
# - The name of a block on its screen has the whole width and never breaks inside a word (it shrinks to fit).
# 390 and 320 px, light and dark.
#
# Uses the preview (no server; Ana uses it, Treino is Beto's): cd frontend && npm run build, then
#   python3 tests/agora_check.py [folder for the screenshots]
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

# the name: one word never split over two lines, nothing wider than its box, the box as wide as the screen allows
TITLE = """(el) => {
  const h = el.renderRoot.querySelector('.detail-head h1');
  const r = document.createRange();
  r.selectNodeContents(h);
  const lines = new Set([...r.getClientRects()].map((x) => Math.round(x.top))).size;
  return { lines, fits: h.scrollWidth <= h.clientWidth + 1, width: h.clientWidth, font: parseFloat(getComputedStyle(h).fontSize) };
}"""

WIDTHS = """(els) => els.map((e) => Math.round(e.getBoundingClientRect().width))"""


def texts(loc):
    return [" ".join(t.split()) for t in loc.all_inner_texts()]


def open_block(a, pg, name):
    a.locator("nav .tab", has_text="Blocos").click()
    pg.wait_for_timeout(400)
    # Blocos de quem (1.10.0) starts with Ana's: every block
    who = a.locator(".who-filter .pick", has_text="Todos")
    if who.count() and who.get_attribute("aria-checked") != "true":
        who.click()
        pg.wait_for_timeout(300)
    a.locator(".cover", has_text=name).click()
    pg.wait_for_timeout(500)


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

        # ---- the house of the owner's question, invented: no block opens by itself; only a sheet of Treino (Beto's)
        # at 18:00; more categories; a long name
        a.evaluate(
            """async (el) => {
              for (const b of el._blocks()) await el.api.saveBlock({ id: b.id, periods: [], times: [] });
              for (const p of el._data.pages) if ((p.times || []).length) await el.api.savePage({ id: p.id, times: [] });
              await el.api.savePage({ id: el._pagesOf('treino00001')[1].id, times: ['18:00'] });
              for (const [name, color] of [['Casa', 'menta'], ['Hobbies', 'rosa'], ['Saúde', 'vermelho']]) await el.api.saveCategory({ name, color });
              await el.api.saveBlock({ id: 'ideias00001', name: 'Planejamento' });
            }"""
        )
        pg.wait_for_timeout(600)
        a.locator("nav .tab", has_text="Blocos").click()
        pg.wait_for_timeout(300)
        a.locator("nav .tab", has_text="Agora").click()
        pg.wait_for_timeout(500)

        # ---- Agora of Ana: nothing hers with a time; no block of the moment
        check(a.evaluate("(el) => el._pad") is None, f"{tag}: no block is put in Agora")
        check(a.locator(".page-title").first.inner_text().strip() == "Agora", f"{tag}: the title is Agora, not a block")
        status = a.locator(".page .status").first.inner_text().strip()
        check(status.endswith(" · nada com horário"), f"{tag}: the status says nothing has a time ({status})")
        empty = a.locator(".now-empty")
        check(empty.locator("h3").inner_text().strip() == "Nada com horário", f"{tag}: Nada com horário")
        check(empty.locator(".now-whose").inner_text().strip() == "Treino é de Beto: só abre no Agora de Beto.", f"{tag}: whose the block with a time is")
        check(a.locator(".page .pad").count() == 0 and a.locator(".tline").count() == 0, f"{tag}: no notebook, no line of the day")
        widths = a.locator(".page > .sheet-actions .btn").evaluate_all(WIDTHS)
        check(texts(a.locator(".page > .sheet-actions .btn")) == ["Ver blocos", "Novo bloco"] and len(set(widths)) == 1, f"{tag}: Ver blocos and Novo bloco, the same width ({widths})")
        check(a.evaluate(OVER) == [], f"{tag}: nothing out of the screen in Agora {a.evaluate(OVER)}")
        pg.screenshot(path=str(SHOTS / f"agora-{scheme}-{w}-nada.png"))

        # ---- Beto: his sheet at 18:00 is the one of the moment, all day (since yesterday before 18:00)
        a.evaluate("(el) => { el._user = { name: 'Beto', person: 'Beto' }; el._cache = { ...el._cache, data: null }; el._enterView(); el.requestUpdate(); }")
        pg.wait_for_timeout(500)
        pad = a.evaluate("(el) => el._pad && [el._block(el._pad.block).name, el._pagesOf(el._pad.block).findIndex((p) => p.id === el._pad.page) + 1]")
        check(pad == ["Treino", 2], f"{tag}: Beto's Agora opens Treino on the sheet at 18:00 ({pad})")
        status = a.locator(".page .status").first.inner_text().strip()
        hour = a.evaluate("() => new Date().getHours()")
        check((" · desde ontem às 18:00" in status) if hour < 18 else (" · desde 18:00" in status), f"{tag}: since 18:00 ({status})")
        check("depois" not in status, f"{tag}: no 'depois' with one time only")
        check(a.locator(".tline .tchip").count() == 1 and "18:00" in a.locator(".tline .tchip").inner_text(), f"{tag}: the line of the day has the sheet at 18:00")
        pg.screenshot(path=str(SHOTS / f"agora-{scheme}-{w}-beto.png"))
        # a shared tablet: everything
        a.evaluate("(el) => { el._user = { name: 'Tablet', person: '' }; el._cache = { ...el._cache, data: null }; el._enterView(); el.requestUpdate(); }")
        pg.wait_for_timeout(400)
        check(a.evaluate("(el) => el._pad && el._block(el._pad.block).name") == "Treino", f"{tag}: a shared tablet sees it too")
        a.evaluate("(el) => { el._user = { name: 'Ana Souza', person: 'Ana' }; el._cache = { ...el._cache, data: null }; el._enterView(); el.requestUpdate(); }")
        pg.wait_for_timeout(300)

        # ---- the block's screen: whose Agora, the sheet with a time; the name with the whole width
        open_block(a, pg, "Treino")
        line = " ".join(a.locator(".when-line").inner_text().split())
        check(line == "Abre sozinho no Agora de Beto: folha 2 às 18:00", f"{tag}: the sheet with a time opens it ({line})")
        open_block(a, pg, "Planejamento")
        t = a.evaluate(TITLE)
        check(t["lines"] == 1 and t["fits"], f"{tag}: Planejamento on one line, whole ({t})")
        check(t["width"] >= w - 50, f"{tag}: the name has the whole width ({t['width']} of {w})")
        check(a.evaluate("(el) => { const r = el.renderRoot; return r.querySelector('.detail-head h1').getBoundingClientRect().top > r.querySelector('[aria-label=\"Ajustes do bloco\"]').getBoundingClientRect().bottom - 2; }"), f"{tag}: below the buttons")
        check(a.evaluate(OVER) == [], f"{tag}: nothing out of the screen on the block {a.evaluate(OVER)}")
        pg.screenshot(path=str(SHOTS / f"agora-{scheme}-{w}-bloco.png"))
        # a word longer than the screen: smaller letters, never broken
        a.evaluate("(el) => el.api.saveBlock({ id: 'ideias00001', name: 'Desenvolvimentopessoalcompleto' })")
        pg.wait_for_timeout(500)
        t = a.evaluate(TITLE)
        check(t["lines"] == 1 and t["fits"] and t["font"] < 34, f"{tag}: a long word shrinks to fit ({t})")
        a.evaluate("(el) => el.api.saveBlock({ id: 'ideias00001', name: 'Receitas de família para o fim de semana' })")
        pg.wait_for_timeout(500)
        t = a.evaluate(TITLE)
        check(t["fits"] and t["font"] >= 34 and t["lines"] >= 2, f"{tag}: several words wrap between words, big ({t})")
        pg.screenshot(path=str(SHOTS / f"agora-{scheme}-{w}-nome-longo.png"))

        # ---- the block's sheet: the choices in a grid of the same size
        a.locator('[aria-label="Ajustes do bloco"]').click()
        pg.wait_for_timeout(500)
        for sel, what in ((".cat-pick .pick", "Categoria"), (".owner-pick .pick", "De quem é"), (".periods-pick .pick", "Manhã, Tarde, Noite")):
            ws = a.locator(f".sheet {sel}").evaluate_all(WIDTHS)
            check(len(ws) >= 3 and max(ws) - min(ws) <= 1, f"{tag}: {what} with the same width ({ws})")
        cats = texts(a.locator(".sheet .cat-pick .pick"))
        check(cats == ["Sem categoria", "Pessoal", "Trabalho", "Casa", "Hobbies", "Saúde", "Nova"], f"{tag}: the categories ({cats})")
        cols = a.locator(".sheet .cat-pick").evaluate("(e) => getComputedStyle(e).gridTemplateColumns.split(' ').length")
        check(cols == (3 if w >= 390 else 2), f"{tag}: {cols} columns")
        tops = a.locator(".sheet .periods-pick .pick").evaluate_all("(els) => els.map((e) => Math.round(e.getBoundingClientRect().top))")
        check(len(set(tops)) == 1, f"{tag}: Manhã, Tarde and Noite side by side ({tops})")
        check(a.evaluate(OVER) == [], f"{tag}: nothing out of the screen in the sheet {a.evaluate(OVER)}")
        a.locator(".sheet .cat-pick").scroll_into_view_if_needed()
        pg.screenshot(path=str(SHOTS / f"agora-{scheme}-{w}-ajustes.png"))
        a.locator(".sheet .periods-pick").scroll_into_view_if_needed()
        pg.screenshot(path=str(SHOTS / f"agora-{scheme}-{w}-ajustes2.png"))
        pg.go_back()
        pg.wait_for_timeout(400)

        # ---- Nova: No bloco, the same size too
        a.locator("nav .tab.fab").click()
        pg.wait_for_timeout(500)
        ws = a.locator(".sheet .block-pick .pick").evaluate_all(WIDTHS)
        check(len(ws) == 4 and max(ws) - min(ws) <= 1, f"{tag}: Nova › No bloco with the same width ({ws})")
        pg.go_back()
        pg.wait_for_timeout(300)

        check(not errs, f"{tag}: no page errors {errs}")
        ctx.close()
    b.close()

print(f"{n_ok} checks passed" if not failed else f"{len(failed)} FAILED, {n_ok} passed")
print(f"screenshots in {SHOTS}")
sys.exit(1 if failed else 0)
