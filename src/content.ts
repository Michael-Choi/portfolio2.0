// All copy on the site lives here. Edit this file to update the page.

export const profile = {
  name: 'Michael Choi',
  role: 'Senior Software Engineer',
  company: 'Motion',
  location: 'Toronto',
  email: 'michael@michaelchoi.ca',
  github: 'https://github.com/Michael-Choi',
  linkedin: 'https://www.linkedin.com/in/michael-b-choi/',
};

/** Public listing of the Motion connector in Claude's connector directory. */
const CLAUDE_DIRECTORY = 'https://claude.com/connectors/motion';

export type Segment = { text: string; href?: string };

export const hero = {
  statement: 'I ship the integrations that connect AI agents to the tools people already use.',
  // mcp.runneth.com stays plain text: it is an MCP endpoint, not a page for people.
  intro: [
    { text: 'I started the Motion MCP server, now in ' },
    { text: 'Claude’s connector directory', href: CLAUDE_DIRECTORY },
    {
      text: ', and helped launch the public Runneth MCP server at mcp.runneth.com. I also built Runneth’s connections to customer MCP servers and to business apps.',
    },
  ] satisfies Segment[],
  latest: { text: 'Latest: Runneth MCP is public', href: '#runneth-mcp' },
};

// Outcomes under the hero. Each one links to the work it comes from.
export const proof = [
  { value: '18 days', label: 'to the first Motion MCP server', href: '#motion-mcp' },
  { value: '< 2 months', label: 'from first commit to Claude’s connector directory', href: '#motion-mcp' },
  { value: '2 weeks', label: 'to production use for MCP connections', href: '#mcp-client' },
  { value: '19 s → ~0', label: 'Slack queue wait for the agent', href: '#slack' },
];

export type Group = 'hub' | 'surface' | 'data' | 'tools' | 'apps';

export type Stat = { value: string; label: string };
export type Link = { label: string; href: string };

export type StoryStep = {
  id: string;
  fig: string;
  tag: string;
  /** The map color that this work belongs to. */
  group: Group;
  date: string;
  title: string;
  what: string;
  bullets: string[];
  stat?: Stat;
  links?: Link[];
  /** The request path that the map plays for this step. */
  path: string[];
  /** The figure name for this work, shown under the map. */
  edgeLabel: string;
  /** Camera turn in degrees, so the active path faces the viewer. */
  yaw: number;
};

// "What I built": the four MCP and integration features, told against the map.
export const story: StoryStep[] = [
  {
    id: 'motion-mcp',
    fig: '01',
    tag: 'Motion MCP',
    group: 'data',
    date: 'Mar – Apr 2026',
    title: 'Motion inside Claude',
    what: 'Marketers ask Claude about their ads and get answers from live Motion data.',
    bullets: [
      'Started the server and built its OAuth sign-in',
      'Wrote the first tools for reports and creative insights',
      'Made it stateless, so it scales out',
    ],
    stat: { value: '18 days', label: 'to a working server' },
    links: [{ label: 'Claude connector directory', href: CLAUDE_DIRECTORY }],
    path: ['claude', 'motion', 'claude'],
    edgeLabel: 'Fig 01 · Motion MCP server',
    yaw: -12,
  },
  {
    id: 'runneth-mcp',
    fig: '02',
    tag: 'Runneth MCP',
    group: 'hub',
    date: 'Oct 2026',
    title: 'Runneth inside other assistants',
    what: 'Any AI agent can hand creative strategy work to Runneth and read the results.',
    bullets: [
      'Public OAuth sign-in at mcp.runneth.com',
      'Live discovery of every organization a user belongs to',
      'A separate conversation channel for assistant traffic',
    ],
    path: ['assistants', 'runneth', 'motion', 'runneth', 'assistants'],
    edgeLabel: 'Fig 02 · Runneth MCP',
    yaw: -6,
  },
  {
    id: 'mcp-client',
    fig: '03',
    tag: 'MCP client',
    group: 'tools',
    date: 'Sep – Oct 2026',
    title: 'Runneth connects to any MCP server',
    what: 'Customers connect their own MCP servers to Runneth from chat.',
    bullets: [
      'OAuth, API key, and machine sign-in',
      'Runneth discovers the tools and uses them',
      'Credentials stay in each customer’s isolated workspace',
    ],
    stat: { value: '2 weeks', label: 'to production use' },
    path: ['slack', 'runneth', 'mcp', 'runneth', 'slack'],
    edgeLabel: 'Fig 03 · MCP client',
    yaw: 10,
  },
  {
    id: 'business-apps',
    fig: '04',
    tag: 'Business apps',
    group: 'apps',
    date: 'May 2026',
    title: 'Business apps in one click',
    what: 'Customers connect a business app with one OAuth sign-in, and Runneth reads its data.',
    bullets: [
      'One integration layer for a large catalog of apps',
      'Provider credentials stay outside the agent sandbox',
      'Teammates added many more apps on it',
    ],
    path: ['web', 'runneth', 'apps', 'runneth', 'web'],
    edgeLabel: 'Fig 04 · App layer',
    yaw: 6,
  },
];

