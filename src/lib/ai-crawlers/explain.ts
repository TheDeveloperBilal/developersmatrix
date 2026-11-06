// robots.txt with line numbers, so the AI crawler checker can show the exact
// line that decides each bot.
//
// The matching rules are the same as src/lib/website-audit/robots.ts (RFC 9309
// as Google applies it), and a test checks the two agree:
// - rules belong to the user-agent group they sit under
// - a crawler follows its most specific matching group, else the "*" group,
//   and every group naming that same agent is merged
// - the longest matching rule wins, and Allow wins a tie
// - an empty "Disallow:" allows everything
// - * matches any run of characters and $ anchors the end

export interface LineRule {
  type: 'allow' | 'disallow';
  path: string;
  line: number;
}

export interface LineGroup {
  /** value is lowercased for matching; raw keeps the file's own spelling for display. */
  agents: { value: string; raw: string; line: number }[];
  rules: LineRule[];
}

export interface ContentSignal {
  line: number;
  raw: string;
  /** search, ai-input, ai-train and any other names, each yes or no. */
  values: Record<string, string>;
  /** The user-agent lines of the group the signal sits in, or [] at the top. */
  agents: string[];
}

export interface ExplainedRobots {
  groups: LineGroup[];
  signals: ContentSignal[];
  sitemaps: string[];
}

export function parseWithLines(body: string): ExplainedRobots {
  const groups: LineGroup[] = [];
  const signals: ContentSignal[] = [];
  const sitemaps: string[] = [];
  let current: LineGroup | null = null;
  let collectingAgents = false;

  body.split(/\r?\n/).forEach((rawLine, i) => {
    const line = i + 1;
    const text = rawLine.replace(/#.*$/, '').trim();
    if (!text) return;
    const colon = text.indexOf(':');
    if (colon === -1) return;
    const field = text.slice(0, colon).trim().toLowerCase();
    const value = text.slice(colon + 1).trim();

    if (field === 'sitemap') {
      if (value) sitemaps.push(value);
      return;
    }
    if (field === 'content-signal') {
      const values: Record<string, string> = {};
      for (const part of value.split(',')) {
        const [k, v] = part.split('=').map((s) => s.trim().toLowerCase());
        if (k && v) values[k] = v;
      }
      signals.push({ line, raw: value, values, agents: current ? current.agents.map((a) => a.value) : [] });
      return;
    }
    if (field === 'user-agent') {
      if (!collectingAgents || !current) {
        current = { agents: [], rules: [] };
        groups.push(current);
      }
      current.agents.push({ value: value.toLowerCase(), raw: value, line });
      collectingAgents = true;
      return;
    }
    if (!current) return;
    collectingAgents = false;
    if ((field === 'disallow' || field === 'allow') && value !== '') {
      current.rules.push({ type: field, path: value, line });
    }
  });
  return { groups, signals, sitemaps };
}

function patternToRegex(path: string): RegExp {
  const anchored = path.endsWith('$');
  const body = (anchored ? path.slice(0, -1) : path)
    .split('*')
    .map((part) => part.replace(/[.+?^${}()|[\]\\]/g, '\\$&'))
    .join('.*');
  return new RegExp('^' + body + (anchored ? '$' : ''));
}

export interface Decision {
  allowed: boolean;
  /** The user-agent line of the group this bot follows, as written: "*", its own name, or null when no group applies. */
  group: string | null;
  /** Line of the first user-agent line naming that group. */
  groupLine: number | null;
  /** The rule that decided it, or null when no rule matched (allowed by default). */
  rule: LineRule | null;
}

export function decide(parsed: ExplainedRobots, crawler: string, pathAndQuery: string): Decision {
  const name = crawler.toLowerCase();
  let best = '';
  for (const g of parsed.groups) {
    for (const a of g.agents) {
      if (a.value !== '*' && a.value !== '' && name.includes(a.value) && a.value.length > best.length) best = a.value;
    }
  }
  const pick = best || (parsed.groups.some((g) => g.agents.some((a) => a.value === '*')) ? '*' : '');
  if (!pick) return { allowed: true, group: null, groupLine: null, rule: null };

  const matching = parsed.groups.filter((g) => g.agents.some((a) => a.value === pick));
  const first = matching[0].agents.find((a) => a.value === pick);
  const groupLine = first?.line ?? null;
  let winner: LineRule | null = null;
  for (const rule of matching.flatMap((g) => g.rules)) {
    if (!patternToRegex(rule.path).test(pathAndQuery)) continue;
    if (!winner || rule.path.length > winner.path.length || (rule.path.length === winner.path.length && rule.type === 'allow' && winner.type !== 'allow')) {
      winner = rule;
    }
  }
  return { allowed: !winner || winner.type === 'allow', group: first?.raw ?? pick, groupLine, rule: winner };
}
