# MemorIA

Blocos de anotações que funcionam como um caderno de verdade: folhas com espiral, letra de mão e página que vira com um toque. Cada bloco pode **abrir sozinho** num período do dia ou num horário exato.

## Primeiros passos

1. Depois de instalar, toque em **Iniciar**.
2. Ative **Mostrar na barra lateral** (e, se quiser, **Watchdog**).
3. Abra o **MemorIA** pela barra lateral.

Na primeira vez já existem dois blocos de exemplo, **Diário** (abre à noite) e **Rascunhos** (manhã e tarde). Dá para renomear, mudar ou apagar. Já tem um backup? Em **Mais › Configurações › Dados › Importar**, escolha o `.zip` e tudo volta.

## Escrever e virar a página

- Toque na folha e escreva. Tudo é salvo sozinho enquanto você digita.
- **Borda direita** da folha: vira para a próxima. Na última folha, vira para uma folha nova, já pronta para escrever.
- **Borda esquerda**: volta uma folha. Arrastar o dedo para os lados na folha também vira.
- Folhas deixadas em branco somem sozinhas.
- No **⋯** da folha: horário próprio, mover para outro bloco, **Adicionar link**, copiar o texto ou arrancar a folha (com **Desfazer**).

### Caixas de marcar e emojis

No alto da folha, ao lado do número, ficam **Caixa de marcar** e **Emojis**. Usar os dois não fecha o teclado.

- **Caixa de marcar** transforma a linha onde está o cursor num item com caixa (☐); tocar de novo tira a caixa. Fora da escrita, ela põe um item novo no fim da folha.
- Num item, o **Enter** já faz outro item embaixo. Enter num item vazio acaba a lista.
- Fora da escrita, cada item mostra uma caixa: um toque marca como feito (o texto fica riscado), outro toque desmarca. Tocar no texto abre a escrita, como sempre.
- No **Agora**, marcar vale só para aquela vez do trecho: a folha não muda (em **Blocos** ela aparece como está) e, na próxima vez que o trecho aparecer, as caixas voltam desmarcadas. Serve para listas de todo dia, como as refeições ou os remédios. Fora do Agora, em **Blocos**, marcar grava na folha.
- **Emojis** abre uma fileira de emojis sobre a folha. Cada um entra onde está o cursor; tocar em Emojis de novo fecha a fileira.
- Na folha, a caixa fica guardada como ☐ (a fazer) e ☑ (feito); listas escritas como `[ ]` e `[x]` também viram caixas. No PDF do Relatório, aparecem como [ ] e [x], e os emojis ficam de fora.

### Links

Um endereço escrito ou colado na folha (`https://…` ou `www.…`) aparece como uma etiqueta curta com o ícone de link: o nome que você deu ou, sem nome, o site e o que foi buscado ("google.com · receita de bolo") ou o fim do endereço. Tocar na etiqueta abre o link fora do app (no app do Home Assistant, no navegador do celular). Só abrem endereços `http` e `https`.

Para escrever, toque no texto da folha: a escrita abre bem ali, com os endereços inteiros. Ao sair, as etiquetas voltam.

Em **⋯ › Adicionar link**, cole o **Link** e, se quiser, um **Nome** (por exemplo "Receita da vó"). O link entra no fim da folha, guardado como `[Receita da vó](https://…)`, e aparece com o nome. O Voltar do celular, **Cancelar** e tocar fora voltam para o ⋯.

**Buscar** acha tanto o nome quanto o endereço. No **Relatório** e no PDF, o link aparece como o nome e o site; na exportação, o texto continua legível.

## Abrir sozinho: períodos e horários

Em **Blocos**, abra um bloco e toque na linha **Abre sozinho** (ou no ícone de ajustes). Em **Quando abrir sozinho**:

- **Períodos**: Manhã, Tarde e Noite. O começo de cada um fica em **Mais › Configurações › Opções** (padrão 05:00, 12:00 e 18:00), numa caixa com os horários de meia em meia hora.
- **Horários exatos**: por exemplo Treino às 07:00 e Diário às 22:00. Em **Horário exato** (ou **Outro horário**), escolha a hora e, em seguida, os minutos (de 5 em 5).

