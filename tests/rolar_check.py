# MemorIA 1.43.0: Mais > Configurações > Opções > Modo de ver: Caderno (como sempre) ou Rolar. No Rolar, as folhas do bloco
# ficam uma embaixo da outra, como páginas (sem as argolas e sem virar), a tela rola e a folha não rola por dentro; um
# toque numa folha abre essa folha ali mesmo, para ler as caixas e os links ou escrever; no fim, Folha nova. No Agora, a
# folha de agora inteira. A Tela cheia continua um caderno. 390 e 320 px, claro e escuro.
#
# Usa a prévia (sem servidor): cd frontend && npm run build, depois
#   python3 tests/rolar_check.py [pasta das capturas]
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


MEDE = """(el) => { const r = el.renderRoot, m = r.querySelector('main'), L = [...r.querySelectorAll('.pad .leaf')];
  return { roll: !!r.querySelector('.pad.roll'), argolas: r.querySelectorAll('.pad .spiral').length, bordas: r.querySelectorAll('.pad .edge').length, folhas: L.length,
    on: L.filter(l => l.classList.contains('on')).map(l => l.dataset.pid), ids: L.map(l => l.dataset.pid),
    rolaDentro: L.some(l => { const i = l.querySelector('.ink:not(.behind):not(.measure)'); return i && i.scrollHeight > i.clientHeight + 2; }),
    tela: [m.scrollHeight, m.clientHeight, m.scrollTop], lado: document.documentElement.scrollWidth > innerWidth || m.scrollWidth > m.clientWidth + 1,
    nova: r.querySelectorAll('.roll-new').length }; }"""

