import { HeroCopy } from './HeroCopy';
import { IntegrationMap } from './IntegrationMap';

export const HeroConstellation = () => (
  <section id="top" className="relative overflow-hidden">
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_55%_55%_at_72%_45%,color-mix(in_oklab,var(--accent)_9%,transparent),transparent_70%)]"
    />
    <div className="relative mx-auto grid max-w-6xl gap-8 px-4 pb-16 pt-12 sm:px-6 lg:grid-cols-12 lg:items-center lg:gap-6 lg:pb-24 lg:pt-14">
      <div className="lg:col-span-5">
        <HeroCopy nameClassName="text-[clamp(3.25rem,7vw,5.5rem)] leading-[0.95]" />
      </div>
      <div className="lg:col-span-7">
        <IntegrationMap />
      </div>
    </div>
  </section>
);
