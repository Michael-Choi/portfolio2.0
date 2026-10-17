import { useEffect, useRef, useState } from 'react';
import { mapNodes, mapScenarios } from '@/content';
import { webglAvailable } from '@/webgl';

type MapApi = {
  setActive: (id: string | null) => void;
  setScenario: (path: string[] | null) => void;
  dispose: () => void;
};

/** How long each scenario plays before the map moves to the next one. */
const AUTOPLAY_MS = 8000;

export const IntegrationMap = () => {
  const container = useRef<HTMLDivElement>(null);
  const api = useRef<MapApi | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [autoplay, setAutoplay] = useState(
    () => !window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );
  const [supported] = useState(webglAvailable);

  const activeNode = hovered ?? selected;
  const scenario = mapScenarios[scenarioIndex];
  const node = activeNode ? mapNodes.find((candidate) => candidate.id === activeNode) : undefined;
  const card = node
    ? { eyebrow: node.label, title: node.title, body: node.body }
    : { eyebrow: scenario.title, title: scenario.label, body: scenario.body };

  // The scene loads after the page text. Refs pass the current state to it on mount.
  const state = useRef({ activeNode, path: scenario.path });
  state.current = { activeNode, path: scenario.path };

  useEffect(() => {
    if (!supported || !container.current) return;
    let cancelled = false;
    import('@/three/integrationMap').then(({ mountIntegrationMap }) => {
      if (cancelled || !container.current) return;
      api.current = mountIntegrationMap(container.current, { onHover: setHovered, onSelect: setSelected });
      api.current.setScenario(state.current.path);
      api.current.setActive(state.current.activeNode);
    });
    return () => {
      cancelled = true;
      api.current?.dispose();
      api.current = null;
    };
  }, [supported]);

  useEffect(() => {
    api.current?.setActive(activeNode);
  }, [activeNode]);

  useEffect(() => {
    api.current?.setScenario(scenario.path);
  }, [scenario]);

  // Scenarios advance by themselves until the visitor picks one or explores a node.
  useEffect(() => {
    if (!autoplay || activeNode) return;
    const timer = window.setTimeout(
      () => setScenarioIndex((index) => (index + 1) % mapScenarios.length),
      AUTOPLAY_MS,
    );
    return () => window.clearTimeout(timer);
  }, [autoplay, activeNode, scenarioIndex]);

  const pickScenario = (index: number) => {
    setAutoplay(false);
    setSelected(null);
    setScenarioIndex(index);
  };

  return (
    // The map sits in a card, like a product screenshot.
    <div className="overflow-hidden rounded-3xl border border-line bg-card shadow-[0_30px_80px_-40px_rgba(12,13,16,0.35)]">
      <div className="flex flex-wrap items-center gap-2 border-b border-line px-4 py-3 sm:px-5">
        {mapScenarios.map((item, index) => (
          <button
            key={item.id}
            type="button"
            aria-pressed={index === scenarioIndex && !activeNode}
            onClick={() => pickScenario(index)}
            className="rounded-full border border-line px-3 py-1.5 text-xs text-muted transition-colors hover:border-accent/60 hover:text-ink aria-pressed:border-accent aria-pressed:bg-accent aria-pressed:text-accent-ink"
          >
            {item.label}
          </button>
        ))}
        {supported && (
          <span className="ml-auto hidden font-mono text-[11px] text-muted lg:inline">
            Drag to rotate · hover a node
          </span>
        )}
      </div>

      {/* On phones the card sits under the map. On wider screens it overlays the lower left. */}
      <div className="relative">
        {supported && (
          <div className="relative h-[360px] sm:h-[480px] lg:h-[540px]">
            <div ref={container} aria-hidden="true" className="absolute inset-0 select-none" />
          </div>
        )}
        <div
          aria-live="polite"
          className="pointer-events-none m-4 max-w-sm rounded-xl border border-line bg-card/90 p-4 backdrop-blur-md sm:absolute sm:bottom-0 sm:left-0"
        >
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-accent">{card.eyebrow}</p>
          <p className="mt-1.5 font-medium">{card.title}</p>
          <p className="mt-1 text-sm leading-relaxed text-muted">{card.body}</p>
        </div>
      </div>
    </div>
  );
};
