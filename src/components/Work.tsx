import { integrationWork, productWork, type Feature } from '@/content';
import { Section } from './Section';

const FeatureCard = ({ feature, large = false }: { feature: Feature; large?: boolean }) => (
  <article className="flex flex-col rounded-2xl border border-line bg-card p-6 md:p-7">
    <div className="flex items-center justify-between gap-3 font-mono text-[11px] uppercase tracking-[0.16em]">
      <span className="text-accent">{feature.tag}</span>
      <span className="text-muted">{feature.shipped}</span>
    </div>
    <h3 className={`mt-4 font-display leading-tight ${large ? 'text-3xl md:text-[2.1rem]' : 'text-2xl'}`}>
      {feature.title}
    </h3>
    <p className="mt-3 text-pretty leading-relaxed text-muted">{feature.body}</p>
    <p className="mt-auto flex gap-3 border-t border-line pt-4 text-pretty text-sm leading-relaxed [&:not(:first-child)]:mt-6">
      <span aria-hidden="true" className="mt-[0.45em] size-1.5 shrink-0 rounded-full bg-accent" />
      <span>
        <span className="sr-only">Impact: </span>
        {feature.impact}
      </span>
    </p>
  </article>
);

export const Work = () => (
  <Section
    id="work"
    index="01 — What I shipped"
    title="Features in production"
    intro="All of this is in production at Motion. Most of it answers one question: how does an AI agent reach the tools and data that people already use?"
    wide
  >
    <h3 className="font-mono text-xs uppercase tracking-[0.18em] text-muted">MCP & integrations</h3>
    <div className="mt-4 grid gap-4 md:grid-cols-2">
      {integrationWork.map((feature) => (
        <FeatureCard key={feature.title} feature={feature} large />
      ))}
    </div>

    <h3 className="mt-14 font-mono text-xs uppercase tracking-[0.18em] text-muted">Agent features</h3>
    <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {productWork.map((feature) => (
        <FeatureCard key={feature.title} feature={feature} />
      ))}
    </div>
  </Section>
);