Os horários abrem nas janelas do próprio app, sempre em 24 horas (sem AM/PM), e nunca no relógio do celular.

No alto do **Agora** aparece primeiro o que vale agora e, em seguida, os dois próximos horários (depois da meia-noite, os de amanhã). Um toque espia outro horário; **Voltar para agora** volta. O dia inteiro fica em **Blocos › Seu dia**.

**Fica no Agora** diz por quanto tempo um horário vale: **Até o próximo** (o padrão: até começar o próximo horário) ou 1, 2, 3, 4, 6 ou 8 horas. Fica nos ajustes do bloco (embaixo de **Quando abrir sozinho**) e no ⋯ de uma folha com horário. Passado esse tempo, o Agora mostra **Nada agora** até o próximo horário, com os próximos no alto para espiar: a janta das 18:00 com 4 horas some às 22:00, em vez de ficar até a manhã. Enquanto vale, o alto diz até quando ("desde 18:00 até 22:00").

Nos mesmos ajustes ficam o nome, a **categoria**, **de quem é**, a **cor da capa**, o tipo de **folha** (pautada, quadriculada, pontilhada ou lisa), **Arquivar bloco** e o botão de excluir o bloco (as folhas dele vão junto). Para criar outro, toque em **Novo bloco**, no fim da estante.

## De quem é

Nos ajustes do bloco, **De quem é**: **Todos** (o padrão; os blocos de antes ficam assim) ou uma das pessoas da casa, as mesmas de **Configurações › Pessoas** do Home Assistant. Um bloco de uma pessoa só abre sozinho no **Agora** dela, e só aparece no **Seu dia** dela; os de **Todos** aparecem para todo mundo.

O app sabe quem está usando pelo login do Home Assistant: a pessoa ligada àquele usuário. Um login que não é de nenhuma pessoa da casa (um tablet na parede, por exemplo) vê todos os blocos no **Agora**.

No alto da tela **Blocos**, **De quem**: você (os seus blocos e os de **Todos**, como começa), cada pessoa da casa (os dela e os de todos) ou **Todos**, no fim, à direita (todos os blocos, de todo mundo, com "de Ana" na etiqueta da capa). A escolha fica guardada no aparelho, e a tela do bloco também diz de quem é. Se o Home Assistant não responder, dá para escrever o nome da pessoa.


Sem usar o controle por pessoa, desligue **Controle por pessoa** em **Mais › Configurações › Opções**: some o **De quem é** dos blocos e o filtro **De quem**, e todo bloco abre no **Agora** de todos. Ligado de novo, cada bloco volta a ser de quem era.

## Arquivar um bloco

Um bloco que não se usa mais, mas que vale guardar: nos ajustes dele, toque em **Arquivar bloco**. Nada é apagado: o bloco só sai da estante, do **Agora** (não abre mais sozinho), do **Adicionar**, do **Buscar** e da conversa com a IA. Logo depois, **Desfazer** traz de volta.

Os arquivados ficam em **Arquivados**, recolhido no fim da tela **Blocos**, com o número deles; toque para ver e toque num deles para abrir. Ele abre normalmente, com o aviso **Arquivado em …** no alto e o botão **Desarquivar**, que devolve o bloco à estante com tudo como era (inclusive os horários). Nos ajustes, o mesmo lugar vira **Desarquivar bloco**.

## Categorias

Em **Mais › Categorias**, crie categorias para agrupar os blocos (por exemplo Trabalho, Casa e Estudos). Toque numa categoria para mudar o nome ou a cor, ou para apagá-la: os blocos dela ficam sem categoria, e as folhas não mudam. Não dá para ter duas com o mesmo nome.

Nos ajustes do bloco, escolha **Sem categoria**, uma das categorias ou **Nova** (escreva o nome ali mesmo; ela é criada ao salvar o bloco).

À direita da contagem, a escolha rápida entre ver os blocos **em blocos** (as capas) ou **em lista** (uma linha por bloco: a cor, o nome, as folhas, de quem é e quando abre; **Novo bloco** no fim). A escolha fica guardada no aparelho.

