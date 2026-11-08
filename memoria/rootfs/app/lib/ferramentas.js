// The tools of the MemorIA for the CorrerIA (the WhatsApp, and the MCP server of the Claude and the Gemini): read the
// notebooks and write in them. The CorrerIA lists them (GET /api/integracao/ferramentas) and calls one (POST {nome,
// argumentos, pessoa, cliente}); the AI is theirs, not this app's. Writing goes through the same Store functions as
// the screen (savePage, deletePage, saveBlock, saveCategory) and the same rules (lib/writing.js, lib/links.js), and
// every screen hears the change like one made on another device.
//
// Archived blocks stay out of the summary and of the search unless asked (arquivados), can be read when named, and
// their sheets don't change until the block comes back (editar_bloco, arquivado: false). De quem é (de): the summary
// shows the block of the moment for the person who asks, like the Agora of the screen.
//
// Each tool: {nome, titulo, descricao, entrada (JSON Schema), grava, apaga}. callTool() returns {texto, events}.
import { PERIODS, PAPERS, normTime, buildSchedule, currentAt, nextAfter, minutesOf, fmtMin, periodAt, periodTimes, ownerName } from "./schedule.js";
import { parseLinks, linksToText, normalizeUrl } from "./links.js";
import { fold, firstLine, appendText, appendLink, freeColor } from "./writing.js";
import { sheetText } from "./chat.js";
import { opensText } from "./report.js";
import { COLORS, MAX_TEXT } from "./store.js";

const MAX_LIST = 200; // sheets in one answer
const SUMMARY_PER_BLOCK = 15; // the last sheets of each block in the summary
const READ_BUDGET = 40000; // characters of text in memoria_ler_bloco
const PERIOD_IDS = PERIODS.map((p) => p.id);

export const INSTRUCOES =
  "MemorIA: as anotações da casa em blocos (cadernos), cada um com folhas de texto; a primeira linha da folha é o título. " +
  "Um bloco pode ter categoria e abrir sozinho de manhã, à tarde, à noite ou em horários (HH:MM). Comece por memoria_resumo " +
  "(os blocos, as últimas folhas e os ids) ou memoria_buscar; uma folha se acha pelo id ou pelo bloco e o número. Links ficam " +
  "no texto como [Nome](https://…). Um bloco pode ser de uma pessoa da casa (de; sem dono, é de todos): só ela o vê no " +
  "Agora. Blocos arquivados ficam fora do resumo e da busca (peça com arquivados: true) e só voltam a receber folhas " +
  "depois de desarquivados (memoria_editar_bloco com arquivado: false). Datas no formato AAAA-MM-DD. Antes de gravar, " +
  "diga à pessoa o que vai ser feito.";

export class ToolError extends Error {}
export class UnknownTool extends Error {}

// ------------------------------------------------------------------ the list

const obj = (properties, required = []) => ({ type: "object", properties, required, additionalProperties: false });
const DATE = { type: "string", description: "AAAA-MM-DD (ou hoje, ontem, amanhã)." };
const BLOCK = { type: "string", description: "O id ou o nome do bloco (de memoria_resumo)." };
const SHEET = {
  folha: { type: "string", description: "O id da folha (de memoria_resumo, memoria_buscar ou memoria_ler_bloco)." },
  bloco: { type: "string", description: "Sem o id da folha: o id ou o nome do bloco, com o numero." },
  numero: { type: "integer", description: "Com o bloco: o número da folha no bloco (1 é a primeira, -1 a última)." },
};
const TIMES = { type: "array", items: { type: "string" }, description: "Horários HH:MM, como 07:00 e 22:30." };
const ARCHIVED = { type: "boolean", description: "true: inclui os blocos arquivados." };
const BLOCK_FIELDS = {
  categoria: { type: "string", description: "O id ou o nome da categoria." },
  de: { type: "string", description: "De quem é: o nome de uma pessoa da casa (só ela vê o bloco no Agora); vazio ou Todos: de todos." },
  cor: { type: "string", enum: COLORS },
  papel: { type: "string", enum: PAPERS },
  periodos: { type: "array", items: { type: "string", enum: PERIOD_IDS }, description: "Quando abre sozinho: manha, tarde e noite." },
  horarios: { ...TIMES, description: "Horários exatos em que abre sozinho (HH:MM)." },
};

