import { LitElement, html, nothing, repeat, live, unsafeSVG } from "../vendor/lit-all.min.js";
import { ICONS } from "./icons.js";
import { ensureFonts } from "./fonts.js";
import { styles, notebookStyles } from "./styles.js";
import { PALETTE, colorById, colorVars, hexToRgba, fold, foldKeepLength, plural, clip, writtenAt, newId, firstLine, prepareImage } from "./util.js";
import { parentHass, detectDark } from "./api.js";
import { PERIODS, PAPERS, buildSchedule, currentAt, nextAfter, timeline, minutesOf, fmtMin, periodAt, periodTimes, normTime } from "../../memoria/rootfs/app/lib/schedule.js";

const THEME_KEY = "memoria.theme";
const SAVE_DELAY = 600;
const TURN_MS = 600;
const PAPER_LABEL = { pautado: "Pautado", quadriculado: "Quadriculado", pontilhado: "Pontilhado", liso: "Liso" };
const RINGS = Array.from({ length: 14 }, () => html`<i></i>`);

const icon = (name, cls = "") =>
  html`<svg class="i ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${unsafeSVG(ICONS[name] || ICONS.notebook)}</svg>`;

const local = {
  get(key, fallback) {
    try {
      const v = localStorage.getItem(key);
      return v == null ? fallback : JSON.parse(v);
    } catch (e) {
      return fallback;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      /* private mode etc. */
    }
  },
};

const byCreated = (a, b) => a.created - b.created || (a.id < b.id ? -1 : 1);
const periodOf = (id) => PERIODS.find((p) => p.id === id);
const reduceMotion = () => !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);

class MemoriaApp extends LitElement {
  static properties = {
    api: { attribute: false },
    env: { attribute: false },
    _data: { state: true },
    _ready: { state: true },
    _bootError: { state: true },
    _online: { state: true },
    _path: { state: true },
    _sheet: { state: true },
    _form: { state: true },
    _toast: { state: true },
    _query: { state: true },
    _theme: { state: true },
    _cam: { state: true },
    _pad: { state: true },
    _turn: { state: true },
    _peek: { state: true },
    _choice: { state: true },
    _now: { state: true },
    _dark: { state: true },
  };

  static styles = [styles, notebookStyles];

  constructor() {
    super();
    this.api = null;
    this.env = null;
    this._data = null;
    this._ready = false;
    this._bootError = null;
    this._online = true;
    this._path = (history.state && history.state.rvPath) || "";
    this._sheet = null;
    this._form = null;
    this._toast = null;
    this._query = "";
    this._theme = local.get(THEME_KEY, "auto");
    this._cam = null;
    this._pad = null;
    this._turn = null;
    this._peek = null;
    this._choice = null;
    this._now = Date.now();
    this._dark = false;
    this._user = { name: "" };
    this._ai = { available: false };
    this._version = "";
    this._saving = new Map(); // page id -> {timer, inflight, dirty, sentText}
    this._base = new Map(); // page id -> `updated` the server last confirmed
    this._dropped = new Set(); // pages deleted here, ignore late echoes
    this._slotKey = null;
    this._lastTyped = 0;
    this._cache = { data: null, pages: new Map(), schedule: [] };
    this._onPopState = this._onPopState.bind(this);
    this._onVisible = this._onVisible.bind(this);
    this._mql = window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null;
    this._onScheme = () => this._syncDark();
  }

  // ------------------------------------------------------------ lifecycle

  connectedCallback() {
    super.connectedCallback();
    ensureFonts();
    window.addEventListener("popstate", this._onPopState);
    document.addEventListener("visibilitychange", this._onVisible);
    if (this._mql && this._mql.addEventListener) this._mql.addEventListener("change", this._onScheme);
    this._tickTimer = setInterval(() => this._tick(), 20000);
    this._themeTimer = setInterval(() => this._syncDark(), 3000);
    this._syncDark();
    if (this.api && !this._started) this._start();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener("popstate", this._onPopState);
    document.removeEventListener("visibilitychange", this._onVisible);
    if (this._mql && this._mql.removeEventListener) this._mql.removeEventListener("change", this._onScheme);
    clearInterval(this._tickTimer);
    clearInterval(this._themeTimer);
    clearTimeout(this._toastTimer);
    clearTimeout(this._turnTimer);
    this._stopStream();
    for (const id of [...this._saving.keys()]) this._flushSave(id);
  }

  willUpdate(changed) {
    if (changed.has("api") && this.api && !this._started && this.isConnected) this._start();
    if (this._data && this._cache.data !== this._data) this._reindex();
  }

  updated(changed) {
    this.toggleAttribute("dark", this._dark);
    if (this._turn && changed.has("_turn")) {
      const el = this.renderRoot.querySelector(".turn .face.front .ink");
      if (el) el.scrollTop = this._turn.snap.scroll || 0;
    }
    if (changed.has("_path") && this._view().name === "search") {
      const input = this.renderRoot.querySelector(".search-box input");
      if (input) input.focus({ preventScroll: true });
    }
    if (this._scrollChip) {
      this._scrollChip = false;
      const chip = this.renderRoot.querySelector(".tchip.on, .tchip.peek");
      if (chip && chip.scrollIntoView) chip.scrollIntoView({ inline: "center", block: "nearest", behavior: "instant" });
    }
  }

  _onVisible() {
    if (document.visibilityState === "visible") {
      this._syncDark();
      this._tick();
    } else {
      for (const [id, s] of this._saving) if (s.timer) this._flushSave(id);
    }
  }

  _syncDark() {
    let dark;
    if (this._theme === "dark") dark = true;
    else if (this._theme === "light") dark = false;
    else dark = detectDark();
    if (dark !== this._dark) this._dark = dark;
  }

  _setTheme(theme) {
    this._theme = theme;
    local.set(THEME_KEY, theme);
    this._syncDark();
  }

  // ------------------------------------------------------------ data

  async _start() {
    this._started = true;
    this.api.onStatus((up) => {
      this._online = up;
    });
    this.api.onReconnect(() => this._boot(true));
    await this._boot(false);
    this.api.subscribe((ev) => this._onEvent(ev)).catch(() => {});
  }

  async _boot(again) {
    try {
      const res = await this.api.bootstrap();
      this._version = res.version || "";
      this._user = res.user || { name: "" };
      this._ai = res.ai || { available: false };
      const data = res.data;
      // Keep what is still being typed here.
      const pages = data.pages.filter((p) => !this._dropped.has(p.id));
      for (const p of pages) if (!this._isDirty(p.id)) this._base.set(p.id, p.updated);
      for (const [id, s] of this._saving) {
        const mine = this._page(id);
        if (!mine || !(s.dirty || s.inflight)) continue;
        const i = pages.findIndex((p) => p.id === id);
        if (i >= 0) pages[i] = { ...pages[i], text: mine.text };
        else pages.push(mine);
      }
      this._data = { ...data, pages };
      this._ready = true;
      this._bootError = null;
      if (!this._pad || !this._block(this._pad.block)) this._enterView();
      if (again) for (const [id, s] of this._saving) if (s.dirty) this._flushSave(id);
      this._tick();
    } catch (err) {
      if (!this._ready) this._bootError = err.message || String(err);
      if (!again) setTimeout(() => this._boot(false), 3000);
    }
  }

  _reindex() {
    const pages = new Map();
    for (const p of this._data.pages) {
      if (!pages.has(p.block)) pages.set(p.block, []);
      pages.get(p.block).push(p);
    }
    for (const list of pages.values()) list.sort(byCreated);
    this._cache = { data: this._data, pages, schedule: buildSchedule(this._data) };
  }

  _blocks() {
    return [...((this._data && this._data.blocks) || [])].sort((a, b) => a.order - b.order || a.created - b.created);
  }

  _block(id) {
    return this._data && this._data.blocks.find((b) => b.id === id);
  }

  _page(id) {
    return this._data && this._data.pages.find((p) => p.id === id);
  }

  _pagesOf(blockId) {
    if (this._data && this._cache.data !== this._data) this._reindex();
    return this._cache.pages.get(blockId) || [];
  }

  _schedule() {
    if (this._data && this._cache.data !== this._data) this._reindex();
    return this._cache.schedule;
  }

  _app(key, fallback) {
    const v = this._data && this._data.app ? this._data.app[key] : undefined;
    return v === undefined ? fallback : v;
  }

  _accent() {
    return colorById(this._app("accent", "lilas")) || PALETTE[6];
  }

  _colorOf(block) {
    return (block && colorById(block.color)) || PALETTE[6];
  }

  _cv(block) {
    return colorVars(this._colorOf(block), this._dark);
  }

  _putPage(page) {
    const pages = this._data.pages.slice();
    const i = pages.findIndex((p) => p.id === page.id);
    if (i >= 0) pages[i] = page;
    else pages.push(page);
    this._data = { ...this._data, pages };
  }

  _removePage(id) {
    this._data = { ...this._data, pages: this._data.pages.filter((p) => p.id !== id) };
  }

  _putBlock(block) {
    const blocks = this._data.blocks.slice();
    const i = blocks.findIndex((b) => b.id === block.id);
    if (i >= 0) blocks[i] = block;
    else blocks.push(block);
    this._data = { ...this._data, blocks };
  }

  _isDirty(id) {
    const s = this._saving.get(id);
    return !!(s && (s.dirty || s.inflight || s.timer));
  }

