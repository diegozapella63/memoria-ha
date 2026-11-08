// Conversa com a IA (memoria/rootfs/app/lib/chat.js): what goes to the AI and what its actions may do.
import { test } from "node:test";
import assert from "node:assert/strict";
import { cleanChat, chatInstructions, parseChatActions, replyOf, MAX_ACTIONS } from "../memoria/rootfs/app/lib/chat.js";

const ctx = () => ({
  tela: 'o bloco "Mercado", na folha 2 de 2',
  agora: 'manhã; o bloco do momento é "Mercado"',
  blocos: [
    { id: "ideias00001", nome: "Ideias soltas", categoria: "", abre: "", aberto: false, total: 1, folhas: [{ n: 1, titulo: "Viagem de férias", texto: "Viagem de férias\nPraia ou serra?", escrita: "2026-11-01" }] },
    { id: "mercado0001", nome: "Mercado", categoria: "Casa", abre: "abre manhã (05:00)", aberto: true, total: 2, folhas: [{ n: 1, titulo: "Lista da semana", texto: "Lista da semana\n- Arroz\n- Café", escrita: "2026-11-05" }, { n: 2, titulo: "Churrasco do Beto", texto: "Churrasco do Beto\nCarvão", escrita: "2026-11-07", horarios: "09:00" }] },
  ],
});

test("cleanChat: the last turns, the open block first, ids checked", () => {
  const raw = {
    messages: [{ role: "user", text: "oi" }, { role: "ia", text: "olá" }, { role: "sistema", text: "x" }, { role: "user", text: "  " }, ...Array.from({ length: 20 }, (_, i) => ({ role: "user", text: `m${i}` }))],
    context: { ...ctx(), blocos: [...ctx().blocos, { id: "!", nome: "Ruim" }, null] },
  };
  const c = cleanChat(raw);
  assert.equal(c.messages.length, 16);
  assert.equal(c.messages.at(-1).text, "m19");
  assert.deepEqual(c.context.blocos.map((b) => b.nome), ["Mercado", "Ideias soltas"]);
  assert.equal(c.context.blocos[0].folhas[1].horarios, "09:00");
  assert.equal(c.context.blocos[0].categoria, "Casa");
  assert.deepEqual(cleanChat(null), { messages: [], context: { tela: "", agora: "", blocos: [] } });
});

test("cleanChat: a budget of text (more for the open block)", () => {
  const long = "x".repeat(5000);
  const c = cleanChat({ messages: [], context: { blocos: [{ id: "abertoo001", nome: "A", aberto: true, folhas: [{ n: 1, titulo: "t", texto: long }] }, { id: "outrooo001", nome: "B", folhas: [{ n: 1, titulo: "t", texto: long }] }] } });
  assert.equal(c.context.blocos[0].folhas[0].texto.length, 2000);
  assert.equal(c.context.blocos[1].folhas[0].texto.length, 400);
  const many = cleanChat({ messages: [], context: { blocos: Array.from({ length: 60 }, (_, i) => ({ id: `bloco${String(i).padStart(5, "0")}`, nome: `B${i}`, folhas: Array.from({ length: 10 }, (_, k) => ({ n: k + 1, titulo: `F${k}`, texto: "y".repeat(400) })) })) } });
  assert.equal(many.context.blocos.length, 40);
  const sheets = many.context.blocos.reduce((n, b) => n + b.folhas.length, 0);
  const chars = many.context.blocos.reduce((n, b) => n + b.folhas.reduce((m, f) => m + f.texto.length, 0), 0);
  assert.ok(sheets <= 160 && chars <= 24000, `${sheets} sheets, ${chars} chars`);
});

test("chatInstructions: today, the screen, the blocks with their sheets and the conversation", () => {
  const c = cleanChat({ messages: [{ role: "user", text: "O que tem no mercado?" }], context: ctx() });
  const p = chatInstructions(c, new Date(2026, 10, 8, 9, 30));
  assert.match(p, /Hoje é domingo, 8 de novembro de 2026, 09:30 \(2026-11-08\)/);
  assert.match(p, /A pessoa está na tela: o bloco "Mercado", na folha 2 de 2\./);
  assert.match(p, /• Bloco "Mercado" \(categoria Casa\), abre manhã \(05:00\) — aberto na tela: 2 folhas/);
  assert.match(p, /- Folha 2: Churrasco do Beto \(escrita em 2026-11-07; aparece às 09:00\)\n {6}Carvão/);
  assert.match(p, /Pessoa: O que tem no mercado\?$/);
  assert.match(chatInstructions(cleanChat({ messages: [{ role: "user", text: "oi" }] })), /\(nenhum bloco\)/);
  // De quem é (1.9.0): whose the block is
  const owned = ctx();
  owned.blocos[0].dono = "Ana";
  assert.match(chatInstructions(cleanChat({ messages: [{ role: "user", text: "oi" }], context: owned })), /• Bloco "Ideias soltas" \(de Ana\): 1 folha/);
});

test("parseChatActions: criar and acrescentar, checked against the blocks", () => {
  const c = cleanChat({ messages: [], context: ctx() }).context;
  const acts = parseChatActions(
    [
      "criar | mercado | Lista do mês\\n- Sabão\\n- Detergente",
      "Criar | Ideias Soltas | Livros para ler | com barra",
      "acrescentar | Mercado | 2 | Pão de alho",
      "acrescentar | Mercado | folha 1 | - Feijão",
      "acrescentar | Mercado | 9 | não existe",
      "criar | Bloco que não existe | x",
      "criar | Mercado |   ",
      "apagar | Mercado | 1",
      "criar | mercado | Lista do mês\\n- Sabão\\n- Detergente",
      "lixo",
    ],
    c,
  );
  assert.deepEqual(acts, [
    { tipo: "criar", bloco: "mercado0001", nome: "Mercado", texto: "Lista do mês\n- Sabão\n- Detergente" },
    { tipo: "criar", bloco: "ideias00001", nome: "Ideias soltas", texto: "Livros para ler | com barra" },
    { tipo: "acrescentar", bloco: "mercado0001", nome: "Mercado", folha: 2, titulo: "Churrasco do Beto", texto: "Pão de alho" },
    { tipo: "acrescentar", bloco: "mercado0001", nome: "Mercado", folha: 1, titulo: "Lista da semana", texto: "- Feijão" },
  ]);
  // one string with several lines, the id of a block, at most MAX_ACTIONS
  assert.equal(parseChatActions("criar | Mercado | a\ncriar | mercado0001 | b", c).length, 2);
  assert.equal(parseChatActions(Array.from({ length: 30 }, (_, i) => `criar | Mercado | item ${i}`), c).length, MAX_ACTIONS);
  assert.deepEqual(parseChatActions(null, c), []);
});

test("replyOf", () => {
  assert.equal(replyOf({ resposta: "  Oi  " }), "Oi");
  assert.equal(replyOf("texto"), "texto");
  assert.equal(replyOf({}), "");
  assert.equal(replyOf(null), "");
});
