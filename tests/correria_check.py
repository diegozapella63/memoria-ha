# MemorIA 1.8.0: Mais › Configurações › Integrações › CorrerIA, the key that lets the WhatsApp, the Claude and the
# Gemini (through the app CorrerIA) read and change the blocks. Off by default; it doesn't depend on Usar IA; on, it
# says who used it last and when ("Claude usou hoje às 09:41"), live, as the server tells every screen. The key goes
# to the server (the setting correria) and comes back on a reload. 390 and 320 px, light and dark; the computer.
#
# Uses the preview (no server): cd frontend && npm run build, then
#   python3 tests/correria_check.py [folder for the screenshots]
import os, sys, tempfile
from datetime import datetime, timedelta
from pathlib import Path
from playwright.sync_api import sync_playwright

REPO = Path(__file__).resolve().parent.parent
# the preview over http (tests/visual.sh): Chromium does not always keep what a file:// page saves across a reload
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
    if (e.closest(".more-tabs")) continue;
    const r = e.getBoundingClientRect();
    if (r.width && (r.right > W + 1 || r.left < -1)) bad.push(e.tagName.toLowerCase() + "." + [...e.classList].join(".") + " " + Math.round(r.left) + ".." + Math.round(r.right));
  }
  if (document.documentElement.scrollWidth > W) bad.push("page " + document.documentElement.scrollWidth);
  return bad.slice(0, 4);
}"""

# what the server sends to every screen after a tool of the CorrerIA was called
USED = "([cliente, em]) => document.querySelector('memoria-app').api.emit({ kind: 'correria', ultimo: { cliente, em } })"


def local_iso(d):
    return d.strftime("%Y-%m-%dT%H:%M:%S")


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
        a.evaluate("(el) => el._go('/config')")
        pg.wait_for_timeout(500)
        card = a.locator("#correria")
        check(card.count() == 1, f"{tag}: Integrações has the CorrerIA card")
        check(card.locator(".mais-head h2").inner_text().strip() == "CorrerIA", f"{tag}: title CorrerIA")
        sw = card.locator("input[role=switch]")
        check(sw.get_attribute("aria-label") == "Usar com o CorrerIA", f"{tag}: the switch Usar com o CorrerIA")
        check(not sw.is_checked(), f"{tag}: off by default")
        check(card.locator(".hint").inner_text().strip() == "Desligado.", f"{tag}: off says Desligado.")
        check(card.locator(".correria-uso").count() == 0, f"{tag}: off: no line about the use")

        # on: the setting goes to the server; no use yet
        sw.click()
        pg.wait_for_timeout(400)
        check(sw.is_checked(), f"{tag}: on")
        check(a.evaluate("(el) => el.api.data.app.correria") is True, f"{tag}: the setting correria went to the server")
        hint = card.locator(".hint").inner_text().strip()
        check(hint == "Ligado: pelo WhatsApp, o Claude e o Gemini leem e mudam os seus blocos.", f"{tag}: on: what it does ({hint})")
        uso = card.locator(".correria-uso")
        check(uso.count() == 1 and "Ainda não usado" in uso.inner_text() and "No app CorrerIA, conecte o WhatsApp, o Claude ou o Gemini." in uso.inner_text(), f"{tag}: on: not used yet, and where to connect")
        check("off" in (uso.get_attribute("class") or ""), f"{tag}: the gray dot before the first use")
        check(not a.evaluate(OVER), f"{tag}: nothing past the edge {a.evaluate(OVER)}")

        # used: the line changes live, with who and when
        now = datetime.now()
        pg.evaluate(USED, ["Claude", local_iso(now)])
        pg.wait_for_timeout(300)
        txt = uso.inner_text().strip()
        check(txt == f"Claude usou hoje às {now:%H:%M}", f"{tag}: Claude usou hoje às {now:%H:%M} ({txt})")
        check("ok" in (uso.get_attribute("class") or ""), f"{tag}: the green dot after a use")
        card.scroll_into_view_if_needed()
        pg.screenshot(path=str(SHOTS / f"correria-{scheme}-{w}.png"))
        if now.hour > 0:  # yesterday is another day only after midnight has passed for good
            y = now - timedelta(days=1)
            pg.evaluate(USED, ["WhatsApp", local_iso(y)])
            pg.wait_for_timeout(300)
            check(uso.inner_text().strip() == f"WhatsApp usou ontem às {y:%H:%M}", f"{tag}: yesterday ({uso.inner_text().strip()})")
        old = now - timedelta(days=9)
        pg.evaluate(USED, ["Gemini", local_iso(old)])
        pg.wait_for_timeout(300)
        check(uso.inner_text().strip() == f"Gemini usou em {old:%d/%m} às {old:%H:%M}", f"{tag}: another day ({uso.inner_text().strip()})")

        # it doesn't depend on Usar IA
        a.locator(".ai-switch input[role=switch]").click()
        pg.wait_for_timeout(400)
        check(card.count() == 1 and sw.is_checked(), f"{tag}: Usar IA off: the CorrerIA stays on")
        a.locator(".ai-switch input[role=switch]").click()
        pg.wait_for_timeout(400)

        # off again
        sw.click()
        pg.wait_for_timeout(400)
        check(not sw.is_checked() and "correria" not in a.evaluate("(el) => el.api.data.app"), f"{tag}: off again: the setting is gone")
        check(card.locator(".correria-uso").count() == 0, f"{tag}: off again: no line about the use")
        check(not errs, f"{tag}: no page errors {errs}")
        ctx.close()
    b.close()

print(f"{n_ok} checks passed" if not failed else f"{len(failed)} FAILED, {n_ok} passed")
print(f"screenshots in {SHOTS}")
sys.exit(1 if failed else 0)
