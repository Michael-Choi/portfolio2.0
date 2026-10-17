import { profile } from '@/content';

const nav = [
  { href: '#work', label: 'Work' },
  { href: '#experience', label: 'Experience' },
];

export const Monogram = ({ className = 'size-8 text-xs' }: { className?: string }) => (
  <span
    aria-hidden="true"
    className={`grid shrink-0 place-items-center rounded-full bg-ink font-display tracking-tight text-card ${className}`}
  >
    MC
  </span>
);

export const Header = () => (
  <header className="sticky top-0 z-40 border-b border-line/60 bg-paper/85 backdrop-blur-md">
    <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
      <a href="#top" className="flex items-center gap-2.5" aria-label="Michael Choi, back to top">
        <Monogram />
        <span className="text-[15px] font-medium tracking-tight">{profile.name}</span>
      </a>
      <nav aria-label="Sections" className="flex items-center gap-1">
        {nav.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="hidden rounded-full px-3 py-1.5 text-sm text-muted transition-colors hover:text-ink md:inline-block"
          >
            {item.label}
          </a>
        ))}
        <a
          href={`mailto:${profile.email}`}
          className="ml-2 rounded-full bg-ink px-4 py-1.5 text-sm font-medium text-card transition-opacity hover:opacity-85"
        >
          Get in touch
        </a>
      </nav>
    </div>
  </header>
);
