import { ThemeToggle } from './ThemeToggle';

const nav = [
  { href: '#work', label: 'Work' },
  { href: '#timeline', label: '2026' },
  { href: '#experience', label: 'Experience' },
  { href: '#contact', label: 'Contact' },
];

export const Header = ({ themeToggle }: { themeToggle: boolean }) => (
  <header className="sticky top-0 z-40 border-b border-line/70 bg-paper/80 backdrop-blur-md">
    <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
      <a href="#top" className="flex items-center gap-3" aria-label="Michael Choi, back to top">
        <span className="grid size-8 place-items-center rounded-[6px] border-2 border-muted/50 bg-sage/40 font-mono text-[13px] font-medium tracking-tight text-ink">
          Mc
        </span>
        <span className="hidden text-sm font-medium sm:inline">Michael Choi</span>
      </a>
      <nav aria-label="Sections" className="flex items-center gap-1">
        {nav.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className={`rounded-full px-3 py-1.5 text-sm text-muted transition-colors hover:bg-line/60 hover:text-ink ${
              item.href === '#contact' ? '' : 'hidden md:inline-block'
            }`}
          >
            {item.label}
          </a>
        ))}
        {themeToggle && <ThemeToggle />}
      </nav>
    </div>
  </header>
);
