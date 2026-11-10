# MemorIA 1.2.0 (1.4.0: Mais is a menu): Mais › Sobre, the last row of Mais, the same page as the other apps of the family
# (frontend/src/about.js is the same file as in the ResolvIA and the CronologIA): CorrerIA Code and why
# the name, the seven apps with a line and their GitHub (this one marked with its version) and Meu GitHub.
# 320 px to the computer, light and dark; Back of the phone, "‹ Mais" and Mais in the bar return to Mais.
#
# Uses the preview (no server): cd frontend && npm run build, then
#   python3 tests/about_check.py [folder for the screenshots]
import os, re, sys, tempfile
from pathlib import Path
from playwright.sync_api import sync_playwright

REPO = Path(__file__).resolve().parent.parent
# the preview over http (tests/visual.sh): Chromium does not always keep what a file:// page saves across a reload
PREVIEW = os.environ.get("MEMORIA_PREVIEW_URL") or (REPO / "preview" / "memoria-preview.html").as_uri()
SHOTS = Path(sys.argv[1] if len(sys.argv) > 1 else os.environ.get("MEMORIA_SHOTS", Path(tempfile.gettempdir()) / "memoria-shots"))
SHOTS.mkdir(parents=True, exist_ok=True)

GH = "https://github.com/diegozapella63"
APPS = [("CronologIA", "cronologia-ha"), ("ResolvIA", "resolvia-ha"), ("GerencIA", "gerencia-ha"), ("InventarIA", "inventario-ha"), ("EconomIA", "economia-ha"), ("MemorIA", "memoria-ha"), ("CorrerIA", "correria-ha")]
WHY = "Porque eu sou um programador sem tempo: vivo na correria. Então eu uso a IA para rodar tudo isso aqui. Ela escreve, testa e publica; eu dou as ideias e reclamo dos botões tortos."
VERSION = re.search(r'^version:\s*"?([\d.]+)', (REPO / "memoria" / "config.yaml").read_text(), re.M).group(1)

n_ok, failed = 0, []


def check(c, label):
    global n_ok
    print(("PASS " if c else "FAIL ") + label, flush=True)
    if c:
        n_ok += 1
    else:
        failed.append(label)


# the version is only in config.yaml; the build writes it for the server (lib/version.js) and the preview
server_v = re.search(r'export const VERSION = "([\d.]+)"', (REPO / "memoria/rootfs/app/lib/version.js").read_text()).group(1)
check(server_v == VERSION and f'"{VERSION}"' in (REPO / "preview/memoria-preview.html").read_text(), f"version {VERSION} of config.yaml in lib/version.js and the preview ({server_v})")
check(f"## {VERSION}" in (REPO / "memoria/CHANGELOG.md").read_text(), f"CHANGELOG has {VERSION}")

OVER = """(el) => {
  const W = window.innerWidth, bad = [];
  for (const e of el.renderRoot.querySelectorAll(".page *")) {
    const r = e.getBoundingClientRect();
    if (r.width && (r.right > W + 1 || r.left < -1)) bad.push(e.tagName.toLowerCase() + "." + [...e.classList].join(".") + " " + Math.round(r.left) + ".." + Math.round(r.right));
  }
  if (document.documentElement.scrollWidth > W) bad.push("page " + document.documentElement.scrollWidth);
  return bad.slice(0, 4);
}"""


def view(a):
    return a.evaluate("(el) => el._view().name")


