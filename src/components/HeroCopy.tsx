import { hero, profile } from '@/content';
import { ArrowIcon, GitHubIcon, LinkedInIcon } from './Icons';

type HeroCopyProps = { align?: 'left' | 'center'; nameClassName: string };

export const HeroCopy = ({ align = 'left', nameClassName }: HeroCopyProps) => {
  const centered = align === 'center';
  return (
    <div className={centered ? 'mx-auto flex max-w-3xl flex-col items-center text-center' : ''}>
      <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted">{hero.eyebrow}</p>
      <h1 className={`mt-5 font-display ${nameClassName}`}>{profile.name}</h1>
      <p
        className={`mt-8 text-balance text-2xl leading-snug font-medium tracking-[-0.01em] md:text-[1.75rem] ${
          centered ? 'max-w-2xl' : ''
        }`}
      >
        {hero.statement}
      </p>
      <p className={`mt-5 text-pretty text-[17px] leading-relaxed text-muted ${centered ? 'max-w-2xl' : 'max-w-xl'}`}>
        {hero.intro}
      </p>
      <div className={`mt-8 flex flex-wrap items-center gap-3 ${centered ? 'justify-center' : ''}`}>
        <a
          href="#work"
          className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-accent-ink transition-opacity hover:opacity-85"
        >
          See what I shipped
          <ArrowIcon className="size-4 rotate-90" />
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
    </div>
  );
};
