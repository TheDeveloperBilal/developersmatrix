'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  BadgeCheck,
  Briefcase,
  Check,
  ClipboardList,
  Copy,
  Download,
  FileText,
  FolderGit2,
  GraduationCap,
  Plus,
  RotateCcw,
  ScanSearch,
  Sparkles,
  Trash2,
  User,
  Wrench,
  X,
} from 'lucide-react';
import ResumeSheet, { resumeToText } from './ResumeSheet';
import { RESUME_CSS, SHEET_HEIGHT, SHEET_WIDTH, TEMPLATES } from '@/lib/resume/templates';
import { checkResume, matchJob, type Finding } from '@/lib/resume/check';
import { draftSummary } from '@/lib/resume/summary';
import {
  ACCENTS,
  EMPTY_RESUME,
  EXAMPLE_RESUME,
  bulletLines,
  emptyProject,
  emptyRole,
  emptySchool,
  type Resume,
  type Role,
} from '@/lib/resume/types';

/* ------------------------------------------------------------------ */
/* Look and feel: a writing studio. Dark toolbar, quiet stone panels,  */
/* and the resume shown as real paper on a dotted desk.                */
/* ------------------------------------------------------------------ */

const field =
  'w-full rounded-lg border border-stone-300 bg-white px-3 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 ' +
  'focus:border-stone-900 focus:ring-2 focus:ring-stone-900/10 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100 dark:focus:border-stone-300';

const label = 'mb-1 block text-[12.5px] font-medium text-stone-700 dark:text-stone-300';

const STORAGE_KEY = 'dm-resume-builder-v2';

type SectionKey = 'contact' | 'summary' | 'experience' | 'projects' | 'education' | 'skills' | 'review' | 'match';

const SECTIONS: { key: SectionKey; name: string; icon: typeof User }[] = [
  { key: 'contact', name: 'Contact', icon: User },
  { key: 'summary', name: 'Summary', icon: FileText },
  { key: 'experience', name: 'Experience', icon: Briefcase },
  { key: 'projects', name: 'Projects', icon: FolderGit2 },
  { key: 'education', name: 'Education', icon: GraduationCap },
  { key: 'skills', name: 'Skills', icon: Wrench },
  { key: 'review', name: 'Resume check', icon: ScanSearch },
  { key: 'match', name: 'Match a job', icon: ClipboardList },
];

const AREA_TO_SECTION: Record<Finding['area'], SectionKey> = {
  Contact: 'contact',
  Summary: 'summary',
  Experience: 'experience',
  Projects: 'projects',
  Education: 'education',
  Skills: 'skills',
  Overall: 'review',
};

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/* ------------------------------------------------------------------ */
/* Small building blocks                                               */
/* ------------------------------------------------------------------ */

function Field({ id, text, children, hint }: { id: string; text: string; children: React.ReactNode; hint?: string }) {
  return (
    <div className="min-w-0">
      <label htmlFor={id} className={label}>
        {text}
      </label>
      {children}
      {hint && <p className="mt-1 text-[11.5px] text-stone-500 dark:text-stone-400">{hint}</p>}
    </div>
  );
}

function MonthPicker({ id, value, onChange, disabled }: { id: string; value: string; onChange: (v: string) => void; disabled?: boolean }) {
  const [y, m] = value ? value.split('-') : ['', ''];
  const thisYear = new Date().getFullYear();
  const years = Array.from({ length: 50 }, (_, i) => String(thisYear + 4 - i));
  const set = (ny: string, nm: string) => onChange(ny && nm ? `${ny}-${nm}` : ny ? `${ny}-01` : '');
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] gap-1.5">
      <select
        id={id}
        aria-label="Month"
        disabled={disabled}
        value={m || ''}
        onChange={(e) => set(y || String(thisYear), e.target.value)}
        className={`${field} h-10 disabled:opacity-40`}
      >
        <option value="">Month</option>
        {MONTHS.map((name, i) => (
          <option key={name} value={String(i + 1).padStart(2, '0')}>
            {name}
          </option>
        ))}
      </select>
      <select aria-label="Year" disabled={disabled} value={y || ''} onChange={(e) => set(e.target.value, m || '01')} className={`${field} h-10 disabled:opacity-40`}>
        <option value="">Year</option>
        {years.map((yr) => (
          <option key={yr} value={yr}>
            {yr}
          </option>
        ))}
      </select>
    </div>
  );
}

const WEAK = /^(responsible for|worked on|working on|helped|assisted|involved in|participated in|tasked with|duties included|in charge of)\b/i;

/** Live notes under a bullets box, one per line that needs attention. */
function BulletNotes({ text }: { text: string }) {
  const lines = bulletLines(text);
  const notes = lines
    .map((line, i) => {
      const issues: string[] = [];
      if (WEAK.test(line)) issues.push('weak opener');
      if (!/\d/.test(line)) issues.push('no number');
      const n = line.split(/\s+/).length;
      if (n < 6) issues.push('too thin');
      if (n > 35) issues.push('too long');
      return { i, line, issues };
    })
    .filter((x) => x.issues.length > 0);
  if (lines.length === 0) return null;
  if (notes.length === 0)
    return (
      <p className="mt-1.5 flex items-center gap-1.5 text-[11.5px] text-emerald-700 dark:text-emerald-400">
        <Check className="h-3.5 w-3.5" aria-hidden="true" /> {lines.length} bullet{lines.length === 1 ? '' : 's'}, all specific.
      </p>
    );
  return (
    <ul className="mt-1.5 space-y-1">
      {notes.slice(0, 4).map((n) => (
        <li key={n.i} className="flex min-w-0 items-start gap-2 text-[11.5px] text-stone-600 dark:text-stone-400">
          <span className="mt-px shrink-0 rounded bg-amber-100 px-1.5 py-px font-medium text-amber-800 dark:bg-amber-500/15 dark:text-amber-300">
            Line {n.i + 1}
          </span>
          <span className="min-w-0">
            {n.issues.join(', ')}
            <span className="block truncate text-stone-400">{n.line}</span>
          </span>
        </li>
      ))}
    </ul>
  );
}

