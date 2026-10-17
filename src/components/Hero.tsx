import { hero, profile, proof } from '@/content';
import { ExternalLink } from './Bits';
import { Monogram } from './Header';
import { LinkedInIcon, MailIcon } from './Icons';

export const Hero = () => (
  <section id="top" aria-labelledby="hero-title" className="relative overflow-hidden">
    <div aria-hidden="true" className="hero-backdrop pointer-events-none absolute inset-x-0 top-0 h-[640px]" />

    <div className="relative mx-auto max-w-6xl px-4 pt-16 text-center sm:px-6 md:pt-24">
      <div className="inline-flex items-center gap-3 text-left">
        <Monogram className="size-11 text-sm" />
        <div>
          <p className="font-medium leading-tight">{profile.name}</p>
          <p className="text-sm leading-tight text-muted">
            {profile.role} at {profile.company} · {profile.location}
          </p>
        </div>
      </div>

      <h1
        id="hero-title"
        className="mx-auto mt-8 max-w-4xl text-balance font-display text-[clamp(2.5rem,5.6vw,4.5rem)] leading-[1.02]"
      >
        {hero.statement}
      </h1>

      <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-muted">
        {hero.intro.map((segment) =>
          segment.href ? (
            <ExternalLink
              key={segment.text}
              href={segment.href}
              className="font-medium text-ink underline decoration-ink/20 underline-offset-4 transition-colors hover:decoration-ink"
            >
              {segment.text}
            </ExternalLink>
          ) : (
            <span key={segment.text}>{segment.text}</span>
          ),
        )}
      </p>

      <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
        <a
          href={`mailto:${profile.email}`}
          className="inline-flex h-11 items-center gap-2 rounded-full bg-ink px-6 text-[15px] font-medium text-card shadow-sm transition-opacity hover:opacity-85"
        >
          <MailIcon className="size-4" />
          Email me
        </a>
        <ExternalLink
          href={profile.linkedin}
          className="inline-flex h-11 items-center gap-2 rounded-full border border-line bg-card px-5 text-[15px] font-medium shadow-sm transition-colors hover:border-ink/25"
        >
          <LinkedInIcon className="size-4" />
          LinkedIn
        </ExternalLink>
      </div>

      <a
        href={hero.latest.href}
        className="mt-6 inline-flex items-center gap-2 rounded-full border border-line bg-card/80 py-1 pl-1 pr-3 text-sm text-muted transition-colors hover:border-ink/25 hover:text-ink"
      >
        <span className="rounded-full bg-accent-text px-2 py-0.5 text-xs font-medium text-white">New</span>
        Runneth MCP is public
        <span aria-hidden="true">→</span>
      </a>
    </div>

    {/* Outcomes, each linked to the work it comes from. */}
    <div className="relative mx-auto mt-16 max-w-5xl px-4 sm:px-6">
      <ul className="grid grid-cols-2 overflow-hidden rounded-2xl border border-line bg-card shadow-[0_1px_2px_rgb(12_13_16/0.04)] lg:grid-cols-4">
        {proof.map((item, index) => (
          <li
            key={item.value}
            className={`border-line ${index % 2 === 1 ? 'border-l' : ''} ${index >= 2 ? 'border-t lg:border-t-0' : ''} ${
              index === 2 ? 'lg:border-l' : ''
            }`}
          >
            <a href={item.href} className="group flex h-full flex-col gap-2 p-6 transition-colors hover:bg-paper/70">
              <span className="font-display text-[2rem] leading-none tabular-nums">{item.value}</span>
              <span className="text-sm leading-snug text-muted transition-colors group-hover:text-ink">{item.label}</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  </section>
);
