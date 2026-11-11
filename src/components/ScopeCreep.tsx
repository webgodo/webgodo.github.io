import { useEffect, useRef, useState } from 'react';
import { GHOSTS, Pacman } from '../game/pacman';
import { sfx } from '../game/sound';

type End = { kind: 'over' | 'win'; score: number } | null;

/** The Konami-code easter egg: a Pac-Man mini-game drawn over the breaker. */
export default function ScopeCreep({ onClose }: { onClose: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameRef = useRef<Pacman | null>(null);
  const [end, setEnd] = useState<End>(null);

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const g = new Pacman(canvas, { onScore: () => {}, onLives: () => {}, onEnd: (kind, score) => setEnd({ kind, score }) });
    g.setSfx(sfx);
    gameRef.current = g;
    g.start();
    canvas.focus();
    const vis = () => (document.hidden ? g.stop() : g.start());
    document.addEventListener('visibilitychange', vis);
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', esc);
    const prev = document.body.style.overflow; document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('visibilitychange', vis); window.removeEventListener('keydown', esc); document.body.style.overflow = prev; g.destroy(); gameRef.current = null; };
  }, [onClose]);

  const again = () => { setEnd(null); gameRef.current?.reset(); gameRef.current?.start(); canvasRef.current?.focus(); };

  return (
    <div className="game__overlay egg" role="dialog" aria-modal="true" aria-label="Scope Creep">
      <div className="box box--yellow egg__box">
        <div className="egg__head">
          <h2 className="neon" style={{ color: 'var(--yellow)', margin: 0 }}>SCOPE CREEP</h2>
          <button type="button" className="btn btn--pink" onClick={onClose} aria-label="Close Scope Creep">✕ CLOSE</button>
        </div>
        <div className="egg__stage">
          <canvas ref={canvasRef} className="egg__canvas" tabIndex={0} aria-label="Scope Creep: eat every pellet, dodge the ghosts. Arrow keys, WASD, or swipe." />
        </div>
        <ul className="egg__legend" aria-label="Ghosts">
          {GHOSTS.map((g) => <li key={g.name} style={{ color: g.color }}><i style={{ background: g.color }} />{g.name}</li>)}
        </ul>
        <p className="egg__hint">☕ = POWER PELLET · ARROWS / WASD · SWIPE TO TURN · ESC TO QUIT</p>
        {end && (
          <div className="game__overlay">
            <div className={`box ${end.kind === 'win' ? 'box--yellow' : 'box--pink'}`}>
              <h2 className="neon" style={{ color: end.kind === 'win' ? 'var(--yellow)' : 'var(--pink)' }}>{end.kind === 'win' ? 'SCOPE CONTAINED!' : 'GAME OVER'}</h2>
              <p style={{ fontFamily: 'var(--f-head)', fontSize: 8, lineHeight: 2, color: 'var(--cyan)' }}>{end.score} PTS</p>
              <p>{end.kind === 'win' ? 'Every pellet eaten. The backlog is empty, for once.' : 'The sprint ended. The scope did not.'}</p>
              <div className="row" style={{ justifyContent: 'center' }}>
                <button type="button" className="btn btn--yellow" onClick={again}>▶ PLAY AGAIN</button>
                <button type="button" className="btn btn--pink" onClick={onClose}>✕ CLOSE</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
