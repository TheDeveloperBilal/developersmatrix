/**
 * AI Content Detection Engine
 * Custom NLP logic for detecting AI-generated content without external APIs
 */

export interface AnalysisResult {
  humanProbability: number;
  aiProbability: number;
  confidenceScore: number;
  detectionReliability: string;
  metrics: {
    perplexity: number;
    burstiness: number;
    sentenceConsistency: number;
    vocabularyDiversity: number;
    repetitionScore: number;
    predictability: number;
    writingRhythm: number;
    humanLikeness: number;
  };
  sentenceAnalysis: SentenceAnalysis[];
  recommendations: string[];
  seoIssues: SEOIssue[];
}

export interface SentenceAnalysis {
  sentence: string;
  aiProbability: number;
  issues: string[];
  type: 'normal' | 'ai-typical' | 'repetitive' | 'generic' | 'seo-issue';
}

export interface SEOIssue {
  type: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  suggestions: string[];
}

export type DetectionMode = 
  | 'blog' 
  | 'seo-article' 
  | 'academic' 
  | 'resume' 
  | 'cover-letter' 
  | 'sales-copy' 
  | 'email';

interface ModeConfig {
  name: string;
  perplexityWeight: number;
  burstinessWeight: number;
  vocabularyWeight: number;
  structureWeight: number;
  formalLanguageExpected: boolean;
  personalVoiceExpected: boolean;
}

const MODE_CONFIGS: Record<DetectionMode, ModeConfig> = {
  blog: {
    name: 'Blog Content',
    perplexityWeight: 1.0,
    burstinessWeight: 1.2,
    vocabularyWeight: 0.8,
    structureWeight: 0.9,
    formalLanguageExpected: false,
    personalVoiceExpected: true,
  },
  'seo-article': {
    name: 'SEO Article',
    perplexityWeight: 1.1,
    burstinessWeight: 1.0,
    vocabularyWeight: 1.0,
    structureWeight: 1.2,
    formalLanguageExpected: true,
    personalVoiceExpected: false,
  },
  academic: {
    name: 'Academic Writing',
    perplexityWeight: 0.9,
    burstinessWeight: 0.8,
    vocabularyWeight: 1.3,
    structureWeight: 1.1,
    formalLanguageExpected: true,
    personalVoiceExpected: false,
  },
  resume: {
    name: 'Resume/CV',
    perplexityWeight: 1.0,
    burstinessWeight: 0.7,
    vocabularyWeight: 1.1,
    structureWeight: 1.3,
    formalLanguageExpected: true,
    personalVoiceExpected: false,
  },
  'cover-letter': {
    name: 'Cover Letter',
    perplexityWeight: 1.0,
    burstinessWeight: 1.0,
    vocabularyWeight: 0.9,
    structureWeight: 1.0,
    formalLanguageExpected: true,
    personalVoiceExpected: true,
  },
  'sales-copy': {
    name: 'Sales Copy',
    perplexityWeight: 1.2,
    burstinessWeight: 1.3,
    vocabularyWeight: 0.8,
    structureWeight: 0.9,
    formalLanguageExpected: false,
    personalVoiceExpected: true,
  },
  email: {
    name: 'Email Writing',
    perplexityWeight: 1.0,
    burstinessWeight: 1.1,
    vocabularyWeight: 0.7,
    structureWeight: 0.8,
    formalLanguageExpected: false,
    personalVoiceExpected: true,
  },
};

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

/**
 * Main analysis function
 */