  _onEvent(ev) {
    if (!this._data || !ev) return;
    if (ev.kind === "page") {
      const p = ev.page;
      if (this._dropped.has(p.id)) return;
      const mine = this._page(p.id);
      if (this._isDirty(p.id) && mine) {
        // Typing here: keep our text. If another device changed it, our next
        // save is rejected as a conflict and both versions are kept.
        if (p.text === mine.text) this._putPage({ ...p });
        return;
      }
      this._base.set(p.id, p.updated);
      this._putPage(p);
    } else if (ev.kind === "page_deleted") {
      this._dropPageLocally(ev.id);
    } else if (ev.kind === "block") {
      this._putBlock(ev.block);
    } else if (ev.kind === "block_deleted") {
      this._data = {
        ...this._data,
        blocks: this._data.blocks.filter((b) => b.id !== ev.id),
        pages: this._data.pages.filter((p) => p.block !== ev.id),
      };
      if (this._pad && this._pad.block === ev.id) {
        if (this._view().name === "block") this._go("/blocos", true);
        else this._enterView();
      }
    } else if (ev.kind === "settings") {
      this._data = { ...this._data, periods: ev.periods, app: ev.app };
    }
    this._tick();
  }

  _dropPageLocally(id) {
    const s = this._saving.get(id);
    if (s) clearTimeout(s.timer);
    this._saving.delete(id);
    this._base.delete(id);
    const page = this._page(id);
    if (!page) return;
    this._removePage(id);
    if (this._pad && this._pad.page === id) {
      const list = this._pagesOf(page.block);
      const before = list.filter((p) => byCreated(p, page) < 0);
      this._pad = { ...this._pad, page: before.length ? before[before.length - 1].id : list.length ? list[0].id : "new" };
    }
  }

  // ------------------------------------------------------------ saving

  _onInk(ev) {
    const text = ev.target.value;
    const pad = this._pad;
    if (!pad) return;
    this._lastTyped = Date.now();
    let page = pad.page !== "new" ? this._page(pad.page) : null;
    if (!page) {
      if (!text.trim()) return;
      const now = Date.now();
      page = { id: newId(), block: pad.block, text, times: [], created: now, updated: now };
      this._putPage(page);
      this._pad = { ...pad, page: page.id };
    } else {
      this._putPage({ ...page, text });
    }
    this._queueSave(page.id);
  }

  _queueSave(id, delay = SAVE_DELAY) {
    const s = this._saving.get(id) || { timer: null, inflight: false, dirty: false };
    s.dirty = true;
    clearTimeout(s.timer);
    s.timer = setTimeout(() => this._flushSave(id), delay);
    this._saving.set(id, s);
  }

  async _flushSave(id) {
    const s = this._saving.get(id);
    if (!s) return;
    clearTimeout(s.timer);
    s.timer = null;
    if (s.inflight || !s.dirty) return;
    const page = this._page(id);
    if (!page) {
      this._saving.delete(id);
      return;
    }
    s.dirty = false;
    s.inflight = true;
    s.sentText = page.text;
    const payload = { id, block: page.block, text: page.text };
    if (this._base.has(id)) payload.base = this._base.get(id);
    else payload.created = page.created;
    let retry = false;
    try {
      const saved = await this.api.savePage(payload);
      this._base.set(id, saved.updated);
      const cur = this._page(id);
      if (cur && !this._dropped.has(id)) this._putPage({ ...saved, text: cur.text, times: cur.times, block: cur.block });
    } catch (err) {
      if (err.code === "conflict" && err.page) this._resolveConflict(id, err.page, s);
      else if (err.code === "disconnected") s.dirty = true;
      else {
        s.dirty = true;
        this._showToast(`Não consegui salvar a folha: ${err.message}`);
      }
      retry = err.code !== "disconnected" && err.code !== "conflict";
    } finally {
      s.inflight = false;
    }
    if (s.deleteAfter) {
      this._saving.delete(id);
      this.api.deletePage(id).catch(() => {});
      return;
    }
    if (s.dirty && this._online && !retry) this._queueSave(id, 200);
    else if (!s.dirty && !s.timer) this._saving.delete(id);
  }

  _resolveConflict(id, server, s) {
    const mine = this._page(id);
    const myText = mine ? mine.text : "";
    s.dirty = false;
    this._base.set(id, server.updated);
    this._putPage(server);
    if (myText.trim() && myText !== server.text) {
      const now = Date.now();
      const copy = { id: newId(), block: server.block, text: myText, times: [], created: now, updated: now };
      this._putPage(copy);
      this._queueSave(copy.id, 0);
      this._showToast("Esta folha mudou em outro aparelho. Sua versão virou uma folha nova.", {
        label: "Ver",
        run: () => this._openPage(server.block, copy.id),
      });
    }
  }

  /** Save page fields other than the text (times, block) right away. */
  async _savePageMeta(id, changes) {
    const page = this._page(id);
    if (!page) return null;
    this._putPage({ ...page, ...changes });
    const s = this._saving.get(id);
    if (s && (s.timer || s.dirty)) await this._flushSave(id);
    try {
      const saved = await this.api.savePage({ id, block: page.block, ...changes, ...(this._base.has(id) ? {} : { text: page.text, created: page.created }) });
      this._base.set(id, saved.updated);
      const cur = this._page(id);
      this._putPage({ ...saved, text: cur ? cur.text : saved.text });
      return saved;
    } catch (err) {
      this._putPage(page);
      this._showToast(`Não consegui salvar: ${err.message}`);
      return null;
    }
  }

  _deletePage(id) {
    const s = this._saving.get(id);
    const known = this._base.has(id);
    this._dropped.add(id);
    this._dropPageLocally(id);
    if (s && s.inflight) {
      s.deleteAfter = true;
      this._saving.set(id, s);
      return;
    }
    if (known) this.api.deletePage(id).catch(() => {});
  }

  /** Leaving a page: save it now, and throw away blank pages. */
  _leave(pad) {
    if (!pad || !pad.page || pad.page === "new") return;
    const p = this._page(pad.page);
    if (!p) return;
    if (!p.text.trim() && !(p.times || []).length) this._deletePage(p.id);
    else if (this._saving.has(p.id)) this._flushSave(p.id);
  }

  // ------------------------------------------------------------ the pad

  _lastPad(blockId) {
    const list = this._pagesOf(blockId);
    return { block: blockId, page: list.length ? list[list.length - 1].id : "new" };
  }

  _setPad(pad, { keepTurn = false } = {}) {
    const old = this._pad;
    if (old && pad && old.block === pad.block && old.page === pad.page) return;
    if (!keepTurn) {
      clearTimeout(this._turnTimer);
      this._turn = null;
      this._pendingPad = null;
    }
    this._pad = pad;
    if (old) this._leave(old);
  }

  _padEntryPad(e) {
    if (!e) return null;
    if (e.page && this._page(e.page)) return { block: e.block, page: e.page };
    return this._lastPad(e.block);
  }

  _slot() {
    const entries = this._schedule();
    const min = minutesOf(new Date(this._now));
    return { entries, min, cur: currentAt(entries, min), next: nextAfter(entries, min) };
  }

  _keyOf(e) {
    return e ? `${e.min}|${e.block}|${e.page || ""}` : "";
  }

  _pickIn(group) {
    if (!group) return null;
    return group.entries.find((e) => this._keyOf(e) === this._choice) || group.main;
  }

  _nowPad() {
    const { cur } = this._slot();
    if (this._peek) {
      const p = this._padEntryPad(this._pickIn(this._peek));
      if (p) return p;
    }
    if (cur) return this._padEntryPad(this._pickIn(cur));
    // Nothing scheduled: the notebook written in most recently.
    const recent = [...this._data.pages].sort((a, b) => b.updated - a.updated)[0];
    const block = (recent && this._block(recent.block)) || this._blocks()[0];
    return block ? this._lastPad(block.id) : null;
  }

  _enterView() {
    if (!this._data) return;
    const v = this._view();
    if (v.name === "block") {
      if (!this._block(v.id)) return;
      const want = this._openAt && this._openAt.block === v.id ? this._openAt.page : null;
      this._openAt = null;
      this._setPad(want && (want === "new" || this._page(want)) ? { block: v.id, page: want } : this._lastPad(v.id));
    } else if (v.name === "now") {
      this._peek = null;
      this._choice = null;
      this._setPad(this._nowPad());
      this._scrollChip = true;
    } else if (this._pad) {
      this._leave(this._pad);
    }
  }

  _tick() {
    this._now = Date.now();
    if (!this._data) return;
    const { cur } = this._slot();
    const key = cur ? `${cur.min}|${cur.entries.map((e) => this._keyOf(e)).join(",")}` : "";
    if (key === this._slotKey) return;
    const first = this._slotKey == null;
    const auto = !first && this._view().name === "now" && !this._peek;
    // Time for another notebook, but never while the page is open for writing:
    // it switches once the keyboard closes.
    const ta = this.renderRoot && this.renderRoot.querySelector("textarea.ink");
    if (auto && ta && this.renderRoot.activeElement === ta) return;
    this._slotKey = key;
    this._choice = null;
    this._scrollChip = true;
    if (auto) this._setPad(this._nowPad());
  }

  _peekAt(group) {
    const { cur } = this._slot();
    this._choice = null;
    this._peek = cur && group.min === cur.min ? null : group;
    this._setPad(this._nowPad());
    this._haptic("light");
  }

  _backToNow() {
    this._peek = null;
    this._choice = null;
    this._scrollChip = true;
    this._setPad(this._nowPad());
  }

  _choose(entry) {
    this._choice = this._keyOf(entry);
    this._setPad(this._padEntryPad(entry));
  }

  _snap(pad) {
    const b = this._block(pad.block);
    const list = this._pagesOf(pad.block);
    const page = pad.page !== "new" ? this._page(pad.page) : null;
    const idx = page ? list.indexOf(page) : list.length;
    const ta = this.renderRoot.querySelector("textarea.ink");
    return {
      text: page ? page.text : "",
      paper: b ? b.paper : "pautado",
      created: page ? page.created : null,
      times: page ? page.times : [],
      num: idx + 1,
      total: list.length + (page ? 0 : 1),
      scroll: ta && this._pad && this._pad.page === pad.page ? ta.scrollTop : 0,
    };
  }

