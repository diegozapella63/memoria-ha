# MemorIA 1.29.1: numa tela larga (o computador, a TV), o caderno aberto: a página da esquerda não rola; as linhas da
# folha que não cabem nela vão para a página da direita, que rola. Cada página tem a sua parte da folha para escrever
# (linhas inteiras), sem repetir nada: a da esquerda e depois a da direita são a folha. Escrevendo, as linhas passam de
# uma página para a outra e o cursor vai junto; as setas e o Backspace atravessam a espiral. Abaixo de 1100 px, uma
# página só, como antes; 1.35.0: com a barra lateral do computador, abaixo de 1200. 1660 e 1200 px (claro e escuro) e
# 1199 px.
#
# Usa a prévia (sem servidor): cd frontend && npm run build, depois
#   python3 tests/folhas_check.py [pasta das capturas]
import os, sys, tempfile
from pathlib import Path
from playwright.sync_api import sync_playwright

REPO = Path(__file__).resolve().parent.parent
PREVIEW = os.environ.get("MEMORIA_PREVIEW_URL") or (REPO / "preview" / "memoria-preview.html").as_uri()
# 1.35.0: com 1000 px ou mais, a barra lateral no lugar da barra de baixo: o que estiver à vista
TAB = "nav .tab:visible, .side-link:visible"
TAB_ON = "nav .tab.on:visible, .side-link[aria-current=page]:visible"
FAB = "nav .tab.fab:visible, .side-add:visible"
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
    if (e.closest(".cat-filter, .who-filter, .tline, .measure")) continue;
    const r = e.getBoundingClientRect();
    if (r.width && (r.right > W + 1 || r.left < -1)) bad.push(e.tagName.toLowerCase() + "." + [...e.classList].join(".") + " " + Math.round(r.left) + ".." + Math.round(r.right));
  }
  if (document.documentElement.scrollWidth > W) bad.push("page " + document.documentElement.scrollWidth);
  return bad.slice(0, 4);
}"""
# a sheet with a title in green and bold, a long paragraph and many short lines
TEXT = "{verde:**☕ Café da manhã**}\n\n" + "\n".join(f"Item {i} - 2 unidades" for i in range(1, 15)) + "\n\nO café da manhã é a principal refeição: consuma alimentos que dão saciedade a longo prazo, com uma fonte de proteína.\n\n" + "\n".join(f"Linha final {i}" for i in range(1, 31))
SHORT = "\n".join(f"Linha {i}" for i in range(1, 41))
# the two pages: the editors (their text and whether they scroll) or the sheet as it reads
PAGES = """(el) => { const q = (s) => el.renderRoot.querySelector(s);
  const t = [...el.renderRoot.querySelectorAll('.pad.spread textarea.ink')];
  const lv = q('.pad.spread .leaf.left .ink-view:not(.measure)'), rv = q('.pad.spread .leaf.right .ink-view');
  const left = lv || t[0], right = rv || t[1];
  return { l: t[0] ? t[0].value : null, r: t[1] ? t[1].value : null, lscroll: left.scrollHeight > left.clientHeight + 1,
    rscroll: right ? right.scrollHeight > right.clientHeight + 1 : null, view: !!lv, focus: el.renderRoot.activeElement && el.renderRoot.activeElement.dataset ? el.renderRoot.activeElement.dataset.part || null : null,
    pos: el.renderRoot.activeElement && el.renderRoot.activeElement.selectionStart }; }"""
# how far the screen scrolls past the bottom of the notebook
TAIL = "(el) => { const m = el.renderRoot.querySelector('main'), p = el.renderRoot.querySelector('.pad'); return Math.round(m.scrollHeight - (p.getBoundingClientRect().bottom - m.getBoundingClientRect().top + m.scrollTop)); }"
PUT = "(el, [id, t]) => { const p = el._page(id); el._putPage({ ...p, text: t }); el.requestUpdate(); }"
TEXT_OF = "(el, id) => el._page(id).text"


def focus(a, part, pos):
    a.evaluate(f"(el) => {{ const t = el.renderRoot.querySelector('.pad.spread textarea.ink[data-part=\"{part}\"]'); t.focus(); t.setSelectionRange({pos}, {pos}); }}")


with sync_playwright() as p:
    b = p.chromium.launch()
    for scheme, w in (("light", 1660), ("dark", 1200), ("light", 1199)):
        tag = f"{scheme} {w}px"
        ctx = b.new_context(viewport={"width": w, "height": 950}, color_scheme=scheme)
        pg = ctx.new_page()
        errs = []
        pg.on("pageerror", lambda e: errs.append(str(e)))
        pg.goto(PREVIEW)
        a = pg.locator("memoria-app")
        a.locator(".page-title").first.wait_for()
        pg.wait_for_timeout(500)
        a.evaluate("(el) => el._go('/bloco/ideias00001')")
        pg.wait_for_timeout(800)
        pages = a.evaluate("(el) => el._pagesOf('ideias00001').map((p) => p.id)")
        pid = pages[1]
        if w < 1200:
            check(a.locator(".pad.spread").count() == 0 and a.locator(".pad > .leaf").count() == 1 and a.locator(".pad textarea.ink").count() == 1, f"{tag}: com a barra lateral, abaixo de 1200 px, uma página só")
            check(a.evaluate(OVER) == [], f"{tag}: nada passa da largura {a.evaluate(OVER)}")
            pg.screenshot(path=str(SHOTS / f"folhas-{scheme}-{w}.png"))
            check(not errs, f"{tag}: sem erros {errs}")
            ctx.close()
            continue

        # ---- o caderno aberto: duas páginas da folha atual, a espiral no meio
        lv = a.evaluate("(el) => [...el.renderRoot.querySelectorAll('.pad > .leaf')].map((x) => { const r = x.getBoundingClientRect(); return [Math.round(r.left), Math.round(r.right), Math.round(r.top), Math.round(r.height)]; })")
        check(a.locator(".pad.spread").count() == 1 and len(lv) == 2 and lv[0][1] < lv[1][0] and lv[0][2] == lv[1][2] and lv[0][3] == lv[1][3], f"{tag}: duas páginas lado a lado, na mesma altura ({lv})")
        check(a.locator(".pad .leaf .num").all_inner_texts() == ["2/2"], f"{tag}: as duas são da folha atual (um número só)")
        sp = a.locator(".pad .spiral").bounding_box()
        check(lv[0][1] - 20 <= sp["x"] and sp["x"] + sp["width"] <= lv[1][0] + 30, f"{tag}: a espiral no meio ({lv}, {sp})")

        # ---- uma folha comprida, lendo: a esquerda não rola; a direita continua, sem repetir, e rola
        a.evaluate(PUT, [pid, TEXT])
        pg.wait_for_timeout(600)
        g = a.evaluate(PAGES)
        check(g["view"] and not g["lscroll"] and g["rscroll"], f"{tag}: lendo, a esquerda sem rolagem e a direita com ({g['lscroll']}, {g['rscroll']})")
        check(g["l"] + "\n" + g["r"] == TEXT, f"{tag}: a esquerda e depois a direita são a folha, sem repetir nada")
        left_lines = g["l"].split("\n")
        check(10 < len(left_lines) < 30 and g["r"].split("\n")[0] == TEXT.split("\n")[len(left_lines)], f"{tag}: a direita começa na linha seguinte à última da esquerda ({left_lines[-1]!r} | {g['r'].split(chr(10))[0]!r})")
        check(a.evaluate(OVER) == [], f"{tag}: nada passa da largura {a.evaluate(OVER)}")
        check(a.evaluate(TAIL) < 120, f"{tag}: a tela não rola além do caderno (a folha comprida não estica a página: {a.evaluate(TAIL)} px)")
        pg.screenshot(path=str(SHOTS / f"folhas-{scheme}-{w}.png"))

        # ---- um toque na direita escreve nela, ali
        # 1.35.0: on a line of the text (the first one of the right page wraps more or less with the width)
        ln = a.evaluate("""(el) => {
          const root = el.renderRoot.querySelector('.pad.spread .leaf.right .ink-view');
          const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
          for (let n = w.nextNode(); n; n = w.nextNode()) {
            const i = n.data.search(/Linha final 2(?!\\d)/);
            if (i < 0) continue;
            const r = document.createRange(); r.setStart(n, i); r.setEnd(n, i + 13);
            const b = r.getBoundingClientRect(); return [b.left, b.top + b.height / 2];
          }
          return null; }""")
        pg.mouse.click(ln[0] + 40, ln[1])
        pg.wait_for_timeout(600)
        g = a.evaluate(PAGES)
        check(g["focus"] == "r" and not g["view"] and not g["lscroll"], f"{tag}: o toque na direita escreve nela ({g['focus']})")
        check(g["l"] + "\n" + g["r"] == TEXT, f"{tag}: escrevendo, também sem repetir nada")
        row = g["r"][: g["pos"]].count("\n")
        want = g["r"].split("\n").index("Linha final 2")
        check(row == want, f"{tag}: o cursor na linha tocada ({row}, {want})")
        pg.keyboard.type("Ok ")
        pg.wait_for_timeout(400)
        check("Ok " in a.evaluate(TEXT_OF, pid) and a.evaluate(PAGES)["focus"] == "r", f"{tag}: escreve na folha, pela direita")
        check(a.evaluate(TAIL) < 120, f"{tag}: escrevendo, a tela também não rola além do caderno ({a.evaluate(TAIL)} px)")
        check(a.locator("nav.write").count() == 1, f"{tag}: com a barra da escrita embaixo")
        pg.screenshot(path=str(SHOTS / f"folhas-{scheme}-{w}-escrevendo.png"))
        a.locator("nav.write .ink-done").click()
        pg.wait_for_timeout(400)

        # ---- linhas curtas, a esquerda cheia: o Enter no fim dela leva a linha nova (e o cursor) para a direita
        a.evaluate(PUT, [pid, SHORT])
        pg.wait_for_timeout(600)
        a.locator(".pad.spread .leaf.left textarea.ink").click()
        pg.wait_for_timeout(300)
        g = a.evaluate(PAGES)
        n = len(g["l"].split("\n"))
        check(g["l"].split("\n")[-1] == f"Linha {n}" and g["r"].split("\n")[0] == f"Linha {n + 1}" and not g["lscroll"], f"{tag}: a esquerda cheia, linhas inteiras ({n} linhas)")
        focus(a, "l", len(g["l"]))
        pg.keyboard.press("Enter")
        pg.keyboard.type("x")
        pg.wait_for_timeout(500)
        g = a.evaluate(PAGES)
        check(g["focus"] == "r" and g["pos"] == 1 and g["r"].split("\n")[0] == "x" and not g["lscroll"], f"{tag}: a linha nova não cabe: vai para a direita, com o cursor ({g['focus']}, {g['pos']}, {g['r'][:12]!r})")
        check(a.evaluate(TEXT_OF, pid).startswith(g["l"] + "\nx\nLinha"), f"{tag}: e a folha é a mesma, com o x no lugar")
        # Backspace no começo da direita junta com a última linha da esquerda
        focus(a, "r", 0)
        pg.keyboard.press("Backspace")
        pg.wait_for_timeout(500)
        g = a.evaluate(PAGES)
        check(g["focus"] == "l" and g["l"].endswith(f"Linha {n}x") and g["pos"] == len(g["l"]) - 1, f"{tag}: o Backspace no começo da direita junta com a esquerda ({g['l'][-12:]!r}, {g['pos']})")
        # as setas atravessam a espiral
        focus(a, "l", len(g["l"]))
        pg.keyboard.press("ArrowRight")
        pg.wait_for_timeout(200)
        g = a.evaluate(PAGES)
        check(g["focus"] == "r" and g["pos"] == 0, f"{tag}: a seta para a direita no fim da esquerda vai para a direita")
        pg.keyboard.press("ArrowLeft")
        pg.wait_for_timeout(200)
        g = a.evaluate(PAGES)
        check(g["focus"] == "l" and g["pos"] == len(g["l"]), f"{tag}: e a seta para a esquerda volta")
        # a Caixa de marcar na direita: a linha do cursor de lá
        focus(a, "r", 2)
        a.locator("nav.write .wbtn[aria-label='Caixa de marcar']").click()
        pg.wait_for_timeout(400)
        g = a.evaluate(PAGES)
        check(g["focus"] == "r" and g["r"].split("\n")[0].startswith("☐ "), f"{tag}: a Caixa de marcar na linha do cursor da direita ({g['r'][:14]!r})")
        a.locator("nav.write .ink-done").click()
        pg.wait_for_timeout(400)

        # ---- as setas das bordas viram uma folha por vez
        a.locator(".leaf.left .edge.prev").click()
        pg.wait_for_timeout(500)
        check(a.evaluate("(el) => el._pad.page") == pages[0], f"{tag}: a seta da esquerda volta uma folha")
        a.locator(".leaf.right .edge.next").click()
        pg.wait_for_timeout(500)
        check(a.evaluate("(el) => el._pad.page") == pid, f"{tag}: a da direita vai para a próxima")

        # ---- o Agora também
        a.locator(TAB, has_text="Agora").click()
        pg.wait_for_timeout(600)
        if a.locator(".pad").count():
            check(a.locator(".pad.spread").count() == 1 and len(a.locator(".pad .leaf .num").all_inner_texts()) == 1, f"{tag}: no Agora também, o caderno aberto da folha de agora")
            check(a.evaluate(OVER) == [], f"{tag}: Agora: nada passa da largura {a.evaluate(OVER)}")
            pg.screenshot(path=str(SHOTS / f"folhas-{scheme}-{w}-agora.png"))
        check(not errs, f"{tag}: sem erros {errs}")
        ctx.close()
    b.close()

print(f"{n_ok} checks passed" if not failed else f"{len(failed)} FAILED of {n_ok + len(failed)}")
print(f"screenshots in {SHOTS}")
sys.exit(1 if failed else 0)
