# Instruções para quem for mexer neste repositório (pessoas ou IAs)

MemorIA é um app (add-on) do Home Assistant com blocos de anotações em forma de caderno: blocos que abrem sozinhos num período do dia ou num horário exato, folhas com horário próprio (trechos), categorias, de quem é cada bloco, arquivar, Relatório em PDF, leitura por IA, Falar e Conversar. Faz parte de uma família de apps do mesmo dono, que conversam entre si pelo Home Assistant:

| App | Repositório | O que é |
|---|---|---|
| MemorIA | `diegozapella63/memoria-ha` (este) | blocos de anotações |
| CronologIA | `diegozapella63/cronologia-ha` | calendário, rotinas, remédios, placar (mostra o trecho de agora daqui) |
| ResolvIA | `diegozapella63/resolvia-ha` | listas de tarefas, pontos, repetição |
| InventarIA | `diegozapella63/inventario-ha` | inventário da casa |
| GerencIA | `diegozapella63/gerencia-ha` | finanças |
| CorrerIA | `diegozapella63/correria-ha` | o WhatsApp, o Claude e o Gemini: usa as ferramentas daqui |

O Home Assistant instala direto do GitHub (`repository.yaml` + `memoria/config.yaml`), a partir da branch `main`. Por isso o JavaScript gerado da interface fica no repositório: o que está em `main` é o que os usuários recebem.

## Estrutura

```
memoria/config.yaml            versão e opções do app
memoria/CHANGELOG.md           o que mudou em cada versão (o HA mostra ao atualizar)
memoria/DOCS.md                manual do usuário (aba Documentação no HA)
memoria/rootfs/app/server.js   servidor (Node 22, sem dependências: só módulos do Node)
memoria/rootfs/app/lib/        regras: store.js (dados), schedule.js (períodos, horários e o Agora), writing.js, report.js e
                               pdf.js (Relatório), ferramentas.js e correria.js (CorrerIA), integracao.js (CronologIA)...
memoria/rootfs/app/www/        interface já gerada (não editar à mão)
frontend/src/                  código da interface (Lit): memoria-app.js, styles.js e os arquivos iguais aos dos outros apps
preview/memoria-preview.html   prévia gerada pelo build, abre sem servidor
dev/fake-ha.mjs                Home Assistant simulado para desenvolver e testar
tests/                         testes (ver tests/README.md)
tools/prints_readme.py         refaz as capturas do README (docs/*.png) pela prévia
```

Como rodar no computador: README.md, em **Desenvolvimento**.

## Checklist de toda mudança

1. `git pull --rebase` antes de começar: outras sessões (pessoas ou IAs) também publicam aqui.
2. Implementar. Servidor: só módulos nativos do Node. Interface: Lit, em `frontend/src`. A prévia usa a mesma tela com o servidor imitado em `frontend/preview/mock-api.js`: se a mudança depende do servidor, imite lá.
3. Gerar a interface: `cd frontend && npm install && npm run build`. Faça commit também de `memoria/rootfs/app/www/memoria.js` e `preview/memoria-preview.html`.
4. Testar: `tests/run.sh` (servidor; `--cobertura` mede a cobertura, que fica acima de 95% das linhas) e as conferências visuais ligadas à mudança (`tests/e2e/run.sh nome ...`, ou todas). Toda mudança ou bug corrigido vem com o teste dele (ver tests/README.md).
5. Subir a versão num lugar só, `memoria/config.yaml` (`version:`), e rodar o build: ele escreve `memoria/rootfs/app/lib/version.js` (o servidor) e a prévia (o `tests/version.test.mjs` confere). Correção = patch (1.17.1 → 1.17.2); novidade = minor (1.17.x → 1.18.0).
6. `memoria/CHANGELOG.md`: nova seção no topo, em português, do ponto de vista de quem usa (o que mudou na tela, não no código).
7. `memoria/DOCS.md` quando muda o comportamento ou aparece algo novo; `README.md` quando muda a lista do que o app tem.
8. Commit em `main` com mensagem em português ("MemorIA 1.17.0: ..."), `git pull --rebase` e push. O GitHub roda todos os testes a cada push (aba Actions).

