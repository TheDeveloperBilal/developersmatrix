// The AI crawlers /tools/ai-crawler-checker checks, grouped by what they do.
//
// Every row is taken from the company's own crawler page (links below),
// checked on 6 November 2026. When a company changes its bots, update the row
// and BOTS_CHECKED together.

export const BOTS_CHECKED = '2026-11-06';

export type BotPurpose = 'search' | 'user' | 'training';

/**
 * yes: the company says the bot follows robots.txt.
 * may-ignore: the company says robots.txt may not apply, because a person asked
 *   for the page.
 * token: not a crawler at all. A name in robots.txt that controls how another
 *   crawler's data is used.
 */
export type RobotsPolicy = 'yes' | 'may-ignore' | 'token';

export interface AiBot {
  token: string;
  company: string;
  product: string;
  purpose: BotPurpose;
  does: string;
  robots: RobotsPolicy;
  docs: string;
}

const DOCS = {
  openai: 'https://developers.openai.com/docs/bots',
  anthropic: 'https://support.claude.com/en/articles/8896518',
  perplexity: 'https://docs.perplexity.ai/docs/resources/perplexity-crawlers',
  meta: 'https://developers.facebook.com/docs/sharing/webmasters/web-crawlers',
  apple: 'https://support.apple.com/en-us/119829',
  google: 'https://developers.google.com/crawling/docs/crawlers-fetchers/google-common-crawlers',
  bing: 'https://www.bing.com/webmasters/help/which-crawlers-does-bing-use-8c184ec0',
  commoncrawl: 'https://commoncrawl.org/ccbot',
} as const;

export const AI_BOTS: AiBot[] = [
  // Search and answer engines: these decide whether you can be found and cited.
  { token: 'OAI-SearchBot', company: 'OpenAI', product: 'ChatGPT search', purpose: 'search', robots: 'yes', docs: DOCS.openai, does: 'Finds pages to show and link in ChatGPT search results.' },
  { token: 'Claude-SearchBot', company: 'Anthropic', product: 'Claude search', purpose: 'search', robots: 'yes', docs: DOCS.anthropic, does: 'Indexes pages to improve the answers Claude gives when it searches the web.' },
  { token: 'PerplexityBot', company: 'Perplexity', product: 'Perplexity search', purpose: 'search', robots: 'yes', docs: DOCS.perplexity, does: 'Builds the index Perplexity uses to show and link pages in its answers.' },
  { token: 'meta-webindexer', company: 'Meta', product: 'Meta AI search', purpose: 'search', robots: 'yes', docs: DOCS.meta, does: 'Indexes pages to improve Meta AI search results.' },
  { token: 'Googlebot', company: 'Google', product: 'Google Search', purpose: 'search', robots: 'yes', docs: DOCS.google, does: 'Crawls for Google Search, including its AI features. Blocking it takes you out of Google.' },
  { token: 'Bingbot', company: 'Microsoft', product: 'Bing', purpose: 'search', robots: 'yes', docs: DOCS.bing, does: 'Crawls for Bing search, which Microsoft Copilot also draws on.' },
  { token: 'Applebot', company: 'Apple', product: 'Siri, Spotlight and Safari', purpose: 'search', robots: 'yes', docs: DOCS.apple, does: 'Powers Apple search features. Its data may also train Apple models unless Applebot-Extended is blocked.' },

  // Fetchers that visit a page because a person asked about it.
  { token: 'ChatGPT-User', company: 'OpenAI', product: 'ChatGPT', purpose: 'user', robots: 'may-ignore', docs: DOCS.openai, does: 'Visits a page when someone asks ChatGPT or a custom GPT about it.' },
  { token: 'Claude-User', company: 'Anthropic', product: 'Claude', purpose: 'user', robots: 'yes', docs: DOCS.anthropic, does: 'Visits a page when someone asks Claude a question that needs it.' },
  { token: 'Perplexity-User', company: 'Perplexity', product: 'Perplexity', purpose: 'user', robots: 'may-ignore', docs: DOCS.perplexity, does: 'Fetches a page when a question in Perplexity needs it.' },
  { token: 'meta-externalfetcher', company: 'Meta', product: 'Meta AI', purpose: 'user', robots: 'may-ignore', docs: DOCS.meta, does: 'Fetches a link a person asks Meta AI about.' },

  // Training: collecting pages to train AI models.
  { token: 'GPTBot', company: 'OpenAI', product: 'Model training', purpose: 'training', robots: 'yes', docs: DOCS.openai, does: 'Collects pages that may be used to train OpenAI models.' },
  { token: 'ClaudeBot', company: 'Anthropic', product: 'Model training', purpose: 'training', robots: 'yes', docs: DOCS.anthropic, does: 'Collects pages that may be used to train Anthropic models.' },
  { token: 'Google-Extended', company: 'Google', product: 'Gemini training and grounding', purpose: 'training', robots: 'token', docs: DOCS.google, does: 'Not a crawler. Tells Google whether pages Googlebot crawls may train Gemini and ground its answers. Google says it does not affect Google Search.' },
  { token: 'Applebot-Extended', company: 'Apple', product: 'Apple model training', purpose: 'training', robots: 'token', docs: DOCS.apple, does: 'Not a crawler. Tells Apple whether pages Applebot crawls may train its models. Search features are not affected.' },
  { token: 'meta-externalagent', company: 'Meta', product: 'Model training', purpose: 'training', robots: 'yes', docs: DOCS.meta, does: 'Collects pages to train Meta AI models and improve its products.' },
  { token: 'CCBot', company: 'Common Crawl', product: 'Open web archive', purpose: 'training', robots: 'yes', docs: DOCS.commoncrawl, does: 'Builds a free public archive of the web that many AI models are trained on.' },
];

export const PURPOSES: { id: BotPurpose; title: string; blurb: string }[] = [
  { id: 'search', title: 'AI search and answers', blurb: 'These decide whether your pages can be found, quoted and linked in AI answers.' },
  { id: 'user', title: 'Fetches on request', blurb: 'These visit a page only when a person asks an assistant about it.' },
  { id: 'training', title: 'Model training', blurb: 'These collect pages to train AI models. Blocking them does not stop you appearing in AI search.' },
];
