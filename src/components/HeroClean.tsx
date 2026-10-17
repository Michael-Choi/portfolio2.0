import { HeroCopy } from './HeroCopy';
import { IntegrationMap } from './IntegrationMap';

export const HeroClean = () => (
  <section id="top" className="relative overflow-hidden">
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-[radial-gradient(ellipse_55%_60%_at_50%_80%,color-mix(in_oklab,var(--accent)_8%,transparent),transparent_70%)]"
    />
    <div className="relative mx-auto max-w-6xl px-4 pb-20 pt-14 sm:px-6 md:pb-28 md:pt-20">
      <a
        href="#work"
        className="mx-auto mb-8 flex w-fit items-center gap-2 rounded-full border border-line bg-card py-1 pl-1 pr-3 text-sm shadow-sm transition-colors hover:border-accent/50"
      >
        <span className="rounded-full bg-accent px-2 py-0.5 text-xs font-medium text-accent-ink">New</span>
        Runneth MCP is public
        <span aria-hidden="true" className="text-muted">
          →
        </span>
      </a>
      <HeroCopy align="center" nameClassName="text-[clamp(3.5rem,10vw,7.5rem)] leading-[0.9]" />
      <div className="mx-auto mt-14 max-w-5xl md:mt-16">
        <IntegrationMap light framed />
      </div>
    </div>
  </section>
);
