import { profile } from '@/content';

const nav = [
  { href: '#work', label: 'Work' },
  { href: '#experience', label: 'Experience' },
];

export const Header = () => (
  <header className="sticky top-0 z-40 border-b border-line/70 bg-paper/90 backdrop-blur-md">
    <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
      <a href="#top" className="flex items-center gap-3" aria-label="Michael Choi, back to top">
        <span className="grid size-8 place-items-center rounded-[6px] border-2 border-muted/50 bg-card font-mono text-[13px] font-medium tracking-tight text-ink">
          Mc
        </span>
        <span className="hidden text-sm font-medium sm:inline">{profile.name}</span>
      </a>
      <nav aria-label="Sections" className="flex items-center gap-1">
        {nav.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="hidden rounded-full px-3 py-1.5 text-sm text-muted transition-colors hover:bg-line/60 hover:text-ink md:inline-block"
          >
            {item.label}
          </a>
        ))}
        <a
          href={`mailto:${profile.email}`}
          className="ml-1 rounded-full bg-ink px-3.5 py-1.5 text-sm font-medium text-card transition-opacity hover:opacity-85"
        >
          Email
        </a>
      </nav>
    </div>
  </header>
);
