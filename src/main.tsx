import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
// Self-hosted Latin subsets: one file per weight that the page uses.
import '@fontsource/inter-tight/latin-600.css';
import '@fontsource/geist-sans/latin-400.css';
import '@fontsource/geist-sans/latin-500.css';
import '@fontsource/geist-mono/latin-400.css';
import '@fontsource/geist-mono/latin-500.css';
import './index.css';
import App from './App.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
