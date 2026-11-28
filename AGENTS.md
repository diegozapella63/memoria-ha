# Instruções para quem for mexer neste repositório (pessoas ou IAs)

> Leia também o `PADROES.md`: os padrões da família, iguais em todos os apps. Este arquivo diz o que é só deste app e como cada padrão é feito aqui.

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

A lista fica em `tools/iguais.py` e as regras, em **Arquivos iguais** e **Os apps conversam** do `PADROES.md`.

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

**Padrão da família**: as regras de todos os apps estão no `PADROES.md` (igual nos 8 repositórios; leia antes de mexer). Como cada uma é feita aqui:
- Contrair e expandir: `_applyFolds` (a cada render, em todo `.panel > .mais-head`) e `_toggleFold`; a chave é o id do cartão, o `data-card` ou o título, em `memoria-fechadas` no localStorage. Os ícones: `PAGE_IC` (o título das telas), `sheetIc` (o das janelas), `confirmIc` (as confirmações) e o `lbl-ic` antes do título de cada opção e campo; o `tests/secoes_check.py` confere.

1.41.0: **emojis no PDF** do Relatório: o `lib/pdf.js` (igual ao do ResolvIA) desenha uma figura no lugar de um caractere da área de uso privado (`setGlyph`, `glyphChar`); o `report.js` troca cada emoji (`EMOJI_RE`, `emojisOf`) pelo caractere da figura dele, e um sem figura sai do texto, como antes. As figuras (48 × 48, RGBA) vêm da página do Relatório, que desenha num canvas os que o servidor não tem (`emojiScript`, `POST relatorio/emojis`) e ficam em `/data/emojis` (`lib/emojis.js`; fora das exportações: são só como o aparelho desenha cada emoji). A tela do bloco não rola: `_fitPad` mede o que sobra embaixo do cabeçalho e põe em `--page-h` (a folha rola por dentro). Os campos de escolhas das janelas fecham pelo título (`_applyFieldFolds`, `memoria-campos`; os do Alterar vários blocos, `.bulk-pick`, não). A Caixa de marcar fica só na barra de escrever.

1.42.0 (o dono: "muita redundância no cabeçalho"): na tela do bloco, acima do nome só a categoria e de quem é (sem a contagem de folhas, que está no canto da folha, nem o papel), e a linha de baixo é "Abre sozinho: …" (sem "no Agora de Fulano"); o Agora vazio não repete no alto o que o cartão diz (`_renderNowEmpty(null, …)`). Cada coisa é dita uma vez na tela.

Aqui não há aviso no celular (o componente Quem recebe/Testar no meu celular não se aplica). `panel_admin: false` no `config.yaml` fica como está: todas as pessoas da casa usam os blocos, não só os administradores. A barra em `_renderNav`; o menu em `_moreRows`; as abas em `_configTabs`; Integrações em `_renderConfig` (os outros apps: nenhum ainda; o CronologIA lê o `share/memoria/integracao.json` sozinho); o Uso da IA é o `usage.js`/`usage-panel.js` do ResolvIA (iguais lá: ao mudar, mude nos dois); a paleta em `frontend/src/util.js` (`PALETTE`), `lib/store.js` (`COLORS`, `paletteColor`: uma cor de antes vira a mais próxima ao abrir) e `lib/report.js`; a Cor do dia em `look.js` (`colorOfDay`).

1.42.1: `frontend/src/teclado.js` (`tecladoCalmo`, chamado na entrada da tela; o mesmo código em todos os apps): com o foco num campo de texto, ou quando o teclado muda a altura da tela, as páginas em volta do app (a do Home Assistant) voltam para o começo. `SO_MATERIAL`/`soMaterial` no `lib/ai.js`: a guarda na frente de toda instrução que vai para a IA (o `tests/ai-guarda.test.mjs` confere que nenhuma chamada fica sem).

1.42.2: na Conversa, no celular (`noCelular()`: `(hover: none) and (pointer: coarse)`, o dedo como jeito principal), o Enter é uma linha nova e o botão envia (`enterkeyhint="enter"`); com teclado de verdade, o Enter envia. Vale em todos os apps da família.

1.42.3: o `_writing` chama o `_fitPad` quando o `--kb` muda (o teclado abre ou fecha) e ao sair: a folha nova, aberta com o teclado, ficava curta depois de ele fechar (o `tests/formato_check.py` confere, com um `visualViewport` de mentira).