with sync_playwright() as p:
    b = p.chromium.launch()
    for w, tema in ((390, "dark"), (320, "light")):
        ctx = b.new_context(viewport={"width": w, "height": 700}, device_scale_factor=2, color_scheme=tema, has_touch=True, is_mobile=True)
        pg = ctx.new_page()
        erros = []
        pg.on("pageerror", lambda e: erros.append(str(e)))
        pg.goto(PREVIEW)
        a = pg.locator("memoria-app")
        a.locator(".page-title").first.wait_for()
        pg.wait_for_timeout(400)

        # a opção: Caderno de início; Rolar fica gravado
        a.evaluate("(el) => el._go('/config/opcoes')")
        seg = a.locator("#modo-ver .view-seg button")
        seg.first.wait_for()
        check(seg.all_inner_texts() == ["Caderno", "Rolar"], f"{w}: Opções › Modo de ver: Caderno e Rolar")
        check(a.locator('#modo-ver .view-seg button[aria-checked="true"]').inner_text() == "Caderno", f"{w}: começa em Caderno")
        check(a.locator("#modo-ver .mais-head svg, #modo-ver .sec-head svg").count() >= 1 and a.locator("#modo-ver .label svg").count() == 1 and seg.locator("svg").count() == 2,
              f"{w}: o cartão, a linha e os botões com ícone")
        a.evaluate("(el) => el._go('/bloco/treino00001')")
        pg.wait_for_timeout(600)
        m = a.evaluate(MEDE)
        check(not m["roll"] and m["argolas"] == 1 and m["folhas"] == 1, f"{w}: no Caderno, uma folha com as argolas ({m})")
        a.evaluate("(el) => el._go('/config/opcoes')")
        seg.nth(1).click()
        pg.wait_for_timeout(400)
        check(a.locator('#modo-ver .view-seg button[aria-checked="true"]').inner_text() == "Rolar" and a.evaluate("(el) => el._data.app.view") == "rolar", f"{w}: Rolar fica gravado")
        pg.screenshot(path=str(SHOTS / f"rolar-opcoes-{w}.png"))

        # o bloco: todas as folhas, uma embaixo da outra; a tela rola, a folha não
        a.evaluate("(el) => el._go('/bloco/treino00001')")
        pg.wait_for_timeout(600)
        m = a.evaluate(MEDE)
        check(m["roll"] and m["argolas"] == 0 and m["bordas"] == 0, f"{w}: sem as argolas e sem as bordas de virar")
        check(m["folhas"] == 2 and len(m["on"]) == 1, f"{w}: as 2 folhas do bloco na tela, uma aberta ({m['ids']}, {m['on']})")
        check(not m["rolaDentro"], f"{w}: nenhuma folha rola por dentro")
        check(m["tela"][0] > m["tela"][1], f"{w}: a tela rola ({m['tela']})")
        check(not m["lado"], f"{w}: nada passa da largura")
        check(m["nova"] == 1 and a.locator(".roll-new").inner_text().strip() == "Folha nova" and a.locator(".roll-new svg").count() == 1, f"{w}: no fim, Folha nova (com ícone)")
        tops = a.evaluate("(el) => [...el.renderRoot.querySelectorAll('.pad .leaf')].map(l => Math.round(l.getBoundingClientRect().top))")
        check(tops[1] > tops[0], f"{w}: a segunda embaixo da primeira ({tops})")
        pg.screenshot(path=str(SHOTS / f"rolar-bloco-{w}.png"))

        # 1.46.5 (o dono: "os 3 pontinhos da folha devem aparecer sempre, e não só quando clica"): toda folha com os três
        # pontinhos; os de uma folha que não é a aberta abrem a folha e as opções dela
        outra = next(i for i in m["ids"] if i not in m["on"])
        check(a.locator('.pad .leaf[data-pid] .leaf-top button.icon-btn[aria-label="Opções da folha"]').count() == 2, f"{w}: os três pontinhos nas 2 folhas")
        a.locator(f'.pad .leaf[data-pid="{outra}"] .leaf-top button.icon-btn').click()
        pg.wait_for_timeout(500)
        check(a.evaluate("(el) => [el._sheet, el._form && el._form.page]") == ["pagemenu", outra] and a.evaluate(MEDE)["on"] == [outra], f"{w}: os pontinhos da outra folha abrem as opções dela")
        pg.go_back()
        pg.wait_for_timeout(400)
        a.locator(f'.pad .leaf[data-pid="{m["on"][0]}"] .ink.still').click(position={"x": 60, "y": 20})
        pg.wait_for_timeout(400)
        check(a.evaluate(MEDE)["on"] == m["on"], f"{w}: de volta à primeira folha")
        # um toque numa folha abre essa folha ali mesmo (a tela não pula)
        a.evaluate("(el) => { el.renderRoot.querySelector('main').scrollTop = 60; }")
        # o Playwright rola até a folha antes do toque quando ela não está à vista (a fonte do servidor de testes é outra):
        # o que vale é a tela ficar onde estava na hora do toque
        a.locator(f'.pad .leaf[data-pid="{outra}"] .ink.still').scroll_into_view_if_needed()
        antes = a.evaluate("(el) => el.renderRoot.querySelector('main').scrollTop")
        a.locator(f'.pad .leaf[data-pid="{outra}"] .ink.still').click(position={"x": 60, "y": 20})
        pg.wait_for_timeout(400)
        m2 = a.evaluate(MEDE)
        check(m2["on"] == [outra], f"{w}: o toque abre a outra folha ({m2['on']})")
        check(abs(m2["tela"][2] - antes) <= 2, f"{w}: a tela fica onde estava ({m2['tela'][2]}, antes {antes})")
        # escrever: a folha cresce com o texto, sem rolar por dentro
        ta = a.locator(f'.pad .leaf[data-pid="{outra}"] textarea.ink')
        h0 = a.evaluate("(el, id) => el.renderRoot.querySelector(`.leaf[data-pid=\"${id}\"]`).getBoundingClientRect().height", outra)
        ta.click()
        ta.press("Control+End")
        ta.type("\n".join(f"linha {k}" for k in range(1, 9)))
        pg.wait_for_timeout(500)
        h1 = a.evaluate("(el, id) => el.renderRoot.querySelector(`.leaf[data-pid=\"${id}\"]`).getBoundingClientRect().height", outra)
        m3 = a.evaluate(MEDE)
        check(h1 > h0 + 150 and not m3["rolaDentro"], f"{w}: escrevendo, a folha cresce ({round(h0)} -> {round(h1)})")
        check(a.evaluate("(el, id) => el._page(id).text.endsWith('linha 8')", outra), f"{w}: o que foi escrito fica na folha")
        a.evaluate("(el) => el.renderRoot.activeElement && el.renderRoot.activeElement.blur()")
        pg.wait_for_timeout(500)

        # Folha nova
        a.locator(".roll-new").scroll_into_view_if_needed()
        a.locator(".roll-new").click()
        pg.wait_for_timeout(500)
        m4 = a.evaluate(MEDE)
        check(m4["folhas"] == 3 and m4["on"] == ["new"] and m4["nova"] == 0, f"{w}: Folha nova abre uma folha em branco no fim ({m4['ids']}, {m4['on']})")
        a.evaluate("(el) => el.renderRoot.activeElement && el.renderRoot.activeElement.blur()")

        # o Agora: a folha de agora inteira
        a.evaluate("(el) => el._go('/')")
        pg.wait_for_timeout(600)
        if a.locator(".pad").count():
            m5 = a.evaluate(MEDE)
            check(m5["roll"] and m5["folhas"] == 1 and not m5["rolaDentro"] and m5["nova"] == 0 and not m5["lado"], f"{w}: no Agora, só a folha de agora, inteira ({m5})")
            pg.screenshot(path=str(SHOTS / f"rolar-agora-{w}.png"))

        # de volta ao Caderno
        a.evaluate("(el) => el._go('/config/opcoes')")
        seg.first.click()
        pg.wait_for_timeout(300)
        check(a.evaluate("(el) => el._data.app.view") is None, f"{w}: Caderno tira a escolha (é o de início)")
        a.evaluate("(el) => el._go('/bloco/treino00001')")
        pg.wait_for_timeout(600)
        m6 = a.evaluate(MEDE)
        check(not m6["roll"] and m6["argolas"] == 1 and m6["folhas"] == 1, f"{w}: e o bloco volta a ser um caderno")
        check(not erros, f"{w}: sem erro na página ({erros})")
        ctx.close()
    b.close()

print(f"{n_ok} checks passed" if not failed else f"{n_ok} passed, {len(failed)} FAILED: {failed}")
sys.exit(1 if failed else 0)