export type Card = {
  id: string;
  tag: string;
  group: Group;
  date: string;
  title: string;
  what: string;
  bullets: string[];
  stat?: Stat;
};

export const moreWork: Card[] = [
  {
    id: 'slack',
    tag: 'Slack',
    group: 'surface',
    date: 'May – Oct 2026',
    title: 'A fast, quiet teammate in Slack',
    what: 'Runneth answers in channels and threads, and stays quiet when a message is for someone else.',
    bullets: ['Recovered answers that failed to post', 'Cut Slack permissions to least privilege', 'Made each turn about 5x faster'],
    stat: { value: '19 s → ~0', label: 'Slack queue wait' },
  },
  {
    id: 'reliability',
    tag: 'Reliability',
    group: 'hub',
    date: 'Jul – Oct 2026',
    title: 'Reliability at customer scale',
    what: 'Fixed failures that reached tens to hundreds of customer organizations.',
    bullets: [
      'One crashed session no longer stops a whole server',
      'Unblocked work stalled by memory pressure',
      'Fixed broken reports and cut Meta connection errors',
    ],
  },
  {
    id: 'security',
    tag: 'Security',
    group: 'data',
    date: 'Feb – Oct 2026',
    title: 'Revocable sessions and two-factor sign-in',
    what: 'Moved Motion from sign-in tokens that never expired to revocable sessions.',
    bullets: ['Users moved over in place', 'Two-factor sign-in with an organization-wide rule'],
    stat: { value: '6 findings', label: 'from a security assessment, fixed in about two weeks' },
  },
];

export const alsoShipped = [
  { tag: 'App builder', text: 'Runneth screenshots the apps it builds on desktop and mobile, then fixes layout problems.' },
  { tag: 'Routines', text: 'The foundation for routines that start when an event arrives.' },
  { tag: 'Chat', text: 'Live task progress and an outline for long conversations.' },
];

export type Month = { month: string; title: string; milestone?: boolean };
export type Role = { title: string; dates: string; points?: string[] };
export type Job = {
  company: string;
  years: string;
  note?: string;
  summary: string;
  roles: Role[];
  points?: string[];
  strip?: Month[];
};

