import { principles } from '@/content';
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
  </Section>
);
