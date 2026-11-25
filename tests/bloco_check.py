# MemorIA 1.41.0: a tela de um bloco não rola: a folha ocupa o que sobra embaixo do cabeçalho (com uma linha ou com três)
# e um texto comprido rola dentro da folha. Os campos de escolhas do Novo bloco e dos Ajustes do bloco (Categoria, De quem
# é, Cor da capa, Folha, Quando abrir sozinho) fecham e abrem num toque no título, e o aparelho lembra. Na alteração em
# lote, a Categoria só aparece com as categorias em uso, e sem nada para alterar o Selecionar nem aparece.
#
# Usa a prévia: cd frontend && npm run build, depois tests/e2e/run.sh bloco
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


ROLA = """(el) => { const m = el.renderRoot.querySelector('main'), pad = m.querySelector('.pad'), leaf = pad.querySelector('.leaf'), r = leaf.getBoundingClientRect(), mr = m.getBoundingClientRect();
  return { main: [m.scrollHeight, m.clientHeight], doc: document.scrollingElement.scrollTop, fim: Math.round(mr.bottom - r.bottom), alto: Math.round(r.height) }; }"""
LONGO = """async (el) => { const p = el._page(el._pad.page); el._putPage({ ...p, text: Array.from({ length: 90 }, (_, i) => 'Linha ' + (i + 1) + ' de um texto comprido').join('\\n') }); await el.updateComplete; }"""
TITULOS = "(el) => [...el.renderRoot.querySelectorAll('.sheet .field > .flabel')].map((l) => [l.textContent.trim(), l.parentElement.classList.contains('dobravel'), l.parentElement.classList.contains('shut')])"

