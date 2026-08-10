/** مؤثرات صوتية سينمائية خفيفة مولّدة بـ Web Audio — بدون ملفات صوت. */

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let verb: ConvolverNode | null = null;
let music: { stop: () => void } | null = null;
let musicOn = false;
let lastKey = 0;

const MUSIC_KEY = "rania-music";

export function isMusicOn() {
  return musicOn;
}

export function loadMusicPref() {
  if (typeof localStorage === "undefined") return false;
  return localStorage.getItem(MUSIC_KEY) === "1";
}

function ac(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AC = window.AudioContext ?? (window as any).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 0.85;
    master.connect(ctx.destination);

    // reverb صغيرة تدي إحساس سينمائي
    const len = Math.floor(ctx.sampleRate * 1.8);
    const buf = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let c = 0; c < 2; c++) {
      const d = buf.getChannelData(c);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3.2);
    }
    verb = ctx.createConvolver();
    verb.buffer = buf;
    const wet = ctx.createGain();
    wet.gain.value = 0.22;
    verb.connect(wet).connect(master);
  }
  if (ctx.state === "suspended") void ctx.resume().catch(() => {});
  return ctx;
}

function tone(
  freq: number,
  start: number,
  dur: number,
  peak: number,
  type: OscillatorType = "sine",
  space = 0.5,
) {
  const c = ac();
  if (!c || !master) return;
  const t0 = c.currentTime + start;
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(Math.max(peak, 0.0002), t0 + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.connect(g).connect(master);
  if (verb && space > 0) {
    const s = c.createGain();
    s.gain.value = space;
    g.connect(s).connect(verb);
  }
  osc.start(t0);
  osc.stop(t0 + dur + 0.05);
}

function noise(dur: number, peak: number, from: number, to: number, q = 0.8) {
  const c = ac();
  if (!c || !master) return;
  const len = Math.max(1, Math.floor(c.sampleRate * dur));
  const buf = c.createBuffer(1, len, c.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
  const src = c.createBufferSource();
  src.buffer = buf;
  const f = c.createBiquadFilter();
  f.type = "bandpass";
  f.Q.value = q;
  f.frequency.setValueAtTime(from, c.currentTime);
  f.frequency.exponentialRampToValueAtTime(Math.max(to, 40), c.currentTime + dur);
  const g = c.createGain();
  g.gain.setValueAtTime(0.0001, c.currentTime);
  g.gain.exponentialRampToValueAtTime(peak, c.currentTime + dur * 0.35);
  g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + dur);
  src.connect(f).connect(g).connect(master);
  if (verb) {
    const s = c.createGain();
    s.gain.value = 0.35;
    g.connect(s).connect(verb);
  }
  src.start();
}

/** رنّة سحرية ناعمة — ظهور شاشة الدخول. */
export function playSoftChime() {
  [1046.5, 1396.9, 1760].forEach((n, i) => tone(n, i * 0.08, 1.6, 0.035, "sine", 0.9));
}

/** ضغطة عميقة هادية — زر الدخول. */
export function playDeepClick() {
  tone(150, 0, 0.16, 0.09, "sine", 0.2);
  tone(75, 0, 0.24, 0.07, "sine", 0.1);
  noise(0.06, 0.02, 1200, 300);
}

/** صوت فتح ظرف/ورق — فتح الرسالة. */
export function playPaperOpen() {
  noise(0.28, 0.05, 2600, 700, 0.6);
  noise(0.18, 0.03, 5200, 1800, 1.2);
  tone(523.25, 0.08, 0.9, 0.028, "sine", 0.8);
}

/** انتقال ناعم بين المشاهد. */
export function playWhoosh() {
  noise(0.5, 0.045, 320, 3200, 0.5);
  tone(220, 0, 0.5, 0.02, "sine", 0.6);
}

/** لمعة سحرية مع الأضواء والقلوب. */
export function playSparkle() {
  const base = [1567.98, 2093, 2637, 3135.96];
  base.forEach((n, i) => tone(n, i * 0.05 + Math.random() * 0.03, 0.7, 0.018, "sine", 1));
}

/** كتابة زي الكمبيوتر — منخفض جدًا. */
export function playKey() {
  const c = ac();
  if (!c || !master) return;
  const now = c.currentTime;
  if (now - lastKey < 0.035) return;
  lastKey = now;
  const len = Math.floor(c.sampleRate * 0.02);
  const buf = c.createBuffer(1, len, c.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 8);
  const src = c.createBufferSource();
  src.buffer = buf;
  const filter = c.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.value = 1700 + Math.random() * 500;
  filter.Q.value = 1.6;
  const g = c.createGain();
  g.gain.value = 0.035;
  src.connect(filter).connect(g).connect(master);
  src.start();
}

/** رنّة سينمائية عاطفية — اللحظات المهمة فقط. */
export function playCinematicChime() {
  const notes = [261.63, 392, 523.25, 659.25, 783.99];
  notes.forEach((n, i) => tone(n, i * 0.11, 2.4, 0.045, "sine", 1));
  tone(130.81, 0, 3, 0.04, "triangle", 0.7);
}

/** نبض قلب دافئ. */
export function playHeartbeat() {
  tone(62, 0, 0.3, 0.09, "sine", 0.15);
  tone(58, 0.32, 0.35, 0.07, "sine", 0.15);
}

/** كلمة السر غلط. */
export function playWrong() {
  tone(196, 0, 0.26, 0.055, "triangle", 0.3);
  tone(147, 0.1, 0.34, 0.05, "triangle", 0.3);
}

/** موسيقى بيانو/آمبيينت رومانسية هادية جدًا (لا تعمل تلقائيًا). */
export function startMusic() {
  const c = ac();
  if (!c || !master || music) return;
  musicOn = true;
  if (typeof localStorage !== "undefined") localStorage.setItem(MUSIC_KEY, "1");

  const bus = c.createGain();
  bus.gain.value = 0;
  bus.gain.setTargetAtTime(0.15, c.currentTime, 2.5);
  const lp = c.createBiquadFilter();
  lp.type = "lowpass";
  lp.frequency.value = 1400;
  bus.connect(lp).connect(master);
  if (verb) {
    const s = c.createGain();
    s.gain.value = 0.6;
    lp.connect(s).connect(verb);
  }

  // طبقة باد دافئة
  const pads = [174.61, 261.63, 349.23].map((f, i) => {
    const o = c.createOscillator();
    o.type = "sine";
    o.frequency.value = f;
    const g = c.createGain();
    g.gain.value = 0.22;
    const lfo = c.createOscillator();
    lfo.frequency.value = 0.04 + i * 0.02;
    const lg = c.createGain();
    lg.gain.value = 0.12;
    lfo.connect(lg).connect(g.gain);
    o.connect(g).connect(bus);
    o.start();
    lfo.start();
    return [o, lfo] as const;
  });

  // نوتات بيانو متفرقة
  const scale = [523.25, 587.33, 659.25, 783.99, 880, 1046.5];
  const piano = setInterval(() => {
    if (!ctx || !master) return;
    const f = scale[Math.floor(Math.random() * scale.length)]!;
    const t0 = ctx.currentTime;
    const o = ctx.createOscillator();
    o.type = "triangle";
    o.frequency.value = f;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(0.03, t0 + 0.03);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + 2.6);
    o.connect(g).connect(bus);
    o.start(t0);
    o.stop(t0 + 2.8);
  }, 3400);

  music = {
    stop: () => {
      clearInterval(piano);
      bus.gain.setTargetAtTime(0, c.currentTime, 0.5);
      setTimeout(() => pads.flat().forEach((o) => o.stop()), 1500);
      music = null;
    },
  };
}

export function stopMusic() {
  musicOn = false;
  if (typeof localStorage !== "undefined") localStorage.setItem(MUSIC_KEY, "0");
  music?.stop();
}
