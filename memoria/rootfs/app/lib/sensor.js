// Publishes sensor.memoria_agora in Home Assistant: the notebook (and page)
// that is "on" right now, so dashboards and automations can use it.
import { buildSchedule, currentAt, nextAfter, minutesOf, fmtMin, periodAt, periodTimes, PERIODS } from "./schedule.js";

const ENTITY = "sensor.memoria_agora";

export class Sensor {
  constructor({ store, log, restUrl, token, enabled }) {
    this.store = store;
    this.log = log;
    this.restUrl = restUrl;
    this.token = token;
    this.enabled = enabled;
    this.last = "";
    this.lastAt = 0;
    this.failures = 0;
  }

  state(now = new Date()) {
    const data = this.store.data;
    const entries = buildSchedule(data);
    const min = minutesOf(now);
    const cur = currentAt(entries, min);
    const nxt = nextAfter(entries, min);
    const period = periodAt(min, periodTimes(data));
    const block = cur ? this.store.block(cur.main.block) : null;
    let page = cur && cur.main.page ? this.store.page(cur.main.page) : null;
    if (!page && block) {
      const pages = data.pages.filter((p) => p.block === block.id).sort((a, b) => b.updated - a.updated);
      page = pages[0] || null;
    }
    const nextBlock = nxt ? this.store.block(nxt.main.block) : null;
    const text = page ? page.text : "";
    return {
      state: block ? block.name.slice(0, 250) : "Nenhum",
      attributes: {
        friendly_name: "MemorIA agora",
        icon: "mdi:notebook-heart-outline",
        periodo: (PERIODS.find((p) => p.id === period) || {}).label,
        desde: cur ? fmtMin(cur.min) : null,
        bloco_id: block ? block.id : null,
        pagina_id: page ? page.id : null,
        titulo: text.split("\n")[0].slice(0, 120),
        texto: text.slice(0, 4000),
        proximo: nextBlock ? `${fmtMin(nxt.min)} ${nextBlock.name}` : null,
      },
    };
  }

  async publish(force = false) {
    if (!this.enabled() || !this.token) return;
    const body = this.state();
    const key = JSON.stringify(body);
    // Re-send every 10 minutes even when nothing changed: states set through the
    // API disappear when Home Assistant restarts.
    if (!force && key === this.last && Date.now() - this.lastAt < 10 * 60 * 1000) return;
    try {
      const res = await fetch(`${this.restUrl}/states/${ENTITY}`, {
        method: "POST",
        headers: { authorization: `Bearer ${this.token}`, "content-type": "application/json" },
        body: key,
        signal: AbortSignal.timeout(15000),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      if (this.failures) this.log.info(`${ENTITY} publicado de novo`);
      this.failures = 0;
      this.last = key;
      this.lastAt = Date.now();
    } catch (err) {
      if (!this.failures++) this.log.warn(`Não consegui publicar ${ENTITY}: ${err.message}`);
    }
  }

  start() {
    clearInterval(this.timer);
    // The first publish waits for Home Assistant's time zone (see server.js);
    // this timer keeps it fresh and covers a slow websocket.
    this.timer = setInterval(() => this.publish(), 30000);
  }

  changed() {
    clearTimeout(this.debounce);
    this.debounce = setTimeout(() => this.publish(), 2000);
  }
}
