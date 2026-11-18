# MemorIA 1.35.0: no computador (1000 px ou mais), a barra lateral dos outros apps no lugar da barra de baixo: o nome
# com o ícone, Adicionar, Agora, Buscar, Blocos e Mais (a tela aberta marcada), os blocos (um toque abre; o aberto
# marcado) e a versão. As telas ficam no meio do resto, as janelas viram uma janela no meio, o nome sai do alto (fica o
# Olá) e a barra de escrever continua. Na Tela cheia e abaixo de 1000 px, sem a lateral. 1280 px (claro e escuro),
# 1660 (Tela cheia) e 999.
#
# Usa a prévia (sem servidor): cd frontend && npm run build, depois
#   python3 tests/lateral_check.py [pasta das capturas]
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
BOX = "(el, s) => { const r = el.renderRoot.querySelector(s).getBoundingClientRect(); return [Math.round(r.left), Math.round(r.top), Math.round(r.width), Math.round(r.bottom)]; }"
CUR = "(el) => [...el.renderRoot.querySelectorAll('.side [aria-current=\"page\"]')].map((x) => x.textContent.replace(/\\s+/g, ' ').trim())"

with sync_playwright() as p:
    b = p.chromium.launch()
    for scheme, w in (("light", 1280), ("dark", 1280), ("light", 1660), ("light", 999)):
        tag = f"{scheme} {w}px"
        H = 860
        ctx = b.new_context(viewport={"width": w, "height": H}, color_scheme=scheme)
        pg = ctx.new_page()
        errs = []
        pg.on("pageerror", lambda e: errs.append(str(e)))
        pg.goto(PREVIEW)
        a = pg.locator("memoria-app")
        a.locator(".page-title").first.wait_for()
        pg.wait_for_timeout(500)
        if w < 1000:
            check(not a.evaluate(SEEN, ".side"), f"{tag}: sem a lateral")
            check(a.evaluate(SEEN, "nav .tabs"), f"{tag}: a barra de baixo")
            check(a.evaluate(SEEN, ".eyebrow .brand"), f"{tag}: o nome no alto")
            check(not errs, f"{tag}: sem erros {errs}")
            ctx.close()
            continue
        if w >= 1660:
            a.evaluate("(el) => el._go('/bloco/ideias00001')")
            pg.wait_for_timeout(600)
            check(a.evaluate(SEEN, ".side"), f"{tag}: a lateral antes da Tela cheia")
            a.locator(".dh-row .full-btn").click()
            pg.wait_for_timeout(500)
            check(not a.evaluate(SEEN, ".side"), f"{tag}: na Tela cheia, sem a lateral")
            check(a.evaluate(SEEN, "nav .tabs"), f"{tag}: na Tela cheia, a faixa da barra de baixo, como antes")
            check(a.evaluate(BOX, ".pad")[0] < 60, f"{tag}: na Tela cheia, o caderno com a tela toda")
            pg.screenshot(path=str(SHOTS / f"lateral-cheia-{w}.png"))
            pg.keyboard.press("Escape")
            pg.wait_for_timeout(400)
            check(a.evaluate(SEEN, ".side"), f"{tag}: saindo, a lateral volta")
            check(not errs, f"{tag}: sem erros {errs}")
            ctx.close()
            continue

        # ---- a lateral, no lugar da barra de baixo
        check(a.evaluate(BOX, ".side")[0:3] == [0, 0, 272], f"{tag}: a lateral na esquerda, com 272 ({a.evaluate(BOX, '.side')})")
        check(not a.evaluate(SEEN, "nav .tabs"), f"{tag}: sem a barra de baixo")
        check(a.evaluate(BOX, "main")[0] == 272, f"{tag}: a tela no resto")
        check(a.locator(".side-brand").inner_text().strip() == "MemorIA" and a.locator(".side-brand svg.app-ic").count() == 1, f"{tag}: o nome com o ícone")
        links = [x.strip() for x in a.locator(".side-link").all_inner_texts()]
        check(links == ["Agora", "Buscar", "Blocos", "Mais"], f"{tag}: Agora, Buscar, Blocos e Mais ({links})")
        check(a.evaluate(CUR) == ["Agora"], f"{tag}: o Agora marcado ({a.evaluate(CUR)})")
        names = [x.strip() for x in a.locator(".side-list .sl-name").all_inner_texts()]
        shelf = a.evaluate("(el) => el._blocks().filter((b) => el._ofWho(b, el._shelfWho())).map((b) => b.name)")
        check(names == shelf and len(names) >= 2, f"{tag}: os blocos em uso, na ordem ({names})")
        check(a.locator(".side-foot").inner_text().startswith("MemorIA "), f"{tag}: a versão embaixo")
        add = a.evaluate(BOX, ".side-add")
        check(add[2] == 243 and add[3] - add[1] == 50, f"{tag}: o Adicionar na largura da lateral, com 50 ({add})")
        check(not a.evaluate(SEEN, ".eyebrow .brand") and "olá" in a.locator(".eyebrow").first.inner_text().lower(), f"{tag}: no alto, só o Olá")
        pg.screenshot(path=str(SHOTS / f"lateral-agora-{scheme}.png"))

        # ---- um bloco: abre e fica marcado
        first = a.locator(".side-list").nth(1)
        bname = first.locator(".sl-name").inner_text().strip()
        first.click()
        pg.wait_for_timeout(600)
        v = a.evaluate("(el) => el._view()")
        check(v["name"] == "block" and len(a.evaluate(CUR)) == 1, f"{tag}: a tela do bloco, só ele marcado ({v}, {a.evaluate(CUR)})")
        check(a.locator('.side-list[aria-current="page"] .sl-name').inner_text().strip() == bname, f"{tag}: o {bname} marcado")
        pg.screenshot(path=str(SHOTS / f"lateral-bloco-{scheme}.png"))

        # ---- Blocos e Mais
        a.locator('.side-link:has-text("Blocos")').click()
        pg.wait_for_timeout(500)
        check(a.evaluate(CUR) == ["Blocos"], f"{tag}: Blocos marcado ({a.evaluate(CUR)})")
        pw = a.evaluate(BOX, ".page")
        check(pw[2] == 880 and abs((pw[0] - 272) - (w - pw[0] - pw[2])) <= 1, f"{tag}: a tela com 880, no meio do resto ({pw})")
        pg.screenshot(path=str(SHOTS / f"lateral-blocos-{scheme}.png"))
        a.locator('.side-link:has-text("Mais")').click()
        pg.wait_for_timeout(500)
        check(a.evaluate("(el) => el._view().name") == "more" and a.evaluate(CUR) == ["Mais"], f"{tag}: Mais marcado")
        a.evaluate("(el) => el._go('/config/aparencia')")
        pg.wait_for_timeout(500)
        check(a.evaluate(CUR) == ["Mais"], f"{tag}: nas Configurações, Mais marcado")

        # ---- Adicionar: a janela no meio do resto da tela
        a.locator(".side-add").click()
        pg.wait_for_timeout(600)
        sh = a.evaluate(BOX, ".sheet")
        check(sh[0] > 272 and sh[3] < H - 20 and sh[1] > 20, f"{tag}: a janela no meio, fora da lateral ({sh})")
        check(not a.evaluate(SEEN, ".sheet .grab"), f"{tag}: sem o puxador")
        pg.screenshot(path=str(SHOTS / f"lateral-janela-{scheme}.png"))
        pg.mouse.click(120, H - 120)  # fora da janela: fecha
        pg.wait_for_timeout(400)

        # ---- escrevendo: a barra de escrever continua, na largura do resto
        a.locator('.side-link:has-text("Agora")').click()
        pg.wait_for_timeout(500)
        a.locator(".side-list").first.click()
        pg.wait_for_timeout(600)
        ink = a.locator(".pad .ink-view, .pad .ink.blank").first
        if ink.count():
            ink.click()
            pg.wait_for_timeout(500)
            if a.evaluate("(el) => el._editing != null"):
                wb = a.evaluate(BOX, "nav.write")
                check(a.evaluate(SEEN, "nav.write") and wb[0] == 272 and wb[2] == w - 272, f"{tag}: a barra de escrever, no resto da tela ({wb})")
                pg.screenshot(path=str(SHOTS / f"lateral-escrever-{scheme}.png"))
        check(not errs, f"{tag}: sem erros {errs}")
        ctx.close()
    b.close()

print(f"\n{n_ok} ok, {len(failed)} falharam")
if failed:
    sys.exit(1)
