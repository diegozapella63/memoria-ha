# MemorIA 1.51.0 (o dono: "do mesmo jeito que criamos esse agrupar por… a gente precisa adicionar ele em outros locais"; o
# modelo é o dos Consumíveis do InventarIA): Blocos › Agrupar por Nenhum (como sempre), Categoria, De quem é e Horário, numa
# barra só, do mesmo tamanho; cada grupo com o ícone, o nome e quantos, que fecha pelo título; o título Agrupar por fecha o
# bloco (com o escolhido ao lado); o aparelho lembra. Em blocos e em lista. 390 e 320 px, claro e escuro.
#
# Usa a prévia (sem servidor): cd frontend && npm run build, depois
#   python3 tests/agrupar_check.py [pasta das capturas]
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


def texts(loc):
    return [" ".join(t.split()) for t in loc.all_inner_texts()]


HORAS = ["Manhã", "Tarde", "Noite", "Sem horário"]

with sync_playwright() as p:
    b = p.chromium.launch()
    for scheme, w in (("light", 390), ("dark", 320)):
        tag = f"{scheme} {w}px"
        ctx = b.new_context(viewport={"width": w, "height": 844}, device_scale_factor=2, color_scheme=scheme, has_touch=True, is_mobile=True)
        pg = ctx.new_page()
        errs = []
        pg.on("pageerror", lambda e: errs.append(str(e)))
        pg.goto(PREVIEW)
        a = pg.locator("memoria-app")
        a.locator(".page-title").first.wait_for()
        pg.wait_for_timeout(500)
        a.locator("nav .tab", has_text="Blocos").click()
        pg.wait_for_timeout(500)
        n_blocos = a.locator(".shelf .cover:not(.add)").count()
        ops = texts(a.locator(".agrupar-seg button"))
        check(ops[0] == "Nenhum" and ops[-1] == "Horário" and "Categoria" in ops, f"{tag}: Nenhum (de início), Categoria… e Horário ({ops})")
        check(a.locator(".agrupar-seg button.on").inner_text().strip() == "Nenhum" and a.locator(".shelf-grp").count() == 0, f"{tag}: Nenhum: as capas, como sempre")
        boxes = [x.bounding_box() for x in a.locator(".agrupar-seg button").all()]
        check(len({round(x["y"]) for x in boxes}) == 1 and max(x["width"] for x in boxes) - min(x["width"] for x in boxes) < 2, f"{tag}: numa linha, do mesmo tamanho")
        # Horário
        a.locator(".agrupar-seg button", has_text="Horário").click()
        pg.wait_for_timeout(300)
        nomes = texts(a.locator(".shelf-grp .grp-h b"))
        check(nomes and all(n in HORAS for n in nomes) and nomes == sorted(nomes, key=HORAS.index), f"{tag}: Horário: na ordem do dia ({nomes})")
        conta = [int(t.split()[0]) for t in texts(a.locator(".shelf-grp .grp-n"))]
        capas = [g.locator(".cover").count() for g in a.locator(".shelf-grp").all()]
        check(conta == capas and sum(capas) >= n_blocos, f"{tag}: quantos no título ({conta}), cada bloco em cada período em que abre")
        check(a.locator(".shelf .cover.add").count() == 1, f"{tag}: Novo bloco uma vez, no fim")
        pg.screenshot(path=str(SHOTS / f"agrupar-hora-{scheme}-{w}.png"), full_page=True)
        # Categoria: o ícone na cor de cada uma
        a.locator(".agrupar-seg button", has_text="Categoria").click()
        pg.wait_for_timeout(300)
        check(a.locator('.shelf-grp .grp-h[style*="--c"]').count() >= 1, f"{tag}: Categoria: o ícone na cor da categoria")
        # um grupo fecha pelo título
        g0 = a.locator(".shelf-grp").first
        g0.locator(".grp-h").click()
        pg.wait_for_timeout(200)
        check(g0.locator(".cover").count() == 0 and g0.locator(".grp-h").get_attribute("aria-expanded") == "false", f"{tag}: o grupo fecha pelo título")
        # em lista
        a.locator(".view-toggle button[aria-label='Em lista']").click()
        pg.wait_for_timeout(300)
        check(a.locator(".shelf-grp .shelf-list .block-row").count() >= 1 and a.locator(".block-row.add").count() == 1, f"{tag}: em lista, os grupos com as linhas e o Novo bloco no fim")
        check(not pg.evaluate("() => document.documentElement.scrollWidth > innerWidth"), f"{tag}: nada passa da largura")
        pg.screenshot(path=str(SHOTS / f"agrupar-lista-{scheme}-{w}.png"), full_page=True)
        # o bloco fecha pelo título, com o escolhido ao lado; o aparelho lembra
        a.locator(".agrupar-l").click()
        pg.wait_for_timeout(200)
        check(a.locator(".agrupar-seg").count() == 0 and a.locator(".agrupar-val").inner_text().strip() == "· Categoria", f"{tag}: fechado, o escolhido ao lado")
        pg.reload()
        a.locator(".page-title").first.wait_for()
        pg.wait_for_timeout(500)
        a.locator("nav .tab", has_text="Blocos").click()
        pg.wait_for_timeout(400)
        check(a.locator(".agrupar.fechado").count() == 1 and a.locator(".shelf-grp").count() >= 1 and a.locator(".shelf-grp.shut").count() == 1, f"{tag}: o aparelho lembra a escolha, o bloco e o grupo fechados")
        a.locator(".agrupar-l").click()
        a.locator(".agrupar-seg button", has_text="Nenhum").click()
        a.locator(".view-toggle button[aria-label='Em blocos']").click()
        pg.wait_for_timeout(300)
        check(a.locator(".shelf-grp").count() == 0 and a.locator(".shelf .cover:not(.add)").count() == n_blocos, f"{tag}: de volta ao Nenhum")
        check(not errs, f"{tag}: sem erros na tela ({errs[:2]})")
        ctx.close()
    b.close()

print(f"{n_ok} checks passed" + (f", FAILED: {failed}" if failed else ""))
sys.exit(1 if failed else 0)