  _flip(dir) {
    if (this._turn || !this._pad) return;
    const pad = this._pad;
    const list = this._pagesOf(pad.block);
    const isNew = pad.page === "new" || !this._page(pad.page);
    const cur = isNew ? list.length : list.findIndex((p) => p.id === pad.page);
    let target;
    if (dir > 0) {
      if (isNew) return this._haptic("light");
      if (cur >= list.length - 1) {
        if (!list[cur].text.trim()) return this._showToast("Esta folha ainda está em branco");
        target = "new";
      } else target = list[cur + 1].id;
    } else {
      if (cur <= 0) return this._haptic("light");
      target = list[cur - 1].id;
    }
    this._haptic("light");
    const to = { block: pad.block, page: target };
    if (target === "new") {
      // Inside the tap, so the phone opens the keyboard.
      const ta = this.renderRoot.querySelector("textarea.ink");
      if (ta) ta.focus({ preventScroll: true });
    } else {
      const ta = this.renderRoot.querySelector("textarea.ink");
      if (ta && this.renderRoot.activeElement === ta) ta.blur();
    }
    if (reduceMotion()) {
      this._setPad(to);
      return;
    }
    if (dir > 0) {
      const snap = this._snap(pad);
      this._setPad(to);
      this._turn = { dir: "next", snap, key: Date.now() };
    } else {
      this._turn = { dir: "prev", snap: this._snap(to), key: Date.now() };
      this._pendingPad = to;
    }
    clearTimeout(this._turnTimer);
    this._turnTimer = setTimeout(() => {
      const next = this._pendingPad;
      this._pendingPad = null;
      if (next) this._setPad(next, { keepTurn: true });
      this._turn = null;
      const ta = this.renderRoot.querySelector("textarea.ink");
      if (ta && !this._turn) ta.scrollTop = 0;
    }, TURN_MS);
  }

  _touchStart(ev) {
    const t = ev.touches && ev.touches[0];
    this._tx = t ? { x: t.clientX, y: t.clientY, at: Date.now() } : null;
  }

  _touchEnd(ev) {
    const s = this._tx;
    this._tx = null;
    const t = ev.changedTouches && ev.changedTouches[0];
    if (!s || !t || Date.now() - s.at > 600) return;
    const dx = t.clientX - s.x;
    const dy = t.clientY - s.y;
    if (Math.abs(dx) > 60 && Math.abs(dy) < 45) this._flip(dx < 0 ? 1 : -1);
  }

  /** Open a block (optionally at a page) in its own screen. */
  async _openPage(blockId, pageId = null) {
    this._closeSheet();
    const v = this._view();
    if ((v.name === "block" && v.id === blockId) || (v.name === "now" && this._pad && this._pad.block === blockId)) {
      this._setPad(pageId ? { block: blockId, page: pageId } : this._lastPad(blockId));
    } else {
      this._openAt = { block: blockId, page: pageId };
      await this._go(`/bloco/${blockId}`);
    }
    if (pageId === "new") {
      this.updateComplete.then(() => {
        const ta = this.renderRoot.querySelector("textarea.ink");
        if (ta) ta.focus({ preventScroll: true });
      });
    }
  }

  // ------------------------------------------------------------ navigation

  _view() {
    const p = (this._path || "").replace(/\/+$/, "");
    let m;
    if ((m = p.match(/^\/bloco\/([a-z0-9]+)$/i))) return { name: "block", id: m[1] };
    if (p === "/blocos") return { name: "shelf" };
    if (p === "/buscar") return { name: "search" };
    if (p === "/mais") return { name: "more" };
    return { name: "now" };
  }

  async _go(path, replace = false) {
    if (this._sheet) this._closeSheet();
    // Let the sheet's history entry go first, so Back never lands on a stale screen.
    if (this._popping) await this._popping;
    const depth = ((history.state && history.state.rvDepth) || 0) + (replace ? 0 : 1);
    if (replace) history.replaceState({ rvDepth: depth, rvPath: path }, "");
    else history.pushState({ rvDepth: depth, rvPath: path }, "");
    this._path = path;
    this._enterView();
    const main = this.renderRoot && this.renderRoot.querySelector("main");
    if (main) main.scrollTo({ top: 0, behavior: "instant" });
  }

  _back() {
    if (history.state && history.state.rvDepth > 0) history.back();
    else this._go("", true);
  }

  /** Leave a history entry we pushed (sheet, camera); resolves once it is gone. */
  _popEntry(flag) {
    if (!(history.state && history.state[flag])) return Promise.resolve();
    const p = new Promise((resolve) => {
      const done = () => {
        clearTimeout(timer);
        this._popWaiters = (this._popWaiters || []).filter((f) => f !== done);
        if (this._popping === p) this._popping = null;
        resolve();
      };
      const timer = setTimeout(done, 600);
      this._popWaiters = [...(this._popWaiters || []), done];
    });
    this._popping = p;
    history.back();
    return p;
  }

  _goTab(path) {
    const view = this._view().name;
    if (path === "") {
      if (view === "now") {
        if (this._peek) this._backToNow();
        const main = this.renderRoot.querySelector("main");
        if (main) main.scrollTo({ top: 0 });
        return;
      }
      // Agora is the first screen: go all the way back to it.
      const depth = (history.state && history.state.rvDepth) || 0;
      if (depth > 0) history.go(-depth);
      else this._go("", true);
      return;
    }
    if (path === "/blocos" && view === "block") {
      this._go(path, true);
      return;
    }
    // Switching between tabs replaces the entry so Back always returns to Agora.
    this._go(path, view !== "now");
  }

  _onPopState() {
    if (this._cam && !(history.state && history.state.rvCam)) this._closeCamera(true);
    if (this._sheet && !(history.state && history.state.rvSheet)) {
      this._sheet = null;
      this._form = null;
    }
    const path = (history.state && history.state.rvPath) || "";
    if (path !== this._path) {
      this._path = path;
      const v = this._view();
      // An old history entry can point to a block deleted since then.
      if (v.name === "block" && this._data && !this._block(v.id)) this._go("/blocos", true);
      else this._enterView();
    }
    for (const done of [...(this._popWaiters || [])]) done();
  }

  async _openSheet(sheet, form = null) {
    const wasOpen = !!this._sheet;
    if (!wasOpen && this._popping) await this._popping;
    this._sheet = sheet;
    this._form = form;
    if (!wasOpen) {
      try {
        history.pushState({ ...(history.state || {}), rvSheet: true }, "");
      } catch (e) {
        /* ignore */
      }
    }
  }

  _closeSheet() {
    if (!this._sheet) return Promise.resolve();
    this._releaseImages();
    this._sheet = null;
    this._form = null;
    return this._popEntry("rvSheet");
  }

  _setForm(changes) {
    this._form = { ...this._form, ...changes };
  }

  // ------------------------------------------------------------ feedback

  _haptic(type) {
    if (this.env && this.env.haptic) this.env.haptic(type);
  }

  _showToast(text, action = null) {
    clearTimeout(this._toastTimer);
    this._toast = { text, action, id: Date.now() };
    this._toastTimer = setTimeout(() => (this._toast = null), action ? 5000 : 2600);
  }

  _userName() {
    const p = parentHass();
    const name = (this._user && this._user.name) || (p && p.user && p.user.name) || "";
    return name.trim().split(/\s+/)[0];
  }

  // ------------------------------------------------------------ blocks & settings

  _openBlockSheet(block) {
    const b = block || null;
    const used = new Set(this._data.blocks.map((x) => x.color));
    const freeColor = (PALETTE.find((c) => !used.has(c.id)) || PALETTE[6]).id;
    this._openSheet("block", {
      id: b ? b.id : null,
      name: b ? b.name : "",
      color: b ? b.color : freeColor,
      paper: b ? b.paper : "pautado",
      periods: b ? [...(b.periods || [])] : [],
      times: b ? [...(b.times || [])] : [],
    });
    if (!b) {
      this.updateComplete.then(() => {
        const input = this.renderRoot.querySelector(".sheet input[type=text]");
        if (input) input.focus();
      });
    }
  }

  async _saveBlockSheet() {
    const f = this._form;
    const block = {
      name: (f.name || "").trim() || "Novo bloco",
      color: f.color,
      paper: f.paper,
      periods: f.periods,
      times: f.times,
    };
    if (f.id) block.id = f.id;
    try {
      const saved = await this.api.saveBlock(block);
      this._putBlock(saved);
      this._closeSheet();
      this._haptic("success");
      if (!f.id) this._openPage(saved.id, "new");
      else this._showToast("Bloco salvo");
    } catch (err) {
      this._showToast(`Não consegui salvar o bloco: ${err.message}`);
    }
  }

  _confirmDeleteBlock() {
    const f = this._form;
    const b = this._block(f.id);
    if (!b) return;
    const n = this._pagesOf(b.id).length;
    this._openSheet("confirm", {
      title: `Excluir “${clip(b.name, 24)}”?`,
      text: n ? `As ${plural(n, "folha", "folhas")} deste bloco também serão apagadas. Não dá para desfazer.` : "Este bloco está vazio.",
      label: "Excluir bloco",
      danger: true,
      run: async () => {
        this._closeSheet();
        try {
          await this.api.deleteBlock(b.id);
          this._onEvent({ kind: "block_deleted", id: b.id });
          this._showToast("Bloco excluído");
        } catch (err) {
          this._showToast(`Não consegui excluir: ${err.message}`);
        }
      },
    });
  }

