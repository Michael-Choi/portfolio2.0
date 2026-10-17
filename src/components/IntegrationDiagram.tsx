import { useEffect, useLayoutEffect, useRef, useState, type PointerEvent } from 'react';
import { edges, nodes, type Group, type MapNode } from '@/content';

type Box = { left: number; right: number; top: number; bottom: number; cx: number; cy: number };

/** Resting lean of the card, in degrees. */
const REST_TILT = 8;

const DOT: Record<Group, string> = {
  hub: 'bg-hub',
  surface: 'bg-surface',
  data: 'bg-data',
  tools: 'bg-tools',
  apps: 'bg-apps',
};

/** An S-curve between two pills, horizontal on wide screens and vertical on phones. */
function link(a: Box, b: Box) {
  const dx = b.cx - a.cx;
  const dy = b.cy - a.cy;
  if (Math.abs(dx) >= Math.abs(dy)) {
    const sx = dx > 0 ? a.right : a.left;
    const ex = dx > 0 ? b.left : b.right;
    const mx = (sx + ex) / 2;
    return `M${sx},${a.cy} C${mx},${a.cy} ${mx},${b.cy} ${ex},${b.cy}`;
  }
  const sy = dy > 0 ? a.bottom : a.top;
  const ey = dy > 0 ? b.top : b.bottom;
  const my = (sy + ey) / 2;
  return `M${a.cx},${sy} C${a.cx},${my} ${b.cx},${my} ${b.cx},${ey}`;
}

/** Claude to Motion data skips Runneth, so it arcs around the hub: over it, or down its left side. */
function arc(a: Box, b: Box, hub: Box) {
  if (a.bottom < hub.top) {
    const left = Math.max(4, Math.min(a.left, b.left, hub.left) - 22);
    return `M${a.left},${a.cy} C${left},${a.cy + 40} ${left},${b.cy - 40} ${b.left},${b.cy}`;
  }
  const top = Math.max(4, Math.min(a.top, b.top, hub.top) - 24);
  return `M${a.right},${a.cy} C${a.right + 60},${top} ${b.left - 60},${top} ${b.left},${b.cy}`;
}

const Pill = ({ node, state }: { node: MapNode; state: 'rest' | 'on' | 'off' }) => {
  const hub = node.group === 'hub';
  return (
    <span
      data-node={node.id}
      className={`inline-flex items-center gap-2 whitespace-nowrap rounded-full border transition-[opacity,border-color] duration-200 motion-reduce:transition-none ${
        hub
          ? 'border-ink bg-ink px-4 py-2 text-sm font-medium text-paper'
          : `bg-card px-3 py-1.5 text-[13px] ${state === 'on' ? 'border-ink/25 text-ink' : 'border-line text-ink/80'}`
      } ${state === 'off' ? 'opacity-45' : ''}`}
    >
      <span aria-hidden="true" className={`size-1.5 rounded-full ${DOT[node.group]}`} />
      {node.label}
    </span>
  );
};