1.43.0: **Modo de ver** (Opções, `#modo-ver`; `app.view`: `"rolar"` ou nada = Caderno; da casa toda): `_roll()` (nunca na Tela cheia); no `_renderPad`, `.pad.roll`: sem a capa, as argolas, as bordas de virar e o caderno aberto (`_spread()` é falso); no bloco (`opts.tall`), todas as folhas, a aberta (`pad.page`, `.leaf.on`) com o editor de sempre e as outras paradas (`.ink.still`, o `_inkParts`), que um toque abre ali mesmo (`_rollOpen`, guardando o `scrollTop`); no Agora, só a folha de agora; no fim, `.roll-new`. A folha tem a altura do texto (`height: auto`; o editor com `field-sizing: content`) e o `_fitPad` não mexe. O `tests/rolar_check.py` confere.

1.44.0: a ferramenta `ler_arquivo` (leitura; `anexo`: os tipos do `anexos.js`, foto ou PDF; o CorrerIA 1.24.0 manda o arquivo da conversa em `anexo`, fora dos argumentos): `lerArquivo` no `lib/ferramentas.js`, chamada pelo `handleTools` (o `callTool` é síncrono) com o `ai.extract` da tela, que respeita o Usar IA; devolve o texto, sem escrever nada. O pedido da rota aceita 22 MB.

1.45.0: as lembranças da casa (a Memória da IA do CorrerIA 1.28.0, em `share/correria/lembrancas.json`: `{lembrancas: [frases]}`) vão na frente de toda instrução da IA daqui, logo depois da guarda, só com a opção CorrerIA ligada: `lib/lembrancas.js` (`lerLembrancas`, `lembrancasTexto`, relido uma vez por minuto; igual nos três apps em Node, em `tools/iguais.py`), o `comLembrancas` do `lib/ai.js` (dentro do `soMaterial`) e, no `server.js`, `comLembrancas(() => (correriaOn() ? lembrancasTexto() : ""))`; `LEMBRANCAS_ARQ` troca o arquivo nos testes (`tests/lembrancas.test.mjs`).

1.46.0 (o dono: "e se eu não usar o CorrerIA e só decidir usar o InventarIA e o ResolvIA?"; "memória compartilhada"; "deixa claro na observação das opções que a memória é compartilhada"): a **Memória da IA** é uma só, da casa, de todos os apps, em `share/familia/memoria_ia.json` (`{versao: 1, gravado_em, lista: [{id, texto, em, app, quem?}]}`, até 60 frases de 240 letras, 600; `MEMORIA_IA_ARQ` troca o arquivo nos testes), e não depende mais da opção CorrerIA nem do arquivo do CorrerIA (o `share/correria/lembrancas.json` acabou). `lib/memoria-ia.js` (igual nos três apps em Node, no lugar do `lib/lembrancas.js`; nos em Python, `memoria_ia.py`: `ler`, `lembrar`, `esquecer`, `memoriaTexto`, `comando`; lê de novo a cada 30 s e antes de gravar), os comandos `memoria/memoria_ia/get|add {texto}|del {frase}` → `{lista, max}` (o `id` da mensagem é do WebSocket) e, no `server.js`, `comLembrancas(() => memoriaIa.memoriaTexto(MEMORIA_ARQ))`; na tela, o `frontend/src/memoria-ia.js` (`MemoriaIaMixin`, igual nos três: `_renderMemoriaIa()` logo depois do `_renderAiPanel()`, só com Usar IA ligado; quem usa oferece o `_memoriaIaCall`). Testes: `tests/memoria-ia.test.mjs` e o `tests/server.test.mjs`. O texto do cartão é o mesmo em todos os apps: «Uma memória só, da casa, compartilhada por todos os apps: o que você escreve aqui a IA lembra em toda conversa, em qualquer um deles.» A memória não entra no Exportar nem no Começar do zero de um app.

1.46.1: o cartão Memória da IA lê a lista de novo quando a última leitura tem mais de meio minuto (`MEMORIA_IA_RELER_MS`, `_memIaAt` no `frontend/src/memoria-ia.js`): antes lia uma vez só por abertura do app e não mostrava o que outro app escreveu.

1.46.2: a vez de gravar a Memória da IA entre os apps (`lib/memoria-ia.js: `naVez``: uma pasta `memoria_ia.json.trava` ao lado do arquivo, criada num passo só; espera até 3 s, tira a que ficou de um app que caiu, há mais de 10 s, e sem a vez grava assim mesmo; o arquivo temporário leva um sufixo ao acaso). Antes, dois apps gravando no mesmo instante liam a mesma lista e um apagava a frase do outro (num teste com 40 gravações simultâneas, uma se perdia). Um caminho que não é uma pasta não prende o app (espera só o prazo).

1.46.3 (o dono: "eu aumento o campo e quando volta, volta ao original; ele deve salvar o tamanho, isso era nosso padrão"): o campo do cartão Memória da IA tinha `data-size="off"` e ficava fora do `textareas.js`; saiu. O `data-size="off"` é só para o campo que cresce sozinho (a caixa da Conversa, as perguntas prontas, o item lido pela IA).

