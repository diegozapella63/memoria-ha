# MemorIA 1.4.0: Mais is a menu like the other apps of the family (Configurações, then Sobre, the last row);
# Configurações in tabs (Integrações, Dados, Aparência, Opções), the tab in the address of the screen (it stays
# on a reload); the phone's Back, "‹ Mais", Mais in the bar and a swipe to the right go back to the menu.
# Swiping sideways changes the tab of the bar (Agora ⇄ Blocos ⇄ Buscar ⇄ Mais), never on the notebook (there it
# turns the page). Sistema follows the light/dark mode while the app is open (the system, and in the preview
# the viewer's data-theme); Cor do dia changes the color of the app every day.
# 320 px to the computer, light and dark.
#
# Uses the preview (no server): cd frontend && npm run build, then
#   python3 tests/mais_check.py [folder for the screenshots]
import os, re, sys, tempfile
from datetime import date
from pathlib import Path
from playwright.sync_api import sync_playwright

REPO = Path(__file__).resolve().parent.parent
# the preview over http (tests/visual.sh): Chromium does not always keep what a file:// page saves across a reload
PREVIEW = os.environ.get("MEMORIA_PREVIEW_URL") or (REPO / "preview" / "memoria-preview.html").as_uri()
SHOTS = Path(sys.argv[1] if len(sys.argv) > 1 else os.environ.get("MEMORIA_SHOTS", Path(tempfile.gettempdir()) / "memoria-shots"))
SHOTS.mkdir(parents=True, exist_ok=True)
VERSION = re.search(r'^version:\s*"?([\d.]+)', (REPO / "memoria" / "config.yaml").read_text(), re.M).group(1)
# 1.17.0: the palette of the family, in its order (the Cor do dia goes through the 11 without the Grafite)
PALETTE = ["vermelho", "coral", "laranja", "ouro", "verde", "menta", "turquesa", "azul", "indigo", "lilas", "rosa"]  # no grafite
FILLS = {"vermelho": "#FF5A4F", "coral": "#FF8A65", "laranja": "#FFA23E", "ouro": "#F2C14E", "verde": "#8BD45F", "menta": "#4ED3A6", "turquesa": "#3CCBDA", "azul": "#62B5FF", "indigo": "#8F9BFF", "lilas": "#B99BFF", "rosa": "#FF77A9"}

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
    const r = e.getBoundingClientRect();
    if (e.closest(".more-tabs, .cat-filter")) continue;
    if (r.width && (r.right > W + 1 || r.left < -1)) bad.push(e.tagName.toLowerCase() + "." + [...e.classList].join(".") + " " + Math.round(r.left) + ".." + Math.round(r.right));
  }
  if (document.documentElement.scrollWidth > W) bad.push("page " + document.documentElement.scrollWidth);
  return bad.slice(0, 4);
}"""

SWIPE = """([sel, x0, y0, x1, y1]) => {
  const root = document.querySelector('memoria-app').renderRoot;
  const el = root.querySelector(sel);
  if (!el) return 'no element';
  const mk = (x, y) => new Touch({ identifier: 1, target: el, clientX: x, clientY: y, pageX: x, pageY: y });
  const t0 = mk(x0, y0), t1 = mk(x1, y1);
  el.dispatchEvent(new TouchEvent('touchstart', { touches: [t0], targetTouches: [t0], changedTouches: [t0], bubbles: true, composed: true }));
  el.dispatchEvent(new TouchEvent('touchend', { touches: [], targetTouches: [], changedTouches: [t1], bubbles: true, composed: true }));
  return 'ok';
}"""


def view(a):
    return a.evaluate("(el) => { const v = el._view(); return v.tab ? v.name + ':' + v.tab : v.name; }")


def color_of_day():
    d = date.today()
    day = (d - date(1970, 1, 1)).days
    return PALETTE[day % len(PALETTE)]


with sync_playwright() as p:
    b = p.chromium.launch()
    for scheme, w in (("light", 390), ("dark", 390), ("light", 320), ("dark", 1280)):
        tag = f"{scheme} {w}px"
        phone = w < 1000
        ctx = b.new_context(viewport={"width": w, "height": 844 if phone else 900}, device_scale_factor=2, color_scheme=scheme, has_touch=phone, is_mobile=phone)
        pg = ctx.new_page()
        errs = []
        pg.on("pageerror", lambda e: errs.append(str(e)))
        pg.goto(PREVIEW)
        a = pg.locator("memoria-app")
        a.locator(".page-title").first.wait_for()
        pg.wait_for_timeout(500)

        # ---- the menu
        a.locator("nav .tab", has_text="Mais").click()
        pg.wait_for_timeout(500)
        check(view(a) == "more", f"{tag}: Mais open")
        rows = [" ".join(t.split()) for t in a.locator(".more-menu .more-row").all_inner_texts()]
        check(rows[-2:] == ["Configurações Integrações, dados e backup, aparência e opções.", "Sobre CorrerIA Code, os apps e o GitHub."], f"{tag}: the menu: Configurações, then Sobre, the last ({rows})")
        after = a.evaluate("(el) => { const p = [...el.renderRoot.querySelectorAll('section.page > *')]; const i = p.findIndex((x) => x.classList.contains('more-menu')); return p.slice(i + 1).map((x) => x.className); }")
        check(after == ["foot"], f"{tag}: only the foot after the menu ({after})")
        check(a.locator(".overline", has_text="Aparência").count() == 0 and a.locator(".swatches, .tag-swatches").count() == 0, f"{tag}: no settings on the menu")
        foot = " ".join(a.locator(".foot").inner_text().split())
        check(foot == f"MemorIA v{VERSION} · suas anotações ficam no Home Assistant e entram no backup dele.", f"{tag}: the foot ({foot})")
        check(not a.evaluate(OVER), f"{tag}: menu: nothing past the edge")
        pg.screenshot(path=str(SHOTS / f"mais-menu-{scheme}-{w}.png"))

        # ---- Configurações
        a.locator(".more-row", has_text="Configurações").click()
        pg.wait_for_timeout(600)
        check(view(a) == "config:integracoes", f"{tag}: Configurações opens on Integrações ({view(a)})")
        check(a.locator(".page-title").first.inner_text().strip() == "Configurações" and a.locator(".uplink").inner_text().strip() == "Mais", f"{tag}: title and ‹ Mais")
        check(a.locator("nav .tab.on").inner_text().strip() == "Mais", f"{tag}: Mais lit in the bar")
        # 1.17.0: the bar of the family: Agora, Buscar, Adicionar in the middle, Blocos and, last, Mais with three dots
        labels = [t.strip() for t in a.locator("nav .tab").all_inner_texts()]
        check(labels == ["Agora", "Buscar", "Adicionar", "Blocos", "Mais"] and "fab" in a.locator("nav .tab").nth(2).get_attribute("class"), f"{tag}: the bar ({labels})")
        check(a.locator("nav .tab").last.locator("svg circle").count() == 3, f"{tag}: Mais with three dots")
        tabs = [t.strip() for t in a.locator(".more-tabs button").all_inner_texts()]
        check(tabs == ["Integrações", "Dados", "Aparência", "Opções"], f"{tag}: the four tabs ({tabs})")
        bar = a.locator(".more-tabs").evaluate("(x) => [x.scrollWidth, x.clientWidth, [...x.querySelectorAll('button')].map((b) => b.scrollWidth <= b.clientWidth + 1)]")
        check(bar[0] <= bar[1] + 1 and all(bar[2]), f"{tag}: the four tabs fit, no text cut ({bar})")
        heads = [t.strip() for t in a.locator("[role=tabpanel] .mais-head h2").all_inner_texts()]
        check(heads == ["CorrerIA", "IA do Home Assistant", "Falar", "Uso da IA", "Sensores no Home Assistant"], f"{tag}: Integrações in the order of the family ({heads})")
        check(a.locator("#leitura-ia select").count() == 1, f"{tag}: IA usada pelo app in Integrações")
        uso = a.locator("#uso-ia")
        check(uso.locator(".uso-tile").count() == 3 and uso.locator(".uso-bar").count() == 7, f"{tag}: Uso da IA: today, 7 days, this month and a bar per day")
        check(a.locator("#sensor input[role=switch]").count() == 2, f"{tag}: Sensores: MemorIA agora and Chamadas de IA hoje")
        check(not a.evaluate(OVER), f"{tag}: Integrações: nothing past the edge {a.evaluate(OVER)}")
        pg.screenshot(path=str(SHOTS / f"mais-config-integracoes-{scheme}-{w}.png"))

        expect = {
            "Dados": ("config:dados", ["Exportar", "Backup na pasta share", "Importar", "Versões anteriores", "Onde ficam os dados", "Começar do zero"]),
            "Aparência": ("config:aparencia", ["Tema", "Cor do app", "Letra de mão"]),
            "Opções": ("config:opcoes", ["Blocos", "Períodos do dia"]),
        }
        for t, (v, want) in expect.items():
            a.locator(".more-tabs button", has_text=t).click()
            pg.wait_for_timeout(500)
            check(view(a) == v, f"{tag}: tab {t} ({view(a)})")
            on = a.locator(".more-tabs button.on")
            check(on.count() == 1 and on.inner_text().strip() == t and on.get_attribute("aria-selected") == "true", f"{tag}: {t} marked")
            heads = [x.strip() for x in a.locator("[role=tabpanel] .mais-head h2").all_inner_texts()]
            check(heads == want, f"{tag}: {t}: {heads}")
            check(not a.evaluate(OVER), f"{tag}: {t}: nothing past the edge {a.evaluate(OVER)}")
            pg.screenshot(path=str(SHOTS / f"mais-config-{v.split(':')[1]}-{scheme}-{w}.png"))
            if t == "Dados":
                widths = a.evaluate("(el) => [...el.renderRoot.querySelectorAll('#dados .opts .btn, #dados .sec-actions .btn')].map((b) => Math.round(b.getBoundingClientRect().width))")
                check(len(widths) == 7 and len(set(widths)) == 1, f"{tag}: Dados: every button the same width ({widths})")
                hs = a.evaluate("(el) => [...el.renderRoot.querySelectorAll('#dados .opts .btn, #dados .sec-actions .btn')].map((b) => Math.round(b.getBoundingClientRect().height))")
                check(min(hs) >= 48 and len(set(hs)) == 1 and (w >= 1000 or widths[0] >= w - 90), f"{tag}: Dados: like the GerencIA, the width of the card on the phone and the same height ({widths[0]}x{hs})")
        # the tab is in the address of the screen: it stays on a reload
        check(a.evaluate("() => history.state.rvPath") == "/config/opcoes", f"{tag}: the tab in the address")
        pg.reload()
        a.locator(".page-title").first.wait_for()
        pg.wait_for_timeout(500)
        check(view(a) == "config:opcoes", f"{tag}: reload keeps the tab ({view(a)})")
        # switching tabs replaces the entry: Back goes to the menu, then to Agora
        pg.go_back()
        pg.wait_for_timeout(500)
        check(view(a) == "more", f"{tag}: Back from a tab goes to the menu ({view(a)})")
        pg.go_back()
        pg.wait_for_timeout(500)
        check(view(a) == "now", f"{tag}: Back again goes to Agora ({view(a)})")
        # ‹ Mais and Mais in the bar
        for how in ("uplink", "tab"):
            a.locator("nav .tab", has_text="Mais").click()
            pg.wait_for_timeout(400)
            a.locator(".more-row", has_text="Configurações").click()
            pg.wait_for_timeout(400)
            a.locator(".more-tabs button", has_text="Dados").click()
            pg.wait_for_timeout(400)
            (a.locator(".uplink") if how == "uplink" else a.locator("nav .tab", has_text="Mais")).click()
            pg.wait_for_timeout(500)
            check(view(a) == "more", f"{tag}: {how} goes back to the menu ({view(a)})")
            pg.go_back()
            pg.wait_for_timeout(500)
            check(view(a) == "now", f"{tag}: and then Back goes to Agora ({how}: {view(a)})")
        # another tab of the bar from Configurações: there, and Back goes to Agora
        a.locator("nav .tab", has_text="Mais").click()
        pg.wait_for_timeout(400)
        a.locator(".more-row", has_text="Configurações").click()
        pg.wait_for_timeout(400)
        a.locator("nav .tab", has_text="Buscar").click()
        pg.wait_for_timeout(700)
        check(view(a) == "search", f"{tag}: Buscar from Configurações ({view(a)})")
        pg.go_back()
        pg.wait_for_timeout(500)
        check(view(a) == "now", f"{tag}: then Back goes to Agora ({view(a)})")

        # ---- swipe (the phone)
        if phone:
            x0, x1 = w * 0.75, w * 0.2
            seq = []
            a.locator("nav .tab", has_text="Buscar").click()
            pg.wait_for_timeout(500)
            for _ in range(2):
                pg.evaluate(SWIPE, ["main .page-title", x0, 120, x1, 130])
                pg.wait_for_timeout(600)
                seq.append(view(a))
            check(seq == ["more", "more"], f"{tag}: swipe left: Buscar › Mais, and Mais is the last ({seq})")
            seq = []
            for _ in range(3):
                pg.evaluate(SWIPE, ["main .page-title", x1, 120, x0, 130])
                pg.wait_for_timeout(600)
                seq.append(view(a))
            check(seq == ["search", "shelf", "now"], f"{tag}: swipe right: Mais › Buscar › Blocos › Agora ({seq})")
            pg.evaluate(SWIPE, ["main .page-title", x1, 120, x0, 130])
            pg.wait_for_timeout(500)
            check(view(a) == "now", f"{tag}: Agora is the first")
            pg.evaluate(SWIPE, ["main .page-title", x0, 120, x1, 130])
            pg.wait_for_timeout(600)
            check(view(a) == "shelf", f"{tag}: swipe left from Agora: Blocos ({view(a)})")
            pg.evaluate(SWIPE, ["main .page-title", x1, 120, x0, 130])
            pg.wait_for_timeout(600)
            # on the notebook the swipe turns the page and stays on Agora
            pg0 = a.evaluate("(el) => el._pad && el._pad.page")
            pg.evaluate(SWIPE, [".pad", x1 + 40, 400, x0, 405])
            pg.wait_for_timeout(900)
            check(view(a) == "now" and a.evaluate("(el) => el._pad && el._pad.page") != pg0, f"{tag}: a swipe on the notebook turns the page, not the tab ({view(a)})")
            # a short or slanted move is not a swipe
            pg.evaluate(SWIPE, ["main .page-title", x0, 120, x0 - 40, 125])
            pg.evaluate(SWIPE, ["main .page-title", x0, 120, x1, 400])
            pg.wait_for_timeout(500)
            check(view(a) == "now", f"{tag}: short or slanted moves change nothing")
            # on a screen of Mais, to the right goes back to the menu; to the left nothing
            a.locator("nav .tab", has_text="Mais").click()
            pg.wait_for_timeout(400)
            a.locator(".more-row", has_text="Configurações").click()
            pg.wait_for_timeout(500)
            pg.evaluate(SWIPE, ["main .page-title", x0, 120, x1, 130])
            pg.wait_for_timeout(500)
            check(view(a) == "config:integracoes", f"{tag}: swipe left on Configurações changes nothing ({view(a)})")
            pg.evaluate(SWIPE, ["main .page-title", x1, 120, x0, 130])
            pg.wait_for_timeout(600)
            check(view(a) == "more", f"{tag}: swipe right on Configurações: back to the menu ({view(a)})")
            pg.go_back()
            pg.wait_for_timeout(500)
            check(view(a) == "now", f"{tag}: and then Back goes to Agora ({view(a)})")
            # with a sheet open, no swipe
            a.locator("nav .tab.fab").click()
            pg.wait_for_timeout(500)
            pg.evaluate(SWIPE, ["main .page-title", x0, 120, x1, 130])
            pg.wait_for_timeout(400)
            check(view(a) == "now" and a.evaluate("(el) => !!el._sheet"), f"{tag}: with a sheet open, no swipe")
            pg.go_back()
            pg.wait_for_timeout(500)

        # ---- the theme: Sistema follows the light/dark mode live; Claro/Escuro win
        dark = lambda: a.evaluate("(el) => el.hasAttribute('dark')")
        check(dark() == (scheme == "dark"), f"{tag}: Sistema follows the system ({scheme})")
        other = "light" if scheme == "dark" else "dark"
        pg.emulate_media(color_scheme=other)
        pg.wait_for_timeout(400)
        check(dark() == (other == "dark"), f"{tag}: the system changes, the app changes with the app open")
        bg = pg.evaluate("() => getComputedStyle(document.body).backgroundColor")
        check(bg == ("rgb(20, 18, 23)" if other == "dark" else "rgb(248, 246, 251)"), f"{tag}: the page around the app too ({bg})")
        pg.emulate_media(color_scheme=scheme)
        pg.wait_for_timeout(400)
        # the preview inside a viewer that has its own light/dark (data-theme on the page)
        pg.evaluate(f"() => document.documentElement.setAttribute('data-theme', '{other}')")
        pg.wait_for_timeout(400)
        check(dark() == (other == "dark"), f"{tag}: the viewer's theme (data-theme={other}) wins in Sistema")
        pg.evaluate("() => document.documentElement.removeAttribute('data-theme')")
        pg.wait_for_timeout(400)
        check(dark() == (scheme == "dark"), f"{tag}: and back to the system without it")
        a.locator("nav .tab", has_text="Mais").click()
        pg.wait_for_timeout(400)
        a.locator(".more-row", has_text="Configurações").click()
        pg.wait_for_timeout(400)
        a.locator(".more-tabs button", has_text="Aparência").click()
        pg.wait_for_timeout(400)
        th = [t.strip() for t in a.locator(".seg.themes button").all_inner_texts()]
        check(th == ["Sistema", "Claro", "Escuro"], f"{tag}: Tema in three buttons ({th})")
        tw = a.evaluate("(el) => [...el.renderRoot.querySelectorAll('.seg.themes button')].map((b) => Math.round(b.getBoundingClientRect().width))")
        check(len(set(tw)) == 1, f"{tag}: the three the same width ({tw})")
        a.locator(".seg.themes button", has_text="Claro" if scheme == "dark" else "Escuro").click()
        pg.wait_for_timeout(300)
        check(dark() == (scheme != "dark"), f"{tag}: {'Claro' if scheme == 'dark' else 'Escuro'} wins over the system")
        pg.emulate_media(color_scheme=other)
        pg.wait_for_timeout(1700)
        check(dark() == (scheme != "dark"), f"{tag}: and the system changing doesn't move it")
        pg.emulate_media(color_scheme=scheme)
        a.locator(".seg.themes button", has_text="Sistema").click()
        pg.wait_for_timeout(300)
        check(dark() == (scheme == "dark"), f"{tag}: Sistema again")
        # Cor do dia: on by default, the color of today; a color turns it off; the switch turns it back on
        sw = a.locator(".daily-row input[role=switch]")
        check(sw.is_checked(), f"{tag}: Cor do dia on by default")
        today = color_of_day()
        acc = a.evaluate("(el) => el._accent().id")
        check(acc == today, f"{tag}: the color of today ({acc}, {today})")
        on = a.locator(".tag-swatches .tsw.on")
        check(on.count() == 1 and on.inner_text().strip().lower().replace("á", "a") == today, f"{tag}: today's color marked ({on.inner_text() if on.count() else ''})")
        # tomorrow, another color (the app open past midnight)
        nxt = a.evaluate("(el) => { const t = el._now; el._now = t + 86400000; const id = el._accent().id; el._now = t; return id; }")
        check(nxt == PALETTE[(PALETTE.index(today) + 1) % len(PALETTE)], f"{tag}: tomorrow the next color ({nxt})")
        pick = "azul" if today != "azul" else "menta"
        a.locator(".tag-swatches .tsw", has_text=pick.capitalize()).click()
        pg.wait_for_timeout(400)
        check(not sw.is_checked() and a.evaluate("(el) => el._accent().id") == pick, f"{tag}: choosing {pick} turns Cor do dia off")
        ink = a.evaluate("(el) => getComputedStyle(el.renderRoot.querySelector('.root')).getPropertyValue('--rv-accent').trim()")
        check(ink.upper() == FILLS[pick].upper(), f"{tag}: the app in {pick} ({ink})")
        sw.click()
        pg.wait_for_timeout(400)
        check(sw.is_checked() and a.evaluate("(el) => el._accent().id") == today, f"{tag}: the switch brings Cor do dia back")
        pg.screenshot(path=str(SHOTS / f"mais-aparencia-{scheme}-{w}.png"))
        check(not errs, f"{tag}: no page errors {errs}")
        ctx.close()
    b.close()

print(f"{n_ok} checks passed" if not failed else f"{len(failed)} FAILED, {n_ok} passed")
print(f"screenshots in {SHOTS}")
sys.exit(1 if failed else 0)
