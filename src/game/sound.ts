// Tiny chiptune synth on Web Audio. No audio files. Muted until the user opts in.
let ctx: AudioContext | null = null;
let muted = true;
try { muted = localStorage.getItem('sound') !== 'on'; } catch { /* private mode */ }

function ac(): AudioContext | null {
  if (typeof window === 'undefined' || !('AudioContext' in window)) return null;
  ctx ??= new AudioContext();
  if (ctx.state === 'suspended') void ctx.resume();
  return ctx;
}

function tone(freq: number, dur: number, type: OscillatorType = 'square', gain = 0.06, slide = 0) {
  if (muted) return;
  const a = ac(); if (!a) return;
  const o = a.createOscillator(); const g = a.createGain();
  o.type = type; o.frequency.setValueAtTime(freq, a.currentTime);
  if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(20, freq + slide), a.currentTime + dur);
  g.gain.setValueAtTime(gain, a.currentTime);
  g.gain.exponentialRampToValueAtTime(0.0001, a.currentTime + dur);
  o.connect(g).connect(a.destination); o.start(); o.stop(a.currentTime + dur);
}

export const sfx = {
  isMuted: () => muted,
  setMuted(m: boolean) { muted = m; try { localStorage.setItem('sound', m ? 'off' : 'on'); } catch { /* ignore */ } if (!m) ac(); },
  paddle: () => tone(220, 0.05, 'square', 0.05),
  wall: () => tone(160, 0.04, 'triangle', 0.04),
  brick: (row = 0) => tone(440 + row * 60, 0.07, 'square', 0.05),
  powerup: () => { tone(523, 0.08); setTimeout(() => tone(659, 0.08), 70); setTimeout(() => tone(784, 0.12), 140); },
  reveal: () => { [523, 659, 784, 1046].forEach((f, i) => setTimeout(() => tone(f, 0.12, 'square', 0.05), i * 90)); },
  lose: () => tone(300, 0.4, 'sawtooth', 0.05, -250),
  gameover: () => { [392, 349, 311, 262].forEach((f, i) => setTimeout(() => tone(f, 0.25, 'square', 0.05), i * 220)); },
  win: () => { [523, 659, 784, 1046, 1318].forEach((f, i) => setTimeout(() => tone(f, 0.18, 'square', 0.06), i * 110)); },
  coin: () => { tone(988, 0.08); setTimeout(() => tone(1319, 0.3), 80); },
  // Scope Creep (Pac-Man easter egg)
  waka: () => { tone(330, 0.05, 'square', 0.04, 120); setTimeout(() => tone(450, 0.05, 'square', 0.04, -120), 55); },
  power: () => { [220, 330, 440].forEach((f, i) => setTimeout(() => tone(f, 0.1, 'triangle', 0.05), i * 60)); },
  eatGhost: () => { [392, 523, 659, 784, 1046].forEach((f, i) => setTimeout(() => tone(f, 0.06, 'square', 0.05), i * 40)); },
  death: () => { [660, 520, 400, 300, 220, 160].forEach((f, i) => setTimeout(() => tone(f, 0.16, 'sawtooth', 0.04, -40), i * 120)); },
};
