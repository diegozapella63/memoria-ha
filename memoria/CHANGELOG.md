# Changelog

## 1.1.0

- Leitura por IA igual à do InventarIA, do GerencIA e do EconomIA: usa só a IA configurada no Home Assistant (tarefa de IA) e não guarda chave de API. Saiu a opção da chave do Gemini.
- Novo em **Mais > Leitura por IA**: escolher qual IA usar ("Padrão do Home Assistant" ou uma da lista, com as que só leem texto marcadas), ver se está pronta para ler fotos, **Verificar de novo** e o passo a passo para configurar.
- As fotos ficam em `media/memoria/ia-temp` só durante a leitura.

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
