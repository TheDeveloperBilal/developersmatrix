import type { BankQuestion, KeyPoint } from './bank-types';

// Third round. Engineering roles get system design. Product, data and
// management roles get the case interview their real loops use instead.

const ENGINEERING_ROLES = [
  'software-developer',
  'frontend-developer',
  'backend-developer',
  'fullstack-developer',
  'devops-engineer',
  'mobile-developer',
  'qa-engineer',
  'system-architect',
] as const;

const BACKEND_HEAVY = ['software-developer', 'backend-developer', 'fullstack-developer', 'devops-engineer', 'system-architect'] as const;

const DESIGN_HINTS = [
  'Start by asking or stating the requirements and rough scale.',
  'Sketch the main components and how a request flows through them.',
  'Cover how it scales, what can fail, and one tradeoff you made.',
];

const REQUIREMENTS: KeyPoint = {
  label: 'Clarified requirements and scale first',
  terms: 'requirement|requirements|clarify|assume|assumption|scale|users|requests per second|rps|qps|read heavy|write heavy|functional|non functional',
};

export const SYSTEM: BankQuestion[] = [
  // --------------------------------------------------------- System design
  {
    id: 'sys-url-shortener',
    roles: [...BACKEND_HEAVY],
    category: 'system',
    levels: ['entry', 'mid', 'senior'],
    question: 'Design a URL shortener like bit.ly.',
    anchors: 'url|short|shortener|link|redirect|bit ly',
    points: [
      REQUIREMENTS,
      { label: 'How short codes are generated without collisions', terms: 'base62|base 62|hash|counter|unique id|collision|random|snowflake|id generator|key generation' },
      { label: 'Data model and storage choice', terms: 'database|table|key value|nosql|sql|dynamodb|cassandra|postgres|mapping|schema' },
      { label: 'Redirect path with caching', terms: 'cache|redis|cdn|301|302|redirect|read path|hot links' },
      { label: 'Scaling and failure handling', terms: 'replica|replicas|shard|sharding|partition|load balancer|horizontal|failover|availability' },
      { label: 'Extras such as analytics, expiry or abuse', terms: 'analytics|click|expiry|expire|ttl|abuse|spam|malicious|custom alias|rate limit' },
    ],
    model:
      'I would confirm requirements first: create a short link, redirect fast, maybe custom aliases and expiry. Reads far outnumber writes, perhaps a hundred to one. For codes, I take a unique number from a counter or ID generator and encode it in base62, so seven characters give billions of codes with no collisions. The mapping lives in a key value store keyed by code. Redirects go through a cache such as Redis, since popular links are read constantly, and return a 302 if we want to count clicks, or 301 if we do not. Click events go onto a queue for analytics so they never slow the redirect. To scale, I run stateless app servers behind a load balancer and shard the store by code, with replicas for availability. I would add rate limits and a malicious link check on creation.',
    hints: DESIGN_HINTS,
    next: 'How would you support custom aliases without slowing down code generation?',
  },
  {
    id: 'sys-rate-limiter',
    roles: [...BACKEND_HEAVY],
    category: 'system',
    levels: ['mid', 'senior'],
    question: 'Design a rate limiter for a public API.',
    anchors: 'rate limit|rate limiter|limit|throttle|api|requests',
    points: [
      REQUIREMENTS,
      { label: 'Chose an algorithm and explained it', terms: 'token bucket|leaky bucket|fixed window|sliding window|sliding log|counter|refill' },
      { label: 'Where it runs, such as the gateway or middleware', terms: 'gateway|api gateway|middleware|edge|proxy|load balancer|before the service' },
      { label: 'Shared state across servers', terms: 'redis|shared|central|distributed|atomic|lua|incr|consistent|across servers|across instances' },
      { label: 'What the client sees', terms: '429|retry after|headers|remaining|x ratelimit|error response|backoff' },
      { label: 'Failure mode if the limiter store is down', terms: 'fail open|fail closed|fallback|redis down|degrade|local limit|timeout' },
    ],
    model:
      'First I would ask what we limit by, such as API key or IP, and the limits per plan. I would use a token bucket: each key has a bucket that refills at a steady rate and each request takes a token, which allows short bursts while holding the average. It runs at the API gateway so bad traffic never reaches the services. Since there are many gateway instances, the counters live in Redis, updated atomically with a Lua script so two servers cannot both take the last token. Rejected requests get a 429 with a Retry After header, and every response carries the remaining quota. If Redis is down, I would fail open with a rough per instance limit, because blocking every paying customer is worse than letting a little extra traffic through.',
    hints: DESIGN_HINTS,
    next: 'How would you give enterprise customers a higher limit without a deploy?',
  },
  {
    id: 'sys-chat',
    roles: [...BACKEND_HEAVY, 'mobile-developer'],
    category: 'system',
    levels: ['mid', 'senior'],
    question: 'Design a one to one chat system like WhatsApp.',
    anchors: 'chat|message|messages|messaging|whatsapp|conversation',
    points: [
      REQUIREMENTS,
      { label: 'Real time connection method', terms: 'websocket|websockets|long polling|persistent connection|socket|sse|server sent events' },
      { label: 'Message storage and ordering', terms: 'store|storage|database|cassandra|order|ordering|sequence|timestamp|conversation id|partition' },
      { label: 'Delivery to offline users', terms: 'offline|push notification|apns|fcm|queue|deliver later|inbox|undelivered' },
      { label: 'Delivery status and retries', terms: 'delivered|read receipt|ack|acknowledge|retry|at least once|dedupe|idempotent|message id' },
      { label: 'Scaling the connection layer', terms: 'connection server|gateway|presence|which server|routing|pub sub|horizontal|load balancer|millions of connections' },
    ],
    model:
      'Requirements: one to one messages, delivered in near real time, stored history, offline delivery and read receipts. Clients keep a WebSocket open to a connection server. When Alice sends a message, it gets a client generated ID and goes to the chat service, which writes it to a store partitioned by conversation ID with a sequence number for ordering, then acknowledges Alice. The service looks up which connection server Bob is on in a presence store and pushes it there. If Bob is offline, the message waits in his inbox and we send a push notification through APNs or FCM. Bob\'s client acknowledges delivery and read, which flows back to Alice. Retries use the message ID so duplicates are ignored. Connection servers scale horizontally, and a pub sub layer routes messages between them.',
    hints: DESIGN_HINTS,
    next: 'How would you extend this to group chats with a thousand members?',
  },
  {
    id: 'sys-news-feed',
    roles: [...BACKEND_HEAVY],
    category: 'system',
    levels: ['senior'],
    question: 'Design the home news feed for a social network.',
    anchors: 'feed|news feed|timeline|posts|followers|social',
    points: [
      REQUIREMENTS,
      { label: 'Fan out on write versus fan out on read', terms: 'fan out|fanout|push model|pull model|on write|on read|precompute|precomputed' },
      { label: 'Handled celebrity accounts with huge follower counts', terms: 'celebrity|celebrities|hybrid|many followers|millions of followers|hot user|influencer' },
      { label: 'Feed storage and cache', terms: 'cache|redis|feed cache|timeline cache|list of post ids|storage' },
      { label: 'Ranking', terms: 'rank|ranking|chronological|relevance|score|machine learning|signals' },
      { label: 'Pagination and media delivery', terms: 'pagination|cursor|infinite scroll|cdn|images|media|lazy' },
    ],
    model:
      'Requirements: users see recent posts from people they follow, loading in well under a second, with far more reads than writes. I would precompute feeds with fan out on write: when someone posts, a worker pushes the post ID into each follower\'s feed list in Redis. That makes reading cheap. The exception is accounts with millions of followers, where writing to every feed is too slow, so their posts are pulled at read time and merged in, which is the hybrid approach. The feed service fetches IDs, hydrates them from the post store and a cache, ranks them by recency plus engagement signals, and returns a page with a cursor. Images and video come from a CDN. Old feed entries expire, and inactive users get their feed built on demand.',
    hints: DESIGN_HINTS,
    next: 'How would you handle a user who follows 5,000 accounts?',
  },
  {
    id: 'sys-notifications',
    roles: [...BACKEND_HEAVY, 'mobile-developer'],
    category: 'system',
    levels: ['mid', 'senior'],
    question: 'Design a notification service that sends email, SMS and push notifications.',
    anchors: 'notification|notifications|email|sms|push|alert',
    points: [
      REQUIREMENTS,
      { label: 'A queue to decouple senders from delivery', terms: 'queue|kafka|sqs|rabbitmq|async|asynchronous|message broker|worker|workers' },
      { label: 'Separate channel workers and third party providers', terms: 'channel|provider|providers|sendgrid|twilio|apns|fcm|ses|adapter|per channel' },
      { label: 'User preferences and rate limits', terms: 'preference|preferences|opt out|unsubscribe|quiet hours|rate limit|frequency cap|settings' },
      { label: 'Retries, deduplication and failure handling', terms: 'retry|retries|backoff|dead letter|dlq|idempotent|dedupe|duplicate|fallback provider' },
      { label: 'Templates and tracking', terms: 'template|templates|tracking|delivered|opened|status|logs|analytics' },
    ],
    model:
      'Other services call one API with the user, the event type and the data. The notification service checks the user\'s preferences and quiet hours, renders the right template, and puts a job on a queue per channel, so a slow SMS provider never delays emails. Channel workers call providers such as an email service, an SMS gateway, or APNs and FCM for push. Each job has an idempotency key so retries never send twice, failures retry with backoff, and anything that keeps failing goes to a dead letter queue. I would keep a backup provider for critical channels. Every send and its status is logged so we can show delivery rates and debug complaints. Rate limits per user stop us flooding someone during an incident.',
    hints: DESIGN_HINTS,
    next: 'How would you make sure a password reset email is never delayed by a marketing blast?',
  },
  {
    id: 'sys-file-upload',
    roles: [...BACKEND_HEAVY, 'mobile-developer'],
    category: 'system',
    levels: ['mid', 'senior'],
    question: 'Design a service that lets users upload and share large files, like a simple Dropbox.',
    anchors: 'upload|file|files|storage|dropbox|share|download',
    points: [
      REQUIREMENTS,
      { label: 'Object storage for file content, database for metadata', terms: 'object storage|s3|blob|bucket|metadata|database|separate' },
      { label: 'Direct uploads with signed URLs', terms: 'presigned|pre signed|signed url|direct upload|upload directly|bypass the server' },
      { label: 'Chunked and resumable uploads', terms: 'chunk|chunks|chunked|multipart|resumable|resume|parts' },
      { label: 'Access control for sharing', terms: 'permission|permissions|access control|share link|acl|private|owner|expiring link' },
      { label: 'Downloads through a CDN and file processing', terms: 'cdn|download|virus|scan|thumbnail|processing|dedupe|hash|checksum' },
    ],
    model:
      'File bytes go to object storage like S3 and metadata, such as owner, name, size and permissions, goes in a database. The client asks our API to start an upload, and the API returns presigned URLs so the client uploads straight to storage without our servers carrying the data. Large files are split into chunks with multipart upload, so a dropped connection only resends the failed part and uploads can resume. When storage confirms completion, an event triggers a virus scan and thumbnails. Sharing creates a permission row or a signed link with an expiry, and every download checks permissions before issuing a short lived signed URL, served through a CDN. Checksums verify each chunk and can deduplicate identical files.',
    hints: DESIGN_HINTS,
    next: 'How would you sync changes when the same file is edited on two devices?',
  },
  {
    id: 'sys-frontend-dashboard',
    roles: ['frontend-developer', 'fullstack-developer'],
    category: 'system',
    levels: ['mid', 'senior'],
    question: 'Design the frontend architecture for an analytics dashboard with many charts and live updating data.',
    anchors: 'dashboard|frontend|charts|chart|widgets|ui|components',
    points: [
      REQUIREMENTS,
      { label: 'Component structure and reuse', terms: 'component|components|widget|reusable|design system|layout|composition' },
      { label: 'Data fetching and caching strategy', terms: 'react query|tanstack|swr|cache|caching|fetch|stale while revalidate|server state|api' },
      { label: 'Live updates without overloading the page', terms: 'websocket|polling|sse|server sent|throttle|debounce|batch updates|live' },
      { label: 'Rendering performance for many charts', terms: 'lazy|lazy load|virtualize|virtualization|memo|canvas|code split|web worker|intersection observer|only visible' },
      { label: 'Loading, error and empty states', terms: 'loading|skeleton|error state|error boundary|empty state|retry|fallback' },
    ],
    model:
      'I would build each chart as an independent widget that knows its own query and renders a loading skeleton, an error state with retry, and an empty state, wrapped in an error boundary so one broken chart does not blank the page. Server data goes through a cache like TanStack Query, so widgets sharing a query share one request, and filters live in the URL so views can be bookmarked. Live data comes over one shared WebSocket or SSE connection, and updates are batched every second or two instead of re rendering on every message. Charts below the fold load lazily when they scroll into view, heavy chart libraries are code split, and large series use canvas rather than SVG.',
    hints: DESIGN_HINTS,
    next: 'How would you test that a chart shows the right numbers?',
  },
  {
    id: 'sys-offline-sync',
    roles: ['mobile-developer', 'fullstack-developer'],
    category: 'system',
    levels: ['mid', 'senior'],
    question: 'Design offline first sync for a mobile notes app.',
    anchors: 'offline|sync|notes|mobile|local|conflict',
    points: [
      REQUIREMENTS,
      { label: 'Local database as the source the UI reads from', terms: 'local database|sqlite|realm|room|core data|local store|local first|on device' },
      { label: 'Queue of pending changes', terms: 'queue|outbox|pending|change log|operations|mutation' },
      { label: 'Conflict resolution strategy', terms: 'conflict|conflicts|last write wins|merge|version|crdt|vector clock|timestamp' },
      { label: 'Efficient sync protocol', terms: 'delta|incremental|since|cursor|last synced|changes since|batch|background sync' },
      { label: 'Identity and retries', terms: 'uuid|client id|idempotent|retry|backoff|connectivity|network change' },
    ],
    model:
      'Requirements: notes must open, edit and save with no connection, and sync across a user\'s phones and laptop once online, for millions of users. The app always reads and writes a local database such as SQLite, so it works the same with or without a connection. Every edit is saved locally and added to an outbox queue with a client generated UUID. When the device is online, a background job sends the outbox in batches, which keeps the stateless sync servers easy to scale, and asks the server for changes since the last sync cursor. Each note carries a version number. If the server version moved since the client last saw it, there is a conflict. For notes, last write wins at the note level loses work, so rather than that I would merge at the field level, and keep both copies when the body was edited on both sides. Requests are idempotent so retries after a dropped connection are safe.',
    hints: DESIGN_HINTS,
    next: 'How would you show the user that a note has a conflict?',
  },
  {
    id: 'sys-ci-platform',
    roles: ['devops-engineer', 'qa-engineer', 'system-architect'],
    category: 'system',
    levels: ['mid', 'senior'],
    question: 'Design a CI pipeline and test strategy for a team of fifty engineers who deploy several times a day.',
    anchors: 'ci|pipeline|tests|test|deploy|build|continuous',
    points: [
      REQUIREMENTS,
      { label: 'Stages ordered fast to slow', terms: 'stage|stages|lint|unit|integration|end to end|e2e|fast feedback|test pyramid' },
      { label: 'Speed through caching and parallelism', terms: 'cache|caching|parallel|parallelize|shard|affected|only changed|incremental' },
      { label: 'Handling flaky tests', terms: 'flaky|flake|quarantine|retry|deterministic|track' },
      { label: 'Safe deployment such as canary or feature flags', terms: 'canary|blue green|feature flag|rollback|progressive|staged rollout' },
      { label: 'Ownership and visibility', terms: 'owner|ownership|dashboard|metrics|alert|notify|slack|on call' },
    ],
    model:
      'Every pull request runs lint, type checks and unit tests first, since they are fast and catch most problems in a few minutes. Integration tests run in parallel shards with containers for the database, and only for the services affected by the change. A small set of end to end tests covers the critical user journeys. Dependencies and build outputs are cached. Flaky tests are tracked automatically and quarantined with an owner instead of being retried forever. On merge, the build produces one artifact that goes to staging and then to production as a canary on a small share of traffic, with automatic rollback if error rates rise. Risky features ship behind flags. A dashboard shows pipeline time and failure rate so we notice when it slows down.',
    hints: DESIGN_HINTS,
    next: 'Pipeline time crept up to forty minutes. How do you bring it down?',
  },

  {
    id: 'sys-typeahead',
    roles: ['frontend-developer', 'fullstack-developer', 'software-developer'],
    category: 'system',
    levels: ['entry', 'mid', 'senior'],
    question: 'Design a search box with autocomplete suggestions, like the one on Google or Amazon.',
    anchors: 'autocomplete|typeahead|suggestion|suggestions|search box|search',
    points: [
      REQUIREMENTS,
      { label: 'Debounce input to limit requests', terms: 'debounce|debounced|throttle|wait until|fewer requests|every keystroke' },
      { label: 'Cancel or ignore stale responses', terms: 'abort|abortcontroller|cancel|stale|race|out of order|latest request|ignore old' },
      { label: 'Cache results on the client or server', terms: 'cache|caching|memo|already searched|prefix|trie|cdn' },
      { label: 'Keyboard and screen reader accessibility', terms: 'keyboard|arrow keys|enter|escape|aria|combobox|listbox|screen reader|accessible|accessibility|focus' },
      { label: 'Loading, empty and error states', terms: 'loading|spinner|no results|empty state|error|highlight|minimum characters' },
    ],
    model:
      'I would confirm how many suggestions, how fast they must appear, and whether they come from a server. On the client, I debounce input by about 200 milliseconds so we do not send a request on every keystroke, and skip queries shorter than two characters. Each request carries an AbortController, so when the user keeps typing the old request is cancelled and a slow response can never overwrite a newer one. Results are cached by query in memory, so backspacing is instant. On the server, suggestions come from a prefix index such as a trie or a search engine, with popular prefixes cached. The list follows the combobox pattern: arrow keys move, Enter selects, Escape closes, with the right ARIA roles. It shows a loading hint, a no results message and highlights the matching part of each suggestion.',
    hints: DESIGN_HINTS,
    next: 'How would you rank suggestions so the most useful ones appear first?',
  },
  {
    id: 'sys-mobile-images',
    roles: ['mobile-developer'],
    category: 'system',
    levels: ['entry', 'mid', 'senior'],
    question: 'Design how a mobile app loads and caches images in a long scrolling feed.',
    anchors: 'image|images|feed|scroll|scrolling|cache|photos',
    points: [
      REQUIREMENTS,
      { label: 'Memory and disk cache', terms: 'memory cache|disk cache|lru|two level|cache|evict|eviction' },
      { label: 'Right sized images from the server', terms: 'resize|resized|thumbnail|size|resolution|webp|avif|cdn|compress|downsample' },
      { label: 'Cancel work for cells that scroll away', terms: 'cancel|reuse|recycle|recycled|cell reuse|off screen|scrolled away|wrong image' },
      { label: 'Prefetch and placeholders', terms: 'prefetch|preload|placeholder|blurhash|low quality|skeleton|ahead' },
      { label: 'Keep the main thread free', terms: 'background thread|main thread|decode|decoding|async|jank|smooth|frame' },
    ],
    model:
      'The server or CDN returns images already resized for the device, in a modern format, so we never download a large photo to show a thumbnail. On the device there are two cache levels: a small in memory LRU cache for what is on or near the screen, and a larger disk cache that survives restarts. Downloading and decoding happen on background threads so scrolling stays smooth. Because list cells are recycled, each request is tied to its cell and cancelled when the cell scrolls away, which also stops the wrong image appearing in a reused cell. The next few rows are prefetched, and a placeholder or blurred preview shows until the image arrives. In practice I would use a proven library such as Glide, Coil or Kingfisher and configure it this way.',
    hints: DESIGN_HINTS,
    next: 'How would you handle the cache when the device is low on storage?',
  },
  {
    id: 'sys-test-framework',
    roles: ['qa-engineer'],
    category: 'system',
    levels: ['entry', 'mid', 'senior'],
    question: 'Design a test automation framework for a web application from scratch.',
    anchors: 'framework|automation|test|tests|testing|selenium|playwright|cypress',
    points: [
      REQUIREMENTS,
      { label: 'Tool choice with a reason', terms: 'playwright|cypress|selenium|webdriver|tool|because' },
      { label: 'Structure such as page objects and test data', terms: 'page object|page objects|pom|fixtures|test data|helpers|reusable|structure|folder' },
      { label: 'Stable selectors and waits', terms: 'selector|selectors|data testid|test id|wait|waits|auto wait|explicit wait|no sleep|flaky' },
      { label: 'Runs in CI with parallelism and reports', terms: 'ci|pipeline|parallel|headless|report|reports|screenshots|video|trace' },
      { label: 'Test data and environment setup', terms: 'seed|api setup|clean state|isolated|environment|staging|reset|independent' },
    ],
    model:
      'I would agree the scope first: which user journeys matter most and which browsers we support. I would pick Playwright because it waits for elements automatically, runs browsers in parallel and records traces, which cuts flakiness and debugging time. The structure uses page objects so each screen\'s selectors live in one place, fixtures for login and setup, and test data created through the API before each test so tests are independent and never rely on order. Selectors use data testid attributes rather than CSS classes that designers change. Tests run headless in CI on every pull request, split across parallel workers, and failures attach screenshots and traces to the report. I keep this suite small and focused on critical journeys, with most checks living in faster unit and API tests.',
    hints: DESIGN_HINTS,
    next: 'How would you keep the suite fast once it grows to 800 tests?',
  },

  // --------------------------------------------------------- Product cases
  {
    id: 'pc-onboarding',
    roles: ['product-manager'],
    category: 'system',
    levels: ['entry', 'mid', 'senior'],
    question: 'Only 30 percent of new signups finish onboarding in our project management app. How would you improve it?',
    anchors: 'onboarding|signup|signups|new users|activation|finish|complete',
    points: [
      { label: 'Clarify the goal and define activation', terms: 'goal|activation|aha moment|define|success|value|first project|what finishing means' },
      { label: 'Find where and why users drop off', terms: 'funnel|drop off|dropoff|where users leave|step|analytics|session recording|interview|survey' },
      { label: 'Segment users', terms: 'segment|segments|persona|team size|role|channel|source|invited|solo' },
      { label: 'Specific solution ideas, prioritized', terms: 'template|templates|skip|fewer steps|shorter|checklist|sample data|invite|personalize|prioritize|prioritise' },
      { label: 'How to test and measure', terms: 'a b test|ab test|experiment|measure|metric|retention|guardrail|week one' },
    ],
    model:
      'First I would check what finishing onboarding is supposed to achieve. The real goal is activation, for example a user creating a project and inviting a teammate in the first week, since that likely predicts retention. Then I look at the funnel step by step to see where people drop, watch session recordings, and talk to users who left. I would segment by solo users versus invited teammates and by signup source, because they need different things. Likely fixes: ask fewer questions upfront, start people with a template and sample tasks so the screen is not empty, and prompt an invite at the moment they assign their first task. I would test the biggest drop off first with an experiment, measure week one activation and week four retention, and watch that support tickets do not rise.',
    hints: ['Define what success means before solving.', 'Find the drop off, then propose two or three ideas.'],
    next: 'Your change raised onboarding completion but week four retention stayed flat. What now?',
  },
  {
    id: 'pc-remote-teams',
    roles: ['product-manager'],
    category: 'system',
    levels: ['mid', 'senior'],
    question: 'Design a product that helps remote teams feel more connected.',
    anchors: 'remote|teams|team|connected|connection|distributed|product',
    points: [
      { label: 'Chose a specific user segment', terms: 'segment|persona|new hire|new hires|manager|managers|small team|startup|time zone|who' },
      { label: 'Identified the real pain points', terms: 'pain|problem|lonely|isolation|no casual|watercooler|onboarding|trust|research|interview' },
      { label: 'Prioritized a focused solution', terms: 'prioritize|prioritise|focus|mvp|first version|one feature|start with' },
      { label: 'Defined success metrics', terms: 'metric|metrics|measure|retention|weekly|engagement|survey|nps|success' },
      { label: 'Considered risks and tradeoffs', terms: 'risk|risks|privacy|forced fun|meeting fatigue|tradeoff|trade off|adoption|integration|slack' },
    ],
    model:
      'Remote teams is broad, so I would pick one group: new hires in their first three months at fully remote companies, because they have the fewest relationships and the highest risk of leaving. Their main pain is having no casual way to meet people outside their own team. I would start small: an integration in the chat tool they already use, which pairs new hires with a different colleague each week for a short optional call, with a suggested topic. Success is the share of new hires who complete at least four calls and a short survey score on whether they know who to ask for help, with ninety day retention as the long term check. The main risk is that it feels like forced fun, so it stays optional and easy to skip.',
    hints: ['Pick a specific user group.', 'Go from pain point to one focused solution and its metrics.'],
    next: 'How would you convince a company to pay for this?',
  },
  {
    id: 'pc-usage-drop',
    roles: ['product-manager'],
    category: 'system',
    levels: ['mid', 'senior'],
    question: 'Usage of our search feature dropped 15 percent over the last month. Walk me through how you would diagnose it.',
    anchors: 'search|usage|dropped|drop|decline|diagnose',
    points: [
      { label: 'Check the data and definition first', terms: 'tracking|data|definition|logging|instrumentation|real|broken|dashboard' },
      { label: 'Internal changes such as releases, design or ranking changes', terms: 'release|launch|redesign|change|ranking|experiment|deploy|ui change' },
      { label: 'External factors', terms: 'seasonal|seasonality|holiday|competitor|external|market|last year' },
      { label: 'Segment the drop', terms: 'segment|platform|mobile|desktop|country|new users|existing users|cohort' },
      { label: 'Ask whether lower usage is bad', terms: 'good thing|not bad|found it faster|navigation|other paths|success rate|outcome|intent' },
    ],
    model:
      'I would first confirm the drop is real by checking that search events are still tracked the same way. Then I compare to the same period last year for seasonality. Next I segment by platform, country and new versus returning users, and line the drop up against releases: a redesign that moved the search bar, a ranking change or a new experiment. I would also ask whether fewer searches is actually bad. If we improved the home page so people find what they want without searching, the right measure is whether people still reach what they need, such as search success rate or purchases, not raw search count. Then I would share the cause with the size of the impact and a fix.',
    hints: ['Check the data first, then internal and external causes.', 'Ask whether the drop is actually bad.'],
    next: 'You find the drop is entirely on iOS after last month\'s redesign. What do you do?',
  },

  // ------------------------------------------------------- Analytics cases
  {
    id: 'ac-sales-dashboard',
    roles: ['data-analyst'],
    category: 'system',
    levels: ['entry', 'mid', 'senior'],
    question: 'The sales director asks for a dashboard to track the team\'s performance. How would you approach it from request to launch?',
    anchors: 'dashboard|sales|performance|director|report',
    points: [
      { label: 'Gather requirements and decisions', terms: 'requirements|ask|interview|questions|decisions|what they need|stakeholder|goals' },
      { label: 'Define metrics clearly', terms: 'metric|metrics|kpi|kpis|define|definition|revenue|pipeline|win rate|quota|attainment' },
      { label: 'Data sources and pipeline', terms: 'crm|salesforce|hubspot|source|data model|pipeline|etl|sql|warehouse|refresh' },
      { label: 'Data quality checks', terms: 'quality|validate|reconcile|check|accuracy|finance|trust|test' },
      { label: 'Design, launch and iteration', terms: 'design|layout|filters|drill down|launch|training|feedback|iterate|adoption' },
    ],
    model:
      'I would meet the director and two or three sales managers to learn which decisions the dashboard should support, such as where to coach and which deals need help. From that I would agree a short list of metrics with written definitions: revenue against quota, pipeline coverage, win rate and average deal cycle, each by rep and region. Data comes from the CRM into the warehouse on a daily refresh, modelled in SQL so the logic sits in one place. Before launch I reconcile closed revenue with finance, because the first wrong number costs trust. The layout puts the headline numbers and trend versus target on top, with filters and drill downs below. I would walk the team through it and check usage after a month.',
    hints: ['Go from the request to launch in order.', 'Say how you make sure the numbers are trusted.'],
    next: 'Two regional managers define a closed deal differently. How do you resolve it?',
  },
  {
    id: 'ac-pricing-test',
    roles: ['data-analyst', 'data-scientist'],
    category: 'system',
    levels: ['mid', 'senior'],
    question: 'The company wants to know whether raising the subscription price by 10 percent would increase revenue. How would you analyse it?',
    anchors: 'price|pricing|subscription|revenue|increase|raise',
    points: [
      { label: 'Defined the right outcome metric', terms: 'revenue per user|lifetime value|ltv|total revenue|net revenue|metric|outcome' },
      { label: 'Considered conversion and churn effects', terms: 'conversion|churn|cancel|retention|elasticity|fewer signups|lose customers' },
      { label: 'Used historical data or a controlled test', terms: 'historical|past price|experiment|a b test|ab test|test|cohort|region|holdout' },
      { label: 'Segmented customers', terms: 'segment|new customers|existing customers|plan|country|grandfather|annual|monthly' },
      { label: 'Gave a clear recommendation with risks', terms: 'recommend|recommendation|risk|risks|confidence|caveat|decision' },
    ],
    model:
      'The question is not just revenue next month but revenue over the customer lifetime, so the metric is lifetime value per signup. A higher price can raise revenue per customer while lowering conversion and raising churn, and the answer depends on how much each moves. I would first look at history: past price changes, discounts and how different regions convert at different prices. Then I would run a test showing the new price to a share of new visitors only, since changing prices for existing customers carries different risks. I would measure conversion, early cancellations and revenue per visitor by segment for long enough to see first renewals, then give a recommendation with a range rather than a single number.',
    hints: ['Think about conversion and churn, not only price.', 'Say how you would test it safely.'],
    next: 'The test shows higher revenue but more cancellations in month two. What do you recommend?',
  },

  // ------------------------------------------------------- ML system design
  {
    id: 'ml-recommendations',
    roles: ['data-scientist'],
    category: 'system',
    levels: ['mid', 'senior'],
    question: 'Design a product recommendation system for an online store.',
    anchors: 'recommend|recommendation|recommendations|recommender|products|personalized|personalised',
    points: [
      { label: 'Clarified the goal and metric', terms: 'goal|metric|click through|ctr|conversion|revenue|offline metric|online metric|precision at k|ndcg' },
      { label: 'Data and features', terms: 'interactions|clicks|purchases|views|implicit|features|user features|item features|history' },
      { label: 'Candidate generation then ranking', terms: 'candidate|candidates|retrieval|two stage|ranking|ranker|re rank|rerank' },
      { label: 'Named suitable models', terms: 'collaborative filtering|matrix factorization|embedding|embeddings|two tower|content based|gradient boosting|nearest neighbour|nearest neighbor' },
      { label: 'Cold start', terms: 'cold start|new users|new products|popular|popularity|fallback' },
      { label: 'Evaluation, serving and feedback loop', terms: 'a b test|ab test|online test|serving|latency|retrain|feedback loop|monitor|diversity' },
    ],
    model:
      'I would start with the goal, such as more purchases from the home page, measured online by conversion and offline by recall at k on held out purchases. The data is views, cart adds and purchases, plus product attributes. The system has two stages. Candidate generation pulls a few hundred items per user from collaborative filtering embeddings, similar items to recent views, and popular items. A ranking model, such as gradient boosted trees on user, item and context features, orders them, and a final pass adds diversity and removes out of stock items. New users get popular and trending items until we have a few clicks, and new products get shown through content similarity. Embeddings refresh daily, the ranker serves within a tight latency budget, and every change goes through an A/B test.',
    hints: ['Start with the goal and the data.', 'Cover candidates, ranking, cold start and evaluation.'],
    next: 'How would you stop the system from only recommending already popular products?',
  },
  {
    id: 'ml-fraud',
    roles: ['data-scientist'],
    category: 'system',
    levels: ['senior'],
    question: 'Design a real time fraud detection system for card payments.',
    anchors: 'fraud|payment|payments|transaction|transactions|card',
    points: [
      { label: 'Latency and business constraints', terms: 'real time|latency|milliseconds|ms|before approval|block|review|cost' },
      { label: 'Features, including real time aggregates', terms: 'features|velocity|aggregates|amount|merchant|device|location|history|feature store|last hour' },
      { label: 'Model choice and handling imbalance', terms: 'gradient boosting|xgboost|lightgbm|imbalance|imbalanced|class weight|rules|anomaly' },
      { label: 'Delayed and noisy labels', terms: 'label|labels|chargeback|chargebacks|delayed|weeks later|feedback|investigation' },
      { label: 'Decision thresholds and human review', terms: 'threshold|thresholds|approve|decline|review queue|manual review|analyst|step up' },
      { label: 'Monitoring and retraining for drift', terms: 'monitor|monitoring|drift|retrain|retraining|adversarial|fraudsters adapt|alert' },
    ],
    model:
      'Each payment needs a decision in a few tens of milliseconds, so scoring sits inline with authorization. Features include the transaction itself, and fast aggregates from a feature store such as spend in the last hour on this card, new device, or distance from the last purchase. I would use gradient boosted trees with class weights, alongside hard rules for known patterns. Labels are chargebacks, which arrive weeks later, so training uses a time window that allows for that delay. The score maps to three actions: approve, send to manual review or a step up check, or decline, with thresholds set from the cost of fraud against the cost of blocking good customers. Fraudsters adapt, so I would monitor score distributions and catch rates daily and retrain on a regular schedule.',
    hints: ['State the latency limit early.', 'Cover features, labels, thresholds and drift.'],
    next: 'How would you evaluate a new model without letting real fraud through?',
  },

  // ------------------------------------------------------------ Team design
  {
    id: 'tm-team-doubles',
    roles: ['engineering-manager'],
    category: 'system',
    levels: ['mid', 'senior'],
    question: 'Your team will grow from 6 to 14 engineers in the next six months. How do you plan for it?',
    anchors: 'team|grow|growth|hiring|engineers|scale|scaling',
    points: [
      { label: 'Team structure and splitting', terms: 'split|two teams|squads|structure|ownership|domain|stream aligned|team size|pizza' },
      { label: 'Hiring plan and pacing', terms: 'hiring|hire|pace|stagger|recruit|senior|mix|profile|interview' },
      { label: 'Onboarding', terms: 'onboarding|onboard|buddy|documentation|docs|first week|starter tasks|ramp' },
      { label: 'Leadership and delegation', terms: 'tech lead|lead|leads|delegate|delegation|manager|promote|span of control' },
      { label: 'Process and communication that scale', terms: 'process|communication|rituals|standup|planning|architecture review|decision records|adr|culture' },
    ],
    model:
      'Fourteen people is too many for one team, so I would plan from the start for two teams of about seven, each owning a clear area such as the customer app and the platform. I would stagger hiring so we never add more than two people a month, and hire a couple of senior engineers early so there is someone to lead the second team, either promoted from within or hired. Onboarding needs to work before the new people arrive: updated docs, a local setup that runs in an hour, a buddy, and real starter tasks. Processes change too: separate standups, a shared planning session, and written decision records so context does not live only in people\'s heads. I would also watch for the original six feeling the team they knew has gone.',
    hints: ['Cover structure, hiring, onboarding and leadership.', 'Mention one risk of growing fast.'],
    next: 'How would you choose the tech lead for the second team?',
  },
  {
    id: 'tm-on-call',
    roles: ['engineering-manager', 'devops-engineer'],
    category: 'system',
    levels: ['mid', 'senior'],
    question: 'Your team is burning out from on call. How would you redesign the on call rotation?',
    anchors: 'on call|oncall|rotation|pager|alerts|incident|burnout',
    points: [
      { label: 'Measure the load first', terms: 'measure|how many pages|alert volume|data|pages per week|after hours|track' },
      { label: 'Reduce alert noise', terms: 'noise|noisy|actionable|alert fatigue|tune|remove alerts|thresholds|slo|symptom' },
      { label: 'A fair rotation with handoffs', terms: 'rotation|fair|primary|secondary|handoff|handover|follow the sun|time zones|schedule' },
      { label: 'Runbooks and fixing root causes', terms: 'runbook|runbooks|root cause|postmortem|fix|automation|recurring|permanent fix' },
      { label: 'Support and recognition for the person on call', terms: 'compensation|time off|time in lieu|recover|no project work|recognize|recognise|pay' },
    ],
    model:
      'I would start with data: how many pages per week, how many after hours, and how many needed someone to act. Usually most are noise, so the first fix is deleting or tuning alerts until every page is actionable and tied to user impact. Then a fair rotation: a primary and a secondary, a week each, a proper handoff note, and if we span time zones, follow the sun so nobody is paged at night. Every page should have a runbook, and repeat incidents get a ticket for a real fix that the next sprint takes seriously. The person on call does no planned project work that week, and gets time off after a rough night. I would review the numbers monthly with the team.',
    hints: ['Start from data about the pages.', 'Cover noise, rotation, root causes and the people.'],
    next: 'Product says there is no time to fix the root causes. What do you say?',
  },
];
