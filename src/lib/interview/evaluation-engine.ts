// Answer Evaluation Engine - Analyzes user answers and generates intelligent feedback
// Uses ONLY local logic - no paid APIs
// BULLETPROOF VERSION - comprehensive error handling throughout

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
// SAFE FALLBACK RESULT (returned on any crash)
// ============================================

function getSafeFallbackResult(reason: string): EvaluationResult {
  return {
    isRelevant: true,
    relevanceScore: 5,
    qualityScore: 5,
    depthScore: 5,
    overallScore: 5,
    strengths: ['Answer received and processed.'],
    improvements: [reason],
    coveredConcepts: [],
    missedConcepts: [],
    feedback: 'Your answer has been reviewed. Please see the detailed breakdown below.',
    sampleAnswer: 'Provide a structured response with specific examples relevant to the question.',
    followUpSuggestion: 'Would you like to try a follow-up question?'
  };
}

// ============================================
// TEXT NORMALIZATION UTILITIES
// ============================================

function normalizeText(text: string): string[] {
  try {
    if (!text || typeof text !== 'string') return [];
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 2);
  } catch {
    return [];
  }
}

function getWordFrequency(words: string[]): Map<string, number> {
  try {
    const frequency = new Map<string, number>();
    words.forEach(word => {
      frequency.set(word, (frequency.get(word) || 0) + 1);
    });
    return frequency;
  } catch {
    return new Map();
  }
}

// Comprehensive stop words list
const STOP_WORDS = new Set([
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
  'tell', 'describe', 'explain', 'give', 'share', 'walk', 'how', 'what',
  'where', 'why', 'who', 'which', 'would', 'should', 'could', 'please', 'kindly',
  'discuss', 'mention', 'talk', 'about', 'regarding', 'concerning', 'related',
  'pertaining', 'referring', 'respect', 'context', 'terms', 'regard', 'regards'
]);

// Extract meaningful keywords from a question
// FIXED: include words >= 3 chars (not > 3) to catch technical terms like "api", "css", "dom", "oop"
function extractQuestionKeywords(question: string): string[] {
  try {
    if (!question || typeof question !== 'string') return [];
    const words = normalizeText(question);
    return [...new Set(words.filter(w => !STOP_WORDS.has(w) && w.length >= 3))];
  } catch {
    return [];
  }
}

// ============================================
// IRRELEVANCE DETECTION
// ============================================

function isKeyboardMashing(text: string): boolean {
  try {
    const rows = ['qwertyuiop', 'asdfghjkl', 'zxcvbnm'];
    const cleanText = text.toLowerCase().replace(/\s+/g, '');
    if (cleanText.length < 8) return false;

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
  } catch {
    return false;
  }
}

function isExcessiveRepetition(text: string): boolean {
  try {
    const words = normalizeText(text);
    if (words.length < 6) return false;
    const freq = getWordFrequency(words);
    let maxCount = 0;
    freq.forEach(c => { if (c > maxCount) maxCount = c; });
    return maxCount > 5 && (maxCount / words.length) > 0.5;
  } catch {
    return false;
  }
}

function hasEnoughMeaningfulContent(text: string): boolean {
  try {
    const words = text.toLowerCase().split(/\s+/).filter(w => w.length > 0);
    if (words.length === 0) return false;
    const contentWords = words.filter(w => w.replace(/[^a-z]/g, '').length > 3);
    if (contentWords.length >= 2) return true;
    const uniqueWords = new Set(words);
    if (uniqueWords.size >= 3) return true;
    if (words.length <= 2) return false;
    return true;
  } catch {
    return false;
  }
}

