// Startup and business idea building blocks. Everything here was written by
// hand. There are no market sizes, growth rates or scores: those cannot be
// known for an idea this early, so the tool helps people test it instead.

export type Skill =
  | 'coding' | 'design' | 'writing' | 'marketing' | 'sales' | 'teaching'
  | 'data' | 'finance' | 'operations' | 'video' | 'community';

export type Model = 'service' | 'product' | 'software' | 'content' | 'marketplace';
export type Level = 0 | 1 | 2;

export const SKILLS: { id: Skill; label: string }[] = [
  { id: 'coding', label: 'Coding' },
  { id: 'design', label: 'Design' },
  { id: 'writing', label: 'Writing' },
  { id: 'marketing', label: 'Marketing' },
  { id: 'sales', label: 'Selling' },
  { id: 'teaching', label: 'Teaching' },
  { id: 'data', label: 'Data and spreadsheets' },
  { id: 'finance', label: 'Finance and bookkeeping' },
  { id: 'operations', label: 'Organizing and admin' },
  { id: 'video', label: 'Video and photos' },
  { id: 'community', label: 'Building communities' },
];

export const MODELS: { id: Model; label: string; hint: string }[] = [
  { id: 'service', label: 'A service', hint: 'You do the work for clients' },
  { id: 'product', label: 'A digital product', hint: 'Templates, courses, guides' },
  { id: 'software', label: 'Software', hint: 'An app or tool people pay for' },
  { id: 'content', label: 'Content and audience', hint: 'Newsletter, channel, community' },
  { id: 'marketplace', label: 'A marketplace', hint: 'Connect buyers and sellers' },
];

export const HOURS: { id: Level; label: string; hint: string }[] = [
  { id: 0, label: 'Under 10 hours a week', hint: 'A side project' },
  { id: 1, label: '10 to 25 hours a week', hint: 'Serious part time' },
  { id: 2, label: 'Full time', hint: 'This is the main thing' },
];

export const BUDGETS: { id: Level; label: string; hint: string }[] = [
  { id: 0, label: 'Under $500', hint: 'Mostly your time' },
  { id: 1, label: '$500 to $5,000', hint: 'Some tools, ads or gear' },
  { id: 2, label: 'Over $5,000', hint: 'Room to build and hire' },
];

export interface Industry {
  id: string;
  name: string;
  customers: string; // who pays, plural
  clients: string; // the people they serve
  work: string; // the core activity
  pain: string; // a common headache, in plain words
  booking: boolean; // runs on appointments or bookings
}