Com categorias, a tela **Blocos** mostra etiquetas no alto: **Todos**, cada categoria e **Sem categoria** (quando algum bloco não tem), todas do mesmo tamanho, alinhadas com as de **De quem** (com muitas, a fileira rola para o lado). A escolha fica guardada no aparelho (vale também para os **Arquivados**), e um bloco novo criado com uma categoria escolhida já entra nela. O **Seu dia** continua mostrando todos os horários.

No fim de **Blocos**, o quadro **Seu dia** lista os horários de hoje, com o de agora marcado. Toque num deles para abrir o bloco (ou o trecho).

E uma folha pode ter horário próprio (um "trecho"): no **⋯** da folha, **Mostrar esta folha às…**. Às 10:00, por exemplo, a tela **Agora** abre direto na pauta da reunião.

A tela **Agora** mostra o que vale no momento: o último horário que já começou, contando o dia anterior ("desde ontem às 18:00") até chegar o próximo. Valem os horários dos blocos e os das folhas: uma folha com horário abre o bloco dela mesmo que o bloco não tenha horário. Quando dois coincidem, a folha com horário vem antes do horário do bloco, que vem antes do período. A linha do tempo no topo mostra o dia todo: toque num horário para espiar e em **Voltar para agora** para voltar.

Quando nada seu (nem de **Todos**) tem horário, o Agora não abre um bloco qualquer: ele diz **Nada com horário** e, se houver blocos com horário de outras pessoas, de quem são ("Treino é de Beto: só abre no Agora de Beto"). Na tela de um bloco, a linha **Abre sozinho** mostra os horários dele e as folhas com horário ("folha 3 às 18:00").

Se você estiver escrevendo quando chega a hora de outro bloco, a troca espera o teclado fechar.


Sem usar categorias, desligue **Usar categorias** em **Mais › Configurações › Opções**: somem a categoria do bloco, o filtro em **Blocos** e **Categorias** no **Mais**. Ligado de novo, cada bloco volta à sua categoria.

## Criar folhas de mensagens e fotos

No botão **Adicionar** (o do meio, embaixo):

- **Escrever**: abre uma folha nova no bloco escolhido.
- **Colar mensagem**: cole uma mensagem do WhatsApp, e-mail ou anotação. A IA tira horários, nomes e saudações e deixa como uma anotação limpa. Também dá para usar **Como está**.
- **Escolher fotos**: prints ou fotos da galeria, até 6. No app Android do Home Assistant é uma foto por vez (limitação da versão atual do app); use **Mais fotos** na revisão para juntar outras.
- **Digitalizar com IA**: abre a câmera dentro do MemorIA para fotografar uma anotação em papel, mesmo escrita à mão. Dá para tirar várias páginas e usar a lanterna. Sem https, abre a câmera do próprio celular, uma foto por vez.
- **Novo bloco**: um caderno novo, com nome, cor, papel e horário (o mesmo do **Novo bloco** da tela **Blocos**).

Você revisa e corrige o texto antes de criar a folha.

### IA do Home Assistant

O MemorIA não tem IA própria e não guarda chave de API. Ele usa a ação `ai_task.generate_data` do Home Assistant, então funciona com a integração de IA que você configurar lá, e dá para trocar quando quiser:

| Integração | Observação |
|---|---|
| Anthropic (Claude) | Precisa de chave da API da Anthropic. Lê fotos. |
| OpenAI | Precisa de chave da API da OpenAI. Lê fotos. |
| Google Gemini | Costuma ter uma cota gratuita. Lê fotos. |
| Ollama | Roda um modelo local na sua rede, sem custo e sem mandar nada para fora. Para fotos, use um modelo que entenda imagens (por exemplo `qwen2.5vl` ou `gemma3`). |

Para configurar:

1. Em **Configurações › Dispositivos e serviços › Adicionar integração**, escolha a integração e siga os passos.
2. Na página da integração, adicione uma **tarefa de IA** (AI Task). Para ler fotos, escolha um modelo que entenda imagens.
3. No MemorIA, abra **Mais › Configurações › Integrações** e, em **IA do Home Assistant**, escolha essa IA (a caixa abre uma janela de baixo para cima com as opções; o Voltar do celular, o **X** ou tocar fora fecham sem mudar nada). "Padrão do Home Assistant" usa a IA preferida definida em **Configurações › Sistema › Geral**. Toque em **Verificar de novo** para conferir se ela está pronta.

