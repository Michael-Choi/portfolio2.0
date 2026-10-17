// All copy on the site lives here. Edit this file to update the page.

export const profile = {
  name: 'Michael Choi',
  role: 'Senior Software Engineer at Motion',
  location: 'Toronto',
  email: 'michael@michaelchoi.ca',
  github: 'https://github.com/Michael-Choi',
  linkedin: 'https://www.linkedin.com/in/michael-b-choi/',
  x: 'https://x.com/mikechoi',
};

const runneth = 'https://runneth.com';

/** Text with inline links. Each part is plain text or a link. */
export type Rich = (string | { text: string; href: string })[];

export const intro: Rich[] = [
  ['I build the integrations that connect AI agents to the tools people already use.'],
  [
    'At Motion, I work on ',
    { text: 'Runneth', href: runneth },
    ', our AI agent for creative strategy. Most days I also work alongside several coding agents and review their work like a lead reviews a team.',
  ],
];

export type Group = 'hub' | 'surface' | 'data' | 'tools' | 'apps';
export type MapNode = {
  id: string;
  label: string;
  /** A short role line under the label. */
  kind: string;
  group: Group;
  side: 'left' | 'center' | 'right';
  /** An image that replaces the icon. */
  logo?: string;
  /** Where the card links to. */
  href?: string;
};

// The integration diagram. Left: where people and agents ask. Center: Runneth. Right: what
// Runneth reaches. Assistants also reach Motion data directly, through the Motion MCP server.
export const nodes: MapNode[] = [
  { id: 'claude', label: 'Claude', kind: 'Assistant', group: 'surface', side: 'left' },
  { id: 'chatgpt', label: 'ChatGPT', kind: 'Assistant', group: 'surface', side: 'left' },
  { id: 'agents', label: 'Other agents', kind: 'Any MCP client', group: 'surface', side: 'left' },
  { id: 'slack', label: 'Slack', kind: 'Team chat', group: 'surface', side: 'left' },
  { id: 'chat', label: 'Runneth chat', kind: 'Web chat', group: 'surface', side: 'left' },
  { id: 'runneth', label: 'Runneth', kind: 'AI agent', group: 'hub', side: 'center', logo: '/runneth-logo.svg', href: runneth },
  { id: 'motion', label: 'Motion data', kind: 'Ad performance', group: 'data', side: 'right' },
  { id: 'mcp', label: 'Agents & MCP servers', kind: 'Over MCP', group: 'tools', side: 'right' },
  { id: 'apps', label: 'Business apps', kind: 'One OAuth sign-in', group: 'apps', side: 'right' },
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
    text: 'Built the MCP server that brings Motion’s ad data into Claude, ChatGPT, and any agent that speaks MCP. Listed in both the Claude and ChatGPT app directories.',
    year: '2026',
    href: 'https://claude.com/connectors/motion',
    path: ['claude-motion', 'chatgpt-motion', 'agents-motion'],
  },
  {
    title: 'Runneth MCP',
    text: 'Launched Runneth as a public MCP server, so any AI agent can hand it creative strategy work.',
    year: '2026',
    path: ['claude-runneth', 'agents-runneth', 'runneth-motion'],
  },
  {
    title: 'MCP support for Runneth',
    text: 'Built MCP support so Runneth can connect to other agents and MCP servers, with OAuth, client ID and secret, or custom auth headers.',
    year: '2026',
    path: ['chat-runneth', 'runneth-mcp'],
  },
  {
    title: 'Business app integrations',
    text: 'Built the integration layer that connects Runneth to a customer’s business apps with one OAuth sign-in.',
    year: '2026',
    path: ['chat-runneth', 'runneth-apps'],
  },
  {
    title: 'Runneth in Slack',
    text: 'Made Runneth’s Slack replies fast and reliable. Queue wait fell from about 19 seconds to near zero.',
    year: '2026',
    path: ['slack-runneth'],
  },
  {
    title: 'Sign-in and security',
    text: 'Moved Motion to revocable sessions, shipped two-factor sign-in, and fixed security-assessment findings.',
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
