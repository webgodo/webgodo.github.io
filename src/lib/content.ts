import profileJson from '../generated/profile.json';
import articlesJson from '../generated/articles.json';

export interface Job { id: string; from: string; to: string | null; role: string; company: string; type: string; tech: string[]; highlights: string[]; }
export interface Skill { group: string; level: number; lines: string[]; serious: string; }
export interface Project { name: string; years: string; blurb: string; tech: string[]; }
export interface Profile {
  name: string; shortName: string; title: string; tagline: string; pitch: string; location: string; openTo: string; email: string;
  links: { github: string; linkedin: string; cv: string };
  timeline: Job[]; education: { degree: string; school: string; years: string }[]; projects: Project[]; skills: Skill[];
}
export interface Article { slug: string; title: string; date: string; tags: string[]; summary: string; readingMinutes: number; html: string; }

export const profile = profileJson as Profile;
export const articles = articlesJson as Article[];

export const LEVEL_COLORS = ['#ff2d95', '#ffe600', '#00e5ff', '#7cff4a', '#ff8a00', '#b14bff', '#ff5c5c', '#4af0c0', '#f0a0ff', '#ffd27c'];
export const levelColor = (i: number) => LEVEL_COLORS[i % LEVEL_COLORS.length];

export function years(job: Job) {
  const f = job.from.slice(0, 4); const t = job.to ? job.to.slice(0, 4) : 'now';
  return f === t ? f : `${f} – ${t}`;
}
export function fmtDate(iso: string) {
  return new Date(iso + 'T00:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}
