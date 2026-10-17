import { HeroCopy } from './HeroCopy';
import { RunLog } from './RunLog';

export const HeroPaper = () => (
  <section id="top" className="relative overflow-hidden">
    <div className="hero-grid pointer-events-none absolute inset-0" aria-hidden="true" />
    <div className="relative mx-auto grid max-w-6xl gap-12 px-4 pb-20 pt-14 sm:px-6 md:pb-28 md:pt-24 lg:grid-cols-12 lg:items-end lg:gap-10">
      <div className="lg:col-span-7">
        <HeroCopy nameClassName="text-[clamp(3.5rem,9vw,7.5rem)] leading-[0.92]" />
      </div>
      <div className="max-w-xl lg:col-span-5 lg:max-w-none">
        <RunLog />
      </div>
    </div>
  </section>
);
