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

Ao mudar um, mude nos outros: `frontend/src/selectsheet.js` (as caixas de seleção, igual em todos os apps), `about.js`, `look.js`, `swipe.js`, `voice.js` e `chat.js` (os do ResolvIA e da CronologIA), `usage-panel.js` e `memoria/rootfs/app/lib/usage.js` (os do ResolvIA) e `memoria/rootfs/app/lib/ws.js`, `ha.js` e `voice.js` (os de `lib/` do ResolvIA). O `lib/pdf.js` é o do ResolvIA (o nome do app vai em `producer`) e o `lib/correria.js` é o do ResolvIA e da CronologIA.

## Como os apps conversam

- **MemorIA → CronologIA**: `share/memoria/integracao.json` e a rota `/api/integracao/agora` (o trecho de agora e os dois próximos de uma pessoa, pelo relógio do celular de quem olha), em `lib/integracao.js`.
- **CorrerIA → MemorIA**: o contrato de todos os apps da família (ver o AGENTS.md do CorrerIA); os detalhes daqui estão no README.md, em **Como os apps conversam**.

## Como o dono gosta (interface)

- Tudo em português do Brasil, sem palavras em inglês na tela.
- **Menos é mais**: textos curtos, sem explicar o óbvio, sem avisos repetidos.
- Botões lado a lado com o mesmo tamanho e alinhados; nada torto nem cortado.
- **Mais** é um menu, não uma tela de ajustes: **Categorias**, **Relatório**, **Configurações** (abas Integrações, Dados, Aparência, Opções) e, por último, **Sobre** (o mesmo dos outros apps). O Voltar do celular, o **‹ Mais** e arrastar para a direita voltam ao menu.
- O que depende da IA respeita o interruptor **Usar IA**; o que depende de uma integração só aparece com ela ligada.
- Em http (sem https) não há câmera nem microfone: explicar e oferecer escolher a foto.
- Celular primeiro (390 px; nada passa da largura em 320 px); tema claro e escuro.
- Relatórios (a página e o PDF, iguais em todos os apps): o cabeçalho dos apps, os números, os gráficos e, no fim, a marca da CorrerIA Code como no **Sobre**. O app do Home Assistant no Android não imprime: o PDF é feito pelo servidor e baixado (**Baixar PDF**).
- **Inativos no fim, recolhidos**: o que está inativo, cancelado, encerrado, arquivado ou ignorado de propósito (por uma opção, como Nunca considerar) fica numa seção no fim da lista, recolhida por padrão, com o nome e a contagem (ex.: **Arquivados (3)**); abre num toque. Vale para todos os apps da família. Aqui: os blocos arquivados, em **Arquivados** no fim de **Blocos** (`_renderArchived`); no **Buscar**, com **Incluir arquivados**, depois dos outros; no Relatório, no fim da escolha do bloco (`<optgroup>` Arquivados (N)).
- **Caixas de seleção no visual do app**: nenhuma janela nativa do celular. Toda caixa de seleção abre pelo selectsheet.js; sugestões de texto (no lugar do `<datalist>`) e horários (sem AM/PM) também no visual do app; a caixa fechada igual aos outros campos (altura, cantos, seta), no claro e no escuro. Aqui: o `selectsheet.js` vem primeiro no `main.js` e no `preview.js` (e em `www/selectsheet.js` na página do Relatório), com `select:not([multiple]) { pointer-events: none }` no `styles.js` (Shadow DOM); a caixa fechada é a classe `.select`; horários por `_timeSelect` (de meia em meia hora) e `_timePicker` (a hora e depois os minutos), nunca `<input type="time">`.
- Dados de exemplo e de testes sempre inventados (Ana, Beto): nunca blocos, folhas ou nomes reais do dono.

