# MemorIA 1.28.0: escrevendo, a barra de baixo (no lugar das abas) com Caixa de marcar, Negrito, Cor, Emoji e Pronto; sem
# selecionar, o negrito e a cor vão na palavra do cursor. 1.27.0: Negrito e cor numa parte do texto. Escrevendo, o botão Negrito e cor (no alto da folha, depois da Caixa
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
        ta = a.locator("textarea.ink")
        ta.click()
        pg.keyboard.type("Café forte e leite")
        pg.wait_for_timeout(200)
        # 1.28.0: escrevendo, a barra de baixo (no lugar das abas): Caixa de marcar, Negrito, Cor, Emoji e Pronto
        bar = a.locator("nav.write")
        labels = [x.get_attribute("aria-label") or x.inner_text().strip() for x in bar.locator(".wtools button").all()]
        check(labels == ["Caixa de marcar", "Negrito", "Maior", "Cor", "Emoji", "Pronto"] and a.locator("nav .tabs").count() == 0, f"{tag}: escrevendo, a barra de baixo no lugar das abas ({labels})")
        check(a.locator(".leaf-top .tool").count() == 0, f"{tag}: e nada de ferramentas no alto da folha (o menu do celular sobre a seleção não as cobre)")
        neg = bar.locator(".wbtn[aria-label='Negrito']")
        cor = bar.locator(".wbtn[aria-label='Cor']")
        emo = bar.locator(".wbtn[aria-label='Emoji']")
        # Negrito no que está selecionado; outro toque tira
        a.evaluate(SELECT, [5, 10])
        tap(pg, neg)
        check(a.evaluate(VALUE) == "Café **forte** e leite", f"{tag}: Negrito põe as marcas ({a.evaluate(VALUE)!r})")
        check(a.evaluate(FOCUSED), f"{tag}: e o foco continua na folha (o teclado fica aberto)")
        # 1.28.0: escrevendo, o negrito já aparece: o texto desenhado por cima do editor, no mesmo lugar, as marcas apagadas
        mir = a.evaluate("""(el) => { const ta = el.renderRoot.querySelector('textarea.ink'); const m = el.renderRoot.querySelector('.ink-mirror');
          if (!m) return null; const r1 = ta.getBoundingClientRect(), r2 = m.getBoundingClientRect(), b = m.querySelector('.lb:not(.mk)'), k = m.querySelector('.mk');
          return { same: [r1.left, r1.top, r1.width, r1.height].every((v, i) => Math.abs(v - [r2.left, r2.top, r2.width, r2.height][i]) < 0.5), text: m.textContent === ta.value,
            live: ta.classList.contains('live') && getComputedStyle(ta).webkitTextFillColor, bold: b && b.textContent, stroke: b && getComputedStyle(b).webkitTextStrokeWidth, faint: k && +getComputedStyle(k).opacity }; }""")
        check(mir and mir["same"] and mir["text"] and mir["live"] == "rgba(0, 0, 0, 0)" and mir["bold"] == "forte" and mir["stroke"] != "0px" and mir["faint"] < 0.5, f"{tag}: escrevendo, o negrito já aparece, no lugar das letras do editor ({mir})")
        pg.screenshot(path=str(SHOTS / f"formato-{scheme}-{w}-escrevendo.png"))
        tap(pg, neg)
        check(a.evaluate(VALUE) == "Café forte e leite" and a.locator(".ink-mirror").count() == 0, f"{tag}: outro toque tira o negrito (e o texto volta a ser o do editor)")
        # sem selecionar: a palavra do cursor
        a.evaluate(SELECT, [7, 7])
        tap(pg, neg)
        caret = a.evaluate("(el) => el.renderRoot.querySelector('textarea.ink').selectionStart")
        check(a.evaluate(VALUE) == "Café **forte** e leite" and caret == 9, f"{tag}: sem selecionar, o negrito na palavra do cursor, que fica no lugar ({a.evaluate(VALUE)!r}, {caret})")
        # o toque no botão desfez a seleção (como pode acontecer no celular): vale a de quando o dedo encostou
        a.evaluate("(el) => el.renderRoot.querySelector(\"nav.write .wbtn[aria-label='Negrito']\").addEventListener('pointerup', () => el.renderRoot.querySelector('textarea.ink').setSelectionRange(0, 0), { once: true })")
        a.evaluate(SELECT, [0, 4])
        tap(pg, neg)
        check(a.evaluate(VALUE) == "**Café** **forte** e leite", f"{tag}: a seleção de quando o dedo encostou ({a.evaluate(VALUE)!r})")
        a.evaluate(SELECT, [3, 3])
        tap(pg, neg)
        check(a.evaluate(VALUE) == "Café **forte** e leite", f"{tag}: o cursor numa parte em negrito: tira")
        # a Cor abre as cores logo acima da barra; a mesma cor de novo tira, outra troca
        tap(pg, cor)
        pop = a.locator("nav.write .wpop")
        btns = [x.get_attribute("aria-label") for x in pop.locator("button").all()]
        check(btns == ["Vermelho", "Laranja", "Verde", "Azul", "Lilás", "Sem cor"] and cor.get_attribute("aria-expanded") == "true", f"{tag}: Cor: as cores e Sem cor ({btns})")
        check(a.evaluate(FOCUSED), f"{tag}: abrir as cores não fecha o teclado")
        pg.screenshot(path=str(SHOTS / f"formato-{scheme}-{w}-cores.png"))
        v = a.evaluate(VALUE)
        i = v.index("leite")
        a.evaluate(SELECT, [i, i + 5])
        tap(pg, pop.locator(".c-azul"))
        check(a.evaluate(VALUE) == "Café **forte** e {azul:leite}" and pop.count() == 0, f"{tag}: a cor, e as cores fecham ({a.evaluate(VALUE)!r})")
        a.evaluate(SELECT, [i + 8, i + 8])
        tap(pg, cor)
        tap(pg, pop.locator(".c-verde"))
        check(a.evaluate(VALUE) == "Café **forte** e {verde:leite}", f"{tag}: o cursor na parte colorida: outra cor troca ({a.evaluate(VALUE)!r})")
        tap(pg, cor)
        tap(pg, pop.locator(".fmt-x"))
        check(a.evaluate(VALUE) == "Café **forte** e leite", f"{tag}: Sem cor tira a cor")
        a.evaluate(SELECT, [i + 2, i + 2])
        tap(pg, cor)
        tap(pg, pop.locator(".c-verde"))
        check(a.evaluate(VALUE) == "Café **forte** e {verde:leite}", f"{tag}: sem selecionar, a cor na palavra do cursor ({a.evaluate(VALUE)!r})")
        # Emoji: entra onde está o cursor, sem fechar o teclado; o usado vem primeiro da próxima vez
        tap(pg, emo)
        ems = a.locator("nav.write .wpop.emojis .emo")
        check(ems.count() == 24 and ems.nth(0).inner_text() == "✅", f"{tag}: Emoji: os emojis ({ems.count()})")
        check(not a.evaluate(OVER) and all(bx["x"] >= 0 and bx["x"] + bx["width"] <= w + 1 for bx in [e.bounding_box() for e in ems.all()]), f"{tag}: os emojis cabem na tela")
        pg.screenshot(path=str(SHOTS / f"formato-{scheme}-{w}-emojis.png"))
        n = len(a.evaluate(VALUE))
        a.evaluate(SELECT, [n, n])
        tap(pg, ems.nth(2))
        check(a.evaluate(VALUE).endswith("⭐") and a.evaluate(FOCUSED), f"{tag}: o emoji entra no cursor ({a.evaluate(VALUE)!r})")
        pg.keyboard.press("Backspace")
        tap(pg, emo)
        tap(pg, emo)
        check(a.locator("nav.write .wpop.emojis .emo").nth(0).inner_text() == "⭐", f"{tag}: o usado vem primeiro")
        tap(pg, emo)
        check(a.locator("nav.write .wpop").count() == 0, f"{tag}: Emoji de novo fecha")
        # 1.29.0: Maior, sem selecionar, a linha toda (um título); escrevendo, ela fica sublinhada (o tamanho, no Pronto)
        maior = bar.locator(".wbtn[aria-label='Maior']")
        a.evaluate(SELECT, [2, 2])
        tap(pg, maior)
        check(a.evaluate(VALUE) == "++Café **forte** e {verde:leite}++" and a.evaluate(FOCUSED), f"{tag}: Maior: a linha do cursor ({a.evaluate(VALUE)!r})")
        lg = a.evaluate("(el) => { const x = el.renderRoot.querySelector('.ink-mirror .lg'); return x && [getComputedStyle(x).textDecorationStyle, getComputedStyle(x).fontSize === getComputedStyle(el.renderRoot.querySelector('.ink-mirror')).fontSize]; }")
        check(lg == ["dotted", True], f"{tag}: escrevendo, a parte maior sublinhada, do tamanho das letras do editor ({lg})")
        wide = a.evaluate("(el) => [...el.renderRoot.querySelectorAll('nav.write .wtools > *')].map((x) => Math.round(x.getBoundingClientRect().right))")
        check(max(wide) <= w, f"{tag}: a barra cabe na tela ({wide})")
        check(a.evaluate(OVER) == [], f"{tag}: nada passa da largura {a.evaluate(OVER)}")
        when = a.evaluate("(el) => { const x = el.renderRoot.querySelector('.leaf-top .when'); return [getComputedStyle(x).display, x.scrollWidth, x.clientWidth]; }")
        check(when[0] != "none" and when[1] <= when[2], f"{tag}: escrevendo, a data inteira no alto da folha ({when})")
        pg.screenshot(path=str(SHOTS / f"formato-{scheme}-{w}-barra.png"))
        # fora do editor: a parte em negrito e na cor, sem as marcas
        tap(pg, a.locator("nav.write .ink-done"))
        pg.wait_for_timeout(1200)
        when = a.evaluate("(el) => { const x = el.renderRoot.querySelector('.leaf-top .when'); return [getComputedStyle(x).display, x.textContent, x.scrollWidth, x.clientWidth]; }")
        check(when[0] != "none" and when[1].startswith("hoje") and when[2] <= when[3], f"{tag}: no Pronto, a data volta inteira ({when})")
        view = a.locator(".ink-view")
        check(view.count() == 1 and view.inner_text().strip() == "Café forte e leite", f"{tag}: fora do editor, sem as marcas ({view.inner_text()!r})")
        big = a.evaluate("(el) => { const v = el.renderRoot.querySelector('.ink-view'), b = v.querySelector('.fmt.big'); return b && parseFloat(getComputedStyle(b).fontSize) / parseFloat(getComputedStyle(v).fontSize); }")
        check(big and big >= 1.3, f"{tag}: fora do editor, a linha maior ({big})")
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
        tap(pg, a.locator("nav.write .ink-done"))
        # 1.27.0: no celular, a folha com margens menores
        if w <= 390:
            pad = a.evaluate("(el) => parseFloat(getComputedStyle(el.renderRoot.querySelector('.ink')).paddingLeft)")
            check(pad <= 44, f"{tag}: a margem da esquerda menor no celular ({pad})")
        check(not errs, f"{tag}: no page errors {errs}")
        ctx.close()

    # ---- 1.28.0: dentro do Home Assistant (num iframe da mesma origem), com o fim do app escondido (atrás do teclado):
    # a barra da escrita sobe o que ficou escondido; e um arrasto pode passar do alto do app (a página em volta volta)
    html_preview = (REPO / "preview" / "memoria-preview.html").read_bytes()
    outer = b"<!doctype html><meta name='viewport' content='width=device-width, initial-scale=1'><body style='margin:0;height:100vh;overflow:hidden'><iframe src='/memoria.html' style='display:block;border:0;width:100%;height:calc(100vh + 120px)'></iframe></body>"
    ctx = b.new_context(viewport={"width": 390, "height": 844}, has_touch=True, is_mobile=True)
    ctx.route("https://casa.test/**", lambda r: r.fulfill(status=200, content_type="text/html; charset=utf-8", body=html_preview if r.request.url.endswith("/memoria.html") else outer))
    pg = ctx.new_page()
    pg.goto("https://casa.test/")
    fr = pg.frame_locator("iframe")
    a = fr.locator("memoria-app")
    a.locator(".page-title").first.wait_for()
    pg.wait_for_timeout(500)
    a.evaluate("(el) => el._openPage('ideias00001', 'new')")
    pg.wait_for_timeout(900)
    a.locator("textarea.ink").click()
    pg.keyboard.type("Feira")
    pg.wait_for_timeout(700)
    got = a.evaluate("(el) => { const n = el.renderRoot.querySelector('nav.write'); return n && [getComputedStyle(n).marginBottom, Math.round(n.getBoundingClientRect().bottom), el.hasAttribute('writing'), getComputedStyle(el.renderRoot.querySelector('main')).overscrollBehaviorY]; }")
    check(got and abs(float(got[0][:-2]) - 120) <= 1 and abs(got[1] - 844) <= 1 and got[2] and got[3] == "auto", f"iframe: a barra sobe o que está escondido e fica na tela; escrevendo, o arrasto passa do alto ({got})")
    pg.screenshot(path=str(SHOTS / "formato-iframe-teclado.png"))
    a.locator("nav.write .ink-done").click()
    pg.wait_for_timeout(500)
    got = a.evaluate("(el) => [el.renderRoot.querySelectorAll('nav.write').length, el.hasAttribute('writing'), el.style.getPropertyValue('--kb'), getComputedStyle(el.renderRoot.querySelector('main')).overscrollBehaviorY]")
    check(got == [0, False, "", "contain"], f"iframe: no Pronto, as abas de volta, sem a subida ({got})")
    ctx.close()
    b.close()

