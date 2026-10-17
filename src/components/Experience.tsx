import { experience } from '@/content';
import { Section } from './Section';

export const Experience = () => (
  <Section
    id="experience"
    index="03 — Experience"
    title="Where I have worked"
    intro="Seven years of production software. TravelBank and BrokerBay were both acquired."
  >
    <div className="space-y-14">
      {experience.map((job) => (
        <article key={job.company}>
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 border-b border-line pb-3">
            <h3 className="font-display text-3xl">{job.company}</h3>
            {job.note && <span className="font-mono text-xs text-muted">{job.note}</span>}
          </div>
          <p className="mt-3 text-muted">{job.summary}</p>
          <div className="mt-6 space-y-8">
            {job.roles.map((role) => (
              <div key={role.title} className="grid gap-2 md:grid-cols-[1fr_auto] md:gap-x-6">
                <h4 className="font-medium">{role.title}</h4>
                <p className="font-mono text-xs text-muted md:pt-1 md:text-right">{role.dates}</p>
                <ul className="mt-1 space-y-2 md:col-span-2">
                  {role.points.map((point) => (
                    <li key={point} className="relative pl-5 text-pretty leading-relaxed text-muted">
                      <span aria-hidden="true" className="absolute left-0 top-[0.7em] h-px w-2.5 bg-muted/60" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </article>
      ))}
    </div>
  </Section>
);
