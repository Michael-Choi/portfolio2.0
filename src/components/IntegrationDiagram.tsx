import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { edges, nodes, type Group, type MapNode } from '@/content';
import { useMediaQuery } from '@/useMediaQuery';

type Box = { left: number; right: number; top: number; bottom: number; cx: number; cy: number };
type State = 'rest' | 'on' | 'off';

const FILL: Record<Group, string> = {
  hub: 'bg-hub',
  surface: 'bg-surface',
  data: 'bg-data',
  tools: 'bg-tools',
  apps: 'bg-apps',
};

// 24×24 stroke icons. Generic glyphs, not brand logos.
const ICONS: Record<string, string> = {
  claude: 'M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z',
  chatgpt: 'M12 4a8 8 0 0 1 6.9 12L20 20l-4-1.1A8 8 0 1 1 12 4z',
  agents: 'M7 9h10a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2zM12 5v4M9.5 14h.01M14.5 14h.01',
  slack: 'M10 4 8 20M16 4l-2 16M4.5 9h15M4 15h15',
  chat: 'M5 5h14a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H10l-4 3v-3H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z',
  motion: 'M5 20V10M12 20V4M19 20v-7',
  mcp: 'M9 3v5M15 3v5M7 8h10v3a5 5 0 0 1-10 0zM12 16v5',
  apps: 'M4 4h6.5v6.5H4zM13.5 4H20v6.5h-6.5zM4 13.5h6.5V20H4zM13.5 13.5H20V20h-6.5z',
};

/** An S-curve between two cards: sideways between columns, or downward between the tiers on phones. */
function link(a: Box, b: Box, tiers: boolean) {
  if (!tiers) {
    const sx = b.cx > a.cx ? a.right : a.left;
    const ex = b.cx > a.cx ? b.left : b.right;
    const mx = (sx + ex) / 2;
    return `M${sx},${a.cy} C${mx},${a.cy} ${mx},${b.cy} ${ex},${b.cy}`;
  }
  const dy = b.cy - a.cy;
  const sy = dy > 0 ? a.bottom : a.top;
  const ey = dy > 0 ? b.top : b.bottom;
  const my = (sy + ey) / 2;
  return `M${a.cx},${sy} C${a.cx},${my} ${b.cx},${my} ${b.cx},${ey}`;
}

const NodeCard = ({ node, state, className = '' }: { node: MapNode; state: State; className?: string }) => {
  const hub = node.group === 'hub';
  // On phones, a card stacks its icon above a short label, so a row of five fits across the screen.
  const cardClass = `relative rounded-xl border bg-card transition-[opacity,border-color,box-shadow] duration-200 motion-reduce:transition-none ${
    hub
      ? 'inline-flex items-center gap-2.5 whitespace-nowrap border-hub/40 py-1.5 pl-1.5 pr-4 shadow-[0_0_0_5px_color-mix(in_oklab,var(--hub)_12%,transparent),0_12px_28px_-12px_color-mix(in_oklab,var(--hub)_55%,transparent)]'
      : `flex flex-col items-center gap-1 px-1 pb-1.5 pt-2 text-center shadow-[0_1px_2px_rgb(0_0_0/0.05),0_6px_16px_-10px_rgb(0_0_0/0.2)] sm:inline-flex sm:flex-row sm:gap-2.5 sm:whitespace-nowrap sm:py-1.5 sm:pl-1.5 sm:pr-3 sm:text-left ${
          state === 'on' ? 'border-ink/25' : 'border-line'
        }`
  } ${node.href ? 'hover:border-hub' : ''} ${state === 'off' ? 'opacity-40' : ''} ${className}`;
  const size = hub ? 'size-8' : 'size-7';
  const body = (
    <>
      {node.logo ? (
        <img src={node.logo} alt="" className={`shrink-0 rounded-lg ${size}`} />
      ) : (
        <span aria-hidden="true" className={`grid shrink-0 place-items-center rounded-lg text-white ${FILL[node.group]} ${size}`}>
          <svg
            viewBox="0 0 24 24"
            className={hub ? 'size-[18px]' : 'size-4'}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.9"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d={ICONS[node.id]} />
          </svg>
        </span>
      )}
      <span className="leading-tight">
        <span className={`block font-medium ${hub ? 'text-sm' : 'text-[11px] sm:text-[13px]'}`}>{node.label}</span>
        <span className="hidden text-xs text-muted sm:block">{node.kind}</span>
      </span>
    </>
  );
  return node.href ? (
    <a data-node={node.id} href={node.href} target="_blank" rel="noopener noreferrer" className={cardClass}>
      {body}
      <span className="sr-only"> (opens in new tab)</span>
    </a>
  ) : (
    <span data-node={node.id} className={cardClass}>
      {body}
    </span>
  );
};

