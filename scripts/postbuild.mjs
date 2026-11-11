// After vite build: write rss.xml and sitemap.xml into dist/.
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const dist = path.join(root, 'dist');
const site = 'https://mohsengh.com';
const articles = JSON.parse(fs.readFileSync(path.join(root, 'src/generated/articles.json'), 'utf8'));
const esc = (s) => s.replace(/[<>&]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' })[c]);

const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"><channel>
<title>Mohsen Ghaemmaghami — Articles</title><link>${site}/articles</link>
<description>Notes on frontend engineering, performance and shipping.</description>
${articles.map((a) => `<item><title>${esc(a.title)}</title><link>${site}/articles/${a.slug}</link><guid>${site}/articles/${a.slug}</guid><pubDate>${new Date(a.date).toUTCString()}</pubDate><description>${esc(a.summary)}</description></item>`).join('\n')}
</channel></rss>`;
fs.writeFileSync(path.join(dist, 'rss.xml'), rss);

const pages = ['', '/timeline', '/skills', '/projects', '/articles', '/cv', ...articles.map((a) => `/articles/${a.slug}`)];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map((p) => `<url><loc>${site}${p}</loc></url>`).join('\n')}
</urlset>`;
fs.writeFileSync(path.join(dist, 'sitemap.xml'), sitemap);
console.log(`postbuild: rss (${articles.length}) + sitemap (${pages.length})`);
