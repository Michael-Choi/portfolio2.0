import { useRef } from 'react';
import { mapEdges, mapNodes } from '@/content';
import { useElementSize } from '@/hooks';
import { POSITIONS, project } from '@/mapLayout';
import { nodeCardHTML } from '@/nodeCard';
import type { MapScenario } from '@/three/integrationMap';

const edgeKey = (a: string, b: string) => [a, b].sort().join('|');

type MapPosterProps = { scenario: MapScenario | null; compact?: boolean };

/**
 * A flat drawing of the integration map with the same cards as the scene. It paints before
 * three.js loads, and it is the whole map when WebGL is not available.
 */
export const MapPoster = ({ scenario, compact = false }: MapPosterProps) => {
  const box = useRef<HTMLDivElement>(null);
  const { width, height } = useElementSize(box);
  const aspect = width && height ? width / height : 1.3;
  const half = height / 2;
  const toPx = (point: [number, number, number]) => {
    const p = project(point, aspect, compact);
    return { x: width / 2 + p.x * half, y: half - p.y * half, depth: p.depth };
  };

  const onPath = new Set<string>();
  if (scenario) {
    for (let i = 0; i < scenario.path.length - 1; i++) onPath.add(edgeKey(scenario.path[i], scenario.path[i + 1]));
  }
  const pathNodes = new Set(scenario?.path ?? []);

  // Far cards first, so near cards paint on top, as in the scene.
  const placed = mapNodes
    .map((node) => ({ node, ...toPx(POSITIONS[node.id]) }))
    .sort((a, b) => b.depth - a.depth);
  const depths = placed.map((item) => item.depth);
  const [nearest, farthest] = [Math.min(...depths), Math.max(...depths)];

  return (
    <div ref={box} aria-hidden="true" className={`absolute inset-0 ${compact ? 'map-compact' : ''}`}>
      {width > 0 && (
        <>
          <svg width={width} height={height} className="absolute inset-0">
            {mapEdges.map(([from, to]) => {
              // The same curve as the scene: bend the midpoint away from the center and upward.
              const a = POSITIONS[from];
              const b = POSITIONS[to];
              const mid: [number, number, number] = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2];
              const length = Math.hypot(...mid) || 1;
              const control: [number, number, number] = [
                mid[0] + (mid[0] / length) * 0.5,
                mid[1] + (mid[1] / length) * 0.5 + 0.35,
                mid[2] + (mid[2] / length) * 0.5,
              ];
              const p0 = toPx(a);
              const p1 = toPx(control);
              const p2 = toPx(b);
              const lit = onPath.has(edgeKey(from, to));
              return (
                <path
                  key={`${from}-${to}`}
                  d={`M${p0.x},${p0.y} Q${p1.x},${p1.y} ${p2.x},${p2.y}`}
                  fill="none"
                  stroke={lit ? 'var(--hub)' : '#cfcfc8'}
                  strokeOpacity={!scenario || lit ? 1 : 0.45}
                  strokeWidth={lit ? 2.5 : 1.5}
                  strokeDasharray={lit ? '6 4.5' : undefined}
                  strokeLinecap="round"
                />
              );
            })}
          </svg>
          {placed.map(({ node, x, y, depth }) => {
            const scale = farthest > nearest ? 1.04 - ((depth - nearest) / (farthest - nearest)) * 0.18 : 1;
            const state = !scenario ? 'rest' : pathNodes.has(node.id) ? 'active' : 'dim';
            // The markup is a fixed template from src/nodeCard.ts, not user input.
            const html = nodeCardHTML(node)
              .replace('data-state="rest"', `data-state="${state}"`)
              .replace('class="node-inner"', `class="node-inner" style="--depth:${scale.toFixed(3)}"`);
            return (
              <div
                key={node.id}
                className="node absolute -translate-x-1/2 -translate-y-1/2"
                style={{ left: x, top: y }}
                dangerouslySetInnerHTML={{ __html: html }}
              />
            );
          })}
        </>
      )}
    </div>
  );
};
