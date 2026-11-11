import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import NotFound from './pages/NotFound';

const Timeline = lazy(() => import('./pages/Timeline'));
const Skills = lazy(() => import('./pages/Skills'));
const Projects = lazy(() => import('./pages/Projects'));
const Articles = lazy(() => import('./pages/Articles'));
const Article = lazy(() => import('./pages/Article'));
const CV = lazy(() => import('./pages/CV'));

export default function App() {
  return (
    <Suspense fallback={<p className="blink" style={{ fontFamily: 'var(--f-head)', fontSize: 9 }}>LOADING…</p>}>
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="timeline" element={<Timeline />} />
        <Route path="skills" element={<Skills />} />
        <Route path="projects" element={<Projects />} />
        <Route path="articles" element={<Articles />} />
        <Route path="articles/:slug" element={<Article />} />
        <Route path="cv" element={<CV />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
    </Suspense>
  );
}
