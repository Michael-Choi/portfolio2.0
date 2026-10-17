import { useEffect, useRef, useState } from 'react';
import { useLoadWhenNear } from '@/hooks';
import type { MapScenario } from '@/three/integrationMap';
import { webglAvailable } from '@/webgl';
import { MapPoster } from './MapPoster';

type MapApi = { setScenario: (scenario: MapScenario | null) => void; dispose: () => void };

type MapCanvasProps = {
  scenario: MapScenario | null;
  /** Phones: labels on the active path only, and WebGL only on devices with 4+ cores. */
  compact?: boolean;
};

/** The integration map: an SVG poster first, then the three.js scene fades in over it. */
export const MapCanvas = ({ scenario, compact = false }: MapCanvasProps) => {
  const box = useRef<HTMLDivElement>(null);
  const container = useRef<HTMLDivElement>(null);
  const api = useRef<MapApi | null>(null);
  const [ready, setReady] = useState(false);
  const [use3d] = useState(
    () => webglAvailable() && (!compact || (navigator.hardwareConcurrency ?? 0) >= 4),
  );
  const load = useLoadWhenNear(box);

  // The scene loads later than the page, so a ref hands it the scenario that is current then.
  const current = useRef(scenario);
  current.current = scenario;

  useEffect(() => {
    if (!use3d || !load || !container.current) return;
    let cancelled = false;
    import('@/three/integrationMap').then(({ mountIntegrationMap }) => {
      if (cancelled || !container.current) return;
      api.current = mountIntegrationMap(container.current, { compact, onReady: () => setReady(true) });
      api.current.setScenario(current.current);
    });
    return () => {
      cancelled = true;
      api.current?.dispose();
      api.current = null;
    };
  }, [use3d, load, compact]);

  useEffect(() => {
    api.current?.setScenario(scenario);
  }, [scenario]);

  return (
    <div ref={box} className="relative h-full w-full select-none">
      <div className={`transition-opacity duration-500 motion-reduce:transition-none ${ready ? 'opacity-0' : 'opacity-100'}`}>
        <MapPoster scenario={scenario} compact={compact} />
      </div>
      {use3d && (
        <div
          ref={container}
          aria-hidden="true"
          className={`absolute inset-0 transition-opacity duration-500 motion-reduce:transition-none ${
            ready ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}
    </div>
  );
};
