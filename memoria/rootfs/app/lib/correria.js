// The connection with the CorrerIA (the contact of CorrerIA Code on the WhatsApp, and the MCP server the Claude and
// the Gemini connect to): with Mais › Configurações › Integrações › CorrerIA on (off by default), the app writes
// share/<app>/correria.json ({app, nome, assunto, url, ip_url, chave, versao, ferramentas, gravado_em}: the same
// contract for every app of the family, see the AGENTS.md of the CorrerIA) and answers /api/integracao/ferramentas
// with "Authorization: Bearer <chave>". The key is its own, kept in /data/correria.key (600). Off: the file goes away
// and no key works (401). The last use (who, when and which tool) goes to /data/correria-uso.json, for the screen.
// The same file in the ResolvIA, the CronologIA and the MemorIA (tools/iguais.py): what changes is in the options.
// The helpers (writePrivate, keyIn, addressOf, bearerIs, localIso) also serve the share/<app>/integracao.json.
import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

export const ROTA = "/api/integracao/ferramentas";

const pad = (n) => String(n).padStart(2, "0");
/** "2026-11-08T09:41:00": the local time (the time of the house), as the other apps write it. */
export const localIso = (d = new Date()) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;

/** Writes a file only the owner reads (600), all at once (tmp + rename). */
export function writePrivate(file, text) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const tmp = path.join(path.dirname(file), `.${path.basename(file)}.tmp`);
  fs.writeFileSync(tmp, text, { mode: 0o600 });
  fs.chmodSync(tmp, 0o600);
  fs.renameSync(tmp, file);
}

/** The first IPv4 address of this container that is not the loopback (the internal network of the apps), or null. */
export function ipOf(nets = os.networkInterfaces()) {
  for (const list of Object.values(nets || {})) for (const n of list || []) if (n && (n.family === "IPv4" || n.family === 4) && !n.internal) return n.address;
  return null;
}

/** {url, ip_url}: how the other apps reach this one, by its name on the network of the apps and, as a spare, by its
 * address. url: an address given by hand (the *_URL_INTERNA of development), used as it is. */
export function addressOf(port, url = "", host = () => os.hostname(), ip = () => ipOf()) {
  if (url) return { url: url.replace(/\/+$/, ""), ip_url: null };
  const a = ip();
  return { url: `http://${host()}:${port}`, ip_url: a ? `http://${a}:${port}` : null };
}

/** The key of a connection (32 random bytes, urlsafe), made once and kept in a file only the owner reads. */
export function keyIn(file) {
  let k = "";
  try {
    k = fs.readFileSync(file, "utf8").trim();
  } catch {
    /* the first time */
  }
  if (k.length < 32) {
    k = crypto.randomBytes(32).toString("base64url");
    writePrivate(file, k);
  }
  try {
    fs.chmodSync(file, 0o600);
  } catch {
    /* the file system may not keep modes */
  }
  return k;
}

/** The same key? Compared in constant time (the hashes have the same length, whatever was sent). */
export function sameKey(given, key) {
  if (typeof given !== "string" || typeof key !== "string" || !key) return false;
  const digest = (s) => crypto.createHash("sha256").update(s).digest();
  return crypto.timingSafeEqual(digest(given), digest(key));
}

/** The request brings the key ("Authorization: Bearer <key>")? */
export function bearerIs(headers, key) {
  const h = String((headers && headers.authorization) || "");
  return h.startsWith("Bearer ") && sameKey(h.slice(7).trim(), key);
}

/** The last use kept on disk, checked ({cliente, em, nome}), or null. Also reads the name of before (correria_uso.json). */
function readUse(files) {
  for (const f of files) {
    try {
      const u = JSON.parse(fs.readFileSync(f, "utf8"));
      if (u && typeof u.cliente === "string" && Number.isFinite(Date.parse(u.em))) return { cliente: u.cliente.slice(0, 40), em: u.em, nome: String(u.nome || "").slice(0, 40) };
    } catch {
      /* never used */
    }
  }
  return null;
}

export class Correria {
  /**
   * about: {app, nome, assunto}, what goes in the file (app: the id, the prefix of the tools). dir: the folder of this
   * app in share (share/<app>). enabled(): the switch is on. url: the address the other apps use (the *_URL_INTERNA of
   * development; none: the name of this machine and the port). host and ip: the tests swap them. onUse(): a tool was used.
   */
  constructor({ about, dir, dataDir, port, version, log, enabled = () => false, url = "", host = () => os.hostname(), ip = () => ipOf(), onUse = () => {} }) {
    this.about = { app: about.app, nome: about.nome, assunto: about.assunto };
    this.keyFile = path.join(dataDir, "correria.key");
    this.useFile = path.join(dataDir, "correria-uso.json");
    this.file = path.join(dir, "correria.json");
    this.port = port;
    this.version = version;
    this.log = log;
    this.enabled = enabled;
    this.url = url;
    this.host = host;
    this.ip = ip;
    this.onUse = onUse;
    this.key = null;
    this.warned = false;
    this.last = readUse([this.useFile, path.join(dataDir, "correria_uso.json")]); // {cliente, em, nome}
  }

  /** The key of this connection, made once and kept in /data/correria.key (600). */
  chave() {
    if (!this.key) this.key = keyIn(this.keyFile);
    return this.key;
  }

  /** {url, ip_url}: how the other apps reach this one. */
  address() {
    return addressOf(this.port, this.url, this.host, this.ip);
  }

  /** Writes (on) or removes (off) share/<app>/correria.json, atomically and only for the owner (600). True when written. */
  publish() {
    try {
      if (!this.enabled()) {
        fs.rmSync(this.file, { force: true });
        return false;
      }
      const body = { ...this.about, ...this.address(), chave: this.chave(), versao: this.version, ferramentas: ROTA, gravado_em: localIso() };
      writePrivate(this.file, JSON.stringify(body, null, 1));
      this.warned = false;
      return true;
    } catch (err) {
      if (!this.warned) this.log.warn(`CorrerIA: não consegui gravar ${this.file}: ${err.message}`);
      this.warned = true;
      return false;
    }
  }

  /** On, but the file is gone (removed by hand, a share folder restored): write it again. */
  ensure() {
    if (this.enabled() && !fs.existsSync(this.file)) this.publish();
  }

  /** On, and the header carries this key ("Bearer <key>"); off, no key works. */
  authorized(headers) {
    return this.enabled() && bearerIs(headers, this.chave());
  }

  /** A tool was used: who (Claude, Gemini, WhatsApp, CorrerIA), when and which tool, for the screen. Gives it back. */
  used(cliente, nome) {
    const who = String(cliente || "").replace(/\s+/g, " ").trim().slice(0, 40);
    this.last = { cliente: who || "CorrerIA", em: localIso(), nome: String(nome || "").slice(0, 40) };
    try {
      writePrivate(this.useFile, JSON.stringify(this.last));
    } catch {
      /* only the screen misses it */
    }
    this.onUse();
    return this.last;
  }

  /** What the screen shows (Mais › Configurações › Integrações › CorrerIA). */
  state() {
    return { on: this.enabled(), ultimo: this.last };
  }
}
