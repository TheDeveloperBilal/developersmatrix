/**
 * AI Content Detection Engine
 *
 * How this works, honestly:
 * This is a statistical style check, not a trained language model. It measures
 * ten writing signals that were tested on labelled human and AI text and kept
 * only if they separated the two on text they had never seen (see the project
 * note ai-content-detector-test-2026-09-29). It gives an estimate with a wide
 * "unclear" band on purpose. It is never proof of authorship.
 *
 * Validation, 29 September 2026, with the final thresholds below.
 *   Held out set, 34 texts the model never saw:
 *     18 human texts (Wikipedia 2019, Hacker News 2015, Stack Exchange 2010 to 2016):
 *       8 likely human, 10 unclear, 0 called AI.
 *     16 AI texts: 10 likely AI, 6 unclear, 0 called human.
 *   All 57 texts: 34 clear verdicts, all correct; 23 unclear.
 * Caveat: every AI sample came from one model family, so text from other models
 * and heavily edited AI text will land in "unclear" more often. One real sample
 * of non native English (the site owner's own messages) scored 62, unclear, which
 * is why short texts need 75 rather than 70 before the verdict says AI.
 */

export type Verdict = 'likely-human' | 'unclear' | 'likely-ai';
export type Reliability = 'Low' | 'Moderate';

export interface DetectorSignal {
  id: string;
  /** Which way this signal pushed the score. */
  direction: 'ai' | 'human';
  /** 0 to 100, how strongly it pushed. */
  strength: number;
  title: string;
  detail: string;
}

export interface SentenceAnalysis {
  sentence: string;
  /** True when the sentence contains a specific AI style pattern. */
  flagged: boolean;
  reasons: string[];
}

export interface SEOIssue {
  type: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  suggestions: string[];
}

export interface AnalysisResult {
  /** 0 to 100. Higher means the writing shows more AI style signals. Not a probability of authorship. */
  aiScore: number;
  /** Kept for older callers. Same value as aiScore. */
  aiProbability: number;
  humanProbability: number;
  verdict: Verdict;
  verdictLabel: string;
  verdictSummary: string;
  detectionReliability: Reliability;
  reliabilityNote: string;
  wordCount: number;
  sentenceCount: number;
  metrics: {
    averageSentenceLength: number;
    sentenceLengthVariation: number;
    vocabularyVariety: number;
    contractionsPer100Words: number;
    aiStyleWordCount: number;
    stockTransitionShare: number;
  };
  signals: DetectorSignal[];
  sentenceAnalysis: SentenceAnalysis[];
  recommendations: string[];
  seoIssues: SEOIssue[];
}

/** Kept so older requests that send a mode still work. Scoring does not depend on it. */
export type DetectionMode =
  | 'blog'
  | 'seo-article'
  | 'academic'
  | 'resume'
  | 'cover-letter'
  | 'sales-copy'
  | 'email';

export const MIN_WORDS = 80;
export const RECOMMENDED_WORDS = 150;

// Common AI phrases and patterns
const AI_TYPICAL_PHRASES = [
  'it is important to note',
  'it\'s worth mentioning',
  'in today\'s digital age',
  'in this day and age',
  'at the end of the day',
  'when it comes to',
  'let\'s dive into',
  'let\'s explore',
  'in conclusion',
  'to summarize',
  'first and foremost',
  'last but not least',
  'on the other hand',
  'in addition to',
  'as a matter of fact',
  'needless to say',
  'it goes without saying',
  'in other words',
  'to put it simply',
  'in a nutshell',
  'all things considered',
  'taking everything into account',
  'as we can see',
  'it is clear that',
  'one of the most',
  'plays a crucial role',
  'of utmost importance',
  'vital role in',
  'integral part of',
  'key takeaway',
  'main takeaway',
  'bottom line is',
  'in the grand scheme',
  'broad spectrum of',
  'multifaceted approach',
  'comprehensive understanding',
  'holistic view',
  'paradigm shift',
  'game changer',
  'cutting edge',
  'state of the art',
  'innovative solutions',
  'seamless integration',
  'robust framework',
  'scalable architecture',
  'leverage the power',
  'harness the potential',
  'unlock the potential',
  'maximize your potential',
  'empower users to',
  'streamline your workflow',
  'optimize your strategy',
];

