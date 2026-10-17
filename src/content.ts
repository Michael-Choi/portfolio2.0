// All copy on the site lives here. Edit this file to update the page.

export const profile = {
  name: 'Michael Choi',
  role: 'Senior Software Engineer',
  focus: 'AI agents & infrastructure',
  location: 'Toronto, Canada',
  email: 'michael@michaelchoi.ca',
  github: 'https://github.com/Michael-Choi',
  linkedin: 'https://www.linkedin.com/in/michael-b-choi/',
};

export const hero = {
  statement:
    'I build the software that lets AI agents do real work, and keeps them working when something breaks.',
  intro:
    'I work on Runneth, the AI agent for creative strategy at Motion. My work covers how it connects to customer tools, runs long tasks, and recovers when a step fails. Before Motion, I spent six years building and leading teams on production systems in travel and real estate tech.',
};

export type RunLine = {
  time: string;
  kind: 'step' | 'fail' | 'recover' | 'done';
  label: string;
  detail: string;
  status?: string;
};

// The hero run log. It shows the kind of failure and recovery I work on.
export const runLog: RunLine[] = [
  { time: '09:02:11', kind: 'step', label: 'task', detail: 'weekly creative brief' },
  { time: '09:02:12', kind: 'step', label: 'tool', detail: 'reports.fetch  meta · 7d', status: 'ok' },
  { time: '09:02:14', kind: 'step', label: 'tool', detail: 'app.screenshot  desktop + mobile', status: 'ok' },
  { time: '09:02:15', kind: 'fail', label: 'session', detail: 'worker exited unexpectedly' },
  { time: '09:02:15', kind: 'recover', label: 'contain', detail: 'other conversations unaffected' },
  { time: '09:02:16', kind: 'recover', label: 'resume', detail: 'from saved progress' },
  { time: '09:02:19', kind: 'step', label: 'tool', detail: 'slack.post  #creative-team', status: 'ok' },
  { time: '09:02:19', kind: 'done', label: 'done', detail: 'brief delivered' },
];

export const focus = {
  items: [
    'Build the systems that let AI agents use tools, run code, and finish long tasks.',
    'Help agents save their progress and recover when work stops.',
    'Connect agents to the tools and data that customers already use, with clear access rules.',
    'Find and fix problems in production, so agents are faster and more reliable.',
  ],
  stack: [
    'TypeScript',
    'Node.js',
    'React',
    'PostgreSQL',
    'MongoDB',
    'Redis',
    'Docker',
    'Azure',
    'GCP',
    'Datadog',
    'MCP',
    'OAuth',
  ],
};

export const featuredWork = {
  tag: 'Reliability · Runneth',
  title: 'One failed session stopped every conversation on the server',
  problem:
    'Agent conversations that shared a server failed together, again and again. The production symptoms did not point to one cause.',
  action:
    'I traced the crashes to session cleanup. When the service stopped a session that was already dead, it raised an error that no code caught, and that error stopped the shared agent service. I fixed the error handling and the process cleanup.',
  result:
    'A failure now stays in the session where it starts. The other conversations on the server continue.',
};

export type WorkItem = { tag: string; title: string; body: string };