export const FERRAMENTAS = [
  {
    nome: "resumo",
    titulo: "Resumo das anotações",
    grava: false,
    descricao:
      "Visão geral: as categorias, os blocos (categoria, de quem é, quando abrem sozinhos e quantas folhas têm) com as " +
      "últimas folhas de cada um (número, título, quando foi editada e o id) e o bloco do momento para quem pergunta (os " +
      "dela e os de todos, como o Agora do app). Os arquivados só com arquivados: true. Comece por aqui: os ids servem nas outras ferramentas.",
    entrada: obj({ arquivados: ARCHIVED }),
  },
  {
    nome: "buscar",
    titulo: "Buscar nas folhas",
    grava: false,
    descricao:
      "Procura um texto em todas as folhas, sem se importar com acentos (como o Buscar do app), e/ou as folhas escritas ou " +
      "editadas num período; dá para limitar a um bloco ou a uma categoria. Sem nada, as editadas por último. Os blocos " +
      "arquivados ficam de fora, a não ser com arquivados: true ou pedindo o bloco. Devolve cada " +
      "folha com o bloco, o número, o título, um trecho e o id, das mais recentes para as mais antigas.",
    entrada: obj({
      texto: { type: "string", description: "Uma palavra ou um trecho." },
      bloco: BLOCK,
      categoria: { type: "string", description: "O id ou o nome da categoria." },
      de: DATE,
      ate: DATE,
      arquivados: ARCHIVED,
      limite: { type: "integer", minimum: 1, maximum: MAX_LIST, description: "Padrão: 30." },
    }),
  },
  {
    nome: "ler_bloco",
    titulo: "Ler um bloco",
    grava: false,
    descricao:
      "Um bloco inteiro (também um arquivado): a categoria, de quem é, quando abre sozinho e as folhas em ordem (número, id, título, quando foi escrita e " +
      "editada, horários e o texto completo, com os links como [Nome](https://…)). Num bloco muito grande, as primeiras folhas " +
      "vêm só com o título (leia com memoria_ler_folha).",
    entrada: obj({ bloco: BLOCK }, ["bloco"]),
  },
  {
    nome: "ler_folha",
    titulo: "Ler uma folha",
    grava: false,
    descricao:
      "Uma folha inteira: o texto completo (a primeira linha é o título; os links como [Nome](https://…)), os links, o bloco, " +
      "o número, os horários e quando foi escrita e editada. Pelo id (folha) ou pelo bloco e o número.",
    entrada: obj({ ...SHEET }),
  },
  {
    nome: "nova_folha",
    titulo: "Nova folha",
    grava: true,
    descricao:
      "Cria uma folha num bloco, como virar a página e escrever. A primeira linha do texto é o título. horarios: a folha " +
      "abre sozinha nesses horários (um trecho com horário, como a pauta de uma reunião às 10:00).",
    entrada: obj({ bloco: BLOCK, texto: { type: "string", description: "O texto da folha; quebre as linhas com \\n." }, horarios: TIMES }, ["bloco", "texto"]),
  },
  {
    nome: "acrescentar",
    titulo: "Acrescentar numa folha",
    grava: true,
    descricao: "Acrescenta texto no fim de uma folha, numa linha nova. Pelo id (folha) ou pelo bloco e o número (-1 é a última).",
    entrada: obj({ ...SHEET, texto: { type: "string", description: "O que entra no fim da folha." } }, ["texto"]),
  },
  {
    nome: "editar_folha",
    titulo: "Editar folha",
    grava: true,
    descricao:
      "Muda uma folha (só o que vier): texto troca o texto inteiro (mande o texto completo, com os links); trocar e por trocam " +
      "um trecho exato por outro (por vazio apaga o trecho); horarios define os horários (lista vazia tira); mover_para leva a " +
      "folha para outro bloco.",
    entrada: obj({
      ...SHEET,
      texto: { type: "string", description: "O texto inteiro novo." },
      trocar: { type: "string", description: "Um trecho exato do texto de agora." },
      por: { type: "string", description: "O que entra no lugar do trecho (vazio apaga)." },
      horarios: TIMES,
      mover_para: { type: "string", description: "O id ou o nome do bloco para onde a folha vai." },
    }),
  },
  {
    nome: "adicionar_link",
    titulo: "Adicionar link",
    grava: true,
    descricao:
      "Põe um link no fim de uma folha, como o Adicionar link do app: na tela ele vira uma etiqueta com o nome (ou o site). " +
      "Só endereços http e https.",
    entrada: obj({ ...SHEET, url: { type: "string", description: "O endereço, como https://site.com.br/pagina." }, nome: { type: "string", description: "Opcional: como o link aparece." } }, ["url"]),
  },
  {
    nome: "apagar_folha",
    titulo: "Apagar folha",
    grava: true,
    apaga: true,
    descricao: "Arranca uma folha do bloco (apaga de vez). A resposta traz o texto que ela tinha, para refazer se foi engano.",
    entrada: obj({ ...SHEET }),
  },
  {
    nome: "novo_bloco",
    titulo: "Novo bloco",
    grava: true,
    descricao: "Cria um bloco (caderno). Sem cor, a primeira que nenhum bloco usa; sem papel, pautado; sem de, de todos. periodos e horarios: quando abre sozinho.",
    entrada: obj({ nome: { type: "string", description: "Curto, como Mercado ou Reunião de pais." }, ...BLOCK_FIELDS }, ["nome"]),
  },
  {
    nome: "editar_bloco",
    titulo: "Editar bloco",
    grava: true,
    descricao:
      "Muda um bloco (só o que vier): o nome, a categoria (vazio tira a categoria), de quem é (vazio ou Todos: de todos), a cor, " +
      "o papel, quando abre sozinho (periodos e horarios; lista vazia tira) e arquivado (true arquiva: sai do Agora, do resumo e " +
      "da busca, sem apagar nada; false traz de volta).",
    entrada: obj(
      {
        bloco: BLOCK,
        nome: { type: "string" },
        ...BLOCK_FIELDS,
        categoria: { type: "string", description: "O id ou o nome da categoria; vazio tira." },
        arquivado: { type: "boolean", description: "true arquiva o bloco; false desarquiva." },
      },
      ["bloco"],
    ),
  },
  {
    nome: "nova_categoria",
    titulo: "Nova categoria",
    grava: true,
    descricao: "Cria uma categoria para agrupar os blocos (como Trabalho, Casa ou Estudos). Sem cor, a primeira que nenhuma categoria usa. Ponha um bloco nela com memoria_editar_bloco.",
    entrada: obj({ nome: { type: "string" }, cor: { type: "string", enum: COLORS } }, ["nome"]),
  },
];
const BY_NAME = new Map(FERRAMENTAS.map((f) => [f.nome, f]));