// Generic/weak phrases that indicate AI
const GENERIC_PHRASES = [
  'this is because',
  'the reason for this',
  'there are many',
  'there are several',
  'one of the best',
  'a wide range of',
  'various different',
  'numerous benefits',
  'countless opportunities',
  'a myriad of',
  'an array of',
  'a plethora of',
  'diverse range of',
  'extensive collection',
  'comprehensive guide',
  'ultimate guide',
  'complete guide',
  'definitive guide',
  'everything you need to know',
  'all you need to know',
];

// SEO-specific AI patterns
const SEO_AI_PATTERNS = [
  'search engine optimization',
  'boost your rankings',
  'improve your seo',
  'seo best practices',
  'google algorithm',
  'search engine rankings',
  'keyword research',
  'content marketing strategy',
  'organic traffic',
  'search visibility',
];

// Transition words often overused by AI
const AI_TRANSITIONS = [
  'furthermore',
  'moreover',
  'additionally',
  'consequently',
  'subsequently',
  'nevertheless',
  'nonetheless',
  'accordingly',
  'henceforth',
  'whereby',
  'wherein',
  'thereby',
];

// Words modern AI models lean on far more than people do.
const AI_STYLE_WORDS = [
  'additionally', 'furthermore', 'moreover', 'ultimately', 'overall', 'crucial',
  'essential', 'ensure', 'enhance', 'foster', 'robust', 'seamless', 'leverage',
  'landscape', 'notably', 'significant', 'significantly', 'various', 'numerous',
  'vital', 'thoughtfully', 'valuable', 'journey', 'intentional', 'effectively',
  'incredible', 'perfect', 'truly', 'deeply', 'approach', 'impact',
];

const STOCK_OPENERS = [
  'however', 'additionally', 'furthermore', 'moreover', 'ultimately', 'overall',
  'finally', 'in conclusion', 'in addition', 'on the other hand', 'as a result',
  'in fact', 'most importantly', 'at the same time', 'in the meantime',
];

type FeatureKey =
  | 'mattr' | 'aiWords' | 'connStart' | 'parensQuotes' | 'messy'
  | 'meanSent' | 'maxOverMean' | 'sentCV' | 'semicolon' | 'contractions';

/**
 * +1 means a higher value looks more like AI, -1 more like a person.
 * Mean and spread come from the 23 text training set only, so the held out
 * numbers in the header stay honest.
 */
const MODEL: Record<FeatureKey, { sign: 1 | -1; mean: number; spread: number }> = {
  mattr:        { sign: 1,  mean: 0.8311, spread: 0.0418 },
  aiWords:      { sign: 1,  mean: 0.3014, spread: 0.5511 },
  connStart:    { sign: 1,  mean: 0.0267, spread: 0.0581 },
  parensQuotes: { sign: -1, mean: 1.6575, spread: 2.5568 },
  messy:        { sign: -1, mean: 0.4805, spread: 0.6566 },
  meanSent:     { sign: -1, mean: 19.63,  spread: 5.4088 },
  maxOverMean:  { sign: -1, mean: 1.953,  spread: 0.5544 },
  sentCV:       { sign: -1, mean: 0.4931, spread: 0.2158 },
  semicolon:    { sign: -1, mean: 0.32,   spread: 0.5164 },
  contractions: { sign: -1, mean: 1.1634, spread: 1.3847 },
};

const HUMAN_BELOW = 35;
const AI_FROM = 70;
/**
 * Short texts need a stronger signal before we say AI. Short, direct writing,
 * including a lot of non native English, drifts toward the AI side. Tested:
 * costs 2 of 27 AI detections and accuses no one.
 */
