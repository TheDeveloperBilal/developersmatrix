// Answer Evaluation Engine - Analyzes user answers and generates intelligent feedback

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

// Normalize text for analysis
function normalizeText(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 2);
}

// Calculate word frequency
function getWordFrequency(words: string[]): Map<string, number> {
  const frequency = new Map<string, number>();
  words.forEach(word => {
    frequency.set(word, (frequency.get(word) || 0) + 1);
  });
  return frequency;
}

// Check if text contains meaningful English words
function containsMeaningfulWords(text: string): boolean {
  const commonWords = [
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
    'project', 'team', 'worked', 'developed', 'used', 'created', 'implemented',
    'application', 'system', 'data', 'code', 'user', 'feature', 'problem', 'solution'
  ];
  
  const words = text.toLowerCase().split(/\s+/).filter(w => w.length > 0);
  const matches = words.filter(w => commonWords.includes(w)).length;
  
  // If more than 20% of words are common English words, it's likely meaningful
  return matches / Math.max(words.length, 1) > 0.2;
}

// Check for actual keyboard mashing (consecutive same row keys with no spaces)
function isKeyboardMashing(text: string): boolean {
  // Check for long sequences of same-row keyboard letters without spaces
  const rows = [
    'qwertyuiop',
    'asdfghjkl',
    'zxcvbnm'
  ];
  
  const cleanText = text.toLowerCase().replace(/\s+/g, '');
  
  for (const row of rows) {
    let consecutiveCount = 0;
    for (const char of cleanText) {
      if (row.includes(char)) {
        consecutiveCount++;
        if (consecutiveCount >= 8) {
          // Check if it's just random mashing by looking at character variety
          const segment = cleanText.slice(cleanText.indexOf(char) - consecutiveCount + 1, cleanText.indexOf(char) + 1);
          const uniqueChars = new Set(segment.split('')).size;
          if (uniqueChars < 4 && segment.length >= 8) {
            return true;
          }
        }
      } else {
        consecutiveCount = 0;
      }
    }
  }
  return false;
}

// Check if answer is irrelevant
export function detectIrrelevantInput(answer: string, question: string): { isIrrelevant: boolean; reason: string } {
  const trimmedAnswer = answer.trim();
  const words = normalizeText(trimmedAnswer);
  const wordCount = trimmedAnswer.split(/\s+/).filter(w => w.length > 0).length;
  
  // 1. Check for empty or extremely short answers (less than 3 words)
  if (wordCount < 3) {
    return { 
      isIrrelevant: true, 
      reason: 'Your answer is too short. Please provide a more detailed response with specific examples.' 
    };
  }
  
  // 2. Check for common non-answer phrases at the START of response only
  const nonAnswerStarts = [
    /^(i don'?t know|i'?m not sure|no idea|skip|pass)$/i,
    /^(yes|no|maybe|ok|sure|fine)$/i
  ];
  
  for (const pattern of nonAnswerStarts) {
    if (pattern.test(trimmedAnswer)) {
      return { 
        isIrrelevant: true, 
        reason: 'Please provide a more detailed response that addresses the question.' 
      };
    }
  }
  
  // 3. Check for actual keyboard mashing (gibberish)
  if (isKeyboardMashing(trimmedAnswer)) {
    return { 
      isIrrelevant: true, 
      reason: 'Your answer appears to contain random text. Please provide a meaningful response to the question.' 
    };
  }
  
  // 4. Check for lorem ipsum or placeholder text
  if (/lorem ipsum|gibberish|blah blah/i.test(trimmedAnswer)) {
    return { 
      isIrrelevant: true, 
      reason: 'Please provide an actual answer rather than placeholder text.' 
    };
  }
  
  // 5. Check for repeated single characters (e.g., "aaaaaaa", "!!!!!")
  if (/^([a-z])\1{4,}$/i.test(trimmedAnswer.replace(/\s+/g, ''))) {
    return { 
      isIrrelevant: true, 
      reason: 'Your answer appears to contain random characters. Please provide a meaningful response.' 
    };
  }
  
  // 6. Check for meaningful English words
  if (wordCount >= 5 && !containsMeaningfulWords(trimmedAnswer)) {
    return { 
      isIrrelevant: true, 
      reason: 'Your answer does not appear to contain meaningful content. Please provide a relevant response.' 
    };
  }
  
  // 7. For very short answers (3-5 words), check if they contain relevant keywords
  if (wordCount >= 3 && wordCount <= 5) {
    const questionWords = normalizeText(question);
    const answerWords = normalizeText(trimmedAnswer);
    const hasOverlap = answerWords.some(w => questionWords.includes(w));
    
    if (!hasOverlap) {
      // Give benefit of doubt for short answers if they have meaningful words
      if (!containsMeaningfulWords(trimmedAnswer)) {
        return {
          isIrrelevant: true,
          reason: 'Your answer is very brief and doesn\'t appear to relate to the question. Please elaborate.'
        };
      }
    }
  }
  
  // 8. Check for excessive repetition (same word repeated many times)
  const wordFreq = getWordFrequency(words);
  let maxRepetition = 0;
  wordFreq.forEach((count) => {
    if (count > maxRepetition) maxRepetition = count;
  });
  
  // Only flag if a single word takes up more than 50% of the answer AND answer is long
  if (maxRepetition > 5 && words.length > 0 && (maxRepetition / words.length) > 0.5) {
    return {
      isIrrelevant: true,
      reason: 'Your answer appears to be repetitive. Please provide more diverse content.'
    };
  }
  
  // All checks passed - answer appears to be relevant
  return { isIrrelevant: false, reason: '' };
}

