import type { ReactNode } from 'react';

type SectionProps = {
  id: string;
  eyebrow: string;
  title: string;
  intro?: string;
  /** Puts the heading above the content, so the content can use the full width. */
  wide?: boolean;
  className?: string;
  children: ReactNode;
};

export const Section = ({ id, eyebrow, title, intro, wide = false, className = '', children }: SectionProps) => (
  <section id={id} aria-labelledby={`${id}-title`} className={`scroll-mt-16 ${className}`}>
    <div className={`mx-auto grid max-w-6xl gap-12 px-4 py-24 sm:px-6 md:py-32 ${wide ? '' : 'md:grid-cols-12'}`}>
      <header className={wide ? 'max-w-2xl' : 'md:col-span-4'}>
        <div className={wide ? '' : 'md:sticky md:top-28'}>
          <p className="eyebrow">{eyebrow}</p>
          <h2 id={`${id}-title`} className="mt-3 text-balance font-display text-4xl leading-[1.05] md:text-[2.75rem]">
            {title}
          </h2>
          {intro && <p className={`mt-4 text-pretty text-lg leading-relaxed text-muted ${wide ? '' : 'max-w-sm'}`}>{intro}</p>}
        </div>
      </header>
      <div className={wide ? '' : 'md:col-span-8'}>{children}</div>
    </div>
  </section>
);
