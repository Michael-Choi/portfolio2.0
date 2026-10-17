// All copy on the site lives here. Edit this file to update the page.

export const profile = {
  name: 'Michael Choi',
  role: 'Senior Software Engineer',
  company: 'Motion',
  location: 'Toronto, Canada',
  email: 'michael@michaelchoi.ca',
  github: 'https://github.com/Michael-Choi',
  linkedin: 'https://www.linkedin.com/in/michael-b-choi/',
};

export const hero = {
  eyebrow: 'Senior Software Engineer · AI agents & integrations',
  statement: 'I ship the integrations that connect AI agents to the tools people already use.',
  intro:
    'At Motion, I built the first version of the Motion MCP server, so assistants like Claude can work with live Motion data. Then I connected Runneth, the Motion AI agent for creative strategy, in both directions: other assistants can hand work to Runneth, and Runneth can use customer MCP servers and a large catalog of business apps.',
};

export const stats = [
  { value: '18 days', label: 'to build the first Motion MCP server' },
  { value: '2', label: 'MCP servers I built or extended: Motion MCP and Runneth MCP' },
  { value: '92', label: 'urgent and high-priority issues resolved in 2026' },
  { value: '500+', label: 'teammate pull requests reviewed in 2026' },
];

export type Feature = {
  tag: string;
  title: string;
  body: string;
  impact: string;
  shipped: string;
};

export const integrationWork: Feature[] = [
  {
    tag: 'Motion MCP',
    title: 'Motion inside Claude',
    body: 'I started the Motion MCP server and built its OAuth sign-in, its first tools, and a stateless design that scales out. Marketers connect Motion to Claude, then ask about reports, creative insights, and brand context with live data.',
    impact: 'Listed in Claude’s connector directory less than two months after the first commit, and now part of Motion’s paid plans.',
    shipped: 'Mar – Apr 2026',
  },
  {
    tag: 'Runneth MCP',
    title: 'Runneth inside other assistants',
    body: 'I helped launch the Runneth MCP server at mcp.runneth.com. My parts: public OAuth sign-in, live organization discovery, and a separate conversation channel for assistant traffic. Any AI agent can now hand creative strategy work to Runneth and read the results.',
    impact: 'Customers can use Runneth from the assistant they already work in.',
    shipped: 'Oct 2026',
  },
  {
    tag: 'MCP client',
    title: 'Runneth connects to any MCP server',
    body: 'Customers add their own MCP servers from chat, with OAuth, API key, or machine sign-in. Runneth discovers the tools and uses them in its work. Credentials stay inside each customer’s isolated workspace.',
    impact: 'In production use within two weeks of launch. Customers extend Runneth with their own tools, and Motion does not need to build each one.',
    shipped: 'Sep – Oct 2026',
  },
  {
    tag: 'Integrations',
    title: 'Business apps in one click',
    body: 'I built the integration layer that connects Runneth to a large catalog of business apps. Customers sign in with OAuth once. Credentials stay in our backend, outside the agent sandbox.',
    impact: 'A new app is a configuration entry, not a new integration project. Teammates added many more apps on this layer.',
    shipped: 'May 2026',
  },
];

export const productWork: Feature[] = [
  {
    tag: 'Slack',
    title: 'A fast, quiet teammate in Slack',
    body: 'Runneth works in private channels and threads, stays quiet when a message is for someone else, and recovers answers that failed to post. I also cut its Slack permissions to least privilege for the Slack Marketplace review.',
    impact: 'Slack queue wait fell from about 19 seconds to near zero, and each turn got about 5x faster.',
    shipped: 'May – Oct 2026',
  },
  {
    tag: 'App builder',
    title: 'Agents check their own apps',
    body: 'Runneth takes desktop and mobile screenshots of the apps it builds, finds layout problems, and fixes them.',
    impact: 'In controlled tests, it caught all four seeded layout defects.',
    shipped: 'Sep 2026',
  },
  {
    tag: 'Routines',
    title: 'Workflows that start on events',
    body: 'The foundation for routines that start when an event arrives, with retries and protection against duplicate runs.',
    impact: 'The base for webhook-triggered automation in Runneth.',
    shipped: 'Sep 2026',
  },
  {
    tag: 'Reliability',
    title: 'Reliability at customer scale',
    body: 'I traced repeated crashes to session cleanup: one dead session stopped every conversation on its server. I contained it. I also fixed stalled background work and broken reports, and cut Meta connection errors. Each problem reached tens to hundreds of customer organizations.',
    impact: 'A failed session no longer interrupts the other conversations on its server.',
    shipped: 'Jul – Oct 2026',
  },
  {
    tag: 'Security',
    title: 'Revocable sessions and two-factor sign-in',
    body: 'I led the move from sign-in tokens that never expired to revocable sessions, and users moved over in place. I shipped two-factor sign-in with an organization-wide rule for admins.',
    impact: 'Fixed six findings from a third-party security assessment in about two weeks.',
    shipped: 'Feb – Oct 2026',
  },
  {
    tag: 'Chat',
    title: 'Long agent runs that are easy to follow',
    body: 'Runneth chat shows live task progress, an outline to move through long conversations, and list filters that stay in place.',
    impact: 'Users can see what the agent is doing while it works.',
    shipped: 'Jul – Sep 2026',
  },
];

