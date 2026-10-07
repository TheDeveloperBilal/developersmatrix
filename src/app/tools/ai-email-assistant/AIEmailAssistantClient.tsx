'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Check, ClipboardCopy, ExternalLink, Mail, PenLine, RotateCcw, Search, Sparkles } from 'lucide-react';
import { GROUPS, TONES, blanksOf, fill, parts, type Tone } from '@/lib/email/template';
import { SCENARIOS, SCENARIO_BY_ID } from '@/lib/email/scenarios';
import { checkEmail, highlight, type Issue, type Severity } from '@/lib/email/check';
import { LENGTHS, REPLY_GOALS, REWRITE_GOALS, buildPrompt, mailLinks, type AiTask, type Length } from '@/lib/email/handoff';
import { chatLinks } from '@/lib/prompts/types';

type Mode = 'write' | 'check' | 'ai';
const STORE = 'dm-email-assistant';

const SEV_STYLE: Record<Severity, { dot: string; mark: string; label: string }> = {
  fix: { dot: 'bg-rose-500', mark: 'bg-rose-100 text-rose-900 dark:bg-rose-500/25 dark:text-rose-100', label: 'Fix' },
  improve: { dot: 'bg-amber-500', mark: 'bg-amber-100 text-amber-900 dark:bg-amber-500/25 dark:text-amber-100', label: 'Improve' },
  note: { dot: 'bg-sky-500', mark: 'bg-sky-100 text-sky-900 dark:bg-sky-500/25 dark:text-sky-100', label: 'Note' },
};

const EXAMPLE_DRAFT = {
  subject: 'Update',
  body: 'Hi Sam,\n\nI just wanted to reach out and touch base about the website project. I was wondering if maybe you could send me the final logo files ASAP because the design was delayed by the missing files and I think we are really behind now and we need them to finish the homepage this week!!\n\nThanks in advance',
};

function useCopy() {
  const [copied, setCopied] = useState<string | null>(null);
  const copy = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(id);
      window.setTimeout(() => setCopied((c) => (c === id ? null : c)), 1800);
    } catch { /* clipboard blocked */ }
  };
  return { copied, copy };
}

