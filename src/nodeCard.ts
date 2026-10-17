import type { MapNode } from '@/content';

// 24×24 stroke icons for the map cards. They are fixed strings, never user input.
const ICONS: Record<string, string> = {
  runneth: '<path d="M12 3v18M3 12h18M5.6 5.6l12.8 12.8M18.4 5.6 5.6 18.4"/>',
  claude: '<path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z"/><path d="M18 16l.7 1.8 1.8.7-1.8.7L18 21l-.7-1.8-1.8-.7 1.8-.7z"/>',
  assistants: '<rect x="5" y="8" width="14" height="11" rx="3"/><path d="M12 4v4M9.5 13.5h.01M14.5 13.5h.01"/>',
  slack: '<path d="M10 4 8 20M16 4l-2 16M4.5 9h15M4 15h15"/>',
  web: '<path d="M5 5h14a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H10l-4 3v-3H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z"/>',
  motion: '<path d="M5 20V10M12 20V4M19 20v-7"/>',
  mcp: '<path d="M9 3v5M15 3v5M7 8h10v3a5 5 0 0 1-10 0zM12 16v5"/>',
  apps: '<rect x="4" y="4" width="6.5" height="6.5" rx="1.5"/><rect x="13.5" y="4" width="6.5" height="6.5" rx="1.5"/><rect x="4" y="13.5" width="6.5" height="6.5" rx="1.5"/><rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.5"/>',
};

/** Nodes that stand for many things get stacked cards behind them. */
const STACKED = new Set(['mcp', 'apps']);

/**
 * The inner markup of one map node. The three.js scene and the SVG poster both use it,
 * so the poster matches the scene that fades in over it.
 */
export function nodeCardHTML(node: MapNode) {
  const stack = STACKED.has(node.id) ? '<span class="node-stack"></span><span class="node-stack two"></span>' : '';
  return `<div class="node-inner" data-group="${node.group}" data-state="rest">${stack}<div class="node-card"><span class="node-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${ICONS[node.id] ?? ''}</svg></span><span class="node-text"><span class="node-label">${node.label}</span><span class="node-kind">${node.kind}</span></span></div></div>`;
}