## Arquivos iguais em todos os apps

A lista dos arquivos que são iguais nos apps da família fica em `tools/iguais.py` (ele também é igual em todos):
`python3 tools/iguais.py` confere os daqui com os dos apps ao lado (`../resolvia-ha`, ...), e o GitHub confere a cada
push (job **Arquivos iguais aos dos outros apps**, que baixa os outros apps). Mudou um arquivo da lista? Copie para os
outros apps do grupo e publique todos. Um arquivo que passa a ser igual entra em `GRUPOS`, aqui e nas cópias.

`share/<app>/integracao.json` começa igual em todos os apps: `app` (o id, como no `correria.json`), `nome`, `versao` e
`gravado_em` (ISO 8601 com o fuso), depois os campos de cada app. O ResolvIA e o CronologIA ainda gravam o nome em
`app` (as versões de antes conferem por ele) e quem lê aceita os dois; o id entra numa próxima versão.

## Arquivos iguais aos dos outros apps

Ao mudar um, mude nos outros: `frontend/src/selectsheet.js` (as caixas de seleção, igual em todos os apps), `frontend/src/hatema.js` (o fundo e os cartões do tema do Home Assistant, igual em todos os apps), `about.js`, `look.js`, `swipe.js`, `voice.js` e `chat.js` (os do ResolvIA e da CronologIA), `usage-panel.js` e `memoria/rootfs/app/lib/usage.js` (os do ResolvIA) e `memoria/rootfs/app/lib/ws.js`, `ha.js` e `voice.js` (os de `lib/` do ResolvIA). O `lib/pdf.js` é o do ResolvIA (o nome do app vai em `producer`) e o `lib/correria.js` é o do ResolvIA e da CronologIA.

## Como os apps conversam

- **MemorIA → CronologIA**: `share/memoria/integracao.json` e a rota `/api/integracao/agora` (o trecho de agora e os dois próximos de uma pessoa, pelo relógio do celular de quem olha; 1.33.0: `?proximos=N`, até 12, cada horário uma vez só, para a Tela cheia da CronologIA passar de um em um), em `lib/integracao.js`. `texto` vai sem as marcas; desde a 1.32.0, uma folha com negrito, maior ou cor leva também `texto_formatado` (com `**negrito**`, `++maior++` e `{cor:texto}`, cortado no fim de uma linha para não partir uma marca).
- **CorrerIA → MemorIA**: o contrato de todos os apps da família (ver o AGENTS.md do CorrerIA); os detalhes daqui estão no README.md, em **Como os apps conversam**.

## Como o dono gosta (interface)

