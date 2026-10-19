#!/usr/bin/env node
// Submits changed pages to IndexNow (Bing, Yandex, Seznam, Naver, Yep).
// Google does not take part in IndexNow; it reads lastmod from the sitemap.
//
// Usage
//   node scripts/indexnow.mjs --changed --state .indexnow/state.json
//       Reads the live sitemap, compares each lastmod with the saved state and
//       submits only new or changed URLs. With no saved state it submits all.
//   node scripts/indexnow.mjs /blog/some-post https://developersmatrix.com/tools
//       Submits the given pages by hand.
//   Add --dry-run to print what would be sent without sending it.
//
// The key is read from the live site (/indexnow-key.txt), so nothing secret is
// needed here. Node 18 or newer (built in fetch).

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname } from 'node:path';

const SITE = (process.env.SITE_URL || 'https://developersmatrix.com').replace(/\/$/, '');
const HOST = new URL(SITE).host;
const KEY_LOCATION = `${SITE}/indexnow-key.txt`;
const ENDPOINT = process.env.INDEXNOW_ENDPOINT || 'https://api.indexnow.org/indexnow';
const BATCH = 10000;

const args = process.argv.slice(2);
const flag = (name) => args.includes(name);
const option = (name) => {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : undefined;
};
const dryRun = flag('--dry-run');
const statePath = option('--state');
const manualUrls = args.filter((a, i) => !a.startsWith('--') && args[i - 1] !== '--state');

async function fetchText(url) {
  const res = await fetch(url, { headers: { 'User-Agent': 'DevelopersMatrix-IndexNow/1.0' }, cache: 'no-store' });
  if (!res.ok) throw new Error(`${url} returned ${res.status}`);
  return res.text();
}

class NoKeyError extends Error {}

async function readKey() {
  const res = await fetch(KEY_LOCATION, { cache: 'no-store' });
  if (res.status === 404) throw new NoKeyError('No IndexNow key is live yet. Add INDEXNOW_KEY in Vercel and redeploy. Nothing was sent.');
  if (!res.ok) throw new Error(`${KEY_LOCATION} returned ${res.status}`);
  const key = (await res.text()).trim();
  if (!/^[a-zA-Z0-9-]{8,128}$/.test(key)) throw new Error('The key file does not contain a valid IndexNow key');
  return key;
}

async function readSitemap() {
  const xml = await fetchText(`${SITE}/sitemap.xml`);
  const entries = {};
  for (const block of xml.match(/<url>[\s\S]*?<\/url>/g) || []) {
    const loc = block.match(/<loc>([^<]+)<\/loc>/)?.[1]?.trim();
    const lastmod = block.match(/<lastmod>([^<]+)<\/lastmod>/)?.[1]?.trim() || '';
    if (loc) entries[loc] = lastmod;
  }
  return entries;
}

async function loadState() {
  if (!statePath) return null;
  try {
    return JSON.parse(await readFile(statePath, 'utf8'));
  } catch {
    return null;
  }
}

async function saveState(state) {
  if (!statePath || dryRun) return;
  await mkdir(dirname(statePath), { recursive: true });
  await writeFile(statePath, JSON.stringify(state, null, 2));
}

function toAbsolute(u) {
  const url = new URL(u, SITE);
  if (url.host !== HOST) throw new Error(`${u} is not on ${HOST}`);
  return url.toString();
}

async function submit(urls) {
  if (urls.length === 0) {
    console.log('Nothing to submit.');
    return true;
  }
  if (dryRun) {
    console.log(`Dry run. Would submit ${urls.length} URL(s):`);
    urls.forEach((u) => console.log(`  ${u}`));
    return true;
  }
  const key = await readKey();
  let ok = true;
  for (let i = 0; i < urls.length; i += BATCH) {
    const urlList = urls.slice(i, i + BATCH);
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({ host: HOST, key, keyLocation: KEY_LOCATION, urlList }),
    });
    // 200 and 202 both mean accepted. 403 means the key file did not match,
    // 422 means a URL is not on this host, 429 means too many requests.
    console.log(`IndexNow answered ${res.status} for ${urlList.length} URL(s).`);
    if (res.status !== 200 && res.status !== 202) {
      ok = false;
      console.log(await res.text().catch(() => ''));
    }
  }
  urls.forEach((u) => console.log(`  ${u}`));
  return ok;
}

async function main() {
  if (manualUrls.length > 0) {
    const ok = await submit([...new Set(manualUrls.map(toAbsolute))]);
    process.exitCode = ok ? 0 : 1;
    return;
  }

  if (!flag('--changed')) {
    console.log('Pass page URLs to submit them, or --changed to submit what changed in the sitemap.');
    process.exitCode = 1;
    return;
  }

  const current = await readSitemap();
  const previous = await loadState();
  const changed = Object.keys(current).filter((loc) => !previous || previous[loc] !== current[loc]);
  console.log(previous ? `${changed.length} of ${Object.keys(current).length} sitemap URL(s) are new or changed.` : 'No saved state, submitting every sitemap URL once.');

  const ok = await submit(changed);
  // Only remember the new dates once IndexNow has accepted them, so a failed
  // run is retried on the next deploy.
  if (ok) await saveState(current);
  process.exitCode = ok ? 0 : 1;
}

main().catch((err) => {
  if (err instanceof NoKeyError) {
    // Not a failure: the key simply has not been set up yet.
    console.log(err.message);
    return;
  }
  console.error(err.message || err);
  process.exitCode = 1;
});
