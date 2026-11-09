// In-memory stand-in for the MemorIA server, used by the preview page.
// Mirrors the server's rules (ids, times, conflicts) closely enough for the UI.
import { DEFAULT_PERIODS, PAPERS, PERIODS, DURATIONS, normTime, ownerName } from "../../memoria/rootfs/app/lib/schedule.js";

const COLORS = ["vermelho", "coral", "rosa", "framboesa", "laranja", "ouro", "lilas", "azul", "menta", "grafite"];
const id = () => Math.random().toString(16).slice(2, 14).padEnd(12, "0");
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const clone = (x) => JSON.parse(JSON.stringify(x));
const times = (list) => [...new Set((list || []).map(normTime).filter(Boolean))].sort().slice(0, 24);

function sample() {
  const now = Date.now();
  const day = 86400000;
  const categories = [
    { id: "catpessoal1", name: "Pessoal", color: "lilas", order: 0 },
    { id: "cattrabalho", name: "Trabalho", color: "laranja", order: 1 },
  ].map((c) => ({ ...c, created: now - 30 * day, updated: now - 30 * day }));
  const blocks = [
    // Treino is Beto's (it doesn't open in Ana's Agora); Diário is Ana's; Viagem, archived
    { id: "treino00001", name: "Treino", color: "azul", paper: "quadriculado", periods: [], times: ["07:00"], order: 0, category: "catpessoal1", owner: "Beto" },
    { id: "trabalho001", name: "Trabalho", color: "laranja", paper: "pautado", periods: ["manha", "tarde"], times: [], order: 1, category: "cattrabalho" },
    { id: "diario00001", name: "Diário", color: "lilas", paper: "pautado", periods: ["noite"], times: ["22:00"], order: 2, category: "catpessoal1", owner: "Ana" },
    { id: "ideias00001", name: "Ideias", color: "menta", paper: "pontilhado", periods: [], times: [], order: 3 },
    { id: "viagem00001", name: "Viagem", color: "ouro", paper: "pautado", periods: [], times: ["08:00"], order: 4, archived: now - 20 * day },
  ].map((b) => ({ ...b, created: now - 30 * day, updated: now - 2 * day }));
  const pg = (block, text, ago, extra = {}) => ({ id: id(), block, text, times: [], created: now - ago, updated: now - ago, ...extra });
  const pages = [
    pg("treino00001", "Treino A — peito e tríceps\n\nSupino reto 4x10 · 40 kg\nSupino inclinado 3x12\nCrucifixo 3x12\nTríceps corda 4x12\nPrancha 3x 45s\n\nSemana que vem: subir a carga do supino.", 3 * day),
    pg("treino00001", "Treino B — costas e bíceps\n\nPuxada frente 4x10\nRemada baixa 3x12\nRosca direta 3x10\nRosca martelo 3x12\nAbdominal 3x20", 1 * day),
    pg("trabalho001", "Semana\n\n- Revisar a proposta do cliente\n- Ligar para o contador\n- Mandar o orçamento da reforma\n- Fechar o relatório de outubro", 2 * day),
    pg("trabalho001", "Reunião das 10h\n\nPauta:\n1. Cronograma do projeto\n2. Orçamento de outubro\n3. Próximos passos\n\nLevar o notebook e o carregador.", 1 * day, { times: ["10:00"] }),
    pg("diario00001", "Domingo\n\nAlmoço com a família e à tarde arrumei a garagem. Achei a caixa de fotos antigas, vale separar umas para emoldurar.", 2 * day),
    pg("diario00001", "Hoje\n\nGratidão:\n• café da manhã com calma\n• terminei o painel da sala no Home Assistant\n• caminhada no fim da tarde\n\nAmanhã: acordar 6h30 e não pular o treino.", 6 * 3600000),
    pg("ideias00001", "Bolo de cenoura\n\nReceita para domingo:\n[Receita da vó](https://www.receitas-exemplo.com.br/receita/23-bolo-de-cenoura.html)\n\nCobertura de chocolate: https://www.google.com/search?q=cobertura+de+chocolate+para+bolo&sca_esv=a1b2c3&ei=XyZ123abc&oq=cobertura&gs_lp=EgZwc3ktYWIiCWNvYmVydHVyYQ.\n\nComprar: cenoura, ovos, farinha.", 3 * day),
    pg("viagem00001", "Roteiro da serra\n\nSexta: sair cedo, almoço na estrada.\nSábado: trilha da cachoeira.\nDomingo: feira e volta.", 40 * day),
    pg("viagem00001", "Mala\n\n- Casaco\n- Bota de trilha\n- Protetor solar", 39 * day),
    pg("ideias00001", "Ideias para a casa\n\n- Sensor de presença no corredor\n- Luz da varanda acender no pôr do sol\n- Tablet na geladeira mostrando o MemorIA agora\n- Lembrete de regar as plantas às 18h", 4 * day),
  ];
  return { version: 1, periods: { ...DEFAULT_PERIODS }, app: {}, categories, blocks, pages };
}

