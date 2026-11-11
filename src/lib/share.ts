import type { Summary } from '../game/breaker';

const mmss = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

export function shareText(s: Summary, won: boolean) {
  return won
    ? `I cleared Mohsen's entire career in ${mmss(s.seconds)} (${s.score} pts). Your turn: https://mohsengh.com`
    : `I broke ${s.bricks}/${s.totalBricks} bricks of Mohsen's career in ${mmss(s.seconds)} (${s.score} pts). Beat me: https://mohsengh.com`;
}

/** Draws a 1200x630 share card and returns it as a PNG blob. */
export async function drawShareCard(s: Summary, won: boolean): Promise<Blob> {
  const c = document.createElement('canvas'); c.width = 1200; c.height = 630;
  const g = c.getContext('2d')!;
  await document.fonts.load('40px "Press Start 2P"').catch(() => undefined);
  g.fillStyle = '#0b0b1a'; g.fillRect(0, 0, 1200, 630);
  // bricks
  const colors = ['#ff2d95', '#ffe600', '#00e5ff', '#7cff4a', '#ff8a00', '#b14bff'];
  for (let r = 0; r < 6; r++) for (let col = 0; col < 12; col++) {
    if ((r * 5 + col * 3) % 7 === 0) continue;
    g.fillStyle = colors[r]; g.fillRect(60 + col * 92, 60 + r * 30, 84, 22);
  }
  // scanlines
  g.fillStyle = 'rgba(0,0,0,.25)'; for (let y = 0; y < 630; y += 3) g.fillRect(0, y, 1200, 1);
  // frame
  g.strokeStyle = '#ff2d95'; g.lineWidth = 6; g.strokeRect(20, 20, 1160, 590);
  g.font = '34px "Press Start 2P", monospace'; g.fillStyle = '#ffe600'; g.textAlign = 'center';
  g.shadowColor = '#ffe600'; g.shadowBlur = 14;
  g.fillText(won ? 'CAREER CLEARED!' : 'GAME OVER', 600, 320);
  g.shadowBlur = 0; g.font = '22px "Press Start 2P", monospace'; g.fillStyle = '#00e5ff';
  g.fillText(`${s.bricks}/${s.totalBricks} BRICKS   ${mmss(s.seconds)}   ${s.score} PTS`, 600, 390);
  g.font = '18px "Press Start 2P", monospace'; g.fillStyle = '#f4f4ff';
  g.fillText('CAREER BREAKER — MOHSEN GHAEMMAGHAMI', 600, 470);
  g.fillStyle = '#ff2d95'; g.fillText('mohsengh.com', 600, 520);
  g.fillStyle = '#9a9ab8'; g.font = '14px "Press Start 2P", monospace';
  g.fillText('SENIOR SOFTWARE ENGINEER · REACT · TYPESCRIPT · NODE', 600, 570);
  return new Promise((res) => c.toBlob((b) => res(b!), 'image/png'));
}

export async function share(s: Summary, won: boolean): Promise<'shared' | 'copied' | 'downloaded'> {
  const text = shareText(s, won);
  const blob = await drawShareCard(s, won);
  const file = new File([blob], 'career-breaker.png', { type: 'image/png' });
  const nav = navigator as Navigator & { canShare?: (d: ShareData) => boolean };
  if (nav.share && nav.canShare?.({ files: [file] })) {
    try { await nav.share({ files: [file], text, title: 'Career Breaker' }); return 'shared'; } catch { /* cancelled */ }
  }
  try { await navigator.clipboard.writeText(text); } catch { /* ignore */ }
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'career-breaker.png'; a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 5000);
  return 'downloaded';
}