/** What GET /api/integracao/ferramentas answers. */
export const listTools = () => ({ instrucoes: INSTRUCOES, ferramentas: FERRAMENTAS.map((f) => ({ ...f, apaga: f.apaga === true })) });

// ------------------------------------------------------------------ helpers

const pad = (n) => String(n).padStart(2, "0");
const ymd = (ms) => {
  const d = new Date(ms);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};
const ymdhm = (ms) => {
  const d = new Date(ms);
  return `${ymd(ms)} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
};
const json = (v) => JSON.stringify(v);
const byCreated = (a, b) => a.created - b.created || (a.id < b.id ? -1 : 1);
const oneLine = (v, max) => String(v == null ? "" : v).replace(/\s+/g, " ").trim().slice(0, max);
const key = (s) => fold(oneLine(s, 200));
const clip = (s, n) => (s.length > n ? `${s.slice(0, n - 1).trimEnd()}…` : s);
const has = (a, k) => a[k] !== undefined && a[k] !== null;

/** The title of a sheet as the screen shows it (links as their names). */
const titleOf = (page) => firstLine(linksToText(page.text)) || "(folha em branco)";

function blocksOf(store) {
  return [...store.data.blocks].sort((a, b) => a.order - b.order || a.created - b.created);
}

function pagesOf(store, blockId) {
  return store.data.pages.filter((p) => p.block === blockId).sort(byCreated);
}

function catsOf(store) {
  return [...(store.data.categories || [])].sort((a, b) => a.order - b.order || a.name.localeCompare(b.name, "pt-BR"));
}

const catName = (store, id) => (catsOf(store).find((c) => c.id === id) || {}).name || "";
const listNames = (items) => items.map((x) => `${x.name} (${x.id})`).join(", ");

/**
 * One of the items by the id or the name (accents and case ignored); a unique start or part of the name also works.
 * words: {none: "Bloco não encontrado", many: "Mais de um bloco"}; all: the list to choose from, for the AI.
 */
function findByName(items, value, words, all) {
  const v = oneLine(value, 200);
  const byId = items.find((x) => x.id === v);
  if (byId) return byId;
  const k = key(v);
  let found = items.filter((x) => key(x.name) === k);
  if (!found.length && k) found = items.filter((x) => key(x.name).startsWith(k));
  if (!found.length && k) found = items.filter((x) => key(x.name).includes(k));
  if (found.length === 1) return found[0];
  if (found.length > 1) throw new ToolError(`${words.many} com esse nome: ${listNames(found)}. Use o id.`);
  throw new ToolError(`${words.none}: ${v}. ${all}`);
}

/** A block by the id or the name: the ones not archived first; an archived one when none of those is it. */
function findBlock(store, value) {
  const blocks = blocksOf(store).filter((b) => !b.archived);
  const archived = blocksOf(store).filter((b) => b.archived);
  if (!oneLine(value, 200)) throw new ToolError(`Falta o bloco. Os blocos: ${listNames(blocks) || "nenhum"}.`);
  const all = `${blocks.length ? `Os blocos: ${listNames(blocks)}.` : "Ainda não há blocos: crie com memoria_novo_bloco."}${archived.length ? ` Arquivados: ${listNames(archived)}.` : ""}`;
  const words = { none: "Bloco não encontrado", many: "Mais de um bloco" };
  try {
    return findByName(blocks, value, words, all);
  } catch (err) {
    if (!archived.length || !err.message.startsWith(words.none)) throw err;
  }
  return findByName(archived, value, words, all);
}

/** The sheets of an archived block don't change (the screen doesn't offer it either) until it comes back. */
function writable(block) {
  if (block && block.archived) throw new ToolError(`O bloco ${block.name} está arquivado. Para mexer nas folhas dele, desarquive antes com memoria_editar_bloco (arquivado: false).`);
  return block;
}

const archivedDay = (b) => (b.archived ? ymd(b.archived) : undefined);

/**
 * De quem é (de): "" or Todos = everyone's; else a person of the house (people: [{id, name}], from Home Assistant), by
 * the name (accents and case ignored, a unique start also works) or the id (person.ana). Without the people (Home
 * Assistant out of reach), the name as written.
 */
function ownerOf(v, people) {
  const name = ownerName(oneLine(v, 200));
  if (!name) return "";
  if (!people || !people.length) return name.slice(0, 80);
  const byId = people.find((p) => p.id === oneLine(v, 200));
  if (byId) return byId.name;
  const all = `As pessoas da casa: ${people.map((p) => p.name).join(", ")}. Vazio ou Todos: de todos.`;
  return findByName(people, name, { none: "Pessoa não encontrada", many: "Mais de uma pessoa" }, all).name;
}

function findCategory(store, value) {
  const cats = catsOf(store);
  const all = cats.length ? `As categorias: ${listNames(cats)}. Crie outra com memoria_nova_categoria.` : "Ainda não há categorias: crie com memoria_nova_categoria.";
  return findByName(cats, value, { none: "Categoria não encontrada", many: "Mais de uma categoria" }, all);
}

const toInt = (v) => (typeof v === "number" ? v : typeof v === "string" && /^\s*-?\d+\s*$/.test(v) ? Number(v) : NaN);

/** The sheet of {folha} (its id) or {bloco, numero}: {page, block, n, total}. */
function findSheet(store, a) {
  const ask = "Diga a folha: o id (folha) ou o bloco e o número (numero).";
  let page = null;
  if (has(a, "folha") && oneLine(a.folha, 40)) {
    page = store.page(oneLine(a.folha, 40));
    if (!page) throw new ToolError(`Folha não encontrada: ${oneLine(a.folha, 40)}. Veja os ids em memoria_resumo ou memoria_buscar.`);
  } else if (has(a, "bloco") && oneLine(a.bloco, 200)) {
    const block = findBlock(store, a.bloco);
    const list = pagesOf(store, block.id);
    if (!has(a, "numero")) throw new ToolError(ask);
    if (!list.length) throw new ToolError(`O bloco ${block.name} não tem folhas: crie uma com memoria_nova_folha.`);
    const n = toInt(a.numero);
    const i = n === -1 ? list.length - 1 : n - 1;
    if (!Number.isInteger(n) || i < 0 || i >= list.length) throw new ToolError(`O bloco ${block.name} tem ${list.length === 1 ? "1 folha" : `${list.length} folhas`}: numero de 1 a ${list.length} (-1 é a última).`);
    page = list[i];
  } else throw new ToolError(ask);
  return { page, ...where(store, page) };
}

/** Where a sheet is: its block, its number and how many sheets the block has. */
function where(store, page) {
  const block = store.block(page.block);
  const list = pagesOf(store, page.block);
  return { block, n: list.indexOf(page) + 1, total: list.length };
}

/** "folha 2 de Mercado (“Churrasco do Beto”)". */
function sheetRef(store, page) {
  const { block, n } = where(store, page);
  const t = firstLine(linksToText(page.text));
  return `folha ${n} de ${block.name}${t ? ` (“${clip(t, 60)}”)` : ""}`;
}

/** The text of a sheet that came from the AI ("\n" is a line break), not empty and not too big. */
function sheetBody(v, field = "texto") {
  if (typeof v !== "string" && typeof v !== "number") throw new ToolError(`Falta o ${field}.`);
  const t = sheetText(String(v), MAX_TEXT + 1);
  if (!t) throw new ToolError(`Falta o ${field}.`);
  return t;
}

function checkSize(text) {
  if (text.length > MAX_TEXT) throw new ToolError(`A folha ficaria grande demais (${text.length} letras; o máximo é ${MAX_TEXT}). Crie outra folha.`);
  return text;
}

function times(v) {
  if (v == null) return [];
  const list = Array.isArray(v) ? v : typeof v === "string" ? v.split(/[\s,;]+/).filter(Boolean) : null;
  if (!list) throw new ToolError("horarios: uma lista de horários HH:MM.");
  const out = [];
  for (const t of list) {
    const n = normTime(String(t).trim());
    if (!n) throw new ToolError(`Horário inválido: ${t}. Use HH:MM, como 07:00.`);
    if (!out.includes(n)) out.push(n);
  }
  if (out.length > 24) throw new ToolError("Horários demais (até 24).");
  return out.sort();
}

function periods(v) {
  if (v == null) return [];
  const list = Array.isArray(v) ? v : typeof v === "string" ? v.split(/[\s,;]+/).filter(Boolean) : null;
  if (!list) throw new ToolError("periodos: uma lista com manha, tarde e noite.");
  const out = [];
  for (const p of list) {
    const k = key(p);
    if (!PERIOD_IDS.includes(k)) throw new ToolError(`Período inválido: ${p}. Use manha, tarde ou noite.`);
    if (!out.includes(k)) out.push(k);
  }
  return out;
}

function color(v) {
  const k = key(v);
  if (!COLORS.includes(k)) throw new ToolError(`Cor inválida: ${v}. As cores: ${COLORS.join(", ")}.`);
  return k;
}

function paper(v) {
  const k = key(v);
  if (!PAPERS.includes(k)) throw new ToolError(`Papel inválido: ${v}. Use ${PAPERS.join(", ")}.`);
  return k;
}

/** A day: AAAA-MM-DD, DD/MM/AAAA, hoje, ontem or amanhã -> local midnight. */
function day(v, now, field) {
  const s = key(v);
  const base = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  if (s === "hoje") return base;
  if (s === "ontem") return new Date(base.getFullYear(), base.getMonth(), base.getDate() - 1);
  if (s === "amanha") return new Date(base.getFullYear(), base.getMonth(), base.getDate() + 1);
  let m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
  let y, mo, d;
  if (m) [y, mo, d] = [+m[1], +m[2], +m[3]];
  else if ((m = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(s))) [y, mo, d] = [+m[3], +m[2], +m[1]];
  const date = m ? new Date(y, mo - 1, d) : null;
  if (!date || date.getMonth() !== mo - 1 || date.getDate() !== d) throw new ToolError(`${field === "de" ? "de" : "ate"}: data inválida (${v}). Use AAAA-MM-DD.`);
  return date;
}

/** How a block opens by itself, in words ("abre de manhã (05:00) e às 19:30"), or "". */
const opens = (store, b) => opensText(b, periodTimes(store.data));

/** A short piece of the text around what was searched (links as their names), in one line. */
function snippet(page, query) {
  const text = linksToText(page.text);
  const title = firstLine(text);
  const rest = text.slice(text.indexOf(title) + title.length).replace(/\s+/g, " ").trim();
  if (!rest) return "";
  const at = query ? fold(rest).indexOf(fold(query)) : -1;
  if (at <= 80) return clip(rest, 200);
  return clip(`…${rest.slice(at - 60)}`, 200);
}

// ------------------------------------------------------------------ reading

function resumo(store, a, now, pessoa) {
  const data = store.data;
  const withArchived = a.arquivados === true;
  // the block of the moment of the person who asks (theirs and everyone's), like the Agora of the screen
  const entries = buildSchedule(data, { person: pessoa });
  const min = minutesOf(now);
  const cur = currentAt(entries, min);
  const nxt = nextAfter(entries, min);
  const period = PERIODS.find((p) => p.id === periodAt(min, periodTimes(data)));
  const curBlock = cur ? store.block(cur.main.block) : null;
  const nextBlock = nxt ? store.block(nxt.main.block) : null;
  const agora = { periodo: period ? period.label.toLowerCase() : "", ...(pessoa ? { pessoa } : {}) };
  if (curBlock) Object.assign(agora, { bloco: curBlock.name, bloco_id: curBlock.id, desde: fmtMin(cur.min), ...(cur.main.page ? { folha_id: cur.main.page } : {}) });
  if (nextBlock) agora.proximo = `${fmtMin(nxt.min)} ${nextBlock.name}`;
  let budget = MAX_LIST;
  let shown = 0;
  const listed = blocksOf(store).filter((b) => withArchived || !b.archived);
  // the archived ones after the others
  listed.sort((x, y) => Number(!!x.archived) - Number(!!y.archived));
  const blocos = listed.map((b) => {
    const list = pagesOf(store, b.id);
    const k = Math.min(SUMMARY_PER_BLOCK, Math.max(0, budget));
    const last = k ? list.slice(-k) : [];
    budget -= last.length;
    shown += last.length;
    const out = { id: b.id, nome: b.name };
    if (catName(store, b.category)) out.categoria = catName(store, b.category);
    if (b.owner) out.de = b.owner;
    if (b.archived) out.arquivado = archivedDay(b);
    else if (opens(store, b)) out.abre = opens(store, b);
    out.folhas = list.length;
    out.ultimas = last.map((p) => ({ n: list.indexOf(p) + 1, id: p.id, titulo: clip(titleOf(p), 120), editada: ymd(p.updated), ...(p.times && p.times.length ? { horarios: p.times.join(", ") } : {}) }));
    return out;
  });
  const categorias = catsOf(store).map((c) => ({ id: c.id, nome: c.name, blocos: listed.filter((b) => b.category === c.id).length }));
  const ids = new Set(listed.map((b) => b.id));
  const hidden = data.blocks.filter((b) => b.archived && !ids.has(b.id)).length;
  return json({ hoje: ymdhm(now.getTime()), agora, categorias, blocos, ...(hidden ? { blocos_arquivados: hidden } : {}), total_folhas: data.pages.filter((p) => ids.has(p.block)).length, mostrando_folhas: shown });
}

function buscar(store, a, now) {
  const q = oneLine(a.texto, 200);
  const block = has(a, "bloco") && oneLine(a.bloco, 200) ? findBlock(store, a.bloco) : null;
  const cat = has(a, "categoria") && oneLine(a.categoria, 200) ? findCategory(store, a.categoria) : null;
  const from = has(a, "de") && oneLine(a.de, 40) ? day(a.de, now, "de").getTime() : -Infinity;
  const toDay = has(a, "ate") && oneLine(a.ate, 40) ? day(a.ate, now, "ate") : null;
  const to = toDay ? new Date(toDay.getFullYear(), toDay.getMonth(), toDay.getDate() + 1).getTime() - 1 : Infinity;
  if (to < from) throw new ToolError("O fim do período (ate) vem antes do começo (de).");
  const limit = has(a, "limite") ? toInt(a.limite) : 30;
  if (!Number.isInteger(limit) || limit < 1 || limit > MAX_LIST) throw new ToolError(`limite: de 1 a ${MAX_LIST}.`);
  const needle = fold(q);
  // the archived blocks only when asked, or when the block asked is one
  const withArchived = a.arquivados === true || !!(block && block.archived);
  const inTime = (p) => (p.created >= from && p.created <= to) || (p.updated >= from && p.updated <= to);
  const found = store.data.pages
    .filter((p) => {
      const b = store.block(p.block);
      if (!b || (b.archived && !withArchived) || (block && b.id !== block.id) || (cat && b.category !== cat.id)) return false;
      if (needle && !fold(p.text).includes(needle)) return false;
      if (!needle && !String(p.text || "").trim()) return false;
      return inTime(p);
    })
    .sort((x, y) => y.updated - x.updated);
  const folhas = found.slice(0, limit).map((p) => {
    const { block: b, n } = where(store, p);
    const out = { id: p.id, bloco: b.name, bloco_id: b.id, ...(b.archived ? { arquivado: true } : {}), n, titulo: clip(titleOf(p), 120) };
    const s = snippet(p, q);
    if (s) out.trecho = s;
    out.editada = ymdhm(p.updated);
    if (p.times && p.times.length) out.horarios = p.times.join(", ");
    return out;
  });
  return json({ encontradas: found.length, mostrando: folhas.length, folhas });
}

function lerBloco(store, a) {
  const b = findBlock(store, a.bloco);
  const all = pagesOf(store, b.id);
  const list = all.slice(-MAX_LIST);
  // whole texts from the last sheet back, while they fit; the first ones only with the title
  let budget = READ_BUDGET;
  const full = new Set();
  for (let i = list.length - 1; i >= 0; i--) {
    const len = list[i].text.length;
    if (len > budget && full.size) break;
    budget -= len;
    full.add(list[i].id);
  }
  const folhas = list.map((p) => {
    const out = { n: all.indexOf(p) + 1, id: p.id, titulo: clip(titleOf(p), 120), escrita: ymdhm(p.created), editada: ymdhm(p.updated) };
    if (p.times && p.times.length) out.horarios = p.times.join(", ");
    if (full.has(p.id)) out.texto = p.text.length > READ_BUDGET ? `${p.text.slice(0, READ_BUDGET)}… (continua: leia com memoria_ler_folha)` : p.text;
    return out;
  });
  const out = { id: b.id, nome: b.name };
  if (catName(store, b.category)) out.categoria = catName(store, b.category);
  if (b.owner) out.de = b.owner;
  if (b.archived) out.arquivado = archivedDay(b);
  else if (opens(store, b)) out.abre = opens(store, b);
  Object.assign(out, { folhas_no_bloco: all.length, mostrando: folhas.length, com_texto: full.size, folhas });
  return json(out);
}

function lerFolha(store, a) {
  const { page, block, n, total } = findSheet(store, a);
  const links = parseLinks(page.text)
    .filter((p) => p.type === "link")
    .map((p) => ({ nome: p.name || p.label, url: p.url }));
  return json({
    id: page.id,
    bloco: block.name,
    bloco_id: block.id,
    ...(block.archived ? { bloco_arquivado: true } : {}),
    n,
    de: total,
    titulo: titleOf(page),
    escrita: ymdhm(page.created),
    editada: ymdhm(page.updated),
    horarios: page.times || [],
    links,
    texto: page.text,
  });
}

// ------------------------------------------------------------------ writing

function novaFolha(store, a) {
  const b = writable(findBlock(store, a.bloco));
  const text = checkSize(sheetBody(a.texto));
  const page = store.savePage({ block: b.id, text, times: times(a.horarios) });
  const extra = page.times.length ? ` Abre sozinha às ${page.times.join(", ")}.` : "";
  return { texto: `Folha criada: ${sheetRef(store, page)}.${extra} id: ${page.id}`, events: [{ kind: "page", page }] };
}

function acrescentar(store, a) {
  const add = sheetBody(a.texto);
  const { page, block } = findSheet(store, a);
  writable(block);
  const saved = store.savePage({ id: page.id, text: checkSize(appendText(page.text, add)) });
  return { texto: `Acrescentado na ${sheetRef(store, saved)}. id: ${saved.id}`, events: [{ kind: "page", page: saved }] };
}

function editarFolha(store, a) {
  const { page, block } = findSheet(store, a);
  writable(block);
  const change = {};
  const said = [];
  if (has(a, "texto") && has(a, "trocar")) throw new ToolError("Mande texto (o texto inteiro) ou trocar e por, não os dois.");
  if (has(a, "texto")) {
    const text = sheetText(String(a.texto), MAX_TEXT + 1);
    if (!text) throw new ToolError("O texto ficou vazio. Para tirar a folha, use memoria_apagar_folha.");
    change.text = checkSize(text);
    said.push("o texto");
  } else if (has(a, "trocar")) {
    const from = String(a.trocar);
    if (!from) throw new ToolError("trocar: o trecho exato que sai.");
    const to = has(a, "por") ? String(a.por).replace(/\\n/g, "\n") : "";
    const at = page.text.indexOf(from);
    if (at < 0) throw new ToolError(`Trecho não encontrado na folha: “${clip(oneLine(from, 120), 80)}”. Leia a folha com memoria_ler_folha e copie o trecho exato.`);
    let start = at;
    let end = at + from.length;
    // a whole line taken out goes with its line break
    const wholeLine = (start === 0 || page.text[start - 1] === "\n") && (end === page.text.length || page.text[end] === "\n");
    if (!to && wholeLine) {
      if (end < page.text.length) end++;
      else if (start > 0) start--;
    }
    const text = page.text.slice(0, start) + to + page.text.slice(end);
    if (!text.trim()) throw new ToolError("O texto ficaria vazio. Para tirar a folha, use memoria_apagar_folha.");
    change.text = checkSize(text);
    said.push(to ? "um trecho" : "um trecho apagado");
  } else if (has(a, "por")) throw new ToolError("por vem com trocar (o trecho que sai).");
  if (has(a, "horarios")) {
    change.times = times(a.horarios);
    said.push(change.times.length ? `horários ${change.times.join(", ")}` : "sem horários");
  }
  let target = null;
  if (has(a, "mover_para") && oneLine(a.mover_para, 200)) {
    target = findBlock(store, a.mover_para);
    if (target.id !== page.block) change.block = writable(target).id;
  }
  if (!Object.keys(change).length) {
    if (target) throw new ToolError(`A folha já está no bloco ${target.name}.`);
    throw new ToolError("Diga o que muda: texto, trocar e por, horarios ou mover_para.");
  }
  const before = store.block(page.block).name;
  const saved = store.savePage({ id: page.id, ...change });
  if (change.block) said.push(`movida de ${before}`);
  return { texto: `Alterada (${said.join("; ")}): ${sheetRef(store, saved)}. id: ${saved.id}`, events: [{ kind: "page", page: saved }] };
}

function adicionarLink(store, a) {
  const url = normalizeUrl(a.url);
  if (!url) throw new ToolError(`Esse link não abre: ${oneLine(a.url, 120)}. Use um endereço como https://site.com.br`);
  const { page, block } = findSheet(store, a);
  writable(block);
  const name = oneLine(a.nome, 120);
  const saved = store.savePage({ id: page.id, text: checkSize(appendLink(page.text, url, name)) });
  return { texto: `Link adicionado na ${sheetRef(store, saved)}: ${name ? `${name} (${url})` : url}. id: ${saved.id}`, events: [{ kind: "page", page: saved }] };
}

