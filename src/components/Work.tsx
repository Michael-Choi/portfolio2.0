import { featuredWork, work } from '@/content';
import { Section } from './Section';

const steps = [
  { label: 'Problem', key: 'problem' },
  { label: 'What I did', key: 'action' },
  { label: 'Result', key: 'result' },
] as const;

export const Work = () => (
  <Section
    id="work"
    index="02 — Selected work"
    title="Agents that keep going"
    intro="A few problems I solved at Motion, first on the core platform and then on Runneth."
  >
    <article className="rounded-2xl border border-line bg-card p-6 md:p-8">
      <p className="font-mono text-xs uppercase tracking-[0.18em] text-accent">{featuredWork.tag}</p>
      <h3 className="mt-3 text-balance font-serif text-3xl leading-tight md:text-4xl">{featuredWork.title}</h3>
      <dl className="mt-8 divide-y divide-line border-t border-line">
        {steps.map((step) => (
          <div key={step.key} className="grid gap-2 py-5 last:pb-0 md:grid-cols-[8rem_1fr] md:gap-6">
            <dt className="font-mono text-xs uppercase tracking-[0.14em] text-muted md:pt-1">{step.label}</dt>
            <dd className="max-w-prose text-pretty leading-relaxed">{featuredWork[step.key]}</dd>
          </div>
        ))}
      </dl>
    </article>

    <div className="mt-12 grid gap-x-10 gap-y-12 sm:grid-cols-2">
      {work.map((item) => (
        <article key={item.title} className="border-t border-line pt-5">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted">{item.tag}</p>
          <h3 className="mt-2 font-serif text-2xl leading-tight md:text-[1.7rem]">{item.title}</h3>
          <p className="mt-3 text-pretty leading-relaxed text-muted">{item.body}</p>
        </article>
      ))}
    </div>
  </Section>
);
