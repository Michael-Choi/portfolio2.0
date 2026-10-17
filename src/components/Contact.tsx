import { profile } from '@/content';
import { ArrowIcon, GitHubIcon, LinkedInIcon, MailIcon } from './Icons';

const links = [
  { href: `mailto:${profile.email}`, label: profile.email, Icon: MailIcon, external: false },
  { href: profile.linkedin, label: 'linkedin.com/in/michael-b-choi', Icon: LinkedInIcon, external: true },
  { href: profile.github, label: 'github.com/Michael-Choi', Icon: GitHubIcon, external: true },
];

export const Contact = () => (
  <section id="contact" aria-labelledby="contact-title" className="scroll-mt-16 border-t border-line">
    <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6 md:py-32">
      <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted">06 — Contact</p>
      <h2
        id="contact-title"
        className="mt-4 max-w-4xl text-balance font-serif text-[clamp(2.75rem,7vw,5.5rem)] leading-[0.98] tracking-[-0.015em]"
      >
        Let’s talk about agents that work in production.
      </h2>
      <p className="mt-6 max-w-xl text-pretty text-lg leading-relaxed text-muted">
        I am happy to talk about agent infrastructure, production reliability, or building software with
        coding agents.
      </p>
      <ul className="mt-10 divide-y divide-line border-y border-line">
        {links.map(({ href, label, Icon, external }) => (
          <li key={href}>
            <a
              href={href}
              {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              className="group flex items-center justify-between gap-4 py-5 transition-colors hover:text-accent"
            >
              <span className="flex min-w-0 items-center gap-4">
                <Icon className="size-5 shrink-0 text-muted transition-colors group-hover:text-accent" />
                <span className="truncate text-lg md:text-xl">{label}</span>
              </span>
              <ArrowIcon className="size-5 shrink-0 text-muted transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" />
            </a>
          </li>
        ))}
      </ul>
    </div>
  </section>
);
