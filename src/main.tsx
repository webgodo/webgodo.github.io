import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './styles/global.css';
import './styles/game.css';

console.log('%c▶ PSST. The source is at https://github.com/webgodo/webgodo.github.io — fork it and make your own.', 'font-family:monospace;color:#ffe600;background:#0b0b1a;padding:6px 10px;border:2px solid #ff2d95');

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
