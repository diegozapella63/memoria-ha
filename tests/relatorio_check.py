# MemorIA 1.5.0: Mais › Relatório, a page made by the server (like the other apps): the header of the apps (the card
# with the stripe in the color of the app, the icon, MemorIA · anotações, the title, the count and when), the
# category and the block to choose (boxes in the look of the app; the choice comes back next time), Voltar and Baixar
# PDF side by side, the charts, the blocks with their sheets and the mark of CorrerIA Code at the end. The page in the
# theme of the app; the PDF made by the server. An invented house (tests/fixtures/casa.mjs).
#
# Starts dev/fake-ha.mjs and the server (Node 22) on free ports:
#   python3 tests/relatorio_check.py [folder for the screenshots]
import json, os, socket, subprocess, sys, tempfile, time
from pathlib import Path
from playwright.sync_api import sync_playwright

REPO = Path(__file__).resolve().parent.parent
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


def free_port():
    s = socket.socket()
    s.bind(("127.0.0.1", 0))
    port = s.getsockname()[1]
    s.close()
    return port


def wait_port(port, t=10):
    end = time.time() + t
    while time.time() < end:
        try:
            socket.create_connection(("127.0.0.1", port), 0.3).close()
            return True
        except OSError:
            time.sleep(0.1)
    return False


OVER = """() => {
  const W = window.innerWidth, bad = [];
  for (const e of document.querySelectorAll("main *")) {
    const r = e.getBoundingClientRect();
    if (r.width && (r.right > W + 1 || r.left < -1)) bad.push(e.tagName.toLowerCase() + "." + [...e.classList].join(".") + " " + Math.round(r.left) + ".." + Math.round(r.right));
  }
  if (document.documentElement.scrollWidth > W) bad.push("page " + document.documentElement.scrollWidth);
  return bad.slice(0, 4);
}"""

tmp = Path(tempfile.mkdtemp(prefix="memoria-rel-"))
(tmp / "media").mkdir()
subprocess.run(["node", "-e", "import('./tests/fixtures/casa.mjs').then((m) => require('fs').writeFileSync(process.argv[1], JSON.stringify(m.casa(Date.now()))))", str(tmp / "memoria.json")], cwd=REPO, check=True)
ha_port, port = free_port(), free_port()
env = dict(os.environ, FAKE_HA_PORT=str(ha_port), FAKE_MEDIA_DIR=str(tmp / "media"))
procs = [subprocess.Popen(["node", "dev/fake-ha.mjs"], cwd=REPO, env=env, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)]
wait_port(ha_port)
env = dict(os.environ, MEMORIA_DEV="1", PORT=str(port), HA_WS_URL=f"ws://127.0.0.1:{ha_port}/api/websocket", HA_REST_URL=f"http://127.0.0.1:{ha_port}/api", HA_TOKEN="dev", DATA_DIR=str(tmp), MEDIA_DIR=str(tmp / "media"), SHARE_DIR=str(tmp / "share"))
procs.append(subprocess.Popen(["node", "memoria/rootfs/app/server.js"], cwd=REPO, env=env, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL))
check(wait_port(port), "the server is up")
BASE = f"http://127.0.0.1:{port}/"

