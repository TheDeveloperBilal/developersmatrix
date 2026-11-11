// Kept apart from the games list so client components can import it cheaply.

/** The link that opens the Website Audit with this address filled in and the scan started. */
export function auditLink(site: string): string {
  const clean = site.trim();
  return clean ? `/tools/website-audit#url=${encodeURIComponent(clean)}` : "/tools/website-audit";
}

/** A loose check before sending someone to the audit: one word with a dot in it. */
export function looksLikeSite(site: string): boolean {
  return /^[^\s]+\.[^\s]{2,}$/.test(site.trim());
}
