import { timeline } from '@/content';
import { Section } from './Section';

export const Timeline = () => (
  <Section
    id="timeline"
    index="02 — 2026"
    title="A year at Motion, month by month"
    intro="Four months on infrastructure, then the move to the Runneth AI team in May."
  >
    <ol className="relative">
      {timeline.map((entry, i) => (
        <li key={entry.month} className="relative grid grid-cols-[3.25rem_1fr] gap-x-5 pb-10 last:pb-0 md:grid-cols-[4rem_1fr]">
          {i < timeline.length - 1 && (
            <span aria-hidden="true" className="absolute left-[calc(3.25rem+0.3rem)] top-3 h-full w-px bg-line md:left-[calc(4rem+0.3rem)]" />
          )}
          <span className="pt-0.5 font-mono text-sm text-muted">{entry.month}</span>
          <div className="relative pl-6">
            <span
              aria-hidden="true"
              className={`absolute left-0 top-1.5 size-2.5 -translate-x-[0.05rem] rounded-full border-2 ${
                entry.milestone ? 'border-accent bg-accent' : 'border-line bg-paper'
              }`}
            />
            {entry.milestone && (
              <p className="mb-2 inline-block rounded-full bg-accent/12 px-2.5 py-0.5 font-mono text-[11px] uppercase tracking-[0.12em] text-accent">
                {entry.milestone}
              </p>
            )}
            <h3 className="font-display text-2xl leading-tight">{entry.title}</h3>
            <p className="mt-1.5 max-w-xl text-pretty leading-relaxed text-muted">{entry.body}</p>
          </div>
        </li>
      ))}
    </ol>
  </Section>
);