export const work: WorkItem[] = [
  {
    tag: 'Tool connections',
    title: 'Customers bring their own tools',
    body: 'Customers connect their own tool servers and business apps to Runneth from chat, including servers that need OAuth. Runneth finds the tools and uses them. For connected apps, provider credentials stay in the backend, outside the agent sandbox.',
  },
  {
    tag: 'Self-review',
    title: 'Agents check their own apps',
    body: 'Runneth builds small apps for its users. I added desktop and mobile screenshot checks, so the agent can see layout problems in its own work and fix them.',
  },
  {
    tag: 'Automation',
    title: 'Workflows that start on events',
    body: 'I built the foundation for workflows that start when an event arrives, such as a webhook. It retries failed deliveries and protects against duplicate runs.',
  },
  {
    tag: 'Slack',
    title: 'Answers that reach Slack',
    body: 'Runneth works inside customer Slack workspaces. I recovered finished answers that failed before Slack showed them, made broken installs reconnectable, and moved Slack access to the bot’s own permissions.',
  },
  {
    tag: 'Infrastructure',
    title: 'Motion inside other AI assistants',
    body: 'Before Runneth, I worked on the core Motion platform. I built the sign-in flow and the tools that let assistants like Claude read Motion reports and creative insights, and made the connector run across many servers.',
  },
  {
    tag: 'Security',
    title: 'A new sign-in system, no lockouts',
    body: 'I connected a new authentication system to existing logins and API access, with metrics to compare login behavior before and after. Then I added two-factor authentication and organization-wide security rules.',
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
    title: 'Scoped API access',
    body: 'Organization-scoped tokens, so AI environments call Motion APIs only for workspaces in their own organization. Custom conversions stored for reuse in reports.',
  },
  {
    month: 'Feb',
    title: 'A new session system',
    body: 'Connected a new authentication system to existing sign-in and API access, with support for legacy logins and metrics to compare before and after.',
  },
  {
    month: 'Mar',
    title: 'Two-factor authentication',
    body: 'Added two-factor authentication with organization-wide requirements, and built the sign-in flow for the Claude connector to Motion.',
  },
  {
    month: 'Apr',
    title: 'Motion data in AI assistants',
    body: 'Built tools that expose Motion reports and creative insights to external assistants, and made the connector run across multiple servers.',
  },
  {
    month: 'May',
    milestone: 'Moved to the Runneth AI team',
    title: 'Connected apps',
    body: 'A reusable way for Runneth to use the business apps that customers connect. Recovered Slack answers that never appeared, and made broken installs reconnectable.',
  },
  {
    month: 'Jun',
    title: 'Clear Slack access',
    body: 'Moved Slack access to bot permissions, removed automatic channel joins, and fixed reply formats that blocked valid answers.',
  },
  {
    month: 'Jul',
    title: 'Contained failures',
    body: 'Kept session crashes away from the shared agent service. Compacted agent history and kept backups restorable. Added live task progress to chat.',
  },
  {
    month: 'Aug',
    title: 'Recovered stalled work',
    body: 'Let large batches of tool calls finish, unblocked background tasks after memory pressure, and cached shared instructions across conversations.',
  },
  {
    month: 'Sep',
    title: 'New tools and visual checks',
    body: 'Connections to customer tool servers with OAuth, screenshot checks for generated apps, and the foundation for event-triggered workflows.',
  },
  {
    month: 'Oct',
    title: 'Runneth for other agents',
    body: 'Remote MCP connection modes and an MCP conversation channel, so other AI assistants can give work to Runneth and read the results.',
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
          'Build agent runtime, tool connection, and Slack features for Runneth.',
          'Trace production failures across agents, integrations, and infrastructure, then fix the cause.',
        ],
      },
      {
        title: 'Senior Software Engineer, Infrastructure',
        dates: 'Jan – May 2026',
        points: [
          'Built authentication, two-factor sign-in, and secure API access for the Motion platform.',
          'Built the connector that gives external AI assistants access to Motion data.',
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
          'Designed a job scheduling system on GCP Pub/Sub with a leader/worker pattern that scales horizontally.',
          'Built WebRTC virtual tours, so agents could show properties during COVID-19.',
          'Moved large AngularJS pages to React.',
        ],
      },
    ],
  },
];

export const principles = [
  {
    title: 'Trace it before you fix it',
    body: 'I start from logs, traces, and the real failure. A fix for a guessed cause is a second bug.',
  },
  {
    title: 'Prove it end to end',
    body: 'Unit tests pass easily. Before I call work done, I run the real stack: the queue, the sandbox, and the message in Slack.',
  },
  {
    title: 'Say exactly what is true',
    body: '“Merged” is not “shipped”, and “tested once” is not “fixed”. I say which one it is.',
  },
  {
    title: 'Agents on the team',
    body: 'Most days I run several coding agents in parallel and review their work like a lead reviews a team. The skills are the same: clear tasks, honest checks, and a high bar for done.',
  },
];
