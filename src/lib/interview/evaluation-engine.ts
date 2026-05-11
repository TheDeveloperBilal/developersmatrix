// Answer Evaluation Engine - Analyzes user answers and generates intelligent feedback
// Uses ONLY local logic - no paid APIs

import {
  Role,
  Category,
  Difficulty,
  roleKnowledgeBase,
  qualityIndicators,
  followUpTriggers,
  Topic
} from './knowledge-base';

export interface EvaluationResult {
  isRelevant: boolean;
  relevanceScore: number;
  qualityScore: number;
  depthScore: number;
  overallScore: number;
  strengths: string[];
  improvements: string[];
  coveredConcepts: string[];
  missedConcepts: string[];
  feedback: string;
  sampleAnswer: string;
  followUpSuggestion?: string;
}

export interface QuestionContext {
  question: string;
  role: Role;
  category: Category;
  difficulty: Difficulty;
  topics: Topic[];
}

// ============================================
// TEXT NORMALIZATION UTILITIES
// ============================================

function normalizeText(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 2);
}

function getWordFrequency(words: string[]): Map<string, number> {
  const frequency = new Map<string, number>();
  words.forEach(word => {
    frequency.set(word, (frequency.get(word) || 0) + 1);
  });
  return frequency;
}

// Extract meaningful keywords from a question
function extractQuestionKeywords(question: string): string[] {
  const stopWords = new Set([
    'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'i',
    'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at',
    'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she',
    'or', 'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their', 'what',
    'so', 'up', 'out', 'if', 'about', 'who', 'get', 'which', 'go', 'me',
    'when', 'make', 'can', 'like', 'time', 'no', 'just', 'him', 'know', 'take',
    'people', 'into', 'year', 'your', 'good', 'some', 'could', 'them', 'see', 'other',
    'than', 'then', 'now', 'look', 'only', 'come', 'its', 'over', 'think', 'also',
    'back', 'after', 'use', 'two', 'how', 'our', 'work', 'first', 'well', 'way',
    'even', 'new', 'want', 'because', 'any', 'these', 'give', 'day', 'most', 'us',
    'is', 'are', 'was', 'were', 'been', 'being', 'has', 'had', 'does', 'did',
    'tell', 'describe', 'explain', 'give', 'share', 'walk', 'can', 'how', 'what',
    'where', 'why', 'who', 'which', 'did', 'would', 'should', 'could', 'me',
    'please', 'kindly', 'discuss', 'mention', 'talk', 'about', 'regarding',
    'concerning', 'related', 'pertaining', 'referring', 'with', 'respect',
    'context', 'terms', 'regards', 'regard', 'regarding', 'regards'
  ]);

  const words = normalizeText(question);
  return [...new Set(words.filter(w => !stopWords.has(w) && w.length > 3))];
}

// ============================================
// IRRELEVANCE DETECTION
// ============================================

function isKeyboardMashing(text: string): boolean {
  const rows = ['qwertyuiop', 'asdfghjkl', 'zxcvbnm'];
  const cleanText = text.toLowerCase().replace(/\s+/g, '');

  for (const row of rows) {
    let consecutiveCount = 0;
    let segmentStart = 0;
    for (let i = 0; i < cleanText.length; i++) {
      if (row.includes(cleanText[i])) {
        if (consecutiveCount === 0) segmentStart = i;
        consecutiveCount++;
        if (consecutiveCount >= 8) {
          const segment = cleanText.slice(segmentStart, i + 1);
          const uniqueChars = new Set(segment.split('')).size;
          if (uniqueChars < 4) return true;
        }
      } else {
        consecutiveCount = 0;
      }
    }
  }
  return false;
}

function isExcessiveRepetition(text: string): boolean {
  const words = normalizeText(text);
  if (words.length < 6) return false;
  const freq = getWordFrequency(words);
  let maxCount = 0;
  freq.forEach(c => { if (c > maxCount) maxCount = c; });
  return maxCount > 5 && (maxCount / words.length) > 0.5;
}

function hasEnoughMeaningfulContent(text: string): boolean {
  const words = text.toLowerCase().split(/\s+/).filter(w => w.length > 0);
  if (words.length === 0) return false;

  // Check for words longer than 3 chars (content words, not just "the", "and")
  const contentWords = words.filter(w => w.replace(/[^a-z]/g, '').length > 3);
  if (contentWords.length >= 2) return true;

  // Check word diversity
  const uniqueWords = new Set(words);
  if (uniqueWords.size >= 3) return true;

  // If very short, check for any substance
  if (words.length <= 2) return false;

  return true;
}

function hasNarrativeStructure(text: string): boolean {
  const lower = text.toLowerCase();
  const hasPersonal = /\b(i|my|me|we|our|myself)\b/.test(lower);
  const actionWords = [
    'was','were','had','did','worked','led','managed','created','built','developed',
    'solved','resolved','handled','improved','achieved','delivered','faced','overcame',
    'organized','facilitated','implemented','designed','wrote','coded','tested','deployed',
    'maintained','debugged','optimized','refactored','collaborated','communicated','presented',
    'negotiated','persuaded','influenced','motivated','mentored','coached','guided','supported',
    'helped','assisted','contributed','participated','volunteered','initiated','started',
    'began','launched','introduced','established','set up','put together','came up with',
    'figured out','found out','discovered','learned','realized','understood','knew','thought',
    'decided','chose','selected','picked','went with','opted for','preferred','liked','enjoyed',
    'appreciated','valued','respected','trusted','depended on','relied on','counted on',
    'looked to','turned to','reached out to','got in touch with','contacted','called','emailed',
    'messaged','spoke with','talked to','met with','sat down with','had a conversation with'
  ];
  const hasAction = actionWords.some(w => lower.includes(w));
  const timeWords = [
    'when','during','while','after','before','once','then','last','previous','ago',
    'recently','earlier','at that time','in that situation','on that project','in that role',
    'at that company','back then','at the time','during that period'
  ];
  const hasTime = timeWords.some(w => lower.includes(w));
  return hasPersonal && hasAction && hasTime;
}