- Tudo em português do Brasil, sem palavras em inglês na tela.
- **Menos é mais**: textos curtos, sem explicar o óbvio, sem avisos repetidos.
- Botões lado a lado com o mesmo tamanho e alinhados; nada torto nem cortado.
- **Mais** é um menu, não uma tela de ajustes: **Categorias**, **Relatório**, **Configurações** (abas Integrações, Dados, Aparência, Opções) e, por último, **Sobre** (o mesmo dos outros apps). O Voltar do celular, o **‹ Mais** e arrastar para a direita voltam ao menu.
- O que depende da IA respeita o interruptor **Usar IA**; o que depende de uma integração só aparece com ela ligada.
- Em http (sem https) não há câmera nem microfone: explicar e oferecer escolher a foto.
- Celular primeiro (390 px; nada passa da largura em 320 px); com 1000 px ou mais (fora da Tela cheia), a barra lateral da família no lugar da barra de baixo (`_renderSide`: o `appicon.js`, o Adicionar, as telas, os blocos do De quem é de Blocos e a versão; as janelas no meio; o `tests/lateral_check.py` confere); tema claro e escuro.
- Relatórios (a página e o PDF, iguais em todos os apps): o cabeçalho dos apps, os números, os gráficos e, no fim, a marca da CorrerIA Code como no **Sobre**. O app do Home Assistant no Android não imprime: o PDF é feito pelo servidor e baixado (**Baixar PDF**).
- **Inativos no fim, recolhidos**: o que está inativo, cancelado, encerrado, arquivado ou ignorado de propósito (por uma opção, como Nunca considerar) fica numa seção no fim da lista, recolhida por padrão, com o nome e a contagem (ex.: **Arquivados (3)**); abre num toque. Vale para todos os apps da família. Aqui: os blocos arquivados, em **Arquivados** no fim de **Blocos** (`_renderArchived`); no **Buscar**, com **Incluir arquivados**, depois dos outros; no Relatório, no fim da escolha do bloco (`<optgroup>` Arquivados (N)).
- **Caixas de seleção no visual do app**: nenhuma janela nativa do celular. Toda caixa de seleção abre pelo selectsheet.js; sugestões de texto (no lugar do `<datalist>`) e horários (sem AM/PM) também no visual do app; a caixa fechada igual aos outros campos (altura, cantos, seta), no claro e no escuro. Aqui: o `selectsheet.js` vem primeiro no `main.js` e no `preview.js` (e em `www/selectsheet.js` na página do Relatório), com `select:not([multiple]) { pointer-events: none }` no `styles.js` (Shadow DOM); a caixa fechada é a classe `.select`; horários por `_timeSelect` (de meia em meia hora) e `_timePicker` (a hora e depois os minutos), nunca `<input type="time">`.
- Dados de exemplo e de testes sempre inventados (Ana, Beto): nunca blocos, folhas ou nomes reais do dono.

