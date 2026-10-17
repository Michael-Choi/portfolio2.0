import type { ReactNode } from 'react';
import type { Group } from '@/content';
import { groupFill, groupText, groupTint } from '@/groups';

/** Tag chip and date. The chip carries the map color of the work. */
export const Meta = ({ tag, group, date }: { tag: string; group: Group; date: string }) => (
  <div className="flex items-center justify-between gap-3">
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${groupText(group)} ${groupTint(group)}`}
    >
      <span aria-hidden="true" className={`size-1.5 rounded-full ${groupFill(group)}`} />
      {tag}
    </span>
    <span className="text-sm tabular-nums text-muted">{date}</span>
  </div>
);

/** A bullet list with small check marks. */
export const Checklist = ({ items }: { items: string[] }) => (
  <ul className="space-y-2 text-[15px] leading-relaxed text-muted">
    {items.map((item) => (
      <li key={item} className="flex gap-2.5">
        <svg
          aria-hidden="true"
          viewBox="0 0 16 16"
          className="mt-[0.3em] size-4 shrink-0 text-ink/40"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m3.5 8.5 3 3 6-7" />
        </svg>
        {item}
      </li>
    ))}
  </ul>
);

/** A link that opens in a new tab and says so to screen readers. */
export const ExternalLink = ({ href, className, children }: { href: string; className?: string; children: ReactNode }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
    {children}
    <span className="sr-only"> (opens in new tab)</span>
  </a>
);

export const StatCallout = ({ value, label }: { value: string; label: string }) => (
  <p className="flex items-baseline gap-3">
    <span className="shrink-0 whitespace-nowrap font-display text-[1.75rem] leading-none">{value}</span>
    <span className="text-sm text-muted">{label}</span>
  </p>
);
