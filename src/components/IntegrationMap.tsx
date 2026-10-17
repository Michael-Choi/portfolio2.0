import { useEffect, useRef, useState } from 'react';
import { mapNodes } from '@/content';
import { webglAvailable } from '@/look';

type MapApi = { setActive: (id: string | null) => void; dispose: () => void };

export const IntegrationMap = () => {
  const container = useRef<HTMLDivElement>(null);
  const api = useRef<MapApi | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [supported] = useState(webglAvailable);
  const active = hovered ?? selected;
  const shown = mapNodes.find((node) => node.id === (active ?? 'runneth'))!;

  useEffect(() => {
    if (!supported || !container.current) return;
    let cancelled = false;
    import('@/three/constellation').then(({ mountConstellation }) => {
      if (cancelled || !container.current) return;
      api.current = mountConstellation(container.current, { onHover: setHovered, onSelect: setSelected });
    });
    return () => {
      cancelled = true;
      api.current?.dispose();
      api.current = null;
    };
  }, [supported]);

  useEffect(() => {
    api.current?.setActive(active);
  }, [active]);

  return (
    <div>
      {/* On phones the card sits under the map. On wider screens it overlays the lower left. */}
      <div className="relative">
        {supported && (
          <div className="relative h-[360px] sm:h-[520px] lg:h-[580px]">
            <div ref={container} aria-hidden="true" className="absolute inset-0 select-none" />
          </div>
        )}
        <div
          aria-live="polite"
          className={`pointer-events-none max-w-sm rounded-xl border border-line bg-card/85 p-4 backdrop-blur-md ${
            supported ? 'mt-3 sm:absolute sm:bottom-0 sm:left-0 sm:mt-0' : ''
          }`}
        >
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-accent">{shown.label}</p>
          <p className="mt-1.5 font-medium">{shown.title}</p>
          <p className="mt-1 text-sm leading-relaxed text-muted">{shown.body}</p>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="mr-1 font-mono text-[11px] text-muted">
          {supported ? 'Drag to rotate · pick a node:' : 'Pick a connection:'}
        </span>
        {mapNodes.map((node) => (
          <button
            key={node.id}
            type="button"
            aria-pressed={selected === node.id}
            onClick={() => setSelected((current) => (current === node.id ? null : node.id))}
            className="rounded-full border border-line px-2.5 py-1 font-mono text-[11px] text-muted transition-colors hover:border-accent/60 hover:text-ink aria-pressed:border-accent aria-pressed:text-ink"
          >
            {node.label}
          </button>
        ))}
      </div>
    </div>
  );
};
