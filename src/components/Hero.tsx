import { hero, profile } from '@/content';
import { ArrowIcon, GitHubIcon, LinkedInIcon } from './Icons';
import { RunLog } from './RunLog';

export const Hero = () => (
  <section id="top" className="relative overflow-hidden">
    <div className="hero-grid pointer-events-none absolute inset-0" aria-hidden="true" />
    <div className="relative mx-auto max-w-6xl px-4 pb-20 pt-14 sm:px-6 md:pb-28 md:pt-24">
      <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted">
        {profile.role} · {profile.focus}
      </p>
      <h1 className="mt-5 font-serif text-[clamp(3.5rem,11vw,9rem)] leading-[0.92] tracking-[-0.02em]">
        Michael Choi
      </h1>

      <div className="mt-12 grid gap-12 md:mt-16 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-7">
          <p className="text-balance text-2xl leading-snug font-medium tracking-[-0.01em] md:text-[1.9rem]">
            {hero.statement}
          </p>
          <p className="mt-6 max-w-xl text-pretty text-[17px] leading-relaxed text-muted">{hero.intro}</p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href={`mailto:${profile.email}`}
              className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-paper transition-opacity hover:opacity-85"
            >
              Get in touch
              <ArrowIcon className="size-4" />
            </a>
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2.5 text-sm transition-colors hover:border-ink/40"
            >
              <LinkedInIcon className="size-4" />
              LinkedIn
            </a>
            <a
              href={profile.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2.5 text-sm transition-colors hover:border-ink/40"
            >
              <GitHubIcon className="size-4" />
              GitHub
            </a>
          </div>
          <p className="mt-8 font-mono text-xs text-muted">{profile.location}</p>
        </div>
        <div className="max-w-xl lg:col-span-5 lg:max-w-none">
          <RunLog />
        </div>
      </div>
    </div>
  </section>
);
