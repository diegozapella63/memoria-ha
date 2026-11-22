// As lembranças da casa (CorrerIA › Mais › Lembranças): o que a casa pediu para a IA lembrar em toda conversa, em todos os
// apps. O CorrerIA grava as frases em share/correria/lembrancas.json; aqui elas viram um bloco que vai na frente das
// instruções da IA (só com a opção CorrerIA ligada no app). Arquivo igual nos apps em Node (tools/iguais.py).
import fs from "node:fs";

export const LEMBRANCAS_ARQ = process.env.LEMBRANCAS_ARQ || "/share/correria/lembrancas.json";
export const TITULO = "O que a casa pediu para lembrar (preferências da casa; use quando tiver a ver com o que você está fazendo):";
const VALE_MS = 60 * 1000;
const guardado = new Map(); // arquivo -> {em, texto}

/** As frases do arquivo, limpas (até 60 de 240 letras); [] sem o arquivo ou com ele estragado. */
export function lerLembrancas(arq = LEMBRANCAS_ARQ) {
  try {
    const v = JSON.parse(fs.readFileSync(arq, "utf8"));
    const lista = Array.isArray(v && v.lembrancas) ? v.lembrancas : [];
    return lista.map((x) => String(x == null ? "" : x).replace(/\s+/g, " ").trim().slice(0, 240)).filter(Boolean).slice(0, 60);
  } catch {
    return [];
  }
}

/** O bloco para as instruções da IA ("" sem lembranças); relido no máximo uma vez por minuto. */
export function lembrancasTexto(arq = LEMBRANCAS_ARQ, agora = Date.now()) {
  const g = guardado.get(arq);
  if (g && agora - g.em < VALE_MS) return g.texto;
  const lista = lerLembrancas(arq);
  const texto = lista.length ? `${TITULO}\n${lista.map((x) => `- ${x}`).join("\n")}` : "";
  guardado.set(arq, { em: agora, texto });
  return texto;
}
