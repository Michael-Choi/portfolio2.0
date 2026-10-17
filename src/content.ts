// All copy on the site lives here. Edit this file to update the page.

export const profile = {
  name: 'Michael Choi',
  role: 'Senior Software Engineer at Motion',
  location: 'Toronto',
  email: 'michael@michaelchoi.ca',
  github: 'https://github.com/Michael-Choi',
  linkedin: 'https://www.linkedin.com/in/michael-b-choi/',
};

export const intro = [
  'I build the integrations that connect AI agents to the tools people already use.',
  'At Motion, I work on Runneth, our AI agent for creative strategy. Most days I also work alongside several coding agents and review their work like a lead reviews a team.',
];

export type Group = 'hub' | 'surface' | 'data' | 'tools' | 'apps';
export type MapNode = { id: string; label: string; group: Group; side: 'left' | 'center' | 'right' };

// The integration diagram. Left: assistants, agents, and chat surfaces. Center: Motion data and
// Runneth. Right: the tools that Runneth reaches.
export const nodes: MapNode[] = [
  { id: 'claude', label: 'Claude', group: 'surface', side: 'left' },
  { id: 'chatgpt', label: 'ChatGPT', group: 'surface', side: 'left' },
  { id: 'agents', label: 'Other agents', group: 'surface', side: 'left' },
  { id: 'slack', label: 'Slack', group: 'surface', side: 'left' },
  { id: 'chat', label: 'Runneth chat', group: 'surface', side: 'left' },
  { id: 'motion', label: 'Motion data', group: 'data', side: 'center' },
  { id: 'runneth', label: 'Runneth', group: 'hub', side: 'center' },
  { id: 'mcp', label: 'MCP servers', group: 'tools', side: 'right' },
  { id: 'apps', label: 'Business apps', group: 'apps', side: 'right' },
];

/** Edges as [from, to]. The edges into Motion data are the Motion MCP server. */
export const edges: [string, string][] = [
  ['claude', 'motion'],
  ['chatgpt', 'motion'],
  ['agents', 'motion'],
  ['claude', 'runneth'],
  ['agents', 'runneth'],
  ['slack', 'runneth'],
  ['chat', 'runneth'],
  ['runneth', 'motion'],
  ['runneth', 'mcp'],
  ['runneth', 'apps'],
];

export type WorkItem = {
  title: string;
  text: string;
  year: string;
  href?: string;
  /** Edges that this work built or uses, highlighted in the diagram. */
  path: string[];
};

export const work: WorkItem[] = [
  {
    title: 'Motion MCP server',
    text: 'Brings Motion’s ad data into Claude, ChatGPT, and any agent that speaks MCP. Listed in Claude’s connector directory.',
    year: '2026',
    href: 'https://claude.com/connectors/motion',
    path: ['claude-motion', 'chatgpt-motion', 'agents-motion'],
  },
  {
    title: 'Runneth MCP',
    text: 'Helped launch Runneth as a public MCP server that any AI agent can call.',
    year: '2026',
    path: ['claude-runneth', 'agents-runneth', 'runneth-motion'],
  },
  {
    title: 'MCP connections',
    text: 'Customers connect their own MCP servers to Runneth from chat, with OAuth.',
    year: '2026',
    path: ['chat-runneth', 'runneth-mcp'],
  },
  {
    title: 'Business app integrations',
    text: 'One OAuth sign-in connects Runneth to a customer’s business apps.',
    year: '2026',
    path: ['chat-runneth', 'runneth-apps'],
  },
  {
    title: 'Runneth in Slack',
    text: 'Made replies fast and reliable. Queue wait fell from about 19 seconds to near zero.',
    year: '2026',
    path: ['slack-runneth'],
  },
  {
    title: 'Sign-in and security',
    text: 'Revocable sessions, two-factor sign-in, and fixes from a security assessment.',
    year: '2026',
    path: [],
  },
];

export type PastRole = { company: string; role: string; years: string; note: string };

export const previously: PastRole[] = [
  {
    company: 'TravelBank',
    role: 'Technical Lead & Engineering Manager',
    years: '2021 – 2025',
    note: 'Acquired by U.S. Bank',
  },
  { company: 'BrokerBay', role: 'Full Stack Software Engineer', years: '2019 – 2021', note: 'Acquired by Carrier' },
];
