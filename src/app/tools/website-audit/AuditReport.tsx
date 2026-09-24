'use client';

/**
 * The audit report.
 *
 * Design rules, deliberately narrow:
 *   - Three states only. Green pass, amber warning, red fail. Nothing else
 *     carries colour, so colour always means status.
 *   - White cards on a light grey page. No gradients, no brand purple.
 *   - Every row is scannable at a glance and expandable for the detail.
 *   - It prints. A report a client or developer cannot hand over is half a report.
 */

import { useMemo, useState } from 'react';
import { buildReport, type CheckResult, type CheckStatus, type GroupResult } from '@/lib/website-audit/check-catalogue';
import type { AuditIssue, WebsiteAuditResult, PageSpeedMetric } from '@/lib/website-audit/types';

/* ---------- status tokens: the only place colour is decided ---------- */

const STATUS = {
  pass:    { label: 'Passed',  text: 'text-[#0f7b3e]', bg: 'bg-[#e8f5ec]', border: 'border-[#b7e0c5]', dot: 'bg-[#16a34a]' },
  warning: { label: 'Warning', text: 'text-[#8a5a00]', bg: 'bg-[#fdf4e3]', border: 'border-[#f5d9a0]', dot: 'bg-[#e8a33d]' },
  fail:    { label: 'Failed',  text: 'text-[#a3242b]', bg: 'bg-[#fdeceb]', border: 'border-[#f5c2c0]', dot: 'bg-[#d93a36]' },
  'not-run': { label: 'Not run', text: 'text-gray-500', bg: 'bg-gray-50', border: 'border-gray-200', dot: 'bg-gray-400' },
} as const;

function StatusIcon({ status, size = 20 }: { status: CheckStatus; size?: number }) {
  const common = { width: size, height: size, viewBox: '0 0 20 20', 'aria-hidden': true as const };
  if (status === 'pass') {
    return (
      <svg {...common} className="text-[#16a34a] shrink-0" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
      </svg>
    );
  }
  if (status === 'warning') {
    return (
      <svg {...common} className="text-[#e8a33d] shrink-0" fill="currentColor">
        <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
      </svg>
    );
  }
  if (status === 'fail') {
    return (
      <svg {...common} className="text-[#d93a36] shrink-0" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
      </svg>
    );
  }
  return <svg {...common} className="text-gray-400 shrink-0" fill="currentColor"><circle cx="10" cy="10" r="8" /></svg>;
}

/* ---------- score ring ---------- */

function scoreColour(score: number): string {
  if (score >= 90) return '#16a34a';
  if (score >= 70) return '#e8a33d';
  return '#d93a36';
}

function ScoreRing({ score, size = 128 }: { score: number; size?: number }) {
  const r = (size - 14) / 2;
  const c = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(100, score));
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90" aria-hidden="true">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#e8eaed" strokeWidth="10" />
        <circle
          cx={size / 2} cy={size / 2} r={r} fill="none"
          stroke={scoreColour(pct)} strokeWidth="10" strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={c - (pct / 100) * c}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-semibold tabular-nums" style={{ color: scoreColour(pct) }}>{Math.round(pct)}</span>
        <span className="text-[11px] uppercase tracking-wide text-gray-500">of 100</span>
      </div>
    </div>
  );
}

/* ---------- Core Web Vitals ---------- */

function MetricCard({ metric }: { metric: PageSpeedMetric }) {
  const s = metric.rating === 'good' ? STATUS.pass : metric.rating === 'poor' ? STATUS.fail : STATUS.warning;
  return (
    <div className={`rounded-md border ${s.border} ${s.bg} p-4`}>
      <div className="flex items-start justify-between gap-2">
        <span className="text-xs font-medium text-gray-600 leading-snug">{metric.label}</span>
        {metric.isCoreWebVital && (
          <span className="shrink-0 rounded bg-white/70 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-gray-500 border border-gray-200">
            Core
          </span>
        )}
      </div>
      <div className={`mt-2 text-2xl font-semibold tabular-nums ${s.text}`}>{metric.displayValue}</div>
    </div>
  );
}