Na hora da leitura, o app copia a foto por alguns segundos para `media/memoria/ia-temp`, chama a IA pelo Home Assistant e apaga a cópia em seguida.

Sem IA configurada, todo o resto funciona normalmente: a mensagem colada vira uma folha do jeito que está e só a leitura de fotos fica desligada.

## Falar e Conversar com a IA

No alto das telas (e de um bloco) ficam dois botões, como nos outros apps da família:

- **Falar** (o microfone): diga a anotação, por exemplo "Reunião de sexta: levar o orçamento e confirmar o horário com a Ana". Toque de novo (ou em **Pronto**) quando terminar. A **fala para texto do Home Assistant** transcreve (Configurações › Assistentes de voz; com o Home Assistant Cloud ela já vem pronta, em português), a IA organiza como uma anotação e você revisa antes de criar a folha, com o que foi ouvido logo acima. Também em **Nova › Falar**. Até 2 minutos de cada vez.
- **Conversar com a IA** (o balão): pergunte sobre os blocos, as folhas, o que abre agora ou sobre qualquer assunto. Se pedir para escrever ("crie uma folha no Diário com…" ou "acrescente … na folha 2 do Trabalho"), a IA mostra um cartão com o que vai fazer e só faz quando você toca em **Fazer** (ou **Fazer todas**). A conversa fica guardada enquanto o app está aberto; **Nova conversa** começa outra, e o Voltar do celular fecha a conversa. O microfone da conversa manda o que você falar.

O microfone só funciona quando o Home Assistant é aberto por um endereço seguro (https), como o do Home Assistant Cloud ou o seu endereço externo; num endereço http, o app explica em vez de abrir.

Em **Mais › Configurações › Integrações**:

- **Usar IA**: desligada, somem a leitura por IA (Organizar, fotos e Digitalizar), **Falar** e **Conversar**, em todos os aparelhos. Colar mensagem continua, criando a folha do jeito que está.
- **Falar**: mostra se a fala para texto está pronta e deixa escolher qual o app usa (**Automático** usa a do assistente de voz preferido). Não muda o assistente de voz do Home Assistant.
- **Uso da IA**: quantas vezes o app chamou a IA hoje, nos últimos 7 dias e no mês, uma barra por dia (toque para ver o dia), os tipos de chamada (mensagens, fotos, conversa) e as últimas chamadas, com o tempo e os tokens estimados. O Home Assistant não informa o consumo exato: ele fica no painel do provedor da IA.

## Buscar

Em **Buscar**, procure qualquer palavra nas folhas dos blocos, sem se importar com acentos. Logo abaixo da caixa, **De quem** escolhe os blocos (os seus e os de **Todos**, para começar; os de outra pessoa; ou todos), como em **Blocos**, mas com a escolha própria. Cada resultado mostra o trecho com a palavra marcada, o bloco e quando foi escrito; toque para abrir a folha.

Os blocos arquivados ficam de fora. Para procurar neles também, toque em **Incluir arquivados**; eles vêm depois dos outros (os blocos e as folhas), e as escolhas ficam guardadas no aparelho.

Antes de escrever, o **Buscar** já mostra os blocos (os de **De quem**, com a categoria de cada um); escrevendo, ficam os do nome procurado, e as folhas encontradas vêm embaixo. Toque num bloco para abrir.

Para mudar vários blocos de uma vez, como no ResolvIA: toque em **Selecionar** (ou segure o dedo num bloco, que já vem marcado), marque os blocos (**Todos** marca a lista; de novo, **Nenhum**) e toque em **Alterar**, embaixo. A janela tem **Categoria** e **De quem é** (com o controle por pessoa ligado), cada um começando em **Manter**: mude um ou os dois e toque em **Aplicar**. O aviso tem **Desfazer**. O **X** ou o Voltar do celular saem do Selecionar.

## Sensor para painéis e automações

O MemorIA publica `sensor.memoria_agora`:

- **estado**: o nome do bloco do momento (ou `Nenhum`), entre todos os blocos não arquivados, de qualquer pessoa (como no tablet da sala);
- **atributos**: `periodo`, `desde`, `bloco_id`, `pagina_id`, `titulo` (primeira linha da folha), `texto` e `proximo` (ex.: `07:00 Treino`).