function hasTechnicalStructure(text: string): boolean {
  const lower = text.toLowerCase();
  const explanationWords = [
    'because','since','as','therefore','thus','this means','results in','causes','leads to',
    'when','if','then','so','consequently','hence','due to','owing to','thanks to','as a result',
    'in order to','so that','such that','provided that','given that','assuming that',
    'supposing that','in case','unless','until','while','whereas','although','even though',
    'despite','in spite of','instead of','rather than','other than','apart from','aside from',
    'except for','besides','in addition to','along with','together with','as well as',
    'not only','but also','either','neither','both','all','some','many','most','few',
    'several','various','different','multiple','numerous','countless','infinite','unlimited',
    'limited','restricted','constrained','bounded','defined','specified','given','known',
    'unknown','uncertain','unclear','ambiguous','vague','precise','exact','specific','general',
    'broad','wide','narrow','deep','shallow','high','low','big','small','large','tiny',
    'huge','massive','minor','major','significant','insignificant','important','unimportant',
    'critical','crucial','essential','vital','necessary','unnecessary','required','optional',
    'mandatory','compulsory','voluntary','automatic','manual','direct','indirect','immediate',
    'delayed','instant','gradual','sudden','rapid','slow','fast','quick','steady','stable',
    'unstable','consistent','inconsistent','uniform','variable','constant','changing',
    'dynamic','static','active','passive','positive','negative','neutral','absolute','relative',
    'objective','subjective','concrete','abstract','tangible','intangible','visible','invisible',
    'apparent','hidden','obvious','subtle','clear','unclear','explicit','implicit','literal',
    'figurative','actual','potential','real','theoretical','practical','functional',
    'operational','working','broken','fixed','repaired','maintained','supported'
  ];
  const hasExplanation = explanationWords.some(w => lower.includes(w));
  const techTerms = [
    'code','function','class','component','module','library','framework','api','database',
    'server','client','algorithm','system','architecture','design','implementation','protocol',
    'interface','service','endpoint','request','response','cache','memory','cpu','gpu','storage',
    'network','bandwidth','latency','throughput','performance','optimization','efficiency',
    'scalability','reliability','availability','security','encryption','authentication',
    'authorization','token','session','cookie','header','body','payload','json','xml','yaml',
    'html','css','javascript','typescript','python','java','go','rust','sql','nosql','graphql',
    'rest','grpc','websocket','http','https','tcp','udp','ip','dns','cdn','load balancer',
    'reverse proxy','firewall','vpn','docker','kubernetes','container','pod','node','cluster',
    'microservice','monolith','serverless','lambda','ec2','s3','rds','redis','mongodb','postgres',
    'mysql','sqlite','elasticsearch','kafka','rabbitmq','sqs','celery','airflow','spark','hadoop',
    'tensorflow','pytorch','scikit','pandas','numpy','matplotlib','seaborn','plotly','jupyter',
    'notebook','git','github','gitlab','ci/cd','jenkins','github actions','terraform','ansible',
    'pulumi','prometheus','grafana','elk','datadog','newrelic','sentry','logrocket','postman',
    'insomnia','swagger','openapi','jest','mocha','cypress','playwright','selenium','vitest',
    'storybook','chromatic','vercel','netlify','heroku','aws','azure','gcp','cloudflare','fastly'
  ];
  const hasTechTerms = techTerms.some(w => lower.includes(w));
  return hasExplanation || hasTechTerms;
}

function isCompletelyUnrelated(answer: string, question: string, category: Category): boolean {
  const answerLower = answer.toLowerCase();
  const questionKeywords = extractQuestionKeywords(question);

  // Check for any keyword overlap
  const hasOverlap = questionKeywords.some(kw => answerLower.includes(kw));
  if (hasOverlap) return false;

  // For behavioral questions, check narrative structure as fallback
  if (category === 'behavioral') {
    if (hasNarrativeStructure(answer)) return false;
  }

  // For technical questions, check technical structure as fallback
  if (category === 'technical') {
    if (hasTechnicalStructure(answer)) return false;
  }

  // For system design, check for system-related terms
  if (category === 'system') {
    if (/\b(system|architecture|design|scale|scalable|database|cache|api|service|component|microservice|server|client|load|traffic|user|request|response|data|storage|memory|cpu|bandwidth|latency|throughput|performance|reliability|availability|consistency|partition|shard|replica|backup|failover|redundancy|monitoring|logging|metrics|alerting|observability|deployment|infrastructure|cloud|aws|azure|gcp)\b/.test(answerLower)) {
      return false;
    }
  }

  // If no overlap and no category-specific markers, likely unrelated
  // BUT only flag if the answer is reasonably long (short answers might just be concise)
  const wordCount = answer.trim().split(/\s+/).filter(w => w.length > 0).length;
  if (wordCount < 8) return false; // Give short answers the benefit of the doubt

  return true;
}

