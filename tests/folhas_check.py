# MemorIA 1.28.1: numa tela larga (o computador, a TV), o caderno aberto: a folha atual na página da esquerda e o texto
# dela continuando na da direita, a partir da linha seguinte (a direita acompanha quando a esquerda rola). Um toque na
# direita escreve naquele ponto; a roda do mouse sobre ela rola a folha. As setas viram uma folha por vez. Abaixo de
# 1100 px, uma página só, como antes. 1660 e 1100 px (claro e escuro) e 1099 px.
#
# Usa a prévia (sem servidor): cd frontend && npm run build, depois
#   python3 tests/folhas_check.py [pasta das capturas]
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
TEXT = "Café da manhã\n\n" + "\n".join(f"Item {i} - 2 unidades" for i in range(1, 41))
# the left page (the editor or the sheet as it reads) and the right one: [left scrollTop, left clientHeight, right
# scrollTop, the line on top of the right page, widths]
PAGES = """(el) => { const l = el._contLeft(), r = el.renderRoot.querySelector('.ink.cont');
  const lh = parseFloat(getComputedStyle(l).lineHeight);
  return { ls: l.scrollTop, lc: l.clientHeight, rs: r.scrollTop, lh, line: Math.round(r.scrollTop / lh), lw: l.clientWidth, rw: r.clientWidth, tag: l.tagName }; }"""

