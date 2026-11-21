# MemorIA 1.7.0: Falar and Conversar com a IA, like the ResolvIA and the CronologIA (frontend/src/voice.js and
# frontend/src/chat.js are the same files as theirs). The two buttons at the top right of the screens (and of a
# block); the Conversa: examples, what the AI answers and its cards (create a sheet, add to a sheet), done only after
# Fazer; Back closes it. Falar: the microphone (a fake one here), what was heard, the AI organizes, you review.
# Usar IA off (Mais › Configurações › Integrações): the buttons, Falar and the photos are gone. Without https (no
# microphone): Falar explains instead of failing. 390 and 320 px, light and dark.
#
# Uses the preview (no server): cd frontend && npm run build, then
#   python3 tests/conversa_check.py [folder for the screenshots]
import os, sys, tempfile
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
  return bad.slice(0, 4);
}"""


def view(a):
    return a.evaluate("(el) => el._view().name")


def tops(a):
    return a.evaluate("(el) => [...el.renderRoot.querySelectorAll('main .mic-top')].map((b) => b.getAttribute('aria-label'))")


with sync_playwright() as p:
    b = p.chromium.launch(args=["--use-fake-device-for-media-stream", "--use-fake-ui-for-media-stream"])
    for scheme, w in (("light", 390), ("dark", 390), ("light", 320)):
        tag = f"{scheme} {w}px"
        ctx = b.new_context(viewport={"width": w, "height": 844}, device_scale_factor=2, color_scheme=scheme, has_touch=True, is_mobile=True, permissions=["microphone"])
        pg = ctx.new_page()
        errs = []
        pg.on("pageerror", lambda e: errs.append(str(e)))
        pg.goto(PREVIEW)
        a = pg.locator("memoria-app")
        a.locator(".page-title").first.wait_for()
        pg.wait_for_timeout(900)

        # ---- the two buttons at the top right, on every screen
        both = ["Conversar com a IA", "Falar: criar uma folha falando"]
        for tab, name in (("Agora", "now"), ("Blocos", "shelf"), ("Buscar", "search"), ("Mais", "more")):
            a.locator("nav .tab", has_text=tab).click()
            pg.wait_for_timeout(400)
            check(tops(a) == both, f"{tag}: {tab}: Conversar and Falar at the top ({tops(a)})")
        a.locator(".more-row", has_text="Configurações").click()
        pg.wait_for_timeout(400)
        check(tops(a) == both, f"{tag}: a screen of Mais too")
        a.evaluate("(el) => el._go('/bloco/ideias00001')")
        pg.wait_for_timeout(500)
        check(tops(a) == both, f"{tag}: a block too")
        pos = a.evaluate("(el) => [...el.renderRoot.querySelectorAll('.detail-head > *')].map((x) => [x.className.split(' ')[0], Math.round(x.getBoundingClientRect().top), Math.round(x.getBoundingClientRect().right)])")
        check(not a.evaluate(OVER), f"{tag}: the block's head fits {a.evaluate(OVER)} {pos}")
        pg.screenshot(path=str(SHOTS / f"conversa-bloco-{scheme}-{w}.png"))
        a.locator("nav .tab", has_text="Agora").click()
        pg.wait_for_timeout(500)
        pg.screenshot(path=str(SHOTS / f"conversa-agora-{scheme}-{w}.png"))

        # ---- Conversa
        a.locator(".chat-top").click()
        pg.wait_for_timeout(500)
        sheet = a.locator(".sheet")
        check(a.evaluate("(el) => el._sheet") == "chat" and sheet.locator(".chat-title").inner_text().strip() == "Conversa", f"{tag}: Conversa opens")
        ex = [t.strip() for t in sheet.locator(".chat-ex .pick").all_inner_texts()]
        check(len(ex) == 6 and ex[0].startswith("Resuma o bloco"), f"{tag}: 6 ready questions, the first ones about the block on screen ({ex})")
        pg.screenshot(path=str(SHOTS / f"conversa-vazia-{scheme}-{w}.png"))
        sheet.locator(".chat-input textarea").fill("crie uma folha no Ideias com Lista de compras; arroz; feijão")
        sheet.locator(".chat-send").click()
        pg.wait_for_timeout(1300)
        bubbles = [t.strip() for t in sheet.locator(".chat-bubble").all_inner_texts()]
        check(bubbles[-1] == "Posso criar uma folha em Ideias.", f"{tag}: the answer ({bubbles})")
        act = sheet.locator(".chat-act")
        check(act.count() == 1 and 'Criar folha "Lista de compras" em Ideias' in act.inner_text(), f"{tag}: a card to create the sheet ({act.inner_text() if act.count() else ''})")
        before = a.evaluate("(el) => el._pagesOf('ideias00001').length")
        check(before == 2, f"{tag}: nothing done before Fazer ({before})")
        check(not a.evaluate(OVER), f"{tag}: Conversa: nothing past the edge {a.evaluate(OVER)}")
        pg.screenshot(path=str(SHOTS / f"conversa-acao-{scheme}-{w}.png"))
        act.locator(".btn", has_text="Fazer").click()
        pg.wait_for_timeout(500)
        made = a.evaluate("(el) => { const ps = el._pagesOf('ideias00001'); return [ps.length, ps[ps.length - 1].text]; }")
        check(made == [3, "Lista de compras\narroz\nfeijão"], f"{tag}: Fazer creates the sheet ({made})")
        check("Feito" in act.inner_text(), f"{tag}: the card says Feito")
        # add to a sheet
        sheet.locator(".chat-input textarea").fill("acrescente Comprar pilhas na folha 1 do Ideias")
        sheet.locator(".chat-input textarea").press("Enter")
        pg.wait_for_timeout(1300)
        act = sheet.locator(".chat-act").last
        check("Acrescentar" in act.inner_text() and "folha 1 de Ideias" in act.inner_text(), f"{tag}: a card to add to sheet 1 ({act.inner_text()})")
        act.locator(".btn", has_text="Fazer").click()
        pg.wait_for_timeout(500)
        check(a.evaluate("(el) => el._pagesOf('ideias00001')[0].text.endsWith('\\nComprar pilhas')"), f"{tag}: Fazer adds to the sheet")
        # the conversation stays while the app is open; Back closes the sheet only
        pg.go_back()
        pg.wait_for_timeout(500)
        check(a.evaluate("(el) => el._sheet") is None and view(a) == "now", f"{tag}: Back closes the Conversa")
        a.locator(".chat-top").click()
        pg.wait_for_timeout(400)
        check(sheet.locator(".chat-msg").count() == 4, f"{tag}: the conversation is still there")
        # 1.24.0: Perguntas prontas at any moment (the sparkles by the box), with Editar perguntas
        sheet.locator(".chat-qbtn").click()
        pg.wait_for_timeout(250)
        qk = [t.strip() for t in sheet.locator(".chat-quick .chat-ex .pick").all_inner_texts()]
        check(len(qk) >= 1 and sheet.locator(".chat-quick .chat-ed-open").count() == 1, f"{tag}: Perguntas prontas at any moment, with Editar perguntas ({qk})")
        # 1.37.0: Editar perguntas has 20 more models; a tap puts one in the list (and it leaves the models)
        sheet.locator(".chat-quick .chat-ed-open").click()
        pg.wait_for_timeout(200)
        mods = [t.strip() for t in sheet.locator(".chat-ed-modelo").all_inner_texts()]
        check(len(mods) == 20 and not set(mods) & set(qk), f"{tag}: 20 models beyond the ready ones ({len(mods)})")
        check(sheet.locator(".chat-ed-mais").inner_text().strip() == "Mais perguntas (20)", f"{tag}: Mais perguntas (20)")
        check(sheet.locator('.chat-ed-dobra[data-dobra="prontas"]').inner_text().strip().startswith("Perguntas prontas ("), f"{tag}: Perguntas prontas with the count")
        n0 = sheet.locator(".chat-ed > .chat-ed-row:not(.chat-ed-modelo)").count()
        sheet.locator(".chat-ed-modelo").first.click()
        pg.wait_for_timeout(150)
        check(sheet.locator(".chat-ed > .chat-ed-row:not(.chat-ed-modelo)").count() == n0 + 1 and sheet.locator(".chat-ed-modelo").count() == 19, f"{tag}: a tap on a model puts it in the list")
        # 1.38.0: a tap on a question changes it; Perguntas prontas and Mais perguntas fold by the title
        txt = sheet.locator(".chat-ed > .chat-ed-row:not(.chat-ed-modelo) > .chat-ed-txt").first
        txt.fill("Pergunta mudada?")
        txt.press("Enter")
        check(txt.input_value() == "Pergunta mudada?", f"{tag}: a question changed in place")
        sheet.locator('.chat-ed-dobra[data-dobra="mais"]').click()
        pg.wait_for_timeout(150)
        check(sheet.locator(".chat-ed-modelo").count() == 0 and sheet.locator('.chat-ed-dobra[data-dobra="mais"]').get_attribute("aria-expanded") == "false", f"{tag}: Mais perguntas closes")
        sheet.locator('.chat-ed-dobra[data-dobra="mais"]').click()
        pg.wait_for_timeout(150)
        pg.screenshot(path=str(SHOTS / f"conversa-modelos-{scheme}-{w}.png"))
        sheet.locator(".chat-ed-acts .btn.outline").click()  # Padrão: back to the app's
        pg.wait_for_timeout(150)
        sheet.locator(".chat-ed-acts .btn.primary").click()
        pg.wait_for_timeout(150)
        sheet.locator(".chat-qbtn").click()
        pg.wait_for_timeout(200)
        # 1.26.0: the round button (the microphone with the box empty, Enviar writing) and the clip
        check(sheet.locator(".chat-mic").count() == 1 and sheet.locator(".chat-send").count() == 0, f"{tag}: empty box: the microphone, no Enviar beside it")
        sheet.locator(".chat-input textarea").fill("oi")
        check(sheet.locator(".chat-send").count() == 1 and sheet.locator(".chat-mic").count() == 0, f"{tag}: writing: Enviar in the place of the microphone")
        sheet.locator(".chat-input textarea").fill("")
        # 1.39.0: listening, Cancelar in the place of the clip: the microphone stops and nothing is sent
        n0 = sheet.locator(".chat-msg").count()
        sheet.locator(".chat-mic").click()
        sheet.locator(".chat-mic.on").wait_for(timeout=6000)
        check(sheet.locator(".chat-cancel").count() == 1 and sheet.locator(".chat-clip").count() == 0, f"{tag}: listening: Cancelar in the place of the clip")
        check(sheet.locator(".chat-cancel").get_attribute("aria-label") == "Cancelar: não enviar o que falei", f"{tag}: with its name")
        check(sheet.locator(".chat-input textarea").get_attribute("placeholder") == "Ouvindo…", f"{tag}: the box says Ouvindo…")
        sz = a.evaluate("(el) => ['.chat-cancel', '.chat-mic'].map((s) => { const b = el.renderRoot.querySelector('.sheet ' + s).getBoundingClientRect(); return [Math.round(b.width), Math.round(b.height)]; })")
        check(sz[0] == sz[1], f"{tag}: Cancelar and Pronto the same size ({sz})")
        pg.wait_for_timeout(500)
        pg.screenshot(path=str(SHOTS / f"conversa-{scheme}-{w}-ouvindo.png"))
        sheet.locator(".chat-cancel").click()
        pg.wait_for_timeout(900)
        check(sheet.locator(".chat-msg").count() == n0 and a.evaluate("(el) => [el._chatState().rec, el._chatState().busy, el._chatRec]") == [None, False, None], f"{tag}: cancelled: nothing sent, the microphone off")
        check(sheet.locator(".chat-cancel").count() == 0 and sheet.locator(".chat-clip").count() == 1 and sheet.locator(".chat-mic.on").count() == 0, f"{tag}: and the box is back, with the clip and the microphone")
        sheet.locator(".chat-clip").click()
        pg.wait_for_timeout(200)
        ops = [t.strip() for t in sheet.locator(".chat-menu .chat-op").all_inner_texts()]
        check(ops == ["Tirar foto", "Escolher fotos", "Escolher arquivo"], f"{tag}: the clip: Tirar foto, Escolher fotos, Escolher arquivo ({ops})")
        check(a.evaluate(OVER) == [] if "OVER" in globals() else True, f"{tag}: the clip inside the screen")
        pg.screenshot(path=str(SHOTS / f"conversa-{scheme}-{w}-clipe.png"))
        with pg.expect_file_chooser() as fc:
            sheet.locator(".chat-op", has_text="Escolher arquivo").click()
        fc.value.set_files(files=[{"name": "ata.pdf", "mimeType": "application/pdf", "buffer": b"%PDF-1.4 ata"}])
        pg.wait_for_timeout(500)
        check(sheet.locator(".chat-file .chat-pdf").count() == 1 and sheet.locator(".chat-file-n").inner_text().strip() == "ata.pdf", f"{tag}: the PDF chosen, before sending")
        sheet.locator(".chat-send").click()
        pg.wait_for_timeout(1300)
        arq = [t.strip() for t in sheet.locator(".chat-msg.me .chat-arq").all_inner_texts()]
        check(arq == ["ata.pdf"] and sheet.locator(".chat-file").count() == 0, f"{tag}: the PDF goes with the message, its name in it ({arq})")
        check("o arquivo" in sheet.locator(".chat-msg.ia .chat-bubble").last.inner_text(), f"{tag}: and the AI answers about it")
        nova = sheet.locator(".chat-head .text-btn")
        check(nova.get_attribute("aria-label") == "Nova conversa" and nova.inner_text().strip() == ("" if w < 340 else "Nova conversa"), f"{tag}: Nova conversa, like the other apps (only the + at 320 px)")
        kids = a.evaluate("""(el) => { const h = el.renderRoot.querySelector('.chat-head'); const r = h.getBoundingClientRect();
          return [...h.children].map((x) => { const b = x.getBoundingClientRect(); return [Math.round(b.height), b.left >= r.left - 1 && b.right <= r.right + 1]; }); }""")
        check(all(ok for _, ok in kids) and kids[1][0] <= 44, f"{tag}: the head in one line ({kids})")
        nova.click()
        pg.wait_for_timeout(300)
        check(sheet.locator(".chat-msg").count() == 0, f"{tag}: Nova conversa clears it")
        sheet.locator(".chat-head .icon-btn[aria-label=Fechar]").click()
        pg.wait_for_timeout(500)
        check(a.evaluate("(el) => el._sheet") is None, f"{tag}: the X closes it")

        # ---- Falar: the fake microphone, what was heard, the AI organizes, you review
        a.locator(".mic-top:not(.chat-top)").click()
        pg.wait_for_timeout(1600)
        check(a.evaluate("(el) => [el._sheet, el._form.step, el._form.rec]") == ["new", "voice", "on"], f"{tag}: Falar opens listening")
        check("Ouvindo" in sheet.locator(".voice-state").inner_text(), f"{tag}: Ouvindo…")
        bw = a.evaluate("(el) => [...el.renderRoot.querySelectorAll('.sheet .sheet-actions .btn')].map((x) => Math.round(x.getBoundingClientRect().width))")
        check(len(bw) == 2 and abs(bw[0] - bw[1]) <= 1, f"{tag}: Cancelar and Pronto the same size ({bw})")
        pg.screenshot(path=str(SHOTS / f"falar-{scheme}-{w}.png"))
        sheet.locator(".btn.primary", has_text="Pronto").click()
        pg.wait_for_timeout(2600)
        check(a.evaluate("(el) => el._form && el._form.step") == "review", f"{tag}: then the review")
        check("Lembrar de comprar pão" in sheet.locator(".heard").inner_text(), f"{tag}: what was heard")
        check("Lembrar de comprar pão" in sheet.locator("textarea.review-text").input_value(), f"{tag}: the sheet to review")
        pg.screenshot(path=str(SHOTS / f"falar-revisar-{scheme}-{w}.png"))
        sheet.locator(".btn.primary", has_text="Criar folha").click()
        pg.wait_for_timeout(600)
        check(a.evaluate("(el) => el._data.pages.some((p) => p.text.startsWith('Lembrar de comprar pão'))"), f"{tag}: the sheet is created")
        # Falar in Nova too
        a.locator("nav .tab.fab").click()
        pg.wait_for_timeout(500)
        opts = [t.split("\n")[0].strip() for t in sheet.locator(".imp-opt b").all_inner_texts()]
        check(opts[0] == "Falar", f"{tag}: Nova has Falar ({opts})")
        pg.go_back()
        pg.wait_for_timeout(400)

        # ---- Usar IA off: everything that uses the AI is gone
        a.evaluate("(el) => el._go('/config')")
        pg.wait_for_timeout(500)
        heads = [h.strip() for h in a.locator("[role=tabpanel] .mais-head h2").all_inner_texts()]
        check(heads == ["CorrerIA", "IA", "Falar", "Uso da IA", "Sensores no Home Assistant"], f"{tag}: Integrações in the order of the family ({heads})")
        sw = a.locator(".ai-switch input[role=switch]")
        check(sw.is_checked(), f"{tag}: Usar IA on")
        pg.screenshot(path=str(SHOTS / f"integracoes-ia-{scheme}-{w}.png"))
        sw.click()
        pg.wait_for_timeout(500)
        heads = [h.strip() for h in a.locator("[role=tabpanel] .mais-head h2").all_inner_texts()]
        check(heads == ["CorrerIA", "IA", "Sensores no Home Assistant"] and a.locator("#leitura-ia select").count() == 0, f"{tag}: off: only the switch, no Uso da IA; CorrerIA stays ({heads})")
        check(tops(a) == [], f"{tag}: off: no Conversar, no Falar ({tops(a)})")
        pg.screenshot(path=str(SHOTS / f"integracoes-ia-desligada-{scheme}-{w}.png"))
        a.locator("nav .tab.fab").click()
        pg.wait_for_timeout(500)
        opts = [t.split("\n")[0].strip() for t in sheet.locator(".imp-opt b").all_inner_texts()]
        check(opts == ["Colar mensagem", "Novo bloco"], f"{tag}: off: Nova only pastes (and Novo bloco) ({opts})")
        check(sheet.locator(".imp-error").count() == 0, f"{tag}: off: no notice about the AI")
        pg.go_back()
        pg.wait_for_timeout(400)
        a.locator(".ai-switch input[role=switch]").click()
        pg.wait_for_timeout(600)
        check(tops(a) == both, f"{tag}: on again: the buttons are back")
        check(not errs, f"{tag}: no page errors {errs}")
        ctx.close()

    # ---- without https: no microphone; Falar explains
    ctx = b.new_context(viewport={"width": 390, "height": 844}, has_touch=True, is_mobile=True)
    ctx.add_init_script("Object.defineProperty(navigator, 'mediaDevices', { value: undefined, configurable: true }); Object.defineProperty(window, 'isSecureContext', { value: false, configurable: true });")
    pg = ctx.new_page()
    errs = []
    pg.on("pageerror", lambda e: errs.append(str(e)))
    pg.goto(PREVIEW)
    a = pg.locator("memoria-app")
    a.locator(".page-title").first.wait_for()
    pg.wait_for_timeout(900)
    a.locator(".mic-top:not(.chat-top)").click()
    pg.wait_for_timeout(800)
    err = a.locator(".sheet .imp-error")
    check(err.count() == 1 and "endereço seguro (https)" in err.inner_text(), f"http: Falar explains the https ({err.inner_text() if err.count() else ''})")
    pg.screenshot(path=str(SHOTS / "falar-http.png"))
    pg.go_back()
    pg.wait_for_timeout(400)
    a.locator(".chat-top").click()
    pg.wait_for_timeout(400)
    check(a.locator(".sheet .chat-mic").count() == 0, "http: no microphone in the Conversa")
    check(not errs, f"http: no page errors {errs}")
    ctx.close()
    b.close()

print(f"{n_ok} checks passed" if not failed else f"{len(failed)} FAILED, {n_ok} passed")
print(f"screenshots in {SHOTS}")
sys.exit(1 if failed else 0)
