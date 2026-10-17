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
    'At Motion, I built the Motion MCP server, so assistants like Claude can work with live Motion data. Then I connected Runneth, the Motion AI agent for creative strategy, in both directions: other assistants can hand work to Runneth, and Runneth can use MCP servers and thousands of business apps.',
};

export const stats = [
  { value: '2', label: 'MCP servers I built or extended: Motion MCP and Runneth MCP' },
  { value: '1000s', label: 'business apps that Runneth can connect to' },
  { value: '15.6 → 1.3 MB', label: 'one large report for AI assistants, after compaction' },
  { value: '300+', label: 'merged pull requests in 2026' },
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
    body: 'I built the sign-in, the tools, and the scaling for the Motion MCP server. Marketers connect Motion to Claude, then ask about reports, creative insights, and brand context with live data.',
    impact: 'Two-factor users can sign in, the server scales across instances, and one large report dropped from 15.6 MB to 1.3 MB.',
    shipped: 'Mar – Apr 2026',
  },
  {
    tag: 'Runneth MCP',
    title: 'Runneth inside other assistants',
    body: 'I took the Runneth MCP server public: OAuth sign-in on the public domain, organization discovery, and a conversation channel. Other AI assistants hand creative strategy work to Runneth and read the rich results.',
    impact: 'Customers can use Runneth from the assistant they already work in.',
    shipped: 'Oct 2026',
  },
  {
    tag: 'MCP client',
    title: 'Runneth connects to any MCP server',
    body: 'Customers add their own MCP servers from chat, including servers that need OAuth. Runneth discovers the tools and uses them in its work. Connection modes live under advanced setup.',
    impact: 'Customers extend Runneth with their own tools. Motion does not need to build each one.',
    shipped: 'Sep – Oct 2026',
  },
  {
    tag: 'Integrations',
    title: 'Thousands of business apps',
    body: 'One integration layer connects Runneth to thousands of business apps. Customers sign in with OAuth once. Credentials stay in our backend, outside the agent sandbox.',
    impact: 'A new app is a configuration change, not a new integration project.',
    shipped: 'May 2026',
  },
];

export const productWork: Feature[] = [
  {
    tag: 'Slack',
    title: 'A teammate in Slack',
    body: 'Runneth works in private channels and threads, stays quiet when a message is for someone else, shows live progress, and recovers answers that failed to post.',
    impact: 'Fewer missed replies and fewer unwanted replies in customer workspaces.',
    shipped: 'May – Sep 2026',
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
    title: 'One failure stays in one conversation',
    body: 'I traced repeated crashes to session cleanup. An error from one dead session stopped the shared agent service and every conversation on the server. I contained it.',
    impact: 'A failed session no longer interrupts the other conversations on its server.',
    shipped: 'Jul 2026',
  },
  {
    tag: 'Security',
    title: 'Two-factor sign-in for every organization',
    body: 'I moved Motion to a new authentication system and kept legacy logins working. Then I added two-factor authentication and organization-wide security rules.',
    impact: 'Admins can require two-factor sign-in across their organization.',
    shipped: 'Feb – Mar 2026',
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
    title: 'A new sign-in system',
    body: 'A new authentication system behind existing logins and API access, with login metrics to compare before and after.',
  },
  {
    month: 'Mar',
    title: 'Two-factor sign-in and Claude OAuth',
    body: 'Two-factor authentication with organization-wide rules, and the OAuth flow for the Claude connector.',
  },
  {
    month: 'Apr',
    title: 'Motion MCP server',
    body: 'Tools for reports, creative insights, and brand context. A stateless server that scales across instances.',
  },
  {
    month: 'May',
    milestone: 'Moved to the Runneth AI team',
    title: 'Thousands of business apps',
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
    title: 'Runneth connects to MCP servers',
    body: 'Customer MCP servers with OAuth, screenshot checks for generated apps, and event-triggered routines.',
  },
  {
    month: 'Oct',
    title: 'Runneth MCP goes public',
    body: 'Public OAuth sign-in, organization discovery, and a conversation channel for other assistants.',
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
          'Shipped MCP connections, business app integrations, and the public Runneth MCP server.',
          'Shipped Slack, chat, app builder, and routine features for Runneth.',
        ],
      },
      {
        title: 'Senior Software Engineer, Infrastructure',
        dates: 'Jan – May 2026',
        points: [
          'Built the Motion MCP server that gives Claude access to Motion data.',
          'Shipped a new authentication system, two-factor sign-in, and scoped API access.',
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
    body: 'I start from logs, traces, and the real failure. A fix for a guessed cause is a second bug.',
  },
  {
    title: 'Agents on the team',
    body: 'Most days I run several coding agents in parallel and review their work like a lead reviews a team. The skills are the same: clear tasks, honest checks, and a high bar for done.',
  },
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
    label: '1000s of apps',
    group: 'apps',
    title: 'Thousands of business apps',
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
