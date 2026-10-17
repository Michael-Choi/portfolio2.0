import { focus } from '@/content';
import { Section } from './Section';

export const Focus = () => (
  <Section
    id="focus"
    index="01 — Focus"
    title="What I do"
    intro="Models are good. The hard part is everything around them: tools, state, access, and what happens when a step fails."
  >
    <ol className="divide-y divide-line border-y border-line">
      {focus.items.map((item, i) => (
        <li key={item} className="grid grid-cols-[2.5rem_1fr] gap-4 py-5 md:py-6">
          <span className="pt-1 font-mono text-xs text-muted">{String(i + 1).padStart(2, '0')}</span>
          <p className="text-pretty text-xl leading-snug md:text-2xl">{item}</p>
        </li>
      ))}
    </ol>
    <div className="mt-10">
      <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted">Tools I use most</p>
      <ul className="mt-4 flex flex-wrap gap-2">
        {focus.stack.map((tool) => (
          <li key={tool} className="rounded-full border border-line bg-card px-3 py-1 font-mono text-xs">
            {tool}
          </li>
        ))}
      </ul>
    </div>
  </Section>
);