Exemplo num cartão Markdown:

```yaml
type: markdown
content: >
  ## {{ states('sensor.memoria_agora') }}
  {{ state_attr('sensor.memoria_agora', 'texto') }}
```

Dá para desligar em **Mais › Configurações › Integrações › Sensores no Home Assistant**. Ali também dá para ligar `sensor.memoria_ia_hoje`, com as chamadas de IA do dia (os erros, os tokens estimados e os tipos nos atributos).

## CorrerIA

O **CorrerIA** é outro app da família: o contato da CorrerIA Code no WhatsApp, que também liga o Claude e o Gemini aos apps da casa. Com ele, dá para pedir "o que eu anotei sobre a reforma?", "acrescenta café na lista do Mercado" ou "cria um bloco Receitas na categoria Casa".

1. Aqui, em **Mais › Configurações › Integrações › CorrerIA**, ligue **Usar com o CorrerIA**. Vem desligado e não depende do **Usar IA**: quem pensa é a IA do CorrerIA, o Claude ou o Gemini.
2. No app **CorrerIA**, conecte o WhatsApp, o Claude ou o Gemini (o passo a passo está na documentação dele).

O que eles podem fazer: ver o resumo (os blocos, de quem é cada um, as últimas folhas e o bloco do momento de quem pergunta, como no Agora dela), buscar nas folhas (sem se importar com acentos, também num bloco, numa categoria ou num período), ler um bloco ou uma folha, criar uma folha, acrescentar no fim de uma folha, editar (o texto inteiro, um trecho, os horários ou mover para outro bloco), adicionar um link, arrancar uma folha, criar e ajustar blocos (nome, categoria, de quem é, cor, papel, quando abre sozinho, arquivar e desarquivar) e criar categorias. Fotos, arquivos, backups e configurações ficam de fora. O que mudar aparece na hora em todos os aparelhos.

Os blocos arquivados ficam fora do resumo e da busca, a não ser que eles peçam, e dá para ler um arquivado pelo nome. As folhas de um bloco arquivado não mudam até ele ser desarquivado.

Ligado, o cartão mostra quem usou por último e quando ("Claude usou hoje às 09:41"). Desligado, o acesso deixa de valer na hora. O CorrerIA acha o MemorIA pelo arquivo `share/memoria/correria.json`, com uma chave de acesso própria, que só existe enquanto a chave está ligada.

## CronologIA

O **CronologIA** (o calendário da família) pode mostrar no **Agora** dele a folha do MemorIA que vale agora, de quem está usando, como no **Agora** daqui: pelo relógio do celular de quem olha (mesmo viajando, em outro fuso), no mesmo papel e com a mesma letra. Ligue lá, em **Mais › Configurações › Integrações › MemorIA**. Aqui não há nada para ligar: o CronologIA acha o MemorIA pelo arquivo `share/memoria/integracao.json`, com uma chave de acesso própria, e só lê.

## Relatório

Em **Mais › Relatório de anotações**, os blocos e as folhas escritas numa página para ver, imprimir ou salvar:

- no alto, a **categoria** e o **bloco** (só os da categoria escolhida); a escolha volta da próxima vez que o relatório abrir. Os blocos arquivados ficam fora de "Todos os blocos", mas aparecem no fim da lista, em **Arquivados (N)**, para escolher um deles;
- **Voltar** e **Baixar PDF** lado a lado. O PDF (`anotacoes-AAAA-MM-DD.pdf`, com o nome do bloco ou da categoria quando filtrado) é feito pelo próprio app e funciona também no app do Home Assistant no celular, que não imprime páginas;
- o cabeçalho, igual ao dos relatórios dos outros apps da família: o ícone, **MemorIA · anotações**, quantos blocos e folhas e quando foi gerado;
- os gráficos **Por categoria** e **Por bloco** (quantas folhas em cada), quando há mais de um;
- cada bloco com a categoria, de quem é, quantas folhas e quando abre sozinho, e cada folha com o número, o dia em que foi escrita, o horário próprio (se tiver) e o texto;
- no fim, a marca da **CorrerIA Code**, como no **Sobre** (no PDF, no pé de cada página, com o número da página).

A página abre no tema e na cor do app; o PDF e o papel são sempre brancos.

