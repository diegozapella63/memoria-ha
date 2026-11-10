// Uso da IA (like the EconomIA): Home Assistant returns neither tokens nor cost,
// so the app counts its own calls to ai_task.generate_data and estimates the
// tokens from the size of the text (about 4 characters per token). Kept in
// /data/uso_ia.json (120 days of totals and the last 40 calls), shown in
// Mais › Integrações › Uso da IA and published as a sensor.
import fs from "node:fs";
import path from "node:path";

const DAYS = 120;
const LAST = 40;
const pad = (n) => String(n).padStart(2, "0");
const ymd = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const COUNTS = ["chamadas", "erros", "cota", "tokens", "imagens", "segundos"];

/** ok | cota (quota or rate limit) | formato (an answer that isn't the expected JSON) | erro. */
export function resultOf(err) {
  if (!err) return "ok";
  const m = `${err.code || ""} ${err.message || ""}`;
  if (/quota|cota|429|resource[_ ]?exhausted|rate.?limit|too many requests/i.test(m)) return "cota";
  if (/json|formato|unexpected token|parse/i.test(m)) return "formato";
  return "erro";
}

export class AiUsage {
  /** {dir, sensor: "sensor.x_ia_hoje", label: "CronologIA", rest, token, log, enabled: () => bool (Sensores no Home Assistant)} */
  constructor({ dir, sensor, label, rest, token, log, enabled = () => true }) {
    this.enabled = enabled;
    this.file = path.join(dir, "uso_ia.json");
    this.sensor = sensor;
    this.label = label;
    this.rest = rest;
    this.token = token;
    this.log = log;
    this.warnedDay = null;
  }

  read() {
    try {
      const u = JSON.parse(fs.readFileSync(this.file, "utf8"));
      return u && typeof u === "object" ? u : {};
    } catch (e) {
      return {};
    }
  }

  /** One call: kind (mensagem, fotos…), the AI entity, characters in and out, images, seconds, result. */
  record({ kind, entity, input = 0, output = 0, images = 0, seconds = 0, result = "ok" }) {
    try {
      const u = this.read();
      const days = (u.dias = u.dias && typeof u.dias === "object" ? u.dias : {});
      const day = ymd(new Date());
      const d = (days[day] = days[day] || {});
      const tokens = Math.round((Number(input) + Number(output)) / 4);
      const add = { chamadas: 1, tokens, imagens: images, segundos: Math.round(seconds * 10) / 10, erros: result === "ok" || result === "cota" ? 0 : 1, cota: result === "cota" ? 1 : 0 };
      for (const [k, v] of Object.entries(add)) d[k] = Math.round(((d[k] || 0) + v) * 10) / 10;
      const ia = entity || "padrão do Home Assistant";
      d.tipos = d.tipos || {};
      d.tipos[kind] = (d.tipos[kind] || 0) + 1;
      d.ias = d.ias || {};
      d.ias[ia] = (d.ias[ia] || 0) + 1;
      for (const k of Object.keys(days).sort().slice(0, -DAYS)) delete days[k];
      u.ultimas = [{ quando: new Date().toISOString(), tipo: kind, ia, resultado: result, segundos: add.segundos, tokens, imagens: images }, ...(Array.isArray(u.ultimas) ? u.ultimas : [])].slice(0, LAST);
      fs.mkdirSync(path.dirname(this.file), { recursive: true });
      const tmp = `${this.file}.tmp`;
      fs.writeFileSync(tmp, JSON.stringify(u));
      fs.renameSync(tmp, this.file);
    } catch (err) {
      this.log.warn(`Uso da IA: ${err.message}`);
    }
    this.publish().catch(() => {});
  }

  /** Today, the last 7 days, this month, the 7 days one by one and the last calls. */
  summary(now = new Date()) {
    const u = this.read();
    const days = u.dias || {};
    const today = ymd(now);
    const week = [];
    for (let i = 6; i >= 0; i--) week.push(ymd(new Date(now.getFullYear(), now.getMonth(), now.getDate() - i)));
    const sum = (keys) => {
      const t = { chamadas: 0, erros: 0, cota: 0, tokens: 0, imagens: 0, segundos: 0, tipos: {}, ias: {} };
      for (const k of keys) {
        const d = days[k] || {};
        for (const c of COUNTS) t[c] = Math.round((t[c] + (Number(d[c]) || 0)) * 10) / 10;
        for (const g of ["tipos", "ias"]) for (const [n, v] of Object.entries(d[g] || {})) t[g][n] = (t[g][n] || 0) + v;
      }
      return t;
    };
    const keys = Object.keys(days).sort();
    return {
      hoje: sum([today]),
      semana: sum(week),
      mes: sum(keys.filter((k) => k.slice(0, 7) === today.slice(0, 7))),
      dias: week.map((k) => ({ dia: k, chamadas: (days[k] || {}).chamadas || 0, erros: (days[k] || {}).erros || 0, cota: (days[k] || {}).cota || 0 })),
      ultimas: (Array.isArray(u.ultimas) ? u.ultimas : []).slice(0, 12),
      desde: keys[0] || null,
      sensor: this.sensor,
      sensor_on: !!this.enabled(),
    };
  }

  /** Sensores no Home Assistant turned off: the sensor goes away (the next publish brings it back). */
  async remove() {
    if (!this.rest || !this.token) return;
    try {
      await fetch(`${this.rest}/states/${this.sensor}`, { method: "DELETE", headers: { authorization: `Bearer ${this.token}` }, signal: AbortSignal.timeout(10000) });
    } catch (err) {
      /* offline: it goes with the next restart of Home Assistant */
    }
  }

  /** sensor.<app>_ia_hoje: today's calls, for a dashboard or an automation. */
  async publish() {
    if (!this.rest || !this.token || !this.enabled()) return;
    const r = this.summary();
    const h = r.hoje;
    const body = {
      state: h.chamadas,
      attributes: {
        friendly_name: `${this.label}: chamadas de IA hoje`,
        icon: "mdi:robot-outline",
        unit_of_measurement: "chamadas",
        state_class: "total_increasing",
        erros: h.erros,
        cota_excedida: h.cota,
        tokens_texto_estimados: h.tokens,
        imagens: h.imagens,
        por_tipo: h.tipos,
        ultimos_7_dias: r.semana.chamadas,
        este_mes: r.mes.chamadas,
        ultima_chamada: r.ultimas[0] ? r.ultimas[0].quando : null,
      },
    };
    try {
      const res = await fetch(`${this.rest}/states/${this.sensor}`, {
        method: "POST",
        headers: { authorization: `Bearer ${this.token}`, "content-type": "application/json" },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(10000),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
    } catch (err) {
      const day = ymd(new Date());
      if (this.warnedDay !== day) this.log.warn(`Sensor ${this.sensor}: ${err.message}`);
      this.warnedDay = day;
    }
  }
}