  async _saveSettings(changes) {
    const prev = { periods: this._data.periods, app: this._data.app };
    const app = { ...this._data.app, ...(changes.app || {}) };
    const periods = { ...this._data.periods, ...(changes.periods || {}) };
    this._data = { ...this._data, app, periods };
    try {
      const res = await this.api.saveSettings(changes);
      this._data = { ...this._data, ...res };
    } catch (err) {
      this._data = { ...this._data, ...prev };
      this._showToast(`Não consegui salvar: ${err.message}`);
    }
    this._tick();
  }

  _whenParts(b, withPages = true) {
    const periods = periodTimes(this._data);
    const out = [];
    for (const id of b.periods || []) {
      const p = periodOf(id);
      if (p) out.push({ icon: p.icon, label: p.label, time: periods[id] });
    }
    for (const t of b.times || []) out.push({ icon: "clock", label: t, time: t });
    if (withPages) {
      const pinned = this._pagesOf(b.id).filter((p) => (p.times || []).length).length;
      if (pinned) out.push({ icon: "pin", label: plural(pinned, "trecho", "trechos") });
    }
    return out;
  }

  // ------------------------------------------------------------ page menu

  _openPageMenu() {
    const pad = this._pad;
    const page = pad && pad.page !== "new" ? this._page(pad.page) : null;
    if (!page) return;
    this._openSheet("pagemenu", { page: page.id });
  }

  async _setPageTimes(id, times) {
    const clean = [...new Set(times.map(normTime).filter(Boolean))].sort();
    await this._savePageMeta(id, { times: clean });
    this._tick();
  }

  async _movePage(id, blockId) {
    const page = this._page(id);
    const target = this._block(blockId);
    if (!page || !target || page.block === blockId) return;
    const from = page.block;
    const list = this._pagesOf(from);
    const i = list.indexOf(page);
    const stay = list[i - 1] || list[i + 1];
    this._closeSheet();
    const here = this._pad && this._pad.page === id;
    if (here) this._pad = { block: from, page: stay ? stay.id : "new" };
    const saved = await this._savePageMeta(id, { block: blockId });
    if (!saved) {
      if (here) this._pad = { block: from, page: id };
      return;
    }
    this._showToast(`Folha movida para ${clip(target.name, 22)}`, { label: "Ver", run: () => this._openPage(blockId, id) });
  }

  _confirmDeletePage(id) {
    const page = this._page(id);
    if (!page) return;
    this._openSheet("confirm", {
      title: "Arrancar esta folha?",
      text: page.text.trim() ? `“${clip(firstLine(page.text), 60)}” será apagada.` : "A folha em branco será removida.",
      label: "Apagar folha",
      danger: true,
      run: () => {
        this._closeSheet();
        const backup = { ...page };
        this._deletePage(id);
        this._haptic("medium");
        this._showToast("Folha apagada", {
          label: "Desfazer",
          run: () => {
            this._dropped.delete(backup.id);
            this._putPage(backup);
            this._base.delete(backup.id);
            this._queueSave(backup.id, 0);
            this._setPad({ block: backup.block, page: backup.id });
          },
        });
      },
    });
  }

  async _copyPage(id) {
    const page = this._page(id);
    if (!page) return;
    try {
      await navigator.clipboard.writeText(page.text);
      this._showToast("Texto copiado");
    } catch (e) {
      this._showToast("Não consegui copiar");
    }
    this._closeSheet();
  }

  // ------------------------------------------------------------ new page / import (message, photos, scan)

  _defaultTarget() {
    const pad = this._pad;
    if (pad && this._block(pad.block)) return pad.block;
    const b = this._blocks()[0];
    return b ? b.id : null;
  }

  async _openNew(start = "pick") {
    const target = this._defaultTarget();
    if (!target) {
      this._openBlockSheet(null);
      return;
    }
    this._releaseImages();
    this._importToken = 0;
    const opening = this._openSheet("new", { target, step: start === "text" ? "text" : "pick", text: "", images: [], result: "", provider: null, error: null, note: null });
    if (start === "photos") this._pickFiles("photos");
    if (start === "scan") this._openCamera();
    if (start === "text") this._focusSheetText();
    return opening;
  }

  _write() {
    const target = this._form.target;
    this._closeSheet();
    this._openPage(target, "new");
  }

  _focusSheetText() {
    this.updateComplete.then(() => {
      const ta = this.renderRoot.querySelector(".sheet textarea");
      if (ta) ta.focus();
    });
  }

  _pickFiles(kind) {
    const input = this.renderRoot.querySelector(kind === "scan" ? "#mm-scan" : "#mm-photos");
    if (!input) return;
    input.value = "";
    input.click();
  }

  _releaseImages() {
    const f = this._form;
    if (f && f.images) for (const img of f.images) if (img.url) URL.revokeObjectURL(img.url);
  }

  /**
   * The Home Assistant Android app (2026.10.x and older) drops selections made
   * with `multiple` and ignores `capture`, so it gets one photo at a time and
   * our own camera screen instead.
   */
  _isHaAndroid() {
    return /Home Assistant\//.test(navigator.userAgent) && /Android/.test(navigator.userAgent);
  }

  async _onFiles(ev) {
    const files = [...(ev.target.files || [])].filter((f) => !f.type || f.type.startsWith("image/")).slice(0, 6);
    ev.target.value = "";
    if (!files.length) return;
    if (this._sheet !== "new") await this._openNew("pick");
    const appending = this._form.step === "review";
    this._setForm({ step: "loading", error: null, loadingText: "Preparando as fotos…", prevStep: appending ? "review" : "pick" });
    const images = [];
    for (const file of files) images.push(await prepareImage(file));
    this._readImages(images, appending);
  }

  _readImages(images, appending) {
    if (this._sheet !== "new" || !images.length) return;
    const all = appending ? [...(this._form.images || []), ...images] : (this._releaseImages(), images);
    this._setForm({
      step: "loading",
      images: all,
      prevStep: appending ? "review" : "pick",
      loadingText: images.length > 1 ? `Lendo ${images.length} fotos com IA…` : "Lendo a foto com IA…",
    });
    this._runExtract({ images, appending });
  }

  async _runExtract({ text, images, appending = false }) {
    const token = (this._importToken = Date.now());
    const live = () => token === this._importToken && this._sheet === "new";
    const before = appending ? (this._form.result || "").trim() : "";
    try {
      const res = await this.api.extract({ text, images: images ? images.map(({ data, mime }) => ({ data, mime })) : undefined });
      if (!live()) return;
      const found = (res.text || "").trim();
      if (!found) {
        const msg = text ? "A IA não devolveu nada para essa mensagem." : "Não consegui ler essa foto. Tente mais de perto e com boa luz.";
        if (appending) this._setForm({ step: "review", note: msg });
        else this._setForm({ step: text ? "text" : "pick", error: msg });
        return;
      }
      this._haptic("success");
      this._setForm({ step: "review", result: before ? `${before}\n\n${found}` : found, provider: res.provider || null, note: null, error: null });
    } catch (err) {
      if (!live()) return;
      if (text) {
        this._setForm({ step: "review", result: text.trim(), provider: "local", note: "A IA não respondeu, então mantive o texto como veio." });
        return;
      }
      if (appending) this._setForm({ step: "review", note: err.message || "Algo deu errado" });
      else this._setForm({ step: "pick", error: err.message || "Algo deu errado" });
    }
  }

  _readText(useAi) {
    const text = (this._form.text || "").trim();
    if (!text) {
      this._focusSheetText();
      return;
    }
    if (useAi && this._ai.available) {
      this._setForm({ step: "loading", error: null, note: null, prevStep: "text", loadingText: "Organizando com IA…" });
      this._runExtract({ text });
      return;
    }
    this._createFromText(text);
  }

  async _pasteClipboard() {
    try {
      const t = await navigator.clipboard.readText();
      if (!t) throw new Error("empty");
      this._setForm({ text: t, error: null });
    } catch (e) {
      this._focusSheetText();
      this._showToast("Toque e segure no campo para colar");
    }
  }

  _createFromText(text) {
    const target = this._form.target;
    if (!this._block(target) || !text.trim()) return;
    const now = Date.now();
    const page = { id: newId(), block: target, text: text.trim(), times: [], created: now, updated: now };
    this._putPage(page);
    this._queueSave(page.id, 0);
    this._haptic("success");
    this._closeSheet();
    this._openPage(target, page.id);
    this._showToast("Folha criada");
  }

  // ------------------------------------------------------------ camera ("Digitalizar com IA")

  async _openCamera() {
    const md = navigator.mediaDevices;
    if (!md || !md.getUserMedia) {
      this._pickFiles("scan");
      return;
    }
    const appending = !!(this._form && this._form.step === "review");
    this._cam = { status: "starting", shots: [], torch: false, torchOk: false, appending, flash: 0 };
    try {
      history.pushState({ ...(history.state || {}), rvCam: true }, "");
    } catch (e) {
      /* ignore */
    }
    try {
      const stream = await md.getUserMedia({
        audio: false,
        video: { facingMode: { ideal: "environment" }, width: { ideal: 1920 }, height: { ideal: 1440 } },
      });
      if (!this._cam) {
        stream.getTracks().forEach((t) => t.stop());
        return;
      }
      this._stream = stream;
      const track = stream.getVideoTracks()[0];
      const caps = track && track.getCapabilities ? track.getCapabilities() : {};
      this._cam = { ...this._cam, status: "live", torchOk: !!caps.torch };
      await this.updateComplete;
      const video = this.renderRoot.querySelector(".cam video");
      if (video) {
        video.srcObject = stream;
        video.play().catch(() => {});
      }
    } catch (err) {
      if (!this._cam) return;
      const denied = err && (err.name === "NotAllowedError" || err.name === "SecurityError");
      this._cam = {
        ...this._cam,
        status: "error",
        error: denied
          ? "Sem permissão para usar a câmera. Libere a câmera para o app do Home Assistant nas configurações do celular, ou escolha uma foto."
          : "Não consegui abrir a câmera. Você pode escolher uma foto da galeria.",
      };
    }
  }

