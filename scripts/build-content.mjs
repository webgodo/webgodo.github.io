// Builds src/generated/{articles.json,profile.json} from content/. Runs before dev and build.
import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { marked } from 'marked';

const root = path.resolve(import.meta.dirname, '..');
const outDir = path.join(root, 'src/generated');
fs.mkdirSync(outDir, { recursive: true });

const profile = JSON.parse(fs.readFileSync(path.join(root, 'content/profile.json'), 'utf8'));
fs.writeFileSync(path.join(outDir, 'profile.json'), JSON.stringify(profile));

const dir = path.join(root, 'content/articles');
const files = fs.existsSync(dir) ? fs.readdirSync(dir).filter((f) => f.endsWith('.md')) : [];
const articles = files
  .map((file) => {
    const raw = fs.readFileSync(path.join(dir, file), 'utf8');
    const { data, content } = matter(raw);
    const slug = (data.slug || file.replace(/\.md$/, '').replace(/^\d{4}-\d{2}-\d{2}-/, '')).toString();
    const date = data.date instanceof Date ? data.date.toISOString().slice(0, 10) : String(data.date ?? '');
    const words = content.split(/\s+/).filter(Boolean).length;
    return {
      slug,
      title: String(data.title ?? slug),
      date,
      tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
      summary: String(data.summary ?? ''),
      draft: Boolean(data.draft),
      readingMinutes: Math.max(1, Math.round(words / 220)),
      html: marked.parse(content, { gfm: true }),
    };
  })
  .filter((a) => !a.draft)
  .sort((a, b) => (a.date < b.date ? 1 : -1));

fs.writeFileSync(path.join(outDir, 'articles.json'), JSON.stringify(articles));
console.log(`content: ${articles.length} article(s), ${profile.timeline.length} timeline entries`);