function PageSpeedSection({ result }: { result: WebsiteAuditResult }) {
  const psi = result.pagespeed;
  if (!psi) return null;

  if (!psi.available) {
    return (
      <section className="rounded-lg border border-gray-200 bg-white p-6">
        <h2 className="text-base font-semibold text-gray-900">Core Web Vitals</h2>
        <p className="mt-2 text-sm text-gray-600">{psi.unavailableReason}</p>
        <p className="mt-1 text-xs text-gray-500">Every other check in this report ran normally.</p>
      </section>
    );
  }

  const cats: Array<[string, number | null]> = [
    ['Performance', psi.scores.performance],
    ['Accessibility', psi.scores.accessibility],
    ['Best Practices', psi.scores.bestPractices],
    ['SEO', psi.scores.seo],
  ];

  return (
    <section className="rounded-lg border border-gray-200 bg-white">
      <header className="border-b border-gray-200 px-6 py-4">
        <h2 className="text-base font-semibold text-gray-900">Core Web Vitals and Page Speed</h2>
        <p className="mt-0.5 text-sm text-gray-500">
          Measured by Google PageSpeed Insights on a {psi.strategy} device.
        </p>
      </header>

      <div className="grid grid-cols-2 gap-px bg-gray-200 sm:grid-cols-4">
        {cats.map(([label, value]) => (
          <div key={label} className="bg-white px-6 py-4">
            <div className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</div>
            <div className="mt-1 text-2xl font-semibold tabular-nums"
                 style={{ color: value === null ? '#9aa0a6' : scoreColour(value) }}>
              {value === null ? 'n/a' : value}
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-6 px-6 py-5">
        {psi.hasFieldData ? (
          <div>
            <div className="flex flex-wrap items-baseline gap-2">
              <h3 className="text-sm font-semibold text-gray-900">What real users experienced</h3>
              <span className="text-xs text-gray-500">
                Chrome data, last 28 days, {psi.fieldDataScope === 'origin' ? 'whole site' : 'this page'}. This is what Google ranks on.
              </span>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-3 lg:grid-cols-3">
              {psi.fieldData.map((m) => <MetricCard key={m.id} metric={m} />)}
            </div>
          </div>
        ) : (
          <div className="rounded-md border border-gray-200 bg-gray-50 px-4 py-3">
            <p className="text-sm text-gray-700">
              Google has no real user data for this site yet. That needs a certain amount of Chrome traffic
              before it appears, so it is normal for newer or quieter sites.
            </p>
            <p className="mt-1 text-xs text-gray-500">The lab results below still apply.</p>
          </div>
        )}

        {psi.labMetrics.length > 0 && (
          <div>
            <div className="flex flex-wrap items-baseline gap-2">
              <h3 className="text-sm font-semibold text-gray-900">Lab test</h3>
              <span className="text-xs text-gray-500">
                One simulated load on a throttled connection. Useful for diagnosis, not a ranking signal.
              </span>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-3 lg:grid-cols-3">
              {psi.labMetrics.map((m) => <MetricCard key={m.id} metric={m} />)}
            </div>
          </div>
        )}

        {psi.opportunities.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Biggest speed opportunities</h3>
            <ul className="mt-3 divide-y divide-gray-100 rounded-md border border-gray-200">
              {psi.opportunities.map((o) => (
                <li key={o.id} className="flex items-start justify-between gap-4 px-4 py-3">
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-gray-900">{o.title}</div>
                    {o.description && <p className="mt-0.5 text-xs leading-relaxed text-gray-600">{o.description}</p>}
                  </div>
                  {o.savingsMs > 0 && (
                    <span className="shrink-0 rounded bg-[#fdf4e3] px-2 py-1 text-xs font-medium text-[#8a5a00] tabular-nums">
                      {(o.savingsMs / 1000).toFixed(2)}s
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}

/* ---------- one finding ---------- */

function Finding({ issue }: { issue: AuditIssue }) {
  return (
    <div className="rounded-md border border-gray-200 bg-white p-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium text-gray-900">{issue.title}</span>
        <span className="rounded border border-gray-200 bg-gray-50 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-gray-500">
          {issue.severity}
        </span>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-gray-700">{issue.description}</p>

      {issue.impact && (
        <p className="mt-2 text-sm leading-relaxed text-gray-600">
          <span className="font-medium text-gray-800">Why it matters. </span>{issue.impact}
        </p>
      )}

      {issue.suggestion && (
        <div className="mt-3 rounded border-l-2 border-[#16a34a] bg-[#f6fbf8] px-3 py-2">
          <p className="text-sm leading-relaxed text-gray-800">
            <span className="font-medium">How to fix it. </span>{issue.suggestion}
          </p>
        </div>
      )}

      {(issue.timeToFix || issue.difficulty || issue.estimatedImpact) && (
        <dl className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-xs text-gray-600">
          {issue.timeToFix && <div><dt className="inline font-medium text-gray-500">Time: </dt><dd className="inline">{issue.timeToFix}</dd></div>}
          {issue.difficulty && <div><dt className="inline font-medium text-gray-500">Difficulty: </dt><dd className="inline capitalize">{issue.difficulty}</dd></div>}
          {issue.estimatedImpact && <div><dt className="inline font-medium text-gray-500">Expected gain: </dt><dd className="inline">{issue.estimatedImpact}</dd></div>}
        </dl>
      )}

      {issue.affectedUrls && issue.affectedUrls.filter(Boolean).length > 0 && (
        <details className="mt-3">
          <summary className="cursor-pointer text-xs font-medium text-gray-600 hover:text-gray-900">
            Affected pages ({issue.affectedUrls.filter(Boolean).length})
          </summary>
          <ul className="mt-2 space-y-1">
            {issue.affectedUrls.filter(Boolean).slice(0, 25).map((u, i) => (
              <li key={i} className="truncate font-mono text-xs text-gray-600">{u}</li>
            ))}
          </ul>
        </details>
      )}

      {issue.codeSnippet && (
        <pre className="mt-3 overflow-x-auto rounded bg-gray-900 p-3 text-xs leading-relaxed text-gray-100">
          <code>{issue.codeSnippet}</code>
        </pre>
      )}
    </div>
  );
}

/* ---------- one check row ---------- */

function CheckRow({ check }: { check: CheckResult }) {
  const [open, setOpen] = useState(false);
  const s = STATUS[check.status];
  const expandable = check.findings.length > 0;

  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        type="button"
        onClick={() => expandable && setOpen((v) => !v)}
        aria-expanded={expandable ? open : undefined}
        className={`flex w-full items-center gap-3 px-4 py-3 text-left sm:px-6 ${expandable ? 'cursor-pointer hover:bg-gray-50' : 'cursor-default'}`}
      >
        <StatusIcon status={check.status} />
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-medium text-gray-900">{check.definition.name}</span>
          {check.status === 'pass' ? (
            <span className="mt-0.5 block text-xs text-gray-500">{check.definition.passText}</span>
          ) : (
            <span className="mt-0.5 block text-xs text-gray-600">
              {check.findings.length} issue{check.findings.length === 1 ? '' : 's'} found
            </span>
          )}
        </span>
        <span className={`shrink-0 rounded px-2 py-0.5 text-xs font-medium ${s.bg} ${s.text}`}>{s.label}</span>
        {expandable && (
          <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"
               className={`shrink-0 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`}>
            <path fillRule="evenodd" d="M5.22 8.22a.75.75 0 011.06 0L10 11.94l3.72-3.72a.75.75 0 111.06 1.06l-4.25 4.25a.75.75 0 01-1.06 0L5.22 9.28a.75.75 0 010-1.06z" clipRule="evenodd" />
          </svg>
        )}
      </button>

      {open && expandable && (
        <div className="space-y-3 bg-gray-50 px-4 py-4 sm:px-6">
          {check.findings.map((f, i) => <Finding key={`${f.id}-${i}`} issue={f} />)}
        </div>
      )}
    </div>
  );
}

/* ---------- one group ---------- */

function GroupSection({ group }: { group: GroupResult }) {
  const order: Record<CheckStatus, number> = { fail: 0, warning: 1, pass: 2, 'not-run': 3 };
  const checks = [...group.checks].sort((a, b) => order[a.status] - order[b.status]);

  return (
    <section className="overflow-hidden rounded-lg border border-gray-200 bg-white">
      <header className="flex flex-wrap items-start justify-between gap-3 border-b border-gray-200 px-4 py-4 sm:px-6">
        <div>
          <h2 className="text-base font-semibold text-gray-900">{group.group.name}</h2>
          <p className="mt-0.5 text-sm text-gray-500">{group.group.description}</p>
        </div>
        <div className="flex items-center gap-3 text-xs font-medium">
          {group.failed > 0 && <span className="flex items-center gap-1.5 text-[#a3242b]"><span className="h-2 w-2 rounded-full bg-[#d93a36]" />{group.failed} failed</span>}
          {group.warnings > 0 && <span className="flex items-center gap-1.5 text-[#8a5a00]"><span className="h-2 w-2 rounded-full bg-[#e8a33d]" />{group.warnings} warning{group.warnings === 1 ? '' : 's'}</span>}
          {group.passed > 0 && <span className="flex items-center gap-1.5 text-[#0f7b3e]"><span className="h-2 w-2 rounded-full bg-[#16a34a]" />{group.passed} passed</span>}
        </div>
      </header>

      <div>
        {checks.map((c) => <CheckRow key={c.definition.id} check={c} />)}
      </div>

      {group.additionalFindings.length > 0 && (
        <div className="border-t border-gray-200 bg-gray-50 px-4 py-4 sm:px-6">
          <h3 className="text-sm font-semibold text-gray-900">
            Additional findings ({group.additionalFindings.length})
          </h3>
          <p className="mt-0.5 text-xs text-gray-500">
            Issues in this area that sit outside the named checks above.
          </p>
          <div className="mt-3 space-y-3">
            {group.additionalFindings.map((f, i) => <Finding key={`${f.id}-${i}`} issue={f} />)}
          </div>
        </div>
      )}
    </section>
  );
}

/* ---------- the report ---------- */

export default function AuditReport({
  result,
  onReset,
  onExportPdf,
  onCopy,
  copied,
}: {
  result: WebsiteAuditResult;
  onReset?: () => void;
  onExportPdf?: () => void;
  onCopy?: () => void;
  copied?: boolean;
}) {
  const report = useMemo(() => buildReport(result), [result]);
  const { passed, warnings, failed } = report.totals;
  const scanned = new Date(result.scannedAt);

  return (
    <div className="space-y-5">
      {/* summary */}
      <section className="rounded-lg border border-gray-200 bg-white px-5 py-6 sm:px-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
          <ScoreRing score={result.overallScore} />

          <div className="min-w-0 flex-1">
            <h1 className="truncate text-lg font-semibold text-gray-900">{result.domain}</h1>
            <p className="mt-0.5 text-sm text-gray-500">
              {result.pagesScanned} page{result.pagesScanned === 1 ? '' : 's'} analysed on{' '}
              {scanned.toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })}
              {' at '}
              {scanned.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
            </p>

            <div className="mt-4 grid grid-cols-3 gap-px overflow-hidden rounded-md border border-gray-200 bg-gray-200">
              <div className="bg-white px-4 py-3 text-center">
                <div className="text-2xl font-semibold tabular-nums text-[#0f7b3e]">{passed}</div>
                <div className="text-xs text-gray-500">Passed</div>
              </div>
              <div className="bg-white px-4 py-3 text-center">
                <div className="text-2xl font-semibold tabular-nums text-[#8a5a00]">{warnings}</div>
                <div className="text-xs text-gray-500">Warnings</div>
              </div>
              <div className="bg-white px-4 py-3 text-center">
                <div className="text-2xl font-semibold tabular-nums text-[#a3242b]">{failed}</div>
                <div className="text-xs text-gray-500">Failed</div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-2 print:hidden">
          {onExportPdf && (
            <button type="button" onClick={onExportPdf}
              className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800">
              Download PDF
            </button>
          )}
          {onCopy && (
            <button type="button" onClick={onCopy}
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
              {copied ? 'Copied' : 'Copy report'}
            </button>
          )}
          {onReset && (
            <button type="button" onClick={onReset}
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
              Audit another site
            </button>
          )}
        </div>
      </section>

      <PageSpeedSection result={result} />

      {report.groups.map((g) => <GroupSection key={g.group.id} group={g} />)}

      <p className="px-1 pb-2 text-xs leading-relaxed text-gray-500">
        A check is marked passed when the audit ran it and raised nothing against it.
        Core Web Vitals come from Google PageSpeed Insights. Everything else is measured
        directly from the pages crawled.
      </p>
    </div>
  );
}
