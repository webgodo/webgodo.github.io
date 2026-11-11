import { Link, useParams } from 'react-router-dom';
import { articles, fmtDate } from '../lib/content';
import { useTitle } from '../lib/hooks';
import NotFound from './NotFound';

export default function Article() {
  const { slug } = useParams();
  const a = articles.find((x) => x.slug === slug);
  useTitle(a?.title ?? 'Article');
  if (!a) return <NotFound />;
  return (
    <article style={{ maxWidth: 760 }}>
      <Link to="/articles" className="reveal__years">◀ ALL ARTICLES</Link>
      <h1 style={{ marginTop: 16 }}>{a.title}</h1>
      <div className="muted" style={{ marginBottom: 20 }}>{fmtDate(a.date)} · {a.readingMinutes} min read · {a.tags.map((t) => <span className="tag" key={t}>#{t}</span>)}</div>
      {/* Content is authored by the site owner in the repo, rendered from Markdown at build time. */}
      <div dangerouslySetInnerHTML={{ __html: a.html }} />
    </article>
  );
}
