import { Link } from 'react-router-dom';
import { useTitle } from '../lib/hooks';
export default function NotFound() {
  useTitle('404');
  return (
    <div style={{ textAlign: 'center', padding: '40px 0' }}>
      <h1>404 · GAME OVER</h1>
      <p className="muted">This level doesn't exist. Yet.</p>
      <Link className="btn btn--yellow" to="/">▶ CONTINUE?</Link>
    </div>
  );
}