function hasNarrativeStructure(text: string): boolean {
  try {
    const lower = text.toLowerCase();
    const hasPersonal = /\b(i|my|me|we|our|myself)\b/.test(lower);

    const actionWords = new Set([
      'was','were','had','did','worked','led','managed','created','built','developed',
      'solved','resolved','handled','improved','achieved','delivered','faced','overcame',
      'organized','facilitated','implemented','designed','wrote','coded','tested','deployed',
      'maintained','debugged','optimized','refactored','collaborated','communicated','presented',
      'negotiated','persuaded','influenced','motivated','mentored','coached','guided','supported',
      'helped','assisted','contributed','participated','volunteered','initiated','started',
      'began','launched','introduced','established','figured','discovered','learned','realized',
      'understood','knew','thought','decided','chose','selected','picked','preferred','enjoyed'
    ]);
    let hasAction = false;
    const answerWords = lower.split(/\s+/);
    for (const word of answerWords) {
      const clean = word.replace(/[^a-z]/g, '');
      if (clean && actionWords.has(clean)) { hasAction = true; break; }
    }

    const timeWords = new Set([
      'when','during','while','after','before','once','then','last','previous','ago',
      'recently','earlier','back','then','period','time','at','on','in','ago'
    ]);
    let hasTime = false;
    for (const word of answerWords) {
      const clean = word.replace(/[^a-z]/g, '');
      if (clean && timeWords.has(clean)) { hasTime = true; break; }
    }

    return hasPersonal && hasAction && hasTime;
  } catch {
    return false;
  }
}

function hasTechnicalStructure(text: string): boolean {
  try {
    const lower = text.toLowerCase();

    const explanationWords = new Set([
      'because','since','therefore','thus','however','additionally','furthermore',
      'consequently','hence','although','unless','while','whereas','if','then'
    ]);
    let hasExplanation = false;
    for (const word of lower.split(/\s+/)) {
      const clean = word.replace(/[^a-z]/g, '');
      if (clean && explanationWords.has(clean)) { hasExplanation = true; break; }
    }

    const techTerms = new Set([
      'code','function','class','component','module','library','framework','api','database',
      'server','client','algorithm','system','architecture','design','implementation',
      'interface','service','endpoint','request','response','cache','memory','cpu','gpu',
      'network','performance','optimization','scalability','security','encryption',
      'authentication','authorization','token','session','cookie','json','xml','html',
      'css','javascript','typescript','python','java','go','rust','sql','nosql','graphql',
      'rest','grpc','websocket','http','https','tcp','udp','docker','kubernetes',
      'container','microservice','serverless','lambda','aws','azure','gcp','cloud',
      'git','github','ci','cd','jenkins','terraform','prometheus','grafana'
    ]);
    let hasTechTerms = false;
    for (const word of lower.split(/\s+/)) {
      const clean = word.replace(/[^a-z]/g, '');
      if (clean && techTerms.has(clean)) { hasTechTerms = true; break; }
    }

    return hasExplanation || hasTechTerms;
  } catch {
    return false;
  }
}

function isCompletelyUnrelated(answer: string, question: string, category: Category): boolean {
  try {
    const answerLower = answer.toLowerCase();
    const questionKeywords = extractQuestionKeywords(question);

    // FIXED: If we couldn't extract keywords, don't flag as unrelated
    if (questionKeywords.length === 0) return false;

    const hasOverlap = questionKeywords.some(kw => answerLower.includes(kw));
    if (hasOverlap) return false;

    if (category === 'behavioral') {
      if (hasNarrativeStructure(answer)) return false;
    }
    if (category === 'technical') {
      if (hasTechnicalStructure(answer)) return false;
    }
    if (category === 'system') {
      if (/\b(system|architecture|design|scale|scalable|database|cache|api|service|component|microservice|server|client|load|traffic|user|request|response|data|storage|memory|cpu|bandwidth|latency|throughput|performance|reliability|availability|consistency|partition|shard|replica|backup|failover|redundancy|monitoring|logging|metrics|alerting|observability|deployment|infrastructure|cloud|aws|azure|gcp)\b/.test(answerLower)) {
        return false;
      }
    }

    const wordCount = answer.trim().split(/\s+/).filter(w => w.length > 0).length;
    if (wordCount < 8) return false;

    return true;
  } catch {
    return false; // Give benefit of the doubt on any error
  }
}