1.46.4 (o dono: "esses campos com scroll quebram as pernas"): o campo da Memória da IA cresce com o texto (`field-sizing: content`, até 40vh), sem rolagem dentro dele; uma linha continua com 50 px e o tamanho puxado pelo canto continua guardado.

1.46.4 (o dono: "sempre que eu clicar na conversa da IA deve iniciar com o chat"; vale em todos os apps): `chatFresh()` no `chat.js` (igual nos três) fecha as perguntas prontas, o Editar perguntas e o menu do clipe; o `_openChat` do `chat-panel.js` chama.

1.46.5, três pedidos do dono: (1) "se eu clico em voltar ele sai do app" (espiando outro horário no Agora): o `_peekAt` põe uma entrada no histórico (`rvPeek`, uma só, também trocando de horário); o `_backToNow` volta por ela (`history.back()`) e o `_onPopState` chama o `_peekOff`; o `_go` para outra tela troca a entrada do espiar pela da tela nova (`overPeek`). (2) "os 3 pontinhos da folha devem aparecer sempre": no modo Rolar, toda folha tem o botão (`_renderLeafTop(..., pageId)`); o de uma folha que não é a aberta abre a folha e as opções dela (`_openPageMenu(id)`). (3) "faz igual o ResolvIA e não foca no buscar": a aba Buscar abre sem o foco no campo. Testes: `tempo_check`, `rolar_check` e `buscar_check`.

1.47.0 (o dono: "pode criar" as ferramentas que faltavam para as rondas): o `resumo` do CorrerIA aceita `parados_ha_dias` (1 a 3650): só os blocos cujo último movimento (a folha mudada por último; sem folhas, o bloco) tem pelo menos esse tempo, com `parado_ha_dias` em cada um; para a etapa Anotações: Blocos parados do CorrerIA 1.35.0. Teste no `tests/ferramentas.test.mjs`.

1.48.0 (o dono, à lista do que a IA não fazia: "todas"): as ferramentas `apagar_bloco` (o `store.deleteBlock`, com as folhas; evento `block_deleted`) e `editar_categoria` (`nome` e/ou `cor` pelo `store.saveCategory`, ou `apagar` pelo `store.deleteCategory`; eventos `category` e `category_deleted`), as duas com `apaga`. Teste: o de 1.48.0 no `tests/ferramentas.test.mjs`.

1.49.0 (o dono: "esse adicionar com essas opçõezinhas de retrair tem que mostrar o que foi selecionado do ladinho, quando eu retraio"; vale em todos os apps): fechado, o campo mostra o escolhido depois do título: `frontend/src/campovalor.js` (igual no ResolvIA e na CronologIA, em `tools/iguais.py`: `fieldValOf`, os botões marcados sem o que vem embaixo do nome, os `.time-chip`, senão o texto, senão o `data-vazio` do campo; `paintFieldVals` põe no `data-val` do `.flabel`), chamado no fim do `_applyFieldFolds` e num `requestAnimationFrame` no `updated`; o CSS desenha com o `::before` (`order: 1`). O Quando abrir sozinho tem `data-vazio="Nunca"`. Teste: `tests/bloco_check.py`.

1.49.1 (o dono: "revisar as 20 perguntas padrões da IA, tem algumas muito específicas"): as **perguntas prontas** da Conversa (as 6 à vista e as 20 do Mais perguntas) são gerais e valem em qualquer casa: nada de itens, valores, compromissos, cômodos ou nomes inventados («Adiciona leite na lista», «Marca dentista sexta às 15h», «Onde está o liquidificador?»); o pedido com o detalhe é o que a pessoa escreve. Vale em todos os apps da família.

1.50.0, três pedidos do dono: (1) "colocar aqui a possibilidade de colocar um horário customizado" (a janela da Hora): a opção `digitar` no começo da caixa das horas do `_timePicker`; escolhida, o `_tpTyping` (o rótulo do picker) troca o botão pelo `.tp-digitar` (`.tp-input` com `inputmode="numeric"` e o `typedTime`, que põe os dois pontos; o ✓ `.tp-ok`, o Enter e o ✕ `.tp-x`); um horário que não é um avisa. (2) "Fica no Agora, ter opção de horário customizado": `durOk` (de 5 em 5 minutos, de 5 a 1440) e `fmtDur` no `lib/schedule.js`, no `store.js` e no `frontend/preview/mock-api.js` no lugar da lista `DURATIONS` (que continua sendo os botões); o **Outro tempo** do `_durPick` abre as horas e os minutos no selectsheet.js (`_dpHour`). (3) "filtro por categoria" no Buscar: `SEARCH_CAT_KEY`, `_searchCat` e o `_renderCatChips` (o mesmo de Blocos) nos Filtros. O `campovalor.js` (igual no ResolvIA e na CronologIA) lê os equipamentos. Testes: `horarios_check`, `tempo_check`, `buscar_check` e o `tests/agora.test.mjs`.

