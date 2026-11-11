import { useEffect, useState } from 'react';

/** One-per-session hint shown on small screens when a desktop-only extra is skipped. */
export default function Toast({ id, children }: { id: string; children: React.ReactNode }) {
  const key = `toast:${id}`;
  const [open, setOpen] = useState(false);
  useEffect(() => {
    let seen = false; try { seen = sessionStorage.getItem(key) === '1'; } catch { /* ignore */ }
    if (!seen) { const t = setTimeout(() => setOpen(true), 4000); return () => clearTimeout(t); }
  }, [key]);
  if (!open) return null;
  const close = () => { setOpen(false); try { sessionStorage.setItem(key, '1'); } catch { /* ignore */ } };
  const mail = `mailto:?subject=${encodeURIComponent('Play this on a bigger screen')}&body=${encodeURIComponent('https://mohsengh.com')}`;
  return (
    <div className="toast" role="status">
      <div className="box box--yellow">
        {children}
        <div className="row">
          <a className="btn btn--yellow" href={mail}>EMAIL ME THE LINK</a>
          <button type="button" className="btn btn--ghost" onClick={close}>OK</button>
        </div>
      </div>
    </div>
  );
}
