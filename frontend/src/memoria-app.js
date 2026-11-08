import { LitElement, html, nothing, repeat, live, unsafeSVG, unsafeCSS } from "../vendor/lit-all.min.js";
import { ICONS } from "./icons.js";
import { ensureFonts } from "./fonts.js";
import { styles, notebookStyles } from "./styles.js";
import { aboutPage, aboutStyles } from "./about.js";
import { themePicker, colorPicker, lookStyles, colorOfDay } from "./look.js";
import { swipeStart, swipeEnd, slideIn } from "./swipe.js";
import { chatStyles } from "./chat.js";
import { ChatMixin } from "./chat-panel.js";
import { Recorder, micError, VOICE_RATE, VOICE_MAX_S } from "./voice.js";
import { PALETTE, colorById, colorVars, hexToRgba, fold, foldKeepLength, plural, clip, writtenAt, hm, newId, firstLine, prepareImage } from "./util.js";
import { parentHass, detectDark } from "./api.js";
import { parseLinks, hasLinks, linksToText, normalizeUrl } from "../../memoria/rootfs/app/lib/links.js";
import { appendLink, freeColor } from "../../memoria/rootfs/app/lib/writing.js";
import { PERIODS, PAPERS, buildSchedule, currentAt, nextAfter, timeline, minutesOf, fmtMin, periodAt, periodTimes, normTime, opensFor, sameName, ownerName } from "../../memoria/rootfs/app/lib/schedule.js";

const THEME_KEY = "memoria.theme";
const SAVE_DELAY = 600;
const TURN_MS = 600;
const PAPER_LABEL = { pautado: "Pautado", quadriculado: "Quadriculado", pontilhado: "Pontilhado", liso: "Liso" };
const RINGS = Array.from({ length: 14 }, () => html`<i></i>`);
// The screens of Mais (a menu, like the other apps): each one goes over the menu, and Back returns to it.
const IN_MORE = ["categorias", "config", "sobre"];
const SHELF_KEY = "memoria.blocos.categoria";
// Blocos em lista (1.10.0): "lista", or "" for the covers (kept on this device)
const VIEW_KEY = "memoria.blocos.vista";
// Blocos and Buscar de quem (1.10.0): "" the person using it (theirs and everyone's), a name, or "*" every block
// (on this device, one for each screen)
const WHO_KEY = "memoria.blocos.pessoa";
const SEARCH_WHO_KEY = "memoria.buscar.pessoa";
const REPORT_KEY = "memoria.relatorio";
const SEARCH_ARCH_KEY = "memoria.buscar.arquivados";

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