// Calculate relevance score based on topic coverage
function calculateRelevanceScore(
  answer: string,
  topics: Topic[],
  category: Category
): { score: number; coveredConcepts: string[]; missedConcepts: string[] } {
  const answerLower = answer.toLowerCase();
  const words = normalizeText(answer);
  const wordFreq = getWordFrequency(words);
  
  const coveredConcepts: string[] = [];
  const missedConcepts: string[] = [];
  let totalRelevance = 0;
  let totalWeight = 0;
  
  for (const topic of topics) {
    // Check keyword matches
    let keywordMatches = 0;
    for (const keyword of topic.keywords) {
      if (answerLower.includes(keyword.toLowerCase())) {
        keywordMatches++;
        if (!coveredConcepts.includes(keyword)) {
          coveredConcepts.push(keyword);
        }
      }
    }
    
    // Check concept matches
    let conceptMatches = 0;
    for (const concept of topic.concepts) {
      const conceptWords = concept.toLowerCase().split(' ');
      const conceptFound = conceptWords.some(w => answerLower.includes(w));
      if (conceptFound) {
        conceptMatches++;
        if (!coveredConcepts.includes(concept)) {
          coveredConcepts.push(concept);
        }
      } else {
        missedConcepts.push(concept);
      }
    }
    
    // Calculate topic coverage
    const keywordScore = keywordMatches / Math.max(topic.keywords.length, 1);
    const conceptScore = conceptMatches / Math.max(topic.concepts.length, 1);
    const topicScore = (keywordScore * 0.4 + conceptScore * 0.6);
    
    totalRelevance += topicScore * topic.keywords.length;
    totalWeight += topic.keywords.length;
  }
  
  const score = totalWeight > 0 ? (totalRelevance / totalWeight) * 10 : 0;
  
  return {
    score: Math.min(10, Math.max(0, score)),
    coveredConcepts,
    missedConcepts: missedConcepts.slice(0, 5) // Limit to top 5 missed concepts
  };
}