export function detectIrrelevantInput(answer: string, question: string, category?: Category): { isIrrelevant: boolean; reason: string } {
  try {
    const trimmedAnswer = (answer || '').trim();
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

    // 3. Non-answer phrases at start
    const nonAnswerPatterns = [
      /^(i don'?t know|i have no idea|no idea|not sure|i'?m not sure)/i,
      /^(skip|pass|next|i don'?t want to answer|i can'?t answer|i won'?t answer|no comment)/i,
      /^(yes\.?|no\.?|maybe\.?|ok\.?|sure\.?|fine\.?)$/i
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

    // 9. Semantic relevance
    if (category && isCompletelyUnrelated(trimmedAnswer, question, category)) {
      return {
        isIrrelevant: true,
        reason: 'Your answer does not match the question. Please answer accordingly.'
      };
    }

    return { isIrrelevant: false, reason: '' };
  } catch (e) {
    console.error('Error in detectIrrelevantInput:', e);
    return { isIrrelevant: false, reason: '' }; // Give benefit of the doubt
  }
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
  try {
    const answerLower = (answer || '').toLowerCase();
    const coveredConcepts: string[] = [];
    const missedConcepts: string[] = [];

    // DEFENSIVE: Ensure topics is a valid array
    const safeTopics = Array.isArray(topics) ? topics : [];
    const validTopics = safeTopics.filter(t => t && typeof t === 'object' && Array.isArray(t.keywords));

    let baseScore = 0;

    if (validTopics.length > 0) {
      let totalRelevance = 0;
      let totalWeight = 0;

      for (const topic of validTopics) {
        let keywordMatches = 0;
        const safeKeywords = Array.isArray(topic.keywords) ? topic.keywords : [];
        for (const keyword of safeKeywords) {
          if (typeof keyword === 'string' && answerLower.includes(keyword.toLowerCase())) {
            keywordMatches++;
            if (!coveredConcepts.includes(keyword)) coveredConcepts.push(keyword);
          }
        }

        let conceptMatches = 0;
        const safeConcepts = Array.isArray(topic.concepts) ? topic.concepts : [];
        for (const concept of safeConcepts) {
          if (typeof concept !== 'string') continue;
          const conceptWords = concept.toLowerCase().split(/\s+/);
          const conceptFound = conceptWords.some(w => answerLower.includes(w));
          if (conceptFound) {
            conceptMatches++;
            if (!coveredConcepts.includes(concept)) coveredConcepts.push(concept);
          } else {
            missedConcepts.push(concept);
          }
        }

        const keywordScore = keywordMatches / Math.max(safeKeywords.length, 1);
        const conceptScore = conceptMatches / Math.max(safeConcepts.length, 1);
        const topicScore = keywordScore * 0.4 + conceptScore * 0.6;

        totalRelevance += topicScore * safeKeywords.length;
        totalWeight += safeKeywords.length;
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
      if (hasNarrativeStructure(answer)) categoryBonus += 2;

      const situationWords = ['situation','context','when','during','while','at that time','in that role','working on','part of','involved in','assigned to','responsible for'];
      const hasSituation = situationWords.some(w => answerLower.includes(w));
      const taskWords = ['task','goal','objective','needed to','was asked','had to','required to','responsibility','my role','my job','i needed','i had to'];
      const hasTask = taskWords.some(w => answerLower.includes(w));
      const actionWords = ['action','i did','i took','i implemented','i created','i led','i worked','i developed','i built','i designed','i wrote','i coded','i managed','i organized','i facilitated','i resolved','i solved','i handled'];
      const hasAction = actionWords.some(w => answerLower.includes(w));
      const resultWords = ['result','outcome','impact','achieved','improved','delivered','success','completed','finished','accomplished','as a result','thanks to','due to','this allowed','this enabled'];
      const hasResult = resultWords.some(w => answerLower.includes(w));

      if (hasSituation && hasTask && hasAction && hasResult) categoryBonus += 3;
      else if (hasAction && hasResult) categoryBonus += 2;
      else if (hasAction) categoryBonus += 1;

      const quantPatterns = [/\d+%/, /\d+ percent/, /\d+ times/, /\d+ (hour|day|week|month|year)s?/, /\$[\d,]+/, /\d+ users/, /\d+ projects/];
      if (quantPatterns.some(p => p.test(answerLower))) categoryBonus += 1;
    } else if (category === 'technical') {
      if (hasTechnicalStructure(answer)) categoryBonus += 2;

      const codePatterns = ['function','class','const ','let ','var ','import ','export ','def ','return ','if(','for(','while(','=>'];
      if (codePatterns.some(p => answerLower.includes(p))) categoryBonus += 1.5;

      const complexityWords = ['complexity','efficient','optimize','trade-off','tradeoff','performance','memory','latency','throughput','bottleneck','scalable','concurrent','parallel','async'];
      if (complexityWords.some(w => answerLower.includes(w))) categoryBonus += 1;

      const exampleWords = ['for example','e.g.','such as','like','instance','specifically','in particular'];
      if (exampleWords.some(w => answerLower.includes(w))) categoryBonus += 0.5;
    } else if (category === 'system') {
      const systemWords = ['architecture','component','service','database','cache','queue','api','server','client','microservice','gateway','load balancer','cdn'];
      if (systemWords.some(w => answerLower.includes(w))) categoryBonus += 1.5;
      const scaleWords = ['scale','scalability','scalable','sharding','replication','partitioning','horizontal','vertical'];
      if (scaleWords.some(w => answerLower.includes(w))) categoryBonus += 1;
      const tradeWords = ['trade-off','tradeoff','pros','cons','advantage','disadvantage','versus','compare','alternative'];
      if (tradeWords.some(w => answerLower.includes(w))) categoryBonus += 1;
      const reliabilityWords = ['reliability','availability','fault','tolerance','backup','failover','redundancy','monitoring','alerting','observability','logging','metrics'];
      if (reliabilityWords.some(w => answerLower.includes(w))) categoryBonus += 1;
    }

    const score = Math.min(10, Math.max(2, baseScore + questionBonus + categoryBonus));

    return {
      score: Math.round(score * 10) / 10,
      coveredConcepts,
      missedConcepts: missedConcepts.slice(0, 5)
    };
  } catch (e) {
    console.error('Error in calculateRelevanceScore:', e);
    return { score: 5, coveredConcepts: [], missedConcepts: [] };
  }
}

// ============================================
// QUALITY ANALYSIS
// ============================================

function analyzeQuality(answer: string, category: Category): { score: number; indicators: string[] } {
  try {
    const indicators: string[] = [];
    let score = 5;

    const answerLower = (answer || '').toLowerCase();
    const wordCount = answer.trim().split(/\s+/).filter(w => w.length > 0).length;
    const paragraphCount = answer.split(/\n\s*\n/).filter(p => p.trim().length > 0).length;

    // Length analysis
    if (wordCount >= 200) { score += 1.5; indicators.push('Comprehensive, detailed answer'); }
    else if (wordCount >= 100) { score += 1; indicators.push('Thorough answer with good detail'); }
    else if (wordCount >= 50) { score += 0.5; indicators.push('Adequate answer length'); }
    else if (wordCount >= 30) { score += 0.25; indicators.push('Moderate answer length'); }
    else if (wordCount < 10) { score -= 1; indicators.push('Answer is quite brief — consider expanding'); }

    // Paragraph structure
    if (paragraphCount >= 3) { score += 0.5; indicators.push('Well-structured with multiple paragraphs'); }
    else if (paragraphCount >= 2) { score += 0.25; indicators.push('Good paragraph structure'); }

    // Analytical language
    const analyticalSet = new Set(['because','therefore','however','additionally','furthermore','specifically','consequently','result','thus','hence','since','due to','in order to']);
    let analyticalMatches = 0;
    for (const word of answerLower.split(/\s+/)) {
      const clean = word.replace(/[^a-z]/g, '');
      if (clean && analyticalSet.has(clean)) analyticalMatches++;
    }
    if (analyticalMatches >= 4) { score += 1.5; indicators.push('Strong analytical reasoning with clear logic'); }
    else if (analyticalMatches >= 2) { score += 0.75; indicators.push('Good analytical structure'); }
    else if (analyticalMatches >= 1) { score += 0.25; indicators.push('Some analytical reasoning present'); }

    // Category-specific analysis
    if (category === 'behavioral') {
      const hasSituation = ['situation','context','when','during','while','at that time','in that role','working on','part of','involved in'].some(w => answerLower.includes(w));
      const hasTask = ['task','goal','objective','needed to','was asked','had to','required to','responsibility','my role','my job'].some(w => answerLower.includes(w));
      const hasAction = ['action','i did','i took','i implemented','i created','i led','i worked','i developed','i built','i designed','i wrote','i coded','i managed','i organized','i resolved','i solved'].some(w => answerLower.includes(w));
      const hasResult = ['result','outcome','impact','achieved','improved','delivered','success','completed','finished','accomplished','as a result','thanks to','due to','this allowed'].some(w => answerLower.includes(w));

      if (hasSituation && hasTask && hasAction && hasResult) { score += 1.5; indicators.push('Excellent STAR method structure'); }
      else if (hasAction && hasResult) { score += 0.75; indicators.push('Good story with action and outcome'); }
      else if (hasAction) { score += 0.25; indicators.push('Clear action steps described'); }
      else { indicators.push('Consider using STAR method (Situation, Task, Action, Result)'); }

      if (/\d+%|\d+ percent|\d+ times|\d+ (hour|day|week|month|year)s?|\$[\d,]+|\d+ users|\d+ projects/.test(answerLower)) {
        score += 0.5; indicators.push('Good use of quantifiable metrics');
      } else {
        indicators.push('Add quantifiable metrics to demonstrate impact');
      }
    } else if (category === 'technical') {
      const hasCodeExample = ['function','class','const ','let ','var ','import ','export ','def ','return ','if(','for(','while(','=>'].some(p => answerLower.includes(p));
      const hasComplexity = ['complexity','efficient','optimize','trade-off','tradeoff','performance','memory','latency','throughput','bottleneck','scalable'].some(w => answerLower.includes(w));
      const hasExample = ['for example','e.g.','such as','like','instance','specifically','in particular'].some(w => answerLower.includes(w));
      const hasEdgeCases = ['edge case','corner case','boundary','handle','exception','error','failure','null','undefined','empty','invalid','validate','verify','check','test'].some(w => answerLower.includes(w));

      if (hasCodeExample) { score += 0.5; indicators.push('Provided code or pseudo-code example'); }
      if (hasComplexity) { score += 0.5; indicators.push('Discussed complexity or performance'); }
      if (hasExample) { score += 0.5; indicators.push('Provided concrete examples'); }
      if (hasEdgeCases) { score += 0.25; indicators.push('Considered edge cases and error handling'); }

      if (!hasCodeExample && !hasExample) indicators.push('Include code examples or specific implementation details when applicable');
      if (!hasComplexity) indicators.push('Discuss time/space complexity or performance characteristics');
    } else if (category === 'system') {
      const hasComponents = ['component','service','database','cache','queue','api','server','client','microservice','gateway','load balancer','cdn'].some(w => answerLower.includes(w));
      const hasScalability = ['scale','scalability','scalable','sharding','replication','partitioning','horizontal','vertical'].some(w => answerLower.includes(w));
      const hasTradeoffs = ['trade-off','tradeoff','pros','cons','advantage','disadvantage','versus','compare','alternative'].some(w => answerLower.includes(w));
      const hasReliability = ['reliability','availability','fault','tolerance','backup','failover','redundancy','monitoring','alerting','observability','logging','metrics'].some(w => answerLower.includes(w));

      if (hasComponents) { score += 0.5; indicators.push('Identified system components'); }
      if (hasScalability) { score += 0.5; indicators.push('Addressed scalability concerns'); }
      if (hasTradeoffs) { score += 0.5; indicators.push('Discussed trade-offs and alternatives'); }
      if (hasReliability) { score += 0.25; indicators.push('Considered reliability and fault tolerance'); }

      if (!hasScalability) indicators.push('Address scalability and fault tolerance in your design');
      if (!hasTradeoffs) indicators.push('Discuss trade-offs between different approaches');
    }

    return { score: Math.min(10, Math.max(1, score)), indicators };
  } catch (e) {
    console.error('Error in analyzeQuality:', e);
    return { score: 5, indicators: ['Answer processed successfully'] };
  }
}

// ============================================
// DEPTH ANALYSIS
// ============================================

function analyzeDepth(answer: string, difficulty: Difficulty): number {
  try {
    const wordCount = (answer || '').trim().split(/\s+/).filter(w => w.length > 0).length;
    const sentences = answer.split(/[.!?]+/).filter(s => s.trim().length > 10);
    const sentenceCount = sentences.length;
    const avgWordsPerSentence = wordCount / Math.max(sentenceCount, 1);
    const paragraphCount = answer.split(/\n\s*\n/).filter(p => p.trim().length > 0).length;

    let depthScore = 5;

    if (wordCount >= 250) depthScore += 2;
    else if (wordCount >= 150) depthScore += 1.5;
    else if (wordCount >= 100) depthScore += 1;
    else if (wordCount >= 60) depthScore += 0.5;
    else if (wordCount >= 30) depthScore += 0.25;
    else if (wordCount < 15) depthScore -= 1;

    if (avgWordsPerSentence >= 18) depthScore += 1;
    else if (avgWordsPerSentence >= 12) depthScore += 0.5;
    else if (avgWordsPerSentence >= 8) depthScore += 0.25;

    if (paragraphCount >= 4) depthScore += 1;
    else if (paragraphCount >= 2) depthScore += 0.5;

    if (difficulty === 'senior') {
      if (wordCount < 80) depthScore -= 0.5;
      if (wordCount < 40) depthScore -= 1;
    } else if (difficulty === 'mid') {
      if (wordCount < 40) depthScore -= 0.5;
    }

    return Math.min(10, Math.max(1, depthScore));
  } catch (e) {
    console.error('Error in analyzeDepth:', e);
    return 5;
  }
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
  try {
    const strengths: string[] = [];

    if (relevanceScore >= 8) strengths.push('Excellent understanding of the core concepts');
    else if (relevanceScore >= 6) strengths.push('Good grasp of relevant topics');
    else if (relevanceScore >= 4) strengths.push('Addressed some key aspects of the question');

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

    return [...new Set(strengths)].slice(0, 5);
  } catch {
    return ['Answer was well-structured'];
  }
}

function generateImprovements(
  missedConcepts: string[],
  qualityIndicators: string[],
  category: Category,
  depthScore: number,
  relevanceScore: number
): string[] {
  try {
    const improvements: string[] = [];

    if (relevanceScore < 4) improvements.push('Focus more directly on the question topic');
    else if (relevanceScore < 6) improvements.push('Could expand on key aspects of the question');

    if (depthScore < 4) improvements.push('Provide more detailed explanation with specific examples');
    else if (depthScore < 6) improvements.push('Consider adding more depth to your explanation');

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
  } catch {
    return ['Consider adding more specific examples'];
  }
}

function generateSampleAnswerHint(
  question: string,
  category: Category,
  role: Role,
  coveredConcepts: string[]
): string {
  try {
    const roleKnowledge = roleKnowledgeBase[role];
    if (!roleKnowledge) return 'Provide a structured, relevant answer with specific examples.';

    if (category === 'behavioral') {
      return `A strong answer would use the STAR method:
- Situation: Describe a specific context or challenge
- Task: Explain what you needed to accomplish
- Action: Detail the steps you took
- Result: Share the outcome with quantifiable metrics

For your role as ${roleKnowledge.title}, focus on examples that demonstrate: ${roleKnowledge.keySkills?.slice(0, 3).join(', ') || 'relevant skills'}.`;
    } else if (category === 'technical') {
      return `A comprehensive technical answer should:
1. Define the core concept clearly
2. Explain how it works in practice
3. Provide a concrete code example or use case
4. Discuss trade-offs or best practices
5. Mention relevant tools: ${roleKnowledge.commonTools?.slice(0, 3).join(', ') || 'industry-standard tools'}`;
    } else {
      return `A good system design answer includes:
1. Requirements clarification
2. High-level architecture overview
3. Component breakdown and data flow
4. Scalability and reliability considerations
5. Trade-offs and alternatives
6. Potential bottlenecks and solutions

Key technologies for ${roleKnowledge.title}: ${roleKnowledge.commonTools?.slice(0, 5).join(', ') || 'relevant technologies'}`;
    }
  } catch {
    return 'Provide a structured, relevant answer with specific examples.';
  }
}

function generateFollowUpSuggestion(
  answer: string,
  category: Category,
  coveredConcepts: string[]
): string {
  try {
    const wordCount = (answer || '').trim().split(/\s+/).filter(w => w.length > 0).length;
    const answerLower = answer.toLowerCase();

    if (wordCount < 40) {
      return "You've given a brief answer. Could you elaborate more on the details of your approach and the reasoning behind it?";
    }

    const exampleWords = ['for example','e.g.','such as','like','instance','specifically','in particular','namely'];
    if (!exampleWords.some(w => answerLower.includes(w))) {
      return "That's a good start. Can you provide a specific example of a situation where you applied this?";
    }

    const resultWords = ['result','outcome','impact','achieved','improved','delivered','success','completed','finished','as a result','thanks to','due to','this allowed'];
    if (!resultWords.some(w => answerLower.includes(w))) {
      return "Great explanation. What was the outcome of your approach and its impact?";
    }

    const challengeWords = ['challenge','difficult','problem','issue','blocker','obstacle','struggle','hurdle'];
    if (!challengeWords.some(w => answerLower.includes(w))) {
      return "Thank you for sharing. What challenges did you face and how did you overcome them?";
    }

    return "Interesting point. Could you dive deeper into the decision-making process and alternative approaches you considered?";
  } catch {
    return 'Could you provide more detail or an example to support your answer?';
  }
}

// ============================================
// MAIN EVALUATION FUNCTION
// ============================================

export function evaluateAnswer(
  answer: string,
  context: QuestionContext
): EvaluationResult {
  try {
    // Validate context
    if (!context || typeof context !== 'object') {
      return getSafeFallbackResult('Invalid question context');
    }

    // First check for irrelevant input
    const irrelevantCheck = detectIrrelevantInput(answer, context.question || '', context.category);

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
        sampleAnswer: 'Please try again with a relevant and detailed answer to the question asked.',
        followUpSuggestion: undefined
      };
    }

    // Calculate relevance score
    const safeTopics = Array.isArray(context.topics) ? context.topics : [];
    const { score: relevanceScore, coveredConcepts, missedConcepts } = calculateRelevanceScore(
      answer,
      safeTopics,
      context.category || 'technical',
      context.question || ''
    );

    // Analyze quality
    const { score: qualityScore, indicators: qualityIndicatorsList } = analyzeQuality(
      answer,
      context.category || 'technical'
    );

    // Analyze depth
    const depthScore = analyzeDepth(answer, context.difficulty || 'mid');

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
      context.category || 'technical',
      relevanceScore
    );

    const improvements = generateImprovements(
      missedConcepts,
      qualityIndicatorsList,
      context.category || 'technical',
      depthScore,
      relevanceScore
    );

    const sampleAnswer = generateSampleAnswerHint(
      context.question || '',
      context.category || 'technical',
      context.role || 'software-developer',
      coveredConcepts
    );

    const followUpSuggestion = generateFollowUpSuggestion(
      answer,
      context.category || 'technical',
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
  } catch (e) {
    console.error('CRITICAL ERROR in evaluateAnswer:', e);
    return getSafeFallbackResult('An error occurred during evaluation, but your answer was received.');
  }
}

export default evaluateAnswer;
