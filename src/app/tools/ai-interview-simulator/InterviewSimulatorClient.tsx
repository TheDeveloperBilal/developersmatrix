'use client';

import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import {
  MessageSquare,
  RefreshCw,
  ThumbsUp,
  ThumbsDown,
  ChevronRight,
  Sparkles,
  Loader2,
  AlertCircle,
  Target,
  CheckCircle,
  XCircle,
  Lightbulb,
  Info,
  TrendingUp,
  Award,
  Brain,
  Zap
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface FeedbackResponse {
  score: number;
  relevanceScore: number;
  qualityScore: number;
  depthScore: number;
  isRelevant: boolean;
  strengths: string[];
  improvements: string[];
  coveredConcepts: string[];
  missedConcepts: string[];
  detailedFeedback: string;
  sampleAnswer: string;
  followUpSuggestion?: string;
  session?: {
    id: string;
    questionsAnswered: number;
    averageScore: number;
    currentDifficulty: string;
  };
  suggestedDifficulty?: string;
}

interface QuestionData {
  question: string;
  category: string;
  difficulty: string;
  role: string;
  expectedConcepts: string[];
  hints: string[];
}

type Category = 'behavioral' | 'technical' | 'system';
type Difficulty = 'entry' | 'mid' | 'senior';

const categoryDescriptions: Record<Category, string> = {
  behavioral: 'Questions about your past experiences, teamwork, and soft skills. Use the STAR method.',
  technical: 'Questions about programming concepts, architecture, and technical problem-solving.',
  system: 'System design questions focused on scalability, trade-offs, and real-world architecture.'
};

const difficultyLabels: Record<Difficulty, string> = {
  entry: 'Entry Level (0-2 years)',
  mid: 'Mid Level (2-5 years)',
  senior: 'Senior Level (5+ years)'
};

const roleOptions = [
  'Software Developer',
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Developer',
  'DevOps Engineer',
  'Data Scientist',
  'Data Analyst',
  'Product Manager',
  'Engineering Manager',
  'Mobile Developer',
  'QA Engineer',
  'System Architect'
];

export default function InterviewSimulatorClient() {
  const [category, setCategory] = useState<Category>('behavioral');
  const [difficulty, setDifficulty] = useState<Difficulty>('mid');
  const [role, setRole] = useState('Software Developer');
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [questionData, setQuestionData] = useState<QuestionData | null>(null);
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState<FeedbackResponse | null>(null);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [averageScore, setAverageScore] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isFollowUpMode, setIsFollowUpMode] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [showHints, setShowHints] = useState(false);
  const [adaptiveDifficulty, setAdaptiveDifficulty] = useState<Difficulty | null>(null);

  const [scoreHistory, setScoreHistory] = useState<number[]>([]);

  const generateQuestion = useCallback(async () => {
    setIsLoading(true);
    setError('');
    setFeedback(null);
    setIsFollowUpMode(false);
    setShowHints(false);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout

    try {
      const response = await fetch('/api/interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'question',
          category,
          difficulty: adaptiveDifficulty || difficulty,
          role,
          sessionId
        }),
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      // Handle non-JSON responses
      let data;
      const contentType = response.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        const text = await response.text().catch(() => '');
        console.error('Non-JSON question response:', response.status, text.substring(0, 500));
        throw new Error(`Server error ${response.status}. Please reload and try again.`);
      }

      try {
        data = await response.json();
      } catch (jsonError) {
        console.error('JSON parse error in question:', jsonError);
        throw new Error('Server response error. Please reload and try again.');
      }

      if (!response.ok) {
        throw new Error(data?.error || `Server error: ${response.status}`);
      }

      if (!data.success) {
        throw new Error(data?.error || 'Failed to generate question');
      }

      setCurrentQuestion(data.content);
      setQuestionData({
        question: data.content,
        category,
        difficulty: data.questionData?.difficulty || difficulty,
        role,
        expectedConcepts: data.questionData?.expectedConcepts || [],
        hints: data.hints || []
      });
      setAnswer('');

      if (data.session) {
        setSessionId(data.session.id);
        setQuestionsAnswered(data.session.questionsAnswered || 0);
        setAverageScore(data.session.averageScore || 0);
      }
    } catch (err: any) {
      clearTimeout(timeoutId);
      if (err.name === 'AbortError') {
        setError('Request timed out (15s). Please check your connection and try again.');
      } else if (err.message?.includes('Server error')) {
        setError('Server error. Please reload the page and try again.');
      } else {
        setError(err.message || 'Failed to generate question. Please try again.');
      }
      console.error('Question generation error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [category, difficulty, role, sessionId, adaptiveDifficulty]);

  const submitAnswer = async () => {
    if (!answer.trim() || !currentQuestion) return;

    setIsLoading(true);
    setError('');

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout

    try {
      const response = await fetch('/api/interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'feedback',
          question: currentQuestion,
          answer: answer.trim(),
          category,
          difficulty: adaptiveDifficulty || difficulty,
          role,
          sessionId
        }),
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      // Handle non-JSON responses (server crash or HTML error page)
      let data;
      const contentType = response.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        const text = await response.text().catch(() => '');
        console.error('Non-JSON response:', response.status, text.substring(0, 500));
        throw new Error(`Server error ${response.status}. Please reload and try again.`);
      }

      try {
        data = await response.json();
      } catch (jsonError) {
        console.error('JSON parse error:', jsonError);
        throw new Error('Server response error. Please reload and try again.');
      }

      if (!response.ok) {
        throw new Error(data?.error || `Server error: ${response.status}`);
      }

      if (!data.success) {
        throw new Error(data?.error || 'Failed to get feedback. Please try again.');
      }

      setFeedback(data);
      // Use server's count — don't double-count locally
      setQuestionsAnswered(data.session?.questionsAnswered || 0);

      if (data.session) {
        setAverageScore(data.session.averageScore || 0);
      }

      // Update score history
      if (typeof data.score === 'number') {
        setScoreHistory(prev => [...prev, data.score]);
      }

      // Check for adaptive difficulty change
      if (data.suggestedDifficulty && data.suggestedDifficulty !== difficulty) {
        setAdaptiveDifficulty(data.suggestedDifficulty as Difficulty);
      }
    } catch (err: any) {
      clearTimeout(timeoutId);
      if (err.name === 'AbortError') {
        setError('Request timed out (15s). Please check your connection and try again.');
      } else if (err.message?.includes('Failed to evaluate')) {
        setError('Server evaluation error. Please try again or reload the page.');
      } else if (err.message?.includes('unexpected error') || err.message?.includes('Server error')) {
        setError('Server error. Please reload the page and try again.');
      } else {
        setError(err.message || 'Failed to get feedback. Please try again.');
      }
      console.error('Submit answer error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const generateFollowUp = async () => {
    if (!answer.trim() || !currentQuestion) return;

    setIsLoading(true);
    setError('');

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    try {
      const response = await fetch('/api/interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'followup',
          question: currentQuestion,
          answer: answer.trim(),
          category,
          difficulty: adaptiveDifficulty || difficulty,
          role,
          sessionId
        }),
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      // Handle non-JSON responses
      let data;
      const contentType = response.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        const text = await response.text().catch(() => '');
        console.error('Non-JSON followup response:', response.status, text.substring(0, 500));
        throw new Error(`Server error ${response.status}. Please reload and try again.`);
      }

      try {
        data = await response.json();
      } catch (jsonError) {
        console.error('JSON parse error in followup:', jsonError);
        throw new Error('Server response error. Please reload and try again.');
      }

      if (!response.ok) {
        throw new Error(data?.error || `Server error: ${response.status}`);
      }

      if (!data.success) {
        throw new Error(data?.error || 'Failed to generate follow-up');
      }

      setCurrentQuestion(data.content);
      setQuestionData(data.questionData || null);
      setAnswer('');
      setFeedback(null);
      setIsFollowUpMode(true);
    } catch (err: any) {
      clearTimeout(timeoutId);
      if (err.name === 'AbortError') {
        setError('Request timed out (15s). Please check your connection and try again.');
      } else if (err.message?.includes('Server error')) {
        setError('Server error. Please reload the page and try again.');
      } else {
        setError(err.message || 'Failed to generate follow-up. Please try again.');
      }
      console.error('Follow-up error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const startNew = () => {
    setCurrentQuestion('');
    setAnswer('');
    setFeedback(null);
    setQuestionData(null);
    setIsFollowUpMode(false);
    setQuestionsAnswered(0);
    setError('');
    setSessionId(null);
    setScoreHistory([]);
    setAverageScore(0);
    setAdaptiveDifficulty(null);
    setShowHints(false);
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-500';
    if (score >= 6) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 8) return 'bg-green-500';
    if (score >= 6) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getPerformanceLabel = (score: number) => {
    if (score >= 9) return 'Excellent';
    if (score >= 7) return 'Good';
    if (score >= 5) return 'Fair';
    return 'Needs Work';
  };

  return (
    <TooltipProvider>
      <Card className="border-0 shadow-lg">
        <CardHeader className="border-b bg-gradient-to-r from-orange-500/10 to-amber-500/10">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Brain className="w-5 h-5 text-orange-500" />
              AI Interview Simulator
            </CardTitle>
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="flex items-center gap-1">
                <MessageSquare className="w-3 h-3" />
                {questionsAnswered} Questions
              </Badge>
              {averageScore > 0 && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <Award className="w-3 h-3" />
                  Avg: {averageScore.toFixed(1)}/10
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          {/* Settings */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            {/* Role Selection */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label className="text-sm font-medium">Target Role</Label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="w-3.5 h-3.5 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-[200px] text-xs">Questions will be tailored to your target role</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {roleOptions.map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>

            {/* Difficulty Selection */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label className="text-sm font-medium">
                  {adaptiveDifficulty && adaptiveDifficulty !== difficulty ? (
                    <span className="flex items-center gap-1">
                      <Zap className="w-3 h-3 text-amber-500" />
                      Adaptive Level
                    </span>
                  ) : (
                    'Experience Level'
                  )}
                </Label>
              </div>
              <select
                value={adaptiveDifficulty || difficulty}
                onChange={(e) => {
                  setDifficulty(e.target.value as Difficulty);
                  setAdaptiveDifficulty(null);
                }}
                className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {Object.entries(difficultyLabels).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>

            {/* Category Selection */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Question Type</Label>
              <div className="flex gap-1">
                {[
                  { id: 'behavioral', label: 'Behavioral' },
                  { id: 'technical', label: 'Technical' },
                  { id: 'system', label: 'System' }
                ].map(cat => (
                  <Button
                    key={cat.id}
                    variant={category === cat.id ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => {
                      setCategory(cat.id as Category);
                      if (currentQuestion) {
                        setCurrentQuestion('');
                        setFeedback(null);
                      }
                    }}
                    className={`${category === cat.id ? 'bg-orange-500 hover:bg-orange-600' : ''} text-xs flex-1`}
                  >
                    {cat.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg flex items-start gap-3 text-sm text-destructive">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p>{error}</p>
                {(error.includes('Server error') || error.includes('Failed to get feedback') || error.includes('Request timed out')) && (
                  <div className="mt-2 flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setError('');
                        if (currentQuestion && answer.trim()) {
                          submitAnswer();
                        } else {
                          generateQuestion();
                        }
                      }}
                      className="text-xs h-7"
                    >
                      <RefreshCw className="w-3 h-3 mr-1" />
                      Retry
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        window.location.reload();
                      }}
                      className="text-xs h-7"
                    >
                      Reload Page
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Score Progress (if history exists) */}
          {scoreHistory.length > 0 && (
            <div className="mb-4 p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-muted-foreground">Performance Trend</span>
                <TrendingUp className="w-4 h-4 text-muted-foreground" />
              </div>
              <div className="flex gap-1">
                {scoreHistory.slice(-5).map((score, i) => (
                  <div
                    key={i}
                    className={`h-8 flex-1 rounded ${getScoreBgColor(score)} flex items-end justify-center`}
                    style={{ opacity: 0.5 + (score / 20) }}
                  >
                    <span className="text-xs font-bold text-white mb-1">{score}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!currentQuestion ? (
            <div className="text-center py-8 sm:py-16">
              <div className="relative inline-block mb-4">
                <Brain className="w-16 h-16 sm:w-20 sm:h-20 mx-auto text-orange-500/20" />
                <Sparkles className="w-6 h-6 absolute top-0 right-0 text-amber-500" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-2">Ready to Practice?</h3>
              <p className="text-sm sm:text-base text-muted-foreground mb-6 px-4 max-w-md mx-auto">
                {categoryDescriptions[category]}
              </p>
              <Button
                onClick={generateQuestion}
                disabled={isLoading}
                className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 min-h-[44px] px-8"
                size="lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Start Practice
                  </>
                )}
              </Button>
            </div>
          ) : (
            <div className="space-y-4 sm:space-y-6">
              {/* Question */}
              <div className="p-4 sm:p-6 bg-gradient-to-r from-orange-500/5 to-amber-500/5 border border-orange-500/20 rounded-xl">
                <div className="flex items-center gap-2 mb-3 flex-wrap">
                  <Badge className="bg-orange-500">{category.charAt(0).toUpperCase() + category.slice(1)}</Badge>
                  {isFollowUpMode && <Badge variant="outline" className="text-purple-500 border-purple-500">Follow-up</Badge>}
                  <Badge variant="outline">{difficultyLabels[adaptiveDifficulty || difficulty]}</Badge>
                  <Badge variant="secondary">{role}</Badge>
                </div>
                <p className="text-base sm:text-lg font-medium leading-relaxed">{currentQuestion}</p>

                {/* Hints Toggle */}
                {questionData?.hints && questionData.hints.length > 0 && (
                  <div className="mt-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowHints(!showHints)}
                      className="text-muted-foreground"
                    >
                      <Lightbulb className="w-4 h-4 mr-1" />
                      {showHints ? 'Hide Hints' : 'Show Hints'}
                    </Button>
                    {showHints && (
                      <div className="mt-2 p-3 bg-muted/50 rounded-lg">
                        <ul className="text-sm text-muted-foreground space-y-1">
                          {questionData.hints.map((hint, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="text-orange-500">•</span>
                              {hint}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Answer Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Your Answer</label>
                <Textarea
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder={
                    category === 'behavioral'
                      ? "Use the STAR method: Describe the Situation, Task, Action you took, and the Result..."
                      : category === 'technical'
                        ? "Explain your approach step by step, considering edge cases and trade-offs..."
                        : "Start with requirements, then high-level design, dive into components..."
                  }
                  rows={6}
                  disabled={!!feedback || isLoading}
                  className="resize-none"
                />
                <div className="flex justify-between items-center text-xs text-muted-foreground">
                  <span>{answer.length} characters • {answer.split(/\s+/).filter(Boolean).length} words</span>
                  {answer.length > 0 && answer.length < 50 && (
                    <span className="text-amber-500">Consider writing more for a complete answer</span>
                  )}
                </div>
              </div>

              {/* Feedback */}
              {feedback && (
                <div className="space-y-4">
                  {/* Score Display */}
                  <div className={`p-4 rounded-xl border ${
                    feedback.score >= 7
                      ? 'bg-green-500/10 border-green-500/20'
                      : feedback.score >= 5
                        ? 'bg-yellow-500/10 border-yellow-500/20'
                        : 'bg-red-500/10 border-red-500/20'
                  }`}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        {feedback.isRelevant ? (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        ) : (
                          <AlertCircle className="w-5 h-5 text-amber-500" />
                        )}
                        <span className="font-medium">{getPerformanceLabel(feedback.score)}</span>
                      </div>
                      <div className={`text-2xl font-bold ${getScoreColor(feedback.score)}`}>
                        {feedback.score}/10
                      </div>
                    </div>

                    {/* Score Breakdown */}
                    <div className="grid grid-cols-3 gap-2 mb-3">
                      <div className="text-center p-2 bg-background/50 rounded">
                        <div className="text-xs text-muted-foreground">Relevance</div>
                        <div className="font-medium">{feedback.relevanceScore.toFixed(1)}</div>
                      </div>
                      <div className="text-center p-2 bg-background/50 rounded">
                        <div className="text-xs text-muted-foreground">Quality</div>
                        <div className="font-medium">{feedback.qualityScore.toFixed(1)}</div>
                      </div>
                      <div className="text-center p-2 bg-background/50 rounded">
                        <div className="text-xs text-muted-foreground">Depth</div>
                        <div className="font-medium">{feedback.depthScore.toFixed(1)}</div>
                      </div>
                    </div>

                    {/* Detailed Feedback */}
                    <p className="text-sm">{feedback.detailedFeedback}</p>
                  </div>

                  {/* Strengths */}
                  {feedback.strengths.length > 0 && (
                    <div className="p-4 bg-green-500/5 border border-green-500/20 rounded-lg">
                      <p className="text-sm font-medium text-green-600 dark:text-green-400 mb-2 flex items-center gap-1">
                        <CheckCircle className="w-4 h-4" /> Strengths
                      </p>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {feedback.strengths.map((s, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-green-500 mt-1">•</span>
                            {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Improvements */}
                  {feedback.improvements.length > 0 && (
                    <div className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-lg">
                      <p className="text-sm font-medium text-amber-600 dark:text-amber-400 mb-2 flex items-center gap-1">
                        <Target className="w-4 h-4" /> Areas to Improve
                      </p>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {feedback.improvements.map((imp, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-amber-500 mt-1">•</span>
                            {imp}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Covered Concepts */}
                  {feedback.coveredConcepts.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {feedback.coveredConcepts.map((concept, i) => (
                        <Badge key={i} variant="outline" className="text-green-500 border-green-500/50">
                          {concept}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {/* Sample Answer Hint */}
                  {feedback.sampleAnswer && (
                    <div className="p-4 bg-muted/30 rounded-lg">
                      <p className="text-sm font-medium mb-2 flex items-center gap-1">
                        <Lightbulb className="w-4 h-4 text-amber-500" /> Sample Approach
                      </p>
                      <p className="text-xs text-muted-foreground whitespace-pre-line">{feedback.sampleAnswer}</p>
                    </div>
                  )}

                  {/* Follow-up Suggestion */}
                  {feedback.followUpSuggestion && feedback.score >= 5 && (
                    <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg text-sm text-purple-600 dark:text-purple-400">
                      <Zap className="w-4 h-4 inline mr-1" />
                      {feedback.followUpSuggestion}
                    </div>
                  )}

                  {/* Adaptive Difficulty Notification */}
                  {feedback.suggestedDifficulty && (
                    <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg text-sm text-blue-600 dark:text-blue-400">
                      <TrendingUp className="w-4 h-4 inline mr-1" />
                      Difficulty adjusted to: {difficultyLabels[feedback.suggestedDifficulty as Difficulty]}
                    </div>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3">
                {!feedback ? (
                  <Button
                    onClick={submitAnswer}
                    disabled={!answer.trim() || isLoading}
                    className="flex-1 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 min-h-[44px]"
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <ChevronRight className="w-4 h-4 mr-2" />
                    )}
                    Submit Answer
                  </Button>
                ) : (
                  <>
                    <Button
                      onClick={generateFollowUp}
                      variant="outline"
                      className="flex-1 min-h-[44px]"
                      disabled={isLoading || feedback.score < 4}
                    >
                      {isLoading ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <MessageSquare className="w-4 h-4 mr-2" />
                      )}
                      Ask Follow-up
                    </Button>
                    <Button
                      onClick={generateQuestion}
                      className="flex-1 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 min-h-[44px]"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <RefreshCw className="w-4 h-4 mr-2" />
                      )}
                      Next Question
                    </Button>
                  </>
                )}
              </div>

              {/* Tips */}
              <div className="p-4 bg-muted/30 rounded-lg">
                <p className="text-sm font-medium mb-2">💡 Tip</p>
                <p className="text-xs text-muted-foreground">
                  {category === 'behavioral'
                    ? "Use the STAR method: Situation (set the context), Task (what you needed to do), Action (what you actually did), Result (the outcome with quantifiable metrics if possible)."
                    : category === 'technical'
                      ? "Explain your thought process clearly. Start with what you know, mention edge cases, discuss time/space complexity, and don't be afraid to say 'I'm not sure but I would...'"
                      : "Start by clarifying requirements and constraints. Then outline a high-level design, discuss component interactions, address scalability, and mention trade-offs for each decision."}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}