export type Month = {
  month: string;
  milestone?: string;
  title: string;
  body: string;
};

export const timeline: Month[] = [
  {
    month: 'Jan',
    milestone: 'Joined Motion · Infrastructure',
    title: 'Scoped API access for AI',
    body: 'Organization-scoped tokens, so AI environments call Motion APIs only for their own workspaces.',
  },
  {
    month: 'Feb',
    title: 'Revocable sessions',
    body: 'A new authentication system with revocable sessions behind existing logins and API access. Users moved over in place.',
  },
  {
    month: 'Mar',
    title: 'Two-factor sign-in and the Motion MCP server',
    body: 'Two-factor authentication with organization-wide rules. The first Motion MCP server, built in 18 days, with OAuth for the Claude connector.',
  },
  {
    month: 'Apr',
    title: 'Motion listed in Claude’s connector directory',
    body: 'Alpha customers on Apr 9, a stateless server that scales out, and a listing in Claude’s connector directory on Apr 27.',
  },
  {
    month: 'May',
    milestone: 'Moved to the Runneth AI team',
    title: 'Business apps for Runneth',
    body: 'One integration layer for business apps, plus Slack answers that recover when posting fails.',
  },
  {
    month: 'Jun',
    title: 'Slack on bot permissions',
    body: 'Slack search and channel access on the bot’s own permissions, with no automatic channel joins.',
  },
  {
    month: 'Jul',
    title: 'Live progress and contained failures',
    body: 'Live task progress in Runneth chat. A failed session no longer stops other conversations.',
  },
  {
    month: 'Aug',
    title: 'Agents that finish the job',
    body: 'Large batches of tool calls complete, stalled background work recovers, and shared instructions are cached.',
  },
  {
    month: 'Sep',
    title: 'MCP connections launch',
    body: 'Runneth connects to customer MCP servers with OAuth. Also: screenshot checks for generated apps and the foundation for event-triggered routines.',
  },
  {
    month: 'Oct',
    title: 'mcp.runneth.com opens to any agent',
    body: 'Public OAuth sign-in, live organization discovery, and a conversation channel for other assistants.',
  },
];

export type Role = { title: string; dates: string; points: string[] };
export type Job = { company: string; note?: string; summary: string; roles: Role[] };

export const experience: Job[] = [
  {
    company: 'Motion',
    summary:
      'Creative analytics for performance marketing teams. Runneth is the Motion AI agent for creative strategy.',
    roles: [
      {
        title: 'Senior Software Engineer, Runneth AI',
        dates: 'May 2026 – now',
        points: [
          'Created MCP connections and the business app layer for Runneth, and helped launch the public Runneth MCP server.',
          'Led Slack speed and reliability fixes, and shipped chat, app builder, and routine features.',
          'Resolved failures that reached tens to hundreds of customer organizations, and reviewed 300+ teammate pull requests.',
        ],
      },
      {
        title: 'Senior Software Engineer, Infrastructure',
        dates: 'Jan – May 2026',
        points: [
          'Started the Motion MCP server and its Claude connector, from first commit to Claude’s connector directory in under two months.',
          'Led the move to revocable sessions, two-factor sign-in, and scoped API access for AI agents.',
        ],
      },
    ],
  },
  {
    company: 'TravelBank',
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
    title: 'Meet people where they work',
    body: 'The best agent feature is the one in the tool you already have open: Slack, Claude, or your own systems.',
  },
  {
    title: 'Ship it, then prove it',
    body: 'I ship in small steps and test each one end to end on the real stack: the queue, the sandbox, and the message in Slack.',
  },
  {
    title: 'Trace it before you fix it',
    body: 'I start from logs, traces, and the real failure. In one pass, I traced 74 production alerts to their root causes. A fix for a guessed cause is a second bug.',
  },
  {
    title: 'Agents on the team',
    body: 'Most days I run several coding agents in parallel and review their work like a lead reviews a team. The skills are the same: clear tasks, honest checks, and a high bar for done.',
  },
];

// Paraphrased, with no names. Quote a teammate by name only with their permission.
export const recognition = [
  'Recognized in a company shoutout for always helping teammates and sharing knowledge.',
  'Known for reviewing teammates’ pull requests without being asked.',
  'Fixed a customer-facing incident about two and a half hours after the report.',
];

