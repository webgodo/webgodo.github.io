import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Breaker, type Summary } from '../game/breaker';
import { sfx } from '../game/sound';
import JobCard from '../components/JobCard';
import Toast from '../components/Toast';
import { levelColor, profile } from '../lib/content';
import { prefersReducedMotion, useIsSmall, useKonami, useTitle } from '../lib/hooks';
import { share } from '../lib/share';

type End = { kind: 'over' | 'win'; s: Summary } | null;
const HI_KEY = 'breaker:hi';

export default function Home() {
  useTitle('');
  const small = useIsSmall(860);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameRef = useRef<Breaker | null>(null);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [hi, setHi] = useState(() => { try { return Number(localStorage.getItem(HI_KEY) || 0); } catch { return 0; } });
  const [revealed, setRevealed] = useState<number[]>([]);
  const [playing, setPlaying] = useState(false);
  const [end, setEnd] = useState<End>(null);
  const [shared, setShared] = useState('');

  const jobs = profile.timeline;
  const levels = jobs.map((j, i) => ({ id: j.id, label: `${j.from.slice(0, 4)} ${j.company.toUpperCase()}`, color: levelColor(i) }));

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const g = new Breaker(canvas, levels, {
      onReveal: (i) => setRevealed((r) => (r.includes(i) ? r : [i, ...r])),
      onScore: setScore,
      onLives: setLives,
      onGameOver: (s) => setEnd({ kind: 'over', s }),
      onWin: (s) => setEnd({ kind: 'win', s }),
      onTakeover: () => { setPlaying(true); setRevealed([]); setEnd(null); g.start(); canvas.focus(); },
    });
    g.setSfx(sfx);
    gameRef.current = g;
    const quiet = small || prefersReducedMotion();
    if (quiet) g.drawOnce(); else g.start(); // attract mode runs on desktop only
    const vis = () => (document.hidden ? g.stop() : (playingRef.current || !quiet) && g.start());
    document.addEventListener('visibilitychange', vis);
    return () => { document.removeEventListener('visibilitychange', vis); g.destroy(); gameRef.current = null; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [small]);

  const playingRef = useRef(false);
  useEffect(() => { playingRef.current = playing; }, [playing]);

  useEffect(() => {
    if (end && end.s.score > hi) { setHi(end.s.score); try { localStorage.setItem(HI_KEY, String(end.s.score)); } catch { /* ignore */ } }
  }, [end, hi]);

  useKonami(useCallback(() => { gameRef.current?.takeover(); gameRef.current?.revealAll(); setRevealed(jobs.map((_, i) => i)); }, [jobs]));

  const restart = () => { setEnd(null); setRevealed([]); setShared(''); gameRef.current?.reset(false); gameRef.current?.start(); canvasRef.current?.focus(); };
  const doShare = async () => { if (!end) return; const r = await share(end.s, end.kind === 'win'); setShared(r === 'downloaded' ? 'CARD SAVED · TEXT COPIED' : 'SHARED!'); };

  const mmss = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  return (
    <div className="game">
      <section className="game__stage" aria-label="Career Breaker game">
        <div className="game__hud" aria-live="polite">
          <span className="lv">LV.{String(revealed.length + 1).padStart(2, '0')} {revealed.length ? jobs[revealed[0]].company.toUpperCase() : 'START'}</span>
          <span className="sc">SCORE {String(score).padStart(6, '0')}</span>
          <span className="hi">HI {String(hi).padStart(6, '0')}</span>
          <span style={{ color: 'var(--orange)' }} aria-label={`${lives} lives`}>{'☕'.repeat(Math.max(0, lives))}{'·'.repeat(Math.max(0, 3 - lives))}</span>
        </div>
        <canvas ref={canvasRef} className="game__canvas" tabIndex={0} aria-label="Brick breaker: each row of bricks is a job. Break a row to reveal it. Move with arrow keys, mouse or touch." />
        <p className="sr-only">Prefer not to play? The same content is on the <Link to="/timeline">timeline</Link>, <Link to="/skills">skills</Link> and <Link to="/cv">CV</Link> pages.</p>
        {end && (
          <div className="game__overlay">
            <div className={`box ${end.kind === 'win' ? 'box--yellow' : 'box--pink'}`}>
              <h2 className="neon" style={{ color: end.kind === 'win' ? 'var(--yellow)' : 'var(--pink)' }}>{end.kind === 'win' ? 'CAREER CLEARED!' : 'GAME OVER'}</h2>
              <p style={{ fontFamily: 'var(--f-head)', fontSize: 8, lineHeight: 2, color: 'var(--cyan)' }}>
                {end.s.bricks}/{end.s.totalBricks} BRICKS · {mmss(end.s.seconds)} · {end.s.score} PTS<br />
                {end.s.revealed}/{jobs.length} LEVELS REVEALED
              </p>
              {end.kind === 'win' && <p>That's the whole career. The real one took 13 years.</p>}
              <div className="row" style={{ justifyContent: 'center' }}>
                <button type="button" className="btn btn--yellow" onClick={restart}>▶ PLAY AGAIN</button>
                <button type="button" className="btn btn--pink" onClick={doShare}>⇪ SHARE SCORE</button>
                <Link className="btn btn--green" to="/cv">HIRE ME</Link>
              </div>
              {shared && <div className="reveal__years" style={{ marginTop: 10, color: 'var(--green)' }}>{shared}</div>}
            </div>
          </div>
        )}
      </section>

      <aside className="hero box">
          <img className="hero__avatar" src="/avatar.png" width="64" height="64" alt="" />
          <h1 className="hero__name" style={{ color: 'var(--fg)', textShadow: '0 0 8px var(--cyan)' }}>{profile.name}</h1>
          <p className="hero__title">{profile.title}</p>
          <p className="hero__tag">{profile.tagline} · {profile.location}</p>
          <p className="hero__open">● {profile.openTo}</p>
          <div className="row">
            <a className="btn btn--yellow" href={profile.links.cv} download>⬇ DOWNLOAD CV</a>
            <Link className="btn" to="/timeline">SKIP GAME →</Link>
          </div>
          <div className="row" style={{ fontSize: 18 }}>
            <a href={profile.links.github}>GitHub</a><span className="muted">·</span><a href={profile.links.linkedin}>LinkedIn</a><span className="muted">·</span><a href={`mailto:${profile.email}`}>{profile.email}</a>
          </div>
      </aside>

      <aside className="game__side">

        <div>
          <div className="reveal__years" style={{ marginBottom: 6 }}>LEVELS {revealed.length}/{jobs.length}</div>
          <div className="levels" aria-hidden="true">
            {jobs.map((j, i) => <i key={j.id} className={revealed.includes(i) ? 'on' : ''} style={{ ['--c' as string]: levelColor(i) }} />)}
          </div>
        </div>

        {revealed.length ? (
          <JobCard key={revealed[0]} job={jobs[revealed[0]]} color={levelColor(revealed[0])} compact />
        ) : (
          <div className="box" style={{ borderColor: 'var(--line)' }}>
            <div className="reveal__years">HOW TO PLAY</div>
            <p style={{ margin: '8px 0 0', fontSize: 19 }}>
              Every row of bricks is a job, oldest at the bottom. Clear a row to reveal it here.
              {small ? ' Drag anywhere on the screen to move the paddle.' : ' Mouse, touch, or ← → keys. Catch the REACT / TS / CACHE power-ups.'}
            </p>
          </div>
        )}
      </aside>

      {small && (
        <Toast id="bigger-screen">★ BIGGER SCREEN = BONUS LEVEL ★<br />The full arcade (attract mode, CRT, easter eggs) runs on desktop.</Toast>
      )}
    </div>
  );
}
