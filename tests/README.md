# Testes do MemorIA

- `npm test` (na raiz): o servidor (`memoria/rootfs/app/lib`), com `node:test`, sem instalar nada. Nunca dependem do relógio real.
- Conferências visuais na prévia (`preview/memoria-preview.html`, sem servidor), em Python + Playwright
  (`pip install playwright && playwright install chromium`). Gere a prévia antes (`cd frontend && npm run build`):

| Arquivo | O que confere |
|---|---|
| `tests/mais_check.py` | Mais em menu, Configurações em abas, Voltar, ‹ Mais e arrastar; tema automático e Cor do dia |
| `tests/about_check.py` | Mais › Sobre (o mesmo dos outros apps) e a versão igual em todos os lugares |
| `tests/selects_check.py` | as caixas de seleção no visual do app (`frontend/src/selectsheet.js`) |

Cada uma aceita a pasta das capturas: `python3 tests/mais_check.py /tmp/capturas`. Todas: `tests/visual.sh [pasta]`.

Toda mudança ou correção vem com o teste dela. Dados de exemplo sempre inventados (Ana, Beto).
