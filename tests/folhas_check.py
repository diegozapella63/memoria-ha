# MemorIA 1.29.0: numa tela larga (o computador), duas folhas lado a lado, como um caderno aberto: 1 e 2, 3 e 4… A folha
# em uso tem o editor; um toque na outra escreve ali, com o cursor onde tocou. As setas viram de duas em duas; depois da
# última folha com texto, a folha nova ao lado. Abaixo de 1100 px, uma folha só, como antes. 1660 e 1100 px (claro e
# escuro) e 1099 px.
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
NUMS = "(el) => [...el.renderRoot.querySelectorAll('.pad .leaf .num')].map((x) => x.textContent.trim())"
# where the editor is (left or right) and which sheet it has
ACTIVE = "(el) => { const ta = el.renderRoot.querySelector('textarea.ink'); const lf = ta && ta.closest('.leaf'); return lf && [lf.classList.contains('left') ? 'left' : 'right', el._pad.page]; }"
LEAVES = "(el) => [...el.renderRoot.querySelectorAll('.pad > .leaf')].map((x) => { const r = x.getBoundingClientRect(); return [Math.round(r.left), Math.round(r.right), Math.round(r.top), x.classList.contains('still')]; })"

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
            check(a.evaluate(NUMS) == [f"{len(pages)}/{len(pages)}"] and a.locator(".pad.spread").count() == 0, f"{tag}: abaixo de 1100 px, uma folha só ({a.evaluate(NUMS)})")
            check(a.evaluate(OVER) == [], f"{tag}: nada passa da largura {a.evaluate(OVER)}")
            pg.screenshot(path=str(SHOTS / f"folhas-{scheme}-{w}.png"))
            check(not errs, f"{tag}: sem erros {errs}")
            ctx.close()
            continue

        # ---- as duas folhas lado a lado, a espiral no meio
        lv = a.evaluate(LEAVES)
        check(a.locator(".pad.spread").count() == 1 and a.evaluate(NUMS) == ["1/2", "2/2"], f"{tag}: duas folhas lado a lado, 1 e 2 ({a.evaluate(NUMS)})")
        check(len(lv) == 2 and lv[0][1] < lv[1][0] and lv[0][2] == lv[1][2] and lv[1][0] - lv[0][1] < 60, f"{tag}: uma ao lado da outra, na mesma altura ({lv})")
        sp = a.locator(".pad .spiral").bounding_box()
        check(lv[0][1] - 20 <= sp["x"] and sp["x"] + sp["width"] <= lv[1][0] + 30, f"{tag}: a espiral no meio ({sp}, {lv})")
        check(a.evaluate(ACTIVE) == ["right", pages[1]] and lv[0][3] and not lv[1][3], f"{tag}: a última folha usada tem o editor; a outra mostra o texto ({a.evaluate(ACTIVE)})")
        check(lv[1][1] - lv[0][0] > 0.6 * w, f"{tag}: o caderno aproveita a largura ({lv[1][1] - lv[0][0]} de {w})")
        check(a.evaluate(OVER) == [], f"{tag}: nada passa da largura {a.evaluate(OVER)}")
        pg.screenshot(path=str(SHOTS / f"folhas-{scheme}-{w}.png"))

        # ---- um toque na outra folha: escreve ali, com o cursor onde tocou
        still = a.locator(".leaf.still .ink-view")
        bx = still.locator("span").first.bounding_box()
        pg.mouse.click(bx["x"] + 40, bx["y"] + 10)
        pg.wait_for_timeout(500)
        got = a.evaluate("(el) => [el._editing, el.renderRoot.activeElement && el.renderRoot.activeElement.classList.contains('ink'), el.renderRoot.querySelector('textarea.ink').selectionStart]")
        check(a.evaluate(ACTIVE) == ["left", pages[0]] and got[0] == pages[0] and got[1] and 0 < got[2] < 12, f"{tag}: um toque na outra folha escreve nela, o cursor onde tocou ({a.evaluate(ACTIVE)}, {got})")
        check(a.evaluate(NUMS) == ["1/2", "2/2"] and a.locator("nav.write").count() == 1, f"{tag}: as duas continuam no lugar, com a barra da escrita embaixo")
        pg.keyboard.type("Novo: ")
        pg.wait_for_timeout(300)
        check(a.evaluate(f"(el) => el._page('{pages[0]}').text.includes('Novo: ')"), f"{tag}: escreve na folha tocada")
        pg.screenshot(path=str(SHOTS / f"folhas-{scheme}-{w}-escrevendo.png"))
        a.locator("nav.write .ink-done").click()
        pg.wait_for_timeout(400)

        # ---- as setas viram de duas em duas: depois da última, a folha nova sozinha
        check(a.locator(".leaf.left .edge.prev").count() == 0 and a.locator(".leaf.right .edge.next").count() == 1, f"{tag}: nas primeiras, só a seta para a frente (na folha da direita)")
        a.locator(".leaf.right .edge.next").click()
        pg.wait_for_timeout(500)
        check(a.evaluate(NUMS) == ["3/3"] and a.evaluate("(el) => el._pad.page") == "new", f"{tag}: a seguir, a folha nova ({a.evaluate(NUMS)})")
        pg.keyboard.type("Terceira")
        pg.wait_for_timeout(300)
        n3 = a.evaluate("(el) => el._pagesOf('ideias00001').length")
        check(n3 == 3, f"{tag}: escrevendo, ela entra no bloco ({n3})")
        a.locator("nav.write .ink-done").click()
        pg.wait_for_timeout(400)
        check(a.evaluate(NUMS) == ["3/3", "4/4"] and a.locator(".leaf.still .ink-ph").inner_text().strip() == "Folha nova. Escreva aqui…", f"{tag}: com texto, a folha nova ao lado ({a.evaluate(NUMS)})")
        a.locator(".leaf.still .ink-view").click()
        pg.wait_for_timeout(400)
        check(a.evaluate("(el) => [el._pad.page, el._editing]") == ["new", "new"] and a.evaluate(ACTIVE)[0] == "right", f"{tag}: um toque nela escreve ali")
        a.locator("nav.write .ink-done").click()
        pg.wait_for_timeout(400)
        a.locator(".leaf.left .edge.prev").click()
        pg.wait_for_timeout(500)
        check(a.evaluate(NUMS) == ["1/3", "2/3"], f"{tag}: a seta para trás volta duas ({a.evaluate(NUMS)})")

        # ---- o Agora também, com as duas folhas
        a.locator("nav .tab", has_text="Agora").click()
        pg.wait_for_timeout(600)
        if a.locator(".pad").count():
            check(a.locator(".pad.spread").count() == 1, f"{tag}: no Agora também, duas folhas")
            check(a.evaluate(OVER) == [], f"{tag}: Agora: nada passa da largura {a.evaluate(OVER)}")
            pg.screenshot(path=str(SHOTS / f"folhas-{scheme}-{w}-agora.png"))
        check(not errs, f"{tag}: sem erros {errs}")
        ctx.close()
    b.close()

print(f"{n_ok} checks passed" if not failed else f"{len(failed)} FAILED of {n_ok + len(failed)}")
print(f"screenshots in {SHOTS}")
sys.exit(1 if failed else 0)
