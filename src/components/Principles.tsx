import { principles, recognition } from '@/content';
import { Section } from './Section';

export const Principles = () => (
  <Section id="principles" eyebrow="Principles" title="How I work" className="defer-render">
    <ol className="divide-y divide-line border-y border-line">
      {principles.map((item, i) => (
        <li key={item.title} className="grid gap-1 py-5 sm:grid-cols-[2.5rem_14rem_1fr] sm:gap-6">
          <span className="text-sm tabular-nums leading-7 text-muted">{String(i + 1).padStart(2, '0')}</span>
          <h3 className="font-display text-xl leading-7">{item.title}</h3>
          <p className="text-pretty leading-7 text-muted">{item.body}</p>
        </li>
      ))}
    </ol>
    <p className="mt-10 flex gap-3 text-pretty text-lg leading-relaxed">
      <span aria-hidden="true" className="mt-[0.6em] size-2 shrink-0 rounded-full bg-hub" />
      {recognition}
    </p>
  </Section>
);
