// A Memória da IA: o que a casa pediu para a IA lembrar em toda conversa. Uma lista só, da casa, compartilhada por todos os
// apps da família: fica na pasta share do Home Assistant (share/familia/memoria_ia.json), e não dentro de um app. Cada app
// tem o cartão Memória da IA (Configurações › Integrações), que lê e escreve aqui, e põe as frases na frente das instruções
// da IA dele. Funciona com um app só instalado.
//
// Arquivo igual nos apps em Node (tools/iguais.py); nos apps em Python, memoria_ia.py faz o mesmo. Só módulos do Node.
//
// O arquivo: {versao: 1, gravado_em, lista: [{id, texto, em, app, quem?}]} (até 60 frases de 240 letras; só do dono).
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

export const ARQUIVO = process.env.MEMORIA_IA_ARQ || "/share/familia/memoria_ia.json";
export const MAX_FRASES = 60;
export const MAX_LETRAS = 240;
export const TITULO = "O que a casa pediu para lembrar (preferências da casa; use quando tiver a ver com o que você está fazendo):";
const VALE_MS = 30 * 1000; // a lista lida fica guardada este tempo (outro app pode ter escrito)
const guardado = new Map(); // arquivo -> {em, lista}

/** O que dizer à pessoa. */
export class ErroMemoria extends Error {
  constructor(message) {
    super(message);
    this.code = "invalid_format";
  }
}

const pad = (n) => String(n).padStart(2, "0");
/** 2026-11-02T09:30:00-0300, como o memoria_ia.py. */
export function agoraIso(d = new Date()) {
  const o = -d.getTimezoneOffset();
  const s = o < 0 ? "-" : "+";
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}${s}${pad(Math.floor(Math.abs(o) / 60))}${pad(Math.abs(o) % 60)}`;
}

const um = (v) => String(v == null ? "" : v).replace(/\s+/g, " ").trim();
const novoId = () => crypto.randomBytes(4).toString("hex");

function limpa(lista) {
  const out = [];
  const vistos = new Set();
  for (const x of Array.isArray(lista) ? lista : []) {
    if (!x || typeof x !== "object" || Array.isArray(x)) continue;
    const texto = um(x.texto).slice(0, MAX_LETRAS);
    if (texto.length < 3 || vistos.has(texto.toLowerCase())) continue;
    vistos.add(texto.toLowerCase());
    const f = { id: String(x.id || novoId()).slice(0, 16), texto, em: String(x.em || "").slice(0, 40), app: String(x.app || "").slice(0, 30) };
    if (x.quem) f.quem = String(x.quem).slice(0, 60);
    out.push(f);
  }
  return out.slice(0, MAX_FRASES);
}

/** A lista de agora: [{id, texto, em, app, quem?}]. Sem o arquivo, ou com ele estragado, []. */
export function ler(arquivo = ARQUIVO, agora = Date.now(), fresco = false) {
  const g = guardado.get(arquivo);
  if (g && !fresco && agora - g.em >= 0 && agora - g.em < VALE_MS) return g.lista.map((x) => ({ ...x }));
  let lista = [];
  try {
    const v = JSON.parse(fs.readFileSync(arquivo, "utf8"));
    lista = limpa(v && typeof v === "object" ? v.lista : null);
  } catch {
    lista = [];
  }
  guardado.set(arquivo, { em: agora, lista });
  return lista.map((x) => ({ ...x }));
}

function gravar(arquivo, lista) {
  const tmp = `${arquivo}.${process.pid}.tmp`;
  try {
    fs.mkdirSync(path.dirname(arquivo), { recursive: true });
    fs.writeFileSync(tmp, JSON.stringify({ versao: 1, gravado_em: agoraIso(), lista }), { mode: 0o600 });
    fs.chmodSync(tmp, 0o600);
    fs.renameSync(tmp, arquivo);
  } catch (e) {
    throw new ErroMemoria(`Não consegui gravar a memória na pasta share (${e.code || e.message}).`);
  }
  guardado.set(arquivo, { em: Date.now(), lista });
}

/** Guarda uma frase (a mesma não entra duas vezes). Devolve a lista. ErroMemoria diz o que vale. */
export function lembrar(texto, app, quem = "", arquivo = ARQUIVO) {
  const t = um(texto).slice(0, MAX_LETRAS);
  if (t.length < 3) throw new ErroMemoria("Escreva o que é para lembrar.");
  const lista = ler(arquivo, Date.now(), true); // lê de novo: outro app pode ter escrito
  if (lista.some((x) => x.texto.toLowerCase() === t.toLowerCase())) return lista;
  if (lista.length >= MAX_FRASES) throw new ErroMemoria(`A memória já tem ${MAX_FRASES} frases. Apague alguma.`);
  const f = { id: novoId(), texto: t, em: agoraIso(), app: String(app || "") };
  if (quem) f.quem = String(quem).slice(0, 60);
  lista.push(f);
  gravar(arquivo, lista);
  return lista;
}

/** Tira uma frase pelo id. Devolve a lista. */
export function esquecer(id, arquivo = ARQUIVO) {
  const lista = ler(arquivo, Date.now(), true);
  const fica = lista.filter((x) => x.id !== String(id || ""));
  if (fica.length !== lista.length) gravar(arquivo, fica);
  return fica;
}

/** O bloco que vai na frente das instruções da IA ("" sem nada na memória). */
export function memoriaTexto(arquivo = ARQUIVO, agora = Date.now()) {
  const lista = ler(arquivo, agora);
  return lista.length ? `${TITULO}\n${lista.map((x) => `- ${x.texto}`).join("\n")}` : "";
}

/** O que a tela mostra: {lista, max}. */
export const estado = (arquivo = ARQUIVO) => ({ lista: ler(arquivo, Date.now(), true), max: MAX_FRASES });

/** Os comandos da tela (get, add {texto}, del {frase: o id dela}) -> {lista, max}. O id da mensagem é do WebSocket. */
export function comando(acao, msg, app, quem = "", arquivo = ARQUIVO) {
  if (acao === "add") lembrar(msg && msg.texto, app, quem, arquivo);
  else if (acao === "del") esquecer(msg && msg.frase, arquivo);
  return estado(arquivo);
}
