// What MemorIA shows at each moment of the day.
// Blocks can be tied to periods (manhã/tarde/noite, whose start times are
// configurable) and to exact times; single pages ("trechos") can have exact
// times too. The latest entry that already started wins, wrapping around
// midnight. Shared by the server (Home Assistant sensor) and the UI.

export const PERIODS = [
  { id: "manha", label: "Manhã", icon: "sunrise" },
  { id: "tarde", label: "Tarde", icon: "sun" },
  { id: "noite", label: "Noite", icon: "moon" },
];
export const DEFAULT_PERIODS = { manha: "05:00", tarde: "12:00", noite: "18:00" };
export const PAPERS = ["pautado", "quadriculado", "pontilhado", "liso"];

const pad = (n) => String(n).padStart(2, "0");
const TIME_RE = /^([01]?\d|2[0-3]):([0-5]\d)$/;

export const isTime = (t) => typeof t === "string" && TIME_RE.test(t);
export const normTime = (t) => {
  const m = TIME_RE.exec(t || "");
  return m ? `${pad(Number(m[1]))}:${m[2]}` : null;
};
export const toMin = (t) => {
  const m = TIME_RE.exec(t || "");
  return m ? Number(m[1]) * 60 + Number(m[2]) : null;
};
export const fmtMin = (min) => `${pad(Math.floor(min / 60))}:${pad(min % 60)}`;
export const minutesOf = (date) => date.getHours() * 60 + date.getMinutes();

export function periodTimes(data) {
  return { ...DEFAULT_PERIODS, ...((data && data.periods) || {}) };
}

/** Which period a minute of the day belongs to. */
export function periodAt(min, periods) {
  const starts = PERIODS.map((p) => ({ id: p.id, min: toMin(periods[p.id]) })).filter((p) => p.min != null);
  starts.sort((a, b) => a.min - b.min);
  let cur = starts[starts.length - 1];
  for (const s of starts) if (s.min <= min) cur = s;
  return cur ? cur.id : "manha";
}

const RANK = { page: 0, time: 1, period: 2 };

/** All entries of the day, sorted by start minute (pages beat exact times beat periods). */
export function buildSchedule(data) {
  const periods = periodTimes(data);
  const blocks = (data && data.blocks) || [];
  const order = new Map(blocks.map((b, i) => [b.id, b.order != null ? b.order : i]));
  const entries = [];
  for (const b of blocks) {
    for (const p of b.periods || []) {
      const min = toMin(periods[p]);
      if (min != null) entries.push({ min, block: b.id, page: null, kind: "period", period: p });
    }
    for (const t of b.times || []) {
      const min = toMin(t);
      if (min != null) entries.push({ min, block: b.id, page: null, kind: "time" });
    }
  }
  for (const pg of (data && data.pages) || []) {
    if (!order.has(pg.block)) continue;
    for (const t of pg.times || []) {
      const min = toMin(t);
      if (min != null) entries.push({ min, block: pg.block, page: pg.id, kind: "page" });
    }
  }
  entries.sort((a, b) => a.min - b.min || RANK[a.kind] - RANK[b.kind] || order.get(a.block) - order.get(b.block));
  // One entry per (minute, block, page).
  const seen = new Set();
  return entries.filter((e) => {
    const k = `${e.min}|${e.block}|${e.page || ""}`;
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}

/** Group of entries that is "on" at minute `min` (the latest start ≤ min, wrapping to yesterday). */
export function currentAt(entries, min) {
  if (!entries.length) return null;
  let start = null;
  for (const e of entries) if (e.min <= min) start = e.min;
  if (start == null) start = entries[entries.length - 1].min;
  const group = entries.filter((e) => e.min === start);
  return { min: start, entries: group, main: group[0] };
}

/** The next start after minute `min` (wrapping to tomorrow). */
export function nextAfter(entries, min) {
  if (!entries.length) return null;
  const starts = [...new Set(entries.map((e) => e.min))];
  const next = starts.find((s) => s > min);
  const at = next != null ? next : starts[0];
  if (starts.length === 1 && at <= min) return null; // only one slot, it is the current one
  const group = entries.filter((e) => e.min === at);
  return { min: at, entries: group, main: group[0], tomorrow: next == null };
}

/** One chip per start time for the day's timeline. */
export function timeline(entries) {
  const out = [];
  for (const e of entries) {
    const last = out[out.length - 1];
    if (last && last.min === e.min) last.entries.push(e);
    else out.push({ min: e.min, entries: [e], main: e });
  }
  return out;
}
