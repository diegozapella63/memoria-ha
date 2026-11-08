# MemorIA

Blocos de anotações que funcionam como um caderno de verdade: folhas com espiral, letra de mão e página que vira com um toque. Cada bloco pode **abrir sozinho** num período do dia ou num horário exato.

## Primeiros passos

1. Depois de instalar, toque em **Iniciar**.
2. Ative **Mostrar na barra lateral** (e, se quiser, **Watchdog**).
3. Abra o **MemorIA** pela barra lateral.

Na primeira vez já existem dois blocos de exemplo, **Diário** (abre à noite) e **Rascunhos** (manhã e tarde). Dá para renomear, mudar ou excluir. Já tem um backup? Em **Mais › Configurações › Dados › Importar**, escolha o `.zip` e tudo volta.

## Escrever e virar a página

- Toque na folha e escreva. Tudo é salvo sozinho enquanto você digita.
- **Borda direita** da folha: vira para a próxima. Na última folha, vira para uma folha nova, já pronta para escrever.
- **Borda esquerda**: volta uma folha. Arrastar o dedo para os lados na folha também vira.
- Folhas deixadas em branco somem sozinhas.
- No **⋯** da folha: horário próprio, mover para outro bloco, copiar o texto ou arrancar a folha (com **Desfazer**).

## Abrir sozinho: períodos e horários

Em **Blocos**, abra um bloco e toque na linha **Abre sozinho** (ou no ícone de ajustes). Em **Quando abrir sozinho**:

- **Períodos**: Manhã, Tarde e Noite. O começo de cada um fica em **Mais › Configurações › Opções** (padrão 05:00, 12:00 e 18:00).
- **Horários exatos**: por exemplo Treino às 07:00 e Diário às 22:00.

Nos mesmos ajustes ficam o nome, a **categoria**, a **cor da capa**, o tipo de **folha** (pautada, quadriculada, pontilhada ou lisa) e o botão de excluir o bloco (as folhas dele vão junto). Para criar outro, toque em **Novo bloco**, no fim da estante.

## Categorias

Em **Mais › Categorias**, crie categorias para agrupar os blocos (por exemplo Trabalho, Casa e Estudos). Toque numa categoria para mudar o nome ou a cor, ou para apagá-la: os blocos dela ficam sem categoria, e as folhas não mudam. Não dá para ter duas com o mesmo nome.

Nos ajustes do bloco, escolha **Sem categoria**, uma das categorias ou **Nova** (escreva o nome ali mesmo; ela é criada ao salvar o bloco).

Com categorias, a tela **Blocos** mostra etiquetas no alto: **Todos**, cada categoria e **Sem categoria** (quando algum bloco não tem). A escolha fica guardada no aparelho, e um bloco novo criado com uma categoria escolhida já entra nela. O **Seu dia** continua mostrando todos os horários.

No fim de **Blocos**, o quadro **Seu dia** lista os horários de hoje, com o de agora marcado. Toque num deles para abrir o bloco (ou o trecho).

E uma folha pode ter horário próprio (um "trecho"): no **⋯** da folha, **Mostrar esta folha às…**. Às 10:00, por exemplo, a tela **Agora** abre direto na pauta da reunião.

A tela **Agora** mostra o que vale no momento: o último horário que já começou, contando o dia anterior depois da meia-noite. Quando dois coincidem, a folha com horário vem antes do horário do bloco, que vem antes do período. A linha do tempo no topo mostra o dia todo: toque num horário para espiar e em **Voltar para agora** para voltar.

Se você estiver escrevendo quando chega a hora de outro bloco, a troca espera o teclado fechar.

## Criar folhas de mensagens e fotos

No botão **Nova**:

- **Escrever**: abre uma folha nova no bloco escolhido.
- **Colar mensagem**: cole uma mensagem do WhatsApp, e-mail ou anotação. A IA tira horários, nomes e saudações e deixa como uma anotação limpa. Também dá para usar **Como está**.
- **Escolher fotos**: prints ou fotos da galeria, até 6. No app Android do Home Assistant é uma foto por vez (limitação da versão atual do app); use **Mais fotos** na revisão para juntar outras.
- **Digitalizar com IA**: abre a câmera dentro do MemorIA para fotografar uma anotação em papel, mesmo escrita à mão. Dá para tirar várias páginas e usar a lanterna. Sem https, abre a câmera do próprio celular, uma foto por vez.

Você revisa e corrige o texto antes de criar a folha.

### Leitura por IA

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
3. No MemorIA, abra **Mais › Configurações › Integrações** e, em **Leitura por IA**, escolha essa IA (a caixa abre uma janela de baixo para cima com as opções; o Voltar do celular, o **X** ou tocar fora fecham sem mudar nada). "Padrão do Home Assistant" usa a IA preferida definida em **Configurações › Sistema › Geral**. Toque em **Verificar de novo** para conferir se ela está pronta.

Na hora da leitura, o app copia a foto por alguns segundos para `media/memoria/ia-temp`, chama a IA pelo Home Assistant e apaga a cópia em seguida.

Sem IA configurada, todo o resto funciona normalmente: a mensagem colada vira uma folha do jeito que está e só a leitura de fotos fica desligada.

## Buscar