**Padrão da família (igual em todos os apps)**
- Barra de baixo: a primeira aba é **Agora** (onde o app abre, com o ícone do relógio; nada de Início); o botão do meio é **Adicionar** (no EconomIA, a ação principal dele), só com o ícone, sem o texto embaixo (o nome fica no `aria-label`); **Buscar**, quando houver, é a 2ª aba; **Mais** é a última, com o ícone de três pontos.
- **Ícones**: toda seção (cartão) começa com o cabeçalho, o ícone e o título; o título de cada tela, de cada grupo (como Imóveis e Veículos) e de cada janela (Novo cômodo, Nova despesa… e a lista de uma caixa de seleção) também tem o ícone; dentro de uma seção, toda linha com título (uma chave, uma escolha, um campo, um recolhido como **Últimas chamadas**) tem um ícone pequeno antes do título; e todo botão com texto tem ícone (Cancelar, Salvar, Voltar, Hoje…). Assim dá para ver onde cada parte começa.
- **Seções**: cada seção principal é um cartão (o fundo, a borda e os cantos arredondados, como no GerencIA), sem linha no fim; entre as linhas de opções de uma seção não há linha (o ícone de cada uma marca onde começa); as listas de dados (as listas, as tarefas que se repetem, os itens) têm a linha fina entre as entradas, sem a do fim.
- **Sub-opções**: o que só vale com uma chave ligada (o Horário e o A cada do Conferir sozinho, o Quem recebe e o Testar do Avisar no celular, uma lista como Apps detectados) fica num quadro recuado logo abaixo dela, para ver de qual opção é.
- **Abas**: quando as abas não cabem na largura, a ponta de onde há mais some aos poucos, com uma seta.
- **Contrair e expandir**: toda seção (cartão) fecha e abre num toque no cabeçalho, com a seta no canto; o aparelho lembra as que ficaram fechadas. Aqui: `_applyFolds` (a cada render, em todo `.panel > .mais-head`) e `_toggleFold`; a chave é o id do cartão, o `data-card` ou o título, em `memoria-fechadas` no localStorage. Os ícones: `PAGE_IC` (o título das telas), `sheetIc` (o das janelas), `confirmIc` (as confirmações) e o `lbl-ic` antes do título de cada opção e campo; o `tests/secoes_check.py` confere.
- Nada de avisos que só incham a tela: o que a própria tela já mostra, o que a pessoa confere de qualquer jeito ou um limite do app do celular ("a galeria manda uma foto por vez", "Você confere antes de criar", "a IA encontra…") fica de fora (a aba Documentação pode explicar).
- Botões de ação (Novo…, Verificar de novo, Salvar e testar…) na largura do cartão no celular, dois lado a lado dividindo a linha; no computador, com a largura fixa do app (250 ou 280 px). Campos de texto livre que podem ficar longos (o que foi, títulos, descrições, nomes de tarefas) são caixas de texto que mostram tudo e aumentam puxando o canto (`textareas.js`), nunca uma linha que corta o texto; o Enter salva quando o campo é de uma linha só.
- **Mais** é um menu: as funções do app, depois **Configurações** e por último **Sobre**. Os relatórios se chamam **Relatório de/do …**.
- **Configurações** em 4 abas, nesta ordem: **Integrações › Dados › Aparência › Opções**; abre em Integrações. Nenhuma função do app vira aba.
- **Integrações**, nesta ordem: os outros apps da família › CorrerIA › **IA** (o Usar IA e a IA de cada uso: **Para conversar**, **Para ler fotos e PDFs** e, onde há busca na web, **Para pesquisar na internet**; cada uma é uma tarefa de IA do Home Assistant, e a de fotos ou de pesquisa vazia é igual à de conversar) › Falar › Uso da IA › Sensores.
- IA: as entradas se chamam **Colar mensagem**, **Escolher fotos** (ou **Escolher fotos ou PDF**, onde PDF vale) e **Digitalizar com IA**; a conversa recomeça em **Nova conversa**; o Voltar do celular fecha a Conversa.
- Palavras: **Apagar** (nunca Excluir); **Testar no meu celular**; **Home Assistant Cloud** (não Nabu Casa); recolhidos como **Nome (n)**; o CHANGELOG começa com "# Mudanças".
- Avisos no celular (todos chegam como Home Assistant): o título começa pelo nome do app, uma vez só ("ResolvIA · 📅 Vence hoje"), e o ícone pequeno é o do app (`notification_icon`); o canal e o grupo de cada aviso ficam como estão (o canal guarda o som e a importância que a pessoa escolheu no Android).
- **Dados**: Exportar › Backup na pasta share › Importar › Versões anteriores › Onde ficam os dados › Começar do zero.
- **Aparência**: o tema vale no aparelho (começa em Sistema); o fundo e os cartões são os do tema do Home Assistant (`hatema.js`, igual em todos os apps: publica `--ha-bg-light`, `--ha-card-light`, `--ha-bg-dark` e `--ha-card-dark`, as do modo de agora lidas do Home Assistant e as do outro, do tema padrão dele; os cinzas, como linhas e campos, saem do cartão misturado com o texto, `color-mix`, nunca uma cor fixa puxada para a cor do app); a cor do app vale para a casa toda; uma paleta só, de 12 cores (Vermelho, Coral, Laranja, Ouro, Verde, Menta, Turquesa, Azul, Índigo, Lilás, Rosa, Grafite); a Cor do dia é a mesma em todos os apps (as 11 sem o Grafite, pelo número do dia).