// Nodes for the interactive integration map in the hero.
export type MapNode = {
  id: string;
  label: string;
  group: 'hub' | 'surface' | 'data' | 'tools' | 'apps';
  title: string;
  body: string;
};

export const mapNodes: MapNode[] = [
  {
    id: 'runneth',
    label: 'Runneth',
    group: 'hub',
    title: 'Runneth',
    body: 'The Motion AI agent for creative strategy. Every connection on this map goes through it.',
  },
  {
    id: 'claude',
    label: 'Claude',
    group: 'surface',
    title: 'Claude',
    body: 'The Motion MCP server gives Claude live Motion data. The Runneth MCP server lets Claude hand work to Runneth.',
  },
  {
    id: 'assistants',
    label: 'Other assistants',
    group: 'surface',
    title: 'Other AI assistants',
    body: 'Any MCP client can sign in with OAuth, give work to Runneth, and read the results.',
  },
  {
    id: 'slack',
    label: 'Slack',
    group: 'surface',
    title: 'Slack',
    body: 'Runneth answers in channels and threads, shows live progress, and stays quiet when a message is for someone else.',
  },
  {
    id: 'web',
    label: 'Runneth chat',
    group: 'surface',
    title: 'Runneth chat',
    body: 'Live task progress, an outline for long conversations, and filters that stay in place.',
  },
  {
    id: 'motion',
    label: 'Motion data',
    group: 'data',
    title: 'Motion data',
    body: 'Reports, creative insights, and brand context, served to AI assistants by the Motion MCP server.',
  },
  {
    id: 'mcp',
    label: 'Your MCP servers',
    group: 'tools',
    title: 'Your MCP servers',
    body: 'Customers connect their own MCP servers from chat, with OAuth. Runneth discovers the tools and uses them.',
  },
  {
    id: 'apps',
    label: 'Business apps',
    group: 'apps',
    title: 'Business apps',
    body: 'One integration layer and one OAuth sign-in. Credentials stay outside the agent sandbox.',
  },
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

// Real request paths through the map. Each path uses edges from mapEdges.
export type MapScenario = { id: string; label: string; path: string[]; title: string; body: string };

export const mapScenarios: MapScenario[] = [
  {
    id: 'motion-mcp',
    label: 'Claude reads Motion',
    path: ['claude', 'motion', 'claude'],
    title: 'Motion MCP',
    body: 'Claude signs in with OAuth and reads live Motion reports and creative insights through the Motion MCP server.',
  },
  {
    id: 'runneth-mcp',
    label: 'Agents delegate to Runneth',
    path: ['assistants', 'runneth', 'motion', 'runneth', 'assistants'],
    title: 'Runneth MCP',
    body: 'Another AI agent hands creative strategy work to Runneth over the Runneth MCP server. Runneth pulls Motion data and sends the result back.',
  },
  {
    id: 'mcp-client',
    label: 'Runneth uses your MCP servers',
    path: ['slack', 'runneth', 'mcp', 'runneth', 'slack'],
    title: 'MCP connections',
    body: 'A teammate asks in Slack. Runneth calls the customer’s own MCP server and answers in the thread.',
  },
  {
    id: 'apps',
    label: 'Runneth uses your apps',
    path: ['web', 'runneth', 'apps', 'runneth', 'web'],
    title: 'Business apps',
    body: 'In Runneth chat, the agent reads from a business app that the customer connected with one OAuth sign-in.',
  },
];

export type RunLine = {
  time: string;
  kind: 'step' | 'fail' | 'recover' | 'done';
  label: string;
  detail: string;
  status?: string;
};

// The run log in the Paper option. It shows a failure and a recovery.
export const runLog: RunLine[] = [
  { time: '09:02:11', kind: 'step', label: 'task', detail: 'weekly creative brief' },
  { time: '09:02:12', kind: 'step', label: 'mcp', detail: 'motion.reports  meta · 7d', status: 'ok' },
  { time: '09:02:13', kind: 'step', label: 'app', detail: 'sheets.read  budget plan', status: 'ok' },
  { time: '09:02:15', kind: 'fail', label: 'session', detail: 'worker exited unexpectedly' },
  { time: '09:02:15', kind: 'recover', label: 'contain', detail: 'other conversations unaffected' },
  { time: '09:02:16', kind: 'recover', label: 'resume', detail: 'from saved progress' },
  { time: '09:02:19', kind: 'step', label: 'tool', detail: 'slack.post  #creative-team', status: 'ok' },
  { time: '09:02:19', kind: 'done', label: 'done', detail: 'brief delivered' },
];
