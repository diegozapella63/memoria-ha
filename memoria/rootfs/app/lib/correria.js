// The connection with the CorrerIA (the contact of CorrerIA Code on the WhatsApp, and the MCP server of the Claude
// and the Gemini): with Mais › Configurações › Integrações › CorrerIA on, this app writes share/memoria/correria.json
// ({app, nome, assunto, url, ip_url, chave, versao, ferramentas, gravado_em}; the same contract for every app of the
// family) and answers /api/integracao/ferramentas with Authorization: Bearer <chave>. The key is its own, in
// /data/correria.key. Off, the file is deleted and the route answers 401. The last use (who and when) goes to
// /data/correria-uso.json, for the screen.
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import crypto from "node:crypto";

export const ROUTE = "/api/integracao/ferramentas";
const ABOUT = { app: "memoria", nome: "MemorIA", assunto: "anotações em blocos (cadernos): folhas, categorias e links" };

const pad = (n) => String(n).padStart(2, "0");
/** Local time without the zone, like the other apps of the family ("2026-11-08T09:41:00"). */
export const localIso = (d = new Date()) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;

/** Writes a file only the owner reads (600), all at once (tmp + rename). */
export function writePrivate(file, text) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const tmp = `${file}.tmp`;
  fs.writeFileSync(tmp, text, { mode: 0o600 });
  fs.chmodSync(tmp, 0o600);
  fs.renameSync(tmp, file);
}

/** How the other apps reach this one on the internal network of Home Assistant: the name and, as a spare, the IP. */
export function addressOf(port, internalUrl = "") {
  if (internalUrl) return { url: internalUrl.replace(/\/+$/, ""), ip_url: null };
  let ip = null;
  for (const list of Object.values(os.networkInterfaces())) {
    const a = (list || []).find((x) => x.family === "IPv4" && !x.internal);
    if (a) {
      ip = a.address;
      break;
    }
  }
  return { url: `http://${os.hostname()}:${port}`, ip_url: ip ? `http://${ip}:${port}` : null };
}

/** The key of a connection (32 random bytes, urlsafe), made once and kept in a file only the owner reads. */
export function keyIn(file) {
  let k = "";
  try {
    k = fs.readFileSync(file, "utf8").trim();
  } catch (e) {
    /* first time */
  }
  if (k.length < 32) {
    k = crypto.randomBytes(32).toString("base64url");
    writePrivate(file, k);
  }
  return k;
}

/** Whether the request brings the key (compared in constant time). */
export function bearerIs(headers, key) {
  const h = String((headers && headers.authorization) || "");
  if (!h.startsWith("Bearer ")) return false;
  const digest = (s) => crypto.createHash("sha256").update(s).digest();
  return crypto.timingSafeEqual(digest(h.slice(7).trim()), digest(key));
}

export class Correria {
  constructor({ dataDir, shareDir, port, version, log, internalUrl = process.env.MEMORIA_URL_INTERNA || "" }) {
    this.keyFile = path.join(dataDir, "correria.key");
    this.useFile = path.join(dataDir, "correria-uso.json");
    this.shareFile = path.join(shareDir, "correria.json");
    this.port = port;
    this.version = version;
    this.log = log;
    this.internalUrl = internalUrl;
    this._key = "";
    this.last = null; // {cliente, em}
    try {
      const u = JSON.parse(fs.readFileSync(this.useFile, "utf8"));
      if (u && typeof u.cliente === "string" && typeof u.em === "string") this.last = { cliente: u.cliente.slice(0, 40), em: u.em.slice(0, 19) };
    } catch (e) {
      /* never used */
    }
  }

  /** The key of this connection (32 random bytes, urlsafe), made once and kept in /data/correria.key (600). */
  key() {
    if (!this._key) this._key = keyIn(this.keyFile);
    return this._key;
  }

  /** How the other apps reach this one on the internal network of Home Assistant: the name and, as a spare, the IP. */
  address() {
    return addressOf(this.port, this.internalUrl);
  }

  /** Writes (on) or deletes (off) share/memoria/correria.json. */
  publish(on) {
    try {
      if (!on) {
        fs.rmSync(this.shareFile, { force: true });
        return;
      }
      const body = { ...ABOUT, ...this.address(), chave: this.key(), versao: this.version, ferramentas: ROUTE, gravado_em: localIso() };
      writePrivate(this.shareFile, JSON.stringify(body, null, 1));
    } catch (err) {
      this.log.warn(`CorrerIA: não consegui gravar ${this.shareFile}: ${err.message}`);
    }
  }

  /** Whether the request brings the key (compared in constant time). */
  authorized(headers) {
    return bearerIs(headers, this.key());
  }

  /** A tool was called: who (the Claude, the Gemini, the WhatsApp…) and when, for the screen. */
  used(cliente) {
    const name = String(cliente || "").replace(/\s+/g, " ").trim().slice(0, 40) || "CorrerIA";
    this.last = { cliente: name, em: localIso() };
    try {
      writePrivate(this.useFile, JSON.stringify(this.last));
    } catch (err) {
      this.log.warn(`CorrerIA: não consegui guardar o último uso: ${err.message}`);
    }
    return this.last;
  }
}