export class MockApi {
  constructor() {
    this.data = sample();
    this.subs = new Set();
  }

  onStatus() {}
  onReconnect() {}

  emit(event) {
    for (const cb of this.subs) setTimeout(() => cb(clone(event)), 10);
  }

  async bootstrap() {
    await wait(60);
    return { version: "1.15.0", user: { name: "Ana Souza", person: "Ana" }, people: ["Ana", "Beto"], ai: await this.aiStatus(), data: clone(this.data), correria: { ultimo: null } };
  }

  // De quem é: the people of the house (Ana uses the preview)
  async people() {
    await wait(40);
    return { people: ["Ana", "Beto"], person: "Ana" };
  }

  async aiStatus() {
    await wait(300);
    const entities = [
      { id: "ai_task.google_ai_task", name: "Google AI Task", images: true, available: true },
      { id: "ai_task.ollama_ai_task", name: "Ollama AI Task", images: false, available: true },
    ];
    const sel = this.data.app.ai_entity || "";
    const using = entities.find((e) => e.id === sel) || entities[0];
    return {
      ready: true,
      images: using.images,
      selected: sel,
      using: { id: using.id, name: using.name },
      entities,
      reason: using.images ? null : `${using.name} não lê fotos. Escolha outra IA em Mais › Configurações › Integrações.`,
    };
  }

  async subscribe(cb) {
    this.subs.add(cb);
    return () => this.subs.delete(cb);
  }

  async savePage(input) {
    await wait(40);
    const d = this.data;
    const now = Date.now();
    let p = d.pages.find((x) => x.id === input.id);
    const block = "block" in input ? input.block : p && p.block;
    if (!d.blocks.some((b) => b.id === block)) throw Object.assign(new Error("bloco não existe"), { code: "invalid_format" });
    if (p && Number.isFinite(input.base) && input.base < p.updated && "text" in input && input.text !== p.text) {
      throw Object.assign(new Error("Esta página mudou em outro aparelho"), { code: "conflict", page: clone(p) });
    }
    if (!p) {
      const created = Number.isFinite(input.created) && input.created <= now ? input.created : now;
      p = { id: /^[a-z0-9]{6,32}$/i.test(input.id || "") ? input.id : id(), block, text: "", times: [], created };
      d.pages.push(p);
    }
    p.block = block;
    if ("text" in input) p.text = String(input.text).slice(0, 50000);
    if ("times" in input) p.times = times(input.times);
    if ("dur" in input) {
      if (DURATIONS.includes(input.dur) && input.dur) p.dur = input.dur;
      else delete p.dur;
    }
    p.updated = now;
    this.emit({ kind: "page", page: p });
    return clone(p);
  }

  async saveMarks(pid, at, lines) {
    await wait(30);
    const d = this.data;
    if (!d.pages.some((p) => p.id === pid)) throw Object.assign(new Error("página não existe"), { code: "invalid_format" });
    d.marks = { ...(d.marks || {}) };
    const clean = [...new Set((lines || []).map((l) => String(l).replace(/\s+/g, " ").trim()).filter(Boolean))];
    if (clean.length) d.marks[pid] = { at, lines: clean };
    else delete d.marks[pid];
    this.emit({ kind: "marks", id: pid, marks: d.marks[pid] || null });
    return clone(d.marks[pid] || null);
  }

  async deletePage(pid) {
    await wait(30);
    this.data.pages = this.data.pages.filter((p) => p.id !== pid);
    this.emit({ kind: "page_deleted", id: pid });
    return null;
  }