export const experience: Job[] = [
  {
    company: 'Motion',
    years: '2026 – now',
    summary:
      'Creative analytics for performance marketing teams. Runneth is the Motion AI agent for creative strategy.',
    roles: [
      { title: 'Senior Software Engineer, Runneth AI', dates: 'May 2026 – now' },
      { title: 'Senior Software Engineer, Infrastructure', dates: 'Jan – May 2026' },
    ],
    points: [
      'Resolved 92 urgent and high-priority issues in 2026.',
      'Reviewed 500+ teammate pull requests across both codebases.',
      'Took on-call work for the agent fleet: crash loops, stalled queues, and sign-in outages.',
    ],
    strip: [
      { month: 'Jan', title: 'Joined Motion · scoped API access for AI', milestone: true },
      { month: 'Feb', title: 'Revocable sessions' },
      { month: 'Mar', title: 'Two-factor sign-in · first Motion MCP server' },
      { month: 'Apr', title: 'Listed in Claude’s connector directory' },
      { month: 'May', title: 'Moved to Runneth AI · business apps', milestone: true },
      { month: 'Jun', title: 'Slack on bot permissions' },
      { month: 'Jul', title: 'Contained session failures' },
      { month: 'Aug', title: 'Recovered stalled work' },
      { month: 'Sep', title: 'MCP connections launch' },
      { month: 'Oct', title: 'mcp.runneth.com opens to any agent' },
    ],
  },
  {
    company: 'TravelBank',
    years: '2021 – 2025',
    note: 'Acquired by U.S. Bank',
    summary: 'Corporate travel booking and expense management.',
    roles: [
      {
        title: 'Technical Lead & Engineering Manager',
        dates: '2022 – 2025',
        points: [
          'Built and managed a booking platform that integrates with multiple external reservation systems.',
          'Designed a fault-tolerant architecture with 99.99% uptime for critical booking services.',
          'Cut MongoDB query times by 40% with cursor-based pagination and indexes.',
          'Led the Global Distribution System migration from Apollo to Galileo.',
        ],
      },
      {
        title: 'Full Stack Software Engineer',
        dates: '2021 – 2022',
        points: [
          'Automated passive hotel bookings, saving travel agents 500+ hours each month.',
          'Reduced Datadog costs by $500K per year with targeted exclusion filters.',
          'Moved an old hotel XML API to REST and kept it backward compatible.',
        ],
      },
    ],
  },
  {
    company: 'BrokerBay',
    years: '2019 – 2021',
    note: 'Acquired by Carrier',
    summary: 'Showing management software for real estate brokerages.',
    roles: [
      {
        title: 'Full Stack Software Engineer',
        dates: '2019 – 2021',
        points: [
          'Built WebRTC virtual tours, so agents could show properties during COVID-19.',
          'Designed a job scheduling system on GCP Pub/Sub with a leader/worker pattern that scales horizontally.',
          'Moved large AngularJS pages to React.',
        ],
      },
    ],
  },
];

export const principles = [
  {
    title: 'Agents on the team',
    body: 'I run several coding agents in parallel and review their work like a lead reviews a team.',
  },
  { title: 'Meet people where they work', body: 'Agent features belong in the tools people already have open.' },
  { title: 'Ship it, then prove it', body: 'Small steps, each tested end to end on the real stack.' },
  { title: 'Trace it before you fix it', body: 'A fix for a guessed cause is a second bug.' },
];

// Paraphrased, with no names. Quote a teammate by name only with their permission.
export const recognition = 'Recognized in a company shoutout for always helping teammates and sharing knowledge.';

export type MapNode = { id: string; label: string; kind: string; group: Group; body: string };

// Nodes for the integration map. The body text also forms the screen reader description.
export const mapNodes: MapNode[] = [
  { id: 'runneth', label: 'Runneth', kind: 'AI agent', group: 'hub', body: 'the Motion AI agent for creative strategy, in the center' },
  { id: 'claude', label: 'Claude', kind: 'Assistant', group: 'surface', body: 'an AI assistant that reads Motion data and hands work to Runneth' },
  { id: 'assistants', label: 'Other assistants', kind: 'Any MCP client', group: 'surface', body: 'any MCP client that hands work to Runneth' },
  { id: 'slack', label: 'Slack', kind: 'Team chat', group: 'surface', body: 'where teams talk to Runneth in channels and threads' },
  { id: 'web', label: 'Runneth chat', kind: 'Web chat', group: 'surface', body: 'the Runneth web chat' },
  { id: 'motion', label: 'Motion data', kind: 'Ad data', group: 'data', body: 'reports, creative insights, and brand context' },
  { id: 'mcp', label: 'Your MCP servers', kind: 'Customer tools', group: 'tools', body: 'MCP servers that customers connect from chat' },
  { id: 'apps', label: 'Business apps', kind: 'One-click OAuth', group: 'apps', body: 'business apps that customers connect with OAuth' },
];

export const mapEdges: [string, string][] = [
  ['claude', 'runneth'],
  ['assistants', 'runneth'],
  ['slack', 'runneth'],
  ['web', 'runneth'],
  ['motion', 'runneth'],
  ['motion', 'claude'],
  ['runneth', 'mcp'],
  ['runneth', 'apps'],
];

export const contact = {
  headline: 'Talk to me about MCP and agent integrations.',
  body: 'I am happy to talk about MCP, agent integrations, or shipping AI features to production.',
};