with sync_playwright() as p:
    b = p.chromium.launch()
    for scheme, w in (("dark", 390), ("light", 320), ("light", 390), ("dark", 1280)):
        tag = f"{scheme} {w}px"
        ctx = b.new_context(viewport={"width": w, "height": 844 if w < 1000 else 900}, device_scale_factor=2, color_scheme=scheme, has_touch=w < 1000)
        pg = ctx.new_page()
        errs = []
        pg.on("pageerror", lambda e: errs.append(str(e)))
        pg.goto(PREVIEW)
        a = pg.locator("memoria-app")
        a.locator(".page-title").first.wait_for()
        check(a.evaluate("(el) => el.hasAttribute('dark')") == (scheme == "dark"), f"{tag}: {scheme} theme")

        # Agora › Mais (the tab) › Sobre (the last row)
        a.locator("nav .tab", has_text="Mais").click()
        pg.wait_for_timeout(500)
        check(view(a) == "more", f"{tag}: Mais open")
        row = a.locator(".more-menu .more-row").last
        check(row.count() == 1 and " ".join(row.inner_text().split()) == "Sobre CorrerIA Code, os apps e o GitHub.", f"{tag}: Sobre, the last row of Mais ({row.inner_text() if row.count() else ''})")
        after = a.evaluate("(el) => { const p = [...el.renderRoot.querySelectorAll('section.page > *')]; const i = p.findIndex((x) => x.querySelector && x.querySelector('.more-row')); return p.slice(i + 1).map((x) => x.className); }")
        check(after == ["foot"], f"{tag}: only the foot after the menu ({after})")
        info = a.evaluate("(el) => { const r = [...el.renderRoot.querySelectorAll('.more-row')].pop(); const i = r && r.querySelector('.mais-ic svg'); return i ? i.innerHTML : ''; }")
        check('r="10"' in info and "M12 16v-4" in info and "M12 8h.01" in info, f"{tag}: info icon on the row")
        if w == 390:
            row.scroll_into_view_if_needed()
            pg.wait_for_timeout(300)
            pg.screenshot(path=str(SHOTS / f"mais-{scheme}-{w}.png"))
        row.click()
        pg.wait_for_timeout(600)
        check(view(a) == "sobre", f"{tag}: Sobre open")
        check(a.locator(".page-title").first.inner_text().strip() == "Sobre", f"{tag}: title Sobre")
        up = a.locator(".uplink")
        check(up.count() == 1 and up.inner_text().strip() == "Mais", f"{tag}: ‹ Mais above the title")
        on = a.locator("nav .tab.on")
        check(on.count() == 1 and on.inner_text().strip() == "Mais", f"{tag}: Mais lit in the bar")

        name = a.locator(".ab-name")
        check(" ".join(name.inner_text().split()) == "CorrerIA Code", f"{tag}: CorrerIA Code ({name.inner_text()})")
        colors = a.evaluate("(el) => { const n = el.renderRoot.querySelector('.ab-name'), s = n.querySelector('span'); return [s.textContent, getComputedStyle(n).color, getComputedStyle(s).color, getComputedStyle(el.renderRoot.querySelector('.ab-mark')).backgroundColor]; }")
        check(colors[0] == "IA" and colors[2] != colors[1], f"{tag}: the IA of CorrerIA in the accent color ({colors})")
        what = a.locator(".ab-what")
        wh = what.evaluate("(x) => [x.textContent, getComputedStyle(x).textTransform, x.getBoundingClientRect().height, parseFloat(getComputedStyle(x).fontSize), x.scrollWidth <= x.clientWidth]")
        check(wh[0] == "desenvolvimento de softwares" and wh[1] == "uppercase", f"{tag}: desenvolvimento de softwares, in capitals ({wh[:2]})")
        check(wh[2] < wh[3] * 2 and wh[4], f"{tag}: desenvolvimento de softwares in one line ({wh[2:]})")
        tg = a.locator(".ab-tag")
        check(tg.inner_text().strip() == "Feito na correria, rodado pela IA." and tg.evaluate("(x) => getComputedStyle(x).fontStyle") == "italic", f"{tag}: Feito na correria, rodado pela IA. in italics")

        why = a.locator(".about-why")
        check(why.locator("h2").inner_text().strip() == "Por que CorrerIA?", f"{tag}: Por que CorrerIA?")
        check(" ".join(why.locator("p").inner_text().split()) == WHY, f"{tag}: the text of why CorrerIA")

        apps = a.locator(".about-apps .ab-row")
        check(a.locator(".about .mais-head h2").nth(1).inner_text().strip() == "Os apps", f"{tag}: Os apps")
        hrefs = [apps.nth(i).get_attribute("href") for i in range(apps.count())]
        check(hrefs == [f"{GH}/{r}" for _, r in APPS], f"{tag}: the seven apps, in order, each to its GitHub ({hrefs})")
        wm = a.evaluate("(el) => [...el.renderRoot.querySelectorAll('.about-apps .ab-wm')].map((x) => [x.textContent, x.querySelector('span').textContent, getComputedStyle(x).color !== getComputedStyle(x.querySelector('span')).color])")
        check([x[0] for x in wm] == [n for n, _ in APPS], f"{tag}: the names, with no space inside ({[x[0] for x in wm]})")
        check(all(x[1] == "IA" and x[2] for x in wm), f"{tag}: the IA of each name in the accent color")
        lines = [" ".join(t.split()) for t in apps.locator(".mb > span").all_inner_texts()]
        check(len(lines) == 7 and all(lines), f"{tag}: a line about each app")
        here = a.locator(".ab-row.here")
        check(here.count() == 1 and here.get_attribute("href") == f"{GH}/memoria-ha" and here.locator(".ab-here").inner_text().strip() == f"Este app · v{VERSION}", f"{tag}: MemorIA marked Este app · v{VERSION}")
        targets = a.locator(".about a").evaluate_all("(xs) => xs.map((x) => x.target + ' ' + x.rel)")
        check(len(targets) == 8 and all(t == "_blank noopener" for t in targets), f"{tag}: 8 links open outside ({targets})")
        gh = a.locator("a.ab-github")
        gw = gh.evaluate("(x) => [x.getBoundingClientRect().width, x.parentElement.getBoundingClientRect().width]")
        check(gh.get_attribute("href") == GH and gh.inner_text().strip() == "Meu GitHub" and abs(gw[0] - gw[1]) < 1, f"{tag}: Meu GitHub, wide ({gw})")
        brands = a.evaluate("(el) => [...el.renderRoot.querySelectorAll('.about svg')].filter((s) => /github/i.test(s.outerHTML)).length")
        check(brands == 0, f"{tag}: no brand logo")
        over = a.evaluate(OVER)
        check(not over, f"{tag}: nothing past the edge {over}")
        pg.screenshot(path=str(SHOTS / f"sobre-{scheme}-{w}.png"))
        gh.scroll_into_view_if_needed()
        pg.wait_for_timeout(300)
        over = a.evaluate(OVER)
        check(not over, f"{tag}: nothing past the edge at the end {over}")
        pg.screenshot(path=str(SHOTS / f"sobre-{scheme}-{w}-fim.png"))

        # Back of the phone: Sobre › Mais › Agora
        pg.go_back()
        pg.wait_for_timeout(500)
        check(view(a) == "more", f"{tag}: Back goes to Mais")
        pg.go_back()
        pg.wait_for_timeout(500)
        check(view(a) == "now", f"{tag}: Back again goes to Agora")
        # ‹ Mais, and Mais in the bar, from Sobre
        for how in ("uplink", "tab"):
            a.locator("nav .tab", has_text="Mais").click()
            pg.wait_for_timeout(400)
            a.locator(".more-menu .more-row").last.click()
            pg.wait_for_timeout(500)
            if how == "uplink":
                a.locator(".uplink").click()
            else:
                a.locator("nav .tab", has_text="Mais").click()
            pg.wait_for_timeout(500)
            check(view(a) == "more", f"{tag}: {'‹ Mais' if how == 'uplink' else 'Mais in the bar'} goes back to Mais")
            pg.go_back()
            pg.wait_for_timeout(500)
            check(view(a) == "now", f"{tag}: and then Back goes to Agora ({how})")
        check(not errs, f"{tag}: no page errors {errs}")
        ctx.close()
    b.close()

print(f"{n_ok} checks passed" if not failed else f"{len(failed)} FAILED, {n_ok} passed")
print(f"screenshots in {SHOTS}")
sys.exit(1 if failed else 0)