1.41.0: **emojis no PDF** do Relatório: o `lib/pdf.js` (igual ao do ResolvIA) desenha uma figura no lugar de um caractere da área de uso privado (`setGlyph`, `glyphChar`); o `report.js` troca cada emoji (`EMOJI_RE`, `emojisOf`) pelo caractere da figura dele, e um sem figura sai do texto, como antes. As figuras (48 × 48, RGBA) vêm da página do Relatório, que desenha num canvas os que o servidor não tem (`emojiScript`, `POST relatorio/emojis`) e ficam em `/data/emojis` (`lib/emojis.js`; fora das exportações: são só como o aparelho desenha cada emoji). A tela do bloco não rola: `_fitPad` mede o que sobra embaixo do cabeçalho e põe em `--page-h` (a folha rola por dentro). Os campos de escolhas das janelas fecham pelo título (`_applyFieldFolds`, `memoria-campos`; os do Alterar vários blocos, `.bulk-pick`, não). A Caixa de marcar fica só na barra de escrever.

1.42.0 (o dono: "muita redundância no cabeçalho"): na tela do bloco, acima do nome só a categoria e de quem é (sem a contagem de folhas, que está no canto da folha, nem o papel), e a linha de baixo é "Abre sozinho: …" (sem "no Agora de Fulano"); o Agora vazio não repete no alto o que o cartão diz (`_renderNowEmpty(null, …)`). Cada coisa é dita uma vez na tela.

Aqui não há aviso no celular (o componente Quem recebe/Testar no meu celular não se aplica). `panel_admin: false` no `config.yaml` fica como está: todas as pessoas da casa usam os blocos, não só os administradores. A barra em `_renderNav`; o menu em `_moreRows`; as abas em `_configTabs`; Integrações em `_renderConfig` (os outros apps: nenhum ainda; o CronologIA lê o `share/memoria/integracao.json` sozinho); o Uso da IA é o `usage.js`/`usage-panel.js` do ResolvIA (iguais lá: ao mudar, mude nos dois); a paleta em `frontend/src/util.js` (`PALETTE`), `lib/store.js` (`COLORS`, `paletteColor`: uma cor de antes vira a mais próxima ao abrir) e `lib/report.js`; a Cor do dia em `look.js` (`colorOfDay`).

1.42.1: `frontend/src/teclado.js` (`tecladoCalmo`, chamado na entrada da tela; o mesmo código em todos os apps): com o foco num campo de texto, ou quando o teclado muda a altura da tela, as páginas em volta do app (a do Home Assistant) voltam para o começo. `SO_MATERIAL`/`soMaterial` no `lib/ai.js`: a guarda na frente de toda instrução que vai para a IA (o `tests/ai-guarda.test.mjs` confere que nenhuma chamada fica sem).

1.42.2: na Conversa, no celular (`noCelular()`: `(hover: none) and (pointer: coarse)`, o dedo como jeito principal), o Enter é uma linha nova e o botão envia (`enterkeyhint="enter"`); com teclado de verdade, o Enter envia. Vale em todos os apps da família.

1.42.3: o `_writing` chama o `_fitPad` quando o `--kb` muda (o teclado abre ou fecha) e ao sair: a folha nova, aberta com o teclado, ficava curta depois de ele fechar (o `tests/formato_check.py` confere, com um `visualViewport` de mentira).

1.43.0: **Modo de ver** (Opções, `#modo-ver`; `app.view`: `"rolar"` ou nada = Caderno; da casa toda): `_roll()` (nunca na Tela cheia); no `_renderPad`, `.pad.roll`: sem a capa, as argolas, as bordas de virar e o caderno aberto (`_spread()` é falso); no bloco (`opts.tall`), todas as folhas, a aberta (`pad.page`, `.leaf.on`) com o editor de sempre e as outras paradas (`.ink.still`, o `_inkParts`), que um toque abre ali mesmo (`_rollOpen`, guardando o `scrollTop`); no Agora, só a folha de agora; no fim, `.roll-new`. A folha tem a altura do texto (`height: auto`; o editor com `field-sizing: content`) e o `_fitPad` não mexe. O `tests/rolar_check.py` confere.

## Conversa com o dono

Respostas curtas, em português. Ao terminar uma mudança: o que mudou, a versão e se está publicado. Ele usa o app do Home Assistant no Android: pense no Voltar do celular, no teclado e na câmera.
