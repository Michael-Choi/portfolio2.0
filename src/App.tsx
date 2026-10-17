import { useEffect, useRef, useState, type ReactNode } from 'react';
import { ArrowIcon } from '@/components/Icons';
import { IntegrationDiagram } from '@/components/IntegrationDiagram';
import { intro, previously, profile, work, type WorkItem } from '@/content';

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
      <span className="shrink-0 tabular-nums text-muted">{item.year}</span>
    </>
  );
  const className = `${rowClass} ${active ? 'bg-ink/[0.035]' : ''}`;
  return item.href ? (
    <External href={item.href} className={className}>
      {body}
    </External>
  ) : (
    <div className={className}>{body}</div>
  );
};

export default function App() {
  // The project under the pointer traces its path in the diagram. Without a pointer, the
  // project in the middle of the screen does, so scrolling the list walks through the paths.
  const [hovered, setHovered] = useState<number | null>(null);
  const [scrolled, setScrolled] = useState<number | null>(null);
  const rows = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entering = entries.filter((entry) => entry.isIntersecting);
        if (entering.length > 0) {
          setScrolled(Number((entering[0].target as HTMLElement).dataset.index));
          return;
        }
        // Scrolled back above the list: the diagram returns to its resting state.
        const first = entries.find((entry) => (entry.target as HTMLElement).dataset.index === '0');
        if (first && first.boundingClientRect.top > window.innerHeight / 2) setScrolled(null);
      },
      // A band below the pinned diagram.
      { rootMargin: '-55% 0px -35% 0px', threshold: 0 },
    );
    rows.current.forEach((row) => row && observer.observe(row));
    return () => observer.disconnect();
  }, []);

  // A thin divider appears under the diagram only while it is pinned. A sentinel just above the
  // pinned block leaves the viewport at the moment the block sticks.
  const sentinel = useRef<HTMLDivElement>(null);
  const [pinned, setPinned] = useState(false);
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
    <main className="mx-auto max-w-[640px] px-6 pb-20 pt-20 text-[15px] leading-relaxed sm:pt-28">
      <header>
        <h1 className="font-medium">{profile.name}</h1>
        <p className="text-muted">
          {profile.role} · {profile.location}
        </p>
      </header>

      <section aria-label="About" className="mt-12 space-y-4">
        <p className="text-pretty text-[17px] leading-relaxed">{intro[0]}</p>
        <p className="text-pretty text-muted">{intro[1]}</p>
      </section>

      <section aria-labelledby="work-title" className="mt-10">
        {/* The diagram stays pinned while the projects scroll under it. */}
        <div ref={sentinel} aria-hidden="true" className="h-px" />
        <div
          className={`sticky top-0 z-10 -mx-6 bg-paper px-6 pb-6 pt-6 transition-[box-shadow] duration-200 ${
            pinned ? 'shadow-[0_1px_0_var(--line)]' : ''
          }`}
        >
          <IntegrationDiagram active={active} />
        </div>
        <div className="mt-4" />
        <Heading>
          <span id="work-title">Selected work</span>
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
      </section>

      <section aria-labelledby="previously-title" className="mt-14">
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

      <section aria-labelledby="contact-title" className="mt-14">
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

      <footer className="mt-20 text-sm text-muted">© {new Date().getFullYear()} {profile.name}</footer>
    </main>
  );
}
