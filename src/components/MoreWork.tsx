import { alsoShipped, moreWork } from '@/content';
import { Checklist, Meta, StatCallout } from './Bits';
import { Section } from './Section';

export const MoreWork = () => (
  <Section
    id="more"
    eyebrow="Also in production"
    title="Making the agent dependable"
    intro="The work behind the integrations: speed, reliability, and security for customers."
    wide
  >
    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
      {moreWork.map((card) => (
        <article
          key={card.id}
          id={card.id}
          aria-labelledby={`${card.id}-title`}
          className="flex scroll-mt-24 flex-col rounded-2xl border border-line bg-card p-7"
        >
          <Meta tag={card.tag} group={card.group} date={card.date} />
          <h3 id={`${card.id}-title`} className="mt-5 text-balance font-display text-[1.375rem] leading-snug">
            {card.title}
          </h3>
          <p className="mt-2.5 text-pretty leading-relaxed text-ink/85">{card.what}</p>
          <div className="mt-5">
            <Checklist items={card.bullets} />
          </div>
          {card.stat && (
            <div className="mt-auto pt-7">
              <div className="border-t border-line pt-5">
                <StatCallout value={card.stat.value} label={card.stat.label} />
              </div>
            </div>
          )}
        </article>
      ))}
    </div>

    <h3 className="mt-16 text-sm font-semibold">Also shipped</h3>
    <ul className="mt-4 divide-y divide-line overflow-hidden rounded-2xl border border-line bg-card">
      {alsoShipped.map((item) => (
        <li key={item.tag} className="grid gap-1 px-6 py-4 sm:grid-cols-[10rem_1fr] sm:gap-6">
          <span className="font-medium">{item.tag}</span>
          <span className="text-pretty text-muted">{item.text}</span>
        </li>
      ))}
    </ul>
  </Section>
);
