import { useEffect, useRef, useState, type ReactNode } from 'react';
import { ArrowIcon } from '@/components/Icons';
import { IntegrationDiagram } from '@/components/IntegrationDiagram';
import { ThemeToggle } from '@/components/ThemeToggle';
import { diagramCaption, intro, previously, profile, work, workYear, type Rich, type WorkItem } from '@/content';
import { useMediaQuery } from '@/useMediaQuery';

const Heading = ({ children }: { children: ReactNode }) => (
  <h2 className="mb-3 text-sm font-medium text-muted">{children}</h2>
);

/** A link that opens in a new tab and says so to screen readers. */
const External = ({ href, className, children }: { href: string; className?: string; children: ReactNode }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
    {children}
    <span className="sr-only"> (opens in new tab)</span>
  </a>
);

// Tailwind's xl breakpoint. At this width and up, the diagram moves to its own column on the right.
const WIDE = '(min-width: 80rem)';

const RichText = ({ parts }: { parts: Rich }) => (
  <>
    {parts.map((part, index) =>
      typeof part === 'string' ? (
        part
      ) : (
        <External key={index} href={part.href} className="text-ink underline decoration-line underline-offset-4 hover:decoration-ink">
          {part.text}
        </External>
      ),
    )}
  </>
);

const rowClass =
  'group -mx-3 flex items-baseline justify-between gap-6 rounded-xl px-3 py-3 transition-colors hover:bg-ink/[0.035]';

const WorkRow = ({ item, active }: { item: WorkItem; active: boolean }) => {
  const body = (
    <>
      <span className="min-w-0">
        <span className="flex items-center gap-1 font-medium">
          {item.title}
          {item.href && (
            <ArrowIcon className="size-3.5 text-muted transition-transform group-hover:-translate-y-px group-hover:translate-x-px" />
          )}
        </span>
        <span className="mt-0.5 block text-pretty text-muted">{item.text}</span>
      </span>
    </>
  );
  const className = `${rowClass} ${active ? 'bg-ink/[0.035]' : ''}`;
  return item.href ? (
    <External href={item.href} className={className}>
      {body}
    </External>
  ) : (
    // Focusable, so keyboard users can trace this project's path too.
    <div tabIndex={0} className={className}>
      {body}
    </div>
  );
};

