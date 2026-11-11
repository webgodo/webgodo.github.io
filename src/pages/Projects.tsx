import { levelColor, profile } from '../lib/content';
import { useTitle } from '../lib/hooks';

export default function Projects() {
  useTitle('Projects');
  return (
    <div>
      <h1>BONUS STAGES · PROJECTS</h1>
      <p className="muted">Things with a name and a launch date, from the archive.</p>
      <div className="grid">
        {profile.projects.map((p, i) => (
          <article className="box" key={p.name} style={{ borderColor: levelColor(i) }}>
            <div className="reveal__years" style={{ color: levelColor(i) }}>{p.years}</div>
            <h3 style={{ color: 'var(--fg)', margin: '8px 0 6px' }}>{p.name}</h3>
            <p style={{ fontSize: 19, margin: '0 0 8px' }}>{p.blurb}</p>
            <div>{p.tech.map((t) => <span className="tag" key={t}>{t}</span>)}</div>
          </article>
        ))}
      </div>
    </div>
  );
}
