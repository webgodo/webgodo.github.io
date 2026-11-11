import { useState } from 'react';
import { levelColor, profile } from '../lib/content';
import { useTitle } from '../lib/hooks';

function SkillCard({ i, group, level, lines, serious }: { i: number } & (typeof profile.skills)[number]) {
  const [flipped, setFlipped] = useState(false);
  const color = levelColor(i);
  return (
    <button type="button" className="box" onClick={() => setFlipped((f) => !f)} aria-pressed={flipped}
      style={{ borderColor: color, textAlign: 'left', color: 'inherit', font: 'inherit', cursor: 'pointer', width: '100%' }}
      title="Click to flip">
      <div className="row" style={{ justifyContent: 'space-between' }}>
        <h3 style={{ color, margin: 0 }}>{group}</h3>
        <span className="reveal__years" style={{ color }}>LV.{level}</span>
      </div>
      <div className="bar" style={{ ['--w' as string]: `${level}%`, ['--c' as string]: color, margin: '10px 0 12px' }}><i /></div>
      {flipped ? (
        <p style={{ margin: 0, color: 'var(--muted)' }}>{serious}</p>
      ) : (
        <ul style={{ margin: 0 }}>{lines.map((l) => <li key={l}>{l}</li>)}</ul>
      )}
      <div className="muted" style={{ fontFamily: 'var(--f-head)', fontSize: 6, marginTop: 10 }}>{flipped ? '◀ BACK TO THE FUN VERSION' : 'TAP FOR THE SERIOUS VERSION ▶'}</div>
    </button>
  );
}

export default function Skills() {
  useTitle('Skills');
  return (
    <div>
      <h1>CHARACTER SHEET · SKILLS</h1>
      <p className="muted">Levels are out of 99. Every card has a serious side; tap to flip.</p>
      <div className="grid">
        {profile.skills.map((s, i) => <SkillCard key={s.group} i={i} {...s} />)}
      </div>
    </div>
  );
}
