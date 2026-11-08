# Changelog

## 1.4.0

- **Mais virou um menu**, como nos outros apps da família: **Configurações** e, por último, **Sobre**. Cada linha abre a sua tela; o Voltar do celular, o **‹ Mais** no alto e arrastar o dedo para a direita voltam ao menu.
- **Configurações em abas**: **Integrações** (Leitura por IA e o sensor no Home Assistant), **Dados** (exportar, backup, importar, versões e começar do zero), **Aparência** (tema, cor do app e letra de mão) e **Opções** (os períodos do dia). A aba escolhida fica guardada.
- **Aparência como nos outros apps**: o tema em três botões grandes (Automático, Claro, Escuro) e a cor do app em etiquetas com o nome de cada cor.
- **Cor do dia**: a cor do app muda todo dia, sozinha (a mesma em todos os aparelhos, e troca à meia-noite mesmo com o app aberto). Vem ligada; em Mais › Configurações › Aparência, desligue em **Cor do dia** ou escolha uma cor para ficar sempre nela. Os blocos continuam com a cor da capa.
- **Tema automático** troca na hora quando o Home Assistant (ou o celular) muda entre claro e escuro, com o app aberto, inclusive o fundo em volta do app. Na prévia, segue o tema de quem está vendo.
- **Arrastar o dedo para os lados** troca de aba (Agora, Blocos, Buscar e Mais), como nos outros apps. Na folha, arrastar continua virando a página; dentro de um bloco, arrastar para a direita volta.

## 1.3.1

- **Caixas de seleção**: tocar num botão que fica por cima de uma caixa aciona o botão, e não abre a caixa escondida (o mesmo ajuste dos outros apps).

## 1.3.0

- **IA usada pelo app** (Mais › Leitura por IA) abre uma janela no visual do app, de baixo para cima, com as opções em linhas e a atual marcada na cor do app, no tema claro ou escuro, e não mais a janela padrão do celular, como nos outros apps da família. O Voltar do celular, o X ou tocar fora fecham só ela.

## 1.2.0

- **Mais › Sobre**, a última linha do Mais: quem faz o app (**CorrerIA Code**, desenvolvimento de softwares, e por que esse nome), os apps da família (CronologIA, ResolvIA, GerencIA, InventarIA, EconomIA e MemorIA), cada um com uma linha e o link para o GitHub, e o botão **Meu GitHub**. O Voltar do celular e o **‹ Mais** voltam para o Mais.

## 1.1.0

- Leitura por IA igual à do InventarIA, do GerencIA e do EconomIA: usa só a IA configurada no Home Assistant (tarefa de IA) e não guarda chave de API. Saiu a opção da chave do Gemini.
- Novo em **Mais > Leitura por IA**: escolher qual IA usar ("Padrão do Home Assistant" ou uma da lista, com as que só leem texto marcadas), ver se está pronta para ler fotos, **Verificar de novo** e o passo a passo para configurar.
- As fotos ficam em `media/memoria/ia-temp` só durante a leitura.
- Novo em **Mais > Dados**, como no GerencIA e no InventarIA: exportar (ZIP com um arquivo de texto por bloco, CSV para Excel e JSON), backup na pasta `share/memoria` com lista para restaurar, importar backup ou JSON, versões anteriores (uma cópia a cada 10 minutos de uso, as 60 mais recentes) e começar do zero. Antes de importar, restaurar ou apagar, o app guarda uma cópia.
- A tela Agora sem blocos oferece **Importar backup**.

## 1.0.0

- Primeira versão.
- Blocos de anotações com cara de caderno: espiral, folhas pautadas, quadriculadas, pontilhadas ou lisas e letra de mão (Caveat).
- Toque na borda direita para virar a página; na última folha, vira para uma folha nova. Borda esquerda ou arrastar para voltar.
- Cada bloco abre sozinho de manhã, à tarde, à noite ou em horários exatos; folhas podem ter horário próprio.
- Tela Agora com a linha do tempo do dia, espiar outros horários e troca automática quando muda o horário.
- Nova folha a partir de mensagem colada, fotos ou digitalização com a câmera, usando a IA do Home Assistant.
- Busca em todas as folhas, sem se importar com acentos.
- Sensor `sensor.memoria_agora` com o bloco e a folha do momento.
- Mesma tipografia e topo dos outros apps (Barlow e Barlow Condensed), tema claro e escuro.
