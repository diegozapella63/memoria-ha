// An invented house for the tests (Ana and Beto): categories, blocks and sheets. Never data of the owner.
const DAY = 86400000;

export function casa(now = Date.UTC(2026, 10, 8, 13, 30)) {
  const categories = [
    { id: "catcasa0001", name: "Casa", color: "menta", order: 0, created: now - 40 * DAY, updated: now - 40 * DAY },
    { id: "catestudo01", name: "Estudos", color: "azul", order: 1, created: now - 40 * DAY, updated: now - 40 * DAY },
  ];
  const b = (id, name, color, extra = {}) => ({ id, name, color, paper: "pautado", periods: [], times: [], order: 0, created: now - 30 * DAY, updated: now - 2 * DAY, ...extra });
  const blocks = [
    b("mercado0001", "Mercado", "laranja", { order: 0, category: "catcasa0001", periods: ["manha"] }),
    b("reforma0001", "Reforma da cozinha", "coral", { order: 1, category: "catcasa0001" }),
    b("ingles00001", "Inglês", "azul", { order: 2, category: "catestudo01", times: ["19:30"] }),
    b("ideias00001", "Ideias soltas", "lilas", { order: 3 }),
  ];
  const p = (id, block, text, ago, extra = {}) => ({ id, block, text, times: [], created: now - ago, updated: now - ago, ...extra });
  const pages = [
    p("pg000000001", "mercado0001", "Lista da semana\n\n- Arroz e feijão\n- Café\n- Frutas para a Ana\n- Pão integral", 3 * DAY),
    p("pg000000002", "mercado0001", "Churrasco do Beto\n\nCarvão, sal grosso, linguiça e pão de alho.", 1 * DAY, { times: ["09:00"] }),
    p("pg000000003", "reforma0001", "Orçamentos\n\nMarceneiro: pedir até sexta.\nPiso: comparar duas lojas.", 5 * DAY),
    p("pg000000004", "ingles00001", "Aula 12\n\nPhrasal verbs: give up, look after, run out of.\n\nRevisar no sábado.", 2 * DAY),
    p("pg000000005", "ideias00001", "Viagem de férias\n\nPraia em janeiro ou serra em julho?", 7 * DAY),
    p("pg000000006", "ideias00001", "   ", 1 * DAY),
  ];
  return { version: 1, periods: { manha: "05:00", tarde: "12:00", noite: "18:00" }, app: {}, categories, blocks, pages };
}