// Analyze answer quality based on structure and depth
function analyzeQuality(answer: string, category: Category): { score: number; indicators: string[] } {
  const indicators: string[] = [];
  let score = 5; // Base score
  
  // Length analysis
  const wordCount = answer.split(/\s+/).length;
  if (wordCount >= 100) {
    score += 1.5;
    indicators.push('Comprehensive answer length');
  } else if (wordCount >= 50) {
    score += 0.75;
    indicators.push('Adequate answer length');
  } else if (wordCount >= 20) {
    score += 0.25;
    indicators.push('Moderate answer length');
  } else if (wordCount < 20) {
    score -= 0.5;
    indicators.push('Answer could be more detailed');
  }
  
  // Check for quality keywords
  const answerLower = answer.toLowerCase();
  
  // High quality indicators
  const highQualityMatches = qualityIndicators.high.keywords.filter(k => 
    answerLower.includes(k.toLowerCase())
  );
  if (highQualityMatches.length >= 3) {
    score += 1.5;
    indicators.push('Strong analytical reasoning');
  } else if (highQualityMatches.length >= 1) {
    score += 0.5;
    indicators.push('Good analytical structure');
  }
  
  // Category-specific analysis
  if (category === 'behavioral') {
    // Check for STAR method
    const hasSituation = /situation|when|time|scenario|context|project|task|challenge/i.test(answer);
    const hasTask = /task|goal|objective|responsibility|needed to|was assigned|my role/i.test(answer);
    const hasAction = /action|i did|i implemented|i created|i led|i worked|i developed|i built/i.test(answer);
    const hasResult = /result|outcome|impact|achieved|improved|delivered|success|completed|finished/i.test(answer);
    
    if (hasSituation && hasTask && hasAction && hasResult) {
      score += 1.5;
      indicators.push('Effective use of STAR method');
    } else if ((hasSituation && hasAction) || (hasAction && hasResult)) {
      score += 0.5;
      indicators.push('Partial story structure');
    } else {
      indicators.push('Consider using STAR method (Situation, Task, Action, Result)');
    }
    
    // Check for quantification
    if (/\d+%|\d+ percent|\d+ times|\d+ hours|\$[\d,]+|\d+ users|\d+ projects|\d+ months|\d+ years/i.test(answer)) {
      score += 0.5;
      indicators.push('Good use of quantification');
    }
  } else if (category === 'technical') {
    // Check for technical depth
    const hasCodeExample = /```|function|class|const|let|var|import|export|def |return /i.test(answer);
    const hasComplexity = /O\(|complexity|efficient|optimize|trade-off|tradeoff|time|space|big o/i.test(answer);
    const hasExample = /for example|instance|such as|e\.g\.|specifically/i.test(answer);
    const hasEdgeCases = /edge case|corner case|boundary|handle|exception|error/i.test(answer);
    
    if (hasCodeExample) {
      score += 0.5;
      indicators.push('Provided code example');
    }
    if (hasComplexity) {
      score += 0.5;
      indicators.push('Discussed complexity/efficiency');
    }
    if (hasExample) {
      score += 0.5;
      indicators.push('Provided specific examples');
    }
    if (hasEdgeCases) {
      score += 0.25;
      indicators.push('Considered edge cases');
    }
  } else if (category === 'system') {
    // Check for system design elements
    const hasComponents = /component|service|database|cache|queue|api|server|client|microservice/i.test(answer);
    const hasScalability = /scale|scalability|load|traffic|concurrent|distributed|replica|shard/i.test(answer);
    const hasTradeoffs = /trade-off|tradeoff|pro|con|advantage|disadvantage|versus|vs|alternative/i.test(answer);
    const hasReliability = /reliability|availability|fault|tolerance|backup|failover|redundancy/i.test(answer);
    
    if (hasComponents) {
      score += 0.5;
      indicators.push('Identified system components');
    }
    if (hasScalability) {
      score += 0.5;
      indicators.push('Addressed scalability');
    }
    if (hasTradeoffs) {
      score += 0.5;
      indicators.push('Discussed trade-offs');
    }
    if (hasReliability) {
      score += 0.25;
      indicators.push('Considered reliability');
    }
  }
  
  return {
    score: Math.min(10, Math.max(1, score)),
    indicators
  };
}

// Analyze answer depth
function analyzeDepth(answer: string, difficulty: Difficulty): number {
  const wordCount = answer.split(/\s+/).length;
  const sentenceCount = answer.split(/[.!?]+/).filter(s => s.trim()).length;
  const avgWordsPerSentence = wordCount / Math.max(sentenceCount, 1);
  
  let depthScore = 5;
  
  // Adjust based on difficulty expectations
  if (difficulty === 'senior') {
    if (wordCount >= 150) depthScore += 2;
    else if (wordCount >= 100) depthScore += 1;
    else if (wordCount >= 50) depthScore += 0.25;
    else depthScore -= 1;
    
    if (avgWordsPerSentence >= 15) depthScore += 1;
    else if (avgWordsPerSentence >= 10) depthScore += 0.25;
  } else if (difficulty === 'mid') {
    if (wordCount >= 100) depthScore += 1.5;
    else if (wordCount >= 60) depthScore += 0.75;
    else if (wordCount >= 30) depthScore += 0.25;
    else depthScore -= 0.5;
    
    if (avgWordsPerSentence >= 12) depthScore += 0.5;
    else if (avgWordsPerSentence >= 8) depthScore += 0.25;
  } else {
    if (wordCount >= 75) depthScore += 1.5;
    else if (wordCount >= 50) depthScore += 1;
    else if (wordCount >= 30) depthScore += 0.5;
    
    if (avgWordsPerSentence >= 10) depthScore += 0.5;
  }
  
  return Math.min(10, Math.max(1, depthScore));
}

// Generate strengths based on analysis
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
  
  if (coveredConcepts.length >= 3) {
    strengths.push(`Covered key concepts: ${coveredConcepts.slice(0, 3).join(', ')}`);
  } else if (coveredConcepts.length >= 1) {
    strengths.push(`Mentioned relevant concepts: ${coveredConcepts.slice(0, 2).join(', ')}`);
  }
  
  // Add quality indicators as strengths
  const positiveIndicators = qualityIndicators.filter(i => 
    !i.includes('could be') && !i.includes('Consider')
  );
  strengths.push(...positiveIndicators);
  
  // Category-specific strengths
  if (category === 'behavioral') {
    if (qualityIndicators.some(i => i.includes('STAR'))) {
      strengths.push('Well-structured response using STAR method');
    }
    if (qualityIndicators.some(i => i.includes('quantification'))) {
      strengths.push('Provided measurable outcomes');
    }
  }
  
  return strengths.slice(0, 4);
}

// Generate improvements based on analysis
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
    improvements.push(`Consider discussing: ${missedConcepts.slice(0, 2).join(', ')}`);
  }
  
  // Add improvement suggestions from quality analysis
  const negativeIndicators = qualityIndicators.filter(i => 
    i.includes('could be') || i.includes('Consider')
  );
  improvements.push(...negativeIndicators);
  
  // Category-specific improvements (only if not already covered)
  if (category === 'behavioral') {
    if (!qualityIndicators.some(i => i.includes('STAR'))) {
      improvements.push('Structure your answer using STAR method (Situation, Task, Action, Result)');
    }
    if (!qualityIndicators.some(i => i.includes('quantification'))) {
      improvements.push('Add quantifiable metrics to demonstrate impact');
    }
  } else if (category === 'technical') {
    const hasCode = qualityIndicators.some(i => i.includes('code example'));
    const hasComplexity = qualityIndicators.some(i => i.includes('complexity'));
    if (!hasCode) {
      improvements.push('Include code examples or pseudo-code when applicable');
    }
    if (!hasComplexity) {
      improvements.push('Discuss time/space complexity for algorithm questions');
    }
  } else if (category === 'system') {
    const hasScalability = qualityIndicators.some(i => i.includes('scalability'));
    const hasTradeoffs = qualityIndicators.some(i => i.includes('trade-offs'));
    if (!hasScalability) {
      improvements.push('Address scalability and fault tolerance');
    }
    if (!hasTradeoffs) {
      improvements.push('Discuss trade-offs between different approaches');
    }
  }
  
  return improvements.slice(0, 4);
}

// Generate sample answer hints
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
3. Provide a concrete example
4. Discuss trade-offs or best practices
5. Mention relevant tools: ${roleKnowledge.commonTools.slice(0, 3).join(', ')}`;
  } else {
    return `A good system design answer includes:
1. Requirements clarification
2. High-level architecture overview
3. Component breakdown
4. Scalability considerations
5. Trade-offs and alternatives
6. Potential bottlenecks and solutions

Key technologies for ${roleKnowledge.title}: ${roleKnowledge.commonTools.slice(0, 5).join(', ')}`;
  }
}