export function analyzeContent(
  text: string,
  mode: DetectionMode = 'blog'
): AnalysisResult {
  const config = MODE_CONFIGS[mode];
  const sentences = extractSentences(text);
  const words = extractWords(text);
  
  // Calculate individual metrics
  const perplexity = calculatePerplexity(text, sentences, words);
  const burstiness = calculateBurstiness(sentences);
  const sentenceConsistency = calculateSentenceConsistency(sentences);
  const vocabularyDiversity = calculateVocabularyDiversity(words);
  const repetitionScore = calculateRepetitionScore(text, words);
  const predictability = calculatePredictability(text, sentences);
  const writingRhythm = calculateWritingRhythm(sentences);
  
  // Calculate weighted AI probability
  const aiProbability = calculateAIProbability(
    { perplexity, burstiness, sentenceConsistency, vocabularyDiversity, repetitionScore, predictability, writingRhythm },
    config
  );
  
  const humanProbability = 100 - aiProbability;
  const confidenceScore = calculateConfidenceScore(
    { perplexity, burstiness, vocabularyDiversity, predictability }
  );
  
  // Analyze individual sentences
  const sentenceAnalysis = analyzeSentences(sentences, mode);
  
  // Generate recommendations
  const recommendations = generateRecommendations(
    { perplexity, burstiness, vocabularyDiversity, repetitionScore, predictability, writingRhythm },
    sentenceAnalysis
  );
  
  // Detect SEO issues
  const seoIssues = detectSEOIssues(text, sentences, words);
  
  return {
    humanProbability: Math.round(humanProbability * 10) / 10,
    aiProbability: Math.round(aiProbability * 10) / 10,
    confidenceScore: Math.round(confidenceScore * 10) / 10,
    detectionReliability: getReliabilityLevel(confidenceScore),
    metrics: {
      perplexity: Math.round(perplexity * 10) / 10,
      burstiness: Math.round(burstiness * 10) / 10,
      sentenceConsistency: Math.round(sentenceConsistency * 10) / 10,
      vocabularyDiversity: Math.round(vocabularyDiversity * 10) / 10,
      repetitionScore: Math.round(repetitionScore * 10) / 10,
      predictability: Math.round(predictability * 10) / 10,
      writingRhythm: Math.round(writingRhythm * 10) / 10,
      humanLikeness: Math.round(humanProbability * 10) / 10,
    },
    sentenceAnalysis,
    recommendations,
    seoIssues,
  };
}

/**
 * Extract sentences from text
 */
function extractSentences(text: string): string[] {
  return text
    .replace(/([.!?])\s+/g, '$1|||')
    .split('|||')
    .map(s => s.trim())
    .filter(s => s.length > 0);
}

/**
 * Extract words from text
 */
function extractWords(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z\s]/g, '')
    .split(/\s+/)
    .filter(w => w.length > 0);
}

/**
 * Calculate perplexity - measures how "surprised" a language model would be
 * Lower perplexity = more predictable = more likely AI-generated
 */
function calculatePerplexity(text: string, sentences: string[], words: string[]): number {
  let score = 50; // Base score
  
  // Check for AI-typical phrases (reduces perplexity score)
  const lowerText = text.toLowerCase();
  let aiPhraseCount = 0;
  AI_TYPICAL_PHRASES.forEach(phrase => {
    if (lowerText.includes(phrase)) {
      aiPhraseCount++;
      score -= 3;
    }
  });
  
  // Check for predictable sentence structures
  const startsWithCommon = sentences.filter(s => {
    const firstWords = s.toLowerCase().split(/\s+/).slice(0, 3).join(' ');
    return ['it is', 'this is', 'there are', 'there is', 'one of', 'in order'].some(
      start => firstWords.startsWith(start)
    );
  }).length;
  
  score -= startsWithCommon * 2;
  
  // Vocabulary predictability
  const uniqueWords = new Set(words);
  const repetitionRatio = words.length > 0 ? 1 - (uniqueWords.size / words.length) : 0;
  score -= repetitionRatio * 20;
  
  // N-gram analysis (bigram predictability)
  const bigrams: string[] = [];
  for (let i = 0; i < words.length - 1; i++) {
    bigrams.push(`${words[i]} ${words[i + 1]}`);
  }
  
  const commonBigrams = ['of the', 'in the', 'to the', 'on the', 'and the', 'for the', 'with the', 'at the', 'is a', 'is an'];
  let commonBigramCount = 0;
  bigrams.forEach(bigram => {
    if (commonBigrams.includes(bigram)) {
      commonBigramCount++;
    }
  });
  
  const bigramRatio = bigrams.length > 0 ? commonBigramCount / bigrams.length : 0;
  score -= bigramRatio * 30;
  
  // Sentence length variance (AI tends to have more uniform lengths)
  const sentenceLengths = sentences.map(s => s.split(/\s+/).length);
  const avgLength = sentenceLengths.reduce((a, b) => a + b, 0) / sentenceLengths.length;
  const variance = sentenceLengths.reduce((sum, len) => sum + Math.pow(len - avgLength, 2), 0) / sentenceLengths.length;
  
  // More variance = more human-like
  score += Math.min(variance * 0.5, 15);
  
  return Math.max(0, Math.min(100, score));
}

