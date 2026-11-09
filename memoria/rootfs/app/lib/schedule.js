// What MemorIA shows at each moment of the day.
// Blocks can be tied to periods (manhã/tarde/noite, whose start times are
// configurable) and to exact times; single pages ("trechos") can have exact
// times too. The latest entry that already started wins, wrapping around
// midnight, until the next start or, with "Fica no Agora" (dur, 1.14.0), for
// that long: then nothing holds until the next start. Shared by the server
// (Home Assistant sensor) and the UI.

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
/** Fica no Agora: how long a start holds, in minutes (0: until the next start). */
export const DURATIONS = [0, 60, 120, 180, 240, 360, 480];
export const durOf = (x) => (x && DURATIONS.includes(x.dur) ? x.dur : 0);
/** How long a group of the same start holds: the longest of its entries (one until the next: until the next). */
export const groupDur = (group) => (group.some((e) => !e.dur) ? 0 : Math.max(...group.map((e) => e.dur)));
export const minutesOf = (date) => date.getHours() * 60 + date.getMinutes();

export function periodTimes(data) {
  return { ...DEFAULT_PERIODS, ...((data && data.periods) || {}) };
}

const foldName = (s) =>
  String(s || "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
export const sameName = (a, b) => foldName(a) === foldName(b);

/** De quem é: the name of a person of the house, or "" (everyone's; "Todos" is everyone's too). */
export const ownerName = (v) => {
  const s = typeof v === "string" ? v.replace(/\s+/g, " ").trim().slice(0, 80) : "";
  return foldName(s) === "todos" ? "" : s;
};

/**
 * Whether a block opens by itself in the Agora of a person: never when archived; a block with an owner (De quem é)
 * only for that person. person "": nobody in particular (a shared tablet, the sensor): every block not archived.
 */
export const opensFor = (b, person = "") => !!b && !b.archived && (!person || !b.owner || sameName(b.owner, person));

/** Which period a minute of the day belongs to. */
export function periodAt(min, periods) {
  const starts = PERIODS.map((p) => ({ id: p.id, min: toMin(periods[p.id]) })).filter((p) => p.min != null);
  starts.sort((a, b) => a.min - b.min);
  let cur = starts[starts.length - 1];
  for (const s of starts) if (s.min <= min) cur = s;
  return cur ? cur.id : "manha";
}

const RANK = { page: 0, time: 1, period: 2 };

/**
 * All entries of the day, sorted by start minute (pages beat exact times beat periods). Archived blocks are left out;
 * person: only that person's blocks and everyone's (opensFor).
 */
export function buildSchedule(data, { person = "" } = {}) {
  const periods = periodTimes(data);
  // without Controle por pessoa (Mais › Configurações › Opções, 1.11.0), every block is everyone's
  const who = data && data.app && data.app.owners_off === true ? "" : person;
  const blocks = ((data && data.blocks) || []).filter((b) => opensFor(b, who));
  const order = new Map(blocks.map((b, i) => [b.id, b.order != null ? b.order : i]));
  const entries = [];
  for (const b of blocks) {
    for (const p of b.periods || []) {
      const min = toMin(periods[p]);
      if (min != null) entries.push({ min, block: b.id, page: null, kind: "period", period: p, dur: durOf(b) });
    }
    for (const t of b.times || []) {
      const min = toMin(t);
      if (min != null) entries.push({ min, block: b.id, page: null, kind: "time", dur: durOf(b) });
    }
  }
  for (const pg of (data && data.pages) || []) {
    if (!order.has(pg.block)) continue;
    for (const t of pg.times || []) {
      const min = toMin(t);
      if (min != null) entries.push({ min, block: pg.block, page: pg.id, kind: "page", dur: durOf(pg) });
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

/**
 * Group of entries that is "on" at minute `min` (the latest start ≤ min, wrapping to yesterday), with `end` (the minute
 * it stops, or null: until the next start). An entry past its Fica no Agora leaves the group; none left, nothing holds
 * (null) until the next start.
 */
export function currentAt(entries, min) {
  if (!entries.length) return null;
  let start = null;
  for (const e of entries) if (e.min <= min) start = e.min;
  if (start == null) start = entries[entries.length - 1].min;
  const since = (min - start + 1440) % 1440;
  const group = entries.filter((e) => e.min === start && (!e.dur || since < e.dur));
  if (!group.length) return null;
  const dur = groupDur(group);
  return { min: start, entries: group, main: group[0], end: dur ? (start + dur) % 1440 : null };
}

/** The next start after minute `min` (wrapping to tomorrow). */
export function nextAfter(entries, min) {
  if (!entries.length) return null;
  const starts = [...new Set(entries.map((e) => e.min))];
  const next = starts.find((s) => s > min);
  const at = next != null ? next : starts[0];
  // only one slot: it is the current one all day (from yesterday, until it comes again), unless its time is over
  if (starts.length === 1 && currentAt(entries, min)) return null;
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

/**
 * From now on: the group that holds at minute `min` first, then the next start times, wrapping past midnight (at most
 * n groups, none twice). The first has now (and yesterday, when it started before midnight; end, when it has a Fica no
 * Agora); the others, tomorrow when their time already passed today. Nothing holding now: only the next ones.
 */
export function ahead(entries, min, n = 3) {
  const groups = timeline(entries);
  if (!groups.length) return [];
  const cur = currentAt(entries, min);
  let at = cur ? groups.findIndex((g) => g.min === cur.min) : groups.findIndex((g) => g.min > min);
  if (at < 0) at = 0;
  const out = [];
  for (let k = 0; k < Math.min(n, groups.length); k++) {
    const g = groups[(at + k) % groups.length];
    out.push(k === 0 && cur ? { ...g, now: true, yesterday: g.min > min, tomorrow: false, end: cur.end } : { ...g, now: false, yesterday: false, tomorrow: g.min <= min });
  }
  return out;
}

/**
 * The time a start comes (or came) as "AAAA-MM-DDTHH:MM", in local time: the one holding now started today or, before
 * midnight, yesterday; any other is the next time it comes (today or tomorrow). The marks of the Agora are of it.
 */
export function occurrence(startMin, now = new Date(), current = true) {
  const min = minutesOf(now);
  const d = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  if (current && startMin > min) d.setDate(d.getDate() - 1);
  if (!current && startMin <= min) d.setDate(d.getDate() + 1);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${fmtMin(startMin)}`;
}
