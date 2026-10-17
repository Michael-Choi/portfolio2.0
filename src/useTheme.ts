import { useEffect, useState } from 'react';

export type Theme = 'light' | 'dark';

// Keep the key and colors in sync with the theme script in index.html.
const KEY = 'theme';
const PAPER: Record<Theme, string> = { light: '#fbfbfa', dark: '#0e0e10' };

function saved(): Theme | null {
  try {
    const value = localStorage.getItem(KEY);
    return value === 'light' || value === 'dark' ? value : null;
  } catch {
    return null;
  }
}

function apply(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', PAPER[theme]);
}

/** The page theme. It follows the system setting until the visitor picks one, then keeps that choice. */
export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => (document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light'));

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => {
      if (saved()) return;
      const next = media.matches ? 'dark' : 'light';
      apply(next);
      setTheme(next);
    };
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, []);

  const toggle = () => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark';
    apply(next);
    try {
      localStorage.setItem(KEY, next);
    } catch {
      // Storage is off, as in some private windows. The choice lasts until the page closes.
    }
    setTheme(next);
  };

  return [theme, toggle] as const;
}