/**
 * Calculate burstiness - variation in sentence complexity
 * Human writing has more "bursty" patterns (simple then complex sentences)
 */
function calculateBurstiness(sentences: string[]): number {
  if (sentences.length < 2) return 50;
  
  const complexities = sentences.map(s => {
    const words = s.split(/\s+/);
    const avgWordLength = words.reduce((sum, w) => sum + w.length, 0) / words.length;
    const hasSubordinateClause = /\b(that|which|who|because|although|while|when|if|unless)\b/i.test(s);
    const punctuationCount = (s.match(/[,;:—–-]/g) || []).length;
    
    return avgWordLength + (hasSubordinateClause ? 5 : 0) + punctuationCount * 2;
  });
  
  // Calculate coefficient of variation
  const mean = complexities.reduce((a, b) => a + b, 0) / complexities.length;
  const variance = complexities.reduce((sum, c) => sum + Math.pow(c - mean, 2), 0) / complexities.length;
  const stdDev = Math.sqrt(variance);
  
  const cv = mean > 0 ? stdDev / mean : 0;
  
  // Higher CV = more bursty = more human-like
  return Math.min(100, cv * 200 + 30);
}

/**
 * Calculate sentence structure consistency
 * AI tends to have more consistent structures
 */
function calculateSentenceConsistency(sentences: string[]): number {
  if (sentences.length < 3) return 50;
  
  // Analyze sentence structure patterns
  const patterns = sentences.map(s => {
    const words = s.toLowerCase().split(/\s+/);
    const firstWord = words[0] || '';
    const hasArticle = ['the', 'a', 'an'].includes(firstWord);
    const hasPronoun = ['i', 'you', 'he', 'she', 'it', 'we', 'they', 'this', 'that', 'these', 'those'].includes(firstWord);
    const hasPreposition = ['in', 'on', 'at', 'for', 'with', 'by', 'to', 'from', 'about'].includes(firstWord);
    const hasConnector = ['however', 'moreover', 'furthermore', 'additionally', 'therefore', 'thus'].includes(firstWord);
    
    return { hasArticle, hasPronoun, hasPreposition, hasConnector };
  });
  
  // Calculate how similar consecutive sentences are in structure
  let similarityCount = 0;
  for (let i = 1; i < patterns.length; i++) {
    const prev = patterns[i - 1];
    const curr = patterns[i];
    
    if (prev.hasArticle === curr.hasArticle) similarityCount++;
    if (prev.hasPronoun === curr.hasPronoun) similarityCount++;
    if (prev.hasPreposition === curr.hasPreposition) similarityCount++;
    if (prev.hasConnector === curr.hasConnector) similarityCount++;
  }
  
  const similarityRatio = similarityCount / ((patterns.length - 1) * 4);
  
  // Higher similarity = more AI-like
  return similarityRatio * 100;
}

/**
 * Calculate vocabulary diversity (type-token ratio)
 */
