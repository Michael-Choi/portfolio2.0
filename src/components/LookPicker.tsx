import { LOOKS, type Look } from '@/look';

// Temporary switcher for comparing the design options. Remove it after one is chosen.
export const LookPicker = ({ current }: { current: Look }) => (
  <nav
    aria-label="Design options"
    className="fixed inset-x-0 bottom-4 z-50 mx-auto flex w-fit items-center gap-1 rounded-full border border-line bg-card/90 p-1 font-mono text-xs shadow-lg backdrop-blur-md"
  >
    <span className="hidden px-3 text-muted sm:inline">Design option</span>
    {LOOKS.map((look) => (
      <a
        key={look.id}
        href={`?look=${look.id}`}
        aria-current={look.id === current ? 'page' : undefined}
        className="rounded-full px-3 py-1.5 text-muted transition-colors hover:text-ink aria-[current=page]:bg-accent aria-[current=page]:text-accent-ink"
      >
        {look.name}
      </a>
    ))}
  </nav>
);