Em **Buscar**, procure qualquer palavra em todas as folhas de todos os blocos, sem se importar com acentos. Cada resultado mostra o trecho com a palavra marcada, o bloco e quando foi escrito; toque para abrir a folha.

## Sensor para painéis e automações

O MemorIA publica `sensor.memoria_agora`:

- **estado**: o nome do bloco do momento (ou `Nenhum`);
- **atributos**: `periodo`, `desde`, `bloco_id`, `pagina_id`, `titulo` (primeira linha da folha), `texto` e `proximo` (ex.: `07:00 Treino`).

Exemplo num cartão Markdown:

```yaml
type: markdown
content: >
  ## {{ states('sensor.memoria_agora') }}
  {{ state_attr('sensor.memoria_agora', 'texto') }}
```

Dá para desligar em **Mais › Configurações › Integrações › Sensor no Home Assistant**.

## Relatório

Em **Mais › Relatório**, os blocos e as folhas escritas numa página para ver, imprimir ou salvar:

- no alto, a **categoria** e o **bloco** (só os da categoria escolhida); a escolha volta da próxima vez que o relatório abrir;
- **Voltar** e **Baixar PDF** lado a lado. O PDF (`anotacoes-AAAA-MM-DD.pdf`, com o nome do bloco ou da categoria quando filtrado) é feito pelo próprio app e funciona também no app do Home Assistant no celular, que não imprime páginas;
- o cabeçalho, igual ao dos relatórios dos outros apps da família: o ícone, **MemorIA · anotações**, quantos blocos e folhas e quando foi gerado;
- os gráficos **Por categoria** e **Por bloco** (quantas folhas em cada), quando há mais de um;
- cada bloco com a categoria, quantas folhas e quando abre sozinho, e cada folha com o número, o dia em que foi escrita, o horário próprio (se tiver) e o texto;
- no fim, a marca da **CorrerIA Code**, como no **Sobre** (no PDF, no pé de cada página, com o número da página).

A página abre no tema e na cor do app; o PDF e o papel são sempre brancos.

## Dados e backup

- Blocos, folhas e ajustes ficam em `/data/memoria.json` dentro do app e entram nos backups do Home Assistant.
- Tudo sincroniza na hora entre os aparelhos abertos. Se a mesma folha for editada em dois aparelhos ao mesmo tempo, nada se perde: a sua versão vira uma folha nova.

Em **Mais › Configurações › Dados**:

- **Exportar**: **Tudo (ZIP)** com o `memoria.json`, uma planilha e um arquivo de texto (Markdown) por bloco; **Planilha (CSV)**, que abre no Excel (separado por ponto e vírgula, com a categoria de cada bloco); e **Dados completos (JSON)**.
- **Backup na pasta share**: **Criar backup** salva um `.zip` em `share/memoria`, que você acessa pela rede (por exemplo `\\homeassistant.local\share\memoria` com o app Samba). Os backups da pasta aparecem logo abaixo, com **Restaurar**.
- **Importar**: traz os blocos e folhas de um `.zip` ou `.json` exportado pelo app (também funciona pelo celular).
- **Versões anteriores**: o app guarda sozinho uma cópia a cada 10 minutos de uso (as 60 mais recentes) em `/data/versoes`. Toque em **Restaurar** para voltar a uma delas.
- **Começar do zero**: apaga todos os blocos e folhas; os ajustes e as categorias continuam.

Antes de importar, restaurar ou apagar, o app sempre guarda uma cópia do que existe naquele momento em **Versões anteriores**. Importar e restaurar trocam os blocos, as categorias, as folhas e os períodos do dia; a IA escolhida continua a deste Home Assistant.

## Aparência

Em **Mais › Configurações › Aparência**:

- **Tema**: **Automático** segue o claro ou escuro do Home Assistant (e, fora dele, o do celular) e troca na hora, com o app aberto, quando o modo muda. **Claro** e **Escuro** ficam fixos. Cada aparelho guarda a sua escolha.
- **Cor do app**: com **Cor do dia** ligada (o padrão), a cor muda sozinha todo dia, passando pelas cores (sem o Grafite); é a mesma em todos os aparelhos e troca à meia-noite mesmo com o app aberto. Tocar numa cor desliga a Cor do dia e fica com ela. Dentro de um bloco, vale a cor da capa dele.
- **Letra de mão**: ligada, as folhas são escritas como num caderno de verdade; desligada, com a letra comum.

## Mais

O **Mais** é um menu, como nos outros apps da família: **Categorias**, **Relatório**, **Configurações** e, por último, **Sobre**. Cada linha abre a sua tela. **Configurações** tem as abas **Integrações** (Leitura por IA e o sensor), **Dados**, **Aparência** e **Opções** (os períodos do dia); a aba escolhida fica guardada. O Voltar do celular, o **‹ Mais** no alto e arrastar o dedo para a direita voltam ao menu.

Arrastar o dedo para os lados (fora da folha) troca de aba: **Agora**, **Blocos**, **Buscar** e **Mais**. Na folha, arrastar continua virando a página; dentro de um bloco, arrastar para a direita volta.

## Sobre

Em **Mais › Sobre**, a última linha do Mais: quem faz o app (**CorrerIA Code**), os outros apps da família, cada um com uma linha e o link para o GitHub, e **Meu GitHub**. O Voltar do celular e o **‹ Mais** voltam para o Mais.