  async saveBlock(input) {
    await wait(40);
    const d = this.data;
    const now = Date.now();
    let b = input.id && d.blocks.find((x) => x.id === input.id);
    const isNew = !b;
    if (!b) {
      b = { id: id(), created: now, order: d.blocks.length };
      d.blocks.push(b);
    }
    // only what came (like the server): Arquivar sends just {id, archived}
    if ("name" in input || isNew) b.name = (input.name || "Novo bloco").slice(0, 60);
    if ("color" in input || isNew) b.color = COLORS.includes(input.color) ? input.color : "lilas";
    if ("paper" in input || isNew) b.paper = PAPERS.includes(input.paper) ? input.paper : "pautado";
    if ("periods" in input || isNew) b.periods = (input.periods || []).filter((p) => PERIODS.some((x) => x.id === p));
    if ("times" in input || isNew) b.times = times(input.times);
    if ("dur" in input) {
      if (DURATIONS.includes(input.dur) && input.dur) b.dur = input.dur;
      else delete b.dur;
    }
    if ("owner" in input) {
      const owner = ownerName(input.owner);
      if (owner) b.owner = owner;
      else delete b.owner;
    }
    if ("archived" in input) {
      if (input.archived) b.archived = b.archived || now;
      else delete b.archived;
    }
    if ("category" in input) {
      if (input.category && !d.categories.some((c) => c.id === input.category)) throw Object.assign(new Error("categoria não existe"), { code: "invalid_format" });
      if (input.category) b.category = input.category;
      else delete b.category;
    }
    b.updated = now;
    this.emit({ kind: "block", block: b });
    return clone(b);
  }

  async saveCategory(input) {
    await wait(40);
    const d = this.data;
    const now = Date.now();
    const key = (s) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
    let c = input.id && d.categories.find((x) => x.id === input.id);
    if ("name" in input || !c) {
      const name = String(input.name || "").replace(/\s+/g, " ").trim().slice(0, 40);
      if (!name) throw Object.assign(new Error("Dê um nome à categoria."), { code: "invalid_format" });
      if (d.categories.some((x) => x !== c && key(x.name) === key(name))) throw Object.assign(new Error(`Já existe a categoria ${name}.`), { code: "invalid_format" });
      if (!c) {
        c = { id: id(), created: now, order: d.categories.length, color: "grafite" };
        d.categories.push(c);
      }
      c.name = name;
    }
    if (COLORS.includes(input.color)) c.color = input.color;
    c.updated = now;
    this.emit({ kind: "category", category: c });
    return clone(c);
  }

  async deleteCategory(cid) {
    await wait(40);
    const d = this.data;
    d.categories = d.categories.filter((c) => c.id !== cid);
    const blocks = [];
    for (const b of d.blocks) {
      if (b.category !== cid) continue;
      delete b.category;
      blocks.push(b);
    }
    this.emit({ kind: "category_deleted", id: cid, blocks: clone(blocks) });
    return { blocks: clone(blocks) };
  }

  async deleteBlock(bid) {
    await wait(40);
    const d = this.data;
    const pages = d.pages.filter((p) => p.block === bid).map((p) => p.id);
    d.blocks = d.blocks.filter((b) => b.id !== bid);
    d.pages = d.pages.filter((p) => p.block !== bid);
    this.emit({ kind: "block_deleted", id: bid, pages });
    return { pages };
  }

  async saveSettings({ periods, app }) {
    await wait(30);
    const d = this.data;
    if (periods) for (const k of Object.keys(DEFAULT_PERIODS)) if (k in periods && normTime(periods[k])) d.periods[k] = normTime(periods[k]);
    if (app) {
      d.app = { ...d.app, ...app };
      if (!d.app.ai_entity) delete d.app.ai_entity;
      for (const k of Object.keys(d.app)) if (d.app[k] == null) delete d.app[k];
    }
    const res = { periods: clone(d.periods), app: clone(d.app) };
    this.emit({ kind: "settings", ...res });
    return res;
  }

  // Falar: the speech-to-text of Home Assistant, simulated (the microphone is the browser's)
  async voiceStatus() {
    await wait(120);
    const options = [
      { id: "stt.home_assistant_cloud", name: "Home Assistant Cloud" },
      { id: "stt.faster_whisper", name: "faster-whisper" },
    ];
    const sel = this.data.app.voice_engine || "";
    const chosen = options.find((o) => o.id === sel);
    return { ready: true, engine: (chosen || options[0]).id, name: (chosen || options[0]).name, chosen: !!chosen, selected: sel, missing: false, options, auto: { engine: options[0].id, name: options[0].name } };
  }

  async voiceText(pcm) {
    await wait(700);
    if (!pcm || pcm.length < 16000 * 0.4) throw Object.assign(new Error("Não ouvi nada. Toque no microfone e fale."), { code: "invalid_format" });
    return { text: "Lembrar de comprar pão, regar as plantas e ligar para a Ana às seis", engine: "stt.home_assistant_cloud", name: "Home Assistant Cloud" };
  }

