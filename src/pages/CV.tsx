import { profile, years } from '../lib/content';
import { useTitle } from '../lib/hooks';

export default function CV() {
  useTitle('CV');
  return (
    <div style={{ maxWidth: 820 }}>
      <div className="row no-print" style={{ justifyContent: 'space-between', marginBottom: 16 }}>
        <span className="muted">The plain version. Printable.</span>
        <span className="row">
          <a className="btn btn--yellow" href={profile.links.cv} download>⬇ PDF</a>
          <button type="button" className="btn" onClick={() => window.print()}>🖨 PRINT</button>
        </span>
      </div>
      <h1>{profile.name}</h1>
      <p><b>{profile.title}</b> · {profile.location} · <a href={`mailto:${profile.email}`}>{profile.email}</a> · <a href={profile.links.linkedin}>LinkedIn</a> · <a href={profile.links.github}>GitHub</a></p>
      <p>{profile.pitch}</p>
      <h2>Experience</h2>
      {profile.timeline.map((j) => (
        <section key={j.id} style={{ marginBottom: 18 }}>
          <div className="row" style={{ justifyContent: 'space-between' }}>
            <b>{j.role} · {j.company}</b><span className="muted">{years(j)} · {j.type}</span>
          </div>
          <ul style={{ margin: '4px 0' }}>{j.highlights.map((h) => <li key={h}>{h}</li>)}</ul>
          <div className="muted" style={{ fontSize: 18 }}>{j.tech.join(' · ')}</div>
        </section>
      ))}
      <h2>Skills</h2>
      <p>{profile.skills.map((s) => s.serious).join(' ')}</p>
      <h2>Education</h2>
      <ul>{profile.education.map((e) => <li key={e.degree}>{e.degree}, {e.school} ({e.years})</li>)}</ul>
    </div>
  );
}
