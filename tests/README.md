# Testes do MemorIA

- `npm test` (na raiz): o servidor (`memoria/rootfs/app/lib`: dados, categorias, relatório e PDF, exportação) e, em `tests/server.test.mjs`, o servidor de verdade com o Home Assistant simulado, com `node:test`, sem instalar nada. Nunca dependem do relógio real.
- Conferências visuais na prévia (`preview/memoria-preview.html`, sem servidor), em Python + Playwright
  (`pip install playwright && playwright install chromium`). Gere a prévia antes (`cd frontend && npm run build`):

| Arquivo | O que confere |
|---|---|
| `tests/mais_check.py` | Mais em menu, Configurações em abas, Voltar, ‹ Mais e arrastar; tema automático e Cor do dia |
| `tests/categorias_check.py` | Mais › Categorias, a categoria no bloco (com Nova ali mesmo) e o filtro em Blocos |
| `tests/conversa_check.py` | Falar (com um microfone simulado) e Conversar com a IA, a chave Usar IA e o microfone sem https |
| `tests/links_check.py` | links nas folhas: etiquetas, abrir fora, tocar no texto para escrever, Adicionar link e Buscar |
| `tests/relatorio_check.py` | Mais › Relatório pelo servidor (sobe o `dev/fake-ha.mjs` e o servidor com a casa inventada de `tests/fixtures/casa.mjs`): cabeçalho, escolhas guardadas, Baixar PDF e Voltar |
| `tests/about_check.py` | Mais › Sobre (o mesmo dos outros apps) e a versão igual em todos os lugares |
| `tests/selects_check.py` | as caixas de seleção no visual do app (`frontend/src/selectsheet.js`) |

Cada uma aceita a pasta das capturas: `python3 tests/mais_check.py /tmp/capturas`. Todas: `tests/visual.sh [pasta]`.

Toda mudança ou correção vem com o teste dela. Dados de exemplo sempre inventados (Ana, Beto).
