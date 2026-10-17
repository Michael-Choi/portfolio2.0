import { profile } from '@/content';
import { ExternalLink } from './Bits';

export const Footer = () => (
  <footer className="border-t border-line">
    <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-4 py-8 text-sm text-muted sm:px-6">
      <span>
        © {new Date().getFullYear()} {profile.name} · {profile.location}
      </span>
      <ExternalLink href={profile.github} className="transition-colors hover:text-ink">
        GitHub
      </ExternalLink>
    </div>
  </footer>
);
