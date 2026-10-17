import { experience, type Role } from '@/content';
import { Section } from './Section';

const Points = ({ points }: { points: string[] }) => (
  <ul className="space-y-2">
    {points.map((point) => (
      <li key={point} className="relative pl-5 text-pretty leading-relaxed text-muted">
        <span aria-hidden="true" className="absolute left-0 top-[0.7em] h-px w-2.5 bg-muted/60" />
        {point}
      </li>
    ))}
  </ul>
);

const RoleRow = ({ role }: { role: Role }) => (
  <div className="grid gap-2 md:grid-cols-[1fr_auto] md:gap-x-6">
    <h4 className="font-medium">{role.title}</h4>
    <p className="font-mono text-xs text-muted md:pt-1 md:text-right">{role.dates}</p>
    {role.points && (
      <div className="mt-1 md:col-span-2">
        <Points points={role.points} />
      </div>
    )}
  </div>
);

export const Experience = () => (
  <Section
    id="experience"
    index="03 — Experience"
    title="Where I have worked"
    intro="Seven years of production software. TravelBank and BrokerBay were both acquired."
    className="defer-render"
  >
    <div className="space-y-16">
      {experience.map((job) => (
        <article key={job.company} aria-labelledby={`job-${job.company}`}>
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 border-b border-line pb-3">
            <h3 id={`job-${job.company}`} className="font-display text-3xl">
              {job.company}
            </h3>
            <span className="font-mono text-xs text-muted">{job.years}</span>
            {job.note && <span className="font-mono text-xs text-muted">· {job.note}</span>}
          </div>
          <p className="mt-3 text-muted">{job.summary}</p>
          <div className="mt-6 space-y-6">
            {job.roles.map((role) => (
              <RoleRow key={role.title} role={role} />
            ))}
          </div>
          {job.points && (
            <div className="mt-6">
              <Points points={job.points} />
            </div>
          )}
          {job.strip && (
            <div className="mt-8 rounded-2xl border border-line bg-card p-5">
              <h4 className="font-mono text-xs uppercase tracking-[0.18em] text-muted">2026 at {job.company}</h4>
              <ol className="mt-3 grid gap-x-8 sm:grid-cols-2">
                {job.strip.map((entry) => (
                  <li key={entry.month} className="flex gap-4 border-b border-line py-2 text-sm last:border-0 sm:[&:nth-last-child(2)]:border-0">
                    <span className="w-8 shrink-0 font-mono text-xs leading-5 text-muted">{entry.month}</span>
                    <span className={entry.milestone ? 'font-medium text-accent-text' : ''}>{entry.title}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </article>
      ))}
    </div>
  </Section>
);
