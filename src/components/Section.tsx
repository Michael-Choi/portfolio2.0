import type { ReactNode } from 'react';

type SectionProps = {
  id: string;
  index: string;
  title: string;
  intro?: string;
  /** Puts the heading above the content, so the content can use the full width. */
  wide?: boolean;
  children: ReactNode;
};

export const Section = ({ id, index, title, intro, wide = false, children }: SectionProps) => (
  <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-16 border-t border-line">
    <div
      className={`mx-auto grid max-w-6xl gap-10 px-4 py-20 sm:px-6 md:py-28 ${wide ? '' : 'md:grid-cols-12'}`}
    >
      <header className={wide ? 'max-w-2xl' : 'md:col-span-4'}>
        <div className={wide ? '' : 'md:sticky md:top-28'}>
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted">{index}</p>
          <h2 id={`${id}-title`} className="mt-3 font-display text-4xl leading-[1.05] md:text-5xl">
            {title}
          </h2>
          {intro && <p className={`mt-4 text-pretty text-muted ${wide ? 'text-lg' : 'max-w-sm'}`}>{intro}</p>}
        </div>
      </header>
      <div className={wide ? '' : 'md:col-span-8'}>{children}</div>
    </div>
  </section>
);