function apagarFolha(store, a) {
  const { page, block } = findSheet(store, a);
  writable(block);
  const ref = sheetRef(store, page);
  const text = page.text.trim();
  store.deletePage(page.id);
  const was = text ? ` O texto era:\n${text.length > 4000 ? `${text.slice(0, 4000)}…` : text}` : " Estava em branco.";
  return { texto: `Folha apagada: ${ref}.${was}`, events: [{ kind: "page_deleted", id: page.id }] };
}

/** The fields of a block that came (novo_bloco, editar_bloco), checked. */
function blockFields(store, a, existing, people) {
  const out = {};
  if (has(a, "nome")) {
    const name = oneLine(a.nome, 60);
    if (!name) throw new ToolError("O nome ficou vazio.");
    out.name = name;
  }
  if (has(a, "categoria")) out.category = oneLine(a.categoria, 200) ? findCategory(store, a.categoria).id : "";
  if (has(a, "de")) out.owner = ownerOf(a.de, people);
  if (has(a, "cor")) out.color = color(a.cor);
  if (has(a, "papel")) out.paper = paper(a.papel);
  if (has(a, "periodos")) out.periods = periods(a.periodos);
  if (has(a, "horarios")) out.times = times(a.horarios);
  if (!existing && !out.color) out.color = freeColor(store.data.blocks, COLORS, "lilas");
  return out;
}

