# MemorIA 1.12.0: no alto da folha, Caixa de marcar. Caixa de marcar faz da linha do cursor um item (☐) ou tira a
# caixa; fora do editor, põe um item novo no fim. Enter num item faz outro embaixo; Enter num item vazio acaba a lista.
# 1.21.0: os Emojis saíram (o teclado do celular já tem) e, escrevendo, o Pronto fica no lugar do número da folha: um
# toque sai do editor (o teclado fecha e as caixas voltam). Fora do editor, as caixas viram quadradinhos: um toque marca
# como feito (☑, o texto riscado) e o outro desmarca, sem abrir o editor; fica salvo. 390 e 320 px, claro e escuro.
#
# Usa a prévia (sem servidor): cd frontend && npm run build, depois
#   python3 tests/caixas_check.py [pasta das capturas]
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
  for (const e of el.renderRoot.querySelectorAll(".page *")) {
    if (e.closest(".cat-filter, .who-filter, .tline")) continue;
    const r = e.getBoundingClientRect();
    if (r.width && (r.right > W + 1 || r.left < -1)) bad.push(e.tagName.toLowerCase() + "." + [...e.classList].join(".") + " " + Math.round(r.left) + ".." + Math.round(r.right));
  }
  if (document.documentElement.scrollWidth > W) bad.push("page " + document.documentElement.scrollWidth);
  return bad.slice(0, 4);
}"""
VALUE = "(el) => el.renderRoot.querySelector('textarea.ink').value"
FOCUSED = "(el) => el.renderRoot.activeElement === el.renderRoot.querySelector('textarea.ink')"


def tap(pg, loc):
    loc.scroll_into_view_if_needed()
    bx = loc.bounding_box()
    pg.touchscreen.tap(bx["x"] + bx["width"] / 2, bx["y"] + bx["height"] / 2)
    pg.wait_for_timeout(350)


with sync_playwright() as p:
    b = p.chromium.launch()
    for scheme, w in (("light", 390), ("dark", 390), ("light", 320)):
        tag = f"{scheme} {w}px"
        ctx = b.new_context(viewport={"width": w, "height": 844}, device_scale_factor=2, color_scheme=scheme, has_touch=True, is_mobile=True)
        pg = ctx.new_page()
        errs = []
        pg.on("pageerror", lambda e: errs.append(str(e)))
        pg.goto(PREVIEW)
        a = pg.locator("memoria-app")
        a.locator(".page-title").first.wait_for()
        pg.wait_for_timeout(500)
        a.evaluate("(el) => el._openPage('ideias00001', 'new')")
        pg.wait_for_timeout(900)
        tools = a.locator(".leaf-top .tool")
        check([tools.nth(i).get_attribute("aria-label") for i in range(tools.count())] == ["Caixa de marcar"], f"{tag}: no alto da folha, Caixa de marcar (sem os Emojis)")
        done = a.locator(".leaf-top .ink-done")

        # ---- Caixa de marcar e o Enter
        ta = a.locator("textarea.ink")
        ta.click()
        pg.keyboard.type("Feira")
        tap(pg, tools.nth(0))
        check(a.evaluate(VALUE) == "☐ Feira", f"{tag}: a linha vira um item ({a.evaluate(VALUE)!r})")
        check(a.locator(".ink-view").count() == 0, f"{tag}: escrevendo a folha nova, o editor (e não a vista das caixas)")
        check(a.evaluate(FOCUSED), f"{tag}: o teclado fica aberto (o foco continua na folha)")
        pg.keyboard.press("End")
        pg.keyboard.press("Enter")
        pg.keyboard.type("Pão")
        pg.keyboard.press("Enter")
        pg.keyboard.type("Leite")
        check(a.evaluate(VALUE) == "☐ Feira\n☐ Pão\n☐ Leite", f"{tag}: Enter num item faz outro embaixo ({a.evaluate(VALUE)!r})")
        pg.keyboard.press("Enter")
        pg.keyboard.press("Enter")
        pg.keyboard.type("Fim da lista")
        check(a.evaluate(VALUE) == "☐ Feira\n☐ Pão\n☐ Leite\nFim da lista", f"{tag}: Enter num item vazio acaba a lista ({a.evaluate(VALUE)!r})")
        tap(pg, tools.nth(0))
        tap(pg, tools.nth(0))
        check(a.evaluate(VALUE).endswith("\nFim da lista"), f"{tag}: de novo, a caixa sai ({a.evaluate(VALUE)!r})")

        # ---- Pronto: escrevendo, no lugar do número da folha
        check(done.count() == 1 and done.inner_text().strip() == "Pronto" and a.locator(".leaf-top .num").count() == 0, f"{tag}: escrevendo, o Pronto no lugar do número")
        check(not a.evaluate(OVER), f"{tag}: nada passa da largura {a.evaluate(OVER)}")
        pg.screenshot(path=str(SHOTS / f"caixas-editor-{scheme}-{w}.png"))
        tap(pg, tools.nth(0))
        check(a.evaluate(FOCUSED) and done.count() == 1, f"{tag}: a Caixa de marcar não tira do editor")
        tap(pg, tools.nth(0))
        pid = a.evaluate("(el) => el._pad.page")

        # ---- Pronto: um toque sai do editor; fora dele, um toque marca como feito
        tap(pg, done)
        pg.wait_for_timeout(300)
        check(not a.evaluate(FOCUSED) and a.evaluate("(el) => el._editing") is None and done.count() == 0, f"{tag}: Pronto sai do editor")
        check(a.locator(".leaf-top .num").count() == 1, f"{tag}: fora do editor, o número da folha de novo")
        boxes = a.locator(".ink-view .chk")
        check(boxes.count() == 3 and all(boxes.nth(i).get_attribute("aria-checked") == "false" for i in range(3)), f"{tag}: fora do editor, três caixas para marcar")
        txt = a.locator(".ink-view").inner_text()
        check("☐" not in txt and "Pão" in txt, f"{tag}: o quadradinho no lugar do ☐")
        tap(pg, boxes.nth(1))
        check(boxes.nth(1).get_attribute("aria-checked") == "true" and a.evaluate("(el) => el._editing") is None, f"{tag}: um toque marca como feito, sem abrir o editor")
        check(a.evaluate(f"(el) => el._page('{pid}').text") == "☐ Feira\n☑ Pão\n☐ Leite\nFim da lista", f"{tag}: a folha guarda o ☑ ({a.evaluate(f'(el) => el._page({chr(39)}{pid}{chr(39)}).text')!r})")
        deco = a.evaluate("(el) => getComputedStyle(el.renderRoot.querySelectorAll('.ink-view .chk-line')[1].querySelector('.chk ~ span')).textDecorationLine")
        check(deco == "line-through", f"{tag}: o feito fica riscado ({deco})")
        pg.screenshot(path=str(SHOTS / f"caixas-feito-{scheme}-{w}.png"))
        pg.wait_for_timeout(600)
        saved = a.evaluate(f"(el) => el.api.data ? (el.api.data.pages.find((p) => p.id === '{pid}') || {{}}).text : null")
        check(saved in (None, "☐ Feira\n☑ Pão\n☐ Leite\nFim da lista"), f"{tag}: e fica salvo ({saved!r})")
        tap(pg, boxes.nth(1))
        check(boxes.nth(1).get_attribute("aria-checked") == "false", f"{tag}: outro toque desmarca")
        # Caixa de marcar fora do editor: um item novo no fim, com o teclado
        tap(pg, tools.nth(0))
        check(a.evaluate(VALUE).endswith("\nFim da lista\n☐ ") and a.evaluate(FOCUSED), f"{tag}: fora do editor, um item novo no fim ({a.evaluate(VALUE)[-12:]!r})")
        check(not errs, f"{tag}: sem erros {errs}")
        ctx.close()
    b.close()

print(f"{n_ok} checks passed" if not failed else f"{len(failed)} FAILED of {n_ok + len(failed)}")
print(f"screenshots in {SHOTS}")
sys.exit(1 if failed else 0)
