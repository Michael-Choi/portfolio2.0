import { hero, profile, proof } from '@/content';
import { ExternalLink } from './Bits';
import { LinkedInIcon, MailIcon } from './Icons';

export const Hero = () => (
  <section id="top" aria-labelledby="hero-title">
    <div className="mx-auto max-w-6xl px-4 pt-14 sm:px-6 md:pt-20">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-sm text-muted">
        <span>
          {profile.name} · {profile.role}, {profile.company} · {profile.location}
        </span>
        <a
          href={hero.latest.href}
          className="text-accent-text underline decoration-accent/40 underline-offset-4 hover:decoration-accent"
        >
          {hero.latest.text} →
        </a>
      </div>

      <h1
        id="hero-title"
        className="mt-6 max-w-4xl text-balance font-display text-[clamp(2.25rem,4.5vw,3.75rem)] leading-[1.04]"
      >
        {hero.statement}
      </h1>

      <p className="mt-6 max-w-2xl text-pretty text-[17px] leading-relaxed text-muted">
        {hero.intro.map((segment) =>
          segment.href ? (
            <ExternalLink
              key={segment.text}
              href={segment.href}
              className="text-ink underline decoration-line underline-offset-4 hover:decoration-ink"
            >
              {segment.text}
            </ExternalLink>
          ) : (
            <span key={segment.text}>{segment.text}</span>
          ),
        )}
      </p>

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <a
          href={`mailto:${profile.email}`}
          className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-[15px] font-medium text-card transition-opacity hover:opacity-85"
        >
          <MailIcon className="size-4" />
          Email me
        </a>
        <ExternalLink
          href={profile.linkedin}
          className="inline-flex items-center gap-2 rounded-full border border-line bg-card px-4 py-2.5 text-[15px] transition-colors hover:border-ink/40"
        >
          <LinkedInIcon className="size-4" />
          LinkedIn
        </ExternalLink>
        <a href="#work" className="px-2 py-2.5 text-[15px] text-muted underline-offset-4 hover:text-ink hover:underline">
          See the work ↓
        </a>
      </div>
    </div>

    {/* Outcomes, each linked to the work it comes from. */}
    <div className="mx-auto mt-14 max-w-6xl px-4 sm:px-6">
      <ul className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line lg:grid-cols-4">
        {proof.map((item) => (
          <li key={item.value} className="bg-card">
            <a href={item.href} className="group flex h-full flex-col gap-2 p-5 transition-colors hover:bg-paper md:p-6">
              <span className="font-display text-[1.75rem] leading-none md:text-[2rem]">{item.value}</span>
              <span className="text-sm leading-snug text-muted group-hover:text-ink">{item.label}</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  </section>
);
