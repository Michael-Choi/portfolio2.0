import { AppGlobe } from './AppGlobe';
import { HeroCopy } from './HeroCopy';

export const HeroGlobe = () => (
  <section id="top" className="relative overflow-hidden">
    <div className="mx-auto max-w-6xl px-4 pt-14 sm:px-6 md:pt-20">
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
    </div>
    <div className="mt-6">
      <AppGlobe />
    </div>
  </section>
);
