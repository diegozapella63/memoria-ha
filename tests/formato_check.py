# MemorIA 1.27.0: Negrito e cor numa parte do texto. Escrevendo, o botão Negrito e cor (no alto da folha, depois da Caixa
# de marcar) abre a barra: Negrito, as cores e Sem cor, sem tirar o foco da folha (o teclado fica aberto). O que está
# selecionado ganha as marcas (**negrito**, {cor:texto}); outro toque tira. Fora do editor, a parte aparece em negrito ou
# na cor e as marcas somem; um toque no texto volta ao editor no lugar certo. No celular, as margens da folha menores.
# 390 e 320 px, claro e escuro.
#
# Usa a prévia (sem servidor): cd frontend && npm run build, depois
#   python3 tests/formato_check.py [pasta das capturas]
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
SELECT = "(el, [s, e]) => el.renderRoot.querySelector('textarea.ink').setSelectionRange(s, e)"


def tap(pg, loc):
    loc.scroll_into_view_if_needed()
    bx = loc.bounding_box()
    pg.touchscreen.tap(bx["x"] + bx["width"] / 2, bx["y"] + bx["height"] / 2)
    pg.wait_for_timeout(300)


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
        ta = a.locator("textarea.ink")
        ta.click()
        pg.keyboard.type("Café forte e leite")
        pg.wait_for_timeout(200)
        labels = [tools.nth(i).get_attribute("aria-label") for i in range(tools.count())]
        check(labels == ["Caixa de marcar", "Negrito e cor"], f"{tag}: escrevendo, Negrito e cor depois da Caixa de marcar ({labels})")
        tap(pg, tools.nth(1))
        bar = a.locator(".fmt-bar")
        btns = [bar.locator("button").nth(i).get_attribute("aria-label") for i in range(bar.locator("button").count())]
        check(btns == ["Negrito", "Vermelho", "Laranja", "Verde", "Azul", "Lilás", "Sem cor"], f"{tag}: a barra: Negrito, as cores e Sem cor ({btns})")
        check(a.evaluate(FOCUSED), f"{tag}: o teclado fica aberto")
        # Negrito no que está selecionado; outro toque tira
        a.evaluate(SELECT, [5, 10])
        tap(pg, bar.locator(".fmt-b"))
        check(a.evaluate(VALUE) == "Café **forte** e leite", f"{tag}: Negrito põe as marcas ({a.evaluate(VALUE)!r})")
        check(a.evaluate(FOCUSED), f"{tag}: e o foco continua na folha")
        tap(pg, bar.locator(".fmt-b"))
        check(a.evaluate(VALUE) == "Café forte e leite", f"{tag}: outro toque tira o negrito")
        tap(pg, bar.locator(".fmt-b"))
        # a cor em outra parte; a mesma cor de novo tira, outra troca
        v = a.evaluate(VALUE)
        i = v.index("leite")
        a.evaluate(SELECT, [i, i + 5])
        tap(pg, bar.locator(".c-azul"))
        check(a.evaluate(VALUE) == "Café **forte** e {azul:leite}", f"{tag}: a cor ({a.evaluate(VALUE)!r})")
        tap(pg, bar.locator(".c-verde"))
        check(a.evaluate(VALUE) == "Café **forte** e {verde:leite}", f"{tag}: outra cor troca")
        tap(pg, bar.locator(".fmt-x"))
        check(a.evaluate(VALUE) == "Café **forte** e leite", f"{tag}: Sem cor tira a cor")
        tap(pg, bar.locator(".c-verde"))
        check(a.evaluate(OVER) == [], f"{tag}: a barra cabe na tela {a.evaluate(OVER)}")
        when = a.evaluate("(el) => { const x = el.renderRoot.querySelector('.leaf-top .when'); return [getComputedStyle(x).display, x.scrollWidth, x.clientWidth]; }")
        check(when[0] == "none" or when[1] <= when[2], f"{tag}: escrevendo, a data inteira ou nenhuma, nunca cortada ({when})")
        pg.screenshot(path=str(SHOTS / f"formato-{scheme}-{w}-barra.png"))
        # fora do editor: a parte em negrito e na cor, sem as marcas
        tap(pg, a.locator(".leaf-top .ink-done"))
        pg.wait_for_timeout(1200)
        when = a.evaluate("(el) => { const x = el.renderRoot.querySelector('.leaf-top .when'); return [getComputedStyle(x).display, x.textContent, x.scrollWidth, x.clientWidth]; }")
        check(when[0] != "none" and when[1].startswith("hoje") and when[2] <= when[3], f"{tag}: no Pronto, a data volta inteira ({when})")
        view = a.locator(".ink-view")
        check(view.count() == 1 and view.inner_text().strip() == "Café forte e leite", f"{tag}: fora do editor, sem as marcas ({view.inner_text()!r})")
        bold = view.locator(".fmt.b")
        check(bold.count() == 1 and bold.inner_text() == "forte" and int(bold.evaluate("(e) => getComputedStyle(e).fontWeight")) >= 700, f"{tag}: forte em negrito")
        cor = view.locator(".fmt.c-verde")
        check(cor.count() == 1 and cor.inner_text() == "leite" and cor.evaluate("(e) => getComputedStyle(e).color") != view.evaluate("(e) => getComputedStyle(e).color"), f"{tag}: leite em verde")
        pg.screenshot(path=str(SHOTS / f"formato-{scheme}-{w}-folha.png"))
        # um toque na parte colorida volta ao editor no lugar certo
        box = cor.bounding_box()
        pg.touchscreen.tap(box["x"] + 2, box["y"] + box["height"] / 2)
        pg.wait_for_timeout(500)
        pos = a.evaluate("(el) => el.renderRoot.querySelector('textarea.ink').selectionStart")
        v = a.evaluate(VALUE)
        check(a.evaluate(FOCUSED) and v.index("leite") <= pos <= v.index("leite") + 2, f"{tag}: o toque abre o editor no lugar ({pos}, {v!r})")
        tap(pg, a.locator(".leaf-top .ink-done"))
        # 1.27.0: no celular, a folha com margens menores
        if w <= 390:
            pad = a.evaluate("(el) => parseFloat(getComputedStyle(el.renderRoot.querySelector('.ink')).paddingLeft)")
            check(pad <= 44, f"{tag}: a margem da esquerda menor no celular ({pad})")
        check(not errs, f"{tag}: no page errors {errs}")
        ctx.close()
    b.close()

print(f"{n_ok} checks passed" if not failed else f"FAILED: {failed}")
sys.exit(1 if failed else 0)