export const INDUSTRIES: Industry[] = [
  { id: 'dental', name: 'Dental clinics', customers: 'independent dental clinics', clients: 'patients', work: 'appointments', pain: 'missed appointments and late cancellations', booking: true },
  { id: 'fitness', name: 'Gyms and trainers', customers: 'small gyms and personal trainers', clients: 'members', work: 'classes and sessions', pain: 'members who stop showing up after the first few weeks', booking: true },
  { id: 'restaurants', name: 'Restaurants and cafes', customers: 'independent restaurants and cafes', clients: 'diners', work: 'orders and reservations', pain: 'quiet weeknights and high delivery app fees', booking: true },
  { id: 'realestate', name: 'Real estate', customers: 'real estate agents', clients: 'home buyers and sellers', work: 'listings and viewings', pain: 'keeping listings, leads and follow ups organized', booking: true },
  { id: 'trades', name: 'Home trades', customers: 'plumbers, electricians and other trades', clients: 'homeowners', work: 'jobs and quotes', pain: 'chasing quotes and unpaid invoices', booking: true },
  { id: 'salons', name: 'Salons and beauty', customers: 'hair and beauty salons', clients: 'clients', work: 'bookings', pain: 'no shows and empty slots in the diary', booking: true },
  { id: 'tutoring', name: 'Tutors and small schools', customers: 'tutors and small learning centers', clients: 'students and parents', work: 'lessons', pain: 'scheduling lessons and keeping parents updated', booking: true },
  { id: 'ecommerce', name: 'Online stores', customers: 'small online stores', clients: 'shoppers', work: 'orders', pain: 'abandoned carts and customers who buy only once', booking: false },
  { id: 'creators', name: 'Creators', customers: 'YouTubers, podcasters and other creators', clients: 'fans', work: 'content', pain: 'turning an audience into steady income', booking: false },
  { id: 'freelancers', name: 'Freelancers', customers: 'freelancers', clients: 'clients', work: 'projects', pain: 'finding clients and getting paid on time', booking: false },
  { id: 'accounting', name: 'Accounting firms', customers: 'small accounting and bookkeeping firms', clients: 'clients', work: 'monthly books', pain: 'chasing clients for receipts and documents', booking: false },
  { id: 'legal', name: 'Small law firms', customers: 'small law firms', clients: 'clients', work: 'cases', pain: 'slow intake and chasing documents', booking: true },
  { id: 'clinics', name: 'Physio and wellness', customers: 'physiotherapy and wellness clinics', clients: 'patients', work: 'treatment plans', pain: 'patients who drop off before they finish treatment', booking: true },
  { id: 'nonprofits', name: 'Nonprofits', customers: 'small nonprofits', clients: 'donors and volunteers', work: 'fundraising', pain: 'keeping donors engaged between campaigns', booking: false },
  { id: 'recruiting', name: 'Recruiters', customers: 'recruiters and small HR teams', clients: 'candidates', work: 'hiring', pain: 'slow screening and candidates who go quiet', booking: false },
  { id: 'devteams', name: 'Software teams', customers: 'small software teams', clients: 'developers', work: 'code and releases', pain: 'repetitive setup work and documentation nobody keeps up to date', booking: false },
  { id: 'landlords', name: 'Landlords', customers: 'small landlords and property managers', clients: 'tenants', work: 'rentals', pain: 'maintenance requests and late rent', booking: false },
  { id: 'events', name: 'Event planners', customers: 'event and wedding planners', clients: 'couples and hosts', work: 'events', pain: 'keeping vendors, budgets and guest lists in one place', booking: true },
  { id: 'pets', name: 'Pet services', customers: 'pet groomers, walkers and sitters', clients: 'pet owners', work: 'bookings', pain: 'last minute cancellations and irregular repeat bookings', booking: true },
  { id: 'tourism', name: 'Tours and guesthouses', customers: 'small tour operators and guesthouses', clients: 'travelers', work: 'bookings', pain: 'relying on booking sites that take a large commission', booking: true },
];

export interface Pattern {
  id: string;
  model: Model;
  needs: Skill[]; // at least one of these
  helps: Skill[]; // nice to have
  minBudget: Level;
  minHours: Level;
  bookingOnly?: boolean;
  skip?: string[]; // industries where it makes no sense
  title: string;
  pitch: string;
  problem: string;
  firstVersion: string;
  angle: string;
  channels: string;
  revenue: string;
  costs: string;
  costBand: string;
  timeBand: string;
  metric: string;
  risks: string[];
}