// Generate follow-up question suggestion
function generateFollowUpSuggestion(
  answer: string,
  category: Category,
  coveredConcepts: string[]
): string {
  const wordCount = answer.split(/\s+/).length;
  
  if (wordCount < 50) {
    return `${followUpTriggers.tooBrief} the technical aspects of your approach?`;
  }
  
  if (!/for example|instance|such as|specifically|one time|a project/i.test(answer)) {
    return `${followUpTriggers.missingExample} a situation where you applied this?`;
  }
  
  if (!/result|outcome|impact|achieved|improved|success|delivered/i.test(answer)) {
    return `${followUpTriggers.needsOutcome} your approach?`;
  }
  
  if (!/challenge|difficult|problem|issue|blocker|obstacle|struggle/i.test(answer)) {
    return `${followUpTriggers.needsChallenge} implementing this solution?`;
  }
  
  return `${followUpTriggers.needsDepth} the decision-making process?`;
}

// Main evaluation function
export function evaluateAnswer(
  answer: string,
  context: QuestionContext
): EvaluationResult {
  // First check for irrelevant input
  const irrelevantCheck = detectIrrelevantInput(answer, context.question);
  
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
    context.category
  );
  
  // Analyze quality
  const { score: qualityScore, indicators: qualityIndicators } = analyzeQuality(
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
    qualityIndicators,
    context.category,
    relevanceScore
  );
  
  const improvements = generateImprovements(
    missedConcepts,
    qualityIndicators,
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
  
  if (overallScore >= 8) {
    feedback = `Excellent answer! You demonstrated strong understanding and provided comprehensive coverage of the topic. ${strengths[0] || 'Your response was well-structured and relevant.'}`;
  } else if (overallScore >= 6) {
    feedback = `Good answer with solid understanding. ${strengths[0] || 'You covered the main points well.'} ${improvements[0] || 'Consider adding more specific examples.'}`;
  } else if (overallScore >= 4) {
    feedback = `Your answer shows basic understanding but could be improved. ${improvements[0] || 'Try to provide more specific examples and details.'} ${strengths[0] || ''}`;
  } else {
    feedback = `Your answer needs more development. Focus on addressing the core question more directly. ${improvements.slice(0, 2).join(' ')}`;
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
