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
    ', our AI agent for creative strategy. Most days I’m also running a few coding agents and reviewing their work the way I’d review a team’s.',
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
  ['chatgpt', 'runneth'],
  ['agents', 'runneth'],
  ['slack', 'runneth'],
  ['chat', 'runneth'],
  ['runneth', 'motion'],
  ['runneth', 'mcp'],
  ['runneth', 'apps'],
];

export const diagramCaption = 'How the pieces connect. Scroll or hover the projects to trace each path.';

/** Every way into Runneth, and every system it reaches. Sign-in guards all of them. */
const intoRunneth = edges.filter(([, to]) => to === 'runneth').map(([from, to]) => `${from}-${to}`);
const outOfRunneth = edges.filter(([from]) => from === 'runneth').map(([from, to]) => `${from}-${to}`);

export type WorkItem = {
  title: string;
  text: string;
  href?: string;
  /** The connection this work built, highlighted in the diagram. Keep it to that one connection. */
  path: string[];
};

/** The year of every project in the list. */
export const workYear = '2026';

export const work: WorkItem[] = [
  {
    title: 'Motion MCP server',
    text: 'Created Motion’s MCP server. Claude, ChatGPT, and any other MCP client can now work with Motion ad data, and it’s listed in both app directories.',
    href: 'https://claude.com/connectors/motion',
    path: ['claude-motion', 'chatgpt-motion', 'agents-motion'],
  },
  {
    title: 'Runneth MCP',
    text: 'Launched Runneth’s public MCP server. Now other agents can hand off creative strategy work to it.',
    path: ['claude-runneth', 'chatgpt-runneth', 'agents-runneth'],
  },
  {
    title: 'MCP support for Runneth',
    text: 'Designed and built Runneth’s MCP client. It plugs into other agents and MCP servers, whether they use OAuth, a client ID and secret, or custom auth headers.',
    path: ['runneth-mcp'],
  },
  {
    title: 'Business app integrations',
    text: 'Took business app integrations from zero to launch. One OAuth sign-in, and Runneth can use the apps a customer already works in.',
    path: ['runneth-apps'],
  },
  {
    title: 'Runneth in Slack',
    text: 'Made Runneth’s Slack replies fast and reliable. Queue wait went from about 19 seconds to almost nothing.',
    path: ['slack-runneth'],
  },
  {
    title: 'Sign-in and security',
    text: 'Moved Motion to revocable sessions, shipped two-factor sign-in, and closed out the findings from a security assessment.',
    // Sign-in guards every way into Runneth and every system it reaches.
    path: [...intoRunneth, ...outOfRunneth],
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
