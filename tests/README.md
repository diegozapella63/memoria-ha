# Testes do MemorIA

- `npm test` (na raiz): o servidor (`memoria/rootfs/app/lib`: dados, categorias, de quem é e arquivados, o Agora e o sensor, relatório e PDF, exportação, as ferramentas do CorrerIA em `tests/ferramentas.test.mjs`; as caixas de marcar e o texto delas no PDF em `tests/caixas.test.mjs`) e, em `tests/server.test.mjs`, o servidor de verdade com o Home Assistant simulado (também a rota `/api/integracao/ferramentas`, o arquivo `share/memoria/correria.json` e as pessoas da casa, Ana e Beto, com a pessoa de cada login), com `node:test`, sem instalar nada. Nunca dependem do relógio real.
- Conferências visuais na prévia (`preview/memoria-preview.html`, sem servidor), em Python + Playwright
  (`pip install playwright && playwright install chromium`). Gere a prévia antes (`cd frontend && npm run build`):

| Arquivo | O que confere |
|---|---|
| `tests/mais_check.py` | Mais em menu, Configurações em abas, Voltar, ‹ Mais e arrastar; tema automático e Cor do dia |
| `tests/agora_check.py` | Agora: folha com horário de quem é dono, Nada com horário (sem bloco qualquer) e de quem são os blocos com horário; os botões das escolhas do mesmo tamanho; o nome do bloco com a largura toda, sem quebrar palavra |
| `tests/arquivar_check.py` | Arquivar bloco: fora da estante, do Agora, da Nova e do Buscar (Incluir arquivados), Arquivados no fim de Blocos, Desfazer e Desarquivar |
| `tests/dono_check.py` | De quem é: Todos ou uma pessoa da casa (ou o nome escrito, sem as pessoas), o Agora e o Seu dia de quem usa, "de Beto" na estante; o filtro De quem em Blocos e no Buscar |
| `tests/opcoes_check.py` | Mais › Configurações › Opções › Blocos: Usar categorias e Controle por pessoa (ligados de início), o que some com cada um desligado e volta ao ligar |
| `tests/vista_check.py` | Blocos em blocos ou em lista: a escolha rápida no alto, a lista, o filtro de categoria nela e a escolha guardada |
| `tests/categorias_check.py` | Mais › Categorias, a categoria no bloco (com Nova ali mesmo) e o filtro em Blocos |
| `tests/correria_check.py` | Mais › Configurações › Integrações › CorrerIA: desligado por padrão, sem depender do Usar IA, e quem usou por último |
| `tests/conversa_check.py` | Falar (com um microfone simulado) e Conversar com a IA, a chave Usar IA e o microfone sem https |
| `tests/caixas_check.py` | Caixa de marcar e Emojis no alto da folha: a linha vira item e deixa de ser, Enter faz o próximo item e acaba a lista, o emoji entra no cursor sem fechar o teclado; fora da escrita, um toque marca como feito (riscado) e desmarca, salvo; 390 e 320 px, claro e escuro |
| `tests/links_check.py` | links nas folhas: etiquetas, abrir fora, tocar no texto para escrever, Adicionar link e Buscar |
| `tests/relatorio_check.py` | Mais › Relatório pelo servidor (sobe o `dev/fake-ha.mjs` e o servidor com a casa inventada de `tests/fixtures/casa.mjs`): cabeçalho, escolhas guardadas, Baixar PDF e Voltar |
| `tests/about_check.py` | Mais › Sobre (o mesmo dos outros apps) e a versão igual em todos os lugares |
| `tests/selects_check.py` | as caixas de seleção no visual do app (`frontend/src/selectsheet.js`) |

Cada uma aceita a pasta das capturas: `python3 tests/mais_check.py /tmp/capturas`. Todas: `tests/visual.sh [pasta]`, que
serve a prévia por http numa porta livre (`MEMORIA_PREVIEW_URL`): aberta como arquivo (file://), o Chromium mais novo nem
sempre guarda a escolha da tela (localStorage) depois de recarregar.

Toda mudança ou correção vem com o teste dela. Dados de exemplo sempre inventados (Ana, Beto).
