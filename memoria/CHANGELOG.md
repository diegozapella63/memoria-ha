# Mudanças

## 1.19.1

- **Tema**: **Automático** agora se chama **Sistema** (segue o claro ou escuro do Home Assistant, como antes). O nome cabe ao lado do ícone e é o mesmo em todos os apps da família.

## 1.19.0

- **Uma altura só**: botões, campos, caixas de seleção, botões de escolha (as abas de Configurações, o Tema) e as escolhas em botões têm a mesma altura, a mesma de todos os apps da família. O **Restaurar** das versões, os horários do Agora e o **Escrever** do Adicionar também. O Tema ficou com o ícone ao lado do nome.

## 1.18.0

- **Mais › Configurações › Dados**: os botões no padrão dos outros apps da família: na largura do cartão no celular, da mesma altura.
- O CorrerIA e o Relatório em PDF usam o mesmo código do ResolvIA e do CronologIA (nada muda na tela).

## 1.17.1

- Nada muda na tela: a versão do app passa a ficar num lugar só, e o servidor ganhou mais testes (a conexão com o Home Assistant, os dados, os backups e as versões).

## 1.17.0

O MemorIA fica igual aos outros apps da família:

- **Barra de baixo**: **Agora**, **Buscar**, **Adicionar** (o botão do meio, que antes se chamava Nova), **Blocos** e **Mais**, agora com os três pontos.
- **Mais › Relatório de anotações** (antes só Relatório).
- **Mais › Configurações › Integrações** na ordem dos outros apps: **CorrerIA**, **IA do Home Assistant** (antes Leitura por IA), **Falar**, **Uso da IA** e **Sensores no Home Assistant**.
- **Uso da IA**, novo: quantas vezes o app chamou a IA hoje, em 7 dias e no mês, uma barra por dia, os tipos de chamada e as últimas chamadas, com os tokens estimados. Em **Sensores**, dá para ligar `sensor.memoria_ia_hoje`.
- **Dados**: **Onde ficam os dados**, antes de **Começar do zero**.
- **Cores**: as 12 cores da família, com os mesmos nomes em todos os apps (Vermelho, Coral, Laranja, Ouro, Verde, Menta, Turquesa, Azul, Índigo, Lilás, Rosa e Grafite). A **Cor do dia** é a mesma em todos os apps. Um bloco ou uma categoria em Framboesa passa a Rosa.
- **Conversa**: **Nova conversa** no lugar de Nova.
- **Apagar bloco** (antes Excluir) e **Arquivados (2)**, com a contagem entre parênteses, como nos outros apps.

## 1.16.0

- **Horários no visual do app**: nada mais do relógio do celular nem de AM/PM.
  - **Mais › Configurações › Opções › Períodos do dia**: o começo da Manhã, da Tarde e da Noite fica numa caixa igual às outras do app, com os horários de meia em meia hora e o atual marcado.
  - **Horário exato** (nos ajustes do bloco) e **Escolher horário** (no ⋯ da folha): escolha a hora e, logo em seguida, os minutos (de 5 em 5), nas janelas do app. O X ou o Voltar do celular desistem sem mudar nada.
- **Buscar** com **Incluir arquivados**: os blocos arquivados e as folhas deles vêm depois dos outros.
- **Relatório**: na escolha do bloco, os arquivados ficam no fim, em **Arquivados (N)**. As caixas de escolha do alto têm a mesma seta das caixas do app.

## 1.15.1

- **CronologIA**: a folha de agora que ele mostra é a mesma do **Agora** daqui, pelo relógio do celular de quem olha (antes valia o relógio do Home Assistant, e em outro fuso podia dizer "nada agora"). Ele também recebe o papel do bloco e se a folha é em letra de mão, para desenhar a folha igual.

## 1.15.0

- **Buscar** já mostra os blocos antes de escrever, com a categoria de cada um. Escrevendo, ficam os do nome procurado, e as folhas vêm embaixo.
- **Selecionar** no Buscar, como no ResolvIA: toque em **Selecionar** (ou segure o dedo num bloco), marque vários e toque em **Alterar**. Dá para mudar a **Categoria** e **De quem é** de todos de uma vez; cada campo começa em **Manter**. O aviso tem **Desfazer**.
- **Nova** (+) tem **Novo bloco**.

## 1.14.0

- **Fica no Agora**: escolha por quanto tempo um horário vale (**Até o próximo**, como antes, ou 1, 2, 3, 4, 6 ou 8 horas), nos ajustes do bloco e no ⋯ da folha com horário. Passado o tempo, o Agora mostra **Nada agora** até o próximo horário. A janta das 18:00 não fica mais até de manhã.
- **Marcar no Agora**: as caixas marcadas no Agora valem só para aquela vez do trecho. A folha não muda e, na próxima vez que o trecho aparecer, as caixas voltam desmarcadas. Em **Blocos**, marcar continua gravando na folha.
- **Blocos**: os botões de **De quem** e das categorias, no alto, ficam todos do mesmo tamanho e alinhados.
- **CronologIA**: o cartão do MemorIA mostra as caixas marcadas no Agora e some quando o tempo do trecho acaba.

## 1.13.0

- **Agora**: a fileira de horários do alto começa pelo que vale agora; depois vêm os dois próximos (passando da meia-noite, os de amanhã). Os horários que já passaram hoje não aparecem mais antes. O dia inteiro continua em **Blocos › Seu dia**.
- **CronologIA**: com o CronologIA atualizado e a opção ligada lá (**Mais › Configurações › Integrações › MemorIA**), o **Agora** dele mostra o trecho do MemorIA que vale agora e os dois próximos.

