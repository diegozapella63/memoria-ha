// In-memory stand-in for the MemorIA server, used by the preview page.
// Mirrors the server's rules (ids, times, conflicts) closely enough for the UI.
import { DEFAULT_PERIODS, PAPERS, PERIODS, normTime } from "../../memoria/rootfs/app/lib/schedule.js";

const COLORS = ["vermelho", "coral", "rosa", "framboesa", "laranja", "ouro", "lilas", "azul", "menta", "grafite"];
const id = () => Math.random().toString(16).slice(2, 14).padEnd(12, "0");
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const clone = (x) => JSON.parse(JSON.stringify(x));
const times = (list) => [...new Set((list || []).map(normTime).filter(Boolean))].sort().slice(0, 24);

function sample() {
  const now = Date.now();
  const day = 86400000;
  const blocks = [
    { id: "treino00001", name: "Treino", color: "azul", paper: "quadriculado", periods: [], times: ["07:00"], order: 0 },
    { id: "trabalho001", name: "Trabalho", color: "laranja", paper: "pautado", periods: ["manha", "tarde"], times: [], order: 1 },
    { id: "diario00001", name: "Diário", color: "lilas", paper: "pautado", periods: ["noite"], times: ["22:00"], order: 2 },
    { id: "ideias00001", name: "Ideias", color: "menta", paper: "pontilhado", periods: [], times: [], order: 3 },
  ].map((b) => ({ ...b, created: now - 30 * day, updated: now - 2 * day }));
  const pg = (block, text, ago, extra = {}) => ({ id: id(), block, text, times: [], created: now - ago, updated: now - ago, ...extra });
  const pages = [
    pg("treino00001", "Treino A — peito e tríceps\n\nSupino reto 4x10 · 40 kg\nSupino inclinado 3x12\nCrucifixo 3x12\nTríceps corda 4x12\nPrancha 3x 45s\n\nSemana que vem: subir a carga do supino.", 3 * day),
    pg("treino00001", "Treino B — costas e bíceps\n\nPuxada frente 4x10\nRemada baixa 3x12\nRosca direta 3x10\nRosca martelo 3x12\nAbdominal 3x20", 1 * day),
    pg("trabalho001", "Semana\n\n- Revisar a proposta do cliente\n- Ligar para o contador\n- Mandar o orçamento da reforma\n- Fechar o relatório de outubro", 2 * day),
    pg("trabalho001", "Reunião das 10h\n\nPauta:\n1. Cronograma do projeto\n2. Orçamento de outubro\n3. Próximos passos\n\nLevar o notebook e o carregador.", 1 * day, { times: ["10:00"] }),
    pg("diario00001", "Domingo\n\nAlmoço com a família e à tarde arrumei a garagem. Achei a caixa de fotos antigas, vale separar umas para emoldurar.", 2 * day),
    pg("diario00001", "Hoje\n\nGratidão:\n• café da manhã com calma\n• terminei o painel da sala no Home Assistant\n• caminhada no fim da tarde\n\nAmanhã: acordar 6h30 e não pular o treino.", 6 * 3600000),
    pg("ideias00001", "Ideias para a casa\n\n- Sensor de presença no corredor\n- Luz da varanda acender no pôr do sol\n- Tablet na geladeira mostrando o MemorIA agora\n- Lembrete de regar as plantas às 18h", 4 * day),
  ];
  return { version: 1, periods: { ...DEFAULT_PERIODS }, app: {}, blocks, pages };
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
    return { version: "1.0.0", user: { name: "Diego Zapella" }, ai: { available: true, provider: "ha", text: true, images: true }, data: clone(this.data) };
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
    p.updated = now;
    this.emit({ kind: "page", page: p });
    return clone(p);
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
    if (!b) {
      b = { id: id(), created: now, order: d.blocks.length };
      d.blocks.push(b);
    }
    b.name = (input.name || "Novo bloco").slice(0, 60);
    b.color = COLORS.includes(input.color) ? input.color : "lilas";
    b.paper = PAPERS.includes(input.paper) ? input.paper : "pautado";
    b.periods = (input.periods || []).filter((p) => PERIODS.some((x) => x.id === p));
    b.times = times(input.times);
    b.updated = now;
    this.emit({ kind: "block", block: b });
    return clone(b);
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
    if (app) d.app = { ...d.app, ...app };
    const res = { periods: clone(d.periods), app: clone(d.app) };
    this.emit({ kind: "settings", ...res });
    return res;
  }

  async extract({ text, images }) {
    await wait(1100);
    if (images && images.length) {
      return {
        provider: "ha:ai_task.google_ai_task",
        text: "Receita do bolo de cenoura da vó\n\n3 cenouras médias\n4 ovos\n1 xícara de óleo\n2 xícaras de açúcar\n2 xícaras de farinha\n1 colher de fermento\n\nBater tudo no liquidificador, menos a farinha e o fermento. Forno 180° por 40 min.",
      };
    }
    const lines = String(text || "")
      .split(/\n+/)
      .map((l) => l.replace(/^\[[^\]]*\]\s*[^:]+:\s*/, "").trim())
      .filter(Boolean);
    return { provider: "ha:ai_task.google_ai_task", text: lines.length > 1 ? `${lines[0]}\n\n${lines.slice(1).join("\n")}` : lines.join("\n") };
  }
}
