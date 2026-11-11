import { useEffect, useRef, useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { profile } from '../lib/content';
import { sfx } from '../game/sound';

const nav = [
  ['/', 'PLAY'], ['/timeline', 'TIMELINE'], ['/skills', 'SKILLS'], ['/projects', 'PROJECTS'], ['/articles', 'ARTICLES'], ['/cv', 'CV'],
] as const;

export default function Layout() {
  const { pathname } = useLocation();
  const [muted, setMuted] = useState(sfx.isMuted());
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  const toggle = () => { const m = !muted; sfx.setMuted(m); setMuted(m); if (!m) sfx.coin(); };
  // 10 quick taps on the logo = the touch-screen way into the Konami easter egg (Home listens for the event).
  const taps = useRef({ n: 0, t: 0 });
  const onLogo = (e: React.MouseEvent) => {
    const now = performance.now(); const k = taps.current;
    k.n = now - k.t < 600 ? k.n + 1 : 1; k.t = now;
    if (k.n >= 10) { k.n = 0; e.preventDefault(); window.dispatchEvent(new Event('scope-creep')); }
  };

  return (
    <div className="cab">
      <header className="marquee">
        <NavLink to="/" className="marquee__logo" onClick={onLogo}>★ MOHSEN<b>GH</b>.COM ★</NavLink>
        <nav className="nav" aria-label="Main">
          {nav.map(([to, label]) => <NavLink key={to} to={to} end={to === '/'}>{label}</NavLink>)}
          <button type="button" className="btn btn--ghost no-print" onClick={toggle} aria-pressed={!muted} title="Toggle sound">
            {muted ? '🔇' : '🔊'}
          </button>
        </nav>
      </header>
      <main className="screen crt">
        <div className="screen__inner"><Outlet /></div>
      </main>
      <footer className="panel">
        <span className="dots" aria-hidden="true"><i style={{ color: '#ff2d95', background: '#ff2d95' }} /><i style={{ color: '#00e5ff', background: '#00e5ff' }} /><i style={{ color: '#ffe600', background: '#ffe600' }} /></span>
        <span>
          <a href={profile.links.github} rel="me">GITHUB</a> · <a href={profile.links.linkedin} rel="me">LINKEDIN</a> · <a href={`mailto:${profile.email}`}>EMAIL</a> · <a href="/rss.xml">RSS</a>
        </span>
        <span>© {new Date().getFullYear()} · BUILT WITH VITE + CANVAS · $0/MO</span>
      </footer>
    </div>
  );
}
