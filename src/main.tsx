import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
// Self-hosted Latin subsets for the two weights that the page uses.
import '@fontsource/geist-sans/latin-400.css';
import '@fontsource/geist-sans/latin-500.css';
import './index.css';
import App from './App.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
