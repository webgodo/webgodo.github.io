import JobCard from '../components/JobCard';
import { levelColor, profile } from '../lib/content';
import { useTitle } from '../lib/hooks';

export default function Timeline() {
  useTitle('Timeline');
  const jobs = profile.timeline;
  return (
    <div>
      <h1>LEVEL SELECT · CAREER TIMELINE</h1>
      <p className="muted">{jobs.length} levels, 2012 → today. Newest first.</p>
      <div style={{ display: 'grid', gap: 16 }}>
        {jobs.map((job, i) => (
          <div key={job.id} style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 12, alignItems: 'start' }}>
            <div className="reveal__years" style={{ color: levelColor(i), paddingTop: 22, width: 56 }}>LV.{String(jobs.length - i).padStart(2, '0')}</div>
            <JobCard job={job} color={levelColor(i)} />
          </div>
        ))}
      </div>
      <h2 style={{ marginTop: 32 }}>TRAINING GROUNDS · EDUCATION</h2>
      <ul>{profile.education.map((e) => <li key={e.degree}><b>{e.degree}</b>, {e.school} <span className="muted">({e.years})</span></li>)}</ul>
    </div>
  );
}
