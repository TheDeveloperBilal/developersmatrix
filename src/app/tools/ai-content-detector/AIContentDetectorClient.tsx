'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Scan, 
  FileText, 
  BarChart3, 
  AlertTriangle, 
  CheckCircle2, 
  Lightbulb,
  Download,
  Copy,
  RefreshCw,
  ChevronDown,
  Info,
  X,
  Sparkles,
  Zap,
  Target,
  TrendingUp,
  FileSearch,
  Layers,
  Clock,
  Hash,
  MessageSquare,
  Shield,
  Award,
  BookOpen,
  Mail,
  Briefcase,
  PenTool,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { AnalysisResult, DetectionMode, SentenceAnalysis, SEOIssue } from '@/lib/ai-detector/engine';

// Detection modes configuration
const DETECTION_MODES: { id: DetectionMode; name: string; icon: React.ReactNode; description: string }[] = [
  { id: 'blog', name: 'Blog Content', icon: <FileText className="w-4 h-4" />, description: 'Personal blogs and articles' },
  { id: 'seo-article', name: 'SEO Article', icon: <Target className="w-4 h-4" />, description: 'SEO-optimized web content' },
  { id: 'academic', name: 'Academic', icon: <BookOpen className="w-4 h-4" />, description: 'Research papers and essays' },
  { id: 'resume', name: 'Resume/CV', icon: <Briefcase className="w-4 h-4" />, description: 'Professional resumes' },
  { id: 'cover-letter', name: 'Cover Letter', icon: <Mail className="w-4 h-4" />, description: 'Job application letters' },
  { id: 'sales-copy', name: 'Sales Copy', icon: <PenTool className="w-4 h-4" />, description: 'Marketing and sales content' },
  { id: 'email', name: 'Email', icon: <MessageSquare className="w-4 h-4" />, description: 'Professional emails' },
];

interface AnalysisStats {
  totalScans: number;
  avgAIScore: number;
  popularMode: string;
}

