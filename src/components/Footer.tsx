import { profile } from '@/content';
import { ExternalLink } from './Bits';

export const Footer = () => (
  <footer className="border-t border-line">
    <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-3 gap-y-1 px-4 py-8 font-mono text-xs text-muted sm:px-6">
      <span>
        © {new Date().getFullYear()} {profile.name}
      </span>
      <span aria-hidden="true">·</span>
      <span>{profile.location}</span>
      <span aria-hidden="true">·</span>
      <ExternalLink href={profile.github} className="underline-offset-4 hover:text-ink hover:underline">
        GitHub
      </ExternalLink>
    </div>
  </footer>
);