## Dados e backup

- Blocos, folhas e ajustes ficam em `/data/memoria.json` dentro do app e entram nos backups do Home Assistant.
- Tudo sincroniza na hora entre os aparelhos abertos. Se a mesma folha for editada em dois aparelhos ao mesmo tempo, nada se perde: a sua versão vira uma folha nova.

Em **Mais › Configurações › Dados**:

- **Exportar**: **Tudo (ZIP)** com o `memoria.json`, uma planilha e um arquivo de texto (Markdown) por bloco; **Planilha (CSV)**, que abre no Excel (separado por ponto e vírgula, com a categoria, de quem é e quando foi arquivado cada bloco); e **Dados completos (JSON)**.
- **Backup na pasta share**: **Criar backup** salva um `.zip` em `share/memoria`, que você acessa pela rede (por exemplo `\\homeassistant.local\share\memoria` com o app Samba). Os backups da pasta aparecem logo abaixo, com **Restaurar**.
- **Importar**: traz os blocos e folhas de um `.zip` ou `.json` exportado pelo app (também funciona pelo celular).
- **Versões anteriores**: o app guarda sozinho uma cópia a cada 10 minutos de uso (as 60 mais recentes) em `/data/versoes`. Toque em **Restaurar** para voltar a uma delas.
- **Onde ficam os dados**: os blocos, as folhas e os ajustes em `/data/memoria.json`, que entra no backup do Home Assistant; as versões em `/data/versoes`.
- **Começar do zero**: apaga todos os blocos e folhas; os ajustes e as categorias continuam.

Antes de importar, restaurar ou apagar, o app sempre guarda uma cópia do que existe naquele momento em **Versões anteriores**. Importar e restaurar trocam os blocos (com de quem é cada um e os arquivados), as categorias, as folhas e os períodos do dia; a IA escolhida e o CorrerIA continuam os deste Home Assistant. Um backup de antes da 1.9.0 volta com todos os blocos de **Todos** e nenhum arquivado.

## Aparência

Em **Mais › Configurações › Aparência**:

- **Tema**: **Sistema** segue o claro ou escuro do Home Assistant (e, fora dele, o do celular) e troca na hora, com o app aberto, quando o modo muda. **Claro** e **Escuro** ficam fixos. Cada aparelho guarda a sua escolha.
- **Cor do app**: com **Cor do dia** ligada (o padrão), a cor muda sozinha todo dia, passando pelas 11 cores da paleta (sem o Grafite), a mesma cor do dia em todos os apps da família; é a mesma em todos os aparelhos e troca à meia-noite mesmo com o app aberto. Tocar numa cor desliga a Cor do dia e fica com ela. As 12 cores são as mesmas em todos os apps: Vermelho, Coral, Laranja, Ouro, Verde, Menta, Turquesa, Azul, Índigo, Lilás, Rosa e Grafite (as capas e as categorias usam as mesmas; uma Framboesa de antes virou Rosa). Dentro de um bloco, vale a cor da capa dele.
- **Letra de mão**: ligada, as folhas são escritas como num caderno de verdade; desligada, com a letra comum.

## Mais

O **Mais** é um menu, como nos outros apps da família: **Categorias**, **Relatório de anotações**, **Configurações** e, por último, **Sobre**. Cada linha abre a sua tela. **Configurações** tem as abas **Integrações** (CorrerIA, IA do Home Assistant, Falar, Uso da IA e Sensores), **Dados**, **Aparência** e **Opções** (os períodos do dia); a aba escolhida fica guardada. O Voltar do celular, o **‹ Mais** no alto e arrastar o dedo para a direita voltam ao menu.

Embaixo ficam **Agora**, **Buscar**, **Adicionar** (o do meio), **Blocos** e **Mais** (os três pontos), na ordem dos outros apps. Arrastar o dedo para os lados (fora da folha) troca de aba, nessa ordem. Na folha, arrastar continua virando a página; dentro de um bloco, arrastar para a direita volta.

## Sobre

Em **Mais › Sobre**, a última linha do Mais: quem faz o app (**CorrerIA Code**), os outros apps da família, cada um com uma linha e o link para o GitHub, e **Meu GitHub**. O Voltar do celular e o **‹ Mais** voltam para o Mais.
