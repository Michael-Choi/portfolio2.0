import type { ReactNode } from 'react';
import type { Group } from '@/content';
import { groupFill, groupText } from '@/groups';

/** Tag and date line. The tag carries the map color of the work. */
export const Meta = ({ tag, group, date }: { tag: string; group: Group; date: string }) => (
  <div className="flex items-center justify-between gap-3 font-mono text-xs">
    <span className={`flex items-center gap-2 font-medium uppercase tracking-[0.14em] ${groupText(group)}`}>
      <span aria-hidden="true" className={`size-2 rounded-full ${groupFill(group)}`} />
      {tag}
    </span>
    <span className="text-muted">{date}</span>
  </div>
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
    <span className="font-display text-[1.75rem] leading-none">{value}</span>
    <span className="text-sm text-muted">{label}</span>
  </p>
);