function ScoreDial({ score, size = 44 }: { score: number; size?: number }) {
  const r = size / 2 - 4;
  const c = 2 * Math.PI * r;
  const color = score >= 85 ? '#34d399' : score >= 65 ? '#fbbf24' : '#fb7185';
  return (
    <span className="relative inline-flex shrink-0 items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90" aria-hidden="true">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="currentColor" strokeOpacity={0.15} strokeWidth={4} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={4} strokeLinecap="round" strokeDasharray={`${(c * score) / 100} ${c}`} className="transition-[stroke-dasharray] duration-500" />
      </svg>
      <span className="absolute text-[12px] font-semibold tabular-nums">{score}</span>
    </span>
  );
}

function SectionHeader({ n, title, desc }: { n: number; title: string; desc: string }) {
  return (
    <div className="mb-5">
      <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-stone-400">Step {n} of 6</p>
      <h3 className="mt-1 text-xl font-semibold tracking-tight text-stone-900 dark:text-stone-50">{title}</h3>
      <p className="mt-1 text-sm text-stone-600 dark:text-stone-400">{desc}</p>
    </div>
  );
}

function CardShell({ children, onRemove, onUp, onDown, title }: { children: React.ReactNode; onRemove: () => void; onUp?: () => void; onDown?: () => void; title: string }) {
  return (
    <div className="rounded-xl border border-stone-200 bg-stone-50/60 p-4 dark:border-stone-800 dark:bg-stone-900/40">
      <div className="mb-3 flex items-center justify-between gap-2">
        <p className="min-w-0 truncate text-sm font-semibold text-stone-800 dark:text-stone-200">{title}</p>
        <div className="flex shrink-0 items-center gap-1">
          {onUp && (
            <button type="button" onClick={onUp} aria-label="Move up" className="rounded-md p-1.5 text-stone-500 hover:bg-stone-200/70 hover:text-stone-900 dark:hover:bg-stone-800">
              <ArrowUp className="h-3.5 w-3.5" />
            </button>
          )}
          {onDown && (
            <button type="button" onClick={onDown} aria-label="Move down" className="rounded-md p-1.5 text-stone-500 hover:bg-stone-200/70 hover:text-stone-900 dark:hover:bg-stone-800">
              <ArrowDown className="h-3.5 w-3.5" />
            </button>
          )}
          <button type="button" onClick={onRemove} aria-label="Remove" className="rounded-md p-1.5 text-stone-500 hover:bg-rose-100 hover:text-rose-700 dark:hover:bg-rose-500/15">
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
      {children}
    </div>
  );
}

function move<T>(list: T[], i: number, d: number): T[] {
  const j = i + d;
  if (j < 0 || j >= list.length) return list;
  const next = [...list];
  [next[i], next[j]] = [next[j], next[i]];
  return next;
}

/* ------------------------------------------------------------------ */
/* Main component                                                      */
/* ------------------------------------------------------------------ */

