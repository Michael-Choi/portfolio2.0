import { useEffect, useMemo, useRef, useState, type FocusEvent } from 'react';
import { mapNodes, story, type StoryStep } from '@/content';
import { useMediaQuery } from '@/hooks';
import { pathWords } from '@/groups';
import type { MapScenario } from '@/three/integrationMap';
import { ExternalLink, Meta, StatCallout } from './Bits';
import { MapCanvas } from './MapCanvas';
import { PathGlyph } from './PathGlyph';

const toScenario = (step: StoryStep | undefined): MapScenario | null =>
  step ? { path: step.path, yaw: step.yaw } : null;

// Screen readers get the map in words, because the canvas and poster are hidden from them.
const description = `The map shows ${mapNodes
  .map((node) => `${node.label}: ${node.body}`)
  .join('; ')}. The four request paths are: ${story
  .map((step) => `${step.edgeLabel}, ${pathWords(step.path)}`)
  .join('; ')}.`;

const StepBody = ({ step, headingId }: { step: StoryStep; headingId: string }) => (
  <div>
    <Meta tag={step.tag} group={step.group} date={step.date} />
    <h3 id={headingId} className="mt-4 font-display text-[1.75rem] leading-tight">
      {step.title}
    </h3>
    <p className="mt-3 text-pretty text-[17px] leading-relaxed">{step.what}</p>
    <p className="mt-5 font-mono text-xs uppercase tracking-[0.14em] text-muted">My part</p>
    <ul className="mt-2 space-y-1.5 text-[15px] leading-relaxed text-muted">
      {step.bullets.map((bullet) => (
        <li key={bullet} className="flex gap-2.5">
          <span aria-hidden="true" className="mt-[0.7em] h-px w-2.5 shrink-0 bg-muted/60" />
          {bullet}
        </li>
      ))}
    </ul>
    {step.stat && (
      <div className="mt-6">
        <StatCallout value={step.stat.value} label={step.stat.label} />
      </div>
    )}
    {step.links && (
      <p className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm">
        {step.links.map((link) => (
          <ExternalLink
            key={link.href}
            href={link.href}
            className="font-medium text-accent-text underline decoration-accent/40 underline-offset-4 hover:decoration-accent"
          >
            {link.label} ↗
          </ExternalLink>
        ))}
      </p>
    )}
    <p className="sr-only">Request path: {pathWords(step.path)}.</p>
  </div>
);

