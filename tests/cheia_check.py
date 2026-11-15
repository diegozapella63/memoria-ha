# MemorIA 1.30.0: Tela cheia (telas largas, o computador ou a TV): o botão ao lado do Conversar e do Falar, no bloco e no
# Agora. Ligada, somem a linha dos botões e a de quando o bloco abre sozinho, a folha cresce e a barra de baixo fica
# escondida (uma faixa fina à vista), aparecendo com o mouse nela, com Sair da tela cheia. Esc também sai. Abaixo de
# 1100 px, nada de Tela cheia. 1660 px (claro e escuro), 1100 e 1099 px.
#
# Usa a prévia (sem servidor): cd frontend && npm run build, depois
#   python3 tests/cheia_check.py [pasta das capturas]
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


SEEN = "(el, s) => { const x = el.renderRoot.querySelector(s); return !!x && x.getClientRects().length > 0 && getComputedStyle(x).display !== 'none'; }"
NAV = "(el) => { const r = el.renderRoot.querySelector('nav').getBoundingClientRect(); return [Math.round(r.top), Math.round(r.bottom)]; }"
LEAF = "(el) => Math.round(el.renderRoot.querySelector('.pad .leaf').getBoundingClientRect().height)"

with sync_playwright() as p:
    b = p.chromium.launch()
    for scheme, w in (("light", 1660), ("dark", 1660), ("light", 1100), ("light", 1099)):
        tag = f"{scheme} {w}px"
        H = 950
        ctx = b.new_context(viewport={"width": w, "height": H}, color_scheme=scheme)
        pg = ctx.new_page()
        errs = []
        pg.on("pageerror", lambda e: errs.append(str(e)))
        pg.goto(PREVIEW)
        a = pg.locator("memoria-app")
        a.locator(".page-title").first.wait_for()
        pg.wait_for_timeout(500)
        a.evaluate("(el) => el._go('/bloco/ideias00001')")
        pg.wait_for_timeout(700)
        btn = a.locator(".dh-row .full-btn")
        if w < 1100:
            check(btn.count() == 0, f"{tag}: abaixo de 1100 px, sem Tela cheia")
            check(not errs, f"{tag}: sem erros {errs}")
            ctx.close()
            continue

        # ---- o botão, ao lado do Conversar e do Falar
        row = [x.get_attribute("aria-label") for x in a.locator(".dh-row button").all()]
        check(row == ["Voltar", "Conversar com a IA", "Falar: criar uma folha falando", "Tela cheia", "Ajustes do bloco"], f"{tag}: Tela cheia ao lado do Conversar e do Falar ({row})")
        before = a.evaluate(LEAF)
        btn.click()
        pg.wait_for_timeout(500)
        check(a.evaluate("(el) => el.hasAttribute('full')"), f"{tag}: ligada")
        check(not a.evaluate(SEEN, ".dh-row") and not a.evaluate(SEEN, ".when-line"), f"{tag}: somem os botões do alto e o Abre sozinho")
        check(a.evaluate(SEEN, ".dh-text h1"), f"{tag}: o nome do bloco fica")
        after = a.evaluate(LEAF)
        check(after > before + 80, f"{tag}: a folha cresce ({before} → {after})")
        nav = a.evaluate(NAV)
        check(nav[0] >= H - 10, f"{tag}: a barra de baixo escondida, só uma faixa fina ({nav})")
        pg.screenshot(path=str(SHOTS / f"cheia-{scheme}-{w}.png"))
        # o mouse na faixa: a barra aparece, com Sair da tela cheia
        pg.mouse.move(w / 2, H - 3)
        pg.wait_for_timeout(400)
        nav = a.evaluate(NAV)
        check(nav[0] <= H - 60 and nav[1] <= H + 1, f"{tag}: com o mouse embaixo, a barra aparece ({nav})")
        ex = a.locator("nav .full-exit")
        check(ex.count() == 1 and ex.inner_text().strip() == "Sair da tela cheia" and ex.locator("svg").count() == 1, f"{tag}: com Sair da tela cheia")
        tabs = a.locator("nav .tabs").bounding_box()
        eb = ex.bounding_box()
        check(eb["x"] >= tabs["x"] + tabs["width"] and eb["x"] + eb["width"] <= w, f"{tag}: o Sair ao lado das abas, sem passar por cima")
        pg.screenshot(path=str(SHOTS / f"cheia-{scheme}-{w}-barra.png"))
        pg.mouse.move(w / 2, H / 2)
        pg.wait_for_timeout(400)
        check(a.evaluate(NAV)[0] >= H - 10, f"{tag}: o mouse sai, a barra se esconde")
        # escrevendo, a barra da escrita também fica escondida até o mouse ir lá
        a.locator(".pad .leaf.left").click(position={"x": 260, "y": 90})
        pg.wait_for_timeout(300)
        check(a.locator("nav.write").count() == 1 and a.evaluate(NAV)[0] >= H - 10, f"{tag}: escrevendo, a barra da escrita escondida também")
        pg.keyboard.press("Tab")
        pg.mouse.move(w / 2, H / 2)
        a.evaluate("(el) => el.renderRoot.activeElement && el.renderRoot.activeElement.blur()")
        pg.wait_for_timeout(300)
        # o Agora também
        a.locator("nav .tab", has_text="Agora").evaluate("(e) => e.click()")
        pg.wait_for_timeout(600)
        if a.locator(".pad").count():
            check(a.evaluate("(el) => el.hasAttribute('full')") and not a.evaluate(SEEN, ".brand-head .head-row"), f"{tag}: no Agora também (sem a linha do MemorIA, Conversar e Falar)")
            pg.screenshot(path=str(SHOTS / f"cheia-{scheme}-{w}-agora.png"))
        # 1.30.1: na tela cheia, o Agora é da casa: os blocos de todos, não só os de quem está usando
        a.evaluate("(el) => { el._data = { ...el._data, blocks: el._data.blocks.map((b) => b.id === 'treino00001' ? { ...b, owner: 'Beto', periods: [], times: ['00:00'] } : b.owner === 'Beto' ? b : { ...b, periods: [], times: [] }), pages: el._data.pages.map((p) => ({ ...p, times: [] })) }; el._fullAgora(); el.requestUpdate(); }")
        pg.wait_for_timeout(500)
        mine = a.evaluate("(el) => el._me()")
        names = a.evaluate("(el) => el._schedule().map((e) => el._block(e.block).name)")
        check(mine == "Ana" and "Treino" in names and a.evaluate("(el) => el._pad && el._block(el._pad.block).name") == "Treino", f"{tag}: na tela cheia, o Agora de Ana mostra o bloco de Beto ({names})")
        pg.screenshot(path=str(SHOTS / f"cheia-{scheme}-{w}-todos.png"))
        # Esc sai
        pg.keyboard.press("Escape")
        pg.wait_for_timeout(400)
        check(not a.evaluate("(el) => el.hasAttribute('full')") and a.evaluate(NAV)[1] <= H + 1 and a.evaluate(NAV)[0] < H - 40, f"{tag}: Esc sai da tela cheia, a barra de volta")
        check(a.locator("nav .full-exit").count() == 0, f"{tag}: e o Sair some")
        names = a.evaluate("(el) => el._schedule().map((e) => el._block(e.block).name)")
        check("Treino" not in names and a.evaluate("(el) => el._pad") is None, f"{tag}: fora da tela cheia, o Agora volta a ser de Ana ({names})")
        # no Agora sem nada agora, o mesmo botão liga e desliga
        hb = a.locator(".brand-head .full-btn")
        check(hb.count() == 1 and hb.get_attribute("aria-label") == "Tela cheia", f"{tag}: o Agora vazio também tem Tela cheia")
        hb.click()
        pg.wait_for_timeout(400)
        check(a.evaluate("(el) => el._full") and a.evaluate("(el) => el._pad && el._block(el._pad.block).name") == "Treino", f"{tag}: ligada pelo Agora, o bloco de Beto")
        pg.keyboard.press("Escape")
        pg.wait_for_timeout(400)
        # pelo Sair da tela cheia também
        a.locator(".brand-head .full-btn").click() if a.locator(".brand-head .full-btn").count() else btn.click()
        pg.wait_for_timeout(300)
        pg.mouse.move(w / 2, H - 3)
        pg.wait_for_timeout(400)
        a.locator("nav .full-exit").click()
        pg.wait_for_timeout(400)
        check(not a.evaluate("(el) => el.hasAttribute('full')"), f"{tag}: Sair da tela cheia sai")
        check(not errs, f"{tag}: sem erros {errs}")
        ctx.close()
    b.close()

print(f"{n_ok} checks passed" if not failed else f"{len(failed)} FAILED of {n_ok + len(failed)}")
print(f"screenshots in {SHOTS}")
sys.exit(1 if failed else 0)
