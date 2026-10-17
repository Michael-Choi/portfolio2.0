import { useEffect, useState } from 'react';
import { runLog, type RunLine } from '@/content';
import { ReplayIcon } from './Icons';

const STEP_MS = 520;

const marker: Record<RunLine['kind'], { glyph: string; className: string }> = {
  step: { glyph: '▸', className: 'text-term-dim' },
  fail: { glyph: '✕', className: 'text-err' },
  recover: { glyph: '↻', className: 'text-warn' },
  done: { glyph: '✓', className: 'text-ok' },
};

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function runState(shown: number) {
  const visible = runLog.slice(0, shown);
  if (shown >= runLog.length) return { label: 'completed', className: 'bg-ok/15 text-ok' };
  if (visible.some((line) => line.kind === 'fail'))
    return { label: 'recovering', className: 'bg-warn/15 text-warn' };
  return { label: 'running', className: 'bg-term-ink/10 text-term-ink' };
}

export const RunLog = () => {
  const [shown, setShown] = useState(() => (prefersReducedMotion() ? runLog.length : 0));
  const [run, setRun] = useState(0);

  useEffect(() => {
    if (prefersReducedMotion()) {
      setShown(runLog.length);
      return;
    }
    setShown(0);
    const timer = window.setInterval(() => {
      setShown((count) => {
        if (count >= runLog.length) {
          window.clearInterval(timer);
          return count;
        }
        return count + 1;
      });
    }, STEP_MS);
    return () => window.clearInterval(timer);
  }, [run]);

  const state = runState(shown);
  const finished = shown >= runLog.length;

  return (
    <figure className="w-full">
      <div className="overflow-hidden rounded-xl border border-term-line bg-term text-term-ink shadow-[0_24px_60px_-28px_rgba(20,24,18,0.55)]">
        <div className="flex items-center justify-between gap-3 border-b border-term-line px-4 py-2.5 font-mono text-[11px] text-term-dim">
          <span className="truncate">runneth · run 7f3a</span>
          <div className="flex items-center gap-2">
            <span className={`rounded-full px-2 py-0.5 ${state.className}`}>{state.label}</span>
            <button
              type="button"
              onClick={() => setRun((n) => n + 1)}
              disabled={!finished}
              aria-label="Replay the run"
              className="grid size-6 place-items-center rounded-full text-term-dim transition-colors hover:bg-term-ink/10 hover:text-term-ink disabled:opacity-0"
            >
              <ReplayIcon className="size-3.5" />
            </button>
          </div>
        </div>
        <ol
          aria-hidden="true"
          className="min-h-[15.5rem] space-y-1.5 px-4 py-4 font-mono text-[12px] leading-5 sm:text-[12.5px]"
        >
          {runLog.slice(0, shown).map((line, i) => (
            <li
              key={`${run}-${i}`}
              className="line-in grid grid-cols-[1rem_3.75rem_1fr_auto] gap-x-2 sm:grid-cols-[4.25rem_1rem_4rem_1fr_auto]"
            >
              <span className="hidden text-term-dim/70 sm:inline">{line.time}</span>
              <span className={marker[line.kind].className}>{marker[line.kind].glyph}</span>
              <span className={line.kind === 'step' ? 'text-term-dim' : marker[line.kind].className}>
                {line.label}
              </span>
              <span className="min-w-0 break-words">{line.detail}</span>
              <span className="text-ok">{line.status ?? ''}</span>
            </li>
          ))}
          {!finished && (
            <li className="text-term-dim">
              <span className="caret">▍</span>
            </li>
          )}
        </ol>
      </div>
      <figcaption className="mt-3 flex items-center justify-between font-mono text-xs text-muted">
        <span>Something failed. The work still finished.</span>
        <span className="sr-only">
          An example agent run. A session fails, the failure stays contained, the agent resumes from saved
          progress, and it delivers the brief.
        </span>
      </figcaption>
    </figure>
  );
};
