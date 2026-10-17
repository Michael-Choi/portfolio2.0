import { principles, recognition } from '@/content';
import { Section } from './Section';

export const Principles = () => (
  <Section id="principles" index="04 — Principles" title="How I work">
    <div className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2">
      {principles.map((item, i) => (
        <article key={item.title} className="bg-card p-6 md:p-7">
          <p className="font-mono text-xs text-muted">{String(i + 1).padStart(2, '0')}</p>
          <h3 className="mt-6 font-display text-2xl leading-tight">{item.title}</h3>
          <p className="mt-2 text-pretty leading-relaxed text-muted">{item.body}</p>
        </article>
      ))}
    </div>
    <h3 className="mt-14 font-mono text-xs uppercase tracking-[0.18em] text-muted">What teammates say</h3>
    <ul className="mt-4 divide-y divide-line border-y border-line">
      {recognition.map((line) => (
        <li key={line} className="flex gap-3 py-4 text-pretty leading-relaxed">
          <span aria-hidden="true" className="mt-[0.55em] size-1.5 shrink-0 rounded-full bg-accent" />
          {line}
        </li>
      ))}
    </ul>
  </Section>
);