function Segmented<T extends string>({ value, options, onChange, label, size = 'md' }: {
  value: T;
  options: { id: T; label: string }[];
  onChange: (v: T) => void;
  label: string;
  size?: 'sm' | 'md';
}) {
  return (
    <div role="radiogroup" aria-label={label} className="grid auto-cols-fr grid-flow-col gap-1 rounded-xl border border-zinc-200 bg-zinc-100/70 p-1 dark:border-zinc-800 dark:bg-zinc-900">
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          role="radio"
          aria-checked={value === o.id}
          onClick={() => onChange(o.id)}
          className={`rounded-lg px-2 font-medium transition-colors ${size === 'sm' ? 'py-1 text-[12.5px]' : 'py-1.5 text-sm'} ${value === o.id ? 'bg-white text-zinc-900 shadow-sm dark:bg-zinc-800 dark:text-white' : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'}`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function IssueList({ issues, empty }: { issues: Issue[]; empty: string }) {
  if (!issues.length) {
    return (
      <p className="flex items-center gap-2 rounded-xl bg-emerald-50 px-3 py-2.5 text-sm text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-300">
        <Check className="h-4 w-4 shrink-0" aria-hidden="true" /> {empty}
      </p>
    );
  }
  return (
    <ul className="space-y-2">
      {issues.map((i) => (
        <li key={i.id} className="rounded-xl border border-zinc-200 bg-white px-3 py-2.5 dark:border-zinc-800 dark:bg-zinc-950">
          <p className="flex items-start gap-2 text-sm font-medium text-zinc-900 dark:text-white">
            <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${SEV_STYLE[i.severity].dot}`} aria-hidden="true" />
            <span className="min-w-0">
              <span className="sr-only">{SEV_STYLE[i.severity].label}: </span>
              {i.title}
            </span>
          </p>
          <p className="mt-1 pl-4 text-[13px] leading-relaxed text-zinc-600 dark:text-zinc-400">{i.detail}</p>
          {i.quote && !i.title.includes(i.quote) && (
            <p className="mt-1 pl-4 text-[12.5px] italic text-zinc-500">&ldquo;{i.quote}&rdquo;</p>
          )}
        </li>
      ))}
    </ul>
  );
}

function Counts({ counts }: { counts: Record<Severity, number> }) {
  return (
    <div className="flex flex-wrap gap-2 text-[12.5px]">
      {(['fix', 'improve', 'note'] as Severity[]).map((s) => (
        <span key={s} className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 px-2.5 py-1 text-zinc-700 dark:border-zinc-800 dark:text-zinc-300">
          <span className={`h-2 w-2 rounded-full ${SEV_STYLE[s].dot}`} aria-hidden="true" />
          {counts[s]} {SEV_STYLE[s].label.toLowerCase()}
        </span>
      ))}
    </div>
  );
}

export default function AIEmailAssistantClient() {
  const [mode, setMode] = useState<Mode>('write');
  const { copied, copy } = useCopy();

  // Write
  const [scenarioId, setScenarioId] = useState(SCENARIOS[0].id);
  const [tone, setTone] = useState<Tone>('professional');
  const [values, setValues] = useState<Record<string, string>>({});
  const [to, setTo] = useState('');
  const [filter, setFilter] = useState('');

  // Check
  const [ckSubject, setCkSubject] = useState('');
  const [ckBody, setCkBody] = useState('');

  // AI
  const [task, setTask] = useState<AiTask>('reply');
  const [aiText, setAiText] = useState('');
  const [aiTone, setAiTone] = useState<Tone>('professional');
  const [length, setLength] = useState<Length>('medium');
  const [replyGoal, setReplyGoal] = useState<string>('yes');
  const [rewriteGoals, setRewriteGoals] = useState<string[]>(['clearer']);
  const [notes, setNotes] = useState('');

  const toolRef = useRef<HTMLDivElement>(null);

  // Remember only the visitor's own name and tone, in this browser.
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORE) || '{}');
      if (saved.yourName) setValues((v) => ({ 'Your name': saved.yourName, ...v }));
      if (saved.tone && TONES.some((t) => t.id === saved.tone)) setTone(saved.tone);
    } catch { /* storage unavailable */ }
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem(STORE, JSON.stringify({ yourName: values['Your name'] || '', tone }));
    } catch { /* storage unavailable */ }
  }, [values, tone]);

  const scenario = SCENARIO_BY_ID[scenarioId];
  const draft = scenario.tones[tone];
  const blanks = useMemo(() => blanksOf(draft), [draft]);
  const filledCount = blanks.filter((b) => values[b.key]?.trim()).length;
  const finalSubject = fill(draft.subject, values);
  const finalBody = fill(draft.body, values);
  const writeCheck = useMemo(() => checkEmail(finalSubject, finalBody), [finalSubject, finalBody]);
  const writeIssues = writeCheck.issues.filter((i) => i.id !== 'placeholders');
  const links = mailLinks(to.trim(), finalSubject, finalBody);

  const ck = useMemo(() => checkEmail(ckSubject, ckBody), [ckSubject, ckBody]);
  const marked = useMemo(() => highlight(ckBody, ck.issues), [ckBody, ck.issues]);

  const prompt = buildPrompt({ task, text: aiText, tone: aiTone, length, replyGoal, rewriteGoals, notes });
  const aiLinks = aiText.trim().length >= 20 ? chatLinks(prompt) : null;

  const visibleScenarios = SCENARIOS.filter((s) => !filter.trim() || `${s.name} ${s.blurb} ${s.group}`.toLowerCase().includes(filter.trim().toLowerCase()));

  const setValue = (key: string, v: string) => setValues((prev) => ({ ...prev, [key]: v }));
  const focusBlank = (key: string) => {
    const el = toolRef.current?.querySelector<HTMLInputElement>(`[data-blank="${CSS.escape(key)}"]`);
    el?.focus();
    el?.scrollIntoView({ block: 'center', behavior: 'smooth' });
  };
  const sendToAi = (text: string) => {
    setAiText(text);
    setTask('rewrite');
    setMode('ai');
    toolRef.current?.scrollIntoView({ block: 'start', behavior: 'smooth' });
  };

  const renderInline = (text: string, idPrefix: string) =>
    parts(text).map((p, i) => {
      if (p.kind === 'text') return <span key={`${idPrefix}${i}`}>{p.text}</span>;
      const v = values[p.key] || '';
      const len = Math.min(Math.max((v || p.hint).length, 4), 60);
      return (
        <input
          key={`${idPrefix}${i}`}
          data-blank={p.key}
          aria-label={p.key}
          value={v}
          placeholder={p.hint}
          onChange={(e) => setValue(p.key, e.target.value)}
          style={{ width: `calc(${len * 0.56}em + 1.25rem)` }}
          className={`mx-0.5 inline-block max-w-full rounded-md border-b-2 px-1 py-0 align-baseline font-[inherit] text-[inherit] leading-[inherit] outline-none transition-colors focus:ring-2 focus:ring-indigo-500/30 ${
            v.trim()
              ? 'border-indigo-500 bg-indigo-50 text-indigo-950 dark:bg-indigo-500/15 dark:text-indigo-100'
              : 'border-dashed border-amber-500 bg-amber-50 text-zinc-900 placeholder:text-amber-700/70 dark:bg-amber-500/10 dark:text-white dark:placeholder:text-amber-300/60'
          }`}
        />
      );
    });

  const tabs: { id: Mode; label: string; short: string; icon: typeof Mail }[] = [
    { id: 'write', label: 'Write from a template', short: 'Write', icon: PenLine },
    { id: 'check', label: 'Check a draft', short: 'Check', icon: Search },
    { id: 'ai', label: 'Reply or rewrite with AI', short: 'Use AI', icon: Sparkles },
  ];

  return (
    <div ref={toolRef} className="scroll-mt-20 overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-[0_24px_60px_-30px_rgba(24,24,27,0.35)] dark:border-zinc-800 dark:bg-zinc-950">
      {/* Window bar */}
      <div className="flex flex-col gap-2 bg-zinc-900 px-3 py-2.5 sm:flex-row sm:items-center sm:justify-between sm:px-4 dark:bg-black">
        <p className="flex items-center gap-2 text-sm font-medium text-zinc-200">
          <Mail className="h-4 w-4 text-indigo-300" aria-hidden="true" />
          {mode === 'write' ? 'New message' : mode === 'check' ? 'Draft check' : 'AI handoff'}
        </p>
        <div role="tablist" aria-label="Email assistant mode" className="grid grid-cols-3 gap-1 rounded-lg bg-white/5 p-1">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={mode === t.id}
              onClick={() => setMode(t.id)}
              className={`inline-flex items-center justify-center gap-1.5 rounded-md px-2.5 py-1.5 text-[13px] font-medium transition-colors ${mode === t.id ? 'bg-white text-zinc-900' : 'text-zinc-300 hover:bg-white/10 hover:text-white'}`}
            >
              <t.icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              <span className="lg:hidden">{t.short}</span>
              <span className="hidden lg:inline">{t.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* WRITE */}
      {mode === 'write' && (
        <div className="grid lg:grid-cols-[230px_minmax(0,1fr)_290px]">
          {/* Situations */}
          <nav aria-label="Email situations" className="border-b border-zinc-200 bg-zinc-50/80 dark:border-zinc-800 dark:bg-zinc-900/40 lg:border-b-0 lg:border-r">
            <div className="p-3 lg:hidden">
              <label className="block text-[12px] font-medium text-zinc-500" htmlFor="em-scenario">Situation</label>
              <select
                id="em-scenario"
                value={scenarioId}
                onChange={(e) => setScenarioId(e.target.value)}
                className="mt-1 h-11 w-full rounded-xl border border-zinc-300 bg-white px-3 text-[15px] text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
              >
                {GROUPS.map((g) => (
                  <optgroup key={g} label={g}>
                    {SCENARIOS.filter((s) => s.group === g).map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </optgroup>
                ))}
              </select>
              <div className="mt-3">
                <Segmented value={tone} options={TONES.map((t) => ({ id: t.id, label: t.name }))} onChange={setTone} label="Tone" size="sm" />
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="p-3 pb-1">
                <label className="flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-2.5 dark:border-zinc-800 dark:bg-zinc-950">
                  <Search className="h-3.5 w-3.5 text-zinc-400" aria-hidden="true" />
                  <span className="sr-only">Filter situations</span>
                  <input value={filter} onChange={(e) => setFilter(e.target.value)} placeholder="Filter" className="h-8 w-full bg-transparent text-[13px] text-zinc-900 outline-none placeholder:text-zinc-400 dark:text-white" />
                </label>
              </div>
              <div className="max-h-[640px] overflow-y-auto px-2 pb-3">
                {GROUPS.map((g) => {
                  const list = visibleScenarios.filter((s) => s.group === g);
                  if (!list.length) return null;
                  return (
                    <div key={g}>
                      <p className="px-2 pb-1 pt-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-zinc-400">{g}</p>
                      <ul>
                        {list.map((s) => (
                          <li key={s.id}>
                            <button
                              type="button"
                              onClick={() => setScenarioId(s.id)}
                              aria-current={s.id === scenarioId ? 'true' : undefined}
                              className={`w-full rounded-lg px-2.5 py-1.5 text-left text-[13.5px] transition-colors ${s.id === scenarioId ? 'bg-zinc-900 font-medium text-white dark:bg-white dark:text-zinc-900' : 'text-zinc-700 hover:bg-zinc-200/70 dark:text-zinc-300 dark:hover:bg-zinc-800'}`}
                            >
                              {s.name}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </div>
          </nav>

          {/* Compose */}
          <div className="min-w-0">
            <div className="border-b border-zinc-200 px-4 py-3 dark:border-zinc-800 sm:px-6">
              <p className="text-[13px] text-zinc-500">{scenario.blurb}</p>
            </div>
            <div className="flex items-center gap-3 border-b border-zinc-200 px-4 dark:border-zinc-800 sm:px-6">
              <label htmlFor="em-to" className="w-14 shrink-0 text-sm text-zinc-500">To</label>
              <input id="em-to" type="email" value={to} onChange={(e) => setTo(e.target.value)} placeholder="their@email.com (optional)" className="h-11 w-full min-w-0 bg-transparent text-[15px] text-zinc-900 outline-none placeholder:text-zinc-400 dark:text-white" />
            </div>
            <div className="flex items-start gap-3 border-b border-zinc-200 px-4 py-2.5 dark:border-zinc-800 sm:px-6">
              <span className="w-14 shrink-0 pt-0.5 text-sm text-zinc-500">Subject</span>
              <p className="min-w-0 flex-1 text-[15px] font-medium leading-8 text-zinc-900 dark:text-white">{renderInline(draft.subject, 's')}</p>
              <button type="button" onClick={() => copy('subject', finalSubject)} className="shrink-0 rounded-md p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-900 dark:hover:text-white" title="Copy subject">
                {copied === 'subject' ? <Check className="h-4 w-4 text-indigo-600" aria-hidden="true" /> : <ClipboardCopy className="h-4 w-4" aria-hidden="true" />}
                <span className="sr-only">Copy subject</span>
              </button>
            </div>
            <div className="whitespace-pre-wrap break-words px-4 py-5 text-[15px] leading-8 text-zinc-800 dark:text-zinc-200 sm:px-6">
              {renderInline(draft.body, 'b')}
            </div>
            <div className="flex flex-wrap items-center gap-2 border-t border-zinc-200 bg-zinc-50/70 px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900/40 sm:px-6">
              <button type="button" onClick={() => copy('email', finalBody)} className="inline-flex h-10 items-center gap-1.5 rounded-xl bg-indigo-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-indigo-700">
                {copied === 'email' ? <Check className="h-4 w-4" aria-hidden="true" /> : <ClipboardCopy className="h-4 w-4" aria-hidden="true" />}
                {copied === 'email' ? 'Copied' : 'Copy email'}
              </button>
              <span className="text-[12px] text-zinc-500">Open as a draft in</span>
              {[
                ['Gmail', links.gmail],
                ['Outlook', links.outlook],
                ['Mail app', links.mailto],
              ].map(([name, href]) => (
                <a key={name} href={href} target={name === 'Mail app' ? undefined : '_blank'} rel="noopener noreferrer" className="inline-flex h-10 items-center gap-1 rounded-xl border border-zinc-300 px-3 text-sm font-medium text-zinc-700 transition-colors hover:border-zinc-400 hover:bg-white dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-900">
                  {name}
                  {name !== 'Mail app' && <ExternalLink className="h-3.5 w-3.5 opacity-60" aria-hidden="true" />}
                </a>
              ))}
            </div>
          </div>

          {/* Inspector */}
          <aside className="space-y-5 border-t border-zinc-200 bg-zinc-50/60 p-4 dark:border-zinc-800 dark:bg-zinc-900/30 lg:border-l lg:border-t-0">
            <div className="hidden lg:block">
              <p className="mb-2 text-[12px] font-semibold uppercase tracking-[0.12em] text-zinc-500">Tone</p>
              <Segmented value={tone} options={TONES.map((t) => ({ id: t.id, label: t.name }))} onChange={setTone} label="Tone" />
              <p className="mt-1.5 text-[12.5px] text-zinc-500">{TONES.find((t) => t.id === tone)?.hint}. Your answers stay when you switch.</p>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-zinc-500">Blanks</p>
                <span className="font-mono text-[12px] text-zinc-500">{filledCount} of {blanks.length}</span>
              </div>
              <div className="mb-2 h-1.5 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
                <div className="h-full rounded-full bg-indigo-500 transition-all" style={{ width: `${blanks.length ? (filledCount / blanks.length) * 100 : 100}%` }} />
              </div>
              <ul className="flex flex-wrap gap-1.5">
                {blanks.map((b) => {
                  const done = !!values[b.key]?.trim();
                  return (
                    <li key={b.key}>
                      <button
                        type="button"
                        onClick={() => focusBlank(b.key)}
                        className={`rounded-full border px-2.5 py-1 text-[12px] transition-colors ${done ? 'border-indigo-200 bg-indigo-50 text-indigo-800 dark:border-indigo-500/30 dark:bg-indigo-500/10 dark:text-indigo-200' : 'border-amber-300 bg-amber-50 text-amber-900 hover:bg-amber-100 dark:border-amber-500/40 dark:bg-amber-500/10 dark:text-amber-200'}`}
                      >
                        {done && <Check className="-ml-0.5 mr-1 inline h-3 w-3" aria-hidden="true" />}
                        {b.key}
                      </button>
                    </li>
                  );
                })}
              </ul>
              {filledCount > 0 && (
                <button type="button" onClick={() => setValues(values['Your name'] ? { 'Your name': values['Your name'] } : {})} className="mt-2 inline-flex items-center gap-1 text-[12.5px] text-zinc-500 hover:text-zinc-900 dark:hover:text-white">
                  <RotateCcw className="h-3 w-3" aria-hidden="true" /> Clear blanks
                </button>
              )}
            </div>

            <div>
              <p className="mb-2 text-[12px] font-semibold uppercase tracking-[0.12em] text-zinc-500">Checks</p>
              <IssueList issues={writeIssues} empty={filledCount < blanks.length ? 'No other problems. Fill in the blanks that are left.' : 'No problems found in this email.'} />
            </div>

            <button type="button" onClick={() => sendToAi(`Subject: ${finalSubject}\n\n${finalBody}`)} className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl border border-zinc-300 bg-white px-3 py-2.5 text-sm font-medium text-zinc-800 transition-colors hover:border-indigo-400 hover:text-indigo-700 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-200 dark:hover:text-indigo-300">
              <Sparkles className="h-4 w-4" aria-hidden="true" /> Polish this with ChatGPT or Claude
            </button>
          </aside>
        </div>
      )}

      {/* CHECK */}
      {mode === 'check' && (
        <div className="grid lg:grid-cols-[minmax(0,1fr)_340px]">
          <div className="min-w-0">
            <div className="flex items-center gap-3 border-b border-zinc-200 px-4 dark:border-zinc-800 sm:px-6">
              <label htmlFor="ck-subject" className="w-14 shrink-0 text-sm text-zinc-500">Subject</label>
              <input id="ck-subject" value={ckSubject} onChange={(e) => setCkSubject(e.target.value)} placeholder="Paste or type the subject line" className="h-11 w-full min-w-0 bg-transparent text-[15px] font-medium text-zinc-900 outline-none placeholder:font-normal placeholder:text-zinc-400 dark:text-white" />
            </div>
            <label htmlFor="ck-body" className="sr-only">Email body</label>
            <textarea
              id="ck-body"
              value={ckBody}
              onChange={(e) => setCkBody(e.target.value)}
              placeholder="Paste your email draft here. Nothing is sent anywhere: the check runs in your browser."
              className="block min-h-[300px] w-full resize-y bg-transparent px-4 py-5 text-[15px] leading-7 text-zinc-800 outline-none placeholder:text-zinc-400 dark:text-zinc-200 sm:px-6"
            />
            {ckBody.trim() && marked.some((m) => m.severity) && (
              <div className="border-t border-zinc-200 px-4 py-4 dark:border-zinc-800 sm:px-6">
                <p className="mb-2 text-[12px] font-semibold uppercase tracking-[0.12em] text-zinc-500">Marked up</p>
                <p className="whitespace-pre-wrap break-words text-[14.5px] leading-7 text-zinc-700 dark:text-zinc-300">
                  {marked.map((m, i) => (m.severity ? <mark key={i} title={m.title} className={`rounded px-0.5 ${SEV_STYLE[m.severity].mark}`}>{m.text}</mark> : <span key={i}>{m.text}</span>))}
                </p>
              </div>
            )}
            <div className="flex flex-wrap items-center gap-2 border-t border-zinc-200 bg-zinc-50/70 px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900/40 sm:px-6">
              <button type="button" onClick={() => { setCkSubject(EXAMPLE_DRAFT.subject); setCkBody(EXAMPLE_DRAFT.body); }} className="inline-flex h-10 items-center rounded-xl border border-zinc-300 px-3 text-sm font-medium text-zinc-700 hover:bg-white dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-900">
                Load a weak example
              </button>
              {ckBody && (
                <button type="button" onClick={() => { setCkSubject(''); setCkBody(''); }} className="inline-flex h-10 items-center gap-1 rounded-xl px-3 text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-white">
                  <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" /> Clear
                </button>
              )}
              {ckBody.trim() && (
                <button type="button" onClick={() => sendToAi(`${ckSubject ? `Subject: ${ckSubject}\n\n` : ''}${ckBody}`)} className="inline-flex h-10 items-center gap-1.5 rounded-xl bg-indigo-600 px-4 text-sm font-semibold text-white hover:bg-indigo-700 sm:ml-auto">
                  <Sparkles className="h-4 w-4" aria-hidden="true" /> Rewrite with AI
                </button>
              )}
            </div>
          </div>
          <aside className="space-y-4 border-t border-zinc-200 bg-zinc-50/60 p-4 dark:border-zinc-800 dark:bg-zinc-900/30 lg:border-l lg:border-t-0" aria-live="polite">
            {ckBody.trim() || ckSubject.trim() ? (
              <>
                <div>
                  <p className="mb-2 text-[12px] font-semibold uppercase tracking-[0.12em] text-zinc-500">Result</p>
                  <Counts counts={ck.counts} />
                  <p className="mt-2 text-[12.5px] text-zinc-500">{ck.words} words, {ck.sentences} sentences</p>
                </div>
                <IssueList issues={ck.issues} empty="No problems found. Read it once more out loud before you send." />
              </>
            ) : (
              <div className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                <p className="font-semibold text-zinc-900 dark:text-white">What gets checked</p>
                <ul className="mt-2 space-y-1.5">
                  <li>Missing or vague subject line</li>
                  <li>Greeting and sign off</li>
                  <li>A clear next step for the reader</li>
                  <li>Stock phrases like &ldquo;just wanted to touch base&rdquo;</li>
                  <li>Softening words that make you sound unsure</li>
                  <li>Shouting, extra exclamation marks, long sentences</li>
                  <li>Blanks left in brackets and repeated words</li>
                </ul>
              </div>
            )}
          </aside>
        </div>
      )}

      {/* AI */}
      {mode === 'ai' && (
        <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <div className="min-w-0 space-y-4 p-4 sm:p-6">
            <Segmented value={task} options={[{ id: 'reply', label: 'Reply to an email' }, { id: 'rewrite', label: 'Rewrite my draft' }]} onChange={setTask} label="Task" />
            <div>
              <label htmlFor="ai-text" className="mb-1.5 block text-sm font-medium text-zinc-800 dark:text-zinc-200">
                {task === 'reply' ? 'The email you received' : 'Your draft'}
              </label>
              <textarea
                id="ai-text"
                value={aiText}
                onChange={(e) => setAiText(e.target.value)}
                rows={7}
                placeholder={task === 'reply' ? 'Paste the email you want to answer' : 'Paste the email you want improved'}
                className="block w-full resize-y rounded-xl border border-zinc-300 bg-white px-3 py-2.5 text-[15px] leading-relaxed text-zinc-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
              />
            </div>
            <div>
              <p className="mb-1.5 text-sm font-medium text-zinc-800 dark:text-zinc-200">{task === 'reply' ? 'What do you want to say?' : 'What should change?'}</p>
              <div className="flex flex-wrap gap-1.5">
                {(task === 'reply' ? REPLY_GOALS : REWRITE_GOALS).map((g) => {
                  const on = task === 'reply' ? replyGoal === g.id : rewriteGoals.includes(g.id);
                  return (
                    <button
                      key={g.id}
                      type="button"
                      aria-pressed={on}
                      onClick={() => (task === 'reply' ? setReplyGoal(g.id) : setRewriteGoals((prev) => (prev.includes(g.id) ? prev.filter((x) => x !== g.id) : [...prev, g.id])))}
                      className={`rounded-full border px-3 py-1.5 text-[13px] font-medium transition-colors ${on ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-zinc-300 text-zinc-700 hover:border-zinc-400 dark:border-zinc-700 dark:text-zinc-300'}`}
                    >
                      {g.label}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="mb-1.5 text-sm font-medium text-zinc-800 dark:text-zinc-200">Tone</p>
                <Segmented value={aiTone} options={TONES.map((t) => ({ id: t.id, label: t.name }))} onChange={setAiTone} label="Tone" size="sm" />
              </div>
              <div>
                <p className="mb-1.5 text-sm font-medium text-zinc-800 dark:text-zinc-200">Length</p>
                <Segmented value={length} options={LENGTHS} onChange={setLength} label="Length" size="sm" />
              </div>
            </div>
            <div>
              <label htmlFor="ai-notes" className="mb-1.5 block text-sm font-medium text-zinc-800 dark:text-zinc-200">
                {task === 'reply' ? 'Points to include (optional)' : 'Anything else (optional)'}
              </label>
              <input
                id="ai-notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={task === 'reply' ? 'For example: I can do Thursday after 2pm' : 'For example: keep the part about the budget'}
                className="h-11 w-full rounded-xl border border-zinc-300 bg-white px-3 text-[15px] text-zinc-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
              />
            </div>
          </div>
          <div className="min-w-0 border-t border-zinc-200 bg-zinc-50/60 p-4 dark:border-zinc-800 dark:bg-zinc-900/30 sm:p-6 lg:border-l lg:border-t-0">
            <p className="mb-2 text-[12px] font-semibold uppercase tracking-[0.12em] text-zinc-500">Your prompt</p>
            <pre className="max-h-80 overflow-auto whitespace-pre-wrap break-words rounded-xl border border-zinc-200 bg-white p-3.5 font-mono text-[12.5px] leading-relaxed text-zinc-700 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300">{prompt}</pre>
            <div className="mt-3 flex flex-wrap gap-2">
              {aiLinks ? (
                <>
                  <a href={aiLinks.chatgpt} target="_blank" rel="noopener noreferrer" className="inline-flex h-10 items-center gap-1.5 rounded-xl bg-zinc-900 px-4 text-sm font-semibold text-white hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200">
                    Open in ChatGPT <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                  </a>
                  <a href={aiLinks.claude} target="_blank" rel="noopener noreferrer" className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-zinc-300 px-4 text-sm font-semibold text-zinc-800 hover:bg-white dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-900">
                    Open in Claude <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                  </a>
                </>
              ) : (
                <p className="w-full text-[13px] text-zinc-500">
                  {aiText.trim().length < 20 ? 'Paste an email on the left to build the prompt.' : 'This prompt is too long to open in a link. Copy it and paste it into ChatGPT, Claude or Gemini.'}
                </p>
              )}
              <button type="button" disabled={aiText.trim().length < 20} onClick={() => copy('prompt', prompt)} className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-zinc-300 px-4 text-sm font-medium text-zinc-700 hover:bg-white disabled:opacity-40 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-900">
                {copied === 'prompt' ? <Check className="h-4 w-4 text-indigo-600" aria-hidden="true" /> : <ClipboardCopy className="h-4 w-4" aria-hidden="true" />}
                {copied === 'prompt' ? 'Copied' : 'Copy prompt'}
              </button>
            </div>
            <p className="mt-3 text-[12.5px] leading-relaxed text-zinc-500">
              The open buttons put your text into the ChatGPT or Claude address bar, and it is then handled under that service&rsquo;s privacy rules. Remove private details first if you need to. Always read the AI&rsquo;s answer before you send it.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