  _stopStream() {
    if (this._stream) this._stream.getTracks().forEach((t) => t.stop());
    this._stream = null;
  }

  _closeCamera(fromHistory = false) {
    if (!this._cam) return;
    this._stopStream();
    const shots = this._cam.shots || [];
    if (!this._cam.used) for (const s of shots) URL.revokeObjectURL(s.url);
    this._cam = null;
    if (!fromHistory) this._popEntry("rvCam");
  }

  async _toggleTorch() {
    const track = this._stream && this._stream.getVideoTracks()[0];
    if (!track) return;
    const on = !this._cam.torch;
    try {
      await track.applyConstraints({ advanced: [{ torch: on }] });
      this._cam = { ...this._cam, torch: on };
    } catch (e) {
      this._cam = { ...this._cam, torchOk: false };
    }
  }

  async _shoot() {
    const video = this.renderRoot.querySelector(".cam video");
    if (!video || !video.videoWidth || !this._cam || this._cam.shots.length >= 6) return;
    const max = 1800;
    const scale = Math.min(1, max / Math.max(video.videoWidth, video.videoHeight));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(video.videoWidth * scale);
    canvas.height = Math.round(video.videoHeight * scale);
    canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.86));
    if (!blob || !this._cam) return;
    const shot = await prepareImage(blob, max);
    this._haptic("light");
    this._cam = { ...this._cam, shots: [...this._cam.shots, shot], flash: Date.now() };
  }

  async _useShots() {
    if (!this._cam || !this._cam.shots.length) return;
    const shots = this._cam.shots;
    const appending = this._cam.appending;
    this._cam = { ...this._cam, used: true };
    this._closeCamera();
    if (this._popping) await this._popping;
    if (this._sheet !== "new") await this._openNew("pick");
    this._readImages(shots, appending && this._form.step === "review");
  }

  _cameraFallback() {
    const appending = this._cam && this._cam.appending;
    this._closeCamera();
    if (appending && this._form) this._setForm({ step: "review" });
    this._pickFiles("scan");
  }

  // ------------------------------------------------------------ render

  render() {
    if (!this._ready) {
      return html`<div class="root"><div class="app"><main><div class="boot-msg">${this._bootError ? html`${icon("circle-alert")}<span>Não consegui abrir o MemorIA: ${this._bootError}. Tentando de novo…</span>` : html`<span class="spin">${icon("loader-circle")}</span><span>Abrindo o caderno…</span>`}</div></main></div></div>`;
    }
    const view = this._view();
    const padBlock = (view.name === "now" || view.name === "block") && this._pad ? this._block(this._pad.block) : null;
    const accent = padBlock ? this._colorOf(padBlock) : this._accent();
    const dark = this._dark;
    const style =
      `--rv-accent:${accent.fill};--rv-accent-ink:${dark ? accent.fill : accent.ink};` +
      `--rv-accent-soft:${hexToRgba(accent.fill, dark ? 0.18 : 0.14)};--rv-accent-ink-light:${accent.ink};`;
    let page;
    if (view.name === "block") page = this._renderBlock(view.id);
    else if (view.name === "shelf") page = this._renderShelf();
    else if (view.name === "search") page = this._renderSearch();
    else if (view.name === "more") page = this._renderMore();
    else page = this._renderNow();
    return html`
      <div class="root" style=${style}>
        <div class="app">
          ${!this.env || this.env.topbar
            ? html`<header class="topbar"><div class="title">Memor<b>IA</b></div></header>`
            : nothing}
          ${!this._online ? html`<div class="offline">${icon("wifi-off")}<span>Sem conexão com o MemorIA. Reconectando…</span></div>` : nothing}
          <main>${page}</main>
          ${this._renderNav(view)}
        </div>
        ${this._renderSheet()} ${this._renderToast()} ${this._renderCamera()}
        <input id="mm-photos" class="sr" type="file" accept="image/*" ?multiple=${!this._isHaAndroid()} tabindex="-1" aria-hidden="true" @change=${(e) => this._onFiles(e)} />
        <input id="mm-scan" class="sr" type="file" accept="image/*" capture="environment" tabindex="-1" aria-hidden="true" @change=${(e) => this._onFiles(e)} />
      </div>
    `;
  }

  _renderNav(view) {
    const tab = (names, path, label, ic) => html`
      <button class="tab ${names.includes(view.name) ? "on" : ""}" @click=${() => this._goTab(path)} aria-label=${label}>${icon(ic)}<span>${label}</span></button>
    `;
    return html`
      <nav>
        <div class="tabs">
          ${tab(["now"], "", "Agora", "clock-3")} ${tab(["shelf", "block"], "/blocos", "Blocos", "library")}
          <button class="tab fab" @click=${() => this._openNew()} aria-label="Nova folha">
            <span class="pill">${icon("plus")}</span><span>Nova</span>
          </button>
          ${tab(["search"], "/buscar", "Buscar", "search")} ${tab(["more"], "/mais", "Mais", "sliders-horizontal")}
        </div>
      </nav>
    `;
  }

  _renderHead(title, status) {
    const name = this._userName();
    const st = !this._online ? { text: "Reconectando ao MemorIA…", tone: "off" } : status;
    return html`<header class="brand-head">
      <p class="eyebrow"><span class="brand">Memor<span>IA</span></span>${name ? ` · Olá, ${name}` : ""}</p>
      <h1 class="page-title">${title}</h1>
      ${st ? html`<p class="status"><span class="dot ${st.tone || ""}" aria-hidden="true"></span><span>${st.text}</span>${st.extra || nothing}</p>` : nothing}
    </header>`;
  }

  // ---------- Agora

  _renderNow() {
    const { entries, min, cur, next } = this._slot();
    const pad = this._pad;
    const b = pad ? this._block(pad.block) : null;
    if (!b) {
      return html`<section class="page">
        ${this._renderHead("Agora", { text: "Nenhum bloco ainda" })}
        <div class="panel"><div class="empty"><div class="em-icon">${icon("notebook-pen")}</div><h3>Comece um bloco</h3><p>Crie um bloco de anotações e escolha quando ele abre sozinho: de manhã, à tarde, à noite ou num horário exato.</p></div></div>
        <button class="btn primary" style="width:100%" @click=${() => this._openBlockSheet(null)}>${icon("plus")}Novo bloco</button>
      </section>`;
    }
    const period = periodOf(periodAt(min, periodTimes(this._data)));
    const groups = timeline(entries);
    const active = this._peek || cur;
    let status;
    if (this._peek) {
      status = {
        text: `Espiando ${fmtMin(this._peek.min)}`,
        tone: "off",
        extra: html`<button class="text-btn now-btn" @click=${() => this._backToNow()}>Voltar para agora</button>`,
      };
    } else if (cur) {
      const nb = next ? this._block(next.main.block) : null;
      status = { text: `${period.label} · desde ${fmtMin(cur.min)}${nb ? ` · depois ${clip(nb.name, 18)} às ${fmtMin(next.min)}` : ""}` };
    } else {
      status = { text: `${period.label} · nenhum bloco com horário`, tone: "off" };
    }
    return html`
      <section class="page">
        ${this._renderHead(b.name, status)}
        ${groups.length
          ? html`<div class="tline" role="list" aria-label="Seu dia">
              ${groups.map((g) => {
                const gb = this._block(g.main.block);
                if (!gb) return nothing;
                const on = cur && g.min === cur.min && !this._peek;
                const peek = this._peek && this._peek.min === g.min;
                const kind = g.main.kind === "page" ? "pin" : g.main.kind === "period" ? periodOf(g.main.period).icon : "clock";
                return html`<button class="tchip ${on ? "on" : ""} ${peek ? "peek" : ""}" role="listitem" style=${this._cv(gb)} @click=${() => this._peekAt(g)} aria-label="${fmtMin(g.min)} ${gb.name}">
                  ${icon(kind)}<b>${fmtMin(g.min)}</b><span class="dot"></span><span>${clip(gb.name, 18)}${g.entries.length > 1 ? ` +${g.entries.length - 1}` : ""}</span>
                </button>`;
              })}
            </div>`
          : html`<div class="hint-card">
              ${icon("calendar-clock")}
              <span>Nenhum bloco abre sozinho ainda. Escolha quando cada bloco aparece aqui: de manhã, à tarde, à noite ou às 07h, 10h, 22h…</span>
              <button class="text-btn" @click=${() => this._openBlockSheet(b)}>Escolher</button>
            </div>`}
        ${active && active.entries.length > 1
          ? html`<div class="switcher">
              ${active.entries.map((e) => {
                const eb = this._block(e.block);
                if (!eb) return nothing;
                const on = this._keyOf(this._pickIn(active)) === this._keyOf(e);
                return html`<button class="pick list ${on ? "on" : ""}" style=${this._cv(eb)} @click=${() => this._choose(e)}><span class="dot"></span><span>${clip(eb.name, 20)}${e.page ? " · trecho" : ""}</span></button>`;
              })}
            </div>`
          : nothing}
        ${this._renderPad()}
      </section>
    `;
  }

  // ---------- the notepad itself

  _renderPad(opts = {}) {
    const pad = this._pad;
    const b = pad && this._block(pad.block);
    if (!b) return nothing;
    const list = this._pagesOf(b.id);
    const page = pad.page !== "new" ? this._page(pad.page) : null;
    const idx = page ? list.indexOf(page) : list.length;
    const total = list.length + (page ? 0 : 1);
    const hand = this._app("hand", true);
    const last = page && idx === list.length - 1;
    const canNext = page && !(last && !page.text.trim());
    return html`
      <div class="pad ${opts.tall ? "tall" : ""}" style=${this._cv(b)} @touchstart=${(e) => this._touchStart(e)} @touchend=${(e) => this._touchEnd(e)}>
        <div class="pad-cover"></div>
        <div class="pad-stack"></div>
        <div class="leaf ${b.paper}">
          ${this._renderLeafTop({ created: page ? page.created : null, times: page ? page.times : [], num: idx + 1, total }, !!page)}
          <textarea
            class="ink ${hand ? "" : "normal"}"
            .value=${live(page ? page.text : "")}
            placeholder=${page ? "" : idx === 0 ? "Escreva a primeira folha deste bloco…" : "Folha nova. Escreva aqui…"}
            spellcheck="true"
            aria-label="Folha ${idx + 1} de ${total} do bloco ${b.name}"
            @input=${(e) => this._onInk(e)}
            @blur=${() => {
              if (page && this._saving.has(page.id)) this._flushSave(page.id);
              setTimeout(() => this._tick(), 400);
            }}
          ></textarea>
          ${idx > 0 ? html`<button class="edge prev" @click=${() => this._flip(-1)} aria-label="Folha anterior"><span class="hint">${icon("chevron-left")}</span></button>` : nothing}
          ${canNext
            ? html`<button class="edge next ${last ? "new" : ""}" @click=${() => this._flip(1)} aria-label=${last ? "Virar para uma folha nova" : "Próxima folha"}><span class="hint">${icon(last ? "plus" : "chevron-right")}</span></button>`
            : nothing}
        </div>
        <div class="spiral" aria-hidden="true">${RINGS}</div>
        ${this._turn
          ? html`<div class="turn ${this._turn.dir}" aria-hidden="true">
              <div class="face front leaf ${this._turn.snap.paper}">
                ${this._renderLeafTop(this._turn.snap, false)}
                <div class="ink ${hand ? "" : "normal"}">${this._turn.snap.text}</div>
              </div>
              <div class="face back"></div>
              <div class="shade"></div>
            </div>`
          : nothing}
      </div>
    `;
  }

  _renderLeafTop(s, menu) {
    return html`<div class="leaf-top">
      <span class="when">${s.created ? writtenAt(s.created, new Date(this._now)) : "folha nova"}</span>
      ${(s.times || []).length ? html`<span class="pin">${icon("clock")}${s.times.join(" · ")}</span>` : nothing}
      <span class="num">${s.num}/${s.total}</span>
      ${menu ? html`<button class="icon-btn" @click=${() => this._openPageMenu()} aria-label="Opções da folha">${icon("ellipsis")}</button>` : html`<span class="icon-btn ghost"></span>`}
    </div>`;
  }

  // ---------- Blocos

  _renderShelf() {
    const blocks = this._blocks();
    const pages = this._data.pages.length;
    const groups = timeline(this._schedule());
    const { cur } = this._slot();
    return html`
      <section class="page">
        ${this._renderHead("Blocos", { text: `${plural(blocks.length, "bloco", "blocos")} · ${plural(pages, "folha", "folhas")}` })}
        <div class="shelf">
          ${repeat(
            blocks,
            (b) => b.id,
            (b) => {
              const n = this._pagesOf(b.id).length;
              const parts = this._whenParts(b);
              return html`<button class="cover" style=${this._cv(b)} @click=${() => this._openPage(b.id)} aria-label="Abrir ${b.name}">
                <div class="sticker"><b>${b.name}</b><small>${plural(n, "folha", "folhas")}</small></div>
                <div class="when">${parts.length ? parts.map((p) => html`<span>${icon(p.icon)}${p.label}</span>`) : html`<span>${icon("notebook")}Sem horário</span>`}</div>
              </button>`;
            },
          )}
          <button class="cover add" @click=${() => this._openBlockSheet(null)}>${icon("plus")}<span>Novo bloco</span></button>
        </div>
        ${groups.length
          ? html`<div class="panel">
              <div class="overline">Seu dia</div>
              ${groups.map((g) =>
                g.entries.map((e) => {
                  const eb = this._block(e.block);
                  if (!eb) return nothing;
                  const pg = e.page ? this._page(e.page) : null;
                  const why = e.kind === "period" ? `${periodOf(e.period).label}` : e.kind === "page" ? `Trecho: ${clip(firstLine(pg && pg.text) || "folha", 34)}` : "Horário fixo";
                  return html`<button class="day-row ${cur && cur.min === g.min ? "on" : ""}" style=${this._cv(eb)} @click=${() => this._openPage(eb.id, e.page || null)}>
                    <b>${fmtMin(e.min)}</b><span class="dot"></span>
                    <span class="grow"><span class="label">${eb.name}</span><span class="hint">${why}</span></span>
                    ${cur && cur.min === g.min ? html`<span class="now-tag">agora</span>` : icon("chevron-right")}
                  </button>`;
                }),
              )}
            </div>`
          : nothing}
      </section>
    `;
  }

  _renderBlock(id) {
    const b = this._block(id);
    if (!b) {
      return html`<section class="page">
        <div class="panel"><div class="empty"><div class="em-icon">${icon("circle-alert")}</div><h3>Bloco não encontrado</h3><p>Ele pode ter sido excluído em outro aparelho.</p></div></div>
        <button class="btn outline" style="width:100%" @click=${() => this._go("/blocos", true)}>Ver blocos</button>
      </section>`;
    }
    const parts = this._whenParts(b, false);
    const n = this._pagesOf(b.id).length;
    return html`
      <section class="page">
        <div class="detail-head">
          <button class="icon-btn" @click=${() => this._back()} aria-label="Voltar">${icon("chevron-left")}</button>
          <div class="dh-text">
            <div class="overline">${plural(n, "folha", "folhas")} · ${PAPER_LABEL[b.paper] || ""}</div>
            <h1 class="display">${b.name}</h1>
          </div>
          <button class="icon-btn" @click=${() => this._openBlockSheet(b)} aria-label="Ajustes do bloco">${icon("sliders-horizontal")}</button>
        </div>
        <button class="when-line" @click=${() => this._openBlockSheet(b)}>
          ${parts.length
            ? html`${icon("calendar-clock")}<span>Abre sozinho: ${parts.map((p, i) => html`${i ? " · " : ""}<b>${p.icon === "clock" ? p.label : `${p.label} ${p.time}`}</b>`)}</span>`
            : html`${icon("calendar-clock")}<span>Não abre sozinho. <b>Escolher horário</b></span>`}
        </button>
        ${this._renderPad({ tall: true })}
      </section>
    `;
  }

  // ---------- Buscar

  _renderSearch() {
    const q = this._query.trim();
    const needle = fold(q);
    let results = [];
    if (needle) {
      results = this._data.pages
        .filter((p) => this._block(p.block) && fold(p.text).includes(needle))
        .sort((a, b) => b.updated - a.updated)
        .slice(0, 80);
    }
    return html`
      <section class="page">
        ${this._renderHead("Buscar", { text: `Em ${plural(this._data.pages.length, "folha", "folhas")} · acentos não importam` })}
        <label class="search-box">
          ${icon("search")}
          <input type="search" placeholder="Buscar em todos os blocos" .value=${this._query} @input=${(e) => (this._query = e.target.value)} enterkeyhint="search" aria-label="Buscar" />
          ${this._query ? html`<button class="icon-btn" style="width:40px;height:40px" @click=${() => (this._query = "")} aria-label="Limpar">${icon("x")}</button>` : nothing}
        </label>
        ${!needle
          ? html`<p class="page-sub" style="margin-top:0">Procure qualquer palavra em todas as folhas.</p>`
          : results.length
            ? html`<p class="page-sub" style="margin-top:0">${plural(results.length, "folha encontrada", "folhas encontradas")}</p>
                <div class="panel">
                  ${results.map((p) => {
                    const b = this._block(p.block);
                    const title = firstLine(p.text) || "Folha sem título";
                    return html`<button class="result" style=${this._cv(b)} @click=${() => this._openPage(b.id, p.id)}>
                      <span class="dot"></span>
                      <span class="r-main">
                        <span class="r-title">${this._highlight(clip(title, 70), q)}</span>
                        <span class="r-snip">${this._highlight(this._snippet(p.text, title, needle), q)}</span>
                        <span class="r-meta">${b.name} · ${writtenAt(p.updated, new Date(this._now))}</span>
                      </span>
                    </button>`;
                  })}
                </div>`
            : html`<div class="panel"><div class="empty"><div class="em-icon">${icon("search")}</div><h3>Nada encontrado</h3><p>Nenhuma folha com “${clip(q, 30)}”.</p></div></div>`}
      </section>
    `;
  }

  _snippet(text, title, needle) {
    const rest = text.slice(text.indexOf(title) + title.length).replace(/\s+/g, " ").trim();
    const flat = rest || "";
    const at = foldKeepLength(flat).indexOf(needle);
    if (at <= 60) return flat.slice(0, 160);
    return `…${flat.slice(at - 40, at + 120)}`;
  }

  _highlight(text, query) {
    if (!query) return text;
    const hay = foldKeepLength(text);
    const needle = fold(query);
    if (!needle) return text;
    const out = [];
    let from = 0;
    let at;
    while ((at = hay.indexOf(needle, from)) !== -1) {
      if (at > from) out.push(text.slice(from, at));
      out.push(html`<mark>${text.slice(at, at + needle.length)}</mark>`);
      from = at + needle.length;
    }
    if (from < text.length) out.push(text.slice(from));
    return out;
  }

  // ---------- Mais

  _renderMore() {
    const accent = this._app("accent", "lilas");
    const periods = periodTimes(this._data);
    const ai = this._ai || {};
    const sw = (on, label, ev) => html`<label class="switch"><input type="checkbox" role="switch" .checked=${on} @change=${ev} aria-label=${label} /><span class="track"></span></label>`;
    return html`
      <section class="page">
        ${this._renderHead("Mais", { text: `MemorIA ${this._version} · salvo no Home Assistant` })}

        <div class="panel">
          <div class="overline">Aparência</div>
          <div class="row col">
            <div class="label">Tema</div>
            <div class="seg" role="radiogroup" aria-label="Tema">
              ${[
                ["auto", "Automático", "sun-moon"],
                ["light", "Claro", "sun"],
                ["dark", "Escuro", "moon"],
              ].map(([k, label, ic]) => html`<button class=${this._theme === k ? "on" : ""} role="radio" aria-checked=${this._theme === k ? "true" : "false"} @click=${() => this._setTheme(k)}>${icon(ic)}${label}</button>`)}
            </div>
            <div class="hint" style="white-space:normal">${this._theme === "auto" ? "Segue o modo claro/escuro do Home Assistant." : "Vale só para este aparelho."}</div>
          </div>
          <div class="row col">
            <div class="label">Cor do app</div>
            <div class="swatches">
              ${PALETTE.map(
                (c) => html`<button class="sw ${accent === c.id ? "on" : ""}" style="--c:${c.fill}" aria-label=${c.label} @click=${() => this._saveSettings({ app: { accent: c.id } })}>${accent === c.id ? icon("check") : nothing}</button>`,
              )}
            </div>
            <div class="hint" style="white-space:normal">Dentro de um bloco, vale a cor do bloco.</div>
          </div>
          <div class="row">
            <div class="grow"><div class="label">Letra de mão</div><div class="hint" style="white-space:normal">Folhas escritas como num caderno de verdade</div></div>
            ${sw(this._app("hand", true), "Letra de mão", (e) => this._saveSettings({ app: { hand: e.target.checked } }))}
          </div>
        </div>

        <div class="panel">
          <div class="overline">Períodos do dia</div>
          ${PERIODS.map(
            (p) => html`<div class="row">
              <span class="tile" style=${colorVars(this._accent(), this._dark)}>${icon(p.icon)}</span>
              <div class="grow"><div class="label">${p.label}</div><div class="hint">começa às</div></div>
              <input class="time-input" type="time" .value=${periods[p.id]} aria-label="Começo da ${p.label}" @change=${(e) => normTime(e.target.value) && this._saveSettings({ periods: { [p.id]: e.target.value } })} />
            </div>`,
          )}
          <div class="row"><div class="hint" style="white-space:normal">Blocos ligados a um período abrem sozinhos a partir desse horário. Horários exatos (07:00, 22:00…) ficam em cada bloco ou folha.</div></div>
        </div>

        <div class="panel">
          <div class="overline">Home Assistant</div>
          <div class="row">
            <div class="grow"><div class="label">Sensor “MemorIA agora”</div><div class="hint" style="white-space:normal"><code>sensor.memoria_agora</code> com o bloco e a folha do momento, para painéis e automações</div></div>
            ${sw(this._app("sensor", true), "Sensor MemorIA agora", (e) => this._saveSettings({ app: { sensor: e.target.checked } }))}
          </div>
          <div class="row">
            <span class="tile" style=${colorVars(this._accent(), this._dark)}>${icon("sparkles")}</span>
            <div class="grow">
              <div class="label">Leitura com IA</div>
              <div class="hint" style="white-space:normal">
                ${ai.available
                  ? ai.provider === "gemini"
                    ? "Usando a chave do Gemini das opções do app."
                    : `Usando a IA do Home Assistant${ai.images ? ", inclusive para fotos" : " (sem fotos)"}.`
                  : "Sem IA. Configure uma tarefa de IA no Home Assistant (ex.: Google Gemini) ou coloque uma chave do Gemini nas opções do app."}
              </div>
            </div>
          </div>
        </div>

        <p class="foot"><b>MemorIA</b><br />v${this._version} · suas anotações ficam no Home Assistant<br />e entram no backup dele.</p>
      </section>
    `;
  }

  // ---------- sheets

  _renderSheet() {
    if (!this._sheet) return nothing;
    let body = nothing;
    if (this._sheet === "block") body = this._renderBlockSheet();
    else if (this._sheet === "pagemenu") body = this._renderPageMenu();
    else if (this._sheet === "new") body = this._renderNewSheet();
    else if (this._sheet === "confirm") body = this._renderConfirm();
    const f = this._form || {};
    const b = this._sheet === "block" ? { color: f.color } : this._block(f.target || (f.page && this._page(f.page) && this._page(f.page).block));
    const c = b ? colorById(b.color) : null;
    const style = c ? `--rv-accent:${c.fill};--rv-accent-ink:${this._dark ? c.fill : c.ink};--rv-accent-soft:${hexToRgba(c.fill, this._dark ? 0.18 : 0.14)};` : "";
    return html`
      <div class="scrim" @click=${() => this._closeSheet()}></div>
      <div class="sheet" role="dialog" aria-modal="true" style=${style} @keydown=${(e) => e.key === "Escape" && this._closeSheet()}>
        <div class="grab"></div>
        ${body}
      </div>
    `;
  }

  _sheetHead(title, back) {
    return html`<div class="sheet-head">
      ${back ? html`<button class="icon-btn back" @click=${back} aria-label="Voltar">${icon("chevron-left")}</button>` : nothing}
      <h3 class="display">${title}</h3>
      <button class="icon-btn" @click=${() => this._closeSheet()} aria-label="Fechar">${icon("x")}</button>
    </div>`;
  }

  _timePicker(onPick, label = "Horário") {
    const open = (ev) => {
      const input = ev.currentTarget.querySelector("input");
      try {
        input.showPicker();
      } catch (e) {
        input.focus();
        input.click();
      }
    };
    return html`<button class="pick add-time" @click=${open}>${icon("plus")}<span>${label}</span>
      <input class="hidden-input" type="time" tabindex="-1" @click=${(e) => e.stopPropagation()} @change=${(e) => {
        const t = normTime(e.target.value);
        e.target.value = "";
        if (t) onPick(t);
      }} />
    </button>`;
  }

  _renderBlockSheet() {
    const f = this._form;
    const periods = periodTimes(this._data);
    const toggle = (id) => this._setForm({ periods: f.periods.includes(id) ? f.periods.filter((p) => p !== id) : [...f.periods, id] });
    return html`
      ${this._sheetHead(f.id ? "Ajustes do bloco" : "Novo bloco")}
      <label class="field">
        <span class="flabel">Nome</span>
        <input type="text" maxlength="60" .value=${f.name} placeholder="Ex.: Diário, Treino, Trabalho" @input=${(e) => this._setForm({ name: e.target.value })} @keydown=${(e) => e.key === "Enter" && this._saveBlockSheet()} />
      </label>
      <div class="field">
        <span class="flabel">Cor da capa</span>
        <div class="swatches">
          ${PALETTE.map((c) => html`<button class="sw ${f.color === c.id ? "on" : ""}" style="--c:${c.fill}" aria-label=${c.label} @click=${() => this._setForm({ color: c.id })}>${f.color === c.id ? icon("check") : nothing}</button>`)}
        </div>
      </div>
      <div class="field">
        <span class="flabel">Folha</span>
        <div class="papers">
          ${PAPERS.map((p) => html`<button class="paper-opt ${f.paper === p ? "on" : ""}" @click=${() => this._setForm({ paper: p })}><span class="sw-paper ${p}"></span>${PAPER_LABEL[p]}</button>`)}
        </div>
      </div>
      <div class="field">
        <span class="flabel">Quando abrir sozinho</span>
        <div class="chip-row">
          ${PERIODS.map(
            (p) => html`<button class="pick ${f.periods.includes(p.id) ? "on" : ""}" @click=${() => toggle(p.id)}>${icon(p.icon)}<span>${p.label}</span><small class="pick-sub">${periods[p.id]}</small></button>`,
          )}
        </div>
        <div class="time-list" style="margin-top:10px">
          ${f.times.map(
            (t) => html`<span class="time-chip">${t}<button aria-label="Tirar ${t}" @click=${() => this._setForm({ times: f.times.filter((x) => x !== t) })}>${icon("x")}</button></span>`,
          )}
          ${f.times.length < 24 ? this._timePicker((t) => this._setForm({ times: [...new Set([...f.times, t])].sort() }), f.times.length ? "Outro horário" : "Horário exato") : nothing}
        </div>
        <div class="field-hint">${icon("clock")}<span>${f.periods.length || f.times.length ? "Nesses momentos a tela Agora abre este bloco. Folhas com horário próprio têm prioridade." : "Sem horário, o bloco só abre quando você escolher."}</span></div>
      </div>
      <div class="sheet-actions">
        ${f.id ? html`<button class="btn danger" @click=${() => this._confirmDeleteBlock()} aria-label="Excluir bloco">${icon("trash")}</button>` : nothing}
        <button class="btn primary" @click=${() => this._saveBlockSheet()}>${f.id ? "Salvar" : "Criar bloco"}</button>
      </div>
    `;
  }

  _renderPageMenu() {
    const page = this._page(this._form.page);
    if (!page) return this._sheetHead("Folha");
    const list = this._pagesOf(page.block);
    const idx = list.indexOf(page);
    const blocks = this._blocks();
    const times = page.times || [];
    return html`
      ${this._sheetHead(`Folha ${idx + 1} de ${list.length}`)}
      <div class="field">
        <span class="flabel">Mostrar esta folha às…</span>
        <div class="time-list">
          ${times.map((t) => html`<span class="time-chip">${t}<button aria-label="Tirar ${t}" @click=${() => this._setPageTimes(page.id, times.filter((x) => x !== t))}>${icon("x")}</button></span>`)}
          ${this._timePicker((t) => this._setPageTimes(page.id, [...times, t]), times.length ? "Outro horário" : "Escolher horário")}
        </div>
        <div class="field-hint">${icon("pin")}<span>${times.length ? `Às ${times.join(", ")} a tela Agora abre direto nesta folha.` : "Um trecho com horário: ex.: às 10h esta folha aparece sozinha."}</span></div>
      </div>
      ${blocks.length > 1
        ? html`<div class="field">
            <span class="flabel">Bloco</span>
            <div class="chip-row">
              ${blocks.map((b) => html`<button class="pick list ${page.block === b.id ? "on" : ""}" style=${this._cv(b)} @click=${() => this._movePage(page.id, b.id)}><span class="dot"></span><span>${clip(b.name, 22)}</span></button>`)}
            </div>
          </div>`
        : nothing}
      <button class="menu-row" @click=${() => this._copyPage(page.id)}>${icon("copy")}Copiar texto</button>
      <button class="menu-row danger" @click=${() => this._confirmDeletePage(page.id)}>${icon("trash")}Apagar folha</button>
      <p class="sheet-note">Escrita ${writtenAt(page.created)} · editada ${writtenAt(page.updated)}</p>
    `;
  }

  _renderNewSheet() {
    const f = this._form;
    const ai = this._ai || {};
    const blocks = this._blocks();
    const target = this._block(f.target);
    const toPick = () => {
      this._importToken = 0;
      this._setForm({ step: "pick", error: null, note: null });
    };
    const error = f.error ? html`<div class="imp-error">${icon("circle-alert")}<span>${f.error}</span></div>` : nothing;
    const thumbs = f.images && f.images.length ? html`<div class="thumbs">${f.images.map((img) => html`<img src=${img.url} alt="" />`)}</div>` : nothing;
    const targets =
      blocks.length > 1
        ? html`<div class="field">
            <span class="flabel">No bloco</span>
            <div class="chip-row">
              ${blocks.map((b) => html`<button class="pick list ${f.target === b.id ? "on" : ""}" style=${this._cv(b)} @click=${() => this._setForm({ target: b.id })}><span class="dot"></span><span>${clip(b.name, 22)}</span></button>`)}
            </div>
          </div>`
        : nothing;

    if (f.step === "text") {
      return html`
        ${this._sheetHead("Colar mensagem", toPick)}
        <label class="field">
          <span class="flabel">Mensagem</span>
          <textarea rows="7" .value=${f.text} placeholder="Cole aqui a mensagem do WhatsApp, e-mail ou anotação…" @input=${(e) => this._setForm({ text: e.target.value, error: null })}></textarea>
        </label>
        ${error} ${targets}
        <div class="sheet-actions">
          <button class="btn outline" @click=${() => this._pasteClipboard()}>${icon("clipboard-paste")}Colar</button>
          ${ai.available ? html`<button class="btn outline" ?disabled=${!(f.text || "").trim()} @click=${() => this._readText(false)}>Como está</button>` : nothing}
          <button class="btn primary" ?disabled=${!(f.text || "").trim()} @click=${() => this._readText(true)}>${ai.available ? html`${icon("sparkles")}Organizar` : "Criar folha"}</button>
        </div>
        <p class="sheet-note">${ai.available ? "A IA do seu Home Assistant limpa a mensagem e deixa como uma anotação. Você revisa antes de salvar." : "Sem IA configurada: a mensagem vira uma folha do jeito que está."}</p>
      `;
    }

    if (f.step === "loading") {
      return html`
        ${this._sheetHead("Lendo…")}
        ${thumbs}
        <div class="imp-loading"><span class="spin">${icon("loader-circle")}</span><span>${f.loadingText || "Lendo…"}</span></div>
        <div class="sheet-actions">
          <button class="btn outline" @click=${() => {
            this._importToken = 0;
            this._setForm({ step: f.prevStep || "pick" });
          }}>Cancelar</button>
        </div>
      `;
    }

    if (f.step === "review") {
      const from = f.provider === "local" ? "texto original" : f.provider === "gemini" ? "lido pelo Gemini" : f.provider ? "lido pela IA do Home Assistant" : "";
      return html`
        ${this._sheetHead("Revisar folha", toPick)}
        ${thumbs}
        <p class="sheet-note top">${from ? `${from[0].toUpperCase()}${from.slice(1)}. ` : ""}Corrija o que precisar antes de salvar.</p>
        ${f.note ? html`<div class="imp-error soft">${icon("sparkles")}<span>${f.note}</span></div>` : nothing}
        <textarea class="review-text" .value=${f.result} aria-label="Texto da folha" @input=${(e) => this._setForm({ result: e.target.value })}></textarea>
        ${ai.images
          ? html`<div class="more-row">
              <button class="pick" @click=${() => this._pickFiles("photos")}>${icon("images")}<span>Mais fotos</span></button>
              <button class="pick" @click=${() => this._openCamera()}>${icon("scan-text")}<span>Digitalizar mais</span></button>
            </div>`
          : nothing}
        ${targets}
        <div class="sheet-actions">
          <button class="btn primary" ?disabled=${!(f.result || "").trim()} @click=${() => this._createFromText(f.result)}>Criar folha${target ? ` em ${clip(target.name, 18)}` : ""}</button>
        </div>
      `;
    }

    return html`
      ${this._sheetHead("Nova folha")}
      ${targets}
      <div class="new-strip">
        <button class="main" @click=${() => this._write()}>${icon("pen-line")}<span>Escrever${target && blocks.length <= 1 ? ` em ${clip(target.name, 20)}` : ""}</span></button>
      </div>
      <div class="imp-options">
        <button class="imp-opt" @click=${() => (this._setForm({ step: "text", error: null }), this._focusSheetText())}>
          <span class="imp-ic">${icon("message-square-text")}</span>
          <span class="imp-tx"><b>Colar mensagem</b><small>WhatsApp, e-mail, anotação</small></span>
          ${icon("chevron-right")}
        </button>
        <button class="imp-opt" ?disabled=${!ai.images} @click=${() => this._pickFiles("photos")}>
          <span class="imp-ic">${icon("images")}</span>
          <span class="imp-tx"><b>Escolher fotos</b><small>${this._isHaAndroid() ? "Prints e fotos da galeria, uma por vez" : "Prints e fotos da galeria (até 6)"}</small></span>
          ${icon("chevron-right")}
        </button>
        <button class="imp-opt" ?disabled=${!ai.images} @click=${() => this._openCamera()}>
          <span class="imp-ic">${icon("scan-text")}</span>
          <span class="imp-tx"><b>Digitalizar com IA</b><small>Fotografe uma anotação em papel</small></span>
          ${icon("chevron-right")}
        </button>
      </div>
      ${!ai.images
        ? html`<div class="imp-error soft">${icon("sparkles")}<span>Para ler fotos, configure uma IA no Home Assistant com <b>tarefa de IA</b> (por exemplo a integração Google Gemini) ou coloque uma chave do Gemini nas opções do app MemorIA.</span></div>`
        : nothing}
      ${error}
    `;
  }

  _renderConfirm() {
    const f = this._form;
    return html`
      <div class="sheet-head"><h3 class="display">${f.title}</h3></div>
      <p class="confirm-text">${f.text}</p>
      <div class="sheet-actions">
        <button class="btn outline" @click=${() => this._closeSheet()}>Cancelar</button>
        <button class="btn ${f.danger ? "danger-fill" : "primary"}" @click=${() => f.run()}>${f.label}</button>
      </div>
    `;
  }

  _renderCamera() {
    const c = this._cam;
    if (!c) return nothing;
    const n = c.shots.length;
    return html`
      <div class="cam" role="dialog" aria-label="Digitalizar com IA">
        <video playsinline muted autoplay></video>
        ${c.flash ? html`<div class="cam-flash" .key=${c.flash}></div>` : nothing}
        <div class="cam-top">
          <button class="cam-btn" aria-label="Fechar" @click=${() => this._closeCamera()}>${icon("x")}</button>
          <span class="cam-title">Digitalizar com IA</span>
          ${c.torchOk ? html`<button class="cam-btn ${c.torch ? "on" : ""}" aria-label="Lanterna" @click=${() => this._toggleTorch()}>${icon("zap")}</button>` : html`<span class="cam-btn ghost"></span>`}
        </div>
        ${c.status === "error"
          ? html`<div class="cam-msg">
              ${icon("camera")}
              <p>${c.error}</p>
              <button class="btn primary" @click=${() => this._cameraFallback()}>${icon("images")}Escolher foto</button>
            </div>`
          : html`<div class="cam-frame"><i></i><i></i><i></i><i></i></div>
              <p class="cam-hint">${c.status === "starting" ? "Abrindo a câmera…" : n ? `${plural(n, "página", "páginas")}. Fotografe outra ou toque em Pronto.` : "Enquadre a anotação e toque no botão"}</p>`}
        <div class="cam-bottom">
          <div class="cam-shots">${c.shots.slice(-3).map((s) => html`<img src=${s.url} alt="" />`)}${n > 3 ? html`<span>+${n - 3}</span>` : nothing}</div>
          <button class="cam-shutter" aria-label="Fotografar" ?disabled=${c.status !== "live" || n >= 6} @click=${() => this._shoot()}><span></span></button>
          <button class="cam-done" ?disabled=${!n} @click=${() => this._useShots()}>Pronto${n ? ` (${n})` : ""}</button>
        </div>
      </div>
    `;
  }

  _renderToast() {
    if (!this._toast) return nothing;
    const t = this._toast;
    return html`<div class="toast ${this._sheet ? "has-sheet" : ""}" role="status">
      <span>${t.text}</span>
      ${t.action
        ? html`<button @click=${() => {
            this._toast = null;
            t.action.run();
          }}>${t.action.label}</button>`
        : nothing}
    </div>`;
  }
}

if (!customElements.get("memoria-app")) customElements.define("memoria-app", MemoriaApp);

export { MemoriaApp };