function calculateVocabularyDiversity(words: string[]): number {
  if (words.length === 0) return 50;
  
  const uniqueWords = new Set(words);
  const ttr = uniqueWords.size / words.length;
  
  // Adjust for text length (TTR naturally decreases with length)
  const lengthAdjustedTTR = ttr * (1 + Math.log(words.length) * 0.1);
  
  // Check for rare/unusual words
  const commonWords = new Set([
    'the', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
    'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should',
    'may', 'might', 'must', 'shall', 'can', 'need', 'dare', 'ought', 'used',
    'to', 'of', 'in', 'for', 'on', 'with', 'at', 'by', 'from', 'as', 'into',
    'through', 'during', 'before', 'after', 'above', 'below', 'between', 'under',
    'and', 'but', 'or', 'nor', 'so', 'yet', 'both', 'either', 'neither',
    'not', 'only', 'own', 'same', 'than', 'too', 'very', 'just', 'also',
    'that', 'which', 'who', 'whom', 'this', 'these', 'those', 'what', 'whatever',
    'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them',
    'my', 'your', 'his', 'its', 'our', 'their', 'mine', 'yours', 'hers', 'ours',
  ]);
  
  const rareWords = [...uniqueWords].filter(w => !commonWords.has(w) && w.length > 5);
  const rareWordBonus = Math.min(rareWords.length * 2, 20);
  
  return Math.min(100, lengthAdjustedTTR * 150 + rareWordBonus);
}

/**
 * Calculate repetition score
 */
function calculateRepetitionScore(text: string, words: string[]): number {
  if (words.length === 0) return 50;
  
  const lowerText = text.toLowerCase();
  let repetitionPenalty = 0;
  
  // Check for repeated phrases (3+ words)
  const phrases: Record<string, number> = {};
  for (let i = 0; i < words.length - 2; i++) {
    const phrase = `${words[i]} ${words[i + 1]} ${words[i + 2]}`;
    phrases[phrase] = (phrases[phrase] || 0) + 1;
  }
  
  const repeatedPhrases = Object.entries(phrases).filter(([_, count]) => count > 1);
  repetitionPenalty += repeatedPhrases.length * 5;
  
  // Check for AI typical phrases
  AI_TYPICAL_PHRASES.forEach(phrase => {
    const count = (lowerText.match(new RegExp(phrase, 'g')) || []).length;
    if (count > 1) {
      repetitionPenalty += count * 3;
    }
  });
  
  // Check for generic phrases
  GENERIC_PHRASES.forEach(phrase => {
    if (lowerText.includes(phrase)) {
      repetitionPenalty += 2;
    }
  });
  
  return Math.max(0, Math.min(100, 100 - repetitionPenalty));
}

/**
 * Calculate predictability score
 */
function calculatePredictability(text: string, sentences: string[]): number {
  let score = 0;
  const lowerText = text.toLowerCase();
  
  // Predictable transitions
  AI_TRANSITIONS.forEach(transition => {
    if (lowerText.includes(transition)) {
      score += 5;
    }
  });
  
  // Predictable conclusions
  const conclusionPatterns = [
    'in conclusion',
    'to conclude',
    'to summarize',
    'in summary',
    'overall',
    'all in all',
    'taking everything into account',
  ];
  
  conclusionPatterns.forEach(pattern => {
    if (lowerText.includes(pattern)) {
      score += 8;
    }
  });
  
  // Predictable sentence beginnings
  let predictableStarts = 0;
  sentences.forEach(s => {
    const firstWords = s.toLowerCase().split(/\s+/).slice(0, 2).join(' ');
    if (['it is', 'this is', 'there are', 'one of', 'in this', 'for this'].some(
      start => firstWords.startsWith(start)
    )) {
      predictableStarts++;
    }
  });
  
  score += predictableStarts * 3;
  
  return Math.min(100, score);
}

/**
 * Calculate writing rhythm (variation in sentence structure)
 */
function calculateWritingRhythm(sentences: string[]): number {
  if (sentences.length < 3) return 50;
  
  // Analyze rhythm patterns
  const lengths = sentences.map(s => s.split(/\s+/).length);
  const types = sentences.map(s => {
    const hasQuestion = s.includes('?');
    const hasExclamation = s.includes('!');
    const hasColon = s.includes(':');
    const hasDash = s.includes('—') || s.includes('–') || s.includes('-');
    
    if (hasQuestion) return 'question';
    if (hasExclamation) return 'exclamation';
    if (hasColon || hasDash) return 'complex';
    return 'statement';
  });
  
  // Sentence length variation
  const lengthVariation = calculateVariation(lengths);
  
  // Type diversity
  const typeSet = new Set(types);
  const typeDiversity = typeSet.size / types.length;
  
  // Rhythm breaks (short sentences among long ones)
  const avgLength = lengths.reduce((a, b) => a + b, 0) / lengths.length;
  const rhythmBreaks = lengths.filter(l => l < avgLength * 0.5).length;
  const rhythmBreakBonus = Math.min(rhythmBreaks * 5, 20);
  
  return Math.min(100, lengthVariation * 0.5 + typeDiversity * 50 + rhythmBreakBonus);
}

