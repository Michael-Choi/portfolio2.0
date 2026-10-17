import { useEffect, useRef, useState } from 'react';
import { webglAvailable } from '@/look';

export const AppGlobe = () => {
  const container = useRef<HTMLDivElement>(null);
  const [connections, setConnections] = useState(0);
  const [supported] = useState(webglAvailable);

  useEffect(() => {
    if (!supported || !container.current) return;
    let cancelled = false;
    let dispose: (() => void) | undefined;
    import('@/three/globe').then(({ mountGlobe }) => {
      if (cancelled || !container.current) return;
      dispose = mountGlobe(container.current, { onConnect: setConnections }).dispose;
    });
    return () => {
      cancelled = true;
      dispose?.();
    };
  }, [supported]);

  if (!supported) return null;

  return (
    <div className="relative">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_45%_60%_at_50%_75%,color-mix(in_oklab,var(--accent)_10%,transparent),transparent_70%)]"
      />
      <div ref={container} aria-hidden="true" className="relative h-[440px] w-full select-none sm:h-[560px]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-6 flex justify-center">
        <p className="rounded-full border border-line bg-card/90 px-4 py-2 font-mono text-xs text-muted shadow-sm backdrop-blur">
          <span className="tabular-nums text-ink">{connections.toLocaleString()}</span> connections
          <span className="hidden sm:inline"> this visit · click the globe to add more</span>
          <span className="sm:hidden"> · tap to add</span>
        </p>
      </div>
    </div>
  );
};