1.51.0 (o dono: "do mesmo jeito que criamos esse agrupar por… [nos Consumíveis do InventarIA]… a gente precisa adicionar ele em outros locais"): Blocos › Agrupar por: `_shelfAgrupar` (Nenhum, Categoria com categorias, De quem é com o `_whoOn`, Horário), `_shelfComo`, `_renderAgrupar` (o título `.agrupar-l` que fecha, `AGRUPAR_FECHADO_KEY`, e o `.seg.agrupar-seg`; `AGRUPAR_KEY`), `_shelfGroups` (os grupos na ordem; Horário pelos períodos, os horários fixos e os trechos, com o `periodAt`) e `_renderShelfGroups` (`.shelf-grp` com o `.grp-h`, que fecha, `GRUPOS_KEY`; as capas pelo `_renderCovers(blocks, add)` e a lista pelo `_renderShelfList(blocks, add)`; o Novo bloco uma vez, no fim). Teste: `tests/agrupar_check.py`.

1.52.0 (o dono: "os filtros lá de cima devem poder ser retraídos igual os outros filtros"; "cada tela tem tamanho de fonte diferente… documenta nos padrões.md e aplica ele em todos os apps"; "padronizar as setas em todos os apps"): `_renderFiltros(id, key, val, body)` (a linha do Filtros, `.filters-label`, que fecha o `.filtros`; fechado, o `.filters-val` com o `_filtrosVal(who, fcat)`) no Blocos (`SHELF_FOLD_KEY`, `#blocos-filtros`) e no Buscar (`_renderSearchFilters`), dentro do `.alto-lista`; o `.filters-label` e o `.agrupar-l` iguais (40 px, 15 px, peso 500, o `.lbl-ic` de 18 px na cor do app, o escolhido em cinza), como o **O alto das listas** do `PADROES.md`; o `_shelfAgrupar` com o `nenhum` por último e o `_shelfComo` começando na primeira; o `.sel-n` em 15 px. As setas que apontavam para cima abertas (o `.done-toggle`, o `.uso-chev`, o `.arch-head .chev`) apontam para o lado fechadas e para baixo abertas. Testes: `agrupar_check` e `buscar_check`.

1.52.1 (o dono: "ali dos filtros não criar segunda linha, colocar ... no final se não couber"; "faz também nos outros de mostrar o que foi selecionado ao retrair"): o Filtros fechado sempre com o `.filters-val` (sem nada, «Todos os blocos»), numa linha só.

1.52.2 (o dono: "quando retraído sem selecionar nada deve estar como nenhum… em todos os apps"): o `campovalor.js` (igual nos três) tem o `vazioDe(titulo)` («Sem categoria», «Ninguém», «Nenhuma» de uma palavra feminina ou «Nenhum»), usado pelo `paintFieldVals` quando o campo não tem nada.

1.53.0 (o dono: "Pq cada coisa que tento usar na IA não funciona?… Eu te pedi uma análise aprofundada"; à auditoria da tela contra as ferramentas: "Segue"): o que só a tela fazia. No server.js, o `applySettings({periods, app})` (o `store.saveSettings` com o que o `memoria/settings/save` punha para andar: o `voice.forget`, os sensores e o CorrerIA) e o `makeBackup()`, que a tela e as ferramentas usam (`callTool(..., {aplicar, backup})`; o `WRITE` recebe `{pessoa, aplicar, backup}` no quinto argumento). Ferramentas: `marcar_no_agora` (`linha` pelo texto ou pelo número entre as com caixa, `marcada`: o `_markLine` da tela, o `store.saveMarks` com o `occurrence` do horário de agora de quem pede; a folha é a do horário próprio ou a última do bloco, como o `_padEntryPad`), `alterar_blocos` (`blocos`, `categoria`, `de`: o `_applyBulk` do Selecionar), `opcoes` (leitura) e `mudar_opcoes` (`manha`, `tarde`, `noite`, `letra_de_mao`, `modo_de_ver`, `usar_categorias`, `controle_por_pessoa`, `sensor`, `sensor_ia`) e `fazer_backup`. A ordem dos blocos não muda na tela, então não tem ferramenta. Ficam só na tela, de propósito: o Usar IA e a IA de cada uso, a opção CorrerIA, a cor e a aparência, restaurar, importar e Começar do zero. Testes: os de 1.53.0 no `tests/ferramentas.test.mjs` e o `tests/server.test.mjs`.

## Conversa com o dono

Respostas curtas, em português. Ao terminar uma mudança: o que mudou, a versão e se está publicado. Ele usa o app do Home Assistant no Android: pense no Voltar do celular, no teclado e na câmera.