function calculateVariation(numbers: number[]): number {
  if (numbers.length === 0) return 0;
  const mean = numbers.reduce((a, b) => a + b, 0) / numbers.length;
  const variance = numbers.reduce((sum, n) => sum + Math.pow(n - mean, 2), 0) / numbers.length;
  return Math.sqrt(variance);
}

/**
 * Calculate overall AI probability
 */
function calculateAIProbability(
  metrics: {
    perplexity: number;
    burstiness: number;
    sentenceConsistency: number;
    vocabularyDiversity: number;
    repetitionScore: number;
    predictability: number;
    writingRhythm: number;
  },
  config: ModeConfig
): number {
  // Invert human-like metrics for AI probability
  const perplexityScore = (100 - metrics.perplexity) * config.perplexityWeight;
  const burstinessScore = (100 - metrics.burstiness) * config.burstinessWeight;
  const consistencyScore = metrics.sentenceConsistency * config.structureWeight;
  const vocabScore = (100 - metrics.vocabularyDiversity) * config.vocabularyWeight;
  const repetitionScore = 100 - metrics.repetitionScore;
  const predictabilityScore = metrics.predictability;
  const rhythmScore = 100 - metrics.writingRhythm;
  
  const totalWeight = config.perplexityWeight + config.burstinessWeight + 
    config.vocabularyWeight + config.structureWeight + 1 + 1 + 1;
  
  const aiScore = (
    perplexityScore + 
    burstinessScore + 
    consistencyScore + 
    vocabScore + 
    repetitionScore + 
    predictabilityScore + 
    rhythmScore
  ) / totalWeight;
  
  return Math.max(0, Math.min(100, aiScore));
}

/**
 * Calculate confidence score
 */
function calculateConfidenceScore(metrics: {
  perplexity: number;
  burstiness: number;
  vocabularyDiversity: number;
  predictability: number;
}): number {
  // Higher variance in metrics = more confident detection
  const values = Object.values(metrics);
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const variance = values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / values.length;
  
  // Also consider extreme values (high or low) increase confidence
  const extremes = values.filter(v => v < 20 || v > 80).length;
  
  return Math.min(100, 50 + variance * 0.3 + extremes * 10);
}

/**
 * Get reliability level string
 */
function getReliabilityLevel(confidence: number): string {
  if (confidence >= 80) return 'Very High';
  if (confidence >= 65) return 'High';
  if (confidence >= 50) return 'Moderate';
  if (confidence >= 35) return 'Low';
  return 'Very Low';
}

/**
 * Analyze individual sentences
 */
