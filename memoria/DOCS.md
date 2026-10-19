# MemorIA

Blocos de anotações que funcionam como um caderno de verdade: folhas com espiral, letra de mão e página que vira com um toque. Cada bloco pode **abrir sozinho** num período do dia ou num horário exato.

## Primeiros passos

1. Depois de instalar, toque em **Iniciar**.
2. Ative **Mostrar na barra lateral** (e, se quiser, **Watchdog**).
3. Abra o **MemorIA** pela barra lateral.

Na primeira vez já existem dois blocos de exemplo, **Diário** (abre à noite) e **Rascunhos** (manhã e tarde). Dá para renomear, mudar ou excluir.

## Escrever e virar a página

- Toque na folha e escreva. Tudo é salvo sozinho enquanto você digita.
- **Borda direita** da folha: vira para a próxima. Na última folha, vira para uma folha nova, já pronta para escrever.
- **Borda esquerda**: volta uma folha. Arrastar o dedo para os lados também vira.
- Folhas deixadas em branco somem sozinhas.
- No **⋯** da folha: horário próprio, mover para outro bloco, copiar o texto ou arrancar a folha (com **Desfazer**).

## Abrir sozinho: períodos e horários

Em **Blocos**, abra um bloco e toque em **Abre sozinho** (ou no ícone de ajustes):

- **Períodos**: Manhã, Tarde e Noite. O começo de cada um fica em **Mais → Períodos do dia** (padrão 05:00, 12:00 e 18:00).
- **Horários exatos**: por exemplo Treino às 07:00 e Diário às 22:00.

E uma folha pode ter horário próprio (um "trecho"): no **⋯** da folha, **Mostrar esta folha às…**. Às 10:00, por exemplo, a tela **Agora** abre direto na pauta da reunião.

A tela **Agora** mostra o que vale no momento: o último horário que já começou, contando o dia anterior depois da meia-noite. Quando dois coincidem, a folha com horário vem antes do horário do bloco, que vem antes do período. A linha do tempo no topo mostra o dia todo: toque num horário para espiar e em **Voltar para agora** para voltar.

Se você estiver escrevendo quando chega a hora de outro bloco, a troca espera o teclado fechar.

## Criar folhas de mensagens e fotos

No botão **Nova**:

- **Escrever**: abre uma folha nova no bloco escolhido.
- **Colar mensagem**: cole uma mensagem do WhatsApp, e-mail ou anotação. A IA tira horários, nomes e saudações e deixa como uma anotação limpa. Também dá para usar **Como está**.
- **Escolher fotos**: prints ou fotos da galeria. No app Android do Home Assistant é uma foto por vez (limitação da versão atual do app); use **Mais fotos** na revisão para juntar outras.
- **Digitalizar com IA**: abre a câmera dentro do MemorIA para fotografar uma anotação em papel, mesmo escrita à mão. Dá para tirar várias páginas e usar a lanterna.

Você revisa e corrige o texto antes de criar a folha.

### Qual IA é usada

1. **A IA do seu Home Assistant** (AI Task), se houver uma integração de IA com tarefa de IA, como Google Gemini ou OpenAI. Não precisa de chave nova. As fotos ficam por alguns segundos em `/media/memoria/` para a IA ler e são apagadas em seguida.
2. Se o HA não tiver isso, uma **chave da API do Gemini** colocada na aba **Configuração** do app.
3. Sem nenhuma das duas, a mensagem colada vira uma folha do jeito que está e a leitura de fotos fica desativada.

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

Dá para desligar em **Mais → Home Assistant**.

## Onde ficam os dados

- Blocos, folhas e ajustes ficam em `/data/memoria.json` dentro do app e entram no backup do Home Assistant.
- Tudo sincroniza na hora entre os aparelhos abertos. Se a mesma folha for editada em dois aparelhos ao mesmo tempo, nada se perde: a sua versão vira uma folha nova.
- O tema (automático, claro ou escuro) é escolhido por aparelho.