// Placeholders: {customers} {clients} {work} {pain}. A capital {Customers}
// starts a sentence.
export const PATTERNS: Pattern[] = [
  // Services
  {
    id: 'content-service', model: 'service', needs: ['writing', 'video', 'marketing'], helps: ['design'], minBudget: 0, minHours: 0,
    title: 'Monthly content service for {customers}',
    pitch: 'Write and schedule posts, emails and short videos so {customers} stay visible without doing it themselves.',
    problem: 'Most {customers} know they should post and email regularly, but the work always loses to {work}.',
    firstVersion: 'A fixed monthly package: 8 posts and 2 emails, approved in one short call each month.',
    angle: 'Specialize in {customers} only, so every post speaks to {clients} and you reuse what works.',
    channels: 'Direct messages to local {customers}, industry Facebook and LinkedIn groups, referrals from your first clients.',
    revenue: 'A monthly retainer per client. Look at what local agencies and freelancers charge before you set your price.',
    costs: 'A scheduling tool and a design tool, often on free or low cost plans.',
    costBand: 'Under $500', timeBand: 'Days to first offer',
    metric: 'Clients who renew after three months',
    risks: ['Clients may not see results quickly, so agree on what you will report each month.', 'Scope creep: write down exactly what the package includes.'],
  },
  {
    id: 'website-care', model: 'service', needs: ['coding', 'design'], helps: ['marketing', 'writing'], minBudget: 0, minHours: 0,
    title: 'Website setup and care plan for {customers}',
    pitch: 'Build a fast, simple site for {customers} and keep it updated for a monthly fee.',
    problem: 'Many {customers} have an outdated site, or none, and no time to deal with {work} online.',
    firstVersion: 'One template you adapt for each client: home, services, prices, contact and a way to book or enquire.',
    angle: 'One niche, one template, so you can deliver in days instead of weeks.',
    channels: 'Look up {customers} nearby with weak or missing websites and contact them with a short, specific note.',
    revenue: 'A setup fee plus a monthly care plan for hosting, updates and small changes.',
    costs: 'Hosting and a domain per client, which you can bill back.',
    costBand: 'Under $500', timeBand: '1 to 2 weeks for the template',
    metric: 'Clients on the monthly care plan',
    risks: ['Website builders make it easy to do it yourself, so sell the time saved and the results.', 'Clients slow to send content: ask for it before you start.'],
  },
  {
    id: 'booking-setup', model: 'service', needs: ['operations', 'coding'], helps: ['marketing'], minBudget: 0, minHours: 0, bookingOnly: true,
    title: 'Online booking setup for {customers}',
    pitch: 'Set up online booking, reminders and deposits for {customers} using tools that already exist.',
    problem: '{Customers} lose money to {pain}, and many still book by phone or messages.',
    firstVersion: 'A done for you setup of an existing booking tool with reminder texts, plus a one page guide for staff.',
    angle: 'You are not building software. You are the person who sets it up properly and trains the team.',
    channels: 'Call or visit {customers} who only take bookings by phone, and offer to set it up this week.',
    revenue: 'A one off setup fee, with an optional monthly support plan.',
    costs: 'Mostly your time. The client pays for the booking tool.',
    costBand: 'Under $500', timeBand: 'Days to first offer',
    metric: 'Drop in no shows for each client after one month',
    risks: ['Some booking tools offer free setup help, so focus on doing it end to end.', 'Staff may resist change: include training.'],
  },
  {
    id: 'ads-service', model: 'service', needs: ['marketing'], helps: ['data', 'writing', 'design'], minBudget: 0, minHours: 0,
    title: 'Local ads management for {customers}',
    pitch: 'Run search and social ads for {customers} and report in plain language what each ad brought in.',
    problem: '{Customers} often try ads once, spend money without clear results and give up.',
    firstVersion: 'A 30 day trial campaign with one goal, a fixed small budget and a weekly one paragraph report.',
    angle: 'Report on {work} gained, not clicks, so owners see the money they made.',
    channels: 'Owners who already run ads but post about poor results in local business groups.',
    revenue: 'A monthly management fee on top of the ad budget the client pays directly.',
    costs: 'Reporting tools if you need them. The client pays for the ads.',
    costBand: 'Under $500', timeBand: 'Days to first offer',
    metric: 'Cost per new booking or sale for each client',
    risks: ['Results depend on the client following up leads quickly.', 'Ad platforms change often, so keep learning.'],
  },
  {
    id: 'bookkeeping', model: 'service', needs: ['finance'], helps: ['operations', 'data'], minBudget: 0, minHours: 0, skip: ['accounting'],
    title: 'Bookkeeping for {customers}',
    pitch: 'Keep the books tidy each month for {customers}, with a short summary owners actually read.',
    problem: 'Owners of {customers} often leave bookkeeping until tax time, then pay to untangle a mess.',
    firstVersion: 'A fixed monthly package: categorize transactions, reconcile accounts and send a one page summary.',
    angle: 'Know the money side of {work} well enough to spot problems early.',
    channels: 'Referrals from accountants who want tidy books from clients, plus {customers} you already know.',
    revenue: 'A fixed monthly fee based on the number of transactions.',
    costs: 'Accounting software, often paid by the client, and any training or certification your area expects.',
    costBand: 'Under $500', timeBand: '1 to 4 weeks',
    metric: 'Clients kept for more than a year',
    risks: ['Rules differ by country: check what qualifications you need before you offer it.', 'Mistakes are costly, so keep clear records of what you did.'],
  },
  {
    id: 'automation-service', model: 'service', needs: ['coding', 'operations'], helps: ['data'], minBudget: 0, minHours: 0,
    title: 'Workflow automation for {customers}',
    pitch: 'Connect the tools {customers} already use so routine admin around {work} runs on its own.',
    problem: 'Staff at {customers} retype the same details between email, forms, spreadsheets and calendars.',
    firstVersion: 'Automate one painful task for one client, such as turning enquiry forms into calendar entries and follow up emails.',
    angle: 'Sell an outcome, like hours saved each week on {work}, not the tools.',
    channels: 'Ask {customers} which task they repeat most, then show a short screen recording of it automated.',
    revenue: 'A fixed price per automation, plus a monthly fee to monitor and fix them.',
    costs: 'Automation tool subscriptions, often paid by the client.',
    costBand: 'Under $500', timeBand: '1 to 2 weeks',
    metric: 'Hours saved per client each month',
    risks: ['Automations break when apps change, so monitoring matters.', 'Handle client data carefully and agree who can access what.'],
  },
  {
    id: 'reviews-service', model: 'service', needs: ['marketing', 'writing'], helps: ['sales'], minBudget: 0, minHours: 0,
    title: 'Reviews and reputation service for {customers}',
    pitch: 'Help {customers} collect more genuine reviews and reply well to every one.',
    problem: '{Clients} read reviews before choosing, yet many {customers} never ask happy {clients} to leave one.',
    firstVersion: 'Set up a simple ask after each visit or order, and write replies to new reviews each week.',
    angle: 'Only genuine reviews from real {clients}, which also keeps your clients on the right side of platform rules.',
    channels: 'Contact {customers} with few or old reviews, showing exactly how their profile compares with nearby competitors.',
    revenue: 'A monthly fee per location.',
    costs: 'Mostly your time. Review request tools are optional.',
    costBand: 'Under $500', timeBand: 'Days to first offer',
    metric: 'New reviews per client each month',
    risks: ['Never buy or fake reviews: platforms ban it and it can break the law.', 'Results depend on the client actually asking.'],
  },
  {
    id: 'media-packages', model: 'service', needs: ['video', 'design'], helps: ['marketing'], minBudget: 1, minHours: 0,
    title: 'Photo and short video packages for {customers}',
    pitch: 'Shoot a month of photos and short videos for {customers} in one visit.',
    problem: '{Customers} need fresh visuals for their website and social media, and phone photos rarely do them justice.',
    firstVersion: 'A half day shoot that delivers 30 edited photos and 4 short videos, sized for each platform.',
    angle: 'Plan every shoot around what {clients} want to see before they book or buy.',
    channels: 'Offer a free sample shoot to one well known local business and use it as your portfolio.',
    revenue: 'A fixed package price, with a discount for a monthly or quarterly visit.',
    costs: 'Camera, lens, lighting and editing software if you do not have them yet.',
    costBand: '$500 to $5,000', timeBand: '1 to 2 weeks',
    metric: 'Repeat bookings per client',
    risks: ['Gear costs add up, so start with what you have.', 'Get written permission before filming staff or customers.'],
  },
  {
    id: 'admin-support', model: 'service', needs: ['operations', 'sales'], helps: ['writing', 'finance'], minBudget: 0, minHours: 0,
    title: 'Remote admin support for {customers}',
    pitch: 'Take over inbox, scheduling and follow ups for busy {customers}.',
    problem: 'Owners of {customers} spend evenings on email and admin instead of {work}.',
    firstVersion: 'A block of hours each week for inbox, calendar and follow ups, with a written checklist of tasks.',
    angle: 'Learn the tools and the language of {customers}, so you need less training than a general assistant.',
    channels: 'Industry groups, referrals and a clear profile on freelance sites that names the niche.',
    revenue: 'A monthly retainer for a fixed number of hours.',
    costs: 'Very little beyond a laptop and a password manager.',
    costBand: 'Under $500', timeBand: 'Days to first offer',
    metric: 'Hours booked per week across clients',
    risks: ['Income is tied to your hours, so raise prices as you get faster.', 'You will handle private data: agree on how you keep it safe.'],
  },
  {
    id: 'workshops', model: 'service', needs: ['teaching'], helps: ['coding', 'marketing', 'writing'], minBudget: 0, minHours: 0,
    title: 'Hands on AI workshops for {customers}',
    pitch: 'Teach teams at {customers} to use AI tools safely for everyday work around {work}.',
    problem: '{Customers} hear a lot about AI but do not know which tasks it can help with, or what is safe to paste in.',
    firstVersion: 'A two hour workshop with ten real tasks from their own work and a one page checklist to keep.',
    angle: 'Every example comes from the daily work of {customers}, not generic demos.',
    channels: 'Industry associations, local business groups and a free 30 minute taster session.',
    revenue: 'A fee per workshop, plus follow up sessions or a monthly question hour.',
    costs: 'Mostly preparation time and any venue costs.',
    costBand: 'Under $500', timeBand: '1 to 2 weeks to prepare',
    metric: 'Workshops that lead to a second booking',
    risks: ['AI tools change quickly, so update the material often.', 'Be clear about privacy limits when you teach.'],
  },

  // Digital products
  {
    id: 'template-pack', model: 'product', needs: ['writing', 'design', 'operations'], helps: ['marketing'], minBudget: 0, minHours: 0,
    title: 'Template pack for {customers}',
    pitch: 'Ready forms, checklists, scripts and email templates that {customers} use for {work}.',
    problem: '{Customers} rebuild the same documents again and again, and the results vary.',
    firstVersion: 'Ten templates that solve one job well, for example everything needed to deal with {pain}.',
    angle: 'Templates written for one industry beat general ones, because the wording already fits.',
    channels: 'Share one free template in industry groups and collect emails from people who want the full set.',
    revenue: 'A one off price, with updates for buyers. Some sellers add a bundle for teams.',
    costs: 'A store platform that takes a fee per sale.',
    costBand: 'Under $500', timeBand: '1 to 3 weeks',
    metric: 'Visitors to buyers on your sales page',
    risks: ['Templates are easy to copy, so build trust and keep improving them.', 'Free templates exist for most things: be specific.'],
  },
  {
    id: 'short-course', model: 'product', needs: ['teaching', 'video'], helps: ['writing', 'marketing'], minBudget: 0, minHours: 1,
    title: 'Short online course: how {customers} can deal with {pain}',
    pitch: 'A practical video course, under two hours, that solves one problem for {customers}.',
    problem: '{Customers} deal with {pain}, and there is little practical training aimed at them.',
    firstVersion: 'Teach it live to a small paid group first, record the sessions and turn them into the course.',
    angle: 'One problem, one result, taught by someone who has done it.',
    channels: 'Your own audience, industry groups, and guest spots on podcasts or newsletters for {customers}.',
    revenue: 'A one off course price. Live cohorts can charge more.',
    costs: 'A course platform and a decent microphone.',
    costBand: 'Under $500', timeBand: '3 to 6 weeks',
    metric: 'Students who finish the course',
    risks: ['Courses are hard to sell without an audience, so pre sell before you record.', 'Keep it short: long courses rarely get finished.'],
  },
  {
    id: 'spreadsheet-system', model: 'product', needs: ['data', 'operations'], helps: ['design', 'teaching'], minBudget: 0, minHours: 0,
    title: 'Spreadsheet or Notion system for {customers} to run {work}',
    pitch: 'A ready made tracker that helps {customers} manage {work} without new software.',
    problem: '{Customers} juggle notes, messages and memory to keep track of {work}.',
    firstVersion: 'One clean template with instructions and a short video walkthrough.',
    angle: 'Uses tools people already know, so there is nothing new to install or pay for monthly.',
    channels: 'Template marketplaces, industry groups and a free lite version.',
    revenue: 'A one off price, plus a paid setup call for those who want help.',
    costs: 'Almost none besides a store fee.',
    costBand: 'Under $500', timeBand: '1 to 2 weeks',
    metric: 'Sales per month and refund requests',
    risks: ['Some buyers will want full software later.', 'Support questions take time: write good instructions.'],
  },

  // Software
  {
    id: 'reminder-app', model: 'software', needs: ['coding'], helps: ['design', 'marketing'], minBudget: 1, minHours: 1, bookingOnly: true,
    title: 'Booking and reminder app built for {customers}',
    pitch: 'A simple booking tool designed only for {customers}, with reminders that cut {pain}.',
    problem: 'General booking tools are built for every business, so {customers} work around features they do not need.',
    firstVersion: 'Online booking, text and email reminders, and a waiting list that fills cancelled slots.',
    angle: 'Built around how {customers} actually run {work}, with setup done in one call.',
    channels: 'Offer it free to five {customers} for honest feedback, then ask them to introduce you to peers.',
    revenue: 'A monthly subscription per location.',
    costs: 'Hosting, text message fees and your build time. Text costs grow with use.',
    costBand: '$500 to $5,000', timeBand: '2 to 4 months',
    metric: 'Paying locations still active after three months',
    risks: ['Strong existing booking tools compete on price, so the niche fit must be clearly better.', 'Bookings are business critical: downtime hurts.'],
  },
  {
    id: 'client-portal', model: 'software', needs: ['coding'], helps: ['design', 'operations'], minBudget: 1, minHours: 1,
    title: 'Simple client portal for {customers}',
    pitch: 'One place where {clients} see updates, files and invoices from {customers}.',
    problem: 'Updates about {work} are scattered across email, messages and phone calls, so {clients} keep asking for status.',
    firstVersion: 'A secure page per client with a status, shared files and a message thread.',
    angle: 'Much simpler than big project tools, made for how {customers} talk to {clients}.',
    channels: 'Build it for one firm first, then use their story to reach similar {customers}.',
    revenue: 'A monthly subscription per firm, priced by number of active clients.',
    costs: 'Hosting, file storage and security reviews.',
    costBand: '$500 to $5,000', timeBand: '2 to 4 months',
    metric: 'Clients who log in each week',
    risks: ['You will store private files, so security and backups must be solid from day one.', 'Firms may already pay for a tool that does part of this.'],
  },
  {
    id: 'ai-drafts', model: 'software', needs: ['coding'], helps: ['data', 'writing'], minBudget: 1, minHours: 1,
    title: 'AI reply assistant for {customers}',
    pitch: 'Drafts replies to common questions from {clients}, which staff check and send.',
    problem: 'Staff at {customers} answer the same questions about {work} many times a day.',
    firstVersion: 'Connect to one inbox, suggest replies from the business’s own answers, and let staff edit before sending.',
    angle: 'A person always approves the reply, which keeps answers accurate and builds trust.',
    channels: 'Show {customers} their own most common questions answered in seconds in a live demo.',
    revenue: 'A monthly subscription per inbox or per seat.',
    costs: 'AI model usage, hosting and build time. Usage costs grow with volume.',
    costBand: '$500 to $5,000', timeBand: '1 to 3 months',
    metric: 'Share of drafts sent with few or no edits',
    risks: ['AI can state wrong things, so keep a human approval step.', 'Big email and help desk tools are adding similar features.'],
  },
  {
    id: 'dashboard', model: 'software', needs: ['data', 'coding'], helps: ['finance', 'design'], minBudget: 0, minHours: 1,
    title: 'Simple numbers dashboard for {customers}',
    pitch: 'Pull the key numbers for {customers} into one page they check each Monday.',
    problem: 'Owners of {customers} rarely see clear numbers on {work} until it is too late to act.',
    firstVersion: 'A dashboard built by hand for three clients from their existing exports, updated weekly.',
    angle: 'Five numbers that matter for {customers}, not fifty charts.',
    channels: 'Offer a free one off report and show what it reveals about their business.',
    revenue: 'Start as a monthly service, then turn the repeat work into software.',
    costs: 'Spreadsheet or dashboard tools, then hosting if you build software.',
    costBand: 'Under $500', timeBand: '2 to 6 weeks',
    metric: 'Clients who make a decision based on the report',
    risks: ['Getting data out of each tool can be messy.', 'Owners may not act on numbers without advice.'],
  },
  {
    id: 'follow-up-tool', model: 'software', needs: ['coding'], helps: ['marketing', 'design'], minBudget: 1, minHours: 1,
    title: 'Automatic follow up tool for {customers}',
    pitch: 'Sends friendly, timely follow ups to {clients} so {customers} lose fewer of them.',
    problem: '{Customers} struggle with {pain}, mostly because nobody has time to follow up consistently.',
    firstVersion: 'A sequence of three messages triggered by one event, with easy opt out and a simple results page.',
    angle: 'Messages written for {customers} out of the box, so setup takes minutes.',
    channels: 'Partner with consultants and agencies that already serve {customers}.',
    revenue: 'A monthly subscription, priced by number of contacts.',
    costs: 'Email and text sending fees, hosting and build time.',
    costBand: '$500 to $5,000', timeBand: '1 to 3 months',
    metric: '{Clients} won back per customer each month',
    risks: ['Messaging rules and consent laws apply: build opt in and opt out properly.', 'Customer relationship tools already offer sequences.'],
  },

  // Content and audience
  {
    id: 'newsletter', model: 'content', needs: ['writing'], helps: ['marketing', 'community'], minBudget: 0, minHours: 0,
    title: 'Weekly newsletter for {customers}',
    pitch: 'A short weekly email with practical tips, tools and news for {customers}.',
    problem: '{Customers} have little time to keep up with changes that affect {work}.',
    firstVersion: 'Publish five issues before you promote it, so new readers see a track record.',
    angle: 'Written from the inside, with things readers can use on Monday morning.',
    channels: 'Industry groups, cross promotion with other newsletters, and a useful free resource for sign ups.',
    revenue: 'Sponsors once you have a loyal audience, and later a paid tier or products.',
    costs: 'A newsletter platform, free until your list grows.',
    costBand: 'Under $500', timeBand: 'Months to build an audience',
    metric: 'Open rate and replies from readers',
    risks: ['Audiences grow slowly, so plan for many months before income.', 'Consistency matters more than length.'],
  },
  {
    id: 'video-channel', model: 'content', needs: ['video', 'teaching'], helps: ['writing', 'marketing'], minBudget: 0, minHours: 1,
    title: 'Video channel explaining {work} for {customers}',
    pitch: 'Short and long videos that answer the questions {customers} search for.',
    problem: '{Customers} search for answers about {pain} and find generic or outdated videos.',
    firstVersion: 'Ten videos that each answer one specific search, recorded with the gear you have.',
    angle: 'Specific, searchable answers for one audience instead of broad entertainment.',
    channels: 'Search inside YouTube and TikTok, plus sharing clips where {customers} already talk.',
    revenue: 'Platform payouts once eligible, sponsors, and your own products or services.',
    costs: 'A microphone and editing software.',
    costBand: 'Under $500', timeBand: 'Months to build an audience',
    metric: 'Average view duration and subscribers per video',
    risks: ['Growth is slow and uncertain.', 'Platforms change their rules and payouts.'],
  },
  {
    id: 'community', model: 'content', needs: ['community', 'teaching'], helps: ['marketing', 'writing'], minBudget: 0, minHours: 1,
    title: 'Paid community for {customers}',
    pitch: 'A members only group where {customers} share what works and get expert answers.',
    problem: 'Running {customers} can be lonely, and good advice about {pain} is hard to find.',
    firstVersion: 'Start a free group of 30 members, run weekly calls, then invite the most active into a paid tier.',
    angle: 'Small, vetted and practical, with real people in the same line of work.',
    channels: 'Personal invitations, your network, and guests who bring their own audiences.',
    revenue: 'A monthly or yearly membership.',
    costs: 'A community platform and your time hosting.',
    costBand: 'Under $500', timeBand: '1 to 3 months',
    metric: 'Members active each week',
    risks: ['Communities need steady hosting, or they go quiet.', 'Hard to start without an existing network.'],
  },

  // Marketplaces
  {
    id: 'directory', model: 'marketplace', needs: ['coding', 'marketing', 'design'], helps: ['writing', 'sales'], minBudget: 0, minHours: 1,
    title: 'Trusted directory of {customers} for {clients}',
    pitch: 'A local or niche directory where {clients} find {customers} that meet clear standards.',
    problem: '{Clients} struggle to compare {customers}, and general review sites are noisy.',
    firstVersion: 'A simple site listing 30 hand checked {customers} in one city or niche, with clear criteria.',
    angle: 'Curated and checked, not every business that signs up.',
    channels: 'Search engine traffic for local searches, plus the listed businesses sharing their badge.',
    revenue: 'Paid featured listings or a yearly membership for listed businesses.',
    costs: 'Hosting, a domain and time spent checking businesses.',
    costBand: 'Under $500', timeBand: '1 to 2 months',
    metric: 'Enquiries sent to listed businesses',
    risks: ['Search traffic takes time to build.', 'Listings go out of date, so plan regular checks.'],
  },
  {
    id: 'job-board', model: 'marketplace', needs: ['marketing', 'coding'], helps: ['community', 'sales'], minBudget: 0, minHours: 1, skip: ['recruiting'],
    title: 'Niche job board for {customers}',
    pitch: 'A job board just for roles at {customers}, where the right candidates actually look.',
    problem: '{Customers} post on big job sites and get many applications from people outside the field.',
    firstVersion: 'Post 20 real openings with permission, collect candidate emails, then charge for new posts.',
    angle: 'One field, so both employers and candidates know it is the right place.',
    channels: 'Industry groups, a weekly jobs email and partnerships with training providers.',
    revenue: 'A fee per job post, with packages for frequent hirers.',
    costs: 'Job board software or hosting.',
    costBand: 'Under $500', timeBand: '1 to 2 months',
    metric: 'Paid posts per month',
    risks: ['You need both employers and candidates at the same time.', 'Large job sites are free for some employers.'],
  },
  {
    id: 'matching', model: 'marketplace', needs: ['sales', 'coding', 'operations'], helps: ['marketing'], minBudget: 2, minHours: 2,
    title: 'Matching service between {clients} and {customers}',
    pitch: 'Match {clients} with the right {customers} and handle the booking end to end.',
    problem: 'Finding and booking good {customers} takes {clients} a lot of calls and guesswork.',
    firstVersion: 'Do the matching by hand over email or chat for one city before you build any software.',
    angle: 'Quality control and a smooth booking, not just a list of names.',
    channels: 'Local advertising for {clients} and direct recruitment of the best {customers}.',
    revenue: 'A commission on each booking or a fee from the business.',
    costs: 'Marketing to both sides, plus software once the manual version works.',
    costBand: 'Over $5,000', timeBand: '3 months or more',
    metric: 'Repeat bookings from the same {clients}',
    risks: ['Marketplaces need both sides at once and are hard to start.', 'People may book each other directly once introduced.'],
  },
];
