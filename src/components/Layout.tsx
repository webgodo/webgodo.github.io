import { useEffect, useState } from 'react';
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

  return (
    <div className="cab">
      <header className="marquee">
        <NavLink to="/" className="marquee__logo">★ MOHSEN<b>GH</b>.COM ★</NavLink>
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
