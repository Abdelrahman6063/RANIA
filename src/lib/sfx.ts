/** Tiny WebAudio sound effects: envelope open chime + typewriter ticks. */

let ctx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const AC = window.AudioContext || (window as any).webkitAudioContext;
  if (!AC) return null;
  if (!ctx) ctx = new AC();
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

function tone(freq: number, start: number, dur: number, gain: number, type: OscillatorType) {
  const c = getCtx();
  if (!c) return;
  const t = c.currentTime + start;
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(gain, t + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  osc.connect(g).connect(c.destination);
  osc.start(t);
  osc.stop(t + dur + 0.05);
}

/** Soft glassy chime when a letter unfolds. */
export function playOpenChime() {
  tone(523.25, 0, 0.9, 0.06, "sine");
  tone(783.99, 0.08, 0.9, 0.045, "sine");
  tone(1046.5, 0.16, 1.1, 0.035, "triangle");
}

/** Very short click, used per revealed word. */
export function playTypeTick() {
  const c = getCtx();
  if (!c) return;
  const t = c.currentTime;
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = "square";
  osc.frequency.setValueAtTime(1500 + Math.random() * 500, t);
  g.gain.setValueAtTime(0.02, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.035);
  osc.connect(g).connect(c.destination);
  osc.start(t);
  osc.stop(t + 0.06);
}