try:
    with sync_playwright() as p:
        b = p.chromium.launch()
        for scheme, w in (("light", 390), ("dark", 390), ("light", 320)):
            tag = f"{scheme} {w}px"
            ctx = b.new_context(viewport={"width": w, "height": 844}, device_scale_factor=2, color_scheme=scheme, has_touch=True, is_mobile=True)
            pg = ctx.new_page()
            errs = []
            pg.on("pageerror", lambda e: errs.append(str(e)))
            pg.goto(BASE)
            a = pg.locator("memoria-app")
            a.locator(".page-title").first.wait_for()
            pg.wait_for_timeout(600)
            a.locator("nav .tab", has_text="Mais").click()
            pg.wait_for_timeout(500)
            accent = a.evaluate("(el) => el._accent().fill")
            a.locator(".more-row", has_text="Relatório").click()
            pg.wait_for_url("**/relatorio?**")
            pg.wait_for_timeout(600)
            tema = "escuro" if scheme == "dark" else "claro"
            check(f"tema={tema}" in pg.url and "cor=%23" in pg.url, f"{tag}: opens in the theme and the color of the app ({pg.url})")
            check(pg.evaluate("() => document.documentElement.dataset.theme") == ("dark" if scheme == "dark" else "light"), f"{tag}: the page in the theme of the app")
            check(pg.evaluate("() => getComputedStyle(document.documentElement).getPropertyValue('--a').trim()").upper() == accent.upper(), f"{tag}: the color of the app ({accent})")
            # the header of the apps
            cab = pg.locator(".cab")
            check(" ".join(cab.locator(".app").inner_text().split()) == "MemorIA · anotações", f"{tag}: MemorIA · anotações")
            ia = pg.evaluate("() => { const b = document.querySelector('.cab .wm b'); return [b.textContent, getComputedStyle(b).color, getComputedStyle(b.parentElement).color]; }")
            check(ia[0] == "IA" and ia[1] != ia[2], f"{tag}: the IA in the color of the app")
            stripe = pg.evaluate("() => [getComputedStyle(document.querySelector('.cab')).borderLeftWidth, getComputedStyle(document.querySelector('.cab')).borderLeftColor]")
            check(stripe[0] == "6px", f"{tag}: the stripe ({stripe})")
            check(cab.locator("h1").inner_text().strip() == "Relatório de anotações", f"{tag}: the title")
            sub = cab.locator("p").inner_text().strip()
            check(sub.startswith("4 blocos · 5 folhas · ") and " às " in sub, f"{tag}: the count and when ({sub})")
            check(cab.locator("svg.ic").count() == 1, f"{tag}: the icon")
            # Voltar and Baixar PDF side by side, the same size
            bx = pg.evaluate("() => [...document.querySelectorAll('.barra a')].map((x) => { const r = x.getBoundingClientRect(); return [x.textContent.trim(), Math.round(r.width), Math.round(r.top), Math.round(r.height)]; })")
            check([x[0] for x in bx] == ["Voltar", "Baixar PDF"] and bx[0][1] == bx[1][1] and bx[0][2] == bx[1][2], f"{tag}: Voltar and Baixar PDF side by side ({bx})")
            heads = [h.strip() for h in pg.locator(".g h3").all_inner_texts()]
            check(heads == ["Por categoria", "Por bloco"], f"{tag}: the charts ({heads})")
            blocks = [h.strip() for h in pg.locator(".bloco h2 span").all_inner_texts()]
            check(blocks == ["Mercado", "Reforma da cozinha", "Inglês", "Ideias soltas"], f"{tag}: the blocks ({blocks})")
            check(pg.locator(".folha").count() == 5, f"{tag}: the sheets with text")
            marca = pg.locator(".marca")
            check(" ".join(marca.inner_text().split()).lower() == "correria code desenvolvimento de softwares" and marca.locator(".raio svg").count() == 1, f"{tag}: the mark of CorrerIA Code at the end")
            check(pg.locator("text=Ana Souza").count() == 0 and "Casa de" not in pg.content(), f"{tag}: no name of the house")
            check(not pg.evaluate(OVER), f"{tag}: nothing past the edge {pg.evaluate(OVER)}")
            pg.screenshot(path=str(SHOTS / f"relatorio-{scheme}-{w}.png"))
            pg.screenshot(path=str(SHOTS / f"relatorio-{scheme}-{w}-tudo.png"), full_page=True)

            # the category, in a box in the look of the app
            sel = pg.locator("select[name=categoria]")
            sel.scroll_into_view_if_needed()
            r = sel.bounding_box()
            pg.touchscreen.tap(r["x"] + r["width"] / 2, r["y"] + r["height"] / 2)
            pg.wait_for_timeout(500)
            sheet = pg.locator(".ss-wrap.in .ss-sheet")
            opts = [o.strip() for o in sheet.locator(".ss-opt").all_inner_texts()] if sheet.count() else []
            check(opts == ["Todas as categorias", "Casa", "Estudos", "Sem categoria"], f"{tag}: the categories in the look of the app ({opts})")
            pg.screenshot(path=str(SHOTS / f"relatorio-categoria-{scheme}-{w}.png"))
            pg.touchscreen.tap(*(lambda bb: (bb["x"] + 40, bb["y"] + bb["height"] / 2))(sheet.locator(".ss-opt", has_text="Casa").bounding_box()))
            pg.wait_for_url("**categoria=catcasa0001**")
            pg.wait_for_timeout(500)
            sub = pg.locator(".cab p").inner_text().strip()
            check(sub.startswith("Casa · 2 blocos · 3 folhas"), f"{tag}: Casa ({sub})")
            opts = [o.strip() for o in pg.locator("select[name=bloco] option").all_inner_texts()]
            check(opts == ["Todos os blocos dela", "Mercado", "Reforma da cozinha"], f"{tag}: the blocks of Casa ({opts})")
            pg.select_option("select[name=bloco]", "reforma0001")
            pg.wait_for_url("**bloco=reforma0001**")
            pg.wait_for_timeout(400)
            check(pg.locator(".cab p").inner_text().strip().startswith("Reforma da cozinha · 1 folha"), f"{tag}: one block")
            check(pg.locator(".g").count() == 0, f"{tag}: one block, no charts")
            kept = json.loads(pg.evaluate("() => localStorage.getItem('memoria.relatorio')"))
            check(kept == {"categoria": "catcasa0001", "bloco": "reforma0001"}, f"{tag}: the choice is kept ({kept})")
            # Baixar PDF: the file of what is on screen
            href = pg.locator("a.pdf").get_attribute("href")
            check(href.startswith("relatorio.pdf?") and "categoria=catcasa0001" in href and "bloco=reforma0001" in href, f"{tag}: Baixar PDF of what is chosen ({href})")
            res = pg.request.get(BASE + href)
            body = res.body()
            check(res.status == 200 and res.headers["content-type"] == "application/pdf" and body[:8] == b"%PDF-1.4", f"{tag}: the PDF comes")
            check('filename="anotacoes-reforma-da-cozinha-' in res.headers.get("content-disposition", ""), f"{tag}: its name ({res.headers.get('content-disposition')})")
            check(pg.locator("a.pdf").get_attribute("download").startswith("anotacoes-reforma-da-cozinha-"), f"{tag}: download with the name")
            # Voltar: back to the app, on Mais; opening again keeps the choice
            pg.locator(".barra a", has_text="Voltar").click()
            a.locator(".page-title").first.wait_for()
            pg.wait_for_timeout(800)
            check(a.evaluate("(el) => el._view().name") == "more", f"{tag}: Voltar goes back to Mais ({pg.url})")
            a.locator(".more-row", has_text="Relatório").click()
            pg.wait_for_url("**/relatorio?**")
            pg.wait_for_timeout(500)
            check("categoria=catcasa0001" in pg.url and "bloco=reforma0001" in pg.url, f"{tag}: opening again, the same choice ({pg.url})")
            pg.select_option("select[name=categoria]", "")
            pg.wait_for_timeout(600)
            check(pg.locator(".cab p").inner_text().strip().startswith("4 blocos · 5 folhas"), f"{tag}: Todas as categorias: everything again")
            check(json.loads(pg.evaluate("() => localStorage.getItem('memoria.relatorio')")) == {"categoria": "", "bloco": ""}, f"{tag}: and that is kept")
            check(not errs, f"{tag}: no page errors {errs}")
            ctx.close()
        b.close()
finally:
    for pr in procs:
        pr.terminate()

print(f"{n_ok} checks passed" if not failed else f"{len(failed)} FAILED, {n_ok} passed")
print(f"screenshots in {SHOTS}")
sys.exit(1 if failed else 0)
