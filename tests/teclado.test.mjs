// teclado.js: com o foco num campo de texto, as páginas em volta do app (a do Home Assistant) voltam para o começo.
import { describe, it, mock } from "node:test";
import assert from "node:assert/strict";
import { tecladoCalmo } from "../frontend/src/teclado.js";

const pagina = (scrollY = 0) => ({ scrollY, document: { scrollingElement: { scrollTop: scrollY } }, voltou: 0, scrollTo(x, y) { this.scrollY = y; this.document.scrollingElement.scrollTop = y; this.voltou++; } });
function janela({ parent = null, top = null, vv = true } = {}) {
  const ouvintes = {};
  const win = { addEventListener: (n, f) => (ouvintes[n] = f), setTimeout: (f, ms) => setTimeout(f, ms), ouvintes };
  win.parent = parent || win;
  win.top = top || win.parent;
  if (vv) win.visualViewport = { addEventListener: (n, f) => (ouvintes["vv-" + n] = f) };
  return win;
}

describe("teclado: as páginas em volta não ficam roladas", () => {
  it("o foco num campo de texto põe a página de fora no começo, e de novo enquanto a janela sobe", () => {
    mock.timers.enable({ apis: ["setTimeout", "Date"] });
    const ha = pagina(80);
    const win = janela({ parent: ha });
    tecladoCalmo(win);
    win.ouvintes.focusin({ target: { tagName: "TEXTAREA" } });
    assert.equal(ha.scrollY, 0);
    ha.scrollY = 79; // o teclado abriu e o navegador rolou de novo
    mock.timers.tick(60);
    assert.equal(ha.scrollY, 0);
    mock.timers.tick(2000);
    const vezes = ha.voltou;
    ha.scrollY = 40;
    mock.timers.tick(2000);
    assert.equal(ha.voltou, vezes, "depois de 0,9 s, para de olhar");
    win.ouvintes["vv-resize"]();
    assert.equal(ha.scrollY, 0, "o teclado mudou a altura: volta");
    mock.timers.reset();
  });
  it("um botão não conta; o campo dentro de um componente (composedPath) conta", () => {
    const ha = pagina(50);
    const win = janela({ parent: ha, vv: false });
    tecladoCalmo(win);
    win.ouvintes.focusin({ target: { tagName: "BUTTON" } });
    assert.equal(ha.scrollY, 50);
    win.ouvintes.focusin({ target: { tagName: "APP-PANEL" }, composedPath: () => [{ tagName: "INPUT" }] });
    assert.equal(ha.scrollY, 0);
  });
  it("sem página em volta, de outra origem ou chamado duas vezes: nada quebra, e a página do app não é tocada", () => {
    const so = janela();
    so.scrollTo = () => assert.fail("a página do app não rola");
    tecladoCalmo(so);
    tecladoCalmo(so);
    so.ouvintes.focusin({ target: { tagName: "INPUT" } });
    const fechada = { get document() { throw new Error("outra origem"); }, get scrollY() { throw new Error("outra origem"); } };
    const win = janela({ parent: fechada, vv: false });
    tecladoCalmo(win);
    win.ouvintes.focusin({ target: { tagName: "INPUT" } });
    tecladoCalmo(null);
  });
});