  // Conversa, simulated: "crie uma folha no BLOCO com TEXTO" and "acrescente TEXTO na folha N do BLOCO" propose actions
  async chat(messages, context) {
    await wait(700);
    const last = (messages[messages.length - 1] || {}).text || "";
    const block = (name) => (context.blocos || []).find((b) => b.nome.toLowerCase() === String(name).trim().toLowerCase());
    let m;
    if ((m = /crie uma folha no (.+?) com (.+)$/i.exec(last)) && block(m[1])) {
      const b = block(m[1]);
      return { reply: `Posso criar uma folha em ${b.nome}.`, actions: [{ tipo: "criar", bloco: b.id, nome: b.nome, texto: m[2].replace(/;\s*/g, "\n") }], provider: "Google AI Task" };
    }
    if ((m = /acrescente (.+?) na folha (\d+) do (.+?)$/i.exec(last)) && block(m[3])) {
      const b = block(m[3]);
      const f = b.folhas.find((x) => x.n === Number(m[2]));
      if (f) return { reply: `Posso acrescentar na folha ${f.n} de ${b.nome}.`, actions: [{ tipo: "acrescentar", bloco: b.id, nome: b.nome, folha: f.n, titulo: f.titulo, texto: m[1] }], provider: "Google AI Task" };
    }
    const open = (context.blocos || []).find((b) => b.aberto);
    return { reply: open ? `Na prévia eu só simulo. Você está em ${open.nome}, com ${open.total} ${open.total === 1 ? "folha" : "folhas"}.` : "Na prévia eu só simulo a conversa. No app, quem responde é a IA do Home Assistant.", actions: [], provider: "Google AI Task" };
  }

  // Dados: in the preview nothing leaves the page.
  exportUrl() {
    return null;
  }

  async importFile(file) {
    await wait(200);
    if (!/\.json$/i.test(file.name)) throw new Error("Na prévia só dá para importar um .json.");
    const raw = JSON.parse(await file.text());
    if (!Array.isArray(raw.blocks) || !Array.isArray(raw.pages)) throw new Error("Esse arquivo não parece um backup do MemorIA.");
    this.data = { ...this.data, categories: Array.isArray(raw.categories) ? raw.categories : [], blocks: raw.blocks, pages: raw.pages };
    this.emit({ kind: "reset", data: this.data });
    return { blocks: raw.blocks.length, pages: raw.pages.length };
  }

  async versions() {
    await wait(150);
    const t = Date.now();
    return [
      { name: "memoria-1-auto.json", when: t - 25 * 60000, reason: "auto", blocks: 4, pages: 7 },
      { name: "memoria-2-auto.json", when: t - 26 * 3600000, reason: "auto", blocks: 4, pages: 6 },
      { name: "memoria-3-antes-de-importar.json", when: t - 3 * 86400000, reason: "antes-de-importar", blocks: 2, pages: 1 },
    ];
  }

  async restoreVersion() {
    await wait(150);
    throw new Error("Na prévia as versões são só de exemplo.");
  }

  async backups() {
    await wait(150);
    return { available: true, folder: "share/memoria", backups: [{ name: "memoria-2026-10-12-2210.zip", size: 18400, date: Date.now() - 7 * 86400000 }] };
  }

  async createBackup() {
    await wait(300);
    return { name: "memoria-exemplo.zip", folder: "share/memoria" };
  }

  async restoreBackup() {
    await wait(150);
    throw new Error("Na prévia os backups são só de exemplo.");
  }

  async eraseAll() {
    await wait(150);
    this.data = { ...this.data, blocks: [], pages: [] };
    this.emit({ kind: "reset", data: this.data });
    return { blocks: 0, pages: 0 };
  }

  async extract({ text, images }) {
    await wait(1100);
    if (images && images.length) {
      return {
        provider: "Google AI Task",
        text: "Receita do bolo de cenoura da vó\n\n3 cenouras médias\n4 ovos\n1 xícara de óleo\n2 xícaras de açúcar\n2 xícaras de farinha\n1 colher de fermento\n\nBater tudo no liquidificador, menos a farinha e o fermento. Forno 180° por 40 min.",
      };
    }
    const lines = String(text || "")
      .split(/\n+/)
      .map((l) => l.replace(/^\[[^\]]*\]\s*[^:]+:\s*/, "").trim())
      .filter(Boolean);
    return { provider: "Google AI Task", text: lines.length > 1 ? `${lines[0]}\n\n${lines.slice(1).join("\n")}` : lines.join("\n") };
  }
}
