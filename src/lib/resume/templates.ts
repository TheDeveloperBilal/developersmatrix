/**
 * Resume templates. All three are single column with real text, standard
 * section names and system fonts, which is what applicant tracking systems
 * parse most reliably. The same CSS drives the on screen preview and the
 * printed PDF, so what people see is what they download.
 */

import type { TemplateKey } from './types';

export const TEMPLATES: { key: TemplateKey; name: string; note: string }[] = [
  { key: 'classic', name: 'Classic', note: 'Centered header, serif headings. Safe for any company.' },
  { key: 'modern', name: 'Modern', note: 'Left aligned, clean sans serif. Popular in tech.' },
  { key: 'compact', name: 'Compact', note: 'Tighter spacing to keep a full career on one page.' },
];

/** A4 at 96 dpi. */
export const SHEET_WIDTH = 794;
export const SHEET_HEIGHT = 1123;

export const RESUME_CSS = `
.rs-sheet{--accent:#0f172a;box-sizing:border-box;width:${SHEET_WIDTH}px;min-height:${SHEET_HEIGHT}px;padding:56px 60px;background:#fff;color:#1f2937;font:10.5pt/1.45 Helvetica,Arial,sans-serif;word-wrap:break-word}
.rs-sheet *{box-sizing:border-box;margin:0;padding:0}
.rs-sheet .rs-name{font-size:22pt;line-height:1.15;font-weight:700;color:#0b0f19;letter-spacing:-.01em}
.rs-sheet .rs-headline{margin-top:3px;font-size:11pt;color:var(--accent);font-weight:600}
.rs-sheet .rs-contact{margin-top:6px;font-size:9.5pt;color:#374151}
.rs-sheet .rs-contact span+span:before{content:"  |  ";color:#9ca3af;white-space:pre}
.rs-sheet .rs-sec{margin-top:16px}
.rs-sheet .rs-h{font-size:9.5pt;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--accent);padding-bottom:3px;border-bottom:1px solid var(--accent);margin-bottom:8px}
.rs-sheet .rs-item+.rs-item{margin-top:10px}
.rs-sheet .rs-row{display:flex;justify-content:space-between;gap:12px;align-items:baseline}
.rs-sheet .rs-row strong{font-weight:700;color:#0b0f19}
.rs-sheet .rs-meta{flex-shrink:0;font-size:9.5pt;color:#4b5563;white-space:nowrap}
.rs-sheet .rs-sub{font-size:9.5pt;color:#4b5563}
.rs-sheet ul{margin-top:4px;padding-left:16px}
.rs-sheet li{margin-top:2px}
.rs-sheet li::marker{color:#6b7280}
.rs-sheet .rs-p{color:#1f2937}
.rs-sheet .rs-skills{color:#1f2937}
.rs-sheet .rs-empty{color:#9ca3af;font-style:italic}

.rs-sheet.t-classic{font-family:Georgia,'Times New Roman',serif}
.rs-sheet.t-classic .rs-head{text-align:center}
.rs-sheet.t-classic .rs-name{font-weight:400;font-size:24pt;letter-spacing:.01em}
.rs-sheet.t-classic .rs-h{text-align:left;font-family:Georgia,'Times New Roman',serif;letter-spacing:.16em}

.rs-sheet.t-modern .rs-head{padding-bottom:12px;border-bottom:3px solid var(--accent)}
.rs-sheet.t-modern .rs-h{border-bottom:0;padding-bottom:0;padding-left:9px;border-left:3px solid var(--accent);letter-spacing:.1em}

.rs-sheet.t-compact{font-size:9.6pt;line-height:1.38;padding:44px 50px}
.rs-sheet.t-compact .rs-head{display:flex;justify-content:space-between;align-items:flex-end;gap:16px;flex-wrap:wrap}
.rs-sheet.t-compact .rs-name{font-size:19pt}
.rs-sheet.t-compact .rs-contact{margin-top:0;text-align:right;font-size:9pt;max-width:55%}
.rs-sheet.t-compact .rs-contact span{display:block}
.rs-sheet.t-compact .rs-contact span+span:before{content:none}
.rs-sheet.t-compact .rs-sec{margin-top:11px}
.rs-sheet.t-compact .rs-h{margin-bottom:5px}
.rs-sheet.t-compact .rs-item+.rs-item{margin-top:7px}

@media print{
  @page{size:A4;margin:14mm 15mm}
  html,body{margin:0;background:#fff}
  .rs-sheet{width:auto;min-height:0;padding:0}
  .rs-sheet .rs-item{break-inside:avoid}
  .rs-sheet .rs-h{break-after:avoid}
}
`;
