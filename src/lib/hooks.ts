import { useEffect, useState } from 'react';

export function useTitle(t: string) {
  useEffect(() => { document.title = t ? `${t} — Mohsen Ghaemmaghami` : 'Mohsen Ghaemmaghami — Senior Software Engineer'; }, [t]);
}

export function useIsSmall(bp = 720) {
  const [small, set] = useState(() => typeof window !== 'undefined' && window.matchMedia(`(max-width: ${bp}px)`).matches);
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${bp}px)`);
    const fn = () => set(mq.matches); mq.addEventListener('change', fn); return () => mq.removeEventListener('change', fn);
  }, [bp]);
  return small;
}

export const prefersReducedMotion = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const KONAMI = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
export function useKonami(onHit: () => void) {
  useEffect(() => {
    let i = 0;
    const fn = (e: KeyboardEvent) => {
      i = e.key === KONAMI[i] ? i + 1 : e.key === KONAMI[0] ? 1 : 0;
      if (i === KONAMI.length) { i = 0; onHit(); }
    };
    window.addEventListener('keydown', fn); return () => window.removeEventListener('keydown', fn);
  }, [onHit]);
}