/** The integrations around Runneth. Highlights the edges in `active` when a project is hovered. */
export const IntegrationDiagram = ({ active }: { active: string[] | null }) => {
  const box = useRef<HTMLDivElement>(null);
  const [boxes, setBoxes] = useState<Record<string, Box>>({});
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => setReducedMotion(media.matches);
    onChange();
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, []);

  // Lines are drawn from the pills' real positions, so they follow the responsive layout.
  useLayoutEffect(() => {
    const element = box.current;
    if (!element) return;
    // Layout offsets ignore the 3D tilt, so the lines match the pills on the card's own plane.
    const measure = () => {
      const next: Record<string, Box> = {};
      element.querySelectorAll<HTMLElement>('[data-node]').forEach((pill) => {
        let left = 0;
        let top = 0;
        for (let node: HTMLElement | null = pill; node && node !== element; node = node.offsetParent as HTMLElement | null) {
          left += node.offsetLeft;
          top += node.offsetTop;
        }
        const width = pill.offsetWidth;
        const height = pill.offsetHeight;
        next[pill.dataset.node!] = {
          left,
          right: left + width,
          top,
          bottom: top + height,
          cx: left + width / 2,
          cy: top + height / 2,
        };
      });
      setBoxes(next);
      setSize({ width: element.offsetWidth, height: element.offsetHeight });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    document.fonts?.ready.then(measure);
    return () => observer.disconnect();
  }, []);

  const lit = new Set(active ?? []);
  const litNodes = new Set([...lit].flatMap((key) => key.split('-')));
  const stateOf = (id: string) => (!active || lit.size === 0 ? 'rest' : litNodes.has(id) ? 'on' : 'off');

  const column = (side: MapNode['side']) => nodes.filter((node) => node.side === side);
  const hub = nodes.find((node) => node.side === 'hub')!;

  // The card leans back a little and tilts a few degrees toward the pointer. Touch and reduced
  // motion keep the resting tilt. The style changes directly, so pointer moves cause no re-render.
  const stage = useRef<HTMLDivElement>(null);
  const tilt = (event: PointerEvent<HTMLDivElement>) => {
    if (reducedMotion || event.pointerType !== 'mouse' || !stage.current) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    stage.current.style.setProperty('--tilt-x', `${(REST_TILT - y * 8).toFixed(2)}deg`);
    stage.current.style.setProperty('--tilt-y', `${(x * 10).toFixed(2)}deg`);
  };
  const settle = () => {
    stage.current?.style.setProperty('--tilt-x', `${REST_TILT}deg`);
    stage.current?.style.setProperty('--tilt-y', '0deg');
  };

  return (
    <figure>
      <div className="relative [perspective:1400px]" onPointerMove={tilt} onPointerLeave={settle}>
        {/* A soft shadow under the card sells the depth. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-12 -bottom-3 h-10 rounded-[50%] bg-ink/10 blur-2xl dark:bg-black/40"
        />
        <div
          ref={stage}
          className="transition-transform duration-300 ease-out [transform-style:preserve-3d] motion-reduce:transition-none"
          style={{
            transform: 'rotateX(var(--tilt-x, 8deg)) rotateY(var(--tilt-y, 0deg))',
            transformOrigin: '50% 60%',
          }}
        >
          <div
            ref={box}
            className="relative rounded-2xl border border-line bg-card px-4 py-7 shadow-[0_1px_2px_rgb(0_0_0/0.04),0_24px_48px_-28px_rgb(0_0_0/0.25)] [transform-style:preserve-3d] sm:px-8 sm:py-9"
          >
            <svg
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
              width={size.width}
              height={size.height}
            >
              {edges.map(([from, to]) => {
                const a = boxes[from];
                const b = boxes[to];
                if (!a || !b) return null;
                const key = `${from}-${to}`;
                const d = from === 'claude' && to === 'motion' ? arc(a, b, boxes[hub.id]) : link(a, b);
                const on = lit.has(key);
                return (
                  <g key={key}>
                    <path
                      d={d}
                      fill="none"
                      stroke={on ? 'var(--hub)' : 'var(--muted)'}
                      strokeOpacity={on ? 1 : active && lit.size > 0 ? 0.15 : 0.32}
                      strokeWidth={on ? 1.75 : 1.25}
                      className="transition-[stroke,stroke-opacity] duration-200 motion-reduce:transition-none"
                    />
                    {on && !reducedMotion && (
                      <circle r="3" fill="var(--hub)">
                        <animateMotion dur="1.6s" repeatCount="indefinite" path={d} />
                      </circle>
                    )}
                  </g>
                );
              })}
            </svg>

            {/* The pills float a little above the card surface. */}
            <div className="relative flex flex-col items-center gap-9 [transform:translateZ(12px)] sm:grid sm:grid-cols-[1fr_auto_1fr] sm:items-center sm:gap-x-8 sm:gap-y-0">
              <div className="flex flex-wrap justify-center gap-2 sm:flex-col sm:items-start sm:gap-3">
                {column('left').map((node) => (
                  <Pill key={node.id} node={node} state={stateOf(node.id)} />
                ))}
              </div>
              <Pill node={hub} state={stateOf(hub.id)} />
              <div className="flex flex-wrap justify-center gap-2 sm:flex-col sm:items-end sm:gap-3">
                {column('right').map((node) => (
                  <Pill key={node.id} node={node} state={stateOf(node.id)} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <figcaption className="mt-5 text-sm text-muted">
        How the pieces connect. Scroll or hover the projects below to trace each path.
      </figcaption>
    </figure>
  );
};
