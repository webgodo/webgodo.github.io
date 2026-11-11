import type { Job } from '../lib/content';
import { years } from '../lib/content';

export default function JobCard({ job, color, compact = false }: { job: Job; color: string; compact?: boolean }) {
  return (
    <article className="box reveal" style={{ borderColor: color }}>
      <div className="reveal__years" style={{ color }}>{years(job)} · {job.type}</div>
      <h3 className="reveal__role" style={{ color: 'var(--fg)' }}>{job.role}</h3>
      <div className="reveal__co" style={{ color }}>{job.company}</div>
      <div style={{ margin: '6px 0' }}>{job.tech.map((t) => <span className="tag" key={t}>{t}</span>)}</div>
      <ul>{(compact ? job.highlights.slice(0, 2) : job.highlights).map((h) => <li key={h}>{h}</li>)}</ul>
    </article>
  );
}