# 1.42.3: a folha nova abre com o teclado; quando ele fecha, a folha volta a ocupar a tela (antes ficava curta)
with sync_playwright() as p:
    b = p.chromium.launch()
    ctx = b.new_context(viewport={"width": 390, "height": 844}, device_scale_factor=2, color_scheme="dark", has_touch=True, is_mobile=True)
    pg = ctx.new_page()
    pg.goto(PREVIEW)
    a = pg.locator("memoria-app")
    a.locator(".page-title").first.wait_for()
    pg.wait_for_timeout(500)
    a.evaluate("(el) => el._openPage('ideias00001', 'new')")
    pg.wait_for_timeout(900)
    a.locator("textarea.ink").click()
    pg.wait_for_timeout(400)
    H = "(el) => Math.round(el.renderRoot.querySelector('.leaf').getBoundingClientRect().height)"
    cheia = a.evaluate(H)
    TECLADO = "(n) => Object.defineProperty(window, 'visualViewport', { configurable: true, value: { offsetTop: 0, height: innerHeight - n, addEventListener() {}, removeEventListener() {} } })"
    pg.evaluate(TECLADO, 320)
    pg.wait_for_timeout(700)
    curta = a.evaluate(H)
    check(cheia - curta > 250, f"teclado aberto: a folha fica com o que sobra acima dele ({cheia} -> {curta})")
    pg.evaluate(TECLADO, 0)
    pg.wait_for_timeout(700)
    volta = a.evaluate(H)
    check(abs(volta - cheia) <= 2, f"teclado fechado: a folha volta a ocupar a tela ({curta} -> {volta}, era {cheia})")
    ctx.close()
    b.close()

print(f"{n_ok} checks passed" if not failed else f"FAILED: {failed}")
sys.exit(1 if failed else 0)
