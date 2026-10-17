import { useEffect, useState } from 'react';
import { contact, profile } from '@/content';
import { ExternalLink } from './Bits';
import { ArrowIcon, LinkedInIcon, MailIcon } from './Icons';

const rowClass = 'flex items-center justify-between gap-4 py-5';

const CopyEmail = () => {
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(timer);
  }, [copied]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
    } catch {
      // Clipboard access can be blocked. The mailto link next to the button still works.
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      className="shrink-0 rounded-full border border-line bg-card px-3.5 py-1.5 font-mono text-xs text-muted transition-colors hover:border-ink/40 hover:text-ink"
    >
      <span aria-live="polite">{copied ? 'Copied' : 'Copy'}</span>
    </button>
  );
};

export const Contact = () => (
  <section id="contact" aria-labelledby="contact-title" className="defer-render scroll-mt-16 border-t border-line">
    <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6 md:py-32">
      <h2 id="contact-title" className="max-w-3xl text-balance font-display text-4xl leading-[1.05] md:text-5xl">
        {contact.headline}
      </h2>
      <p className="mt-5 max-w-xl text-pretty text-lg leading-relaxed text-muted">{contact.body}</p>
      <ul className="mt-10 max-w-3xl divide-y divide-line border-y border-line">
        <li className={rowClass}>
          <a href={`mailto:${profile.email}`} className="group flex min-w-0 items-center gap-4 hover:text-accent-text">
            <MailIcon className="size-5 shrink-0 text-muted group-hover:text-accent-text" />
            <span className="truncate text-lg md:text-xl">{profile.email}</span>
          </a>
          <CopyEmail />
        </li>
        <li>
          <ExternalLink href={profile.linkedin} className={`group ${rowClass} hover:text-accent-text`}>
            <span className="flex min-w-0 items-center gap-4">
              <LinkedInIcon className="size-5 shrink-0 text-muted group-hover:text-accent-text" />
              <span className="truncate text-lg md:text-xl">linkedin.com/in/michael-b-choi</span>
            </span>
            <ArrowIcon className="size-5 shrink-0 text-muted group-hover:text-accent-text" />
          </ExternalLink>
        </li>
      </ul>
    </div>
  </section>
);
