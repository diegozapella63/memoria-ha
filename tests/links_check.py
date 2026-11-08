# MemorIA 1.6.0: links in the sheets. Outside the editor, each link is a short chip (the name, or the site and what
# was searched / the last part of the address), never the long address; a tap on it opens it outside (target _blank,
# rel noopener) and doesn't open the editor. A tap on the text opens the editor right there, with the real text; when
# the editor closes, the chips come back. ⋯ › Adicionar link: Link and Nome (optional); a bad address is refused; it
# goes at the end of the sheet as [Nome](address). Back, Cancelar and a tap outside return to the ⋯. Buscar finds the
# name and the address, and shows the name. 390 and 320 px, light and dark.
#
# Uses the preview (no server): cd frontend && npm run build, then
#   python3 tests/links_check.py [folder for the screenshots]
import os, re, sys, tempfile
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
  for (const e of el.renderRoot.querySelectorAll(".page *, .sheet *")) {
    if (e.closest(".cat-filter, .who-filter, .more-tabs, .tline")) continue;
    const r = e.getBoundingClientRect();
    if (r.width && (r.right > W + 1 || r.left < -1)) bad.push(e.tagName.toLowerCase() + "." + [...e.classList].join(".") + " " + Math.round(r.left) + ".." + Math.round(r.right));
  }
  if (document.documentElement.scrollWidth > W) bad.push("page " + document.documentElement.scrollWidth);
  return bad.slice(0, 4);
}"""

# the point of a word of the view (inside its text, not a chip)
WORD = """([word, k]) => {
  const root = document.querySelector('memoria-app').renderRoot;
  const s = [...root.querySelectorAll('.ink-view span[data-o]')].find((x) => x.textContent.includes(word));
  if (!s) return null;
  const t = [...s.childNodes].find((n) => n.nodeType === 3);
  const i = t.textContent.indexOf(word) + k;
  const r = document.createRange();
  r.setStart(t, i);
  r.setEnd(t, i + 1);
  const b = r.getBoundingClientRect();
  return [b.x + 1, b.y + b.height / 2, Number(s.dataset.o) + i];
}"""


def tap(pg, loc):
    loc.scroll_into_view_if_needed()
    bx = loc.bounding_box()
    pg.touchscreen.tap(bx["x"] + bx["width"] / 2, bx["y"] + bx["height"] / 2)
    pg.wait_for_timeout(450)


with sync_playwright() as p:
    b = p.chromium.launch()
    for scheme, w in (("light", 390), ("dark", 390), ("light", 320)):
        tag = f"{scheme} {w}px"
        ctx = b.new_context(viewport={"width": w, "height": 844}, device_scale_factor=2, color_scheme=scheme, has_touch=True, is_mobile=True)
        pg = ctx.new_page()
        errs = []
        pg.on("pageerror", lambda e: errs.append(str(e)))
        popups = []
        ctx.on("page", lambda np: popups.append(np))
        # the sites of the example don't exist: a page stands for them (not for the preview itself, served by tests/visual.sh)
        ctx.route(re.compile(r"^https?://(?!127\.0\.0\.1[:/])"), lambda r: r.fulfill(status=200, content_type="text/html", body="<p>site</p>"))
        pg.goto(PREVIEW)
        a = pg.locator("memoria-app")
        a.locator(".page-title").first.wait_for()
        pg.wait_for_timeout(500)
        pid = a.evaluate("(el) => el._data.pages.find((p) => p.text.startsWith('Bolo de cenoura')).id")
        raw = a.evaluate(f"(el) => el._page('{pid}').text")
        a.evaluate(f"(el) => el._openPage('ideias00001', '{pid}')")
        pg.wait_for_timeout(900)

        # ---- the view: chips, not the long address
        view = a.locator(".ink-view")
        check(view.count() == 1, f"{tag}: the sheet with links shows the view")
        chips = a.locator(".ink-view a.lnk")
        labels = [" ".join(t.split()) for t in chips.all_inner_texts()]
        check(labels == ["Receita da vó", "google.com · cobertura de chocolate par…"], f"{tag}: the chips ({labels})")
        hrefs = [chips.nth(i).get_attribute("href") for i in range(chips.count())]
        check(hrefs[0] == "https://www.receitas-exemplo.com.br/receita/23-bolo-de-cenoura.html" and hrefs[1].startswith("https://www.google.com/search?q=cobertura"), f"{tag}: the chips open the real address")
        check(all(chips.nth(i).get_attribute("target") == "_blank" and chips.nth(i).get_attribute("rel") == "noopener noreferrer" for i in range(chips.count())), f"{tag}: outside the app (target _blank, rel noopener)")
        text = view.inner_text()
        check("https://" not in text and "sca_esv" not in text and "[Receita" not in text, f"{tag}: no long address, no [ ]( ) on the sheet")
        check("Comprar: cenoura, ovos, farinha." in text and "Receita para domingo:" in text, f"{tag}: the rest of the text as written")
        cw = a.evaluate("(el) => [...el.renderRoot.querySelectorAll('.ink-view a.lnk')].map((x) => [Math.round(x.getBoundingClientRect().height), x.scrollWidth <= x.clientWidth + 1 || getComputedStyle(x.querySelector('span')).textOverflow === 'ellipsis'])")
        check(all(h <= 32 for h, _ in cw), f"{tag}: the chips fit in a line of the paper ({cw})")
        check(a.evaluate("(el) => el.renderRoot.querySelector('textarea.ink').value") == raw, f"{tag}: the editor keeps the real text")
        check(not a.evaluate(OVER), f"{tag}: nothing past the edge {a.evaluate(OVER)}")
        pg.screenshot(path=str(SHOTS / f"links-folha-{scheme}-{w}.png"))

        # a chip opens the link outside, not the editor
        chips.first.click()
        pg.wait_for_timeout(700)
        check(len(popups) == 1 and popups[0].url.startswith("https://www.receitas-exemplo.com.br/"), f"{tag}: a tap on a chip opens the link outside ({[x.url for x in popups]})")
        for np in popups:
            np.close()
        popups.clear()
        check(a.evaluate("(el) => el._editing") is None and view.count() == 1, f"{tag}: and the editor stays closed")

        # a tap on the text: the editor right there, with the real text
        pt = pg.evaluate(WORD, ["Comprar", 3])
        pg.touchscreen.tap(pt[0], pt[1])
        pg.wait_for_timeout(600)
        st = a.evaluate("(el) => { const t = el.renderRoot.querySelector('textarea.ink'); const r = t.getBoundingClientRect(); return [el.renderRoot.activeElement === t, t.selectionStart, Math.round(r.height), el.renderRoot.querySelectorAll('.ink-view').length]; }")
        check(st[0] and st[3] == 0 and st[2] > 300, f"{tag}: the editor opens, full size, the view gone ({st})")
        check(st[1] == pt[2], f"{tag}: the cursor where the finger fell ({st[1]} = {pt[2]})")
        caret = a.evaluate("""(el) => { const t = el.renderRoot.querySelector('textarea.ink'); const at = t.selectionStart; const m = document.createElement('div'); const cs = getComputedStyle(t);
            for (const k of ['fontFamily','fontSize','fontWeight','lineHeight','paddingTop','paddingRight','paddingBottom','paddingLeft']) m.style[k] = cs[k];
            Object.assign(m.style, {position:'absolute', visibility:'hidden', width: t.clientWidth + 'px', whiteSpace:'pre-wrap', overflowWrap:'anywhere', boxSizing:'border-box'});
            m.textContent = t.value.slice(0, at); const s = document.createElement('span'); s.textContent = 'x'; m.appendChild(s); el.renderRoot.appendChild(m); const y = s.offsetTop; m.remove();
            return [y, t.scrollTop, t.clientHeight]; }""")
        check(caret[1] <= caret[0] <= caret[1] + caret[2], f"{tag}: the cursor in sight ({caret})")
        check("https://www.google.com/search?q=cobertura" in a.evaluate("(el) => el.renderRoot.querySelector('textarea.ink').value"), f"{tag}: the editor shows the real address")
        pg.screenshot(path=str(SHOTS / f"links-editor-{scheme}-{w}.png"))
        pg.keyboard.type("X")
        pg.wait_for_timeout(200)
        check(a.evaluate(f"(el) => el._page('{pid}').text.includes('ComXprar')"), f"{tag}: typing goes where the cursor is")
        pg.keyboard.press("Backspace")
        # out of the editor: chips again
        a.evaluate("(el) => el.renderRoot.querySelector('textarea.ink').blur()")
        pg.wait_for_timeout(400)
        check(a.locator(".ink-view a.lnk").count() == 2 and a.evaluate("(el) => el._editing") is None, f"{tag}: closing the editor brings the chips back")

        # ---- ⋯ › Adicionar link
        a.locator(".leaf-top .icon-btn[aria-label='Opções da folha']").click()
        pg.wait_for_timeout(500)
        sheet = a.locator(".sheet")
        rows = [" ".join(t.split()) for t in sheet.locator(".menu-row").all_inner_texts()]
        check(rows[:2] == ["Adicionar link", "Copiar texto"], f"{tag}: ⋯ has Adicionar link ({rows})")
        for how in ("back", "cancelar", "fora"):
            sheet.locator(".menu-row", has_text="Adicionar link").click()
            pg.wait_for_timeout(500)
            check(a.evaluate("(el) => el._sheet") == "link" and sheet.locator("h3").inner_text().strip() == "Adicionar link", f"{tag}: the sheet Adicionar link ({how})")
            if how == "back":
                pg.go_back()
            elif how == "cancelar":
                sheet.locator(".btn.outline", has_text="Cancelar").click()
            else:
                pg.touchscreen.tap(w / 2, 40)
            pg.wait_for_timeout(600)
            check(a.evaluate("(el) => el._sheet") == "pagemenu", f"{tag}: {how} returns to the ⋯")
        sheet.locator(".menu-row", has_text="Adicionar link").click()
        pg.wait_for_timeout(500)
        check(a.evaluate("(el) => el.renderRoot.activeElement && el.renderRoot.activeElement.matches('.sheet input[type=url]')"), f"{tag}: the cursor in Link")
        labels = [t.strip() for t in sheet.locator(".flabel").all_inner_texts()]
        check(labels == ["Link", "Nome (opcional)"], f"{tag}: Link and Nome ({labels})")
        add = sheet.locator(".btn.primary", has_text="Adicionar")
        check(add.is_disabled(), f"{tag}: no link, no adding")
        bw = a.evaluate("(el) => [...el.renderRoot.querySelectorAll('.sheet .sheet-actions .btn')].map((x) => Math.round(x.getBoundingClientRect().width))")
        check(len(bw) == 2 and abs(bw[0] - bw[1]) <= 1, f"{tag}: Cancelar and Adicionar the same size ({bw})")
        sheet.locator("input[type=url]").fill("javascript:alert(1)")
        add.click()
        pg.wait_for_timeout(300)
        err = sheet.locator(".field-error")
        check(err.count() == 1 and "Esse link não abre" in err.inner_text() and a.evaluate("(el) => el._sheet") == "link", f"{tag}: a bad address is refused")
        sheet.locator("input[type=url]").fill("loja-exemplo.com.br/forma-de-bolo-24cm?cor=azul&ref=abc123")
        check(err.count() == 0, f"{tag}: typing again clears the message")
        sheet.locator("input[type=text]").fill("Forma de bolo")
        pg.screenshot(path=str(SHOTS / f"links-adicionar-{scheme}-{w}.png"))
        check(not a.evaluate(OVER), f"{tag}: the sheet: nothing past the edge {a.evaluate(OVER)}")
        add.click()
        pg.wait_for_timeout(700)
        txt = a.evaluate(f"(el) => el._page('{pid}').text")
        check(txt.endswith("\n[Forma de bolo](https://loja-exemplo.com.br/forma-de-bolo-24cm?cor=azul&ref=abc123)"), f"{tag}: kept at the end as [Nome](address) ({txt[-90:]!r})")
        check(a.evaluate("(el) => el._sheet") is None and "Link adicionado" in a.locator(".toast").inner_text(), f"{tag}: closed, Link adicionado")
        labels = [" ".join(t.split()) for t in a.locator(".ink-view a.lnk").all_inner_texts()]
        check(labels[-1] == "Forma de bolo", f"{tag}: the new chip ({labels})")
        # without a name: the site and the last part of the address
        a.locator(".leaf-top .icon-btn[aria-label='Opções da folha']").click()
        pg.wait_for_timeout(400)
        sheet.locator(".menu-row", has_text="Adicionar link").click()
        pg.wait_for_timeout(400)
        sheet.locator("input[type=url]").fill("https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=42s")
        sheet.locator("input[type=url]").press("Enter")
        pg.wait_for_timeout(700)
        labels = [" ".join(t.split()) for t in a.locator(".ink-view a.lnk").all_inner_texts()]
        check(labels[-1] == "youtube.com/watch…", f"{tag}: without a name ({labels[-1]})")
        pg.screenshot(path=str(SHOTS / f"links-novos-{scheme}-{w}.png"))

        # ---- Buscar: the name and the address; the result shows the name
        a.locator("nav .tab", has_text="Buscar").click()
        pg.wait_for_timeout(500)
        box = a.locator(".search-box input")
        for q in ("forma de bolo", "loja-exemplo", "cobertura+de+chocolate"):
            box.fill(q)
            pg.wait_for_timeout(300)
            res = a.locator(".result")
            check(res.count() >= 1 and any("Bolo de cenoura" in t for t in res.all_inner_texts()), f"{tag}: Buscar finds “{q}”")
        box.fill("receita da vó")
        pg.wait_for_timeout(300)
        snip = a.locator(".result .r-snip").first.inner_text()
        check("Receita da vó" in snip and "](" not in snip and "https://" not in snip, f"{tag}: the result shows the name ({snip[:80]!r})")
        check(not errs, f"{tag}: no page errors {errs}")
        ctx.close()
    b.close()

print(f"{n_ok} checks passed" if not failed else f"{len(failed)} FAILED, {n_ok} passed")
print(f"screenshots in {SHOTS}")
sys.exit(1 if failed else 0)