/** The integrations around Runneth. Highlights the edges in `active` for the current project. */
export const IntegrationDiagram = ({ active, caption }: { active: string[] | null; caption?: string }) => {
  const box = useRef<HTMLDivElement>(null);
  const [boxes, setBoxes] = useState<Record<string, Box>>({});
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [reducedMotion, setReducedMotion] = useState(false);
  // Below Tailwind's sm breakpoint, the diagram stacks in three tiers instead of three columns.
  const tiers = !useMediaQuery('(min-width: 40rem)');

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => setReducedMotion(media.matches);
    onChange();
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, []);

  // Lines follow the cards' real positions, so they track the responsive layout.
  useLayoutEffect(() => {
    const element = box.current;
    if (!element) return;
    const measure = () => {
      const next: Record<string, Box> = {};
      element.querySelectorAll<HTMLElement>('[data-node]').forEach((card) => {
        let left = 0;
        let top = 0;
        for (let node: HTMLElement | null = card; node && node !== element; node = node.offsetParent as HTMLElement | null) {
          left += node.offsetLeft;
          top += node.offsetTop;
        }
        const width = card.offsetWidth;
        const height = card.offsetHeight;
        next[card.dataset.node!] = {
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
  const stateOf = (id: string): State => (lit.size === 0 ? 'rest' : litNodes.has(id) ? 'on' : 'off');
  const column = (side: MapNode['side']) => nodes.filter((node) => node.side === side);

  return (
    <figure>
      <div
        ref={box}
        className="relative rounded-3xl border border-line bg-card px-3 py-5 shadow-[0_1px_2px_rgb(0_0_0/0.04),0_24px_48px_-28px_rgb(0_0_0/0.25)] sm:px-7 sm:py-7"
      >
        {/* A faint dot grid, like a design canvas. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 [background-image:radial-gradient(var(--line)_1.1px,transparent_1.3px)] [background-size:18px_18px] [mask-image:radial-gradient(80%_80%_at_50%_50%,black_40%,transparent_100%)]"
        />

        <svg
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          width={size.width}
          height={size.height}
        >
          <defs>
            <filter id="path-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" />
            </filter>
          </defs>
          {/* At rest, every connection flows. A project narrows the flow to its own connection. */}
          {edges.map(([from, to], index) => {
            const a = boxes[from];
            const b = boxes[to];
            if (!a || !b) return null;
            const key = `${from}-${to}`;
            const d = link(a, b, tiers);
            const on = lit.has(key);
            const flowing = on || lit.size === 0;
            return (
              <g key={key}>
                {on && <path d={d} fill="none" stroke="var(--hub)" strokeOpacity={0.35} strokeWidth={5} filter="url(#path-glow)" />}
                <path
                  d={d}
                  fill="none"
                  stroke={flowing ? 'var(--hub)' : 'var(--muted)'}
                  strokeOpacity={on ? 1 : flowing ? 0.45 : 0.14}
                  strokeWidth={on ? 1.75 : 1.25}
                  strokeLinecap="round"
                  className="transition-[stroke,stroke-opacity] duration-200 motion-reduce:transition-none"
                />
                {flowing && !reducedMotion && (
                  <circle r={on ? 3.5 : 2.75} fill="var(--hub)" stroke="var(--card)" strokeWidth="1.5">
                    {/* A negative start staggers the dots, so they do not move in step. */}
                    <animateMotion dur="1.6s" begin={`-${((index * 0.37) % 1.6).toFixed(2)}s`} repeatCount="indefinite" path={d} />
                  </circle>
                )}
              </g>
            );
          })}
        </svg>

        {/* On phones: three tiers, top to bottom. On wider screens: three columns, left to right. */}
        <div className="relative grid gap-10 sm:grid-cols-[auto_1fr_auto] sm:items-center sm:gap-x-6 sm:gap-y-0">
          <div className="flex flex-col gap-2 sm:gap-2.5">
            <p className="mb-1 text-center text-xs font-medium text-muted sm:text-left">Where people ask</p>
            <div className="grid grid-cols-5 gap-1.5 sm:flex sm:flex-col sm:items-start sm:gap-2.5">
              {column('left').map((node) => (
                <NodeCard key={node.id} node={node} state={stateOf(node.id)} />
              ))}
            </div>
          </div>
          {/* The Motion MCP lines run from the assistants to Motion data without Runneth, so Runneth
              stays out of their way: right of center on phones, and a little low on wider screens. */}
          <div className="grid grid-cols-5 sm:mt-14 sm:block sm:justify-self-center">
            {column('center').map((node) => (
              <NodeCard key={node.id} node={node} state={stateOf(node.id)} className="col-span-3 col-start-3 justify-self-center" />
            ))}
          </div>
          <div className="flex flex-col gap-2 sm:gap-2.5">
            <p className="order-last mt-1 text-center text-xs font-medium text-muted sm:order-none sm:mb-1 sm:mt-0 sm:text-right">
              What Runneth reaches
            </p>
            <div className="grid grid-cols-3 gap-1.5 sm:flex sm:flex-col sm:items-end sm:gap-2.5">
              {/* On wider screens, extra space under Motion data lifts it, so the lines from the
                  assistants pass above Runneth. */}
              {column('right').map((node) => (
                <NodeCard key={node.id} node={node} state={stateOf(node.id)} className={node.id === 'motion' ? 'sm:mb-6' : ''} />
              ))}
            </div>
          </div>
        </div>
      </div>
      {caption && <figcaption className="mt-5 text-sm text-muted">{caption}</figcaption>}
    </figure>
  );
};
