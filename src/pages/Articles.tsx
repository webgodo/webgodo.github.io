import { Link } from 'react-router-dom';
import { articles, fmtDate } from '../lib/content';
import { useTitle } from '../lib/hooks';

export default function Articles() {
  useTitle('Articles');
  return (
    <div>
      <h1>READ ME · ARTICLES</h1>
      <p className="muted">Notes on frontend engineering, performance and shipping. No game here, just reading. <a href="/rss.xml">RSS</a></p>
      {articles.length === 0 && <p>Nothing published yet. Press START on the homepage meanwhile.</p>}
      <div style={{ display: 'grid', gap: 14 }}>
        {articles.map((a) => (
          <article className="box" key={a.slug}>
            <div className="reveal__years">{fmtDate(a.date)} · {a.readingMinutes} MIN</div>
            <h3 style={{ margin: '8px 0 6px' }}><Link to={`/articles/${a.slug}`} style={{ color: 'var(--fg)' }}>{a.title}</Link></h3>
            <p style={{ margin: '0 0 8px' }}>{a.summary}</p>
            <div>{a.tags.map((t) => <span className="tag" key={t}>#{t}</span>)}</div>
          </article>
        ))}
      </div>
    </div>
  );
}
