import { mapNodes, type Group } from '@/content';

// Text colors per map group. The darker *-text tokens pass WCAG AA at small sizes.
const TEXT: Record<Group, string> = {
  hub: 'text-accent-text',
  surface: 'text-surface-text',
  data: 'text-data-text',
  tools: 'text-tools-text',
  apps: 'text-apps-text',
};

const FILL: Record<Group, string> = {
  hub: 'bg-hub',
  surface: 'bg-surface',
  data: 'bg-data',
  tools: 'bg-tools',
  apps: 'bg-apps',
};

export const groupText = (group: Group) => TEXT[group];
export const groupFill = (group: Group) => FILL[group];

const nodeById = new Map(mapNodes.map((node) => [node.id, node]));

export const nodeGroup = (id: string) => nodeById.get(id)?.group ?? 'surface';

/** A request path in words, such as "Claude → Motion data → Claude". */
export const pathWords = (path: string[]) => path.map((id) => nodeById.get(id)?.label ?? id).join(' → ');

// Soft background tints for tag chips.
const TINT: Record<Group, string> = {
  hub: 'bg-hub/10',
  surface: 'bg-surface/10',
  data: 'bg-data/12',
  tools: 'bg-tools/10',
  apps: 'bg-apps/10',
};

export const groupTint = (group: Group) => TINT[group];
