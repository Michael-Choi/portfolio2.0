import { stats } from '@/content';

export const Stats = () => (
  <section aria-label="Impact in numbers" className="border-t border-line">
    <dl className="mx-auto grid max-w-6xl grid-cols-2 gap-px px-4 sm:px-6 lg:grid-cols-4">
      {stats.map((stat) => (
        <div key={stat.label} className="flex flex-col-reverse gap-2 py-8 pr-4 md:py-10">
          <dt className="max-w-[16rem] text-sm leading-snug text-muted">{stat.label}</dt>
          <dd className="font-display text-3xl leading-none text-ink md:text-[2.6rem]">{stat.value}</dd>
        </div>
      ))}
    </dl>
  </section>
);
