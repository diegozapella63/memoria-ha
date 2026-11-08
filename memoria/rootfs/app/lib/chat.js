// Conversa com a IA (the chat beside the microphone, like the ResolvIA and the CronologIA): the person talks about
// the screen they are on, their notebooks, or anything else. The answer can carry actions (create a sheet in a block,
// add to a sheet), which the screen shows as cards and only does after a tap. The AI is the one Home Assistant gives
// the app (ai_task.generate_data), so there is no memory on its side: the conversation goes in every call.

const WEEKDAY = ["domingo", "segunda-feira", "terça-feira", "quarta-feira", "quinta-feira", "sexta-feira", "sábado"];
const MONTH = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];
const MAX_TURNS = 16;
const MAX_BLOCKS = 40;
const MAX_SHEETS = 160;
const MAX_CONTEXT = 24000; // characters of sheets in one call
export const MAX_ACTIONS = 10;

const fold = (s) =>
  String(s || "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
const oneLine = (v, max) => String(v == null ? "" : v).replace(/[\r\n|]+/g, " ").replace(/\s+/g, " ").trim().slice(0, max);
const text = (v, max) => String(v == null ? "" : v).replace(/\r/g, "").trim().slice(0, max);
const isDate = (s) => typeof s === "string" && /^\d{4}-\d{2}-\d{2}$/.test(s);
const ID_RE = /^[a-z0-9]{6,32}$/i;

export const CHAT_STRUCTURE = {
  resposta: {
    description: "A resposta para a pessoa, em português do Brasil: curta, direta, sem palavras em inglês e sem markdown.",
    required: true,
    selector: { text: { multiline: true } },
  },
  acoes: {
    description:
      'Só quando a pessoa pede para escrever nos blocos: uma ação por elemento, "criar | nome do bloco | texto da folha nova" ou "acrescentar | nome do bloco | número da folha | texto". Use \\n para quebrar linha no texto. Vazio quando não há o que fazer.',
    required: false,
    selector: { text: { multiple: true } },
  },
};

/**
 * What the screen sends, checked: {messages: [{role: "user"|"ia", text}], context: {tela, agora, blocos: [{id, nome,
 * categoria, dono, abre, aberto, folhas: [{n, titulo, texto, escrita, horarios}]}]}}. The last message is the person's.
 * The sheets have a budget: the block open on screen first, with more of each text.
 */
export function cleanChat(raw) {
  const r = raw && typeof raw === "object" ? raw : {};
  const messages = (Array.isArray(r.messages) ? r.messages : [])
    .filter((m) => m && (m.role === "user" || m.role === "ia") && typeof m.text === "string" && m.text.trim())
    .slice(-MAX_TURNS)
    .map((m) => ({ role: m.role, text: text(m.text, 2000) }));
  const c = r.context && typeof r.context === "object" ? r.context : {};
  let sheets = MAX_SHEETS;
  let chars = MAX_CONTEXT;
  const blocos = [];
  const list = (Array.isArray(c.blocos) ? c.blocos : []).filter((b) => b && typeof b.id === "string" && ID_RE.test(b.id)).slice(0, MAX_BLOCKS);
  list.sort((a, b) => Number(b.aberto === true) - Number(a.aberto === true));
  for (const b of list) {
    const folhas = [];
    const each = b.aberto === true ? 2000 : 400;
    for (const f of Array.isArray(b.folhas) ? b.folhas : []) {
      if (sheets <= 0 || chars <= 0) break;
      const n = Number.isInteger(f && f.n) && f.n > 0 ? f.n : folhas.length + 1;
      const body = text(f && f.texto, Math.min(each, chars));
      const titulo = oneLine(f && f.titulo, 120) || oneLine(body.split("\n")[0], 120);
      if (!titulo && !body) continue;
      sheets--;
      chars -= body.length;
      folhas.push({ n, titulo, texto: body, escrita: isDate(f.escrita) ? f.escrita : null, horarios: oneLine(f.horarios, 60) });
    }
    blocos.push({
      id: b.id,
      nome: oneLine(b.nome, 60) || "Sem nome",
      categoria: oneLine(b.categoria, 40),
      dono: oneLine(b.dono, 80),
      abre: oneLine(b.abre, 120),
      aberto: b.aberto === true,
      total: Number.isFinite(b.total) ? Math.max(folhas.length, Math.round(b.total)) : folhas.length,
      folhas,
    });
  }
  return { messages, context: { tela: oneLine(c.tela, 160), agora: oneLine(c.agora, 200), blocos } };
}

const pad = (n) => String(n).padStart(2, "0");
const whenText = (now) => `${WEEKDAY[now.getDay()]}, ${now.getDate()} de ${MONTH[now.getMonth()]} de ${now.getFullYear()}, ${pad(now.getHours())}:${pad(now.getMinutes())}`;
const ymd = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

/** The instructions for one turn: who the AI is, today, the screen, the notebooks and the conversation so far. */
export function chatInstructions({ messages, context }, now = new Date()) {
  const blocks = context.blocos.length
    ? context.blocos
        .map((b) => {
          const head = `• Bloco "${b.nome}"${b.categoria ? ` (categoria ${b.categoria})` : ""}${b.dono ? ` (de ${b.dono})` : ""}${b.abre ? `, ${b.abre}` : ""}${b.aberto ? " — aberto na tela" : ""}: ${b.total ? `${b.total} ${b.total === 1 ? "folha" : "folhas"}` : "nenhuma folha"}`;
          const rows = b.folhas.map((f) => {
            const meta = [f.escrita ? `escrita em ${f.escrita}` : "", f.horarios ? `aparece às ${f.horarios}` : ""].filter(Boolean).join("; ");
            const body = f.texto.split("\n").slice(1).join("\n").trim();
            return `  - Folha ${f.n}: ${f.titulo}${meta ? ` (${meta})` : ""}${body ? `\n${body.split("\n").map((l) => `      ${l}`).join("\n")}` : ""}`;
          });
          const more = b.total > b.folhas.length ? `  - … e mais ${b.total - b.folhas.length}` : "";
          return [head, ...rows, more].filter(Boolean).join("\n");
        })
        .join("\n")
    : "(nenhum bloco)";
  const talk = messages.map((m) => `${m.role === "user" ? "Pessoa" : "Você"}: ${m.text}`).join("\n");
  return [
    "Você é a IA do MemorIA, o app de blocos de anotações (cadernos) da casa no Home Assistant. Converse em português do Brasil, de forma curta e direta, sem palavras em inglês e sem markdown.",
    "A pessoa pode perguntar sobre os blocos, as folhas e a tela em que está, ou sobre qualquer outro assunto: responda das duas formas. Sobre as anotações, use só os dados abaixo; não invente folhas.",
    `Hoje é ${whenText(now)} (${ymd(now)}).`,
    context.tela ? `A pessoa está na tela: ${context.tela}.` : "",
    context.agora ? `Agora: ${context.agora}.` : "",
    "Blocos e folhas:",
    blocks,
    'Quando a pessoa pedir para escrever, criar uma folha ou acrescentar algo, escreva em "acoes" uma linha por pedido ("criar | bloco | texto" ou "acrescentar | bloco | número da folha | texto") e, na resposta, diga o que vai fazer: ela confirma na tela antes. Sem pedido, deixe "acoes" vazio.',
    "Conversa até agora (responda à última fala da pessoa):",
    talk,
  ]
    .filter(Boolean)
    .join("\n");
}

/** The block of a name the AI wrote (the name or the id; accents and case ignored). */
function findBlock(blocks, name) {
  const n = fold(name);
  if (!n) return null;
  return blocks.find((b) => fold(b.nome) === n || b.id === String(name).trim()) || blocks.find((b) => fold(b.nome).startsWith(n) || n.startsWith(fold(b.nome))) || null;
}

/** The text of a sheet the AI wrote: "\n" becomes a line break (also for the tools of the CorrerIA, with their own max). */
export const sheetText = (s, max = 20000) =>
  String(s || "")
    .replace(/\\n/g, "\n")
    .replace(/\r/g, "")
    .split("\n")
    .map((l) => l.trimEnd())
    .join("\n")
    .trim()
    .slice(0, max);

/**
 * The actions of an answer, checked against the blocks the screen sent: [{tipo: "criar", bloco, nome, texto} |
 * {tipo: "acrescentar", bloco, nome, folha, titulo, texto}]. A block that is not there, a sheet number that is not
 * in it, an empty text or a repeated action are left out.
 */
export function parseChatActions(raw, context) {
  const lines = Array.isArray(raw) ? raw : typeof raw === "string" ? raw.split(/\n(?=\s*(?:criar|acrescentar)\s*\|)/i) : [];
  const out = [];
  const seen = new Set();
  for (const line of lines) {
    if (out.length >= MAX_ACTIONS) break;
    const parts = String(line || "").split("|");
    const tipo = fold(parts[0]);
    if (parts.length < 3) continue;
    const b = findBlock(context.blocos, parts[1]);
    if (!b) continue;
    if (tipo.startsWith("cri")) {
      const texto = sheetText(parts.slice(2).join("|"));
      if (!texto) continue;
      const k = `c|${b.id}|${fold(texto)}`;
      if (seen.has(k)) continue;
      seen.add(k);
      out.push({ tipo: "criar", bloco: b.id, nome: b.nome, texto });
    } else if (tipo.startsWith("acrescent")) {
      const n = parseInt(String(parts[2]).replace(/\D+/g, ""), 10);
      const f = b.folhas.find((x) => x.n === n);
      const texto = sheetText(parts.slice(3).join("|"));
      if (!f || !texto) continue;
      const k = `a|${b.id}|${n}|${fold(texto)}`;
      if (seen.has(k)) continue;
      seen.add(k);
      out.push({ tipo: "acrescentar", bloco: b.id, nome: b.nome, folha: n, titulo: f.titulo, texto });
    }
  }
  return out;
}

/** The text of the answer (the AI sometimes sends the whole thing as one string). */
export function replyOf(data) {
  if (data == null) return "";
  if (typeof data === "string") return text(data, 4000);
  if (typeof data.resposta === "string") return text(data.resposta, 4000);
  return "";
}
