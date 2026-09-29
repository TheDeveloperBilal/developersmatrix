'use client';

import { useCallback, useMemo, useRef, useState } from 'react';
import {
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  Check,
  CheckCircle2,
  ClipboardCopy,
  FileText,
  HelpCircle,
  Info,
  Loader2,
  ScanText,
  Search,
  Sparkles,
  Trash2,
  XCircle,
} from 'lucide-react';
import type { AnalysisResult, Verdict } from '@/lib/ai-detector/engine';
import { trackToolUsed, scoreBucket } from '@/lib/analytics';

const MIN_WORDS = 80;
const GOOD_WORDS = 150;
const MAX_CHARS = 50000;

// Written by an AI model, so visitors can see what a clear AI result looks like.
const SAMPLE_TEXT =
  'Remote work has fundamentally changed the way companies think about productivity and collaboration. In the past, managers often equated presence with performance, assuming that employees who were visible in the office were also the ones contributing the most. The shift to distributed teams has challenged this assumption in important ways. When people work from home, output becomes the primary measure of success, which encourages clearer goals and more transparent communication. However, remote work also introduces new challenges. Without casual conversations in hallways or over lunch, employees can feel isolated, and new hires may struggle to understand company culture. Teams must therefore be more intentional about building relationships, whether through regular video check ins, virtual social events, or occasional in person gatherings. Ultimately, remote work is neither a perfect solution nor a passing trend. It is a tool that, when implemented thoughtfully, can offer greater flexibility for employees and access to a wider talent pool for employers.';

const VERDICT_STYLE: Record<Verdict, { text: string; bg: string; border: string; ring: string; icon: typeof CheckCircle2 }> = {
  'likely-human': { text: 'text-[#0f7b3e]', bg: 'bg-[#e8f5ec]', border: 'border-[#b7e0c5]', ring: '#16a34a', icon: CheckCircle2 },
  unclear: { text: 'text-[#8a5a00]', bg: 'bg-[#fdf4e3]', border: 'border-[#f5d9a0]', ring: '#e8a33d', icon: HelpCircle },
  'likely-ai': { text: 'text-[#a3242b]', bg: 'bg-[#fdeceb]', border: 'border-[#f5c2c0]', ring: '#d93a36', icon: XCircle },
};

