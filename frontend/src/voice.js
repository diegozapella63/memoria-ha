// Falar: records the microphone as raw PCM, 16 kHz, 16-bit, mono (what the speech-to-text of
// Home Assistant takes, the same as Assist), with the level for the screen.
export const VOICE_RATE = 16000;
export const VOICE_MAX_S = 120;

export class Recorder {
  /** @param {(level: number) => void} onLevel 0..1, a few times a second */
  constructor(onLevel) {
    this.onLevel = onLevel;
    this.chunks = [];
    this.length = 0;
    this.rate = VOICE_RATE;
  }

  async start() {
    const md = navigator.mediaDevices;
    if (!md || !md.getUserMedia) throw Object.assign(new Error("no_api"), { name: "NoApi" });
    this.stream = await md.getUserMedia({ audio: { channelCount: 1, echoCancellation: true, noiseSuppression: true, autoGainControl: true } });
    const AC = window.AudioContext || window.webkitAudioContext;
    try {
      this.ctx = new AC({ sampleRate: VOICE_RATE });
    } catch (e) {
      this.ctx = new AC(); // some browsers only record at their own rate: resampled at the end
    }
    if (this.ctx.state === "suspended") await this.ctx.resume().catch(() => {});
    this.rate = this.ctx.sampleRate;
    this.src = this.ctx.createMediaStreamSource(this.stream);
    this.node = this.ctx.createScriptProcessor(4096, 1, 1);
    this.node.onaudioprocess = (e) => {
      const data = e.inputBuffer.getChannelData(0);
      this.chunks.push(new Float32Array(data));
      this.length += data.length;
      let sum = 0;
      for (let i = 0; i < data.length; i += 4) sum += data[i] * data[i];
      if (this.onLevel) this.onLevel(Math.min(1, Math.sqrt(sum / (data.length / 4)) * 5));
    };
    this.src.connect(this.node);
    this.node.connect(this.ctx.destination); // the output stays silent; it only keeps the node running
  }

  seconds() {
    return this.length / this.rate;
  }

  /** Stops and gives the audio: Int16 PCM at 16 kHz. */
  stop() {
    this._close();
    const all = new Float32Array(this.length);
    let o = 0;
    for (const c of this.chunks) {
      all.set(c, o);
      o += c.length;
    }
    this.chunks = [];
    const ratio = this.rate / VOICE_RATE;
    const n = Math.floor(all.length / ratio);
    const out = new Int16Array(n);
    for (let i = 0; i < n; i++) {
      // the average of each window: a simple low-pass when the browser recorded at 44.1/48 kHz
      const a = Math.floor(i * ratio);
      const b = Math.max(a + 1, Math.min(all.length, Math.floor((i + 1) * ratio)));
      let s = 0;
      for (let j = a; j < b; j++) s += all[j];
      const v = Math.max(-1, Math.min(1, s / (b - a)));
      out[i] = v < 0 ? v * 0x8000 : v * 0x7fff;
    }
    return out;
  }

  cancel() {
    this._close();
    this.chunks = [];
    this.length = 0;
  }

  _close() {
    try {
      if (this.node) this.node.onaudioprocess = null;
      if (this.src) this.src.disconnect();
      if (this.node) this.node.disconnect();
    } catch (e) {
      /* already closed */
    }
    if (this.stream) for (const t of this.stream.getTracks()) t.stop();
    if (this.ctx && this.ctx.state !== "closed") this.ctx.close().catch(() => {});
    this.stream = null;
    this.node = null;
    this.src = null;
  }
}

/** The message for a microphone that didn't open. */
export function micError(err) {
  const n = (err && err.name) || "";
  if (n === "NotAllowedError" || n === "SecurityError")
    return "O microfone está bloqueado. Permita o microfone para o Home Assistant (no navegador, no cadeado ao lado do endereço; no app do celular, nas permissões do app Home Assistant) e tente de novo.";
  if (n === "NotFoundError" || n === "OverconstrainedError") return "Não achei um microfone neste aparelho.";
  if (n === "NotReadableError") return "O microfone está sendo usado por outro app. Feche o outro e tente de novo.";
  if (n === "NoApi")
    return window.isSecureContext === false
      ? "O microfone aqui dentro só funciona quando o Home Assistant é aberto por um endereço seguro (https), como o do Home Assistant Cloud ou o seu endereço externo. Neste endereço (http), o celular e o navegador não deixam usar o microfone, nem pelo app do Home Assistant."
      : "Este navegador não deixa usar o microfone aqui.";
  return `Não consegui abrir o microfone (${(err && err.message) || n || "erro"}).`;
}
