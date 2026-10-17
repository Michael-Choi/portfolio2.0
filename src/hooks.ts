import { useEffect, useState, type RefObject } from 'react';

/** Tracks a CSS media query. */
export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches);
  useEffect(() => {
    const media = window.matchMedia(query);
    const onChange = () => setMatches(media.matches);
    onChange();
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, [query]);
  return matches;
}

export function usePrefersReducedMotion() {
  return useMediaQuery('(prefers-reduced-motion: reduce)');
}

/** Tracks an element's size in CSS pixels. */
export function useElementSize(ref: RefObject<HTMLElement | null>) {
  const [size, setSize] = useState({ width: 0, height: 0 });
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize({ width, height });
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, [ref]);
  return size;
}

/**
 * Becomes true when the browser is idle after load, or when the element comes within
 * one viewport of the screen, whichever happens first. Heavy assets wait for this.
 */
export function useLoadWhenNear(ref: RefObject<HTMLElement | null>) {
  const [load, setLoad] = useState(false);
  useEffect(() => {
    if (load) return;
    const element = ref.current;
    if (!element) return;
    const start = () => setLoad(true);

    const observer = new IntersectionObserver(([entry]) => entry.isIntersecting && start(), {
      rootMargin: '100% 0px',
    });
    observer.observe(element);

    let idle = 0;
    const whenIdle = () => {
      idle = window.requestIdleCallback
        ? window.requestIdleCallback(start, { timeout: 4000 })
        : window.setTimeout(start, 1500);
    };
    if (document.readyState === 'complete') whenIdle();
    else window.addEventListener('load', whenIdle, { once: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('load', whenIdle);
      if (window.cancelIdleCallback) window.cancelIdleCallback(idle);
      else window.clearTimeout(idle);
    };
  }, [ref, load]);
  return load;
}
