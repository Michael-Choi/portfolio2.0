import { alsoShipped, moreWork } from '@/content';
import { Meta, StatCallout } from './Bits';
import { Section } from './Section';

export const MoreWork = () => (
  <Section
    id="more"
    index="02 — Also in production"
    title="Making the agent dependable"
    intro="The work behind the integrations: speed, reliability, and security for customers."
    wide
  >
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {moreWork.map((card) => (
        <article
          key={card.id}
          id={card.id}
          aria-labelledby={`${card.id}-title`}
          className="flex scroll-mt-24 flex-col rounded-2xl border border-line bg-card p-6"
        >
          <Meta tag={card.tag} group={card.group} date={card.date} />
          <h3 id={`${card.id}-title`} className="mt-4 font-display text-xl leading-snug">
            {card.title}
          </h3>
          <p className="mt-2 text-pretty leading-relaxed">{card.what}</p>
          <ul className="mt-4 space-y-1.5 text-[15px] leading-relaxed text-muted">
            {card.bullets.map((bullet) => (
              <li key={bullet} className="flex gap-2.5">
                <span aria-hidden="true" className="mt-[0.7em] h-px w-2.5 shrink-0 bg-muted/60" />
                {bullet}
              </li>
            ))}
          </ul>
          {card.stat && (
            <div className="mt-auto border-t border-line pt-5 [&:not(:first-child)]:mt-6">
              <StatCallout value={card.stat.value} label={card.stat.label} />
            </div>
          )}
        </article>
      ))}
    </div>

    <p className="mt-16 font-mono text-xs uppercase tracking-[0.18em] text-muted">Also shipped</p>
    <ul className="mt-4 divide-y divide-line border-y border-line">
      {alsoShipped.map((item) => (
        <li key={item.tag} className="grid gap-1 py-4 sm:grid-cols-[10rem_1fr] sm:gap-6">
          <span className="font-medium">{item.tag}</span>
          <span className="text-pretty text-muted">{item.text}</span>
        </li>
      ))}
    </ul>
  </Section>
);
