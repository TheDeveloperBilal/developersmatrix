'use client';

import { forwardRef } from 'react';
import { bulletLines, dateRange, formatMonth, type Resume } from '@/lib/resume/types';

/**
 * The resume itself. Plain divs rather than headings so the page outline of
 * the tool page is not filled with the visitor's name and section titles.
 * The same markup is copied into the print frame for the PDF.
 */
const ResumeSheet = forwardRef<HTMLDivElement, { resume: Resume }>(function ResumeSheet({ resume: r }, ref) {
  const c = r.contact;
  const contact = [c.email, c.phone, c.location, c.linkedin, c.website].map((x) => x.trim()).filter(Boolean);
  const roles = r.roles.filter((x) => x.title.trim() || x.company.trim() || x.bullets.trim());
  const projects = r.projects.filter((x) => x.name.trim() || x.bullets.trim());
  const schools = r.education.filter((x) => x.school.trim() || x.degree.trim() || x.field.trim());
  const certs = bulletLines(r.certifications);
  const blank = !c.name.trim() && roles.length === 0 && !r.summary.trim();

  return (
    <div ref={ref} className={`rs-sheet t-${r.template}`} style={{ ['--accent' as string]: r.accent }}>
      <div className="rs-head">
        <div>
          <div className="rs-name">{c.name.trim() || <span className="rs-empty">Your name</span>}</div>
          {c.headline.trim() && <div className="rs-headline">{c.headline.trim()}</div>}
        </div>
        {contact.length > 0 && (
          <div className="rs-contact">
            {contact.map((x) => (
              <span key={x}>{x}</span>
            ))}
          </div>
        )}
      </div>

      {blank && (
        <div className="rs-sec">
          <div className="rs-p rs-empty">Start filling in the editor and your resume appears here as you type.</div>
        </div>
      )}

      {r.summary.trim() && (
        <div className="rs-sec">
          <div className="rs-h">Summary</div>
          <div className="rs-p">{r.summary.trim()}</div>
        </div>
      )}

      {roles.length > 0 && (
        <div className="rs-sec">
          <div className="rs-h">Experience</div>
          {roles.map((x) => (
            <div className="rs-item" key={x.id}>
              <div className="rs-row">
                <div>
                  <strong>{x.title.trim() || 'Job title'}</strong>
                  {x.company.trim() && <>, {x.company.trim()}</>}
                </div>
                <div className="rs-meta">{dateRange(x.start, x.end, x.current)}</div>
              </div>
              {x.location.trim() && <div className="rs-sub">{x.location.trim()}</div>}
              {bulletLines(x.bullets).length > 0 && (
                <ul>
                  {bulletLines(x.bullets).map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {projects.length > 0 && (
        <div className="rs-sec">
          <div className="rs-h">Projects</div>
          {projects.map((p) => (
            <div className="rs-item" key={p.id}>
              <div className="rs-row">
                <div>
                  <strong>{p.name.trim() || 'Project'}</strong>
                  {p.tech.trim() && <> ({p.tech.trim()})</>}
                </div>
                {p.link.trim() && <div className="rs-meta">{p.link.trim()}</div>}
              </div>
              {bulletLines(p.bullets).length > 0 && (
                <ul>
                  {bulletLines(p.bullets).map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {schools.length > 0 && (
        <div className="rs-sec">
          <div className="rs-h">Education</div>
          {schools.map((s) => (
            <div className="rs-item" key={s.id}>
              <div className="rs-row">
                <div>
                  <strong>{[s.degree.trim(), s.field.trim()].filter(Boolean).join(', ') || s.school.trim()}</strong>
                  {(s.degree.trim() || s.field.trim()) && s.school.trim() && <>, {s.school.trim()}</>}
                </div>
                {s.end && <div className="rs-meta">{formatMonth(s.end)}</div>}
              </div>
              {s.detail.trim() && <div className="rs-sub">{s.detail.trim()}</div>}
            </div>
          ))}
        </div>
      )}

      {r.skills.length > 0 && (
        <div className="rs-sec">
          <div className="rs-h">Skills</div>
          <div className="rs-skills">{r.skills.join(', ')}</div>
        </div>
      )}

      {certs.length > 0 && (
        <div className="rs-sec">
          <div className="rs-h">Certifications</div>
          <ul>
            {certs.map((x, i) => (
              <li key={i}>{x}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
});

export default ResumeSheet;

/** Plain text version for pasting into application forms. */
export function resumeToText(r: Resume): string {
  const out: string[] = [];
  const c = r.contact;
  out.push(c.name.trim());
  if (c.headline.trim()) out.push(c.headline.trim());
  const contact = [c.email, c.phone, c.location, c.linkedin, c.website].map((x) => x.trim()).filter(Boolean);
  if (contact.length) out.push(contact.join(' | '));
  const section = (title: string) => out.push('', title.toUpperCase());
  if (r.summary.trim()) {
    section('Summary');
    out.push(r.summary.trim());
  }
  const roles = r.roles.filter((x) => x.title.trim() || x.company.trim());
  if (roles.length) {
    section('Experience');
    roles.forEach((x, i) => {
      if (i) out.push('');
      out.push([x.title.trim(), x.company.trim()].filter(Boolean).join(', ') + (dateRange(x.start, x.end, x.current) ? `  (${dateRange(x.start, x.end, x.current)})` : ''));
      if (x.location.trim()) out.push(x.location.trim());
      bulletLines(x.bullets).forEach((b) => out.push(`- ${b}`));
    });
  }
  const projects = r.projects.filter((x) => x.name.trim());
  if (projects.length) {
    section('Projects');
    projects.forEach((p, i) => {
      if (i) out.push('');
      out.push(p.name.trim() + (p.tech.trim() ? ` (${p.tech.trim()})` : '') + (p.link.trim() ? `  ${p.link.trim()}` : ''));
      bulletLines(p.bullets).forEach((b) => out.push(`- ${b}`));
    });
  }
  const schools = r.education.filter((x) => x.school.trim() || x.degree.trim());
  if (schools.length) {
    section('Education');
    schools.forEach((s) => {
      out.push([[s.degree.trim(), s.field.trim()].filter(Boolean).join(', '), s.school.trim()].filter(Boolean).join(', ') + (s.end ? `  (${formatMonth(s.end)})` : ''));
      if (s.detail.trim()) out.push(s.detail.trim());
    });
  }
  if (r.skills.length) {
    section('Skills');
    out.push(r.skills.join(', '));
  }
  const certs = bulletLines(r.certifications);
  if (certs.length) {
    section('Certifications');
    certs.forEach((x) => out.push(`- ${x}`));
  }
  return out.join('\n').trim();
}