with sync_playwright() as p:
    b = p.chromium.launch()
    for w, h, scheme in ((390, 844, "dark"), (320, 600, "light"), (390, 640, "light")):
        tag = f"{w}x{h} {scheme}"
        ctx = b.new_context(viewport={"width": w, "height": h}, device_scale_factor=2, color_scheme=scheme, has_touch=True, is_mobile=True)
        pg = ctx.new_page()
        errs = []
        pg.on("pageerror", lambda e: errs.append(str(e)))
        pg.goto(PREVIEW)
        a = pg.locator("memoria-app")
        a.locator(".page-title").first.wait_for()
        pg.wait_for_timeout(500)
        # ---- a tela do bloco: a página não rola, com o cabeçalho curto e com o nome em várias linhas
        for nome in ("", "Um bloco com um nome bem comprido para ocupar três linhas no alto da tela"):
            a.evaluate("async (el, nome) => { const b = el._blocks()[0]; if (nome) el._putBlock({ ...b, name: nome }); el._openPage(b.id); await el.updateComplete; }", nome)
            pg.wait_for_timeout(700)
            m = a.evaluate(ROLA)
            check(m["main"][0] <= m["main"][1] + 1, f"{tag}: a tela do bloco não rola{' (nome comprido)' if nome else ''} ({m})")
            check(0 <= m["fim"] <= 70 and m["alto"] >= 170, f"{tag}: a folha vai até o fim da tela, sem passar ({m})")
            a.evaluate(LONGO)
            pg.wait_for_timeout(500)
            m2 = a.evaluate(ROLA)
            dentro = a.evaluate("(el) => { const v = el.renderRoot.querySelector('.pad .ink-view:not(.measure), .pad textarea.ink'); return [v.scrollHeight > v.clientHeight + 20, getComputedStyle(v).overflowY]; }")
            check(m2["main"][0] <= m2["main"][1] + 1 and m2["alto"] == m["alto"], f"{tag}: com um texto comprido a tela continua sem rolar e a folha do mesmo tamanho ({m2})")
            check(dentro[0] and dentro[1] in ("auto", "scroll"), f"{tag}: o texto comprido rola dentro da folha ({dentro})")
            if nome:
                pg.screenshot(path=str(SHOTS / f"bloco-sem-rolar-{w}-{scheme}.png"))
            pg.go_back()
            pg.wait_for_timeout(400)
        check(not errs, f"{tag}: sem erros {errs}")
        ctx.close()

    # ---- os campos que fecham e abrem, no Novo bloco e nos Ajustes do bloco
    ctx = b.new_context(viewport={"width": 390, "height": 844}, device_scale_factor=2, color_scheme="dark", has_touch=True, is_mobile=True)
    pg = ctx.new_page()
    errs = []
    pg.on("pageerror", lambda e: errs.append(str(e)))
    pg.goto(PREVIEW)
    a = pg.locator("memoria-app")
    a.locator(".page-title").first.wait_for()
    pg.wait_for_timeout(500)
    a.evaluate("(el) => el._openBlockSheet(null)")
    pg.wait_for_timeout(600)
    t = a.evaluate(TITULOS)
    nomes = [x[0] for x in t if x[1]]
    check(nomes == ["Categoria", "De quem é", "Cor da capa", "Folha", "Quando abrir sozinho"], f"Novo bloco: os campos de escolhas fecham e abrem ({t})")
    check(all(not x[2] for x in t), "abertos de início")
    for nome in ("Cor da capa", "Folha", "Quando abrir sozinho"):
        a.locator(".sheet .field > .flabel", has_text=nome).click()
    pg.wait_for_timeout(300)
    t = dict((x[0], x[2]) for x in a.evaluate(TITULOS))
    check(t["Cor da capa"] and t["Folha"] and t["Quando abrir sozinho"] and not t["Categoria"] and not t["De quem é"], f"um toque no título fecha ({t})")
    vis = a.evaluate("(el) => ['.swatches', '.papers', '.periods-pick', '.time-list'].map((s) => { const e = el.renderRoot.querySelector('.sheet ' + s); return !!e && e.getClientRects().length > 0; })")
    check(vis == [False, False, False, False], f"fechado, só o título ({vis})")
    lab = a.locator(".sheet .field > .flabel", has_text="Folha")
    check(lab.get_attribute("aria-expanded") == "false" and lab.get_attribute("role") == "button", "o título diz que está fechado")
    # 1.49.0: fechado, o escolhido ao lado do título (Folha · Pautado)
    val = lambda nome: a.locator(".sheet .field > .flabel", has_text=nome).get_attribute("data-val")
    check(val("Folha") == "Pautado" and val("Quando abrir sozinho") == "Nunca" and bool(val("Cor da capa")), f"fechado, o escolhido ao lado do título ({val('Cor da capa')}, {val('Folha')}, {val('Quando abrir sozinho')})")
    antes = a.evaluate("(el) => getComputedStyle(el.renderRoot.querySelector('.sheet .field.shut > .flabel[data-val]'), '::before').content")
    check(antes.startswith('"· '), f"desenhado depois do título ({antes})")
    a.locator(".sheet").screenshot(path=str(SHOTS / "bloco-campos-fechados.png"))
    check(sorted(pg.evaluate("JSON.parse(localStorage.getItem('memoria-campos'))")) == ["Cor da capa", "Folha", "Quando abrir sozinho"], "guardado no aparelho")
    pg.go_back()
    pg.wait_for_timeout(400)
    # nos Ajustes de um bloco, os mesmos ficam fechados; De quem é e Categoria também fecham
    a.evaluate("(el) => el._openBlockSheet(el._blocks()[0])")
    pg.wait_for_timeout(600)
    t = dict((x[0], x[2]) for x in a.evaluate(TITULOS))
    check(t.get("Cor da capa") and t.get("Folha") and not t.get("Categoria"), f"Ajustes do bloco: o aparelho lembra os fechados ({t})")
    for nome in ("De quem é", "Categoria"):
        a.locator(".sheet .field > .flabel", has_text=nome).click()
    pg.wait_for_timeout(300)
    t = dict((x[0], x[2]) for x in a.evaluate(TITULOS))
    check(t["De quem é"] and t["Categoria"], f"De quem é e Categoria também fecham ({t})")
    q = val("Quando abrir sozinho")
    check(bool(q) and q != "Nunca", f"Ajustes do bloco: Quando abrir sozinho fechado diz quando ({q})")
    a.locator(".sheet .field > .flabel", has_text="Folha").click()
    pg.wait_for_timeout(300)
    check(a.locator(".sheet .papers").evaluate("(e) => e.getClientRects().length > 0"), "outro toque abre de novo")
    pg.go_back()
    pg.wait_for_timeout(400)

    # ---- a alteração em lote: a Categoria só com as categorias em uso; sem nada para alterar, nem o Selecionar
    a.evaluate("(el) => el._go('/buscar')")
    pg.wait_for_timeout(600)
    check(a.locator("[data-sel-start]").count() == 1, "com as categorias e o Controle por pessoa, há o Selecionar")
    a.evaluate("async (el) => { await el._saveSettings({ app: { cats_off: true } }); }")
    pg.wait_for_timeout(500)
    a.locator("[data-sel-start]").click()
    pg.wait_for_timeout(300)
    a.locator(".block-row.selr").first.click()
    a.locator("[data-sel-change]").click()
    pg.wait_for_timeout(500)
    campos = [x[0] for x in a.evaluate(TITULOS)]
    check(campos == ["De quem é"], f"sem usar categorias, a alteração em lote não tem a Categoria ({campos})")
    a.locator(".sheet").screenshot(path=str(SHOTS / "bloco-lote-sem-categoria.png"))
    pg.go_back()
    pg.wait_for_timeout(300)
    a.evaluate("async (el) => { el._selEnd(); await el._saveSettings({ app: { cats_off: true, owners_off: true } }); }")
    pg.wait_for_timeout(500)
    check(a.locator("[data-sel-start]").count() == 0, "sem categorias e sem o Controle por pessoa, não há o Selecionar")
    check(not errs, f"sem erros {errs}")
    ctx.close()
    b.close()

print(f"{n_ok} checks passed" if not failed else f"{len(failed)} FAILED of {n_ok + len(failed)}")
print(f"screenshots in {SHOTS}")
sys.exit(1 if failed else 0)