class MemoriaApp extends ChatMixin(LitElement) {
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
    _editing: { state: true },
    _correria: { state: true },
  };

  static styles = [styles, notebookStyles, aboutStyles, unsafeCSS(lookStyles), unsafeCSS(chatStyles)];

  constructor() {
    super();
    this.api = null;
    this.env = null;
    this._data = null;
    this._correria = { ultimo: null }; // Integrações › CorrerIA: the last use ({cliente, em})
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
    this._editing = null; // the sheet being written (the editor shows the real text, links included)
    this._user = { name: "" }; // {name, person}: person, the person of the house using this screen ("": none)
    this._people = []; // De quem é: the people of the house (names, from Home Assistant)
    this._archOpen = false; // Blocos › Arquivados, folded until tapped
    this._ai = { ready: false, images: false, entities: [] };
    this._aiAt = 0;
    this._voice = null; // Falar: the speech-to-text of Home Assistant
    this._backups = null; // {available, folder, backups}
    this._version = "";
    this._saving = new Map(); // page id -> {timer, inflight, dirty, sentText}
    this._base = new Map(); // page id -> `updated` the server last confirmed
    this._dropped = new Set(); // pages deleted here, ignore late echoes
    this._slotKey = null;
    this._lastTyped = 0;
    this._cache = { data: null, pages: new Map(), schedule: [] };
    this._onPopState = this._onPopState.bind(this);
    this._onVisible = this._onVisible.bind(this);
    this._onResize = () => this._fitTitles();
    this._mql = window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null;
    this._onScheme = () => this._syncDark();
  }

  // ------------------------------------------------------------ lifecycle

  connectedCallback() {
    super.connectedCallback();
    ensureFonts();
    window.addEventListener("popstate", this._onPopState);
    document.addEventListener("visibilitychange", this._onVisible);
    window.addEventListener("resize", this._onResize);
    if (this._mql && this._mql.addEventListener) this._mql.addEventListener("change", this._onScheme);
    this._tickTimer = setInterval(() => this._tick(), 20000);
    // Automático follows Home Assistant's light/dark mode while the app is open (and the system, and in the
    // preview the viewer's choice on the page)
    this._themeTimer = setInterval(() => this._theme === "auto" && this._syncDark(), 1500);
    if (window.MutationObserver) {
      this._hostTheme = new MutationObserver(() => this._syncDark());
      this._hostTheme.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    }
    this._syncDark();
    if (this.api && !this._started) this._start();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener("popstate", this._onPopState);
    document.removeEventListener("visibilitychange", this._onVisible);
    window.removeEventListener("resize", this._onResize);
    if (this._mql && this._mql.removeEventListener) this._mql.removeEventListener("change", this._onScheme);
    clearInterval(this._tickTimer);
    clearInterval(this._themeTimer);
    if (this._hostTheme) this._hostTheme.disconnect();
    clearTimeout(this._toastTimer);
    clearTimeout(this._turnTimer);
    clearTimeout(this._peopleRetry);
    this._stopStream();
    this._stopVoice();
    this._chatStop();
    for (const id of [...this._saving.keys()]) this._flushSave(id);
  }

  willUpdate(changed) {
    if (changed.has("api") && this.api && !this._started && this.isConnected) this._start();
    if (this._data && this._cache.data !== this._data) this._reindex();
  }

  updated(changed) {
    this.toggleAttribute("dark", this._dark);
    this._chatAfterRender();
    if (changed.has("_dark")) {
      // the page around the app too (behind the keyboard and the edges of the phone)
      document.documentElement.style.colorScheme = this._dark ? "dark" : "light";
      document.body.style.background = this._dark ? "#141217" : "#f8f6fb";
    }
    if (this._turn && changed.has("_turn")) {
      const el = this.renderRoot.querySelector(".turn .face.front .ink");
      if (el) el.scrollTop = this._turn.snap.scroll || 0;
    }
    if (changed.has("_path") && this._view().name === "search") {
      const input = this.renderRoot.querySelector(".search-box input");
      if (input) input.focus({ preventScroll: true });
    }
    this._fitTitles();
    if (this._scrollChip) {
      this._scrollChip = false;
      const chip = this.renderRoot.querySelector(".tchip.on, .tchip.peek");
      if (chip && chip.scrollIntoView) chip.scrollIntoView({ inline: "center", block: "nearest", behavior: "instant" });
    }
  }

  /**
   * A name as a title (a block on its screen or in Agora) never breaks inside a word: when a word doesn't fit the
   * width, the letters get smaller until it does (down to 20 px).
   */
  _fitTitles() {
    for (const el of this.renderRoot.querySelectorAll(".fit-title")) {
      const key = `${el.textContent}|${el.clientWidth}`;
      if (el.dataset.fit === key) continue;
      el.style.fontSize = "";
      let size = parseFloat(getComputedStyle(el).fontSize) || 34;
      while (el.scrollWidth > el.clientWidth + 1 && size > 20) {
        size -= 2;
        el.style.fontSize = `${size}px`;
      }
      el.dataset.fit = key;
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
      this._people = Array.isArray(res.people) ? res.people : [];
      // Home Assistant still starting: the people (and who uses this screen) a little later
      if (!this._people.length && !this._peopleRetry) this._peopleRetry = setTimeout(() => this._loadPeople(), 5000);
      this._ai = res.ai || { ready: false, images: false, entities: [] };
      this._aiAt = Date.now();
      this._correria = res.correria || { ultimo: null };
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
      if (this._aiOn() && !this._voiceAsked) {
        this._voiceAsked = true;
        this._loadVoice();
      }
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
    // the Agora of the person using this screen: their blocks and everyone's, never the archived ones
    this._cache = { data: this._data, pages, schedule: buildSchedule(this._data, { person: this._ownersOn() ? this._me() : "" }) };
  }

  /** Every block, archived too, in order. */
  _allBlocks() {
    return [...((this._data && this._data.blocks) || [])].sort((a, b) => a.order - b.order || a.created - b.created);
  }

  /** The blocks in use (not archived), in order: the shelf, Nova, Buscar, the Conversa. */
  _blocks() {
    return this._allBlocks().filter((b) => !b.archived);
  }

  /** The person of the house using this screen ("": a login that is not a person, like a shared tablet: sees all). */
  _me() {
    return (this._user && this._user.person) || "";
  }

  /** Whether a block opens in this person's Agora (theirs or everyone's, not archived; every one without Controle por pessoa). */
  _mine(b) {
    return opensFor(b, this._ownersOn() ? this._me() : "");
  }

  /** Mais › Configurações › Opções › Usar categorias (1.11.0; on unless turned off): off, no category anywhere. */
  _catsOn() {
    return this._app("cats_off", false) !== true;
  }

  /**
   * Mais › Configurações › Opções › Controle por pessoa (1.11.0; on unless turned off): off, no De quem é, every block
   * opens for everyone and no filter De quem (the owners stay saved, for when it is turned on again).
   */
  _ownersOn() {
    return this._app("owners_off", false) !== true;
  }

  /** Whose a block is, as the screens show it ("" everyone's, and always without Controle por pessoa). */
  _owner(b) {
    return this._ownersOn() ? (b && b.owner) || "" : "";
  }

  _block(id) {
    return this._data && this._data.blocks.find((b) => b.id === id);
  }

  /** The categories of the blocks (Mais › Categorias), in order. */
  _cats() {
    return [...((this._data && this._data.categories) || [])].sort((a, b) => a.order - b.order || a.name.localeCompare(b.name, "pt-BR"));
  }

  _cat(id) {
    return id ? this._cats().find((c) => c.id === id) : null;
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

  /** Mais › Configurações › Aparência › Cor do dia: on unless turned off (like the other apps). */
  _accentDaily() {
    return this._app("accent_daily", true) !== false;
  }

  _accent() {
    if (this._accentDaily()) return colorOfDay(PALETTE, new Date(this._now));
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
      // archived or someone else's now: Agora goes to what is on for this person (and an empty Agora takes one back)
      const pb = this._pad && this._block(this._pad.block);
      if (this._view().name === "now" && (!pb || !this._mine(pb))) {
        this._peek = null;
        this._choice = null;
        this._setPad(this._nowPad());
      }
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
    } else if (ev.kind === "category") {
      const categories = this._cats().slice();
      const i = categories.findIndex((c) => c.id === ev.category.id);
      if (i >= 0) categories[i] = ev.category;
      else categories.push(ev.category);
      this._data = { ...this._data, categories };
    } else if (ev.kind === "category_deleted") {
      const blocks = this._data.blocks.map((b) => (b.category === ev.id ? Object.fromEntries(Object.entries(b).filter(([k]) => k !== "category")) : b));
      this._data = { ...this._data, categories: this._cats().filter((c) => c.id !== ev.id), blocks };
    } else if (ev.kind === "reset") {
      this._applyReset(ev.data);
      return;
    } else if (ev.kind === "correria") {
      this._correria = { ...this._correria, ultimo: ev.ultimo || null };
    } else if (ev.kind === "settings") {
      const aiChanged = (ev.app && ev.app.ai_entity) !== this._app("ai_entity", undefined);
      const wasOn = this._aiOn();
      this._data = { ...this._data, periods: ev.periods, app: ev.app };
      if (aiChanged) this._refreshAi();
      if (!wasOn && this._aiOn()) this._loadVoice();
    }
    this._tick();
  }

  /** Import, restore or erase on any screen: take the new data as it is. */
  _applyReset(data) {
    for (const s of this._saving.values()) clearTimeout(s.timer);
    this._saving.clear();
    this._dropped.clear();
    this._base = new Map(data.pages.map((p) => [p.id, p.updated]));
    this._data = data;
    this._pad = null;
    this._peek = null;
    this._choice = null;
    this._slotKey = null;
    const v = this._view();
    if (v.name === "block" && !this._block(v.id)) this._go("/blocos", true);
    else this._enterView();
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
    // Nothing with a time for this person (block or sheet): no block is "the one of the moment", and Agora says so
    return null;
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
    if (v.name === "config") {
      const tab = this._configTab();
      if (tab === "integracoes") {
        this._refreshAi(false);
        if (this._aiOn() && !this._voice) this._loadVoice();
      }
      if (tab === "dados") this._loadBackups();
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
    // Mais is a menu (/mais): Categorias (/categorias), Relatório (a page of the server), Configurações
    // (/config/<aba>) and, last, Sobre (/sobre)
    if (p === "/mais") return { name: "more" };
    if (p === "/categorias") return { name: "categorias" };
    if (p === "/sobre") return { name: "sobre" };
    if ((m = p.match(/^\/config(?:\/(integracoes|dados|aparencia|opcoes))?$/))) return { name: "config", tab: m[1] || "integracoes" };
    return { name: "now" };
  }

  async _go(path, replace = false, extra = null) {
    if (this._sheet) this._closeSheet();
    // Let the sheet's history entry go first, so Back never lands on a stale screen.
    if (this._popping) await this._popping;
    const depth = ((history.state && history.state.rvDepth) || 0) + (replace ? 0 : 1);
    const state = { ...(extra || {}), rvDepth: depth, rvPath: path };
    if (replace) history.replaceState(state, "");
    else history.pushState(state, "");
    this._path = path;
    this._enterView();
    const main = this.renderRoot && this.renderRoot.querySelector("main");
    if (main) main.scrollTo({ top: 0, behavior: "instant" });
  }

  _back() {
    if (history.state && history.state.rvDepth > 0) history.back();
    else this._go("", true);
  }

  /** A row of the menu Mais: its screen goes over the menu, so Back returns to it. */
  _openFromMenu(path) {
    this._haptic("light");
    if (path === "relatorio") return this._openReport();
    this._go(path, false, { rvUp: true });
  }

  /**
   * Mais › Relatório: a page of the server (like the other apps), in the theme and the color of the app, with the
   * category and the block chosen last time (the page keeps them in memoria.relatorio).
   */
  _openReport() {
    if (!this.api.reportUrl) return this._showToast("Na prévia o relatório não abre. No app, ele abre pronto para imprimir ou baixar em PDF.");
    const last = local.get(REPORT_KEY, {}) || {};
    const q = new URLSearchParams();
    if (last.categoria && (last.categoria === "sem" || this._cat(last.categoria))) q.set("categoria", last.categoria);
    if (last.bloco && this._block(last.bloco)) q.set("bloco", last.bloco);
    q.set("tema", this._dark ? "escuro" : "claro");
    q.set("cor", this._accent().fill);
    location.href = this.api.reportUrl(q.toString());
  }

  /** A screen of Mais opened from its menu (Back returns to the menu). */
  _fromMenu() {
    return IN_MORE.includes(this._view().name) && !!(history.state && history.state.rvUp);
  }

  /** "‹ Mais", Mais in the bar and the swipe to the right on a screen of Mais: back to the menu. */
  _toMenu() {
    if (this._fromMenu()) history.back();
    else this._go("/mais", true);
  }

  // Arrastar para o lado: Agora ⇄ Blocos ⇄ Buscar ⇄ Mais, like the other apps; inside a block, to the right
  // goes back, and on a screen of Mais, to the right goes back to the menu. The notebook keeps its own swipe
  // (it turns the page), and so do the rows that scroll sideways.
  _onSwipeStart(e) {
    this._sw = this._sheet || this._cam || this._turn ? null : swipeStart(e, ".pad");
  }

  _onSwipeEnd(e) {
    const d = swipeEnd(e, this._sw);
    this._sw = null;
    if (!d || this._sheet || this._cam) return;
    const order = [
      ["now", ""],
      ["shelf", "/blocos"],
      ["search", "/buscar"],
      ["more", "/mais"],
    ];
    const name = this._view().name;
    if (name === "block") {
      if (d > 0) return;
      this._haptic("light");
      this._back();
      return;
    }
    if (IN_MORE.includes(name)) {
      if (d > 0) return;
      this._haptic("light");
      this._toMenu();
      slideIn(this, "more", d);
      return;
    }
    const i = order.findIndex(([n]) => n === name);
    const j = i + d;
    if (i < 0 || j < 0 || j >= order.length) return;
    this._haptic("light");
    this._goTab(order[j][1]);
    slideIn(this, order[j][0], d);
  }

  /** Leave a history entry we pushed (sheet, camera; n: two for a window opened from another); resolves once it is gone. */
  _popEntry(flag, n = 1) {
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
    history.go(-n);
    return p;
  }

  _goTab(path) {
    const view = this._view().name;
    if (IN_MORE.includes(view)) {
      if (path === "/mais") return this._toMenu();
      if (path !== "" && this._fromMenu()) {
        // the menu under this screen goes too: as if the tab were tapped on the menu
        this._afterPop = path;
        history.back();
        return;
      }
    }
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
    // a window opened from another one (a confirmation): Back returns to that one
    if (this._parentSheet && !(history.state && history.state.rvSub)) {
      const parent = this._parentSheet;
      this._parentSheet = null;
      if (this._sheet && history.state && history.state.rvSheet) {
        this._sheet = parent.sheet;
        this._form = parent.form;
      }
    }
    if (this._sheet && !(history.state && history.state.rvSheet)) {
      this._stopVoice();
      this._chatStop();
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
    // a tab of the bar tapped on a screen of Mais: once back on the menu, the tab in its place
    const to = this._afterPop;
    this._afterPop = null;
    if (to != null) this._go(to, true);
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
    this._stopVoice();
    if (this._sheet === "chat") this._chatStop();
    const sub = !!this._parentSheet;
    this._parentSheet = null;
    this._sheet = null;
    this._form = null;
    return this._popEntry("rvSheet", sub ? 2 : 1);
  }

  /** A window opened from another one (a confirmation): Back, the X and Cancelar return to that one. */
  _openSubSheet(sheet, form) {
    if (!this._sheet) return this._openSheet(sheet, form);
    this._parentSheet = { sheet: this._sheet, form: this._form };
    this._sheet = sheet;
    this._form = form;
    try {
      history.pushState({ ...(history.state || {}), rvSheet: true, rvSub: true }, "");
    } catch (e) {
      /* ignore */
    }
  }

  /** The X, Cancelar, a tap outside and Esc: back to the window under this one, or closed. */
  _sheetBack() {
    if (this._parentSheet && history.state && history.state.rvSub) history.back();
    else this._closeSheet();
  }

  _openConfirm(form) {
    return this._openSubSheet("confirm", form);
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

  // ------------------------------------------------------------ AI (Mais › Configurações › Integrações)

  /** Usar IA: on unless turned off (off, no reading by AI, no Falar, no Conversa). */
  _aiOn() {
    return this._app("ai_off", false) !== true;
  }

  /** The AI as the screens see it: with Usar IA off, none. */
  _aiEff() {
    return this._aiOn() ? this._ai || {} : { ready: false, images: false, entities: [], off: true };
  }

  async _setAiOn(on) {
    await this._saveSettings({ app: { ai_off: on ? null : true } });
    if (on) {
      this._refreshAi();
      this._loadVoice(true);
    }
  }

  // ------------------------------------------------------------ Falar

  /** Whether Falar works here (the speech-to-text of Home Assistant). */
  async _loadVoice(fresh = false) {
    if (!this.api || !this.api.voiceStatus) return;
    try {
      this._voice = await this.api.voiceStatus(fresh);
    } catch (err) {
      this._voice = { ready: false, reason: err.message };
    }
    this.requestUpdate();
  }

  /** Mais › Configurações › Integrações › Falar: the speech-to-text the app uses ("" = the voice assistant's). */
  async _chooseVoice(id) {
    await this._saveSettings({ app: { voice_engine: id || null } });
    await this._loadVoice(true);
    this._showToast("Fala para texto atualizada");
  }

  /** Falar, at the top right of the screens: say a sheet; the AI organizes it and you review. */
  _renderMicBtn() {
    if (!this._aiOn() || !this._voice || !this._voice.ready) return nothing;
    return html`<button class="mic-top" aria-label="Falar: criar uma folha falando" title="Falar" @click=${() => this._openNew("voice")}>${icon("mic")}</button>`;
  }

  async _startVoice() {
    if (this._rec || !this._form) return;
    this._setForm({ step: "voice", rec: "starting", secs: 0, level: 0, error: null });
    const rec = new Recorder((lvl) => (this._voiceLevel = lvl));
    this._rec = rec;
    try {
      await rec.start();
    } catch (err) {
      rec.cancel();
      if (this._rec === rec) this._rec = null;
      if (this._form && this._form.step === "voice") this._setForm({ rec: "off", error: micError(err) });
      return;
    }
    if (this._rec !== rec || !this._form || this._form.step !== "voice") return rec.cancel();
    this._setForm({ rec: "on" });
    clearInterval(this._recTimer);
    this._recTimer = setInterval(() => {
      if (this._rec !== rec) return clearInterval(this._recTimer);
      const secs = rec.seconds();
      this._setForm({ secs, level: this._voiceLevel || 0 });
      if (secs >= VOICE_MAX_S) this._finishVoice();
    }, 120);
  }

  _stopVoice() {
    clearInterval(this._recTimer);
    if (this._rec) this._rec.cancel();
    this._rec = null;
  }

  async _finishVoice() {
    const rec = this._rec;
    if (!rec) return;
    clearInterval(this._recTimer);
    this._rec = null;
    const pcm = rec.stop();
    if (pcm.length < VOICE_RATE * 0.4) {
      this._setForm({ rec: "off", error: "Não ouvi nada. Toque no microfone e fale." });
      return;
    }
    const token = (this._importToken = Date.now());
    this._setForm({ step: "loading", error: null, prevStep: "voice", loadingText: "Transcrevendo o que você disse…" });
    try {
      const r = await this.api.voiceText(pcm);
      if (this._importToken !== token || this._sheet !== "new") return;
      // what was said is read like a pasted message: the AI organizes it, you review
      this._setForm({ text: r.text, heard: r.text });
      this._readText(true);
    } catch (err) {
      if (this._importToken !== token || this._sheet !== "new") return;
      this._setForm({ step: "voice", rec: "off", error: err.message || "Não consegui transcrever." });
    }
  }

  _renderVoiceStep(head) {
    const f = this._form;
    const on = f.rec === "on";
    const mm = Math.floor((f.secs || 0) / 60);
    const ss = String(Math.floor((f.secs || 0) % 60)).padStart(2, "0");
    const target = this._block(f.target);
    return html`
      ${head}
      <div class="voice ${on ? "on" : ""}">
        <button class="voice-mic" style="--lvl:${on ? (f.level || 0).toFixed(2) : 0}" aria-label=${on ? "Pronto: usar o que falei" : "Começar a falar"} @click=${() => (on ? this._finishVoice() : this._startVoice())}>
          <span class="voice-ring"></span>${icon(on ? "check" : "mic")}
        </button>
        <div class="voice-state">${on ? html`<b>Ouvindo…</b> <span class="voice-time">${mm}:${ss}</span>` : f.rec === "starting" ? "Abrindo o microfone…" : "Toque no microfone e fale"}</div>
        <p class="voice-hint">${on ? "Toque de novo quando terminar." : html`Por exemplo: <i>“Reunião de sexta: levar o orçamento e confirmar o horário com a Ana”</i>.`}</p>
        ${target ? html`<p class="voice-hint">Vai para <b>${target.name}</b> (dá para trocar na revisão).</p>` : nothing}
      </div>
      ${f.error ? html`<div class="imp-error">${icon("circle-alert")}<span>${f.error}</span></div>` : nothing}
      <div class="sheet-actions">
        <button class="btn outline" @click=${() => (this._stopVoice(), this._closeSheet())}>Cancelar</button>
        <button class="btn primary" ?disabled=${!on} @click=${() => this._finishVoice()}>${icon("sparkles")}Pronto</button>
      </div>
    `;
  }

  /** Mais › Configurações › Integrações › Falar. */
  _renderVoicePanel() {
    const v = this._voice;
    const sel = this._app("voice_engine", "") || "";
    const opts = (v && v.options) || [];
    const checking = !v || this._voiceChecking;
    const tone = checking ? "off" : v.ready && !v.missing ? "ok" : v.ready ? "warn" : "bad";
    const title = checking ? "Verificando…" : v.ready ? "Pronto para ouvir" : "Sem fala para texto";
    const detail = checking ? "" : v.ready ? `Transcreve com ${v.name}.${v.missing ? " O escolhido não foi encontrado: usando o automático." : ""}` : v.reason || "";
    const again = async () => {
      this._voiceChecking = true;
      this.requestUpdate();
      await this._loadVoice(true);
      this._voiceChecking = false;
      this.requestUpdate();
    };
    return html`<div class="panel" id="falar">
      ${this._secHead("mic", "Falar", "Quem transforma a fala em texto. Não muda o assistente de voz do Home Assistant.")}
      <div class="ai-state ${tone}"><span class="dot"></span><div><b>${title}</b>${detail ? html`<span>${detail}</span>` : nothing}</div></div>
      ${opts.length || sel
        ? html`<label class="field" style="margin:14px 0 0">
            <span class="flabel">Fala para texto</span>
            <select class="select" aria-label="Fala para texto" @change=${(e) => this._chooseVoice(e.target.value)}>
              <option value="" ?selected=${!sel}>Automático${v && v.auto ? `: ${v.auto.name}` : ""}</option>
              ${opts.map((o) => html`<option value=${o.id} ?selected=${o.id === sel}>${o.name}</option>`)}
              ${sel && !opts.some((o) => o.id === sel) ? html`<option value=${sel} selected>${sel} (não encontrado)</option>` : nothing}
            </select>
          </label>`
        : nothing}
      <div class="ai-actions"><button class="btn outline" ?disabled=${checking} @click=${again}>${icon("rotate-ccw")}Verificar de novo</button></div>
      ${v && !v.ready
        ? html`<div class="steps-box">
            <b>Como configurar</b>
            <ol class="steps">
              <li>Com o Home Assistant Cloud, a fala para texto já vem pronta.</li>
              <li>Sem ele, instale um motor de fala: o app Whisper (local, de graça) com a integração Wyoming, ou a fala para texto de uma IA como Google Gemini ou OpenAI.</li>
              <li>Volte aqui, toque em Verificar de novo e escolha o motor na lista.</li>
            </ol>
          </div>`
        : nothing}
    </div>`;
  }

  async _refreshAi(force = true) {
    if (!force && Date.now() - this._aiAt < 60000) return;
    this._aiChecking = true;
    this.requestUpdate();
    try {
      this._ai = await this.api.aiStatus();
    } catch (err) {
      this._ai = { ...this._ai, ready: false, images: false, reason: err.message };
    }
    this._aiAt = Date.now();
    this._aiChecking = false;
    this.requestUpdate();
  }

  async _chooseAi(id) {
    await this._saveSettings({ app: { ai_entity: id } });
    await this._refreshAi();
    this._showToast("IA do app atualizada");
  }

  _openAiSettings() {
    this._closeSheet();
    this._go("/config", this._view().name !== "now").then(() =>
      this.updateComplete.then(() => {
        const el = this.renderRoot.querySelector("#leitura-ia");
        if (el) el.scrollIntoView({ block: "start", behavior: "smooth" });
      }),
    );
  }

  // ------------------------------------------------------------ Dados (export, backup, import, versions)

  async _loadBackups() {
    try {
      this._backups = await this.api.backups();
    } catch (err) {
      this._backups = { available: false, error: err.message, backups: [] };
    }
    this.requestUpdate();
  }

  async _createBackup() {
    this._busy = "backup";
    this.requestUpdate();
    try {
      const out = await this.api.createBackup();
      this._showToast(`Backup salvo em ${out.folder}/${out.name}`);
      this._haptic("success");
      await this._loadBackups();
    } catch (err) {
      this._showToast(`Não consegui criar o backup. ${err.message}`);
    }
    this._busy = null;
    this.requestUpdate();
  }

  _export(fmt, ev) {
    if (!this.api.exportUrl(fmt)) {
      ev.preventDefault();
      this._showToast("Na prévia os arquivos não são baixados.");
    }
  }

  _pickImport() {
    const input = this.renderRoot.querySelector("#mm-import");
    if (!input) return;
    input.value = "";
    input.click();
  }

  _onImportFile(ev) {
    const file = ev.target.files && ev.target.files[0];
    ev.target.value = "";
    if (!file) return;
    this._openConfirm({
      title: "Importar arquivo?",
      text: `Os blocos e folhas de agora são trocados pelos de “${clip(file.name, 40)}”. Antes, o app guarda uma cópia do que existe hoje em Versões anteriores.`,
      label: "Importar",
      run: async () => {
        this._closeSheet();
        try {
          const n = await this.api.importFile(file);
          this._haptic("success");
          this._showToast(`Importado: ${plural(n.blocks, "bloco", "blocos")} e ${plural(n.pages, "folha", "folhas")}`);
        } catch (err) {
          this._showToast(`Não consegui importar. ${err.message}`);
        }
      },
    });
  }

  _confirmRestoreBackup(b) {
    this._openConfirm({
      title: "Restaurar este backup?",
      text: `Os blocos e folhas de agora são trocados pelos do backup de ${this._dateTime(b.date)}. Antes, o app guarda uma cópia do que existe hoje.`,
      label: "Restaurar",
      run: async () => {
        this._closeSheet();
        try {
          const n = await this.api.restoreBackup(b.name);
          this._showToast(`Backup restaurado: ${plural(n.pages, "folha", "folhas")}`);
        } catch (err) {
          this._showToast(err.message);
        }
      },
    });
  }

  async _openVersions() {
    this._openSheet("versions", { list: null, error: null });
    try {
      const list = await this.api.versions();
      if (this._sheet === "versions") this._setForm({ list });
    } catch (err) {
      if (this._sheet === "versions") this._setForm({ error: err.message });
    }
  }

  _confirmRestoreVersion(v) {
    this._openConfirm({
      title: "Restaurar esta versão?",
      text: `Os blocos e folhas de agora são trocados pelos de ${this._dateTime(v.when)}. Antes, o app guarda uma cópia do que existe hoje.`,
      label: "Restaurar",
      run: async () => {
        this._closeSheet();
        try {
          await this.api.restoreVersion(v.name);
          this._showToast("Versão restaurada");
        } catch (err) {
          this._showToast(err.message);
        }
      },
    });
  }

  _confirmErase() {
    const d = this._data;
    this._openConfirm({
      title: "Apagar tudo?",
      text: `Saem ${plural(d.blocks.length, "bloco", "blocos")} e ${plural(d.pages.length, "folha", "folhas")}. Os ajustes continuam e uma cópia fica em Versões anteriores.`,
      label: "Apagar tudo",
      danger: true,
      run: async () => {
        this._closeSheet();
        try {
          await this.api.eraseAll();
          this._showToast("Tudo apagado. Uma cópia ficou em Versões anteriores.");
        } catch (err) {
          this._showToast(err.message);
        }
      },
    });
  }

  _dateTime(ms) {
    const d = new Date(ms);
    const p = (n) => String(n).padStart(2, "0");
    return `${p(d.getDate())}/${p(d.getMonth() + 1)}/${d.getFullYear()} às ${p(d.getHours())}:${p(d.getMinutes())}`;
  }

  // ------------------------------------------------------------ blocks & settings

  _openBlockSheet(block) {
    const b = block || null;
    this._openSheet("block", {
      id: b ? b.id : null,
      name: b ? b.name : "",
      color: b ? b.color : freeColor(this._data.blocks, PALETTE.map((c) => c.id), "lilas"),
      paper: b ? b.paper : "pautado",
      periods: b ? [...(b.periods || [])] : [],
      times: b ? [...(b.times || [])] : [],
      // a new block from Blocos filtered by a category goes into it
      category: b ? b.category || "" : this._shelfCat() && this._shelfCat() !== "sem" ? this._shelfCat() : "",
      newCat: null,
      // De quem é: "" = Todos
      owner: b ? b.owner || "" : "",
    });
    this._loadPeople();
    if (!b) {
      this.updateComplete.then(() => {
        const input = this.renderRoot.querySelector(".sheet input[type=text]");
        if (input) input.focus();
      });
    }
  }

  /** De quem é: the people of the house, fresh from Home Assistant (the sheet shows them as they come). */
  async _loadPeople() {
    if (!this.api.people) return;
    try {
      const r = await this.api.people();
      if (Array.isArray(r.people)) this._people = r.people;
      if ((r.person || "") !== this._me()) {
        // now the app knows who uses this screen: Agora becomes theirs
        this._user = { ...this._user, person: r.person || "" };
        this._cache = { ...this._cache, data: null };
        if (this._view().name === "now" && !this._sheet) this._enterView();
      }
      this.requestUpdate();
    } catch (e) {
      /* keep the ones from the start */
    }
  }

  /** extra: {archived: true|false} from Arquivar / Desarquivar, saved with the rest of the sheet. */
  async _saveBlockSheet(extra = {}) {
    const f = this._form;
    const block = {
      name: (f.name || "").trim() || "Novo bloco",
      color: f.color,
      paper: f.paper,
      periods: f.periods,
      times: f.times,
      category: f.category || "",
      owner: ownerName(f.owner || ""),
      ...extra,
    };
    if (f.id) block.id = f.id;
    try {
      // Nova categoria, written here: created first (with the color of the block), then the block goes into it
      if (f.newCat != null && f.newCat.trim()) {
        const name = f.newCat.trim();
        const same = this._cats().find((c) => fold(c.name).trim() === fold(name));
        const cat = same || (await this.api.saveCategory({ name, color: this._cats().some((c) => c.color === f.color) ? this._freeCatColor() : f.color }));
        if (!same) this._putCategory(cat);
        block.category = cat.id;
        this._setForm({ category: cat.id, newCat: null });
      }
      const saved = await this.api.saveBlock(block);
      await this._closeSheet();
      this._onEvent({ kind: "block", block: saved });
      this._haptic("success");
      if ("archived" in extra) this._afterArchive(saved, !!extra.archived);
      else if (!f.id) this._openPage(saved.id, "new");
      else this._showToast("Bloco salvo");
    } catch (err) {
      this._showToast(`Não consegui salvar o bloco: ${err.message}`);
    }
  }

  /**
   * Arquivar bloco (nothing is deleted): it leaves Agora, the shelf, Nova and Buscar and waits under Arquivados, at
   * the end of Blocos. From its own screen, back to Blocos; Desfazer brings it back.
   */
  _afterArchive(block, on) {
    if (!on) return this._showToast("Bloco de volta aos blocos");
    const v = this._view();
    if (v.name === "block" && v.id === block.id) this._go("/blocos", true);
    this._showToast("Bloco arquivado", { label: "Desfazer", run: () => this._setArchived(block, false) });
  }

  /** Arquivar / Desarquivar without the sheet (Desarquivar on the block's screen, Desfazer). */
  async _setArchived(block, on) {
    try {
      const saved = await this.api.saveBlock({ id: block.id, archived: on });
      this._onEvent({ kind: "block", block: saved });
      this._haptic("success");
      this._afterArchive(saved, on);
    } catch (err) {
      this._showToast(`Não consegui ${on ? "arquivar" : "desarquivar"}: ${err.message}`);
    }
  }

  _confirmDeleteBlock() {
    const f = this._form;
    const b = this._block(f.id);
    if (!b) return;
    const n = this._pagesOf(b.id).length;
    this._openConfirm({
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

  // ---------- Mais › Categorias

  /** The color for a new category: one not used yet by the others. */
  _freeCatColor() {
    return freeColor(this._cats(), PALETTE.map((c) => c.id), "grafite");
  }

  _openCategorySheet(cat) {
    this._openSheet("category", { id: cat ? cat.id : null, name: cat ? cat.name : "", color: cat ? cat.color : this._freeCatColor() });
    if (!cat) {
      this.updateComplete.then(() => {
        const input = this.renderRoot.querySelector(".sheet input[type=text]");
        if (input) input.focus();
      });
    }
  }

  _putCategory(c) {
    this._onEvent({ kind: "category", category: c });
  }

  async _saveCategorySheet() {
    const f = this._form;
    const name = (f.name || "").trim();
    if (!name || f.busy) return;
    this._setForm({ busy: true });
    try {
      const saved = await this.api.saveCategory({ ...(f.id ? { id: f.id } : {}), name, color: f.color });
      this._putCategory(saved);
      this._closeSheet();
      this._haptic("success");
      this._showToast(f.id ? "Categoria salva" : "Categoria criada");
    } catch (err) {
      if (this._sheet === "category") this._setForm({ busy: false });
      this._showToast(err.message);
    }
  }

  _confirmDeleteCategory() {
    const c = this._cat(this._form.id);
    if (!c) return;
    const n = this._data.blocks.filter((b) => b.category === c.id).length;
    this._openConfirm({
      title: `Apagar “${clip(c.name, 24)}”?`,
      text: n ? `${n === 1 ? "O bloco dela fica" : `Os ${n} blocos dela ficam`} sem categoria. As folhas não mudam.` : "Nenhum bloco usa esta categoria.",
      label: "Apagar categoria",
      danger: true,
      run: async () => {
        this._closeSheet();
        try {
          await this.api.deleteCategory(c.id);
          this._onEvent({ kind: "category_deleted", id: c.id });
          if (local.get(SHELF_KEY, "") === c.id) local.set(SHELF_KEY, "");
          this._showToast("Categoria apagada");
        } catch (err) {
          this._showToast(`Não consegui apagar: ${err.message}`);
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
    this._openConfirm({
      title: "Arrancar esta folha?",
      text: page.text.trim() ? `“${clip(firstLine(linksToText(page.text)), 60)}” será apagada.` : "A folha em branco será removida.",
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

  // ---------- Adicionar link (the ⋯ of the sheet): Link and, optionally, Nome; it goes at the end of the sheet

  _openLinkSheet(pageId) {
    this._openSubSheet("link", { page: pageId, url: "", name: "", error: "" });
    this.updateComplete.then(() => {
      const input = this.renderRoot.querySelector(".sheet input[type=url]");
      if (input) input.focus();
    });
  }

  _renderLinkSheet() {
    const f = this._form;
    return html`
      ${this._sheetHead("Adicionar link")}
      <label class="field">
        <span class="flabel">Link</span>
        <input type="url" inputmode="url" autocomplete="off" autocapitalize="off" spellcheck="false" .value=${f.url} placeholder="https://…" @input=${(e) => this._setForm({ url: e.target.value, error: "" })} @keydown=${(e) => e.key === "Enter" && this._addLink()} />
        ${f.error ? html`<span class="field-error">${f.error}</span>` : nothing}
      </label>
      <label class="field">
        <span class="flabel">Nome (opcional)</span>
        <input type="text" maxlength="120" .value=${f.name} placeholder="Ex.: Receita do bolo" @input=${(e) => this._setForm({ name: e.target.value })} @keydown=${(e) => e.key === "Enter" && this._addLink()} />
      </label>
      <div class="sheet-actions">
        <button class="btn outline" @click=${() => this._sheetBack()}>Cancelar</button>
        <button class="btn primary" ?disabled=${!(f.url || "").trim()} @click=${() => this._addLink()}>Adicionar</button>
      </div>
    `;
  }

  async _addLink() {
    const f = this._form;
    const page = this._page(f.page);
    if (!page) return this._closeSheet();
    const url = normalizeUrl(f.url);
    if (!url) {
      this._setForm({ error: "Esse link não abre. Use um endereço como https://site.com.br" });
      return;
    }
    this._putPage({ ...page, text: appendLink(page.text, url, f.name) });
    this._queueSave(page.id, 0);
    this._closeSheet();
    this._haptic("success");
    this._showToast("Link adicionado");
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
    const pb = pad && this._block(pad.block);
    if (pb && !pb.archived) return pb.id;
    const b = this._blocks().find((x) => this._mine(x)) || this._blocks()[0];
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
    const opening = this._openSheet("new", { target, step: start === "text" ? "text" : start === "voice" ? "voice" : "pick", text: "", images: [], result: "", provider: null, error: null, note: null });
    if (start === "voice") this.updateComplete.then(() => this._startVoice());
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
    if (useAi && this._aiEff().ready) {
      this._setForm({ step: "loading", error: null, note: null, prevStep: this._form.heard ? "voice" : "text", loadingText: "Organizando com IA…" });
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
    else if (view.name === "config") page = this._renderConfig();
    else if (view.name === "categorias") page = this._renderCategories();
    else if (view.name === "sobre") page = this._renderAbout();
    else page = this._renderNow();
    return html`
      <div class="root" style=${style}>
        <div class="app">
          ${!this.env || this.env.topbar
            ? html`<header class="topbar"><div class="title">Memor<b>IA</b></div></header>`
            : nothing}
          ${!this._online ? html`<div class="offline">${icon("wifi-off")}<span>Sem conexão com o MemorIA. Reconectando…</span></div>` : nothing}
          <main @touchstart=${(e) => this._onSwipeStart(e)} @touchend=${(e) => this._onSwipeEnd(e)}>${page}</main>
          ${this._renderNav(view)}
        </div>
        ${this._renderSheet()} ${this._renderToast()} ${this._renderCamera()}
        <input id="mm-photos" class="sr" type="file" accept="image/*" ?multiple=${!this._isHaAndroid()} tabindex="-1" aria-hidden="true" @change=${(e) => this._onFiles(e)} />
        <input id="mm-scan" class="sr" type="file" accept="image/*" capture="environment" tabindex="-1" aria-hidden="true" @change=${(e) => this._onFiles(e)} />
        <input id="mm-import" class="sr" type="file" accept=".zip,.json,application/zip,application/x-zip-compressed,application/json" tabindex="-1" aria-hidden="true" @change=${(e) => this._onImportFile(e)} />
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
          ${tab(["search"], "/buscar", "Buscar", "search")} ${tab(["more", ...IN_MORE], "/mais", "Mais", "sliders-horizontal")}
        </div>
      </nav>
    `;
  }

  /** The top of a screen; up: a screen of Mais, with "‹ Mais" above the title; fit: a name (it shrinks to fit, never broken). */
  _renderHead(title, status, up = false, fit = false) {
    const name = this._userName();
    const st = !this._online ? { text: "Reconectando ao MemorIA…", tone: "off" } : status;
    return html`<header class="brand-head">
      <div class="head-row"><p class="eyebrow"><span class="brand">Memor<span>IA</span></span>${name ? ` · Olá, ${name}` : ""}</p>${this._renderChatBtn()}${this._renderMicBtn()}</div>
      ${up ? html`<button class="uplink" @click=${() => this._toMenu()}>${icon("chevron-left")}Mais</button>` : nothing}
      <h1 class="page-title ${fit ? "fit-title" : ""}">${title}</h1>
      ${st ? html`<p class="status"><span class="dot ${st.tone || ""}" aria-hidden="true"></span><span>${st.text}</span>${st.extra || nothing}</p>` : nothing}
    </header>`;
  }

  // ---------- Agora

  /** Agora with no notebook to show: the reason, Ver blocos and Novo bloco (or Importar backup, the first time). */
  _renderNowEmpty(status, h3, text, first = false) {
    return html`<section class="page">
      ${this._renderHead("Agora", status)}
      <div class="panel now-empty"><div class="empty"><div class="em-icon">${icon(first ? "notebook-pen" : "calendar-clock")}</div><h3>${h3}</h3>${text}</div></div>
      <div class="sheet-actions" style="padding:0">
        ${first
          ? html`<button class="btn outline" @click=${() => this._pickImport()}>${icon("upload")}Importar backup</button>`
          : html`<button class="btn outline" @click=${() => this._goTab("/blocos")}>${icon("library")}Ver blocos</button>`}
        <button class="btn primary" @click=${() => this._openBlockSheet(null)}>${icon("plus")}Novo bloco</button>
      </div>
    </section>`;
  }

  /** Blocks with a time (of the block or of a sheet) that are someone else's: they open only in that person's Agora. */
  _othersTimed() {
    const timed = (b) => (b.periods || []).length || (b.times || []).length || this._pagesOf(b.id).some((p) => (p.times || []).length);
    return this._blocks().filter((b) => b.owner && !this._mine(b) && timed(b));
  }

  _renderNow() {
    const { entries, min, cur, next } = this._slot();
    const pad = this._pad;
    const b = pad ? this._block(pad.block) : null;
    if (!b) {
      if (!this._data.blocks.length) {
        return this._renderNowEmpty({ text: "Nenhum bloco ainda" }, "Comece um bloco", html`<p>Crie um bloco de anotações e escolha quando ele abre sozinho: de manhã, à tarde, à noite ou num horário exato.</p>`, true);
      }
      // there are blocks, but none for this Agora: archived, or someone else's (De quem é)
      if (!this._blocks().some((x) => this._mine(x))) {
        return this._renderNowEmpty({ text: "Nenhum bloco aqui", tone: "off" }, "Nada para agora", html`<p>Os blocos arquivados e os de outras pessoas ficam em Blocos.</p>`);
      }
      // blocks of this person (or everyone's), none with a time: no block pretends to be the one of the moment
      const period = periodOf(periodAt(min, periodTimes(this._data)));
      const others = this._othersTimed();
      const whose =
        others.length === 1
          ? `${clip(others[0].name, 30)} é de ${others[0].owner}: só abre no Agora de ${others[0].owner}.`
          : others.length
            ? `Os blocos de outras pessoas (${others.slice(0, 3).map((x) => clip(x.name, 24)).join(", ")}${others.length > 3 ? "…" : ""}) só abrem no Agora delas.`
            : "";
      return this._renderNowEmpty(
        { text: `${period.label} · nada com horário`, tone: "off" },
        "Nada com horário",
        html`<p>Um bloco ou uma folha com horário abre aqui sozinho. Escolha nos ajustes do bloco ou no ⋯ da folha.</p>${whose ? html`<p class="now-whose">${whose}</p>` : nothing}`,
      );
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
      // what started before midnight still holds: "desde ontem às 18:00"
      status = { text: `${period.label} · desde ${cur.min > min ? "ontem às " : ""}${fmtMin(cur.min)}${nb ? ` · depois ${clip(nb.name, 18)} às ${fmtMin(next.min)}` : ""}` };
    } else {
      status = { text: period.label, tone: "off" };
    }
    return html`
      <section class="page">
        ${this._renderHead(b.name, status, false, true)}
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
          : nothing}
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
    // a sheet with links, not being written: the links as short chips (tap the text to write)
    const viewing = !!page && this._editing !== page.id && hasLinks(page.text);
    return html`
      <div class="pad ${opts.tall ? "tall" : ""}" style=${this._cv(b)} @touchstart=${(e) => this._touchStart(e)} @touchend=${(e) => this._touchEnd(e)}>
        <div class="pad-cover"></div>
        <div class="pad-stack"></div>
        <div class="leaf ${b.paper}">
          ${this._renderLeafTop({ created: page ? page.created : null, times: page ? page.times : [], num: idx + 1, total }, !!page)}
          ${viewing ? this._renderInkView(page, hand, `Folha ${idx + 1} de ${total} do bloco ${b.name}`) : nothing}
          <textarea
            class="ink ${hand ? "" : "normal"} ${viewing ? "behind" : ""}"
            .value=${live(page ? page.text : "")}
            placeholder=${page ? "" : idx === 0 ? "Escreva a primeira folha deste bloco…" : "Folha nova. Escreva aqui…"}
            spellcheck="true"
            aria-label="Folha ${idx + 1} de ${total} do bloco ${b.name}"
            @input=${(e) => this._onInk(e)}
            @focus=${() => (this._editing = pad.page)}
            @blur=${() => {
              this._editing = null;
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
                <div class="ink ${hand ? "" : "normal"}">${this._inkParts(this._turn.snap.text)}</div>
              </div>
              <div class="face back"></div>
              <div class="shade"></div>
            </div>`
          : nothing}
      </div>
    `;
  }

  /** The text of a sheet with each link as a chip (the name, or the site and a bit of the address). */
  _inkParts(text, live = false) {
    if (!hasLinks(text)) return text;
    // no spaces between the parts: the text keeps its line breaks (pre-wrap)
    return parseLinks(text).map((p) =>
      p.type === "link"
        ? html`<a class="lnk" href=${p.url} target="_blank" rel="noopener noreferrer" title=${p.url} tabindex=${live ? "0" : "-1"} @click=${(e) => this._openLink(e, p.url)}>${icon("link")}<span>${p.label}</span></a>`
        : html`<span data-o=${p.start}>${p.text}</span>`,
    );
  }

  /** The sheet with its links as chips; a tap on the text opens the editor there (with the real text). */
  _renderInkView(page, hand, label) {
    return html`<div class="ink ink-view ${hand ? "" : "normal"}" role="textbox" aria-readonly="true" aria-label=${label} tabindex="0" @click=${(e) => this._editFromView(e, page)} @keydown=${(e) => e.key === "Enter" && !e.target.closest("a") && this._editFromView(e, page)}>${this._inkParts(page.text, true)}</div>`;
  }

  _openLink(e, url) {
    e.stopPropagation();
    this._haptic("light");
    // the link opens outside the app (in the app of Home Assistant, the browser of the phone)
    if (!e.currentTarget.href) {
      e.preventDefault();
      window.open(url, "_blank", "noopener");
    }
  }

  /** Where the finger fell on the view, as a place in the text of the sheet. */
  _offsetAt(e, page) {
    const root = this.renderRoot;
    let node = null;
    let offset = 0;
    try {
      if (e.clientX || e.clientY) {
        if (document.caretPositionFromPoint) {
          const pos = document.caretPositionFromPoint(e.clientX, e.clientY, { shadowRoots: [root] });
          if (pos) ({ offsetNode: node, offset } = pos);
        } else if (document.caretRangeFromPoint) {
          const r = document.caretRangeFromPoint(e.clientX, e.clientY);
          if (r) ({ startContainer: node, startOffset: offset } = r);
        }
      }
    } catch (err) {
      node = null;
    }
    const span = node && (node.nodeType === 3 ? node.parentElement : node);
    if (span && span.dataset && span.dataset.o != null && node.nodeType === 3) return Math.min(page.text.length, Number(span.dataset.o) + offset);
    const tapped = e.target && e.target.closest && e.target.closest("[data-o]");
    if (tapped) return Math.min(page.text.length, Number(tapped.dataset.o) + tapped.textContent.length);
    return page.text.length;
  }

  _editFromView(e, page) {
    if (e.target.closest && e.target.closest("a")) return;
    const at = this._offsetAt(e, page);
    const ta = this.renderRoot.querySelector("textarea.ink");
    if (!ta) return;
    // inside the tap, so the phone opens the keyboard
    ta.focus({ preventScroll: true });
    ta.setSelectionRange(at, at);
    this.updateComplete.then(() => {
      if (this.renderRoot.activeElement !== ta) return;
      ta.setSelectionRange(at, at);
      this._scrollToCaret(ta, at);
    });
  }

  /** The editor scrolled so the cursor is in sight (a copy of its text up to the cursor says how far down it is). */
  _scrollToCaret(ta, at) {
    const cs = getComputedStyle(ta);
    const m = document.createElement("div");
    for (const k of ["fontFamily", "fontSize", "fontWeight", "lineHeight", "letterSpacing", "paddingTop", "paddingRight", "paddingBottom", "paddingLeft"]) m.style[k] = cs[k];
    Object.assign(m.style, { position: "absolute", visibility: "hidden", left: "-9999px", top: "0", width: `${ta.clientWidth}px`, whiteSpace: "pre-wrap", overflowWrap: "anywhere", boxSizing: "border-box" });
    m.textContent = ta.value.slice(0, at);
    const mark = document.createElement("span");
    mark.textContent = "\u200b";
    m.appendChild(mark);
    this.renderRoot.appendChild(m);
    const y = mark.offsetTop;
    m.remove();
    if (y < ta.scrollTop || y > ta.scrollTop + ta.clientHeight - 40) ta.scrollTop = Math.max(0, y - ta.clientHeight / 3);
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

  /** The category chosen in Blocos (kept on this device): "" all, a category id or "sem". */
  _shelfCat() {
    if (!this._catsOn()) return "";
    const v = local.get(SHELF_KEY, "") || "";
    if (v === "sem") return this._cats().length && this._allBlocks().some((b) => !this._cat(b.category)) ? "sem" : "";
    return this._cat(v) ? v : "";
  }

  _setShelfCat(v) {
    this._haptic("light");
    local.set(SHELF_KEY, v);
    this.requestUpdate();
  }

  /** The people to filter Blocos by: the person using it first, the others of the house, then names written on blocks. */
  _whoNames() {
    const out = [];
    const add = (n) => n && !out.some((x) => sameName(x, n)) && out.push(n);
    add(this._me());
    for (const n of this._people || []) add(n);
    for (const b of this._allBlocks()) add(ownerName(b.owner || ""));
    return out;
  }

  /** Whether the filter de quem shows: more than one person, or a block with an owner. */
  _whoOn() {
    return this._ownersOn() && (this._whoNames().length > 1 || this._allBlocks().some((b) => b.owner));
  }

  /** De quem (Blocos, Buscar): a name (their blocks and everyone's) or "*" (all); the person using it to begin with. */
  _shelfWho(key = WHO_KEY) {
    if (!this._whoOn()) return "*";
    const v = local.get(key, "") || "";
    if (v === "*") return "*";
    const n = v && this._whoNames().find((x) => sameName(x, v));
    if (n) return n;
    return this._me() || "*";
  }

  _setShelfWho(v, key = WHO_KEY) {
    this._haptic("light");
    local.set(key, v === this._me() ? "" : v);
    this.requestUpdate();
  }

  /** A block of that filter: someone's blocks come with everyone's (the ones without an owner). */
  _ofWho(b, who) {
    return who === "*" || !b.owner || sameName(b.owner, who);
  }

  /** The chips de quem: each person (the one using it first), then Todos. */
  _renderWhoChips(who, key) {
    if (!this._whoOn()) return nothing;
    return html`<div class="chip-row who-filter" role="radiogroup" aria-label="De quem">
      ${[...this._whoNames(), "*"].map((n) => {
        const on = n === "*" ? who === "*" : who !== "*" && sameName(who, n);
        return html`<button class="pick ${on ? "on" : ""}" role="radio" aria-checked=${on ? "true" : "false"} @click=${() => this._setShelfWho(n, key)}>${icon(n === "*" ? "users" : "user-round")}<span>${n === "*" ? "Todas as pessoas" : clip(n, 18)}</span></button>`;
      })}
    </div>`;
  }

  /** Blocos in a list instead of the covers (the quick choice at the top, kept on this device). */
  _shelfList() {
    return local.get(VIEW_KEY, "") === "lista";
  }

  _setShelfView(list) {
    if (list === this._shelfList()) return;
    this._haptic("light");
    local.set(VIEW_KEY, list ? "lista" : "");
    this.requestUpdate();
  }

  _renderShelf() {
    const all = this._allBlocks();
    const cats = this._catsOn() ? this._cats() : [];
    const fcat = this._shelfCat();
    const who = this._shelfWho();
    const inCat = (b) => this._ofWho(b, who) && (!fcat || (fcat === "sem" ? !this._cat(b.category) : b.category === fcat));
    const blocks = this._blocks().filter(inCat);
    // Arquivados: at the end of the shelf, folded (the last archived first)
    const archived = all.filter((b) => b.archived && inCat(b)).sort((a, b) => b.archived - a.archived);
    const pages = blocks.reduce((n, b) => n + this._pagesOf(b.id).length, 0);
    const none = cats.length > 0 && all.some((b) => !this._cat(b.category));
    const groups = timeline(this._schedule());
    const { cur } = this._slot();
    const chip = (v, label, c = null) => html`<button class="pick ${c ? "list" : ""} ${fcat === v ? "on" : ""}" style=${c ? colorVars(colorById(c.color) || PALETTE[9], this._dark) : ""} aria-pressed=${fcat === v ? "true" : "false"} @click=${() => this._setShelfCat(v)}>${c ? html`<span class="dot"></span>` : nothing}<span>${label}</span></button>`;
    return html`
      <section class="page">
        ${this._renderHead("Blocos", { text: `${plural(blocks.length, "bloco", "blocos")} · ${plural(pages, "folha", "folhas")}`, extra: this._renderViewToggle() })}
        ${this._renderWhoChips(who, WHO_KEY)}
        ${cats.length
          ? html`<div class="chip-row cat-filter" role="group" aria-label="Categoria">
              ${chip("", "Todos")} ${cats.map((c) => chip(c.id, clip(c.name, 22), c))} ${none ? chip("sem", "Sem categoria") : nothing}
            </div>`
          : nothing}
        ${this._shelfList()
          ? this._renderShelfList(blocks)
          : html`<div class="shelf">
          ${repeat(
            blocks,
            (b) => b.id,
            (b) => {
              const n = this._pagesOf(b.id).length;
              const parts = this._whenParts(b);
              return html`<button class="cover" style=${this._cv(b)} @click=${() => this._openPage(b.id)} aria-label="Abrir ${b.name}">
                <div class="sticker"><b>${b.name}</b><small>${plural(n, "folha", "folhas")}${this._owner(b) ? html` · <span class="owner">de ${clip(this._owner(b), 16)}</span>` : nothing}</small></div>
                <div class="when">${parts.length ? parts.map((p) => html`<span>${icon(p.icon)}${p.label}</span>`) : html`<span>${icon("notebook")}Sem horário</span>`}</div>
              </button>`;
            },
          )}
          <button class="cover add" @click=${() => this._openBlockSheet(null)}>${icon("plus")}<span>Novo bloco</span></button>
        </div>`}
        ${archived.length ? this._renderArchived(archived) : nothing}
        ${groups.length
          ? html`<div class="panel">
              <div class="overline">Seu dia</div>
              ${groups.map((g) =>
                g.entries.map((e) => {
                  const eb = this._block(e.block);
                  if (!eb) return nothing;
                  const pg = e.page ? this._page(e.page) : null;
                  const why = e.kind === "period" ? `${periodOf(e.period).label}` : e.kind === "page" ? `Trecho: ${clip(firstLine(linksToText(pg && pg.text)) || "folha", 34)}` : "Horário fixo";
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

  /** Blocos: the quick choice between the covers and a list, at the right of the count. */
  _renderViewToggle() {
    const list = this._shelfList();
    return html`<span class="view-toggle" role="group" aria-label="Ver os blocos">
      <button class=${list ? "" : "on"} aria-pressed=${list ? "false" : "true"} aria-label="Em blocos" title="Em blocos" @click=${() => this._setShelfView(false)}>${icon("layout-grid")}</button>
      <button class=${list ? "on" : ""} aria-pressed=${list ? "true" : "false"} aria-label="Em lista" title="Em lista" @click=${() => this._setShelfView(true)}>${icon("list")}</button>
    </span>`;
  }

  /** Blocos em lista: one line each (the color, the name, the folhas, whose and when it opens), then Novo bloco. */
  _renderShelfList(blocks) {
    return html`<div class="panel shelf-list">
      ${repeat(
        blocks,
        (b) => b.id,
        (b) => {
          const parts = this._whenParts(b);
          const hint = [plural(this._pagesOf(b.id).length, "folha", "folhas"), this._owner(b) ? `de ${this._owner(b)}` : "", parts.length ? parts.map((p) => p.label).join(" · ") : "Sem horário"].filter(Boolean).join(" · ");
          return html`<button class="row block-row" style=${this._cv(b)} @click=${() => this._openPage(b.id)} aria-label="Abrir ${b.name}">
            <span class="tile">${icon("notebook")}</span>
            <span class="grow"><span class="label">${b.name}</span><span class="hint">${hint}</span></span>
            ${icon("chevron-right", "chev")}
          </button>`;
        },
      )}
      <button class="row block-row add" @click=${() => this._openBlockSheet(null)}>
        <span class="tile">${icon("plus")}</span>
        <span class="grow"><span class="label">Novo bloco</span></span>
      </button>
    </div>`;
  }

  /** Blocos › Arquivados (N): folded at the end of the shelf; tap to see them, tap one to open it. */
  _renderArchived(list) {
    const open = this._archOpen;
    return html`<div class="panel arch-panel">
      <button class="row arch-head ${open ? "open" : ""}" aria-expanded=${open ? "true" : "false"} @click=${() => {
        this._haptic("light");
        this._archOpen = !open;
        this.requestUpdate();
      }}>
        <span class="tile muted">${icon("archive")}</span>
        <span class="grow"><span class="label">Arquivados <span class="count">${list.length}</span></span></span>
        ${icon("chevron-down", "chev")}
      </button>
      ${open
        ? repeat(
            list,
            (b) => b.id,
            (b) => html`<button class="row arch-row" style=${this._cv(b)} @click=${() => this._openPage(b.id)} aria-label="Abrir ${b.name} (arquivado)">
              <span class="tile">${icon("notebook")}</span>
              <span class="grow"><span class="label">${b.name}</span><span class="hint">${[plural(this._pagesOf(b.id).length, "folha", "folhas"), this._owner(b) ? `de ${this._owner(b)}` : "", `arquivado ${this._day(b.archived)}`].filter(Boolean).join(" · ")}</span></span>
              ${icon("chevron-right", "chev")}
            </button>`,
          )
        : nothing}
    </div>`;
  }

  /** "em 08/11" ("em 08/11/2025" in another year). */
  _day(ms) {
    const d = new Date(ms);
    const p = (n) => String(n).padStart(2, "0");
    return `em ${p(d.getDate())}/${p(d.getMonth() + 1)}${d.getFullYear() !== new Date(this._now).getFullYear() ? `/${d.getFullYear()}` : ""}`;
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
    // the sheets with their own time open it too (folha 3 às 18:00)
    const pinned = this._pagesOf(b.id)
      .map((p, i) => ({ n: i + 1, times: p.times || [] }))
      .filter((x) => x.times.length);
    const pins = pinned.length > 2 ? [plural(pinned.length, "folha com horário", "folhas com horário")] : pinned.map((x) => `folha ${x.n} às ${x.times.join(", ")}`);
    const when = [...parts.map((p) => (p.icon === "clock" ? p.label : `${p.label} ${p.time}`)), ...pins];
    return html`
      <section class="page">
        <div class="detail-head">
          <div class="dh-row">
            <button class="icon-btn" @click=${() => this._back()} aria-label="Voltar">${icon("chevron-left")}</button>
            <span class="grow"></span>
            ${this._renderChatBtn()}${this._renderMicBtn()}
            <button class="icon-btn" @click=${() => this._openBlockSheet(b)} aria-label="Ajustes do bloco">${icon("sliders-horizontal")}</button>
          </div>
          <div class="dh-text">
            <div class="overline">${[this._catsOn() && this._cat(b.category) && this._cat(b.category).name, plural(n, "folha", "folhas"), this._owner(b) ? `de ${this._owner(b)}` : "", PAPER_LABEL[b.paper] || ""].filter(Boolean).join(" · ")}</div>
            <h1 class="display fit-title">${b.name}</h1>
          </div>
        </div>
        ${b.archived
          ? html`<div class="hint-card arch-card">${icon("archive")}<span>Arquivado ${this._day(b.archived)}. Não abre sozinho.</span><button class="text-btn" @click=${() => this._setArchived(b, false)}>Desarquivar</button></div>`
          : html`<button class="when-line" @click=${() => this._openBlockSheet(b)}>
          ${when.length
            ? html`${icon("calendar-clock")}<span>Abre sozinho${this._owner(b) && !this._mine(b) ? ` no Agora de ${this._owner(b)}` : ""}: ${when.map((w, i) => html`${i ? " · " : ""}<b>${w}</b>`)}</span>`
            : html`${icon("calendar-clock")}<span>Não abre sozinho. <b>Escolher horário</b></span>`}
        </button>`}
        ${this._renderPad({ tall: true })}
      </section>
    `;
  }

  // ---------- Buscar

  _renderSearch() {
    const q = this._query.trim();
    const needle = fold(q);
    // the archived blocks only with Incluir arquivados; the blocks of the person using it and everyone's, or of
    // another person, or all (both kept on this device)
    const withArch = local.get(SEARCH_ARCH_KEY, false) === true;
    const who = this._shelfWho(SEARCH_WHO_KEY);
    const pool = this._data.pages.filter((p) => {
      const b = this._block(p.block);
      return b && (withArch || !b.archived) && this._ofWho(b, who);
    });
    let results = [];
    if (needle) {
      results = pool
        .filter((p) => fold(p.text).includes(needle))
        .sort((a, b) => b.updated - a.updated)
        .slice(0, 80);
    }
    return html`
      <section class="page">
        ${this._renderHead("Buscar", { text: `Em ${plural(pool.length, "folha", "folhas")} · acentos não importam` })}
        <label class="search-box">
          ${icon("search")}
          <input type="search" placeholder="Buscar nos blocos" .value=${this._query} @input=${(e) => (this._query = e.target.value)} enterkeyhint="search" aria-label="Buscar" />
          ${this._query ? html`<button class="icon-btn" style="width:40px;height:40px" @click=${() => (this._query = "")} aria-label="Limpar">${icon("x")}</button>` : nothing}
        </label>
        ${this._renderWhoChips(who, SEARCH_WHO_KEY)}
        <div class="chip-row search-opts"><button class="pick ${withArch ? "on" : ""}" aria-pressed=${withArch ? "true" : "false"} @click=${() => {
          this._haptic("light");
          local.set(SEARCH_ARCH_KEY, !withArch);
          this.requestUpdate();
        }}>${icon("archive")}<span>Incluir arquivados</span></button></div>
        ${!needle
          ? html`<p class="page-sub" style="margin-top:0">Procure qualquer palavra em todas as folhas.</p>`
          : results.length
            ? html`<p class="page-sub" style="margin-top:0">${plural(results.length, "folha encontrada", "folhas encontradas")}</p>
                <div class="panel">
                  ${results.map((p) => {
                    const b = this._block(p.block);
                    // links as their names (the search also finds the address)
                    const text = linksToText(p.text);
                    const title = firstLine(text) || "Folha sem título";
                    return html`<button class="result" style=${this._cv(b)} @click=${() => this._openPage(b.id, p.id)}>
                      <span class="dot"></span>
                      <span class="r-main">
                        <span class="r-title">${this._highlight(clip(title, 70), q)}</span>
                        <span class="r-snip">${this._highlight(this._snippet(text, title, needle), q)}</span>
                        <span class="r-meta">${b.name}${b.archived ? " · arquivado" : ""} · ${writtenAt(p.updated, new Date(this._now))}</span>
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

  /** The tabs of Mais › Configurações, like the other apps: [key, label, icon, how the menu says it]. */
  _configTabs() {
    return [
      ["integracoes", "Integrações", "blocks", "integrações"],
      ["dados", "Dados", "archive", "dados e backup"],
      ["aparencia", "Aparência", "palette", "aparência"],
      ["opcoes", "Opções", "toggle-right", "opções"],
    ];
  }

  /** The tab of Configurações on screen (the first one when the address asks for one that is not there). */
  _configTab() {
    const tabs = this._configTabs();
    const want = this._view().tab;
    return tabs.some((t) => t[0] === want) ? want : tabs[0][0];
  }

  /** The address of a tab of Configurações (Integrações, the first one, is /config). */
  _configPath(tab) {
    return tab === "integracoes" ? "/config" : `/config/${tab}`;
  }

  /** The rows of the menu Mais, in order: Categorias, Relatório, Configurações and, last, Sobre. */
  _moreRows() {
    const words = this._configTabs().map((t) => t[3]);
    const cfg = `${words.slice(0, -1).join(", ")} e ${words[words.length - 1]}.`;
    const cats = this._cats();
    return [
      // without Usar categorias, no Categorias
      ...(this._catsOn() ? [["/categorias", "tag", "Categorias", cats.length ? `${clip(cats.map((c) => c.name).join(", "), 44)}.` : "Para agrupar os blocos."]] : []),
      ["relatorio", "clipboard-list", "Relatório", "Os blocos e as folhas, para imprimir ou salvar em PDF."],
      ["/config", "sliders-horizontal", "Configurações", cfg[0].toUpperCase() + cfg.slice(1)],
      ["/sobre", "info", "Sobre", "CorrerIA Code, os apps e o GitHub."],
    ];
  }

  /** Section heading of a screen of Mais: the icon in a soft square, a big title and, optionally, a line about it. */
  _secHead(ic, title, lead = null) {
    return html`<div class="mais-head"><span class="mais-ic" aria-hidden="true">${icon(ic)}</span><h2>${title}</h2></div>${lead ? html`<p class="panel-lead">${lead}</p>` : nothing}`;
  }

  _renderFoot() {
    return html`<p class="foot"><b>MemorIA</b><br />v${this._version} · suas anotações ficam no Home Assistant<br />e entram no backup dele.</p>`;
  }

  // ---------- Mais: a menu; each row opens its own screen (Configurações, then Sobre)

  _renderMore() {
    return html`
      <section class="page">
        ${this._renderHead("Mais", null)}
        <div class="panel more-menu" role="navigation" aria-label="Mais">
          <ul>
            ${this._moreRows().map(
              ([path, ic, title, text]) => html`<li>
                <button class="more-row" @click=${() => this._openFromMenu(path)}>
                  <span class="mais-ic" aria-hidden="true">${icon(ic)}</span>
                  <span class="mb"><b>${title}</b><span>${text}</span></span>
                  ${icon("chevron-right", "chev")}
                </button>
              </li>`,
            )}
          </ul>
        </div>
        ${this._renderFoot()}
      </section>
    `;
  }

  /**
   * Mais › Configurações, in tabs at the top like the other apps: /config (Integrações), /config/dados,
   * /config/aparencia, /config/opcoes. Switching tabs replaces the history entry, so Back goes to the menu.
   */
  _renderConfig() {
    const tabs = this._configTabs();
    const tab = this._configTab();
    const go = (k) => {
      if (k === tab) return;
      this._haptic("light");
      this._go(this._configPath(k), true, history.state && history.state.rvUp ? { rvUp: true } : null);
    };
    let body;
    if (tab === "integracoes") body = html`${this._renderAiPanel()} ${this._aiOn() && this.api.voiceStatus ? this._renderVoicePanel() : nothing} ${this._renderCorreriaPanel()} ${this._renderSensorPanel()}`;
    else if (tab === "dados") body = this._renderDataPanel();
    else if (tab === "aparencia") body = this._renderAppearanceTab();
    else body = this._renderOptionsTab();
    return html`
      <section class="page">
        ${this._renderHead("Configurações", null, true)}
        <div class="seg compact more-tabs" role="tablist" aria-label="Seções de Configurações">
          ${tabs.map(([k, label, ic]) => html`<button class=${tab === k ? "on" : ""} role="tab" aria-selected=${tab === k ? "true" : "false"} @click=${() => go(k)}>${icon(ic)}<span>${label}</span></button>`)}
        </div>
        <div role="tabpanel" aria-label=${tabs.find((t) => t[0] === tab)[1]}>${body}</div>
        ${this._renderFoot()}
      </section>
    `;
  }

  _switch(on, label, ev) {
    return html`<label class="switch"><input type="checkbox" role="switch" .checked=${on} @change=${ev} aria-label=${label} /><span class="track"></span></label>`;
  }

  /** Mais › Configurações › Aparência: theme, color of the app and the handwriting. */
  _renderAppearanceTab() {
    const daily = this._accentDaily();
    const accent = daily ? this._accent().id : this._app("accent", "lilas");
    return html`
      <div class="panel">
        ${this._secHead("contrast", "Tema", "Cada aparelho guarda a sua escolha.")}
        ${themePicker({ theme: this._theme, onTheme: (k) => this._setTheme(k), icon })}
      </div>
      <div class="panel">
        ${this._secHead("palette", "Cor do app", "Em todos os aparelhos. Num bloco, vale a cor dele.")}
        <div class="row switch-row daily-row">
          <div class="grow"><div class="label">Cor do dia</div><div class="hint">Muda a cor do app todo dia.</div></div>
          ${this._switch(daily, "Cor do dia", (e) => this._saveSettings({ app: { accent_daily: e.target.checked ? null : false } }))}
        </div>
        ${colorPicker({ palette: PALETTE, value: accent, onPick: (id) => this._saveSettings({ app: { accent: id, accent_daily: false } }) })}
      </div>
      <div class="panel">
        ${this._secHead("pen-line", "Letra de mão")}
        <div class="row switch-row">
          <div class="grow"><div class="label">Folhas com letra de mão</div><div class="hint" style="white-space:normal">Como num caderno de verdade.</div></div>
          ${this._switch(this._app("hand", true), "Letra de mão", (e) => this._saveSettings({ app: { hand: e.target.checked } }))}
        </div>
      </div>
    `;
  }

  /** Mais › Configurações › Opções: categories and whose (1.11.0) and when the periods of the day start. */
  _renderOptionsTab() {
    const periods = periodTimes(this._data);
    const cats = this._catsOn();
    const owners = this._ownersOn();
    return html`<div class="panel" id="organizar">
      ${this._secHead("library", "Blocos")}
      <div class="row switch-row">
        <div class="grow"><div class="label">Usar categorias</div><div class="hint" style="white-space:normal">${cats ? "A categoria de cada bloco e o filtro em Blocos." : "Desligado."}</div></div>
        ${this._switch(cats, "Usar categorias", (e) => this._saveSettings({ app: { cats_off: e.target.checked ? null : true } }))}
      </div>
      <div class="row switch-row">
        <div class="grow"><div class="label">Controle por pessoa</div><div class="hint" style="white-space:normal">${owners ? "De quem é cada bloco, o Agora de cada pessoa e o filtro De quem." : "Desligado: todo bloco é de todos."}</div></div>
        ${this._switch(owners, "Controle por pessoa", (e) => this._saveSettings({ app: { owners_off: e.target.checked ? null : true } }))}
      </div>
    </div>
    <div class="panel" id="periodos">
      ${this._secHead("sun-moon", "Períodos do dia", "Blocos ligados a um período abrem sozinhos a partir desse horário. Horários exatos ficam em cada bloco ou folha.")}
      ${PERIODS.map(
        (p) => html`<div class="row">
          <span class="tile" style=${colorVars(this._accent(), this._dark)}>${icon(p.icon)}</span>
          <div class="grow"><div class="label">${p.label}</div><div class="hint">começa às</div></div>
          <input class="time-input" type="time" .value=${periods[p.id]} aria-label="Começo da ${p.label}" @change=${(e) => normTime(e.target.value) && this._saveSettings({ periods: { [p.id]: e.target.value } })} />
        </div>`,
      )}
    </div>`;
  }

  /**
   * Mais › Configurações › Integrações › CorrerIA (off unless turned on, with or without Usar IA): the WhatsApp, the
   * Claude and the Gemini read and change the blocks through the app CorrerIA. When on, who used it last and when.
   */
  _renderCorreriaPanel() {
    const on = this._app("correria", false) === true;
    const last = this._correria && this._correria.ultimo;
    let used = "";
    if (last && last.em) {
      const d = new Date(last.em);
      if (!Number.isNaN(d.getTime())) {
        const today = new Date(this._now);
        const days = Math.round((new Date(today.getFullYear(), today.getMonth(), today.getDate()) - new Date(d.getFullYear(), d.getMonth(), d.getDate())) / 86400000);
        const when = days === 0 ? "hoje" : days === 1 ? "ontem" : `em ${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}`;
        used = `${last.cliente || "CorrerIA"} usou ${when} às ${hm(d)}`;
      }
    }
    return html`<div class="panel" id="correria">
      ${this._secHead("zap", "CorrerIA")}
      <div class="row switch-row">
        <div class="grow"><div class="label">Usar com o CorrerIA</div><div class="hint" style="white-space:normal">${on ? "Ligado: pelo WhatsApp, o Claude e o Gemini leem e mudam os seus blocos." : "Desligado."}</div></div>
        ${this._switch(on, "Usar com o CorrerIA", (e) => this._saveSettings({ app: { correria: e.target.checked ? true : null } }))}
      </div>
      ${on
        ? html`<div class="ai-state ${used ? "ok" : "off"} correria-uso"><span class="dot"></span><div>${used ? html`<b>${used}</b>` : html`<b>Ainda não usado</b><span>No app CorrerIA, conecte o WhatsApp, o Claude ou o Gemini.</span>`}</div></div>`
        : nothing}
    </div>`;
  }

  /** Mais › Configurações › Integrações › Sensor no Home Assistant. */
  _renderSensorPanel() {
    const on = this._app("sensor", true);
    return html`<div class="panel" id="sensor">
      ${this._secHead("activity", "Sensor no Home Assistant", "Para usar em painéis e automações do Home Assistant.")}
      <div class="row switch-row">
        <div class="grow"><div class="label">MemorIA agora</div><div class="hint" style="white-space:normal">${on ? html`<code>sensor.memoria_agora</code>, com o bloco e a folha do momento.` : "Desligado."}</div></div>
        ${this._switch(on, "Sensor MemorIA agora", (e) => this._saveSettings({ app: { sensor: e.target.checked } }))}
      </div>
    </div>`;
  }

  /** Mais › Categorias: the categories of the blocks; tap one to change its name or color, or delete it. */
  _renderCategories() {
    const cats = this._cats();
    const blocks = this._blocks();
    return html`<section class="page">
      ${this._renderHead("Categorias", { text: cats.length ? plural(cats.length, "categoria", "categorias") : "Nenhuma categoria ainda" }, true)}
      <div class="panel cats-panel">
        ${cats.length
          ? html`<p class="panel-lead">Toque numa categoria para mudar o nome ou a cor.</p>
              ${repeat(
                cats,
                (c) => c.id,
                (c) => {
                  const mine = blocks.filter((b) => b.category === c.id);
                  const arch = this._data.blocks.filter((b) => b.archived && b.category === c.id).length;
                  const hint = [mine.length ? `${plural(mine.length, "bloco", "blocos")}: ${mine.map((b) => b.name).join(", ")}` : arch ? "" : "Nenhum bloco", arch ? plural(arch, "arquivado", "arquivados") : ""].filter(Boolean).join(" · ");
                  return html`<button class="row cat-row" style=${colorVars(colorById(c.color) || PALETTE[9], this._dark)} @click=${() => this._openCategorySheet(c)}>
                    <span class="tile">${icon("tag")}</span>
                    <div class="grow"><div class="label">${c.name}</div><div class="hint">${hint}</div></div>
                    ${icon("chevron-right", "chev")}
                  </button>`;
                },
              )}`
          : html`<div class="empty"><div class="em-icon">${icon("tag")}</div><h3>Agrupe os blocos</h3><p>Por exemplo Trabalho, Casa e Estudos. Em Blocos, filtre por categoria.</p></div>`}
        <button class="row cat-row add" @click=${() => this._openCategorySheet(null)}>
          <span class="tile" style=${colorVars(this._accent(), this._dark)}>${icon("plus")}</span>
          <div class="grow"><div class="label">Nova categoria</div></div>
        </button>
      </div>
    </section>`;
  }

  /** Mais › Sobre: CorrerIA Code, the apps of the family and the GitHub (the same page as the other apps). */
  _renderAbout() {
    return html`<section class="page">
      ${this._renderHead("Sobre", null, true)} ${aboutPage({ app: "MemorIA", version: this._version })}
    </section>`;
  }

  /** Mais › Configurações › Dados: export, backup, import, versions and start over (like the other apps). */
  _renderDataPanel() {
    const b = this._backups;
    const size = (n) => (n > 1048576 ? `${(n / 1048576).toFixed(1).replace(".", ",")} MB` : `${Math.max(1, Math.round(n / 1024))} KB`);
    const exp = (fmt, title, text, label) => html`<li>
      <div class="ot"><b>${title}</b><span>${text}</span></div>
      <a class="btn outline sm" href=${this.api.exportUrl(fmt) || "#"} download @click=${(e) => this._export(fmt, e)}>${icon("download")}${label}</a>
    </li>`;
    return html`<div id="dados">
      <div class="panel">
        ${this._secHead("download", "Exportar")}
        <ul class="opts">
          ${exp("zip", "Tudo (ZIP)", "Um arquivo de texto por bloco, a planilha e os dados completos.", "Baixar ZIP")}
          ${exp("csv", "Planilha (CSV)", "Abre no Excel e no Google Planilhas, com uma folha por linha.", "Baixar CSV")}
          ${exp("json", "Dados completos (JSON)", "Todos os campos, para backup ou para outro sistema.", "Baixar JSON")}
        </ul>
      </div>
      <div class="panel">
        ${this._secHead("archive", "Backup na pasta share", html`Cópia completa em <code>share/memoria</code>. Os backups do Home Assistant também incluem o MemorIA.`)}
        <div class="btn-row sec-actions">
          <button class="btn primary sm" ?disabled=${this._busy === "backup" || (b && b.available === false)} @click=${() => this._createBackup()}>${icon("archive")}${this._busy === "backup" ? "Criando…" : "Criar backup"}</button>
        </div>
        ${b && b.available === false ? html`<p class="data-note">A pasta share não está disponível para o app.</p>` : nothing}
        ${b && b.backups && b.backups.length
          ? html`<div class="data-list">
              ${b.backups.slice(0, 8).map(
                (x) => html`<div class="data-item"><div><b>${this._dateTime(x.date)}</b><span title=${x.name}>${size(x.size)} · ${x.name}</span></div>
                  <button class="btn outline sm" @click=${() => this._confirmRestoreBackup(x)}>${icon("archive-restore")}Restaurar</button></div>`,
              )}
            </div>`
          : nothing}
      </div>
      <div class="panel">
        ${this._secHead("upload", "Importar", "Um .zip ou .json exportado pelo MemorIA. Antes, o app guarda uma cópia do que existe hoje.")}
        <div class="btn-row sec-actions"><button class="btn outline sm" @click=${() => this._pickImport()}>${icon("upload")}Escolher arquivo</button></div>
      </div>
      <div class="panel">
        ${this._secHead("archive-restore", "Versões anteriores", "Uma cópia a cada 10 minutos de uso e antes de importar, restaurar ou apagar.")}
        <div class="btn-row sec-actions"><button class="btn outline sm" @click=${() => this._openVersions()}>${icon("archive-restore")}Ver versões</button></div>
      </div>
      <div class="panel">
        ${this._secHead("trash", "Começar do zero", "Apaga todos os blocos e folhas. Os ajustes continuam.")}
        <div class="btn-row sec-actions"><button class="btn danger sm" @click=${() => this._confirmErase()}>${icon("trash")}Apagar tudo</button></div>
      </div>
    </div>`;
  }

  _renderAiPanel() {
    const ai = this._ai || {};
    const ents = ai.entities || [];
    const sel = this._app("ai_entity", "");
    const tone = this._aiChecking ? "off" : ai.ready && ai.images ? "ok" : ai.ready ? "warn" : "bad";
    const title = this._aiChecking ? "Verificando…" : ai.ready && ai.images ? "Pronta para ler fotos" : ai.ready ? "Só lê mensagens" : "Não configurada";
    let detail = "";
    if (ai.ready) {
      detail = `Usando ${ai.using.name}${sel ? "" : " (a IA padrão do Home Assistant)"}.`;
      if (ai.photos) detail += ` Para fotos, ${ai.photos.name}.`;
    }
    if (ai.reason) detail = `${detail} ${ai.reason}`.trim();
    const on = this._aiOn();
    const head = html`${this._secHead("sparkles", "Leitura por IA", "Lê mensagens coladas, prints e fotos de anotações em papel para criar folhas, com a IA configurada no Home Assistant. O app não guarda nenhuma chave.")}
      <div class="row switch-row ai-switch">
        <div class="grow"><div class="label">Usar IA</div><div class="hint" style="white-space:normal">${on ? "Ligado." : "Desligado: sem leitura por IA, sem Falar e sem Conversar."}</div></div>
        ${this._switch(on, "Usar IA", (e) => this._setAiOn(e.target.checked))}
      </div>`;
    if (!on) return html`<div class="panel" id="leitura-ia">${head}</div>`;
    return html`<div class="panel" id="leitura-ia">
      ${head}
      <div class="ai-state ${tone}"><span class="dot"></span><div><b>${title}</b>${detail ? html`<span>${detail}</span>` : nothing}</div></div>
      ${ents.length || sel
        ? html`<label class="field" style="margin:14px 0 0">
            <span class="flabel">IA usada pelo app</span>
            <select class="select" aria-label="IA usada pelo app" @change=${(e) => this._chooseAi(e.target.value)}>
              <option value="" ?selected=${!sel}>Padrão do Home Assistant</option>
              ${ents.map((e) => html`<option value=${e.id} ?selected=${e.id === sel}>${e.name}${e.images ? "" : " (só texto)"}${e.available ? "" : " (indisponível)"}</option>`)}
              ${sel && !ents.some((e) => e.id === sel) ? html`<option value=${sel} selected>${sel} (não encontrada)</option>` : nothing}
            </select>
            <span class="field-hint">${icon("sparkles")}<span>“Padrão do Home Assistant” usa a IA preferida definida em Configurações › Sistema › Geral.</span></span>
          </label>`
        : nothing}
      <div class="ai-actions"><button class="btn outline" ?disabled=${this._aiChecking} @click=${() => this._refreshAi()}>${icon("rotate-ccw")}Verificar de novo</button></div>
      ${ai.ready && ai.images
        ? nothing
        : html`<div class="steps-box">
            <b>Como configurar</b>
            <ol class="steps">
              <li>No Home Assistant, abra Configurações › Dispositivos e serviços › Adicionar integração.</li>
              <li>Escolha a IA: Anthropic (Claude), OpenAI, Google Gemini ou Ollama (modelo local, de graça). Cole a chave de API quando pedir.</li>
              <li>Na integração, adicione uma tarefa de IA (AI Task). Para ler fotos, use um modelo que entenda imagens.</li>
              <li>Volte aqui e escolha essa IA na lista.</li>
            </ol>
          </div>`}
    </div>`;
  }

  // ---------- sheets

  _renderSheet() {
    if (!this._sheet) return nothing;
    let body = nothing;
    if (this._sheet === "block") body = this._renderBlockSheet();
    else if (this._sheet === "category") body = this._renderCategorySheet();
    else if (this._sheet === "link") body = this._renderLinkSheet();
    else if (this._sheet === "chat") body = this._renderChatSheet();
    else if (this._sheet === "pagemenu") body = this._renderPageMenu();
    else if (this._sheet === "new") body = this._renderNewSheet();
    else if (this._sheet === "confirm") body = this._renderConfirm();
    else if (this._sheet === "versions") body = this._renderVersions();
    const f = this._form || {};
    const b = this._sheet === "block" || this._sheet === "category" ? { color: f.color } : this._block(f.target || (f.page && this._page(f.page) && this._page(f.page).block));
    const c = b ? colorById(b.color) : null;
    const style = c ? `--rv-accent:${c.fill};--rv-accent-ink:${this._dark ? c.fill : c.ink};--rv-accent-soft:${hexToRgba(c.fill, this._dark ? 0.18 : 0.14)};` : "";
    return html`
      <div class="scrim" @click=${() => this._sheetBack()}></div>
      <div class="sheet" role="dialog" aria-modal="true" style=${style} @keydown=${(e) => e.key === "Escape" && this._sheetBack()}>
        <div class="grab"></div>
        ${body}
      </div>
    `;
  }

  _sheetHead(title, back) {
    return html`<div class="sheet-head">
      ${back ? html`<button class="icon-btn back" @click=${back} aria-label="Voltar">${icon("chevron-left")}</button>` : nothing}
      <h3 class="display">${title}</h3>
      <button class="icon-btn" @click=${() => this._sheetBack()} aria-label="Fechar">${icon("x")}</button>
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
      ${this._catsOn() ? html`<div class="field">
        <span class="flabel">Categoria</span>
        <div class="chip-row grid cat-pick">
          <button class="pick ${!f.category && f.newCat == null ? "on" : ""}" @click=${() => this._setForm({ category: "", newCat: null })}><span>Sem categoria</span></button>
          ${this._cats().map(
            (c) => html`<button class="pick list ${f.category === c.id && f.newCat == null ? "on" : ""}" style=${colorVars(colorById(c.color) || PALETTE[9], this._dark)} @click=${() => this._setForm({ category: c.id, newCat: null })}><span class="dot"></span><span>${clip(c.name, 22)}</span></button>`,
          )}
          <button class="pick ${f.newCat != null ? "on" : ""}" @click=${() => {
            this._setForm({ newCat: f.newCat == null ? "" : f.newCat });
            this.updateComplete.then(() => {
              const input = this.renderRoot.querySelector(".new-cat input");
              if (input) input.focus();
            });
          }}>${icon("plus")}<span>Nova</span></button>
        </div>
        ${f.newCat != null
          ? html`<label class="new-cat"><input type="text" maxlength="40" .value=${f.newCat} placeholder="Nome da nova categoria" aria-label="Nome da nova categoria" @input=${(e) => this._setForm({ newCat: e.target.value })} @keydown=${(e) => e.key === "Enter" && this._saveBlockSheet()} /></label>`
          : nothing}
      </div>` : nothing}
      ${this._ownersOn() ? this._renderOwnerPick(f) : nothing}
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
        <div class="chip-row grid periods-pick">
          ${PERIODS.map(
            (p) => html`<button class="pick ${f.periods.includes(p.id) ? "on" : ""}" aria-pressed=${f.periods.includes(p.id) ? "true" : "false"} @click=${() => toggle(p.id)}>${icon(p.icon)}<span>${p.label}</span><small class="pick-sub">${periods[p.id]}</small></button>`,
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
      ${f.id
        ? (() => {
            const arch = !!(this._block(f.id) || {}).archived;
            return html`<button class="menu-row arch-toggle" @click=${() => this._saveBlockSheet({ archived: !arch })}>${icon(arch ? "archive-restore" : "archive")}${arch ? "Desarquivar bloco" : "Arquivar bloco"}</button>`;
          })()
        : nothing}
      <div class="sheet-actions">
        ${f.id ? html`<button class="btn danger" @click=${() => this._confirmDeleteBlock()} aria-label="Excluir bloco">${icon("trash")}</button>` : nothing}
        <button class="btn primary" @click=${() => this._saveBlockSheet()}>${f.id ? "Salvar" : "Criar bloco"}</button>
      </div>
    `;
  }

  /**
   * De quem é: Todos (the house) or one person of the house. A block of a person opens by itself only in their Agora
   * (Blocos still shows every block). A name that is no longer a person of the house stays as a choice, so it isn't
   * lost. Without the people of Home Assistant (out of reach), the name is written.
   */
  _renderOwnerPick(f) {
    const people = this._people || [];
    const owner = ownerName(f.owner || "");
    const hint = owner ? html`<span class="field-hint">${icon("info")}<span>Só aparece no Agora de ${owner}.</span></span>` : nothing;
    if (!people.length) {
      return html`<label class="field">
        <span class="flabel">De quem é</span>
        <input type="text" maxlength="80" .value=${f.owner || ""} placeholder="Todos" aria-label="De quem é" @input=${(e) => this._setForm({ owner: e.target.value })} />
        ${hint}
      </label>`;
    }
    const names = owner && !people.some((n) => sameName(n, owner)) ? [...people, owner] : people;
    return html`<div class="field">
      <span class="flabel">De quem é</span>
      <div class="chip-row grid owner-pick" role="radiogroup" aria-label="De quem é">
        ${["", ...names].map((n) => {
          const on = n ? sameName(owner, n) : !owner;
          return html`<button class="pick ${on ? "on" : ""}" role="radio" aria-checked=${on ? "true" : "false"} @click=${() => this._setForm({ owner: n })}>${icon(n ? "user-round" : "users")}<span>${n || "Todos"}</span></button>`;
        })}
      </div>
      ${hint}
    </div>`;
  }

  /** Nova categoria / Categoria: the name and the color; delete (its blocks stay, without a category). */
  _renderCategorySheet() {
    const f = this._form;
    return html`
      ${this._sheetHead(f.id ? "Categoria" : "Nova categoria")}
      <label class="field">
        <span class="flabel">Nome</span>
        <input type="text" maxlength="40" .value=${f.name} placeholder="Ex.: Trabalho, Casa, Estudos" @input=${(e) => this._setForm({ name: e.target.value })} @keydown=${(e) => e.key === "Enter" && this._saveCategorySheet()} />
      </label>
      <div class="field">
        <span class="flabel">Cor</span>
        <div class="swatches">
          ${PALETTE.map((c) => html`<button class="sw ${f.color === c.id ? "on" : ""}" style="--c:${c.fill}" aria-label=${c.label} @click=${() => this._setForm({ color: c.id })}>${f.color === c.id ? icon("check") : nothing}</button>`)}
        </div>
      </div>
      <div class="sheet-actions">
        ${f.id ? html`<button class="btn danger" @click=${() => this._confirmDeleteCategory()} aria-label="Apagar categoria">${icon("trash")}</button>` : nothing}
        <button class="btn primary" ?disabled=${!(f.name || "").trim() || f.busy} @click=${() => this._saveCategorySheet()}>${f.id ? "Salvar" : "Criar categoria"}</button>
      </div>
    `;
  }

  _renderPageMenu() {
    const page = this._page(this._form.page);
    if (!page) return this._sheetHead("Folha");
    const list = this._pagesOf(page.block);
    const idx = list.indexOf(page);
    const here = this._block(page.block);
    const blocks = here && here.archived ? [...this._blocks(), here] : this._blocks();
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
            <div class="chip-row grid block-pick">
              ${blocks.map((b) => html`<button class="pick list ${page.block === b.id ? "on" : ""}" style=${this._cv(b)} @click=${() => this._movePage(page.id, b.id)}><span class="dot"></span><span>${clip(b.name, 22)}</span></button>`)}
            </div>
          </div>`
        : nothing}
      <button class="menu-row" @click=${() => this._openLinkSheet(page.id)}>${icon("link")}Adicionar link</button>
      <button class="menu-row" @click=${() => this._copyPage(page.id)}>${icon("copy")}Copiar texto</button>
      <button class="menu-row danger" @click=${() => this._confirmDeletePage(page.id)}>${icon("trash")}Apagar folha</button>
      <p class="sheet-note">Escrita ${writtenAt(page.created)} · editada ${writtenAt(page.updated)}</p>
    `;
  }

  _renderNewSheet() {
    const f = this._form;
    const ai = this._aiEff();
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
            <div class="chip-row grid block-pick">
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
          ${ai.ready ? html`<button class="btn outline" ?disabled=${!(f.text || "").trim()} @click=${() => this._readText(false)}>Como está</button>` : nothing}
          <button class="btn primary" ?disabled=${!(f.text || "").trim()} @click=${() => this._readText(true)}>${ai.ready ? html`${icon("sparkles")}Organizar` : "Criar folha"}</button>
        </div>
        <p class="sheet-note">${ai.ready ? `${ai.using.name} limpa a mensagem e deixa como uma anotação. Você revisa antes de salvar.` : ai.off ? "A mensagem vira uma folha do jeito que está." : "Sem IA configurada: a mensagem vira uma folha do jeito que está."}</p>
      `;
    }

    if (f.step === "voice") return this._renderVoiceStep(this._sheetHead("Falar", () => (this._stopVoice(), toPick())));

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
      const from = f.provider === "local" ? "texto original" : f.provider ? `lido por ${f.provider}` : "";
      return html`
        ${this._sheetHead("Revisar folha", toPick)}
        ${thumbs}
        <p class="sheet-note top">${from ? `${from[0].toUpperCase()}${from.slice(1)}. ` : ""}Corrija o que precisar antes de salvar.</p>
        ${f.heard ? html`<div class="heard">${icon("mic")}<span>${f.heard}</span></div>` : nothing}
        ${f.note ? html`<div class="imp-error soft">${icon("sparkles")}<span>${f.note}</span></div>` : nothing}
        <textarea class="review-text" .value=${f.result} aria-label="Texto da folha" @input=${(e) => this._setForm({ result: e.target.value })}></textarea>
        ${ai.images
          ? html`<div class="extra-row chip-row grid two">
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
        ${ai.ready && this._voice && this._voice.ready
          ? html`<button class="imp-opt" @click=${() => (this._setForm({ step: "voice", error: null, heard: "" }), this.updateComplete.then(() => this._startVoice()))}>
              <span class="imp-ic">${icon("mic")}</span>
              <span class="imp-tx"><b>Falar</b><small>Diga a anotação; a IA organiza</small></span>
              ${icon("chevron-right")}
            </button>`
          : nothing}
        <button class="imp-opt" @click=${() => (this._setForm({ step: "text", error: null }), this._focusSheetText())}>
          <span class="imp-ic">${icon("message-square-text")}</span>
          <span class="imp-tx"><b>Colar mensagem</b><small>WhatsApp, e-mail, anotação</small></span>
          ${icon("chevron-right")}
        </button>
        ${ai.off
          ? nothing
          : html`<button class="imp-opt" ?disabled=${!ai.images} @click=${() => this._pickFiles("photos")}>
                <span class="imp-ic">${icon("images")}</span>
                <span class="imp-tx"><b>Escolher fotos</b><small>${this._isHaAndroid() ? "Prints e fotos da galeria, uma por vez" : "Prints e fotos da galeria (até 6)"}</small></span>
                ${icon("chevron-right")}
              </button>
              <button class="imp-opt" ?disabled=${!ai.images} @click=${() => this._openCamera()}>
                <span class="imp-ic">${icon("scan-text")}</span>
                <span class="imp-tx"><b>Digitalizar com IA</b><small>Fotografe uma anotação em papel</small></span>
                ${icon("chevron-right")}
              </button>`}
      </div>
      ${!ai.images && !ai.off
        ? html`<div class="imp-error soft">${icon("sparkles")}<span>${ai.reason || "Para ler fotos, o Home Assistant precisa de uma integração de IA com tarefa de IA que entenda imagens."}
            <button class="text-btn inline" @click=${() => this._openAiSettings()}>Ver Leitura por IA</button></span></div>`
        : nothing}
      ${error}
    `;
  }

  _renderVersions() {
    const f = this._form;
    const why = { "antes-de-importar": "antes de importar", "antes-de-restaurar": "antes de restaurar", "antes-de-apagar": "antes de apagar tudo" };
    return html`
      ${this._sheetHead("Versões anteriores")}
      ${f.error
        ? html`<div class="imp-error">${icon("circle-alert")}<span>${f.error}</span></div>`
        : f.list == null
          ? html`<div class="imp-loading"><span class="spin">${icon("loader-circle")}</span><span>Carregando…</span></div>`
          : !f.list.length
            ? html`<p class="sheet-note top">Ainda não há versões anteriores. Elas aparecem depois das primeiras alterações.</p>`
            : html`<div class="data-list">
                ${f.list.map(
                  (v) => html`<div class="data-item"><div><b>${this._dateTime(v.when)}</b><span>${plural(v.blocks, "bloco", "blocos")} · ${plural(v.pages, "folha", "folhas")} · ${why[v.reason] || "automática"}</span></div>
                    <button class="btn outline sm" @click=${() => this._confirmRestoreVersion(v)}>Restaurar</button></div>`,
                )}
              </div>`}
    `;
  }

  _renderConfirm() {
    const f = this._form;
    return html`
      <div class="sheet-head"><h3 class="display">${f.title}</h3></div>
      <p class="confirm-text">${f.text}</p>
      <div class="sheet-actions">
        <button class="btn outline" @click=${() => this._sheetBack()}>Cancelar</button>
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