export default function AIContentDetectorClient() {
  const [text, setText] = useState('');
  const [mode, setMode] = useState<DetectionMode>('blog');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [copied, setCopied] = useState(false);
  const [stats, setStats] = useState<AnalysisStats>({
    totalScans: 0,
    avgAIScore: 0,
    popularMode: 'Blog Content'
  });
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Handle text analysis
  const handleAnalyze = useCallback(async () => {
    if (!text.trim() || text.length < 50) {
      setError('Please enter at least 50 characters for accurate analysis');
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/ai-content-detector', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, mode }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Analysis failed');
      }

      setResult(data.result);
      setActiveTab('overview');
      
      // Update stats
      setStats(prev => ({
        totalScans: prev.totalScans + 1,
        avgAIScore: (prev.avgAIScore + data.result.aiProbability) / 2,
        popularMode: DETECTION_MODES.find(m => m.id === mode)?.name || prev.popularMode
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  }, [text, mode]);

  // Copy results to clipboard
  const handleCopy = useCallback(() => {
    if (!result) return;
    
    const report = generateTextReport(result, text);
    navigator.clipboard.writeText(report);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [result, text]);

  // Export as PDF (simplified - creates printable view)
  const handleExportPDF = useCallback(() => {
    if (!result) return;
    
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    
    const report = generateHTMLReport(result, text, mode);
    printWindow.document.write(report);
    printWindow.document.close();
    printWindow.print();
  }, [result, text, mode]);

  // Clear all
  const handleClear = useCallback(() => {
    setText('');
    setResult(null);
    setError(null);
    setActiveTab('overview');
  }, []);

  // Get sentence highlight color
  const getSentenceColor = (analysis: SentenceAnalysis) => {
    if (analysis.aiProbability > 70) return 'bg-red-100 dark:bg-red-900/30 border-l-4 border-red-500';
    if (analysis.aiProbability > 50) return 'bg-orange-100 dark:bg-orange-900/30 border-l-4 border-orange-500';
    if (analysis.aiProbability > 30) return 'bg-yellow-100 dark:bg-yellow-900/30 border-l-4 border-yellow-500';
    return 'bg-green-100 dark:bg-green-900/30 border-l-4 border-green-500';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-violet-200/40 dark:from-violet-900/20 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-purple-200/30 dark:from-purple-900/10 via-transparent to-transparent" />
        
        {/* Animated Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-violet-500/10 to-purple-500/10 border border-violet-500/20 mb-6"
            >
              <Sparkles className="w-4 h-4 text-violet-500" />
              <span className="text-sm font-medium text-violet-600 dark:text-violet-400">
                AI-Powered Analysis
              </span>
            </motion.div>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 dark:from-white dark:via-slate-100 dark:to-white bg-clip-text text-transparent">
                AI Content
              </span>
              <br />
              <span className="bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                Detector
              </span>
            </h1>

            {/* Description */}
            <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto mb-8">
              Advanced AI detection for SEO & professional writing. Analyze text for AI-generated content, 
              keyword stuffing, EEAT signals, and more with real, accurate scores.
            </p>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-wrap justify-center gap-6 mb-12"
            >
              {[
                { label: 'Total Scans', value: stats.totalScans.toLocaleString(), icon: <Scan className="w-4 h-4" /> },
                { label: 'Avg AI Score', value: `${stats.avgAIScore.toFixed(1)}%`, icon: <BarChart3 className="w-4 h-4" /> },
                { label: 'Popular Mode', value: stats.popularMode, icon: <TrendingUp className="w-4 h-4" /> },
              ].map((stat, i) => (
                <div key={i} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/60 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <span className="text-violet-500">{stat.icon}</span>
                  <span className="text-sm text-slate-500 dark:text-slate-400">{stat.label}:</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{stat.value}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Panel */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="relative"
          >
            {/* Glassmorphism Card */}
            <div className="relative bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xl overflow-hidden">
              {/* Card Header */}
              <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                      <FileSearch className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="font-semibold text-slate-900 dark:text-white">Content Input</h2>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Paste your text below</p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-slate-100 dark:bg-slate-700">
                    {text.length.toLocaleString()} / 50,000
                  </Badge>
                </div>

                {/* Mode Selector */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-500 dark:text-slate-400">Mode:</span>
                  <Select value={mode} onValueChange={(v) => setMode(v as DetectionMode)}>
                    <SelectTrigger className="w-[180px] bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600">
                      <SelectValue placeholder="Select mode" />
                    </SelectTrigger>
                    <SelectContent>
                      {DETECTION_MODES.map((m) => (
                        <SelectItem key={m.id} value={m.id}>
                          <div className="flex items-center gap-2">
                            {m.icon}
                            <span>{m.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Text Area */}
              <div className="p-6">
                <textarea
                  ref={textareaRef}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Paste your content here to analyze for AI-generated text, SEO issues, and writing quality...

Minimum 50 characters required for accurate analysis."
                  className="w-full h-80 p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none resize-none text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-all"
                />

                {/* Error Message */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mt-4 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
                    >
                      <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                        <AlertTriangle className="w-5 h-5" />
                        <span>{error}</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3 mt-6">
                  <Button
                    onClick={handleAnalyze}
                    disabled={isAnalyzing || text.length < 50}
                    className="flex-1 sm:flex-none bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white shadow-lg shadow-violet-500/25"
                  >
                    {isAnalyzing ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Scan className="w-4 h-4 mr-2" />
                        Analyze Content
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={handleClear}
                    variant="outline"
                    className="border-slate-200 dark:border-slate-700"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Clear
                  </Button>
                </div>
              </div>
            </div>

            {/* Mode Info Cards */}
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-3">
              {DETECTION_MODES.slice(0, 6).map((m) => (
                <button
                  key={m.id}
                  onClick={() => setMode(m.id)}
                  className={`p-3 rounded-xl text-left transition-all ${
                    mode === m.id
                      ? 'bg-violet-100 dark:bg-violet-900/30 border-2 border-violet-500'
                      : 'bg-white/60 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 hover:border-violet-300 dark:hover:border-violet-700'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className={mode === m.id ? 'text-violet-500' : 'text-slate-500'}>
                      {m.icon}
                    </span>
                    <span className="text-xs font-medium text-slate-900 dark:text-white">{m.name}</span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{m.description}</p>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Results Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="relative bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xl overflow-hidden">
              {result ? (
                <>
                  {/* Results Header */}
                  <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          result.aiProbability > 60
                            ? 'bg-red-100 dark:bg-red-900/30'
                            : result.aiProbability > 40
                            ? 'bg-yellow-100 dark:bg-yellow-900/30'
                            : 'bg-green-100 dark:bg-green-900/30'
                        }`}>
                          {result.aiProbability > 60 ? (
                            <AlertTriangle className="w-6 h-6 text-red-500" />
                          ) : result.aiProbability > 40 ? (
                            <Info className="w-6 h-6 text-yellow-500" />
                          ) : (
                            <CheckCircle2 className="w-6 h-6 text-green-500" />
                          )}
                        </div>
                        <div>
                          <h2 className="font-semibold text-slate-900 dark:text-white">Analysis Complete</h2>
                          <p className="text-sm text-slate-500 dark:text-slate-400">
                            Confidence: {result.confidenceScore}% • {result.detectionReliability}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                onClick={handleCopy}
                                variant="outline"
                                size="icon"
                                className="border-slate-200 dark:border-slate-700"
                              >
                                <Copy className={`w-4 h-4 ${copied ? 'text-green-500' : ''}`} />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>{copied ? 'Copied!' : 'Copy Report'}</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                onClick={handleExportPDF}
                                variant="outline"
                                size="icon"
                                className="border-slate-200 dark:border-slate-700"
                              >
                                <Download className="w-4 h-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Export PDF</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </div>

                    {/* Main Score Display */}
                    <div className="grid grid-cols-2 gap-4 mt-6">
                      <div className="p-4 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800">
                        <div className="text-sm text-green-600 dark:text-green-400 mb-1">Human Probability</div>
                        <div className="text-3xl font-bold text-green-700 dark:text-green-300">
                          {result.humanProbability}%
                        </div>
                        <Progress value={result.humanProbability} className="h-2 mt-2 bg-green-200 dark:bg-green-900" />
                      </div>
                      <div className="p-4 rounded-xl bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 border border-red-200 dark:border-red-800">
                        <div className="text-sm text-red-600 dark:text-red-400 mb-1">AI Probability</div>
                        <div className="text-3xl font-bold text-red-700 dark:text-red-300">
                          {result.aiProbability}%
                        </div>
                        <Progress value={result.aiProbability} className="h-2 mt-2 bg-red-200 dark:bg-red-900" />
                      </div>
                    </div>
                  </div>

                  {/* Results Tabs */}
                  <div className="p-6">
                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                      <TabsList className="grid grid-cols-4 w-full bg-slate-100 dark:bg-slate-900">
                        <TabsTrigger value="overview" className="text-xs sm:text-sm">Overview</TabsTrigger>
                        <TabsTrigger value="metrics" className="text-xs sm:text-sm">Metrics</TabsTrigger>
                        <TabsTrigger value="sentences" className="text-xs sm:text-sm">Sentences</TabsTrigger>
                        <TabsTrigger value="seo" className="text-xs sm:text-sm">SEO</TabsTrigger>
                      </TabsList>

                      {/* Overview Tab */}
                      <TabsContent value="overview" className="mt-4">
                        <div className="space-y-4">
                          {/* Quick Metrics Grid */}
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            {[
                              { label: 'Perplexity', value: result.metrics.perplexity, icon: <Zap className="w-4 h-4" /> },
                              { label: 'Burstiness', value: result.metrics.burstiness, icon: <TrendingUp className="w-4 h-4" /> },
                              { label: 'Vocabulary', value: result.metrics.vocabularyDiversity, icon: <BookOpen className="w-4 h-4" /> },
                              { label: 'Rhythm', value: result.metrics.writingRhythm, icon: <Clock className="w-4 h-4" /> },
                            ].map((metric, i) => (
                              <div key={i} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700">
                                <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 mb-1">
                                  {metric.icon}
                                  <span className="text-xs">{metric.label}</span>
                                </div>
                                <div className="text-lg font-semibold text-slate-900 dark:text-white">
                                  {metric.value}%
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Recommendations */}
                          {result.recommendations.length > 0 && (
                            <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                              <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 mb-3">
                                <Lightbulb className="w-5 h-5" />
                                <span className="font-medium">Recommendations</span>
                              </div>
                              <ul className="space-y-2">
                                {result.recommendations.map((rec, i) => (
                                  <li key={i} className="flex items-start gap-2 text-sm text-blue-700 dark:text-blue-300">
                                    <ArrowRight className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                    <span>{rec}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </TabsContent>

                      {/* Metrics Tab */}
                      <TabsContent value="metrics" className="mt-4">
                        <div className="space-y-4">
                          {[
                            { label: 'Perplexity Score', value: result.metrics.perplexity, description: 'Measures text unpredictability. Higher = more human-like.' },
                            { label: 'Burstiness Score', value: result.metrics.burstiness, description: 'Variation in sentence complexity. Higher = more natural rhythm.' },
                            { label: 'Sentence Consistency', value: result.metrics.sentenceConsistency, description: 'Structure similarity. Lower = more varied = more human.' },
                            { label: 'Vocabulary Diversity', value: result.metrics.vocabularyDiversity, description: 'Unique word usage. Higher = richer vocabulary.' },
                            { label: 'Repetition Score', value: result.metrics.repetitionScore, description: 'Phrase originality. Higher = less repetitive.' },
                            { label: 'Predictability', value: result.metrics.predictability, description: 'Cliché detection. Lower = more original content.' },
                            { label: 'Writing Rhythm', value: result.metrics.writingRhythm, description: 'Sentence length variation. Higher = more dynamic.' },
                            { label: 'Human Likeness', value: result.metrics.humanLikeness, description: 'Overall human writing characteristics.' },
                          ].map((metric, i) => (
                            <div key={i} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium text-slate-900 dark:text-white">{metric.label}</span>
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger>
                                        <Info className="w-4 h-4 text-slate-400" />
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p className="max-w-xs">{metric.description}</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                </div>
                                <span className="text-lg font-semibold text-slate-900 dark:text-white">
                                  {metric.value}%
                                </span>
                              </div>
                              <Progress 
                                value={metric.value} 
                                className={`h-2 ${
                                  metric.value > 60 ? 'bg-green-200 dark:bg-green-900' :
                                  metric.value > 40 ? 'bg-yellow-200 dark:bg-yellow-900' :
                                  'bg-red-200 dark:bg-red-900'
                                }`}
                              />
                            </div>
                          ))}
                        </div>
                      </TabsContent>

                      {/* Sentences Tab */}
                      <TabsContent value="sentences" className="mt-4">
                        <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                          {result.sentenceAnalysis.map((analysis, i) => (
                            <TooltipProvider key={i}>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div className={`p-3 rounded-lg ${getSentenceColor(analysis)} cursor-pointer transition-all hover:shadow-md`}>
                                    <div className="flex items-start justify-between gap-2">
                                      <p className="text-sm text-slate-700 dark:text-slate-300 flex-1">
                                        {analysis.sentence}
                                      </p>
                                      <Badge 
                                        variant="secondary" 
                                        className={`flex-shrink-0 ${
                                          analysis.aiProbability > 70 ? 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300' :
                                          analysis.aiProbability > 50 ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300' :
                                          analysis.aiProbability > 30 ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300' :
                                          'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300'
                                        }`}
                                      >
                                        {analysis.aiProbability}% AI
                                      </Badge>
                                    </div>
                                    {analysis.issues.length > 0 && (
                                      <div className="mt-2 flex flex-wrap gap-1">
                                        {analysis.issues.slice(0, 2).map((issue, j) => (
                                          <Badge key={j} variant="outline" className="text-xs border-slate-300 dark:border-slate-600">
                                            {issue.substring(0, 30)}...
                                          </Badge>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                </TooltipTrigger>
                                {analysis.issues.length > 0 && (
                                  <TooltipContent side="left" className="max-w-sm">
                                    <p className="font-medium mb-1">Issues Detected:</p>
                                    <ul className="text-sm">
                                      {analysis.issues.map((issue, j) => (
                                        <li key={j}>• {issue}</li>
                                      ))}
                                    </ul>
                                  </TooltipContent>
                                )}
                              </Tooltip>
                            </TooltipProvider>
                          ))}
                        </div>
                      </TabsContent>

                      {/* SEO Tab */}
                      <TabsContent value="seo" className="mt-4">
                        {result.seoIssues.length > 0 ? (
                          <div className="space-y-3">
                            {result.seoIssues.map((issue, i) => (
                              <SEOIssueCard key={i} issue={issue} />
                            ))}
                          </div>
                        ) : (
                          <div className="p-8 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-center">
                            <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
                            <h3 className="font-semibold text-green-700 dark:text-green-300 mb-1">
                              No SEO Issues Detected
                            </h3>
                            <p className="text-sm text-green-600 dark:text-green-400">
                              Your content appears to be well-optimized for search engines.
                            </p>
                          </div>
                        )}
                      </TabsContent>
                    </Tabs>
                  </div>
                </>
              ) : (
                /* Empty State */
                <div className="p-12 text-center">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-violet-100 to-purple-100 dark:from-violet-900/30 dark:to-purple-900/30 flex items-center justify-center">
                    <Layers className="w-10 h-10 text-violet-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                    Ready to Analyze
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                    Paste your content and click "Analyze Content" to detect AI-generated text and SEO issues.
                  </p>
                  
                  {/* Feature Highlights */}
                  <div className="mt-8 grid grid-cols-2 gap-3 max-w-md mx-auto">
                    {[
                      { icon: <Scan className="w-4 h-4" />, text: 'AI Detection' },
                      { icon: <Target className="w-4 h-4" />, text: 'SEO Analysis' },
                      { icon: <Hash className="w-4 h-4" />, text: 'Keyword Check' },
                      { icon: <Shield className="w-4 h-4" />, text: 'EEAT Signals' },
                    ].map((feature, i) => (
                      <div key={i} className="flex items-center gap-2 p-3 rounded-lg bg-slate-50 dark:bg-slate-900/50">
                        <span className="text-violet-500">{feature.icon}</span>
                        <span className="text-sm text-slate-600 dark:text-slate-400">{feature.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

// SEO Issue Card Component
function SEOIssueCard({ issue }: { issue: SEOIssue }) {
  const severityColors = {
    high: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',
    medium: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800',
    low: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
  };

  const severityBadgeColors = {
    high: 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300',
    medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300',
    low: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300',
  };

  return (
    <div className={`p-4 rounded-xl border ${severityColors[issue.severity]}`}>
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <AlertTriangle className={`w-5 h-5 ${
            issue.severity === 'high' ? 'text-red-500' :
            issue.severity === 'medium' ? 'text-yellow-500' :
            'text-blue-500'
          }`} />
          <span className="font-medium text-slate-900 dark:text-white">{issue.type}</span>
        </div>
        <Badge variant="secondary" className={severityBadgeColors[issue.severity]}>
          {issue.severity}
        </Badge>
      </div>
      <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">{issue.description}</p>
      <div className="space-y-1">
        {issue.suggestions.map((suggestion, i) => (
          <div key={i} className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <ArrowRight className="w-3 h-3 flex-shrink-0" />
            <span>{suggestion}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Generate text report
function generateTextReport(result: AnalysisResult, text: string): string {
  return `
AI CONTENT DETECTION REPORT
===========================

SUMMARY
-------
Human Probability: ${result.humanProbability}%
AI Probability: ${result.aiProbability}%
Confidence Score: ${result.confidenceScore}%
Detection Reliability: ${result.detectionReliability}

METRICS
-------
Perplexity: ${result.metrics.perplexity}%
Burstiness: ${result.metrics.burstiness}%
Sentence Consistency: ${result.metrics.sentenceConsistency}%
Vocabulary Diversity: ${result.metrics.vocabularyDiversity}%
Repetition Score: ${result.metrics.repetitionScore}%
Predictability: ${result.metrics.predictability}%
Writing Rhythm: ${result.metrics.writingRhythm}%
Human Likeness: ${result.metrics.humanLikeness}%

RECOMMENDATIONS
---------------
${result.recommendations.map((r, i) => `${i + 1}. ${r}`).join('\n')}

SEO ISSUES (${result.seoIssues.length})
--------------------------------------
${result.seoIssues.map(issue => `
- ${issue.type} (${issue.severity.toUpperCase()})
  ${issue.description}
  Suggestions: ${issue.suggestions.join('; ')}
`).join('\n')}

Generated by DevelopersMatrix AI Content Detector
`.trim();
}

// Generate HTML report for PDF
function generateHTMLReport(result: AnalysisResult, text: string, mode: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <title>AI Content Detection Report</title>
  <style>
    body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
    h1 { color: #7c3aed; border-bottom: 2px solid #7c3aed; padding-bottom: 10px; }
    h2 { color: #374151; margin-top: 30px; }
    .summary { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 20px 0; }
    .summary-card { padding: 20px; border-radius: 10px; text-align: center; }
    .human { background: #dcfce7; border: 1px solid #22c55e; }
    .ai { background: #fee2e2; border: 1px solid #ef4444; }
    .metric { margin: 10px 0; padding: 10px; background: #f3f4f6; border-radius: 5px; }
    .recommendation { margin: 10px 0; padding: 10px; background: #eff6ff; border-left: 3px solid #3b82f6; }
    .issue { margin: 10px 0; padding: 10px; border-radius: 5px; }
    .high { background: #fee2e2; border-left: 3px solid #ef4444; }
    .medium { background: #fef3c7; border-left: 3px solid #f59e0b; }
    .low { background: #dbeafe; border-left: 3px solid #3b82f6; }
    .footer { margin-top: 40px; text-align: center; color: #6b7280; font-size: 12px; }
  </style>
</head>
<body>
  <h1>AI Content Detection Report</h1>
  
  <div class="summary">
    <div class="summary-card human">
      <h3>Human Probability</h3>
      <div style="font-size: 36px; font-weight: bold; color: #16a34a;">${result.humanProbability}%</div>
    </div>
    <div class="summary-card ai">
      <h3>AI Probability</h3>
      <div style="font-size: 36px; font-weight: bold; color: #dc2626;">${result.aiProbability}%</div>
    </div>
  </div>
  
  <p><strong>Confidence:</strong> ${result.confidenceScore}% | <strong>Reliability:</strong> ${result.detectionReliability}</p>
  
  <h2>Detailed Metrics</h2>
  <div class="metric"><strong>Perplexity:</strong> ${result.metrics.perplexity}%</div>
  <div class="metric"><strong>Burstiness:</strong> ${result.metrics.burstiness}%</div>
  <div class="metric"><strong>Vocabulary Diversity:</strong> ${result.metrics.vocabularyDiversity}%</div>
  <div class="metric"><strong>Writing Rhythm:</strong> ${result.metrics.writingRhythm}%</div>
  
  <h2>Recommendations</h2>
  ${result.recommendations.map(r => `<div class="recommendation">${r}</div>`).join('')}
  
  <h2>SEO Issues</h2>
  ${result.seoIssues.length > 0 
    ? result.seoIssues.map(issue => `
      <div class="issue ${issue.severity}">
        <strong>${issue.type}</strong> (${issue.severity})<br>
        ${issue.description}<br>
        <em>Suggestions: ${issue.suggestions.join(', ')}</em>
      </div>
    `).join('')
    : '<p>No SEO issues detected.</p>'
  }
  
  <div class="footer">
    Generated by DevelopersMatrix AI Content Detector | ${new Date().toLocaleDateString()}
  </div>
</body>
</html>
  `.trim();
}