export function detectIrrelevantInput(answer: string, question: string, category?: Category): { isIrrelevant: boolean; reason: string } {
  const trimmedAnswer = answer.trim();
  const wordCount = trimmedAnswer.split(/\s+/).filter(w => w.length > 0).length;

  // 1. Empty answer
  if (wordCount === 0) {
    return { isIrrelevant: true, reason: 'Please provide an answer before submitting.' };
  }

  // 2. Too short (less than 3 words)
  if (wordCount < 3) {
    return {
      isIrrelevant: true,
      reason: 'Your answer is too short. Please provide a more detailed response with specific examples.'
    };
  }

  // 3. Non-answer phrases at start (anchored to start, not requiring exact match)
  const nonAnswerPatterns = [
    /^(i don'?t know|i have no idea|no idea|not sure|i'?m not sure)/i,
    /^(skip|pass|next|i don'?t want to answer|i can'?t answer|i won'?t answer|no comment)/i,
    /^(yes\.|no\.|maybe\.|ok\.|sure\.|fine\.?)$/i
  ];
  for (const pattern of nonAnswerPatterns) {
    if (pattern.test(trimmedAnswer)) {
      return {
        isIrrelevant: true,
        reason: 'Please provide a more detailed response that addresses the question.'
      };
    }
  }

  // 4. Keyboard mashing
  if (isKeyboardMashing(trimmedAnswer)) {
    return { isIrrelevant: true, reason: 'Your answer appears to contain random text. Please provide a meaningful response to the question.' };
  }

  // 5. Placeholder text
  if (/lorem ipsum|gibberish|blah blah|placeholder text|dummy text|test test|asdf|qwerty/i.test(trimmedAnswer)) {
    return { isIrrelevant: true, reason: 'Please provide an actual answer rather than placeholder text.' };
  }

  // 6. Repeated single characters
  if (/^([a-z])\1{4,}$/i.test(trimmedAnswer.replace(/\s+/g, ''))) {
    return { isIrrelevant: true, reason: 'Your answer appears to contain random characters. Please provide a meaningful response.' };
  }

  // 7. Excessive repetition
  if (isExcessiveRepetition(trimmedAnswer)) {
    return { isIrrelevant: true, reason: 'Your answer appears to be repetitive. Please provide more diverse content.' };
  }

  // 8. Not enough meaningful content
  if (!hasEnoughMeaningfulContent(trimmedAnswer)) {
    return { isIrrelevant: true, reason: 'Your answer does not appear to contain meaningful content. Please provide a relevant response.' };
  }

  // 9. Semantic relevance: does the answer actually address the question?
  if (category && isCompletelyUnrelated(trimmedAnswer, question, category)) {
    return {
      isIrrelevant: true,
      reason: 'Your answer does not match the question. Please answer accordingly.'
    };
  }

  return { isIrrelevant: false, reason: '' };
}

// ============================================
// RELEVANCE SCORING
// ============================================

function calculateRelevanceScore(
  answer: string,
  topics: Topic[],
  category: Category,
  question: string
): { score: number; coveredConcepts: string[]; missedConcepts: string[] } {
  const answerLower = answer.toLowerCase();
  const coveredConcepts: string[] = [];
  const missedConcepts: string[] = [];

  // Validate topics - must be proper Topic objects
  const validTopics = topics.filter(t => t && typeof t === 'object' && Array.isArray(t.keywords));

  let baseScore = 0;

  if (validTopics.length > 0) {
    let totalRelevance = 0;
    let totalWeight = 0;

    for (const topic of validTopics) {
      let keywordMatches = 0;
      for (const keyword of topic.keywords) {
        if (answerLower.includes(keyword.toLowerCase())) {
          keywordMatches++;
          if (!coveredConcepts.includes(keyword)) coveredConcepts.push(keyword);
        }
      }

      let conceptMatches = 0;
      for (const concept of topic.concepts) {
        const conceptWords = concept.toLowerCase().split(/\s+/);
        const conceptFound = conceptWords.some(w => answerLower.includes(w));
        if (conceptFound) {
          conceptMatches++;
          if (!coveredConcepts.includes(concept)) coveredConcepts.push(concept);
        } else {
          missedConcepts.push(concept);
        }
      }

      const keywordScore = keywordMatches / Math.max(topic.keywords.length, 1);
      const conceptScore = conceptMatches / Math.max(topic.concepts.length, 1);
      const topicScore = keywordScore * 0.4 + conceptScore * 0.6;

      totalRelevance += topicScore * topic.keywords.length;
      totalWeight += topic.keywords.length;
    }

    baseScore = totalWeight > 0 ? (totalRelevance / totalWeight) * 10 : 0;
  }

  // Supplement with question-based keyword overlap
  const questionKeywords = extractQuestionKeywords(question);
  const questionMatches = questionKeywords.filter(kw => answerLower.includes(kw));
  for (const kw of questionMatches) {
    if (!coveredConcepts.includes(kw)) coveredConcepts.push(kw);
  }
  const questionBonus = Math.min(3, (questionMatches.length / Math.max(questionKeywords.length, 1)) * 3);

  // Category-specific bonus scoring
  let categoryBonus = 0;

  if (category === 'behavioral') {
    // Narrative structure bonus
    if (hasNarrativeStructure(answer)) categoryBonus += 2;
    // STAR method indicators
    const situationWords = [
      'situation','context','when','during','while','at that time','in that role',
      'working on','part of','involved in','assigned to','responsible for'
    ];
    const hasSituation = situationWords.some(w => answerLower.includes(w));
    const taskWords = [
      'task','goal','objective','needed to','was asked','had to','required to',
      'responsibility','my role','my job','i needed','i had to'
    ];
    const hasTask = taskWords.some(w => answerLower.includes(w));
    const actionWords = [
      'action','i did','i took','i implemented','i created','i led','i worked',
      'i developed','i built','i designed','i wrote','i coded','i managed',
      'i organized','i facilitated','i resolved','i solved','i handled','i addressed',
      'i tackled','i approached','i started','i initiated','i began','i proceeded',
      'i continued','i followed','i used','i applied','i employed','i utilized',
      'i leveraged','i adopted','i chose','i decided','i selected','i opted',
      'i went with','i preferred','i determined','i concluded','i established',
      'i set up','i put together','i came up with','i figured out','i found out',
      'i discovered','i learned','i realized','i understood','i knew','i thought'
    ];
    const hasAction = actionWords.some(w => answerLower.includes(w));
    const resultWords = [
      'result','outcome','impact','achieved','improved','delivered','success',
      'completed','finished','accomplished','obtained','gained','reached','met',
      'exceeded','final','eventually','in the end','at last','ultimately',
      'consequently','as a result','because of this','thanks to','due to',
      'leading to','resulting in','which meant','this meant','that meant',
      'it meant','we were able','i was able','the team was able','this allowed',
      'this enabled','this helped','this led to'
    ];
    const hasResult = resultWords.some(w => answerLower.includes(w));

    if (hasSituation && hasTask && hasAction && hasResult) categoryBonus += 3;
    else if (hasAction && hasResult) categoryBonus += 2;
    else if (hasAction) categoryBonus += 1;

    // Quantification bonus
    const quantPatterns = [
      /\d+%/, /\d+ percent/, /\d+ times/, /\d+ (hour|day|week|month|year)s?/,
      /\$[\d,]+/, /\d+ users/, /\d+ projects/, /\d+ (team|people|member)s?/,
      /\d+x/, /increased by/, /decreased by/, /improved by/, /reduced by/, /grew by/, /shrank by/
    ];
    if (quantPatterns.some(p => p.test(answerLower))) {
      categoryBonus += 1;
    }
  } else if (category === 'technical') {
    // Technical explanation structure
    if (hasTechnicalStructure(answer)) categoryBonus += 2;
    // Code examples
    const codePatterns = ['```','function','class','const','let','var','import','export','def ','return ','if(','for(','while(','=>','.then(','async','await'];
    if (codePatterns.some(p => answerLower.includes(p))) {
      categoryBonus += 1.5;
    }
    // Complexity discussion
    const complexityWords = [
      'o(','complexity','efficient','optimize','trade-off','tradeoff','time','space','big o',
      'performance','benchmark','memory','cpu','latency','throughput','bottleneck','scalable',
      'concurrent','parallel','thread','process','async','synchronous','blocking','non-blocking',
      'event loop','callback','promise','queue','stack','heap','cache','buffer','stream','pipeline'
    ];
    if (complexityWords.some(w => answerLower.includes(w))) {
      categoryBonus += 1;
    }
    // Examples
    const exampleWords = [
      'for example','e.g.','such as','like','instance','specifically','in particular',
      'namely','concretely','practically','in practice','real world','real-world','actual','concrete','specific'
    ];
    if (exampleWords.some(w => answerLower.includes(w))) {
      categoryBonus += 0.5;
    }
  } else if (category === 'system') {
    // System design structure
    const systemWords = [
      'architecture','component','service','database','cache','queue','api','server','client',
      'microservice','gateway','load balancer','cdn','reverse proxy','firewall','vpc','subnet'
    ];
    if (systemWords.some(w => answerLower.includes(w))) {
      categoryBonus += 1.5;
    }
    const scaleWords = [
      'scale','scalability','scalable','sharding','replication','partitioning','horizontal',
      'vertical','auto-scale','autoscale','elastic'
    ];
    if (scaleWords.some(w => answerLower.includes(w))) {
      categoryBonus += 1;
    }
    const tradeWords = [
      'trade-off','tradeoff','pros','cons','advantage','disadvantage','versus','vs',
      'compare','alternative','option','choice','decide','select','prefer'
    ];
    if (tradeWords.some(w => answerLower.includes(w))) {
      categoryBonus += 1;
    }
    const reliabilityWords = [
      'reliability','availability','fault','tolerance','backup','failover','redundancy',
      'monitoring','alerting','observability','logging','metrics','health check',
      'circuit breaker','retry','timeout','degradation','graceful'
    ];
    if (reliabilityWords.some(w => answerLower.includes(w))) {
      categoryBonus += 1;
    }
  }

  const score = Math.min(10, Math.max(2, baseScore + questionBonus + categoryBonus));

  return {
    score: Math.round(score * 10) / 10,
    coveredConcepts,
    missedConcepts: missedConcepts.slice(0, 5)
  };
}

// ============================================
// QUALITY ANALYSIS
// ============================================

function analyzeQuality(answer: string, category: Category): { score: number; indicators: string[] } {
  const indicators: string[] = [];
  let score = 5; // Base score

  const answerLower = answer.toLowerCase();
  const wordCount = answer.trim().split(/\s+/).filter(w => w.length > 0).length;
  const paragraphCount = answer.split(/\n\s*\n/).filter(p => p.trim().length > 0).length;

  // Length analysis - generous thresholds
  if (wordCount >= 200) {
    score += 1.5;
    indicators.push('Comprehensive, detailed answer');
  } else if (wordCount >= 100) {
    score += 1;
    indicators.push('Thorough answer with good detail');
  } else if (wordCount >= 50) {
    score += 0.5;
    indicators.push('Adequate answer length');
  } else if (wordCount >= 30) {
    score += 0.25;
    indicators.push('Moderate answer length');
  } else if (wordCount >= 15) {
    // Short but acceptable
  } else if (wordCount < 10) {
    score -= 1;
    indicators.push('Answer is quite brief — consider expanding');
  }

  // Paragraph structure bonus
  if (paragraphCount >= 3) {
    score += 0.5;
    indicators.push('Well-structured with multiple paragraphs');
  } else if (paragraphCount >= 2) {
    score += 0.25;
    indicators.push('Good paragraph structure');
  }

  // Analytical language
  const analyticalWords = ['because', 'therefore', 'however', 'additionally', 'furthermore', 'specifically', 'consequently', 'result', 'thus', 'hence', 'since', 'as', 'due to', 'owing to', 'in order to', 'so that'];
  const analyticalMatches = analyticalWords.filter(w => answerLower.includes(w)).length;
  if (analyticalMatches >= 4) {
    score += 1.5;
    indicators.push('Strong analytical reasoning with clear logic');
  } else if (analyticalMatches >= 2) {
    score += 0.75;
    indicators.push('Good analytical structure');
  } else if (analyticalMatches >= 1) {
    score += 0.25;
    indicators.push('Some analytical reasoning present');
  }

  // Category-specific analysis
  if (category === 'behavioral') {
    const situationWords = [
      'situation','context','when','during','while','at that time','in that role',
      'working on','part of','involved in','assigned to','responsible for'
    ];
    const hasSituation = situationWords.some(w => answerLower.includes(w));
    const taskWords = [
      'task','goal','objective','needed to','was asked','had to','required to',
      'responsibility','my role','my job','i needed','i had to'
    ];
    const hasTask = taskWords.some(w => answerLower.includes(w));
    const actionWords = [
      'action','i did','i took','i implemented','i created','i led','i worked',
      'i developed','i built','i designed','i wrote','i coded','i managed',
      'i organized','i facilitated','i resolved','i solved','i handled','i addressed',
      'i tackled','i approached','i started','i initiated','i began','i proceeded',
      'i continued','i followed','i used','i applied','i employed','i utilized',
      'i leveraged','i adopted','i chose','i decided','i selected','i opted',
      'i went with','i preferred','i determined','i concluded','i established',
      'i set up','i put together','i came up with','i figured out','i found out',
      'i discovered','i learned','i realized','i understood','i knew','i thought'
    ];
    const hasAction = actionWords.some(w => answerLower.includes(w));
    const resultWords = [
      'result','outcome','impact','achieved','improved','delivered','success',
      'completed','finished','accomplished','obtained','gained','reached','met',
      'exceeded','final','eventually','in the end','at last','ultimately',
      'consequently','as a result','because of this','thanks to','due to',
      'leading to','resulting in','which meant','this meant','that meant',
      'it meant','we were able','i was able','the team was able','this allowed',
      'this enabled','this helped','this led to'
    ];
    const hasResult = resultWords.some(w => answerLower.includes(w));

    if (hasSituation && hasTask && hasAction && hasResult) {
      score += 1.5;
      indicators.push('Excellent STAR method structure');
    } else if (hasAction && hasResult) {
      score += 0.75;
      indicators.push('Good story with action and outcome');
    } else if (hasAction) {
      score += 0.25;
      indicators.push('Clear action steps described');
    } else {
      indicators.push('Consider using STAR method (Situation, Task, Action, Result)');
    }

    const quantPatterns = [
      /\d+%/, /\d+ percent/, /\d+ times/, /\d+ (hour|day|week|month|year)s?/,
      /\$[\d,]+/, /\d+ users/, /\d+ projects/, /\d+ (team|people|member)s?/,
      /\d+x/, /increased by/, /decreased by/, /improved by/, /reduced by/, /grew by/, /shrank by/
    ];
    if (quantPatterns.some(p => p.test(answerLower))) {
      score += 0.5;
      indicators.push('Good use of quantifiable metrics');
    } else {
      indicators.push('Add quantifiable metrics to demonstrate impact');
    }
  } else if (category === 'technical') {
    const codePatterns = ['```','function','class','const','let','var','import','export','def ','return ','if(','for(','while(','=>'];
    const hasCodeExample = codePatterns.some(p => answerLower.includes(p));
    const complexityWords = [
      'o(','complexity','efficient','optimize','trade-off','tradeoff','time','space','big o',
      'performance','benchmark','memory','cpu','latency','throughput','bottleneck','scalable',
      'concurrent','parallel','thread','process','async','synchronous','blocking','non-blocking',
      'event loop','callback','promise','queue','stack','heap','cache','buffer','stream','pipeline'
    ];
    const hasComplexity = complexityWords.some(w => answerLower.includes(w));
    const exampleWords = [
      'for example','e.g.','such as','like','instance','specifically','in particular',
      'namely','concretely','practically','in practice','real world','real-world','actual','concrete','specific'
    ];
    const hasExample = exampleWords.some(w => answerLower.includes(w));
    const edgeCaseWords = [
      'edge case','corner case','boundary','handle','exception','error','failure','null',
      'undefined','empty','invalid','unexpected','malformed','sanitize','validate','verify',
      'check','test','assert','ensure','guarantee','prevent','protect','defend','secure','safe',
      'risk','vulnerability','attack','threat','exploit','breach','leak','overflow','underflow',
      'deadlock','race condition','memory leak','infinite loop','stack overflow','buffer overflow'
    ];
    const hasEdgeCases = edgeCaseWords.some(w => answerLower.includes(w));

    if (hasCodeExample) {
      score += 0.5;
      indicators.push('Provided code or pseudo-code example');
    }
    if (hasComplexity) {
      score += 0.5;
      indicators.push('Discussed complexity or performance');
    }
    if (hasExample) {
      score += 0.5;
      indicators.push('Provided concrete examples');
    }
    if (hasEdgeCases) {
      score += 0.25;
      indicators.push('Considered edge cases and error handling');
    }

    if (!hasCodeExample && !hasExample) {
      indicators.push('Include code examples or specific implementation details when applicable');
    }
    if (!hasComplexity) {
      indicators.push('Discuss time/space complexity or performance characteristics');
    }
  } else if (category === 'system') {
    const componentWords = [
      'component','service','database','cache','queue','api','server','client','microservice',
      'gateway','load balancer','cdn','reverse proxy','firewall','vpc','subnet','module','layer','tier','node','cluster','instance','container','pod'
    ];
    const hasComponents = componentWords.some(w => answerLower.includes(w));
    const scaleWords = [
      'scale','scalability','scalable','sharding','replication','partitioning','horizontal',
      'vertical','auto-scale','autoscale','elastic','traffic','concurrent','distributed',
      'replica','shard','partition','segment','slice','chunk','split','divide','separate',
      'isolate','decouple','independently','autonomously','self-contained','loosely coupled',
      'tightly coupled','cohesion','cohesive','modular','modularity','componentized',
      'service-oriented','soa','microservices','monolith','monolithic','serverless','faas',
      'lambda','edge','cdn','fog','mesh','grid','cluster','swarm','federation'
    ];
    const hasScalability = scaleWords.some(w => answerLower.includes(w));
    const tradeWords = [
      'trade-off','tradeoff','pros','cons','advantage','disadvantage','versus','vs','compare',
      'comparison','alternative','option','choice','decide','decision','select','selection',
      'prefer','preference','prioritize','priority','balance','compromise','negotiate','weigh',
      'evaluate','assess','judge','critique','criticize','defend','justify','rationale',
      'reasoning','logic','argument','support','evidence','proof','demonstrate','show','illustrate','exemplify'
    ];
    const hasTradeoffs = tradeWords.some(w => answerLower.includes(w));
    const reliabilityWords = [
      'reliability','availability','fault','tolerance','backup','failover','redundancy',
      'monitoring','alerting','observability','logging','metrics','health check',
      'circuit breaker','retry','timeout','degradation','graceful','resilient','robust',
      'stable','consistent','durable','persistent','recoverable','repairable','maintainable',
      'serviceable','replaceable','upgradable','extensible','flexible','adaptable','portable',
      'interoperable','compatible','standard','compliant','certified','validated','verified',
      'audited','reviewed','tested','proven','guaranteed','assured','secured','protected',
      'encrypted','authenticated','authorized','sanitized','hardened'
    ];
    const hasReliability = reliabilityWords.some(w => answerLower.includes(w));

    if (hasComponents) {
      score += 0.5;
      indicators.push('Identified system components');
    }
    if (hasScalability) {
      score += 0.5;
      indicators.push('Addressed scalability concerns');
    }
    if (hasTradeoffs) {
      score += 0.5;
      indicators.push('Discussed trade-offs and alternatives');
    }
    if (hasReliability) {
      score += 0.25;
      indicators.push('Considered reliability and fault tolerance');
    }

    if (!hasScalability) {
      indicators.push('Address scalability and fault tolerance in your design');
    }
    if (!hasTradeoffs) {
      indicators.push('Discuss trade-offs between different approaches');
    }
  }

  return {
    score: Math.min(10, Math.max(1, score)),
    indicators
  };
}

// ============================================
// DEPTH ANALYSIS
// ============================================

function analyzeDepth(answer: string, difficulty: Difficulty): number {
  const wordCount = answer.trim().split(/\s+/).filter(w => w.length > 0).length;
  const sentences = answer.split(/[.!?]+/).filter(s => s.trim().length > 10);
  const sentenceCount = sentences.length;
  const avgWordsPerSentence = wordCount / Math.max(sentenceCount, 1);
  const paragraphCount = answer.split(/\n\s*\n/).filter(p => p.trim().length > 0).length;

  let depthScore = 5;

  // Word count contribution
  if (wordCount >= 250) depthScore += 2;
  else if (wordCount >= 150) depthScore += 1.5;
  else if (wordCount >= 100) depthScore += 1;
  else if (wordCount >= 60) depthScore += 0.5;
  else if (wordCount >= 30) depthScore += 0.25;
  else if (wordCount < 15) depthScore -= 1;

  // Sentence complexity
  if (avgWordsPerSentence >= 18) depthScore += 1;
  else if (avgWordsPerSentence >= 12) depthScore += 0.5;
  else if (avgWordsPerSentence >= 8) depthScore += 0.25;

  // Paragraph structure
  if (paragraphCount >= 4) depthScore += 1;
  else if (paragraphCount >= 2) depthScore += 0.5;

  // Difficulty adjustments
  if (difficulty === 'senior') {
    if (wordCount < 80) depthScore -= 0.5;
    if (wordCount < 40) depthScore -= 1;
  } else if (difficulty === 'mid') {
    if (wordCount < 40) depthScore -= 0.5;
  }

  return Math.min(10, Math.max(1, depthScore));
}

// ============================================
// FEEDBACK GENERATION
// ============================================

function generateStrengths(
  coveredConcepts: string[],
  qualityIndicators: string[],
  category: Category,
  relevanceScore: number
): string[] {
  const strengths: string[] = [];

  if (relevanceScore >= 8) {
    strengths.push('Excellent understanding of the core concepts');
  } else if (relevanceScore >= 6) {
    strengths.push('Good grasp of relevant topics');
  } else if (relevanceScore >= 4) {
    strengths.push('Addressed some key aspects of the question');
  }

  if (coveredConcepts.length >= 5) {
    strengths.push(`Comprehensive coverage of concepts: ${coveredConcepts.slice(0, 3).join(', ')}`);
  } else if (coveredConcepts.length >= 2) {
    strengths.push(`Mentioned relevant concepts: ${coveredConcepts.slice(0, 3).join(', ')}`);
  }

  const positiveIndicators = qualityIndicators.filter(i =>
    !i.includes('could be') &&
    !i.includes('Consider') &&
    !i.includes('consider') &&
    !i.includes('Add') &&
    !i.includes('Include') &&
    !i.includes('Discuss')
  );
  strengths.push(...positiveIndicators.slice(0, 3));

  // Deduplicate
  return [...new Set(strengths)].slice(0, 5);
}

function generateImprovements(
  missedConcepts: string[],
  qualityIndicators: string[],
  category: Category,
  depthScore: number,
  relevanceScore: number
): string[] {
  const improvements: string[] = [];

  if (relevanceScore < 4) {
    improvements.push('Focus more directly on the question topic');
  } else if (relevanceScore < 6) {
    improvements.push('Could expand on key aspects of the question');
  }

  if (depthScore < 4) {
    improvements.push('Provide more detailed explanation with specific examples');
  } else if (depthScore < 6) {
    improvements.push('Consider adding more depth to your explanation');
  }

  if (missedConcepts.length > 0) {
    improvements.push(`Consider discussing: ${missedConcepts.slice(0, 3).join(', ')}`);
  }

  const negativeIndicators = qualityIndicators.filter(i =>
    i.includes('could be') ||
    i.includes('Consider') ||
    i.includes('consider') ||
    i.includes('Add') ||
    i.includes('Include') ||
    i.includes('Discuss')
  );
  improvements.push(...negativeIndicators.slice(0, 3));

  return [...new Set(improvements)].slice(0, 5);
}

function generateSampleAnswerHint(
  question: string,
  category: Category,
  role: Role,
  coveredConcepts: string[]
): string {
  const roleKnowledge = roleKnowledgeBase[role];

  if (category === 'behavioral') {
    return `A strong answer would use the STAR method:
- Situation: Describe a specific context or challenge
- Task: Explain what you needed to accomplish
- Action: Detail the steps you took
- Result: Share the outcome with quantifiable metrics

For your role as ${roleKnowledge.title}, focus on examples that demonstrate: ${roleKnowledge.keySkills.slice(0, 3).join(', ')}.`;
  } else if (category === 'technical') {
    return `A comprehensive technical answer should:
1. Define the core concept clearly
2. Explain how it works in practice
3. Provide a concrete code example or use case
4. Discuss trade-offs or best practices
5. Mention relevant tools: ${roleKnowledge.commonTools.slice(0, 3).join(', ')}`;
  } else {
    return `A good system design answer includes:
1. Requirements clarification
2. High-level architecture overview
3. Component breakdown and data flow
4. Scalability and reliability considerations
5. Trade-offs and alternatives
6. Potential bottlenecks and solutions

Key technologies for ${roleKnowledge.title}: ${roleKnowledge.commonTools.slice(0, 5).join(', ')}`;
  }
}

function generateFollowUpSuggestion(
  answer: string,
  category: Category,
  coveredConcepts: string[]
): string {
  const wordCount = answer.trim().split(/\s+/).filter(w => w.length > 0).length;
  const answerLower = answer.toLowerCase();

  if (wordCount < 40) {
    return `${followUpTriggers.tooBrief} the details of your approach and the reasoning behind it?`;
  }

  const exampleWords = [
    'for example','e.g.','such as','like','instance','specifically','in particular',
    'namely','concretely','practically','in practice','real world','real-world','actual','concrete','specific'
  ];
  if (!exampleWords.some(w => answerLower.includes(w))) {
    return `${followUpTriggers.missingExample} a specific situation where you applied this?`;
  }

  const resultWords = [
    'result','outcome','impact','achieved','improved','delivered','success',
    'completed','finished','accomplished','obtained','gained','reached','met',
    'exceeded','final','eventually','in the end','at last','ultimately',
    'consequently','as a result','because of this','thanks to','due to',
    'leading to','resulting in','which meant','this meant','that meant',
    'it meant','we were able','i was able','the team was able','this allowed',
    'this enabled','this helped','this led to'
  ];
  if (!resultWords.some(w => answerLower.includes(w))) {
    return `${followUpTriggers.needsOutcome} your approach and its impact?`;
  }

  const challengeWords = [
    'challenge','difficult','problem','issue','blocker','obstacle','struggle','hurdle',
    'barrier','setback','complication','complexity','nuance','subtlety','edge case',
    'corner case','limitation','constraint','restriction','bottleneck','impediment',
    'drawback','downside','weakness','vulnerability','risk','concern','worry','anxiety',
    'stress','pressure','tension','conflict','disagreement','dispute','argument','debate',
    'controversy','discrepancy','inconsistency','mismatch','gap','shortcoming','deficiency',
    'flaw','defect','bug','error','mistake','fault','failure','breakdown','crash',
    'outage','downtime','incident','emergency','urgency','crisis','critical','severe',
    'serious','major','significant','substantial','considerable','notable','remarkable',
    'dramatic','drastic','radical','extreme','intense','heavy','hard','tough','rough',
    'difficult','demanding','challenging','taxing','exhausting','draining','overwhelming',
    'daunting','intimidating','formidable','ambitious','aggressive','assertive','forceful',
    'insistent','persistent','determined','resolute','steadfast','unwavering','unyielding',
    'uncompromising','inflexible','rigid','strict','stringent','tight','narrow','limited',
    'restricted','constrained','bounded','confined','stifled','suppressed','repressed',
    'inhibited','hindered','hampered','obstructed','blocked','barred','prevented',
    'precluded','prohibited','forbidden','banned','outlawed','illegal','unauthorized',
    'unlicensed','unqualified','inexperienced','untrained','unskilled','unprepared',
    'unready','unfit','unsuitable','inappropriate','improper','wrong','incorrect',
    'erroneous','faulty','defective','broken','damaged','impaired','compromised',
    'corrupted','contaminated','polluted','infected','infested','invaded','occupied',
    'seized','captured','trapped','stuck','locked','frozen','paralyzed','immobilized',
    'disabled','incapacitated','powerless','helpless','defenseless','vulnerable',
    'exposed','at risk','in danger','in jeopardy','in peril','in trouble','in difficulty',
    'in distress','in a bind','in a pickle','in a jam','in a hole','in a rut','in a fix',
    'in a spot','in a tight spot','in hot water','in deep water','over your head',
    'out of your depth','out of your league','out of your element','out of your comfort zone',
    'out of control','out of hand','out of order','out of service','out of commission',
    'out of operation','out of action','out of use','out of date','out of fashion',
    'out of style','out of touch','out of reach','out of range','out of bounds',
    'out of limits','out of scope','out of context','out of place','out of line',
    'out of character','out of sorts','out of shape','out of condition','out of breath',
    'out of patience','out of time','out of money','out of resources','out of supplies',
    'out of stock','out of inventory','out of storage','out of memory','out of disk space',
    'out of bandwidth','out of capacity','out of quota','out of allocation','out of budget',
    'over budget','over schedule','over deadline','over time','over hours','over limit',
    'over threshold','over capacity','overloaded','overburdened','overwhelmed',
    'overworked','overtaxed','overstretched','overextended','overcommitted','overbooked',
    'oversubscribed','overpopulated','overcrowded','congested','clogged','jammed',
    'packed','stuffed','crammed','filled','saturated','maxed out','at capacity',
    'at limit','at maximum','at full capacity','running at capacity','operating at capacity',
    'working at capacity','peaking','spiking','surging','skyrocketing','soaring',
    'escalating','mounting','accumulating','building up','piling up','stacking up',
    'racking up','adding up','mounting up','growing','increasing','rising','climbing',
    'creeping','edging','inching','nudging','pushing','pressing','straining','stressing',
    'taxing','testing','trying','demanding','exacting','rigorous','strenuous','arduous',
    'laborious','toilsome','grueling','backbreaking','punishing','crushing','oppressive',
    'burdensome','onerous','heavy','weighty','cumbersome','unwieldy','awkward','clumsy',
    'unmanageable','uncontrollable','ungovernable','unruly','rebellious','defiant',
    'resistant','oppositional','contrary','adverse','hostile','antagonistic','inimical',
    'unfriendly','uncooperative','unhelpful','unsupportive','unresponsive','unreceptive',
    'closed','shut','sealed','locked','barred','blocked','obstructed','impeded',
    'hindered','hampered','frustrated','thwarted','foiled','baffled','stumped','stymied',
    'balked','checked','stopped','halted','arrested','suspended','postponed','delayed',
    'deferred','put off','held up','held back','kept back','pushed back','set back',
    'set aside','laid aside','put aside','swept aside','brushed aside','shunted aside',
    'marginalized','sidelined','benched','shelved','table','pigeonholed',
    'compartmentalized','categorized','classified','labeled','tagged','branded',
    'stamped','marked','noted','flagged','highlighted','emphasized','stressed',
    'underscored','underlined','accentuated','accented','intensified','heightened',
    'deepened','sharpened','strengthened','fortified','reinforced','bolstered',
    'supported','backed','upheld','maintained','sustained','preserved','conserved',
    'protected','guarded','shielded','screened','sheltered','covered','hidden',
    'concealed','masked','cloaked','veiled','shrouded','clouded','obscured','blurred',
    'distorted','twisted','warped','perverted','corrupted','degraded','debased',
    'devalued','depreciated','diminished','reduced','lessened','lowered','decreased',
    'declined','dropped','fallen','slipped','sagged','slumped','plunged','plummeted',
    'nosedived','crashed','collapsed','crumbled','disintegrated','dissolved','evaporated',
    'vanished','disappeared','faded','withered','died','perished','expired','ceased',
    'stopped','ended','terminated','concluded','finished','completed','accomplished',
    'achieved','attained','reached','arrived','gotten','obtained','acquired','gained',
    'earned','won','secured','procured'
  ];
  if (!challengeWords.some(w => answerLower.includes(w))) {
    return `${followUpTriggers.needsChallenge} you faced and how you overcame them?`;
  }

  return `${followUpTriggers.needsDepth} the decision-making process and alternative approaches you considered?`;
}

// ============================================
// MAIN EVALUATION FUNCTION
// ============================================

export function evaluateAnswer(
  answer: string,
  context: QuestionContext
): EvaluationResult {
  // First check for irrelevant input
  const irrelevantCheck = detectIrrelevantInput(answer, context.question, context.category);

  if (irrelevantCheck.isIrrelevant) {
    return {
      isRelevant: false,
      relevanceScore: 0,
      qualityScore: 0,
      depthScore: 0,
      overallScore: 0,
      strengths: [],
      improvements: [irrelevantCheck.reason],
      coveredConcepts: [],
      missedConcepts: [],
      feedback: irrelevantCheck.reason,
      sampleAnswer: 'Please try again with a relevant and detailed answer to the question asked.'
    };
  }

  // Calculate relevance score
  const { score: relevanceScore, coveredConcepts, missedConcepts } = calculateRelevanceScore(
    answer,
    context.topics,
    context.category,
    context.question
  );

  // Analyze quality
  const { score: qualityScore, indicators: qualityIndicatorsList } = analyzeQuality(
    answer,
    context.category
  );

  // Analyze depth
  const depthScore = analyzeDepth(answer, context.difficulty);

  // Calculate overall score with balanced weighting
  const overallScore = (
    relevanceScore * 0.4 +
    qualityScore * 0.35 +
    depthScore * 0.25
  );

  // Generate feedback components
  const strengths = generateStrengths(
    coveredConcepts,
    qualityIndicatorsList,
    context.category,
    relevanceScore
  );

  const improvements = generateImprovements(
    missedConcepts,
    qualityIndicatorsList,
    context.category,
    depthScore,
    relevanceScore
  );

  const sampleAnswer = generateSampleAnswerHint(
    context.question,
    context.category,
    context.role,
    coveredConcepts
  );

  const followUpSuggestion = generateFollowUpSuggestion(
    answer,
    context.category,
    coveredConcepts
  );

  // Generate main feedback based on performance
  let feedback = '';

  if (overallScore >= 8.5) {
    feedback = `Excellent answer! You demonstrated deep understanding and provided comprehensive coverage. ${strengths[0] || 'Your response was exceptionally well-structured and thorough.'}`;
  } else if (overallScore >= 7) {
    feedback = `Strong answer with solid understanding. ${strengths[0] || 'You covered the main points effectively.'} ${improvements[0] || ''}`;
  } else if (overallScore >= 5.5) {
    feedback = `Good answer with clear understanding. ${strengths[0] || 'You addressed the key aspects.'} ${improvements[0] || 'Consider expanding with more specific details.'}`;
  } else if (overallScore >= 4) {
    feedback = `Your answer shows basic understanding but could be improved. ${improvements[0] || 'Try to provide more specific examples and details.'} ${strengths[0] || ''}`;
  } else if (overallScore >= 2) {
    feedback = `Your answer needs more development. ${improvements.slice(0, 2).join(' ')}`;
  } else {
    feedback = `Your answer is too brief or off-topic. Please address the question more directly with specific examples and explanations.`;
  }

  return {
    isRelevant: true,
    relevanceScore: Math.round(relevanceScore * 10) / 10,
    qualityScore: Math.round(qualityScore * 10) / 10,
    depthScore: Math.round(depthScore * 10) / 10,
    overallScore: Math.round(overallScore * 10) / 10,
    strengths,
    improvements,
    coveredConcepts,
    missedConcepts,
    feedback,
    sampleAnswer,
    followUpSuggestion
  };
}

export default evaluateAnswer;
