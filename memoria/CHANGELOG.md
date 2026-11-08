# Changelog

## 1.8.0

- **CorrerIA**, nova chave em **Mais › Configurações › Integrações**: ligada, o WhatsApp, o Claude e o Gemini (pelo app CorrerIA) leem e mudam os seus blocos. Eles veem o resumo dos blocos e das últimas folhas, buscam nas folhas, leem um bloco ou uma folha, criam folhas, acrescentam no fim, editam (o texto, um trecho, os horários ou o bloco), põem links, arrancam folhas, criam e ajustam blocos e criam categorias. O que mudar aparece na hora em todos os aparelhos, do mesmo jeito que se fosse escrito aqui.
- Vem desligada e não depende do **Usar IA** (quem pensa é a IA do CorrerIA, o Claude ou o Gemini). Ligada, o cartão mostra quem usou por último e quando, como "Claude usou hoje às 09:41". Desligada, o acesso deixa de valer na hora.
- **Conversar com a IA**: acrescentar numa folha em branco não deixa mais uma linha vazia no começo.

## 1.7.0

- **Falar e Conversar com a IA**, como no ResolvIA e na CronologIA: os dois botões ficam no alto das telas (e de um bloco).
- **Falar**: toque no microfone e diga a anotação; a fala para texto do Home Assistant transcreve, a IA organiza e você revisa antes de criar a folha (o que foi ouvido aparece em cima). Também em **Nova › Falar**. Sem https, o app explica por que o microfone não abre.
- **Conversar com a IA**: pergunte sobre os blocos, as folhas e a tela em que está, ou sobre qualquer assunto. Se pedir para escrever ("crie uma folha no Diário com…", "acrescente … na folha 2 do Trabalho"), a IA mostra um cartão e só faz quando você toca em **Fazer**. A conversa fica guardada enquanto o app está aberto; **Nova** começa outra. Com o microfone, dá para falar em vez de escrever.
- Em **Mais › Configurações › Integrações**: a chave **Usar IA** (desligada, somem a leitura por IA, as fotos, Falar e Conversar) e **Falar**, para escolher a fala para texto usada pelo app.

## 1.6.0

- **Links nas folhas**: um endereço escrito ou colado numa folha (https://… ou www.…) aparece como uma etiqueta curta com o ícone de link (o nome que você deu, ou o site e o que foi buscado ou o fim do endereço, como "google.com · receita de bolo"), e não mais aquele texto comprido. Tocar na etiqueta abre o link fora do app (no app do Home Assistant, no navegador do celular).
- Tocar no texto da folha abre a escrita bem ali, com o texto de verdade (os endereços inteiros); ao sair, as etiquetas voltam.
- **Adicionar link**, no **⋯** da folha: **Link** e **Nome** (opcional). O link entra no fim da folha; um endereço que não abre (como `javascript:`) é recusado. O Voltar do celular, Cancelar e tocar fora voltam para o ⋯.
- **Buscar** acha o nome e o endereço do link e mostra o nome no resultado. No **Relatório** e no PDF, o link aparece como o nome e o site (na página, dá para tocar); na exportação, o texto continua legível.
- Botões lado a lado nas janelas (como Cancelar e Adicionar) com a mesma largura.

## 1.5.0

- **Categorias dos blocos**: em **Mais › Categorias**, crie categorias (Trabalho, Casa, Estudos…), mude o nome ou a cor e apague (os blocos dela ficam sem categoria; o app pergunta antes). Cada bloco escolhe a sua nos ajustes do bloco, e dá para criar uma **Nova** ali mesmo.
- **Blocos por categoria**: com categorias, a tela Blocos ganha etiquetas no alto (Todos, cada categoria e Sem categoria) para mostrar só os blocos de uma. A escolha fica guardada no aparelho, e um bloco novo criado ali já entra na categoria escolhida. A tela do bloco mostra a categoria dele.
- **Relatório** (linha própria em Mais): os blocos e as folhas, para ver, imprimir ou **Baixar PDF** (funciona também no app do Home Assistant no celular). O cabeçalho é o dos relatórios dos outros apps (o ícone, MemorIA · anotações, quantos blocos e folhas e quando); depois vêm os gráficos por categoria e por bloco e cada bloco com as suas folhas; no fim, a marca da CorrerIA Code, como no Sobre (no PDF, no pé de cada página, com o número da página). Escolha a categoria e o bloco no alto: a escolha volta da próxima vez. A página abre no tema e na cor do app.
- As categorias entram na exportação (a coluna Categoria na planilha e no texto de cada bloco), no backup, nas versões e na importação. **Começar do zero** mantém as categorias.
- Uma confirmação aberta de dentro de outra janela (Apagar categoria, Excluir bloco, Apagar folha, Restaurar versão) volta para ela no Voltar do celular, em Cancelar e ao tocar fora.

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