/** Desktop: the map stays pinned while the four steps scroll past it. */
const Pinned = () => {
  const [active, setActive] = useState(-1);
  const steps = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    // A step becomes active when it enters the middle 20% of the viewport. Leaving does
    // nothing, so the last step stays active between steps and after the end.
    const observer = new IntersectionObserver(
      (entries) => {
        const entering = entries.filter((entry) => entry.isIntersecting);
        if (entering.length === 0) return;
        const center = window.innerHeight / 2;
        const distance = (entry: IntersectionObserverEntry) =>
          Math.abs(entry.boundingClientRect.top + entry.boundingClientRect.height / 2 - center);
        const nearest = entering.reduce((best, entry) => (distance(entry) < distance(best) ? entry : best));
        setActive(Number((nearest.target as HTMLElement).dataset.step));
      },
      { rootMargin: '-40% 0px -40% 0px', threshold: 0 },
    );
    steps.current.forEach((element) => element && observer.observe(element));
    return () => observer.disconnect();
  }, []);

  // Keyboard users who tab into a step see its path too.
  const onFocus = (event: FocusEvent<HTMLDivElement>) => {
    const step = (event.target as HTMLElement).closest<HTMLElement>('[data-step]');
    if (step) setActive(Number(step.dataset.step));
  };

  const current = story[active];
  const scenario = useMemo(() => toScenario(current), [current]);

  return (
    <div className="mt-12 grid grid-cols-12 gap-10">
      <div className="col-span-5" onFocus={onFocus}>
        {story.map((step, index) => (
          <article
            key={step.id}
            id={step.id}
            data-step={index}
            ref={(element) => {
              steps.current[index] = element;
            }}
            aria-labelledby={`${step.id}-title`}
            className={`flex min-h-[70svh] scroll-mt-24 items-center ${index === story.length - 1 ? 'pb-[20svh]' : ''}`}
          >
            <div
              className={`border-l-2 pl-6 transition-colors duration-300 motion-reduce:transition-none ${
                index === active ? 'border-hub' : 'border-line'
              }`}
            >
              <StepBody step={step} headingId={`${step.id}-title`} />
            </div>
          </article>
        ))}
      </div>
      <div className="col-span-7">
        <div className="sticky top-20 flex h-[min(calc(100svh-96px),720px)] flex-col overflow-hidden rounded-3xl border border-line bg-card shadow-[0_30px_80px_-40px_rgba(12,13,16,0.3)]">
          <div className="flex h-12 shrink-0 items-center gap-1 border-b border-line px-3">
            {story.map((step, index) => (
              <button
                key={step.id}
                type="button"
                aria-current={index === active ? 'step' : undefined}
                onClick={() => document.getElementById(step.id)?.scrollIntoView({ block: 'center' })}
                className="rounded-full px-3 py-1.5 font-mono text-xs text-muted transition-colors hover:bg-paper hover:text-ink aria-[current=step]:bg-ink aria-[current=step]:text-card"
              >
                {step.fig} {step.tag}
              </button>
            ))}
          </div>
          <div aria-hidden="true" className="relative min-h-0 flex-1">
            <MapCanvas scenario={scenario} />
          </div>
          <div className="flex h-14 shrink-0 items-center gap-3 border-t border-line px-5 font-mono text-xs text-muted">
            {current ? (
              <>
                <span className="shrink-0 whitespace-nowrap rounded-full bg-accent-text px-2.5 py-1 font-medium text-white">
                  {current.edgeLabel}
                </span>
                <span className="truncate">{pathWords(current.path)}</span>
              </>
            ) : (
              <span>Scroll to follow each request path.</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

/** Phones and tablets: a compact map with tabs, then the four steps as cards. */
const Stacked = () => {
  const [active, setActive] = useState(0);
  const [touched, setTouched] = useState(false);
  const map = useRef<HTMLDivElement>(null);
  const current = story[active];
  const scenario = useMemo(() => toScenario(current), [current]);

  const select = (index: number, scroll = false) => {
    setTouched(true);
    setActive(index);
    if (scroll) map.current?.scrollIntoView({ block: 'nearest' });
  };

  return (
    <div className="mt-10">
      <div ref={map} className="scroll-mt-20 overflow-hidden rounded-2xl border border-line bg-card">
        <p className="px-4 pt-3 font-mono text-xs text-muted">Tap a path</p>
        <div role="group" aria-label="Request paths" className="tab-strip flex gap-2 overflow-x-auto px-4 pb-3 pt-2">
          {story.map((step, index) => (
            <button
              key={step.id}
              type="button"
              aria-pressed={index === active}
              onClick={() => select(index)}
              className="h-9 shrink-0 rounded-full border border-line px-3 font-mono text-xs text-muted aria-pressed:border-ink aria-pressed:bg-ink aria-pressed:text-card"
            >
              {step.fig} {step.tag}
            </button>
          ))}
        </div>
        <div aria-hidden="true" className="relative h-[280px] border-y border-line">
          <MapCanvas scenario={scenario} compact />
        </div>
        <p aria-live={touched ? 'polite' : 'off'} className="px-4 py-3 font-mono text-xs text-muted">
          <span className="text-accent-text">{current.edgeLabel}</span> · {pathWords(current.path)}
        </p>
      </div>

      <div className="mt-6 space-y-4">
        {story.map((step, index) => (
          <article
            key={step.id}
            id={step.id}
            aria-labelledby={`${step.id}-card-title`}
            className="scroll-mt-20 rounded-2xl border border-line bg-card p-5"
          >
            <StepBody step={step} headingId={`${step.id}-card-title`} />
            <button type="button" onClick={() => select(index, true)} className="mt-5 block w-full text-left">
              <span className="sr-only">Show this path on the map: </span>
              <PathGlyph path={step.path} />
            </button>
          </article>
        ))}
      </div>
    </div>
  );
};

export const IntegrationStory = () => {
  // Pinning needs room. Short or narrow screens get the stacked layout.
  const pinned = useMediaQuery('(min-width: 1024px) and (min-height: 640px)');
  return (
    <section id="work" aria-labelledby="work-title" className="scroll-mt-16">
      <div className="mx-auto max-w-6xl px-4 pt-24 sm:px-6 md:pt-32">
        <header className="max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted">01 — What I built</p>
          <h2 id="work-title" className="mt-3 font-display text-4xl leading-[1.05] md:text-5xl">
            Four ways agents reach the tools people use
          </h2>
          <p className="mt-4 text-pretty text-lg text-muted">
            Each part lights up its path on the map. Together they connect Runneth and Motion to Claude, other
            agents, customer MCP servers, and business apps.
          </p>
          <p className="sr-only">{description}</p>
        </header>
        {pinned ? <Pinned /> : <Stacked />}
      </div>
    </section>
  );
};
