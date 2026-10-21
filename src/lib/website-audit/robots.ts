// robots.txt parsing that follows Google's rules (RFC 9309):
// - rules belong to the user-agent group they sit under
// - a crawler obeys only its most specific matching group, else the "*" group
// - an empty "Disallow:" allows everything
// - the longest matching rule wins, and Allow wins a tie
// - * matches any run of characters and $ anchors the end of the path

export interface RobotsRule {
  type: 'allow' | 'disallow';
  path: string;
}

export interface RobotsGroup {
  agents: string[];
  rules: RobotsRule[];
  crawlDelay?: number;
}

export interface ParsedRobots {
  groups: RobotsGroup[];
  sitemaps: string[];
}

export function parseRobots(body: string): ParsedRobots {
  const groups: RobotsGroup[] = [];
  const sitemaps: string[] = [];
  let current: RobotsGroup | null = null;
  // Consecutive user-agent lines share one group; a rule line closes the list.
  let collectingAgents = false;

  for (const rawLine of body.split(/\r?\n/)) {
    const line = rawLine.replace(/#.*$/, '').trim();
    if (!line) continue;
    const colon = line.indexOf(':');
    if (colon === -1) continue;
    const field = line.slice(0, colon).trim().toLowerCase();
    const value = line.slice(colon + 1).trim();

    if (field === 'sitemap') {
      if (value) sitemaps.push(value);
      continue;
    }
    if (field === 'user-agent') {
      if (!collectingAgents || !current) {
        current = { agents: [], rules: [] };
        groups.push(current);
      }
      current.agents.push(value.toLowerCase());
      collectingAgents = true;
      continue;
    }
    if (!current) continue; // rules before any user-agent are ignored
    collectingAgents = false;
    if (field === 'disallow' || field === 'allow') {
      // An empty Disallow means "nothing is disallowed", so it adds no rule.
      if (value === '') continue;
      current.rules.push({ type: field, path: value });
    } else if (field === 'crawl-delay') {
      const n = parseFloat(value);
      if (!Number.isNaN(n)) current.crawlDelay = n;
    }
  }
  return { groups, sitemaps };
}

/**
 * The group a crawler would follow: the group whose user-agent token is the
 * longest match for the crawler name, else the "*" group. Google merges every
 * group that names the same agent, so we do too.
 */
export function rulesFor(parsed: ParsedRobots, crawler: string): { rules: RobotsRule[]; matched: string | null; crawlDelay?: number } {
  const name = crawler.toLowerCase();
  let best = '';
  for (const g of parsed.groups) {
    for (const a of g.agents) {
      if (a !== '*' && name.includes(a) && a.length > best.length) best = a;
    }
  }
  const pick = best || (parsed.groups.some((g) => g.agents.includes('*')) ? '*' : '');
  if (!pick) return { rules: [], matched: null };
  const matching = parsed.groups.filter((g) => g.agents.includes(pick));
  return {
    rules: matching.flatMap((g) => g.rules),
    matched: pick,
    crawlDelay: matching.find((g) => g.crawlDelay !== undefined)?.crawlDelay,
  };
}

function patternToRegex(path: string): RegExp {
  const anchored = path.endsWith('$');
  const body = (anchored ? path.slice(0, -1) : path)
    .split('*')
    .map((part) => part.replace(/[.+?^${}()|[\]\\]/g, '\\$&'))
    .join('.*');
  return new RegExp('^' + body + (anchored ? '$' : ''));
}

/** Whether a crawler may fetch a path (path plus query, starting with "/"). */
export function isAllowed(parsed: ParsedRobots, crawler: string, pathAndQuery: string): boolean {
  const { rules } = rulesFor(parsed, crawler);
  let winner: RobotsRule | null = null;
  let winnerLen = -1;
  for (const rule of rules) {
    if (!patternToRegex(rule.path).test(pathAndQuery)) continue;
    const len = rule.path.length;
    if (len > winnerLen || (len === winnerLen && rule.type === 'allow')) {
      winner = rule;
      winnerLen = len;
    }
  }
  return !winner || winner.type === 'allow';
}

/** AI crawlers people most often ask about, with the token robots.txt uses. */
export const AI_CRAWLERS: { token: string; name: string }[] = [
  { token: 'GPTBot', name: 'OpenAI GPTBot' },
  { token: 'OAI-SearchBot', name: 'ChatGPT search' },
  { token: 'ClaudeBot', name: 'Anthropic ClaudeBot' },
  { token: 'PerplexityBot', name: 'Perplexity' },
  { token: 'Google-Extended', name: 'Google AI training (Google-Extended)' },
  { token: 'CCBot', name: 'Common Crawl' },
];