with sync_playwright() as p:
    b = p.chromium.launch()
    for scheme, w in (("light", 1660), ("dark", 1100), ("light", 1099)):
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
        if w < 1100:
            check(a.locator(".pad.spread").count() == 0 and a.locator(".pad > .leaf").count() == 1, f"{tag}: abaixo de 1100 px, uma página só")
            check(a.evaluate(OVER) == [], f"{tag}: nada passa da largura {a.evaluate(OVER)}")
            pg.screenshot(path=str(SHOTS / f"folhas-{scheme}-{w}.png"))
            check(not errs, f"{tag}: sem erros {errs}")
            ctx.close()
            continue

        # ---- o caderno aberto: a folha atual dos dois lados, a espiral no meio
        lv = a.evaluate("(el) => [...el.renderRoot.querySelectorAll('.pad > .leaf')].map((x) => { const r = x.getBoundingClientRect(); return [Math.round(r.left), Math.round(r.right), Math.round(r.top), Math.round(r.height)]; })")
        check(a.locator(".pad.spread").count() == 1 and len(lv) == 2 and lv[0][1] < lv[1][0] and lv[0][2] == lv[1][2] and lv[0][3] == lv[1][3], f"{tag}: duas páginas lado a lado, na mesma altura ({lv})")
        box = a.evaluate("(el) => { const r = el.renderRoot.querySelector('.ink.cont').getBoundingClientRect(), f = el.renderRoot.querySelector('.leaf.cont').getBoundingClientRect(); return [Math.round(r.bottom), Math.round(f.bottom)]; }")
        check(box[0] <= box[1], f"{tag}: o texto da direita (e as linhas do papel) não passa da página ({box})")
        nums = a.locator(".pad .leaf .num").all_inner_texts()
        check(nums == ["2/2"], f"{tag}: as duas páginas são da mesma folha, a atual (um número só: {nums})")
        sp = a.locator(".pad .spiral").bounding_box()
        check(lv[0][1] - 20 <= sp["x"] and sp["x"] + sp["width"] <= lv[1][0] + 30, f"{tag}: a espiral no meio")
        check(lv[1][1] - lv[0][0] > 0.6 * w, f"{tag}: o caderno aproveita a largura ({lv[1][1] - lv[0][0]} de {w})")

        # ---- uma folha comprida: a direita continua da linha seguinte à última da esquerda
        a.evaluate(f"(el, t) => {{ const p = el._page('{pages[1]}'); el._putPage({{ ...p, text: t }}); el.requestUpdate(); }}", TEXT)
        pg.wait_for_timeout(500)
        g = a.evaluate(PAGES)
        whole = (g["lc"] - 4) / g["lh"]
        check(g["lw"] == g["rw"], f"{tag}: as duas páginas com a mesma largura de texto (as linhas quebram igual) ({g['lw']}, {g['rw']})")
        check(abs(whole - round(whole)) < 0.01 and g["line"] == round(whole), f"{tag}: a esquerda com linhas inteiras e a direita começando na seguinte ({g})")
        pg.screenshot(path=str(SHOTS / f"folhas-{scheme}-{w}.png"))
        a.evaluate("(el) => { el._contLeft().scrollTop = 96; }")
        pg.wait_for_timeout(300)
        g2 = a.evaluate(PAGES)
        check(g2["line"] == g["line"] + 3, f"{tag}: a esquerda rola 3 linhas, a direita acompanha ({g2['line']})")
        r = a.locator(".ink.cont").bounding_box()
        pg.mouse.move(r["x"] + 100, r["y"] + 100)
        pg.mouse.wheel(0, -96)
        pg.wait_for_timeout(300)
        g3 = a.evaluate(PAGES)
        check(g3["ls"] == 0 and g3["line"] == g["line"], f"{tag}: a roda do mouse sobre a direita rola a folha ({g3})")

        # ---- um toque na direita escreve naquele ponto (a esquerda rola até lá)
        pg.mouse.click(r["x"] + 140, r["y"] + 4 + g["lh"] * 2 + 12)
        pg.wait_for_timeout(500)
        st = a.evaluate("(el) => { const ta = el.renderRoot.querySelector('textarea.ink'); return [el._editing, ta.value.slice(0, ta.selectionStart).split('\\n').length]; }")
        check(st[0] == pages[1] and st[1] == g["line"] + 3, f"{tag}: o toque na direita escreve na linha tocada ({st}, esperada {g['line'] + 3})")
        g4 = a.evaluate(PAGES)
        check(g4["tag"] == "TEXTAREA" and g4["ls"] % g4["lh"] == 0 and g4["line"] * g4["lh"] == g4["ls"] + round(whole) * g4["lh"], f"{tag}: a esquerda mostra o cursor, em linhas inteiras, e a direita continua dela ({g4})")
        pg.keyboard.type("Novo ")
        pg.wait_for_timeout(300)
        check("Novo " in a.evaluate(f"(el) => el._page('{pages[1]}').text"), f"{tag}: escreve na folha atual")
        check(a.locator("nav.write").count() == 1, f"{tag}: com a barra da escrita embaixo")
        pg.screenshot(path=str(SHOTS / f"folhas-{scheme}-{w}-escrevendo.png"))
        check(a.evaluate(OVER) == [], f"{tag}: nada passa da largura {a.evaluate(OVER)}")
        a.locator("nav.write .ink-done").click()
        pg.wait_for_timeout(400)

        # ---- as setas viram uma folha por vez: a anterior (na esquerda) e a nova (na direita)
        a.locator(".leaf.left .edge.prev").click()
        pg.wait_for_timeout(500)
        check(a.evaluate("(el) => el._pad.page") == pages[0] and a.locator(".pad .leaf .num").all_inner_texts() == ["1/2"], f"{tag}: a seta da esquerda volta uma folha")
        a.locator(".leaf.cont .edge.next").click()
        pg.wait_for_timeout(500)
        check(a.evaluate("(el) => el._pad.page") == pages[1], f"{tag}: a da direita vai para a próxima")
        a.locator(".leaf.cont .edge.next").click()
        pg.wait_for_timeout(500)
        check(a.evaluate("(el) => [el._pad.page, el._editing]") == ["new", "new"], f"{tag}: depois da última, a folha nova, já escrevendo")
        a.locator("nav.write .ink-done").click()
        pg.wait_for_timeout(400)

        # ---- o Agora também, com o caderno aberto
        a.locator("nav .tab", has_text="Agora").click()
        pg.wait_for_timeout(600)
        if a.locator(".pad").count():
            check(a.locator(".pad.spread").count() == 1 and len(a.locator(".pad .leaf .num").all_inner_texts()) == 1, f"{tag}: no Agora também, a folha de agora nas duas páginas")
            check(a.evaluate(OVER) == [], f"{tag}: Agora: nada passa da largura {a.evaluate(OVER)}")
            pg.screenshot(path=str(SHOTS / f"folhas-{scheme}-{w}-agora.png"))
        check(not errs, f"{tag}: sem erros {errs}")
        ctx.close()
    b.close()

print(f"{n_ok} checks passed" if not failed else f"{len(failed)} FAILED of {n_ok + len(failed)}")
print(f"screenshots in {SHOTS}")
sys.exit(1 if failed else 0)
