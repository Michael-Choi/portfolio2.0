import { groupFill, nodeGroup, pathWords } from '@/groups';

/** A small figure for phones: the request path as colored dots and arrows, then in words. */
export const PathGlyph = ({ path }: { path: string[] }) => (
  <figure className="rounded-xl border border-line bg-paper px-4 py-3">
    <div aria-hidden="true" className="flex h-6 items-center gap-1.5">
      {path.map((id, index) => (
        <span key={`${id}-${index}`} className="flex items-center gap-1.5">
          {index > 0 && <span className="h-px w-5 bg-muted/50" />}
          <span
            className={`rounded-full ${groupFill(nodeGroup(id))} ${
              id === 'runneth' ? 'size-3.5' : 'size-2.5'
            }`}
          />
        </span>
      ))}
    </div>
    <figcaption className="mt-1.5 text-xs text-muted">{pathWords(path)}</figcaption>
  </figure>
);