export default function ResumeBuilderClient() {
  const [resume, setResume] = useState<Resume>(EMPTY_RESUME);
  const [section, setSection] = useState<SectionKey>('contact');
  const [mode, setMode] = useState<'edit' | 'preview'>('edit');
  const [savedAt, setSavedAt] = useState<Date | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const [copied, setCopied] = useState(false);
  const [skillDraft, setSkillDraft] = useState('');
  const [posting, setPosting] = useState('');
  const [suggestion, setSuggestion] = useState<{ text: string; missing: string[] } | null>(null);

  const deskRef = useRef<HTMLDivElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const editorTopRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.6);
  const [sheetHeight, setSheetHeight] = useState(SHEET_HEIGHT);

  /* ---------- restore and autosave on this device ---------- */
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw) as Resume;
        if (saved && saved.contact && Array.isArray(saved.roles)) setResume({ ...EMPTY_RESUME, ...saved });
      }
    } catch {
      /* storage blocked or corrupt */
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    const t = window.setTimeout(() => {
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(resume));
        setSavedAt(new Date());
      } catch {
        /* ignore */
      }
    }, 400);
    return () => window.clearTimeout(t);
  }, [resume, loaded]);

  /* ---------- scale the A4 sheet to the desk width ---------- */
  useEffect(() => {
    const desk = deskRef.current;
    if (!desk) return;
    const update = () => {
      const w = desk.clientWidth - 32;
      setScale(Math.max(0.3, Math.min(1, w / SHEET_WIDTH)));
      if (sheetRef.current) setSheetHeight(sheetRef.current.scrollHeight);
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(desk);
    if (sheetRef.current) ro.observe(sheetRef.current);
    return () => ro.disconnect();
  }, [mode]);

  useEffect(() => {
    if (sheetRef.current) setSheetHeight(sheetRef.current.scrollHeight);
  }, [resume]);

  const pages = Math.max(1, Math.ceil((sheetHeight - 4) / SHEET_HEIGHT));
  const check = useMemo(() => checkResume(resume, { pages }), [resume, pages]);
  const match = useMemo(() => matchJob(resume, posting), [resume, posting]);
  const fixes = check.findings.filter((f) => f.severity === 'fix');
  const improves = check.findings.filter((f) => f.severity === 'improve');
  const goods = check.findings.filter((f) => f.severity === 'good');

  /* ---------- updates ---------- */
  const update = useCallback(<K extends keyof Resume>(key: K, value: Resume[K]) => setResume((r) => ({ ...r, [key]: value })), []);
  const setContact = (k: keyof Resume['contact'], v: string) => setResume((r) => ({ ...r, contact: { ...r.contact, [k]: v } }));
  const setRole = (id: string, patch: Partial<Role>) => setResume((r) => ({ ...r, roles: r.roles.map((x) => (x.id === id ? { ...x, ...patch } : x)) }));

  const go = (key: SectionKey) => {
    setSection(key);
    setMode('edit');
    requestAnimationFrame(() => {
      const el = editorTopRef.current;
      if (el && el.getBoundingClientRect().top < 0) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };

  const stepKeys = SECTIONS.map((s) => s.key);
  const idx = stepKeys.indexOf(section);

  const addSkill = (raw: string) => {
    const items = raw
      .split(/[,;\n]+/)
      .map((s) => s.trim().replace(/\s+/g, ' '))
      .filter((s) => s.length > 0 && s.length <= 40);
    if (items.length === 0) return;
    setResume((r) => {
      const have = new Set(r.skills.map((s) => s.toLowerCase()));
      const next = [...r.skills];
      for (const s of items) if (!have.has(s.toLowerCase())) next.push(s);
      return { ...r, skills: next };
    });
    setSkillDraft('');
  };

  /* ---------- export ---------- */
  const fileName = (resume.contact.name.trim() || 'resume').replace(/[^\w\s]/g, '').trim().replace(/\s+/g, ' ');

  const downloadPdf = () => {
    const sheet = sheetRef.current;
    if (!sheet) return;
    const frame = document.createElement('iframe');
    frame.setAttribute('aria-hidden', 'true');
    frame.style.cssText = 'position:fixed;right:0;bottom:0;width:0;height:0;border:0;';
    document.body.appendChild(frame);
    const doc = frame.contentDocument;
    if (!doc) return;
    doc.open();
    doc.write(`<!doctype html><html><head><meta charset="utf-8"><title>${fileName} Resume</title><style>${RESUME_CSS}</style></head><body>${sheet.outerHTML}</body></html>`);
    doc.close();
    window.setTimeout(() => {
      frame.contentWindow?.focus();
      frame.contentWindow?.print();
      window.setTimeout(() => frame.remove(), 1500);
    }, 200);
  };

  const copyText = async () => {
    const text = resumeToText(resume);
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      ta.remove();
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  const downloadTxt = () => {
    const blob = new Blob([resumeToText(resume)], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileName.toLowerCase().replace(/\s+/g, '-')}-resume.txt`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const sectionDone = (key: SectionKey): boolean => {
    const r = resume;
    switch (key) {
      case 'contact':
        return !!(r.contact.name.trim() && r.contact.email.trim());
      case 'summary':
        return r.summary.trim().split(/\s+/).length >= 20;
      case 'experience':
        return r.roles.some((x) => x.title.trim() && bulletLines(x.bullets).length >= 2);
      case 'projects':
        return r.projects.some((x) => x.name.trim());
      case 'education':
        return r.education.some((x) => x.school.trim());
      case 'skills':
        return r.skills.length >= 5;
      default:
        return false;
    }
  };

  const issuesIn = (key: SectionKey) => check.findings.filter((f) => f.severity !== 'good' && AREA_TO_SECTION[f.area] === key).length;

  /* ------------------------------------------------------------------ */

  return (
    <div className="overflow-hidden rounded-[28px] border border-stone-200 bg-white shadow-[0_40px_120px_-70px_rgba(28,25,23,0.65)] dark:border-stone-800 dark:bg-stone-950">
      {/* ================= Toolbar ================= */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-3 bg-stone-950 px-4 py-3 text-stone-100 sm:px-5">
        <div className="flex min-w-0 flex-wrap items-center gap-2">
          <div role="radiogroup" aria-label="Template" className="flex rounded-lg bg-white/[0.07] p-0.5">
            {TEMPLATES.map((t) => (
              <button
                key={t.key}
                type="button"
                role="radio"
                aria-checked={resume.template === t.key}
                title={t.note}
                onClick={() => update('template', t.key)}
                className={`rounded-md px-2.5 py-1.5 text-xs font-medium transition ${resume.template === t.key ? 'bg-white text-stone-950' : 'text-stone-300 hover:text-white'}`}
              >
                {t.name}
              </button>
            ))}
          </div>
          <div role="radiogroup" aria-label="Accent colour" className="flex items-center gap-1.5 pl-1">
            {ACCENTS.map((a) => (
              <button
                key={a}
                type="button"
                role="radio"
                aria-checked={resume.accent === a}
                aria-label={`Accent ${a}`}
                onClick={() => update('accent', a)}
                className={`h-5 w-5 rounded-full ring-offset-2 ring-offset-stone-950 transition ${resume.accent === a ? 'ring-2 ring-white' : 'ring-1 ring-white/25 hover:ring-white/60'}`}
                style={{ backgroundColor: a === '#0f172a' ? '#475569' : a }}
              />
            ))}
          </div>
        </div>

        <div className="ml-auto flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => go('review')}
            className="flex items-center gap-2 rounded-lg px-2 py-1 text-left text-xs text-stone-300 transition hover:bg-white/[0.07]"
          >
            <ScoreDial score={check.score} size={36} />
            <span className="hidden sm:block">
              <span className="block font-medium text-white">Resume check</span>
              {fixes.length > 0 ? `${fixes.length} to fix` : improves.length > 0 ? `${improves.length} to improve` : 'Looking good'}
            </span>
          </button>
          <button type="button" onClick={copyText} className="inline-flex h-9 items-center gap-1.5 rounded-lg px-3 text-xs font-medium text-stone-200 ring-1 ring-white/15 transition hover:bg-white/[0.07]">
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" aria-hidden="true" /> : <Copy className="h-3.5 w-3.5" aria-hidden="true" />}
            {copied ? 'Copied' : 'Copy text'}
          </button>
          <button type="button" onClick={downloadPdf} className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-white px-3.5 text-xs font-semibold text-stone-950 transition hover:bg-stone-200">
            <Download className="h-3.5 w-3.5" aria-hidden="true" /> Download PDF
          </button>
        </div>
      </div>

      {/* ================= Mobile mode switch ================= */}
      <div className="flex items-center gap-2 border-b border-stone-200 bg-stone-50 px-3 py-2 dark:border-stone-800 dark:bg-stone-900 lg:hidden">
        <div role="tablist" aria-label="View" className="grid flex-1 grid-cols-2 rounded-lg bg-stone-200/70 p-0.5 dark:bg-stone-800">
          {(['edit', 'preview'] as const).map((m) => (
            <button
              key={m}
              role="tab"
              aria-selected={mode === m}
              onClick={() => setMode(m)}
              className={`rounded-md py-1.5 text-sm font-medium transition ${mode === m ? 'bg-white text-stone-900 shadow-sm dark:bg-stone-700 dark:text-white' : 'text-stone-600 dark:text-stone-400'}`}
            >
              {m === 'edit' ? 'Edit' : `Preview${pages > 1 ? ` (${pages} pages)` : ''}`}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[216px_minmax(0,1fr)_minmax(0,1.05fr)]">
        {/* ================= Section rail (desktop) ================= */}
        <nav aria-label="Resume sections" className="hidden border-r border-stone-200 bg-stone-50/70 p-3 dark:border-stone-800 dark:bg-stone-900/50 lg:block">
          <div className="sticky top-24">
          <ol className="space-y-0.5">
            {SECTIONS.map((s, i) => {
              const active = section === s.key;
              const done = sectionDone(s.key);
              const issues = issuesIn(s.key);
              const Icon = s.icon;
              return (
                <li key={s.key}>
                  {i === 6 && <div className="my-2 border-t border-stone-200 dark:border-stone-800" aria-hidden="true" />}
                  <button
                    type="button"
                    onClick={() => go(s.key)}
                    aria-current={active ? 'step' : undefined}
                    className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm transition ${active ? 'bg-white font-semibold text-stone-950 shadow-sm ring-1 ring-stone-200 dark:bg-stone-800 dark:text-white dark:ring-stone-700' : 'text-stone-600 hover:bg-white/70 hover:text-stone-900 dark:text-stone-400 dark:hover:bg-stone-800/60'}`}
                  >
                    <Icon className="h-4 w-4 shrink-0 opacity-70" aria-hidden="true" />
                    <span className="min-w-0 flex-1 truncate">{s.name}</span>
                    {s.key === 'review' ? (
                      <span className="text-[11px] tabular-nums text-stone-500">{check.score}</span>
                    ) : issues > 0 && i < 6 ? (
                      <span className="rounded-full bg-amber-100 px-1.5 text-[10.5px] font-semibold text-amber-800 dark:bg-amber-500/15 dark:text-amber-300">{issues}</span>
                    ) : done ? (
                      <BadgeCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" aria-label="Done" />
                    ) : null}
                  </button>
                </li>
              );
            })}
          </ol>
          <div className="mt-4 space-y-1 border-t border-stone-200 pt-3 text-[11.5px] text-stone-500 dark:border-stone-800">
            <p>{savedAt ? 'Saved on this device' : 'Not saved yet'}</p>
            <p>Nothing is sent to our server.</p>
          </div>
          </div>
        </nav>

        {/* ================= Editor ================= */}
        <section aria-label="Editor" className={`${mode === 'preview' ? 'hidden' : 'block'} min-w-0 border-stone-200 dark:border-stone-800 lg:block lg:border-r`}>
          <div ref={editorTopRef} className="scroll-mt-24" />
          {/* Section chips on small screens */}
          <div className="border-b border-stone-200 px-3 py-2.5 dark:border-stone-800 lg:hidden">
            <div className="flex flex-wrap gap-1.5">
              {SECTIONS.map((s) => (
                <button
                  key={s.key}
                  type="button"
                  onClick={() => go(s.key)}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${section === s.key ? 'bg-stone-900 text-white dark:bg-white dark:text-stone-900' : 'bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300'}`}
                >
                  {s.key === 'review' ? `Check ${check.score}` : s.name}
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 sm:p-6">
            {section === 'contact' && (
              <div>
                <SectionHeader n={1} title="Contact details" desc="How recruiters reach you. Use the name and email you want on the offer letter." />
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field id="rb-name" text="Full name">
                    <input id="rb-name" value={resume.contact.name} onChange={(e) => setContact('name', e.target.value)} placeholder="Sara Malik" autoComplete="name" className={`${field} h-10`} />
                  </Field>
                  <Field id="rb-headline" text="Headline" hint="The job you are going for.">
                    <input id="rb-headline" value={resume.contact.headline} onChange={(e) => setContact('headline', e.target.value)} placeholder="Frontend Engineer" className={`${field} h-10`} />
                  </Field>
                  <Field id="rb-email" text="Email">
                    <input id="rb-email" type="email" value={resume.contact.email} onChange={(e) => setContact('email', e.target.value)} placeholder="you@email.com" autoComplete="email" className={`${field} h-10`} />
                  </Field>
                  <Field id="rb-phone" text="Phone">
                    <input id="rb-phone" type="tel" value={resume.contact.phone} onChange={(e) => setContact('phone', e.target.value)} placeholder="+1 555 010 0142" autoComplete="tel" className={`${field} h-10`} />
                  </Field>
                  <Field id="rb-location" text="City and country">
                    <input id="rb-location" value={resume.contact.location} onChange={(e) => setContact('location', e.target.value)} placeholder="Austin, TX" autoComplete="address-level2" className={`${field} h-10`} />
                  </Field>
                  <Field id="rb-linkedin" text="LinkedIn">
                    <input id="rb-linkedin" value={resume.contact.linkedin} onChange={(e) => setContact('linkedin', e.target.value)} placeholder="linkedin.com/in/you" className={`${field} h-10`} />
                  </Field>
                  <div className="sm:col-span-2">
                    <Field id="rb-website" text="GitHub or portfolio">
                      <input id="rb-website" value={resume.contact.website} onChange={(e) => setContact('website', e.target.value)} placeholder="github.com/you" className={`${field} h-10`} />
                    </Field>
                  </div>
                </div>
              </div>
            )}

            {section === 'summary' && (
              <div>
                <SectionHeader n={2} title="Summary" desc="Two or three sentences: who you are, what you build, and one result. No I or my." />
                <Field id="rb-summary" text="Professional summary">
                  <textarea
                    id="rb-summary"
                    value={resume.summary}
                    onChange={(e) => update('summary', e.target.value)}
                    rows={5}
                    placeholder="Frontend engineer with five years of experience building fast, accessible React apps. Most recently cut checkout drop off from 38% to 21%."
                    className={`${field} block resize-y py-2.5 leading-relaxed`}
                  />
                </Field>
                <p className="mt-1.5 text-[11.5px] tabular-nums text-stone-500">{resume.summary.trim() ? resume.summary.trim().split(/\s+/).length : 0} words, aim for 30 to 70</p>

                <div className="mt-5 rounded-xl border border-dashed border-stone-300 p-4 dark:border-stone-700">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-stone-900 dark:text-stone-100">Summary helper</p>
                      <p className="text-xs text-stone-500">Builds a draft from your headline, dates, skills and best result. Nothing is made up.</p>
                    </div>
                    <button type="button" onClick={() => setSuggestion(draftSummary(resume))} className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-stone-900 px-3 text-xs font-semibold text-white hover:bg-stone-800 dark:bg-white dark:text-stone-900">
                      <Sparkles className="h-3.5 w-3.5" aria-hidden="true" /> Draft from my details
                    </button>
                  </div>
                  {suggestion && (
                    <div className="mt-3">
                      {suggestion.text ? (
                        <p className="rounded-lg bg-stone-50 p-3 text-sm leading-relaxed text-stone-800 dark:bg-stone-900 dark:text-stone-200">{suggestion.text}</p>
                      ) : null}
                      {suggestion.missing.length > 0 && (
                        <p className="mt-2 text-xs text-amber-800 dark:text-amber-300">To make it stronger, add {suggestion.missing.join(', ')} first.</p>
                      )}
                      {suggestion.text && (
                        <div className="mt-2 flex gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              update('summary', suggestion.text);
                              setSuggestion(null);
                            }}
                            className="inline-flex h-8 items-center gap-1 rounded-lg bg-emerald-600 px-3 text-xs font-semibold text-white hover:bg-emerald-700"
                          >
                            <Check className="h-3.5 w-3.5" aria-hidden="true" /> Use this
                          </button>
                          <button type="button" onClick={() => setSuggestion(null)} className="h-8 rounded-lg px-3 text-xs font-medium text-stone-600 hover:bg-stone-100 dark:text-stone-300 dark:hover:bg-stone-800">
                            Dismiss
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {section === 'experience' && (
              <div>
                <SectionHeader n={3} title="Experience" desc="Most recent first. One result per line, starting with a verb and ending with what changed." />
                <div className="space-y-3">
                  {resume.roles.map((role, i) => (
                    <CardShell
                      key={role.id}
                      title={role.title || role.company ? [role.title, role.company].filter(Boolean).join(' at ') : `Role ${i + 1}`}
                      onRemove={() => update('roles', resume.roles.filter((x) => x.id !== role.id))}
                      onUp={i > 0 ? () => update('roles', move(resume.roles, i, -1)) : undefined}
                      onDown={i < resume.roles.length - 1 ? () => update('roles', move(resume.roles, i, 1)) : undefined}
                    >
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <Field id={`rt-${role.id}`} text="Job title">
                          <input id={`rt-${role.id}`} value={role.title} onChange={(e) => setRole(role.id, { title: e.target.value })} placeholder="Frontend Engineer" className={`${field} h-10`} />
                        </Field>
                        <Field id={`rc-${role.id}`} text="Company">
                          <input id={`rc-${role.id}`} value={role.company} onChange={(e) => setRole(role.id, { company: e.target.value })} placeholder="Brightcart" className={`${field} h-10`} />
                        </Field>
                        <Field id={`rs-${role.id}`} text="Started">
                          <MonthPicker id={`rs-${role.id}`} value={role.start} onChange={(v) => setRole(role.id, { start: v })} />
                        </Field>
                        <Field id={`re-${role.id}`} text="Ended">
                          <MonthPicker id={`re-${role.id}`} value={role.end} disabled={role.current} onChange={(v) => setRole(role.id, { end: v })} />
                        </Field>
                        <label className="flex items-center gap-2 text-sm text-stone-700 dark:text-stone-300 sm:col-span-2">
                          <input type="checkbox" checked={role.current} onChange={(e) => setRole(role.id, { current: e.target.checked, end: e.target.checked ? '' : role.end })} className="h-4 w-4 rounded border-stone-300 accent-stone-900" />
                          I work here now
                        </label>
                        <div className="sm:col-span-2">
                          <Field id={`rl-${role.id}`} text="Location">
                            <input id={`rl-${role.id}`} value={role.location} onChange={(e) => setRole(role.id, { location: e.target.value })} placeholder="Austin, TX or Remote" className={`${field} h-10`} />
                          </Field>
                        </div>
                        <div className="sm:col-span-2">
                          <Field id={`rb-${role.id}`} text="What you did, one result per line">
                            <textarea
                              id={`rb-${role.id}`}
                              value={role.bullets}
                              onChange={(e) => setRole(role.id, { bullets: e.target.value })}
                              rows={4}
                              placeholder={'Rebuilt the checkout flow in React, cutting drop off from 38% to 21%\nLed the move to Vite, making builds four times faster for 30 engineers'}
                              className={`${field} block min-h-[6.5rem] resize-y py-2.5 leading-relaxed [field-sizing:content]`}
                            />
                          </Field>
                          <BulletNotes text={role.bullets} />
                        </div>
                      </div>
                    </CardShell>
                  ))}
                </div>
                <button type="button" onClick={() => update('roles', [...resume.roles, emptyRole()])} className="mt-3 inline-flex h-10 w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-stone-300 text-sm font-medium text-stone-700 hover:border-stone-500 hover:bg-stone-50 dark:border-stone-700 dark:text-stone-300 dark:hover:bg-stone-900">
                  <Plus className="h-4 w-4" aria-hidden="true" /> Add another role
                </button>
                <details className="mt-4 rounded-xl bg-stone-50 p-3 text-sm dark:bg-stone-900">
                  <summary className="cursor-pointer font-medium text-stone-800 dark:text-stone-200">Strong verbs to start a line</summary>
                  <p className="mt-2 text-stone-600 dark:text-stone-400">Built, Led, Designed, Shipped, Reduced, Increased, Cut, Launched, Automated, Migrated, Improved, Owned, Rebuilt, Scaled, Mentored, Delivered, Introduced, Grew, Saved.</p>
                </details>
              </div>
            )}

            {section === 'projects' && (
              <div>
                <SectionHeader n={4} title="Projects" desc="Side projects, open source or coursework. Most useful when you are early in your career." />
                <div className="space-y-3">
                  {resume.projects.length === 0 && <p className="rounded-xl bg-stone-50 p-4 text-sm text-stone-600 dark:bg-stone-900 dark:text-stone-400">No projects yet. Optional, but one real project with a link can carry a junior resume.</p>}
                  {resume.projects.map((p, i) => (
                    <CardShell
                      key={p.id}
                      title={p.name || `Project ${i + 1}`}
                      onRemove={() => update('projects', resume.projects.filter((x) => x.id !== p.id))}
                      onUp={i > 0 ? () => update('projects', move(resume.projects, i, -1)) : undefined}
                      onDown={i < resume.projects.length - 1 ? () => update('projects', move(resume.projects, i, 1)) : undefined}
                    >
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <Field id={`pn-${p.id}`} text="Project name">
                          <input id={`pn-${p.id}`} value={p.name} onChange={(e) => update('projects', resume.projects.map((x) => (x.id === p.id ? { ...x, name: e.target.value } : x)))} placeholder="Pocket Budget" className={`${field} h-10`} />
                        </Field>
                        <Field id={`pt-${p.id}`} text="Built with">
                          <input id={`pt-${p.id}`} value={p.tech} onChange={(e) => update('projects', resume.projects.map((x) => (x.id === p.id ? { ...x, tech: e.target.value } : x)))} placeholder="React Native, Supabase" className={`${field} h-10`} />
                        </Field>
                        <div className="sm:col-span-2">
                          <Field id={`pl-${p.id}`} text="Link">
                            <input id={`pl-${p.id}`} value={p.link} onChange={(e) => update('projects', resume.projects.map((x) => (x.id === p.id ? { ...x, link: e.target.value } : x)))} placeholder="github.com/you/project" className={`${field} h-10`} />
                          </Field>
                        </div>
                        <div className="sm:col-span-2">
                          <Field id={`pb-${p.id}`} text="What it does and the result, one per line">
                            <textarea
                              id={`pb-${p.id}`}
                              value={p.bullets}
                              onChange={(e) => update('projects', resume.projects.map((x) => (x.id === p.id ? { ...x, bullets: e.target.value } : x)))}
                              rows={3}
                              placeholder="Budgeting app with offline sync, used by around 1,200 people each month"
                              className={`${field} block min-h-[5rem] resize-y py-2.5 leading-relaxed [field-sizing:content]`}
                            />
                          </Field>
                          <BulletNotes text={p.bullets} />
                        </div>
                      </div>
                    </CardShell>
                  ))}
                </div>
                <button type="button" onClick={() => update('projects', [...resume.projects, emptyProject()])} className="mt-3 inline-flex h-10 w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-stone-300 text-sm font-medium text-stone-700 hover:border-stone-500 hover:bg-stone-50 dark:border-stone-700 dark:text-stone-300 dark:hover:bg-stone-900">
                  <Plus className="h-4 w-4" aria-hidden="true" /> Add a project
                </button>
              </div>
            )}

            {section === 'education' && (
              <div>
                <SectionHeader n={5} title="Education" desc="Degrees, bootcamps or serious courses. Leave out school grades unless you graduated recently." />
                <div className="space-y-3">
                  {resume.education.map((s, i) => (
                    <CardShell key={s.id} title={s.school || `Education ${i + 1}`} onRemove={() => update('education', resume.education.filter((x) => x.id !== s.id))}>
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div className="sm:col-span-2">
                          <Field id={`es-${s.id}`} text="School or provider">
                            <input id={`es-${s.id}`} value={s.school} onChange={(e) => update('education', resume.education.map((x) => (x.id === s.id ? { ...x, school: e.target.value } : x)))} placeholder="University of Texas at Austin" className={`${field} h-10`} />
                          </Field>
                        </div>
                        <Field id={`ed-${s.id}`} text="Degree">
                          <input id={`ed-${s.id}`} value={s.degree} onChange={(e) => update('education', resume.education.map((x) => (x.id === s.id ? { ...x, degree: e.target.value } : x)))} placeholder="BSc" className={`${field} h-10`} />
                        </Field>
                        <Field id={`ef-${s.id}`} text="Field of study">
                          <input id={`ef-${s.id}`} value={s.field} onChange={(e) => update('education', resume.education.map((x) => (x.id === s.id ? { ...x, field: e.target.value } : x)))} placeholder="Computer Science" className={`${field} h-10`} />
                        </Field>
                        <Field id={`ee-${s.id}`} text="Finished">
                          <MonthPicker id={`ee-${s.id}`} value={s.end} onChange={(v) => update('education', resume.education.map((x) => (x.id === s.id ? { ...x, end: v } : x)))} />
                        </Field>
                        <Field id={`ex-${s.id}`} text="Detail" hint="Honours, thesis or GPA if strong.">
                          <input id={`ex-${s.id}`} value={s.detail} onChange={(e) => update('education', resume.education.map((x) => (x.id === s.id ? { ...x, detail: e.target.value } : x)))} placeholder="First class honours" className={`${field} h-10`} />
                        </Field>
                      </div>
                    </CardShell>
                  ))}
                </div>
                <button type="button" onClick={() => update('education', [...resume.education, emptySchool()])} className="mt-3 inline-flex h-10 w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-stone-300 text-sm font-medium text-stone-700 hover:border-stone-500 hover:bg-stone-50 dark:border-stone-700 dark:text-stone-300 dark:hover:bg-stone-900">
                  <Plus className="h-4 w-4" aria-hidden="true" /> Add education
                </button>
              </div>
            )}

            {section === 'skills' && (
              <div>
                <SectionHeader n={6} title="Skills" desc="Tools and methods you would be happy to be interviewed on. Press Enter or a comma after each one." />
                <Field id="rb-skill" text="Add skills">
                  <input
                    id="rb-skill"
                    value={skillDraft}
                    onChange={(e) => {
                      const v = e.target.value;
                      if (/[,;]$/.test(v)) addSkill(v);
                      else setSkillDraft(v);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addSkill(skillDraft);
                      }
                    }}
                    onBlur={() => skillDraft.trim() && addSkill(skillDraft)}
                    placeholder="React, TypeScript, Figma"
                    className={`${field} h-10`}
                  />
                </Field>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {resume.skills.length === 0 && <p className="text-sm text-stone-500">No skills yet.</p>}
                  {resume.skills.map((s) => (
                    <span key={s} className="inline-flex items-center gap-1 rounded-full bg-stone-100 py-1 pl-3 pr-1 text-sm text-stone-800 dark:bg-stone-800 dark:text-stone-200">
                      {s}
                      <button type="button" aria-label={`Remove ${s}`} onClick={() => update('skills', resume.skills.filter((x) => x !== s))} className="rounded-full p-0.5 text-stone-500 hover:bg-stone-200 hover:text-stone-900 dark:hover:bg-stone-700">
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </span>
                  ))}
                </div>
                <p className="mt-2 text-[11.5px] tabular-nums text-stone-500">{resume.skills.length} skills, most tech resumes list 8 to 15</p>
                <div className="mt-6">
                  <Field id="rb-certs" text="Certifications, one per line" hint="Optional.">
                    <textarea id="rb-certs" value={resume.certifications} onChange={(e) => update('certifications', e.target.value)} rows={3} placeholder="AWS Certified Cloud Practitioner, 2025" className={`${field} block resize-y py-2.5 leading-relaxed [field-sizing:content]`} />
                  </Field>
                </div>
              </div>
            )}

            {section === 'review' && (
              <div>
                <div className="mb-5 flex items-center gap-4">
                  <span className="text-stone-900 dark:text-white">
                    <ScoreDial score={check.score} size={72} />
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-xl font-semibold tracking-tight text-stone-900 dark:text-stone-50">Resume check</h3>
                    <p className="text-sm text-stone-600 dark:text-stone-400">
                      {pages} page{pages > 1 ? 's' : ''}, {check.bulletCount} bullet{check.bulletCount === 1 ? '' : 's'}, {check.wordCount} words. Checks are rules a recruiter or tracking system would trip over.
                    </p>
                  </div>
                </div>
                {[
                  { list: fixes, name: 'Fix first', tone: 'bg-rose-50 text-rose-800 ring-rose-200 dark:bg-rose-500/10 dark:text-rose-300 dark:ring-rose-500/20' },
                  { list: improves, name: 'Worth improving', tone: 'bg-amber-50 text-amber-800 ring-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:ring-amber-500/20' },
                  { list: goods, name: 'Working well', tone: 'bg-emerald-50 text-emerald-800 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-500/20' },
                ].map(
                  (g) =>
                    g.list.length > 0 && (
                      <div key={g.name} className="mb-5">
                        <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-stone-500">
                          {g.name} <span className="tabular-nums">({g.list.length})</span>
                        </p>
                        <ul className="space-y-2">
                          {g.list.slice(0, 12).map((f) => (
                            <li key={f.id}>
                              <button
                                type="button"
                                onClick={() => f.area !== 'Overall' && go(AREA_TO_SECTION[f.area])}
                                className="flex w-full min-w-0 items-start gap-3 rounded-xl border border-stone-200 p-3 text-left transition hover:border-stone-400 dark:border-stone-800 dark:hover:border-stone-600"
                              >
                                <span className={`mt-px shrink-0 rounded-md px-1.5 py-0.5 text-[10.5px] font-semibold ring-1 ${g.tone}`}>{f.area}</span>
                                <span className="min-w-0">
                                  <span className="block text-sm font-medium text-stone-900 dark:text-stone-100">{f.title}</span>
                                  <span className="block text-xs leading-relaxed text-stone-600 dark:text-stone-400">{f.detail}</span>
                                  {f.quote && <span className="mt-1 block truncate font-mono text-[11px] text-stone-400">{f.quote}</span>}
                                </span>
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )
                )}
                {fixes.length === 0 && improves.length === 0 && (
                  <p className="rounded-xl bg-emerald-50 p-4 text-sm text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-300">
                    Nothing left to flag. Download the PDF, then tailor the skills and top bullets to each job you apply for.
                  </p>
                )}
              </div>
            )}

            {section === 'match' && (
              <div>
                <div className="mb-5">
                  <h3 className="text-xl font-semibold tracking-tight text-stone-900 dark:text-stone-50">Match a job</h3>
                  <p className="mt-1 text-sm text-stone-600 dark:text-stone-400">Paste a job posting to see which of its skills your resume already shows, and which it does not mention.</p>
                </div>
                <Field id="rb-posting" text="Job posting">
                  <textarea id="rb-posting" value={posting} onChange={(e) => setPosting(e.target.value)} rows={7} placeholder="Paste the full job description here" className={`${field} block resize-y py-2.5 leading-relaxed`} />
                </Field>
                {posting.trim() && !match && <p className="mt-2 text-xs text-stone-500">Paste the whole posting. A few words are not enough to compare.</p>}
                {match && (
                  <div className="mt-5 space-y-4">
                    <div className="flex items-baseline justify-between">
                      <p className="text-sm font-semibold text-stone-900 dark:text-stone-100">
                        Your resume shows {match.matched.length} of {match.posting.length} skills in this posting
                      </p>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-stone-200 dark:bg-stone-800">
                      <div className="h-full rounded-full bg-emerald-500 transition-[width]" style={{ width: `${match.posting.length ? (match.matched.length / match.posting.length) * 100 : 0}%` }} />
                    </div>
                    {match.matched.length > 0 && (
                      <div>
                        <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-stone-500">Already on your resume</p>
                        <div className="flex flex-wrap gap-1.5">
                          {match.matched.map((s) => (
                            <span key={s} className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-800 ring-1 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-500/20">
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {match.missing.length > 0 && (
                      <div>
                        <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-stone-500">Not on your resume</p>
                        <div className="flex flex-wrap gap-1.5">
                          {match.missing.map((s) => (
                            <button
                              key={s}
                              type="button"
                              onClick={() => addSkill(s)}
                              className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-900 ring-1 ring-amber-200 hover:bg-amber-100 dark:bg-amber-500/10 dark:text-amber-300 dark:ring-amber-500/20"
                            >
                              <Plus className="h-3 w-3" aria-hidden="true" /> {s}
                            </button>
                          ))}
                        </div>
                        <p className="mt-2 text-xs text-stone-500">Click to add a skill only if you have really used it. Better still, mention it in a bullet that shows how.</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Step navigation */}
            <div className="mt-8 flex items-center justify-between gap-3 border-t border-stone-200 pt-4 dark:border-stone-800">
              <button
                type="button"
                disabled={idx <= 0}
                onClick={() => go(stepKeys[idx - 1])}
                className="inline-flex h-10 items-center gap-1.5 rounded-lg px-3 text-sm font-medium text-stone-700 hover:bg-stone-100 disabled:opacity-30 dark:text-stone-300 dark:hover:bg-stone-800"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back
              </button>
              {idx < stepKeys.length - 1 ? (
                <button type="button" onClick={() => go(stepKeys[idx + 1])} className="inline-flex h-10 items-center gap-1.5 rounded-lg bg-stone-900 px-4 text-sm font-semibold text-white hover:bg-stone-800 dark:bg-white dark:text-stone-900">
                  {SECTIONS[idx + 1].name} <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
              ) : (
                <button type="button" onClick={downloadPdf} className="inline-flex h-10 items-center gap-1.5 rounded-lg bg-stone-900 px-4 text-sm font-semibold text-white hover:bg-stone-800 dark:bg-white dark:text-stone-900">
                  <Download className="h-4 w-4" aria-hidden="true" /> Download PDF
                </button>
              )}
            </div>

            {/* Data controls */}
            <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
              <button type="button" onClick={() => setResume({ ...EXAMPLE_RESUME, template: resume.template, accent: resume.accent })} className="rounded-lg px-2.5 py-1.5 font-medium text-stone-600 hover:bg-stone-100 dark:text-stone-400 dark:hover:bg-stone-800">
                Load an example
              </button>
              <button type="button" onClick={downloadTxt} className="rounded-lg px-2.5 py-1.5 font-medium text-stone-600 hover:bg-stone-100 dark:text-stone-400 dark:hover:bg-stone-800">
                Download as text
              </button>
              {confirmReset ? (
                <span className="inline-flex items-center gap-1.5 rounded-lg bg-rose-50 px-2.5 py-1 text-rose-800 dark:bg-rose-500/10 dark:text-rose-300">
                  Clear everything?
                  <button
                    type="button"
                    onClick={() => {
                      setResume({ ...EMPTY_RESUME, roles: [emptyRole()], education: [emptySchool()] });
                      setConfirmReset(false);
                      setSection('contact');
                    }}
                    className="font-semibold underline"
                  >
                    Yes, clear
                  </button>
                  <button type="button" onClick={() => setConfirmReset(false)} className="font-medium">
                    Cancel
                  </button>
                </span>
              ) : (
                <button type="button" onClick={() => setConfirmReset(true)} className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 font-medium text-stone-600 hover:bg-stone-100 dark:text-stone-400 dark:hover:bg-stone-800">
                  <RotateCcw className="h-3 w-3" aria-hidden="true" /> Start over
                </button>
              )}
              <span className="ml-auto text-stone-400 lg:hidden">{savedAt ? 'Saved on this device' : ''}</span>
            </div>
          </div>
        </section>

        {/* ================= Preview desk ================= */}
        <section
          aria-label="Preview"
          className={`${mode === 'edit' ? 'hidden' : 'block'} min-w-0 bg-stone-100 bg-[radial-gradient(circle,rgba(120,113,108,0.18)_1px,transparent_1px)] [background-size:16px_16px] dark:bg-stone-900 lg:block`}
        >
          <div className="flex items-center justify-between gap-2 px-4 pt-4 text-xs text-stone-500">
            <span>
              {TEMPLATES.find((t) => t.key === resume.template)?.name} template, A4
            </span>
            <span className={pages > 2 ? 'font-semibold text-rose-600' : pages === 2 ? 'text-amber-700 dark:text-amber-400' : ''}>
              {pages === 1 ? 'Fits on 1 page' : `${pages} pages`}
            </span>
          </div>
          <div ref={deskRef} className="px-4 pb-6 pt-3">
            <div className="relative mx-auto" style={{ width: SHEET_WIDTH * scale, height: Math.max(SHEET_HEIGHT, sheetHeight) * scale }}>
              <div className="absolute left-0 top-0 origin-top-left shadow-[0_1px_3px_rgba(0,0,0,0.08),0_24px_60px_-30px_rgba(28,25,23,0.45)]" style={{ transform: `scale(${scale})` }}>
                <style>{RESUME_CSS}</style>
                <ResumeSheet ref={sheetRef} resume={resume} />
              </div>
              {Array.from({ length: pages - 1 }, (_, i) => (
                <div key={i} aria-hidden="true" className="pointer-events-none absolute left-0 right-0 border-t border-dashed border-rose-400/70" style={{ top: SHEET_HEIGHT * (i + 1) * scale }}>
                  <span className="absolute -top-2.5 right-1 rounded bg-rose-500 px-1.5 text-[10px] font-semibold text-white">Page {i + 2}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
