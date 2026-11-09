#!/usr/bin/env python3
"""Refaz as imagens do README (docs/*.png) pela prévia, com a casa inventada dela (Ana usa o app).

Uso: python3 tools/prints_readme.py [pasta]      (padrão: docs/; gere a prévia antes: cd frontend && npm run build)

Celular 390x844 em 2x (PNG 780x1688), tema claro, cor lilás (sem a Cor do dia), relógio parado:
agora.png (22:30, o Diário da noite), trecho.png (10:15, a pauta da reunião às 10h), virar.png (a folha virando
para uma nova) e blocos.png (a estante).
"""
import functools
import http.server
import socketserver
import sys
import threading
from datetime import datetime, timedelta, timezone
from pathlib import Path

from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parent.parent
OUT = Path(sys.argv[1]) if len(sys.argv) > 1 else ROOT / "docs"
BRT = timezone(timedelta(hours=-3))


class Quiet(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a):
        pass


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    handler = functools.partial(Quiet, directory=str(ROOT / "preview"))
    srv = socketserver.TCPServer(("127.0.0.1", 0), handler)
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    url = f"http://127.0.0.1:{srv.server_address[1]}/memoria-preview.html"
    with sync_playwright() as p:
        b = p.chromium.launch()
        ctx = b.new_context(viewport={"width": 390, "height": 844}, device_scale_factor=2, color_scheme="light",
                            has_touch=True, is_mobile=True, timezone_id="America/Sao_Paulo")
        pg = ctx.new_page()
        pg.clock.set_fixed_time(datetime(2026, 11, 9, 22, 30, tzinfo=BRT))
        pg.goto(url)
        a = pg.locator("memoria-app")
        a.locator(".page-title").first.wait_for()
        a.evaluate("(el) => el.api.saveSettings({ app: { accent_daily: false, accent: 'lilas' } })")
        pg.wait_for_timeout(600)

        def at(h, m=0):
            pg.clock.set_fixed_time(datetime(2026, 11, 9, h, m, tzinfo=BRT))
            a.evaluate("(el) => { el._tick(); el._backToNow(); el.requestUpdate(); }")
            pg.wait_for_timeout(700)

        def shot(name):
            pg.screenshot(path=str(OUT / name))
            print(name)

        at(22, 30)
        shot("agora.png")
        at(10, 15)
        shot("trecho.png")
        at(22, 30)
        a.evaluate("(el) => el._flip(1)")
        pg.wait_for_timeout(120)
        shot("virar.png")
        pg.wait_for_timeout(900)
        a.locator("nav .tab", has_text="Blocos").click()
        pg.wait_for_timeout(700)
        shot("blocos.png")
        b.close()
    srv.shutdown()


if __name__ == "__main__":
    main()