/** "Mercado · categoria Casa · de Ana · laranja · pautado · abre de manhã (05:00)" (or "arquivado em …"). */
function describeBlock(store, b) {
  return [
    b.name,
    catName(store, b.category) ? `categoria ${catName(store, b.category)}` : "sem categoria",
    b.owner ? `de ${b.owner}` : "",
    b.color,
    b.paper,
    b.archived ? `arquivado em ${archivedDay(b)}` : opens(store, b) || "não abre sozinho",
  ]
    .filter(Boolean)
    .join(" · ");
}

function novoBloco(store, a, now, people) {
  if (!oneLine(a.nome, 60)) throw new ToolError("Falta o nome do bloco.");
  const fields = blockFields(store, a, null, people);
  const same = store.data.blocks.filter((b) => key(b.name) === key(fields.name));
  const block = store.saveBlock({ paper: "pautado", periods: [], times: [], ...fields });
  const warn = same.length ? `\nAtenção: já havia um bloco com esse nome (${listNames(same)}).` : "";
  return { texto: `Bloco criado: ${describeBlock(store, block)}. id: ${block.id}${warn}`, events: [{ kind: "block", block }] };
}

function editarBloco(store, a, now, people) {
  const b = findBlock(store, a.bloco);
  const fields = blockFields(store, a, b, people);
  if (has(a, "arquivado")) {
    if (typeof a.arquivado !== "boolean") throw new ToolError("arquivado: true (arquivar) ou false (desarquivar).");
    if (a.arquivado !== !!b.archived) fields.archived = a.arquivado;
    else if (!Object.keys(fields).length) throw new ToolError(`O bloco ${b.name} ${a.arquivado ? "já está arquivado" : "não está arquivado"}.`);
  }
  if (!Object.keys(fields).length) throw new ToolError("Diga o que muda: nome, categoria, de, cor, papel, periodos, horarios ou arquivado.");
  const before = describeBlock(store, b);
  const block = store.saveBlock({ id: b.id, ...fields });
  const what = fields.archived === true ? "Bloco arquivado (as folhas continuam lá)" : fields.archived === false ? "Bloco desarquivado" : "Bloco alterado";
  return { texto: `${what}: ${describeBlock(store, block)}. Antes: ${before}. id: ${block.id}`, events: [{ kind: "block", block }] };
}