function analyzeSentences(sentences: string[], mode: DetectionMode): SentenceAnalysis[] {
  return sentences.map(sentence => {
    const lowerSentence = sentence.toLowerCase();
    const issues: string[] = [];
    let aiProb = 30; // Base probability
    
    // Check for AI-typical phrases
    AI_TYPICAL_PHRASES.forEach(phrase => {
      if (lowerSentence.includes(phrase)) {
        aiProb += 15;
        issues.push(`Contains AI-typical phrase: "${phrase}"`);
      }
    });
    
    // Check for generic phrases
    GENERIC_PHRASES.forEach(phrase => {
      if (lowerSentence.includes(phrase)) {
        aiProb += 10;
        issues.push(`Contains generic phrase: "${phrase}"`);
      }
    });
    
    // Check for predictable structure
    const firstWords = lowerSentence.split(/\s+/).slice(0, 3).join(' ');
    if (['it is important', 'it is crucial', 'it is essential', 'it should be', 'it can be'].some(
      start => firstWords.startsWith(start)
    )) {
      aiProb += 12;
      issues.push('Predictable sentence structure');
    }
    
    // Check for overuse of adjectives/adverbs
    const intensifiers = ['very', 'really', 'extremely', 'highly', 'incredibly', 'remarkably', 'exceptionally'];
    const intensifierCount = intensifiers.filter(i => lowerSentence.includes(i)).length;
    if (intensifierCount > 1) {
      aiProb += intensifierCount * 8;
      issues.push('Overuse of intensifying words');
    }
    
    // Check for passive voice (AI tends to use more passive)
    if (/\b(is|are|was|were|be|been|being)\s+\w+ed\b/i.test(sentence)) {
      aiProb += 5;
      issues.push('Uses passive voice');
    }
    
    // Check for repetition within sentence
    const words = lowerSentence.split(/\s+/);
    const uniqueWords = new Set(words);
    if (words.length > 5 && uniqueWords.size / words.length < 0.7) {
      aiProb += 10;
      issues.push('High word repetition within sentence');
    }
    
    // Determine sentence type
    let type: SentenceAnalysis['type'] = 'normal';
    if (aiProb > 70) type = 'ai-typical';
    else if (issues.some(i => i.includes('repetition'))) type = 'repetitive';
    else if (issues.some(i => i.includes('generic'))) type = 'generic';
    
    return {
      sentence,
      aiProbability: Math.min(100, aiProb),
      issues,
      type,
    };
  });
}

/**
 * Generate recommendations based on analysis
 */
function generateRecommendations(
  metrics: AnalysisResult['metrics'],
  sentenceAnalysis: SentenceAnalysis[]
): string[] {
  const recommendations: string[] = [];
  
  if (metrics.perplexity < 40) {
    recommendations.push('Add more unique phrases and unexpected word choices to increase text unpredictability.');
  }
  
  if (metrics.burstiness < 40) {
    recommendations.push('Vary your sentence structure more. Mix short, punchy sentences with longer, complex ones.');
  }
  
  if (metrics.vocabularyDiversity < 40) {
    recommendations.push('Expand your vocabulary. Use more specific, descriptive words instead of generic terms.');
  }
  
  if (metrics.repetitionScore < 50) {
    recommendations.push('Reduce repetition. Use synonyms and rephrase repeated concepts differently.');
  }
  
  if (metrics.predictability > 60) {
    recommendations.push('Avoid predictable transitions and cliché phrases. Use more natural, conversational language.');
  }
  
  if (metrics.writingRhythm < 40) {
    recommendations.push('Add rhythm breaks. Include questions, exclamations, or varied sentence structures.');
  }
  
  // Count problematic sentences
  const aiTypicalSentences = sentenceAnalysis.filter(s => s.type === 'ai-typical').length;
  if (aiTypicalSentences > 0) {
    recommendations.push(`Review ${aiTypicalSentences} sentence(s) flagged as AI-typical. Consider rephrasing with more personal voice.`);
  }
  
  return recommendations;
}

/**
 * Detect SEO-specific issues
 */
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
        'Reduce keyword density to under 2-3%',
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
      description: `${roboticPatterns.length} AI-typical phrases detected that may affect EEAT signals`,
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
      description: 'Content lacks personal experience or expertise indicators',
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
      description: 'Content appears over-optimized for SEO keywords',
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

/**
 * Batch analysis for multiple texts
 */
export function analyzeBatch(
  texts: string[],
  mode: DetectionMode = 'blog'
): AnalysisResult[] {
  return texts.map(text => analyzeContent(text, mode));
}

/**
 * Get detection mode configuration
 */
export function getModeConfig(mode: DetectionMode): ModeConfig {
  return MODE_CONFIGS[mode];
}

/**
 * Get all available modes
 */
export function getAvailableModes(): { id: DetectionMode; name: string }[] {
  return Object.entries(MODE_CONFIGS).map(([id, config]) => ({
    id: id as DetectionMode,
    name: config.name,
  }));
}