const AI_FROM_SHORT = 75;

function splitSentences(text: string): string[] {
  return text
    .replace(/([.!?])(?=[A-Z])/g, '$1 ')
    .split(/(?<=[.!?])\s+(?=[A-Z"(])/)
    .map((s) => s.trim())
    .filter((s) => s.split(/\s+/).length >= 3);
}

function tokenize(text: string): string[] {
  return text.toLowerCase().match(/[a-z']+/g) || [];
}

const avg = (a: number[]) => (a.length ? a.reduce((x, y) => x + y, 0) / a.length : 0);
const stdev = (a: number[]) => {
  const m = avg(a);
  return Math.sqrt(avg(a.map((x) => (x - m) ** 2)));
};

function measure(text: string, sentences: string[], words: string[]) {
  const n = Math.max(1, words.length);
  const per100 = (c: number) => (100 * c) / n;
  const lengths = sentences.map((s) => s.split(/\s+/).length);
  const meanLen = avg(lengths) || 1;

  // Moving average type token ratio over 50 word windows, so length does not skew it.
  const window = 50;
  let total = 0;
  let count = 0;
  for (let i = 0; i + window <= words.length; i += 10) {
    total += new Set(words.slice(i, i + window)).size / window;
    count++;
  }
  const mattr = count ? total / count : new Set(words).size / n;

  const lower = sentences.map((s) => s.toLowerCase());
  const aiWordsFound = words.filter((w) => AI_STYLE_WORDS.includes(w));

  const values: Record<FeatureKey, number> = {
    mattr,
    aiWords: per100(aiWordsFound.length),
    connStart: lower.filter((s) => STOCK_OPENERS.some((c) => s.startsWith(c))).length / Math.max(1, sentences.length),
    parensQuotes: per100((text.match(/[()"“”]/g) || []).length),
    messy: per100((text.match(/[a-z][.!?][A-Z]|\.\.\.|\?\?|!!|\s[a-z]+\s*\(|&|\//g) || []).length),
    meanSent: meanLen,
    maxOverMean: lengths.length ? Math.max(...lengths) / meanLen : 1,
    sentCV: stdev(lengths) / meanLen,
    semicolon: per100((text.match(/[;:]/g) || []).length),
    contractions: per100(words.filter((w) => w.includes("'")).length),
  };

  return { values, lengths, meanLen, aiWordsFound };
}

function explain(
  key: FeatureKey,
  pushesAI: boolean,
  m: ReturnType<typeof measure>
): { title: string; detail: string } | null {
  const v = m.values;
  switch (key) {
    case 'mattr':
      return pushesAI
        ? { title: 'Unusually even vocabulary', detail: 'Word choice rarely repeats. AI models spread vocabulary evenly; people tend to reuse the words their topic needs.' }
        : { title: 'Natural word repetition', detail: 'Key words come back as the topic needs them, which is how people usually write.' };
    case 'aiWords': {
      const uniq = Array.from(new Set(m.aiWordsFound)).slice(0, 5);
      return pushesAI
        ? { title: 'Words AI models overuse', detail: `Found: ${uniq.join(', ')}. These words appear far more often in AI text than in human writing.` }
        : { title: 'Few AI favourite words', detail: 'Almost none of the words AI models overuse, such as "additionally", "crucial" or "enhance".' };
    }
    case 'connStart':
      return pushesAI
        ? { title: 'Stock sentence openers', detail: `${Math.round(v.connStart * 100)}% of sentences open with transitions like "However" or "Additionally".` }
        : { title: 'Varied sentence openings', detail: 'Sentences rarely open with stock transitions.' };
    case 'parensQuotes':
      return pushesAI
        ? { title: 'No asides or quotations', detail: 'No brackets or quotation marks. AI text seldom uses them; people use them for side notes and quotes.' }
        : { title: 'Asides and quotations', detail: 'Uses brackets or quotation marks, which people use far more than AI models.' };
    case 'messy':
      return pushesAI
        ? { title: 'Very clean typing', detail: 'No informal marks such as typos, missing spaces, ellipses or slashes.' }
        : { title: 'Signs of real typing', detail: 'Contains informal marks such as missing spaces, ellipses or slashes that people leave behind.' };
    case 'meanSent':
      return pushesAI
        ? { title: 'Tidy sentence length', detail: `Sentences average ${Math.round(m.meanLen)} words, the comfortable middle length AI models favour.` }
        : { title: 'Long, dense sentences', detail: `Sentences average ${Math.round(m.meanLen)} words, longer than AI models usually write.` };
    case 'sentCV':
    case 'maxOverMean':
      return pushesAI
        ? { title: 'Even sentence rhythm', detail: 'Sentence lengths are similar to each other. People mix very short and very long sentences more.' }
        : { title: 'Uneven sentence rhythm', detail: 'Short and long sentences are mixed freely, a common trait of human writing.' };
    case 'semicolon':
      return pushesAI ? null : { title: 'Semicolons and colons', detail: 'Uses semicolons or colons, which people use more than AI models.' };
    case 'contractions':
      return pushesAI
        ? { title: 'Few contractions', detail: 'Rarely uses short forms like "don\'t" or "it\'s".' }
        : { title: 'Everyday contractions', detail: 'Uses short forms like "don\'t" and "it\'s" often, as people do.' };
  }
}

function flagSentences(sentences: string[]): SentenceAnalysis[] {
  return sentences.map((sentence) => {
    const lower = sentence.toLowerCase();
    const reasons: string[] = [];

    const phrase = AI_TYPICAL_PHRASES.find((p) => lower.includes(p));
    if (phrase) reasons.push(`Stock phrase: "${phrase}"`);

    const opener = STOCK_OPENERS.find((c) => lower.startsWith(c));
    if (opener) reasons.push(`Opens with a stock transition: "${opener}"`);

    const words = tokenize(sentence);
    const aiWords = Array.from(new Set(words.filter((w) => AI_STYLE_WORDS.includes(w))));
    if (aiWords.length >= 2) reasons.push(`AI favourite words: ${aiWords.join(', ')}`);

    const generic = GENERIC_PHRASES.find((p) => lower.includes(p));
    if (generic) reasons.push(`Generic phrase: "${generic}"`);

    return { sentence, flagged: reasons.length > 0, reasons };
  });
}

function buildRecommendations(signals: DetectorSignal[], verdict: Verdict): string[] {
  const tips: string[] = [];
  const ai = new Set(signals.filter((s) => s.direction === 'ai').map((s) => s.id));

  if (ai.has('aiWords')) tips.push('Swap words like "crucial", "enhance" and "additionally" for plainer ones you would say out loud.');
  if (ai.has('connStart')) tips.push('Cut stock openers such as "However" and "Furthermore". Most sentences read better starting with the point.');
  if (ai.has('sentCV') || ai.has('maxOverMean') || ai.has('meanSent')) tips.push('Vary your rhythm. Follow a long sentence with a very short one.');
  if (ai.has('contractions')) tips.push('Use contractions where they sound natural: "it is" to "it\'s", "do not" to "don\'t".');
  if (ai.has('parensQuotes')) tips.push('Add something only you know: a quote, a number from your own work, an aside in brackets.');
  if (ai.has('mattr')) tips.push('Name the specific thing each time rather than rotating synonyms for it.');

  if (verdict === 'likely-human' && tips.length === 0) {
    tips.push('This already reads like natural human writing. No changes needed for style.');
  }
  return tips;
}

export function analyzeContent(text: string, _mode: DetectionMode = 'blog'): AnalysisResult {
  const clean = text.replace(/\s+/g, ' ').trim();
  const sentences = splitSentences(clean);
  const words = tokenize(clean);
  const m = measure(clean, sentences, words);

  // Standardise each signal against the training set, clip outliers so one odd
  // feature cannot decide the result, then average.
  const contributions = (Object.keys(MODEL) as FeatureKey[]).map((key) => {
    const { sign, mean, spread } = MODEL[key];
    const z = Math.max(-3, Math.min(3, (m.values[key] - mean) / spread));
    return { key, c: sign * z };
  });
  const raw = avg(contributions.map((x) => x.c));
  const aiScore = Math.round(100 / (1 + Math.exp(-2.2 * raw)));

  const aiThreshold = words.length < RECOMMENDED_WORDS ? AI_FROM_SHORT : AI_FROM;
  const verdict: Verdict = aiScore >= aiThreshold ? 'likely-ai' : aiScore < HUMAN_BELOW ? 'likely-human' : 'unclear';

  const verdictLabel =
    verdict === 'likely-ai' ? 'Likely AI generated' : verdict === 'likely-human' ? 'Likely human written' : 'Mixed or unclear';

  const verdictSummary =
    verdict === 'likely-ai'
      ? 'The writing shows several patterns that are much more common in AI text than in human writing.'
      : verdict === 'likely-human'
        ? 'The writing shows patterns that are much more common in human writing than in AI text.'
        : 'The signals point both ways. This is common for edited AI text, formal human writing and short samples. Do not treat this as evidence either way.';

  const short = words.length < RECOMMENDED_WORDS;
  const detectionReliability: Reliability = short || verdict === 'unclear' ? 'Low' : 'Moderate';
  const reliabilityNote = short
    ? `Only ${words.length} words. Results get steadier from about ${RECOMMENDED_WORDS} words.`
    : verdict === 'unclear'
      ? 'The signals disagree, so no conclusion is drawn.'
      : 'A statistical estimate, not proof. Formal writing and non native English can look AI like.';

  // Explain the four strongest signals, merging the two rhythm measures.
  const seen = new Set<string>();
  const signals: DetectorSignal[] = [];
  for (const { key, c } of [...contributions].sort((a, b) => Math.abs(b.c) - Math.abs(a.c))) {
    if (Math.abs(c) < 0.35) continue;
    const group = key === 'maxOverMean' ? 'sentCV' : key;
    if (seen.has(group)) continue;
    const text = explain(key, c > 0, m);
    if (!text) continue;
    seen.add(group);
    signals.push({ id: group, direction: c > 0 ? 'ai' : 'human', strength: Math.round(Math.min(1, Math.abs(c) / 3) * 100), ...text });
    if (signals.length >= 5) break;
  }

  return {
    aiScore,
    aiProbability: aiScore,
    humanProbability: 100 - aiScore,
    verdict,
    verdictLabel,
    verdictSummary,
    detectionReliability,
    reliabilityNote,
    wordCount: words.length,
    sentenceCount: sentences.length,
    metrics: {
      averageSentenceLength: Math.round(m.meanLen * 10) / 10,
      sentenceLengthVariation: Math.round(m.values.sentCV * 100),
      vocabularyVariety: Math.round(m.values.mattr * 100),
      contractionsPer100Words: Math.round(m.values.contractions * 10) / 10,
      aiStyleWordCount: m.aiWordsFound.length,
      stockTransitionShare: Math.round(m.values.connStart * 100),
    },
    signals,
    sentenceAnalysis: flagSentences(sentences),
    recommendations: buildRecommendations(signals, verdict),
    seoIssues: detectSEOIssues(clean, sentences, words),
  };
}

export function analyzeBatch(texts: string[], mode: DetectionMode = 'blog'): AnalysisResult[] {
  return texts.map((t) => analyzeContent(t, mode));
}


function detectSEOIssues(text: string, sentences: string[], words: string[]): SEOIssue[] {
  const issues: SEOIssue[] = [];
  const lowerText = text.toLowerCase();
  
  // Keyword stuffing detection
  const wordFreq: Record<string, number> = {};
  words.forEach(word => {
    if (word.length > 3) {
      wordFreq[word] = (wordFreq[word] || 0) + 1;
    }
  });
  
  const keywordThreshold = Math.max(5, words.length * 0.03);
  const stuffedKeywords = Object.entries(wordFreq)
    .filter(([_, count]) => count > keywordThreshold)
    .map(([word]) => word);
  
  if (stuffedKeywords.length > 0) {
    issues.push({
      type: 'Keyword Stuffing',
      description: `Potential keyword stuffing detected for: ${stuffedKeywords.join(', ')}`,
      severity: stuffedKeywords.length > 3 ? 'high' : 'medium',
      suggestions: [
        'Keep any single keyword under about 2 to 3 percent of the text',
        'Use natural synonyms and variations',
        'Focus on contextual relevance over repetition',
      ],
    });
  }
  
  // Thin content detection
  if (words.length < 300) {
    issues.push({
      type: 'Thin Content',
      description: `Content may be too short for SEO (${words.length} words)`,
      severity: words.length < 150 ? 'high' : 'medium',
      suggestions: [
        'Aim for at least 300 words for SEO articles',
        'Expand on key points with examples',
        'Add supporting data or statistics',
      ],
    });
  }
  
  // Robotic writing patterns
  const roboticPatterns = AI_TYPICAL_PHRASES.filter(p => lowerText.includes(p));
  if (roboticPatterns.length > 3) {
    issues.push({
      type: 'Robotic Writing',
      description: `${roboticPatterns.length} stock AI phrases found that can weaken trust signals`,
      severity: roboticPatterns.length > 6 ? 'high' : 'medium',
      suggestions: [
        'Replace generic phrases with specific, personal insights',
        'Add unique perspectives or experiences',
        'Use more conversational language',
      ],
    });
  }
  
  // Low EEAT signals
  const personalPronouns = ['i', 'me', 'my', 'we', 'our', 'us'].filter(p => 
    lowerText.split(/\s+/).includes(p)
  ).length;
  
  const hasExperience = /i (have|had|experienced|learned|discovered|found)|my experience|in my|we (have|had|found)/i.test(text);
  const hasCredentials = /certified|degree|expert|specialist|professional|years of experience/i.test(text);
  
  if (personalPronouns < 3 && !hasExperience && !hasCredentials) {
    issues.push({
      type: 'Low EEAT Signals',
      description: 'No sign of personal experience or expertise',
      severity: 'medium',
      suggestions: [
        'Add personal insights or experiences',
        'Include credentials or expertise markers',
        'Reference original research or data',
      ],
    });
  }
  
  // Generic AI phrasing
  const genericCount = GENERIC_PHRASES.filter(p => lowerText.includes(p)).length;
  if (genericCount > 2) {
    issues.push({
      type: 'Generic AI Phrasing',
      description: `${genericCount} generic phrases detected that weaken content quality`,
      severity: genericCount > 5 ? 'high' : 'low',
      suggestions: [
        'Replace generic phrases with specific examples',
        'Add concrete data or statistics',
        'Use more vivid, descriptive language',
      ],
    });
  }
  
  // Unnatural optimization
  const seoKeywordPatterns = SEO_AI_PATTERNS.filter(p => lowerText.includes(p));
  if (seoKeywordPatterns.length > 3) {
    issues.push({
      type: 'Unnatural SEO Optimization',
      description: 'Content reads as overoptimized for SEO keywords',
      severity: 'medium',
      suggestions: [
        'Write naturally for readers first',
        'Reduce explicit SEO terminology',
        'Focus on value over keyword targeting',
      ],
    });
  }
  
  // Repetitive transitions
  const transitionCount = AI_TRANSITIONS.filter(t => lowerText.includes(t)).length;
  if (transitionCount > 2) {
    issues.push({
      type: 'Repetitive Transitions',
      description: 'Overuse of formal transition words',
      severity: 'low',
      suggestions: [
        'Use more natural transitions',
        'Vary sentence connections',
        'Let ideas flow more organically',
      ],
    });
  }
  
  return issues;
}