function novaCategoria(store, a) {
  const name = oneLine(a.nome, 40);
  if (!name) throw new ToolError("Falta o nome da categoria.");
  const same = catsOf(store).find((c) => key(c.name) === key(name));
  if (same) throw new ToolError(`Já existe a categoria ${same.name} (${same.id}).`);
  const category = store.saveCategory({ name, color: has(a, "cor") ? color(a.cor) : freeColor(store.data.categories, COLORS, "grafite") });
  return { texto: `Categoria criada: ${category.name} · ${category.color}. id: ${category.id}`, events: [{ kind: "category", category }] };
}

// ------------------------------------------------------------------ call

const READ = { resumo, buscar, ler_bloco: lerBloco, ler_folha: lerFolha };
const WRITE = { nova_folha: novaFolha, acrescentar, editar_folha: editarFolha, adicionar_link: adicionarLink, apagar_folha: apagarFolha, novo_bloco: novoBloco, editar_bloco: editarBloco, nova_categoria: novaCategoria };

/**
 * Runs a tool on the store. Returns {texto, events}: texto for the AI, events for the screens (as the WebSocket of the
 * app sends them). ToolError: a bad argument (400); UnknownTool (404). pessoa: the name of the person of the house who
 * asks ("": anyone); people: the people of the house [{id, name}] (null: unknown), for De quem é.
 */
export function callTool(name, args, { store, now = new Date(), pessoa = "", people = null }) {
  const n = String(name || "");
  if (!BY_NAME.has(n)) throw new UnknownTool(`Ferramenta desconhecida: ${oneLine(name, 60) || "(sem nome)"}.`);
  const a = args && typeof args === "object" && !Array.isArray(args) ? args : {};
  try {
    if (READ[n]) return { texto: READ[n](store, a, now, pessoa), events: [] };
    return WRITE[n](store, a, now, people);
  } catch (err) {
    // the Store says what is wrong in lower case ("blocos demais", "categoria não existe")
    if (err.code === "invalid_format") throw new ToolError(`${err.message[0].toUpperCase()}${err.message.slice(1)}.`.replace(/\.\.$/, "."));
    throw err;
  }
}