function countWords(text: string): number {
  return (text.match(/[A-Za-z']+/g) || []).length;
}

function ScoreRing({ score, color }: { score: number; color: string }) {
  const r = 52;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative h-32 w-32 shrink-0">
      <svg viewBox="0 0 120 120" className="h-32 w-32 -rotate-90" aria-hidden="true">
        <circle cx="60" cy="60" r={r} fill="none" stroke="#e5e7eb" strokeWidth="10" />
        <circle
          cx="60"
          cy="60"
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c - (score / 100) * c}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-semibold tabular-nums text-gray-900 dark:text-white">{score}</span>
        <span className="text-[11px] uppercase tracking-wide text-gray-500">AI signal</span>
      </div>
    </div>
  );
}

function Scale({ score }: { score: number }) {
  return (
    <div className="mt-5">
      <div className="relative">
        <div className="flex h-2 overflow-hidden rounded-full">
          <div className="bg-[#16a34a]" style={{ width: '35%' }} />
          <div className="bg-[#e8a33d]" style={{ width: '35%' }} />
          <div className="bg-[#d93a36]" style={{ width: '30%' }} />
        </div>
        <div
          className="absolute -top-1.5 h-5 w-1 -translate-x-1/2 rounded bg-gray-900 dark:bg-white"
          style={{ left: `${Math.min(99, Math.max(1, score))}%` }}
          aria-hidden="true"
        />
      </div>
      <div className="mt-2 grid grid-cols-[35%_35%_30%] text-[11px] text-gray-500">
        <span>Likely human</span>
        <span className="text-center">Unclear</span>
        <span className="text-right">Likely AI</span>
      </div>
    </div>
  );
}

type Tab = 'highlights' | 'tips' | 'seo';

export default function AIContentDetectorClient() {
  const [text, setText] = useState('');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState<Tab>('highlights');
  const [copied, setCopied] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  const words = useMemo(() => countWords(text), [text]);
  const enough = words >= MIN_WORDS;

  const check = useCallback(async () => {
    if (!enough) {
      setError(`Please paste at least ${MIN_WORDS} words. You have ${words}.`);
      return;
    }
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch('/api/ai-content-detector', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.success) {
        throw new Error(data?.error || 'Something went wrong while checking. Please try again.');
      }
      const r: AnalysisResult = data.result;
      setResult(r);
      setTab(r.sentenceAnalysis.some((s) => s.flagged) ? 'highlights' : 'tips');
      trackToolUsed('ai-content-detector', {
        verdict: r.verdict,
        score_bucket: scoreBucket(r.aiScore),
        word_bucket: r.wordCount < GOOD_WORDS ? 'under_150' : r.wordCount < 500 ? '150_499' : '500_plus',
      });
      requestAnimationFrame(() => {
        if (window.innerWidth < 1024) resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong while checking. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [enough, text, words]);

  const clear = () => {
    setText('');
    setResult(null);
    setError(null);
  };

  const copyReport = async () => {
    if (!result) return;
    const lines = [
      'DevelopersMatrix AI Content Detector',
      `Result: ${result.verdictLabel}`,
      `AI signal score: ${result.aiScore} out of 100`,
      `Reliability: ${result.detectionReliability}. ${result.reliabilityNote}`,
      `Words: ${result.wordCount}`,
      '',
      'Why this result:',
      ...result.signals.map((s) => `  ${s.direction === 'ai' ? 'Points to AI' : 'Points to human'}: ${s.title}. ${s.detail}`),
      '',
      'This is a statistical estimate, not proof of authorship.',
    ];
    try {
      await navigator.clipboard.writeText(lines.join('\n'));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError('Your browser blocked copying. Select the result and copy it manually.');
    }
  };

  const style = result ? VERDICT_STYLE[result.verdict] : null;
  const VerdictIcon = style?.icon;
  const flaggedCount = result ? result.sentenceAnalysis.filter((s) => s.flagged).length : 0;

  return (
    <div className="bg-[#f7f8fa] dark:bg-gray-950">
      {/* Header. No entrance animation: the H1 is the LCP element. */}
      <section className="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-3 py-1 text-xs font-medium text-gray-600 dark:border-gray-700 dark:text-gray-300">
            <ScanText className="h-3.5 w-3.5" aria-hidden="true" />
            Free, no signup
          </div>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl dark:text-white">
            AI Content Detector
          </h1>
          <p className="mt-3 max-w-2xl text-base text-gray-600 dark:text-gray-400">
            Paste any text to see whether it reads like AI writing or human writing, which sentences carry AI style
            patterns, and why. The result is an estimate, never proof.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
          {/* Input */}
          <div className="flex flex-col rounded-lg border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
            <label htmlFor="detector-input" className="sr-only">
              Text to check
            </label>
            <textarea
              id="detector-input"
              value={text}
              onChange={(e) => {
                setText(e.target.value.slice(0, MAX_CHARS));
                if (error) setError(null);
              }}
              placeholder={`Paste at least ${MIN_WORDS} words here. Results are steadier from ${GOOD_WORDS} words.`}
              className="min-h-[340px] w-full flex-1 resize-y rounded-t-lg bg-transparent p-5 text-[15px] leading-relaxed text-gray-900 placeholder:text-gray-400 focus:outline-none dark:text-gray-100"
            />
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 px-4 py-3 dark:border-gray-800">
              <div className="text-sm">
                <span className={`font-medium tabular-nums ${enough ? 'text-gray-900 dark:text-white' : 'text-gray-500'}`}>
                  {words.toLocaleString()} words
                </span>
                <span className="ml-2 text-gray-500">
                  {words === 0
                    ? `${MIN_WORDS} minimum`
                    : !enough
                      ? `${MIN_WORDS - words} more needed`
                      : words < GOOD_WORDS
                        ? `${GOOD_WORDS}+ gives steadier results`
                        : 'Good length'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {text ? (
                  <button
                    type="button"
                    onClick={clear}
                    className="inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                  >
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                    Clear
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setText(SAMPLE_TEXT)}
                    className="inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                  >
                    <Sparkles className="h-4 w-4" aria-hidden="true" />
                    Try an AI sample
                  </button>
                )}
                <button
                  type="button"
                  onClick={check}
                  disabled={loading || !text.trim()}
                  className="inline-flex items-center gap-2 rounded-md bg-gray-900 px-5 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Search className="h-4 w-4" aria-hidden="true" />}
                  {loading ? 'Checking' : 'Check text'}
                </button>
              </div>
            </div>
            {error && (
              <div role="alert" className="flex items-start gap-2 border-t border-[#f5c2c0] bg-[#fdeceb] px-4 py-3 text-sm text-[#a3242b]">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                {error}
              </div>
            )}
          </div>

          {/* Result */}
          <div ref={resultRef} className="scroll-mt-20 rounded-lg border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
            {!result && !loading && (
              <div className="p-6">
                <h2 className="text-base font-semibold text-gray-900 dark:text-white">What this checks</h2>
                <ul className="mt-4 space-y-3 text-sm text-gray-600 dark:text-gray-400">
                  {[
                    ['Word choice', 'Words AI models overuse, and how evenly vocabulary is spread.'],
                    ['Rhythm', 'How much sentence length varies. People mix short and long sentences far more.'],
                    ['Human traces', 'Asides, quotations, contractions and the small marks people leave when typing.'],
                    ['Stock patterns', 'Stock openers and phrases, highlighted sentence by sentence.'],
                  ].map(([t, d]) => (
                    <li key={t} className="flex gap-3">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" aria-hidden="true" />
                      <span>
                        <span className="font-medium text-gray-900 dark:text-gray-200">{t}.</span> {d}
                      </span>
                    </li>
                  ))}
                </ul>
                <p className="mt-6 rounded-md bg-gray-50 p-3 text-xs leading-relaxed text-gray-500 dark:bg-gray-800/60 dark:text-gray-400">
                  Your text is checked once and not stored.
                </p>
              </div>
            )}

            {loading && (
              <div className="flex h-full min-h-[300px] items-center justify-center gap-2 text-sm text-gray-500">
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                Checking your text
              </div>
            )}

            {result && style && VerdictIcon && (
              <div>
                <div className="p-6">
                  <div className="flex items-center gap-5">
                    <ScoreRing score={result.aiScore} color={style.ring} />
                    <div className="min-w-0">
                      <div className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-semibold ${style.bg} ${style.border} ${style.text}`}>
                        <VerdictIcon className="h-4 w-4" aria-hidden="true" />
                        {result.verdictLabel}
                      </div>
                      <p className="mt-3 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{result.verdictSummary}</p>
                    </div>
                  </div>

                  <Scale score={result.aiScore} />

                  <div className="mt-5 grid grid-cols-3 gap-px overflow-hidden rounded-md border border-gray-200 bg-gray-200 text-center dark:border-gray-800 dark:bg-gray-800">
                    <div className="bg-white px-2 py-3 dark:bg-gray-900">
                      <div className="text-lg font-semibold tabular-nums text-gray-900 dark:text-white">{result.wordCount}</div>
                      <div className="text-[11px] uppercase tracking-wide text-gray-500">Words</div>
                    </div>
                    <div className="bg-white px-2 py-3 dark:bg-gray-900">
                      <div className="text-lg font-semibold tabular-nums text-gray-900 dark:text-white">{flaggedCount}</div>
                      <div className="text-[11px] uppercase tracking-wide text-gray-500">Flagged sentences</div>
                    </div>
                    <div className="bg-white px-2 py-3 dark:bg-gray-900">
                      <div className="text-lg font-semibold text-gray-900 dark:text-white">{result.detectionReliability}</div>
                      <div className="text-[11px] uppercase tracking-wide text-gray-500">Reliability</div>
                    </div>
                  </div>
                  <p className="mt-2 flex items-start gap-1.5 text-xs text-gray-500">
                    <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                    {result.reliabilityNote}
                  </p>
                </div>

                {result.signals.length > 0 && (
                  <div className="border-t border-gray-100 p-6 dark:border-gray-800">
                    <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Why this result</h2>
                    <ul className="mt-3 space-y-3">
                      {result.signals.map((s) => (
                        <li key={s.id} className="flex gap-3">
                          {s.direction === 'ai' ? (
                            <ArrowUpRight className="mt-0.5 h-4 w-4 shrink-0 text-[#d93a36]" aria-label="Points to AI" />
                          ) : (
                            <ArrowDownRight className="mt-0.5 h-4 w-4 shrink-0 text-[#16a34a]" aria-label="Points to human" />
                          )}
                          <div className="text-sm">
                            <div className="font-medium text-gray-900 dark:text-gray-100">{s.title}</div>
                            <div className="text-gray-600 dark:text-gray-400">{s.detail}</div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="flex items-center justify-between border-t border-gray-100 px-6 py-3 dark:border-gray-800">
                  <span className="text-xs text-gray-500">A statistical estimate, not proof of authorship.</span>
                  <button
                    type="button"
                    onClick={copyReport}
                    className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
                  >
                    {copied ? <Check className="h-3.5 w-3.5" aria-hidden="true" /> : <ClipboardCopy className="h-3.5 w-3.5" aria-hidden="true" />}
                    {copied ? 'Copied' : 'Copy result'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Detail tabs */}
        {result && (
          <div className="mt-6 rounded-lg border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
            <div role="tablist" className="flex gap-1 overflow-x-auto border-b border-gray-100 px-4 pt-3 dark:border-gray-800">
              {(
                [
                  ['highlights', `Highlighted text (${flaggedCount})`],
                  ['tips', `Writing tips (${result.recommendations.length})`],
                  ['seo', `SEO checks (${result.seoIssues.length})`],
                ] as [Tab, string][]
              ).map(([id, label]) => (
                <button
                  key={id}
                  role="tab"
                  aria-selected={tab === id}
                  onClick={() => setTab(id)}
                  className={`-mb-px whitespace-nowrap border-b-2 px-3 py-2 text-sm font-medium ${
                    tab === id
                      ? 'border-gray-900 text-gray-900 dark:border-white dark:text-white'
                      : 'border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="p-6">
              {tab === 'highlights' && (
                <div>
                  <p className="mb-4 flex items-start gap-2 text-xs text-gray-500">
                    <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                    Highlighted sentences contain a specific AI style pattern, such as a stock opener or several words AI
                    models overuse. A highlight is not proof that the sentence was written by AI. The reasons are listed
                    below the text.
                  </p>
                  <div className="text-[15px] leading-8 text-gray-800 dark:text-gray-200">
                    {result.sentenceAnalysis.map((s, i) =>
                      s.flagged ? (
                        <mark
                          key={i}
                          title={s.reasons.join('\n')}
                          className="rounded bg-[#fdf4e3] px-0.5 text-inherit underline decoration-[#e8a33d] decoration-2 underline-offset-4 dark:bg-[#e8a33d]/15"
                        >
                          {s.sentence}{' '}
                        </mark>
                      ) : (
                        <span key={i}>{s.sentence} </span>
                      )
                    )}
                  </div>
                  {flaggedCount > 0 && (
                    <ul className="mt-6 space-y-2 border-t border-gray-100 pt-4 text-sm dark:border-gray-800">
                      {result.sentenceAnalysis
                        .filter((s) => s.flagged)
                        .slice(0, 8)
                        .map((s, i) => (
                          <li key={i} className="flex gap-2 text-gray-600 dark:text-gray-400">
                            <FileText className="mt-0.5 h-4 w-4 shrink-0 text-[#e8a33d]" aria-hidden="true" />
                            <span>
                              <span className="text-gray-900 dark:text-gray-200">
                                &ldquo;{s.sentence.slice(0, 90)}
                                {s.sentence.length > 90 ? '…' : ''}&rdquo;
                              </span>{' '}
                              {s.reasons.join('. ')}.
                            </span>
                          </li>
                        ))}
                    </ul>
                  )}
                </div>
              )}

              {tab === 'tips' && (
                <ul className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
                  {result.recommendations.map((r, i) => (
                    <li key={i} className="flex gap-3">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" aria-hidden="true" />
                      {r}
                    </li>
                  ))}
                </ul>
              )}

              {tab === 'seo' && (
                <div className="space-y-4">
                  {result.seoIssues.length === 0 && (
                    <p className="flex items-center gap-2 text-sm text-[#0f7b3e]">
                      <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                      No SEO writing problems found.
                    </p>
                  )}
                  {result.seoIssues.map((issue, i) => (
                    <div key={i} className="rounded-md border border-gray-200 p-4 dark:border-gray-800">
                      <div className="flex items-center justify-between gap-3">
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{issue.type}</h3>
                        <span
                          className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
                            issue.severity === 'high'
                              ? 'bg-[#fdeceb] text-[#a3242b]'
                              : issue.severity === 'medium'
                                ? 'bg-[#fdf4e3] text-[#8a5a00]'
                                : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {issue.severity}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{issue.description}</p>
                      <ul className="mt-2 list-disc pl-5 text-sm text-gray-600 dark:text-gray-400">
                        {issue.suggestions.map((s, j) => (
                          <li key={j}>{s}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* How to read the result */}
        <div className="mt-6 rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
          <h2 className="text-base font-semibold text-gray-900 dark:text-white">How to read the result</h2>
          <div className="mt-4 grid gap-4 text-sm sm:grid-cols-3">
            <div className="rounded-md border border-[#b7e0c5] bg-[#e8f5ec] p-4">
              <div className="font-semibold text-[#0f7b3e]">0 to 34: Likely human</div>
              <p className="mt-1 text-gray-700">The writing carries clear human traits.</p>
            </div>
            <div className="rounded-md border border-[#f5d9a0] bg-[#fdf4e3] p-4">
              <div className="font-semibold text-[#8a5a00]">35 to 69: Unclear</div>
              <p className="mt-1 text-gray-700">Signals point both ways. Common for edited AI text and formal human writing.</p>
            </div>
            <div className="rounded-md border border-[#f5c2c0] bg-[#fdeceb] p-4">
              <div className="font-semibold text-[#a3242b]">70 to 100: Likely AI</div>
              <p className="mt-1 text-gray-700">Several strong AI patterns. Texts under 150 words need 75 or more.</p>
            </div>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
            No AI detector is proof of authorship, including the big paid ones. Formal writing, technical writing and
            non native English can look more AI like than they are. Never use a single score to accuse a student, a
            writer or a colleague.
          </p>
        </div>
      </section>
    </div>
  );
}
