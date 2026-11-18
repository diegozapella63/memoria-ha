# MemorIA 1.36.0: the background and the cards are the ones of the Home Assistant theme (hatema.js, the same file in
# all the apps of the family), so every app has the same background. Inside a fake Home Assistant with a theme of its
# own (light and then dark, changed while the app is open) the app paints that background and publishes that card;
# opened on its own (no Home Assistant), the default theme of Home Assistant (#fafafa and #111111).
#
# Uses the preview (no server): cd frontend && node build.mjs, then tests/e2e/run.sh tema_ha
import os as _os
import sys
from pathlib import Path
from playwright.sync_api import sync_playwright

REPO = Path(__file__).resolve().parents[1]
PREVIEW = REPO / "preview" / "memoria-preview.html"
SHOTS = Path(_os.environ.get("MEMORIA_SHOTS", "/tmp/memoria-shots"))
SHOTS.mkdir(parents=True, exist_ok=True)

n_ok, failed = 0, []


def check(c, label):
    global n_ok
    print(("PASS " if c else "FAIL ") + label, flush=True)
    if c:
        n_ok += 1
    else:
        failed.append(label)


# the Home Assistant around the app: its theme on <html>, as it paints it, and the <home-assistant> with hass.themes
HA = """<!doctype html><html style="--primary-background-color:#eef3fb;--card-background-color:#fcfdff"><body style="margin:0">
<home-assistant></home-assistant><iframe id="app" src="/app/" style="position:fixed;inset:0;width:100%;height:100%;border:0"></iframe>
<script>document.querySelector("home-assistant").hass = { themes: { darkMode: false } };
window.modo = (dark, bg, card) => { document.querySelector("home-assistant").hass = { themes: { darkMode: dark } };
  document.documentElement.style.setProperty("--primary-background-color", bg); document.documentElement.style.setProperty("--card-background-color", card); };</script></body></html>"""

# the background behind the left edge of the screen (what the person sees around the cards)
BG = """() => {
  const y = Math.round(innerHeight * 0.55);
  let el = document.elementFromPoint(3, y);
  while (el && el.shadowRoot) { const inner = el.shadowRoot.elementFromPoint(3, y); if (!inner || inner === el) break; el = inner; }
  for (let e = el; e; e = e.parentElement || (e.getRootNode() && e.getRootNode().host) || null) {
    const bg = getComputedStyle(e).backgroundColor;
    if (bg && bg !== "rgba(0, 0, 0, 0)" && bg !== "transparent") return bg;
  }
  return getComputedStyle(document.body).backgroundColor;
}"""
VARS = "() => ['--ha-bg-light', '--ha-card-light', '--ha-bg-dark', '--ha-card-dark'].map((v) => document.documentElement.style.getPropertyValue(v))"


def serve(route):
    url = route.request.url
    if url.rstrip("/").endswith("/app"):
        route.fulfill(body=PREVIEW.read_bytes(), content_type="text/html")
    elif url.rstrip("/") == "http://ha.test":
        route.fulfill(body=HA, content_type="text/html")
    else:
        route.fulfill(status=404, body="")


with sync_playwright() as p:
    b = p.chromium.launch()
    ctx = b.new_context(viewport={"width": 390, "height": 844}, color_scheme="light")
    ctx.route("http://ha.test/**", serve)
    pg = ctx.new_page()
    errs = []
    pg.on("pageerror", lambda e: errs.append(str(e)))
    pg.goto("http://ha.test/")
    fr = pg.frame_locator("#app")
    app = pg.frames[1]
    app.wait_for_load_state()
    pg.wait_for_timeout(1500)
    check(app.evaluate("() => window.__haTema && window.__haTema.doHA") == "light", "inside Home Assistant: reads its theme (light)")
    check(app.evaluate(VARS) == ["#eef3fb", "#fcfdff", "#111111", "#1c1c1c"], f"the light colors of the theme, the dark ones of the default ({app.evaluate(VARS)})")
    check(app.evaluate(BG) == "rgb(238, 243, 251)", f"light: the background of the theme ({app.evaluate(BG)})")
    pg.screenshot(path=str(SHOTS / "tema-ha-claro.png"))
    # the person turns Home Assistant dark (a theme with its own dark): the app goes along, without reopening
    pg.emulate_media(color_scheme="dark")
    pg.evaluate("() => window.modo(true, '#0d1a26', '#172636')")
    pg.wait_for_timeout(900)
    check(app.evaluate("() => window.__haTema.doHA") == "dark", "Home Assistant dark: read again")
    check(app.evaluate(VARS) == ["#fafafa", "#ffffff", "#0d1a26", "#172636"], f"now the dark colors of the theme ({app.evaluate(VARS)})")
    check(app.evaluate(BG) == "rgb(13, 26, 38)", f"dark: the background of the theme ({app.evaluate(BG)})")
    pg.screenshot(path=str(SHOTS / "tema-ha-escuro.png"))
    check(not errs, f"no errors {errs}")
    ctx.close()

    # on its own (the preview, outside Home Assistant): the default theme of Home Assistant
    for scheme, want in (("light", "rgb(250, 250, 250)"), ("dark", "rgb(17, 17, 17)")):
        ctx = b.new_context(viewport={"width": 390, "height": 844}, color_scheme=scheme)
        pg = ctx.new_page()
        pg.goto(PREVIEW.as_uri())
        pg.wait_for_timeout(1500)
        check(pg.evaluate("() => window.__haTema.doHA") is None, f"{scheme}, on its own: no Home Assistant")
        check(pg.evaluate(BG) == want, f"{scheme}, on its own: the background of the default theme ({pg.evaluate(BG)})")
        ctx.close()
    b.close()

print(f"{n_ok} checks passed" if not failed else f"{len(failed)} failed")
if failed:
    sys.exit(1)