**Padrão da família (igual em todos os apps)**
- Barra de baixo: a primeira aba é **Agora** (onde o app abre, com o ícone do relógio; nada de Início); o botão do meio é **Adicionar** (no EconomIA, a ação principal dele), só com o ícone, sem o texto embaixo (o nome fica no `aria-label`); **Buscar**, quando houver, é a 2ª aba; **Mais** é a última, com o ícone de três pontos.
- Nada de avisos que só incham a tela: o que a própria tela já mostra, o que a pessoa confere de qualquer jeito ou um limite do app do celular ("a galeria manda uma foto por vez", "Você confere antes de criar", "a IA encontra…") fica de fora (a aba Documentação pode explicar).
- Botões de ação (Novo…, Verificar de novo, Salvar e testar…) na largura do cartão no celular, dois lado a lado dividindo a linha; no computador, com a largura fixa do app (250 ou 280 px). Campos de texto livre que podem ficar longos (o que foi, títulos, descrições, nomes de tarefas) são caixas de texto que mostram tudo e aumentam puxando o canto (`textareas.js`), nunca uma linha que corta o texto; o Enter salva quando o campo é de uma linha só.
- **Mais** é um menu: as funções do app, depois **Configurações** e por último **Sobre**. Os relatórios se chamam **Relatório de/do …**.
- **Configurações** em 4 abas, nesta ordem: **Integrações › Dados › Aparência › Opções**; abre em Integrações. Nenhuma função do app vira aba.
- **Integrações**, nesta ordem: os outros apps da família › CorrerIA › **IA do Home Assistant** (o Usar IA) › Falar › Uso da IA › Sensores.
- IA: as entradas se chamam **Colar mensagem**, **Escolher fotos** (ou **Escolher fotos ou PDF**, onde PDF vale) e **Digitalizar com IA**; a conversa recomeça em **Nova conversa**; o Voltar do celular fecha a Conversa.
- Palavras: **Apagar** (nunca Excluir); **Testar no meu celular**; **Home Assistant Cloud** (não Nabu Casa); recolhidos como **Nome (n)**; o CHANGELOG começa com "# Mudanças".
- Avisos no celular (todos chegam como Home Assistant): o título começa pelo nome do app, uma vez só ("ResolvIA · 📅 Vence hoje"), e o ícone pequeno é o do app (`notification_icon`); o canal e o grupo de cada aviso ficam como estão (o canal guarda o som e a importância que a pessoa escolheu no Android).
- **Dados**: Exportar › Backup na pasta share › Importar › Versões anteriores › Onde ficam os dados › Começar do zero.
- **Aparência**: o tema vale no aparelho (começa em Sistema); a cor do app vale para a casa toda; uma paleta só, de 12 cores (Vermelho, Coral, Laranja, Ouro, Verde, Menta, Turquesa, Azul, Índigo, Lilás, Rosa, Grafite); a Cor do dia é a mesma em todos os apps (as 11 sem o Grafite, pelo número do dia).

Aqui não há aviso no celular (o componente Quem recebe/Testar no meu celular não se aplica). `panel_admin: false` no `config.yaml` fica como está: todas as pessoas da casa usam os blocos, não só os administradores. A barra em `_renderNav`; o menu em `_moreRows`; as abas em `_configTabs`; Integrações em `_renderConfig` (os outros apps: nenhum ainda; o CronologIA lê o `share/memoria/integracao.json` sozinho); o Uso da IA é o `usage.js`/`usage-panel.js` do ResolvIA (iguais lá: ao mudar, mude nos dois); a paleta em `frontend/src/util.js` (`PALETTE`), `lib/store.js` (`COLORS`, `paletteColor`: uma cor de antes vira a mais próxima ao abrir) e `lib/report.js`; a Cor do dia em `look.js` (`colorOfDay`).

## Conversa com o dono

Respostas curtas, em português. Ao terminar uma mudança: o que mudou, a versão e se está publicado. Ele usa o app do Home Assistant no Android: pense no Voltar do celular, no teclado e na câmera.