export default function App() {
  // The project under the pointer or keyboard focus traces its path in the diagram. Otherwise the
  // project that scrolls past a set line does, so scrolling the list walks through the paths.
  const [hovered, setHovered] = useState<number | null>(null);
  const [scrolled, setScrolled] = useState<number | null>(null);
  const rows = useRef<(HTMLLIElement | null)[]>([]);
  const wide = useMediaQuery(WIDE);

  // In one column, a thin divider shows under the diagram while it is pinned. A sentinel just
  // above the pinned block leaves the viewport at the moment the block sticks.
  const sentinel = useRef<HTMLDivElement>(null);
  const [pinned, setPinned] = useState(false);
  const pinBlock = useRef<HTMLDivElement>(null);

  // In one column, the active project is the first one whose top shows below the pinned diagram.
  // In two columns, it is the last one whose top has passed a line a little above the middle of
  // the screen, so the last project can reach the line before the page ends. Until the diagram
  // pins in one column, and at the very top in two columns, no project is active and the diagram
  // rests.
  useEffect(() => {
    const update = () => {
      const pinnedNow = (sentinel.current?.getBoundingClientRect().top ?? 0) < 0;
      if (wide ? window.scrollY < 1 : !pinnedNow) {
        setScrolled(null);
        return;
      }
      if (!wide) {
        const edge = (pinBlock.current?.getBoundingClientRect().bottom ?? 0) - 8;
        const first = rows.current.findIndex((row) => row && row.getBoundingClientRect().top >= edge);
        setScrolled(first === -1 ? rows.current.length - 1 : first);
        return;
      }
      const line = window.innerHeight * 0.45;
      let index: number | null = null;
      for (const [i, row] of rows.current.entries()) {
        if (row && row.getBoundingClientRect().top <= line) index = i;
      }
      setScrolled(index);
    };
    // Browsers fire scroll events at most once per frame, so this needs no extra throttle.
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [wide]);

  useEffect(() => {
    const element = sentinel.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) =>
      setPinned(!entry.isIntersecting && entry.boundingClientRect.top < 0),
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const activeIndex = hovered ?? scrolled;
  const active = activeIndex === null ? null : work[activeIndex].path;

  return (
    <main className="mx-auto max-w-[640px] px-6 pb-20 pt-20 text-[15px] leading-relaxed sm:pt-28 xl:grid xl:max-w-[1240px] xl:grid-cols-[minmax(0,1fr)_592px] xl:gap-x-[72px] xl:px-10">
      <header className="flex items-start justify-between gap-6 xl:col-span-2">
        <div>
          <h1 className="font-medium">{profile.name}</h1>
          <p className="text-muted">
            {profile.role} · {profile.location}
          </p>
        </div>
        <ThemeToggle />
      </header>

      <section aria-label="About" className="mt-12 space-y-4 xl:col-start-1">
        <p className="text-pretty text-[17px] leading-relaxed">
          <RichText parts={intro[0]} />
        </p>
        <p className="text-pretty text-muted">
          <RichText parts={intro[1]} />
        </p>
      </section>

      {/* In one column, the diagram pins above the list while the projects scroll under it. In two
          columns, it starts level with the list on the right, pins while the list scrolls, and leaves
          with the end of the list. */}
      {/* In one column, the list reaches 10rem into the section's bottom padding. A pinned block
          stays out of its parent's padding, so the diagram lets go while the last project still
          shows below it. */}
      <section aria-labelledby="work-title" className="mt-10 max-xl:pb-40 xl:col-span-2 xl:grid xl:grid-cols-subgrid">
        <div ref={sentinel} aria-hidden="true" className="h-px xl:hidden" />
        <div
          ref={pinBlock}
          className={`sticky top-0 z-10 -mx-6 bg-paper px-6 py-4 transition-[box-shadow] duration-200 sm:py-6 xl:top-16 xl:col-start-2 xl:row-start-1 xl:mx-0 xl:self-start xl:p-0 ${
            pinned && !wide ? 'shadow-[0_1px_0_var(--line)]' : ''
          }`}
        >
          <IntegrationDiagram active={active} caption={wide ? diagramCaption : undefined} />
        </div>
        {/* In one column, the caption sits outside the pinned block, so it scrolls away. */}
        {!wide && <p className="mb-10 text-sm text-muted">{diagramCaption}</p>}
        <div className="min-w-0 max-xl:-mb-40 xl:col-start-1 xl:row-start-1">
          <Heading>
            <span className="flex items-baseline justify-between gap-6">
              <span id="work-title">Selected work at Motion</span>
              <span className="font-normal tabular-nums">{workYear}</span>
            </span>
          </Heading>
          <ul onPointerLeave={() => setHovered(null)}>
            {work.map((item, index) => (
              <li
                key={item.title}
                data-index={index}
                ref={(row) => {
                  rows.current[index] = row;
                }}
                onPointerEnter={(event) => event.pointerType === 'mouse' && setHovered(index)}
                onFocus={() => setHovered(index)}
                onBlur={() => setHovered(null)}
              >
                <WorkRow item={item} active={index === activeIndex} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="previously-title" className="mt-14 xl:col-start-1">
        <Heading>
          <span id="previously-title">Previously</span>
        </Heading>
        <ul className="space-y-3">
          {previously.map((job) => (
            <li key={job.company} className="flex items-baseline justify-between gap-6">
              <span className="min-w-0">
                <span className="font-medium">{job.company}</span>
                <span className="text-muted"> · {job.role}</span>
                <span className="block text-sm text-muted">{job.note}</span>
              </span>
              <span className="shrink-0 tabular-nums text-muted">{job.years}</span>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="contact-title" className="mt-14 xl:col-start-1">
        <Heading>
          <span id="contact-title">Get in touch</span>
        </Heading>
        <p className="flex flex-wrap gap-x-6 gap-y-2">
          <a href={`mailto:${profile.email}`} className="font-medium underline decoration-line underline-offset-4 hover:decoration-ink">
            {profile.email}
          </a>
          <External href={profile.linkedin} className="underline decoration-line underline-offset-4 hover:decoration-ink">
            LinkedIn
          </External>
          <External href={profile.x} className="underline decoration-line underline-offset-4 hover:decoration-ink">
            X
          </External>
          <External href={profile.github} className="underline decoration-line underline-offset-4 hover:decoration-ink">
            GitHub
          </External>
        </p>
      </section>

      <footer className="mt-20 text-sm text-muted xl:col-start-1">© {new Date().getFullYear()} {profile.name}</footer>
    </main>
  );
}