## 1.12.0

- **Caixa de marcar**, no alto da folha: transforma a linha do cursor num item com caixa (☐). Num item, o Enter já faz o próximo; Enter num item vazio acaba a lista. Fora da escrita, um toque na caixa marca como feito (o texto fica riscado) e outro toque desmarca.
- **Emojis**, também no alto da folha: abre uma fileira de emojis, e cada um entra onde está o cursor, sem fechar o teclado.
- No PDF do Relatório, as caixas aparecem como [ ] e [x].
- **De quem** (em **Blocos** e no **Buscar**): os botões das pessoas e o **Todos** ficam do mesmo tamanho, lado a lado. No **Buscar**, **Incluir arquivados** fica embaixo, com a largura toda, alinhado com eles.

## 1.11.3

- O filtro **De quem**, em **Blocos** e no **Buscar**, volta a dizer **Todos**, no fim da fileira, à direita.

## 1.11.2

- **Mais › Sobre**: a CorrerIA agora é descrita como o chat com todos os apps (pergunte e peça, também pelo WhatsApp).

## 1.11.1

- **Mais › Sobre**: a **CorrerIA** (o contato no WhatsApp) entra na lista dos apps.

## 1.11.0

- **Mais › Configurações › Opções › Blocos**: **Usar categorias** e **Controle por pessoa**, ligados de início.
  - **Usar categorias** desligado: some a categoria do bloco, o filtro em **Blocos** e **Categorias** no **Mais**.
  - **Controle por pessoa** desligado: some o **De quem é** do bloco e o filtro **De quem** (em **Blocos** e no **Buscar**), e todo bloco abre no **Agora** de todos.
  - Nada se perde: ligado de novo, as categorias e os donos voltam como estavam.
- O filtro **De quem** mostra **Todas as pessoas** no lugar de **Todos**, para não confundir com o **Todos** das categorias.

## 1.10.1

- **Agora**: quando nada seu tem horário, o Agora não abre mais um bloco qualquer como se fosse "o da tarde". Ele diz **Nada com horário**, como escolher um horário e, se for o caso, de quem são os blocos com horário (por exemplo "Treino é de Beto: só abre no Agora de Beto").
- Uma **folha com horário** abre o bloco no Agora de quem é dono dele, mesmo que o bloco não tenha horário. Com um horário só, o Agora mostra "desde ontem às 18:00" antes da hora, sem repetir o mesmo bloco em "depois".
- Na tela do bloco, a linha **Abre sozinho** agora conta as folhas com horário ("folha 3 às 18:00") e diz quando o bloco só abre no Agora de outra pessoa.
- **Botões do mesmo tamanho**, como nos outros apps: nos ajustes do bloco, **Categoria**, **De quem é** e **Manhã, Tarde e Noite** (lado a lado, com o horário embaixo) viram uma grade de botões iguais; na **Nova** e no ⋯ da folha, os blocos também. Nome comprido passa para a segunda linha dentro do botão.
- **Nome do bloco** na tela dele: fica numa linha só dele, embaixo dos botões, com a largura toda, e nunca quebra no meio de uma palavra; uma palavra que não cabe fica com a letra menor. O mesmo para o nome do bloco no Agora.

## 1.10.0

- **Blocos em lista**: no alto da tela **Blocos**, à direita da contagem, a escolha rápida entre as capas e uma lista (uma linha por bloco, com a cor, o nome, as folhas, de quem é e quando abre). A escolha fica guardada no aparelho.
- **De quem**, no alto de **Blocos**: você (os seus blocos e os de **Todos**), cada pessoa da casa (os dela e os de todos) ou **Todos** (todos os blocos). Começa nos seus.
- **Buscar**: o mesmo **De quem** (com a sua escolha, começando nos seus) e **Incluir arquivados** sempre à vista.

## 1.9.0

- **Arquivar bloco**, nos ajustes do bloco: o bloco sai da estante, do **Agora** (não abre mais sozinho), da **Nova**, do **Buscar** e da conversa com a IA, sem apagar nada. Ele fica em **Arquivados**, recolhido no fim da tela **Blocos**: toque para ver e abrir. Logo depois de arquivar, **Desfazer** traz de volta.
- Um bloco arquivado abre normalmente pela lista, com o aviso **Arquivado em …** e o botão **Desarquivar** no alto. Nos ajustes, **Desarquivar bloco**.
- **Buscar**: com blocos arquivados, a etiqueta **Incluir arquivados** procura neles também (a escolha fica guardada no aparelho).
- **De quem é**, nos ajustes do bloco: **Todos** (o padrão, e como ficam os blocos de antes) ou uma pessoa da casa, as do Home Assistant. Um bloco de uma pessoa só abre sozinho no **Agora** (e no **Seu dia**) dela; quem não é uma pessoa da casa, como um tablet da sala, vê todos. A tela **Blocos** continua mostrando todos, com "de Beto" na etiqueta da capa e na tela do bloco.
- No **Relatório**, os arquivados ficam fora de "Todos os blocos", mas dá para escolher um deles no alto; cada bloco mostra de quem é. Na exportação, a planilha ganha as colunas **De quem é** e **Arquivado em**, e o texto de cada bloco também diz. Backup, versões e importar guardam as duas coisas.
- **CorrerIA**: o resumo e a busca deixam os arquivados de fora (a não ser que peçam), e as folhas de um bloco arquivado só mudam depois de desarquivar. Eles também arquivam e desarquivam blocos, dizem de quem é cada um, e o bloco do momento do resumo é o de quem pergunta.

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
