// Safe outbound fetching for the website audit.
//
// The audit fetches whatever URL a visitor types in. Without these guards a
// visitor could point it at localhost, the cloud metadata address or any other
// private network address and read the answer back through the report. Every
// request, and every redirect hop, is checked here before it is sent.

import { lookup } from 'node:dns/promises';
import { isIP } from 'node:net';

export class BlockedUrlError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'BlockedUrlError';
  }
}

const BLOCKED_HOST_SUFFIXES = ['.localhost', '.local', '.internal', '.lan', '.home', '.corp', '.intranet'];

function ipv4ToInt(ip: string): number {
  return ip.split('.').reduce((acc, part) => (acc << 8) + Number(part), 0) >>> 0;
}

function inRange(ip: number, base: string, bits: number): boolean {
  const mask = bits === 0 ? 0 : (~0 << (32 - bits)) >>> 0;
  return (ip & mask) === (ipv4ToInt(base) & mask);
}

const PRIVATE_V4: [string, number][] = [
  ['0.0.0.0', 8], // "this" network
  ['10.0.0.0', 8], // private
  ['100.64.0.0', 10], // carrier grade NAT
  ['127.0.0.0', 8], // loopback
  ['169.254.0.0', 16], // link local, cloud metadata
  ['172.16.0.0', 12], // private
  ['192.0.0.0', 24], // protocol assignments
  ['192.0.2.0', 24], // documentation
  ['192.168.0.0', 16], // private
  ['198.18.0.0', 15], // benchmarking
  ['198.51.100.0', 24], // documentation
  ['203.0.113.0', 24], // documentation
  ['224.0.0.0', 4], // multicast
  ['240.0.0.0', 4], // reserved and broadcast
];

/** True for any address that is not on the public internet. */
export function isPrivateAddress(address: string): boolean {
  const family = isIP(address);
  if (family === 4) {
    const n = ipv4ToInt(address);
    return PRIVATE_V4.some(([base, bits]) => inRange(n, base, bits));
  }
  if (family === 6) {
    const a = address.toLowerCase().replace(/^\[|\]$/g, '');
    if (a === '::' || a === '::1') return true;
    // IPv4 mapped or translated forms carry a v4 address at the end.
    const mapped = a.match(/(?:^::ffff:|^::|^64:ff9b::)(\d+\.\d+\.\d+\.\d+)$/);
    if (mapped) return isPrivateAddress(mapped[1]);
    if (/^::ffff:[0-9a-f]{1,4}:[0-9a-f]{1,4}$/.test(a)) return true;
    const first = parseInt(a.split(':')[0] || '0', 16);
    if ((first & 0xfe00) === 0xfc00) return true; // fc00::/7 unique local
    if ((first & 0xffc0) === 0xfe80) return true; // fe80::/10 link local
    if ((first & 0xff00) === 0xff00) return true; // ff00::/8 multicast
    if (a.startsWith('2001:db8')) return true; // documentation
    return false;
  }
  return true; // not an IP at all: treat as unsafe
}

/** Throws BlockedUrlError unless the URL points at a public web server. */
export async function assertPublicUrl(raw: string): Promise<URL> {
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    throw new BlockedUrlError('That is not a valid web address.');
  }
  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    throw new BlockedUrlError('Only http and https addresses can be audited.');
  }
  if (url.username || url.password) {
    throw new BlockedUrlError('Addresses with a username or password cannot be audited.');
  }
  if (url.port && url.port !== '80' && url.port !== '443') {
    throw new BlockedUrlError('Only sites on the standard web ports (80 and 443) can be audited.');
  }

  const host = url.hostname.toLowerCase().replace(/^\[|\]$/g, '');
  if (host === 'localhost' || BLOCKED_HOST_SUFFIXES.some((s) => host.endsWith(s)) || !host.includes('.') && !isIP(host)) {
    throw new BlockedUrlError('Only public websites can be audited.');
  }

  if (isIP(host)) {
    if (isPrivateAddress(host)) throw new BlockedUrlError('Only public websites can be audited.');
    return url;
  }

  let addresses: { address: string }[];
  try {
    addresses = await lookup(host, { all: true, verbatim: true });
  } catch {
    // Let the fetch itself report "could not reach", the same as before.
    return url;
  }
  if (addresses.length === 0 || addresses.some((a) => isPrivateAddress(a.address))) {
    throw new BlockedUrlError('Only public websites can be audited.');
  }
  return url;
}

export interface RedirectHop {
  url: string;
  status: number;
}

export interface SafeResponse {
  response: Response;
  /** The URL that finally answered, after every redirect. */
  finalUrl: string;
  /** Each redirect answered before the final URL, in order. Empty when there were none. */
  redirects: RedirectHop[];
}

const MAX_REDIRECTS = 5;

/**
 * fetch with redirects followed by hand, so every hop is checked against the
 * private address rules and the chain is recorded for the redirect check.
 */
export async function safeFetch(
  raw: string,
  init: RequestInit & { timeoutMs?: number } = {}
): Promise<SafeResponse> {
  const { timeoutMs = 12000, ...rest } = init;
  const signal = AbortSignal.timeout(timeoutMs);
  const redirects: RedirectHop[] = [];
  let current = raw;

  for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
    await assertPublicUrl(current);
    const response = await fetch(current, { ...rest, redirect: 'manual', signal });
    const location = response.headers.get('location');
    if (response.status >= 300 && response.status < 400 && location) {
      redirects.push({ url: current, status: response.status });
      // Free the socket; the body of a redirect is never needed.
      response.body?.cancel().catch(() => {});
      current = new URL(location, current).href;
      continue;
    }
    return { response, finalUrl: current, redirects };
  }
  throw new Error(`Too many redirects (more than ${MAX_REDIRECTS}) starting at ${raw}`);
}

/**
 * Read a response body as text, but stop at maxBytes. A visitor could
 * otherwise point the audit at a huge file and tie up the function.
 */
export async function readTextCapped(response: Response, maxBytes = 3_000_000): Promise<{ text: string; truncated: boolean }> {
  if (!response.body) return { text: '', truncated: false };
  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let received = 0;
  let truncated = false;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    if (!value) continue;
    if (received + value.byteLength > maxBytes) {
      chunks.push(value.subarray(0, maxBytes - received));
      received = maxBytes;
      truncated = true;
      reader.cancel().catch(() => {});
      break;
    }
    chunks.push(value);
    received += value.byteLength;
  }
  const buf = new Uint8Array(received);
  let offset = 0;
  for (const c of chunks) {
    buf.set(c, offset);
    offset += c.byteLength;
  }
  // Honour a declared charset when it is one TextDecoder understands.
  const declared = /charset=([^;]+)/i.exec(response.headers.get('content-type') || '')?.[1]?.trim().toLowerCase();
  let decoder: TextDecoder;
  try {
    decoder = new TextDecoder(declared || 'utf-8');
  } catch {
    decoder = new TextDecoder('utf-8');
  }
  return { text: decoder.decode(buf), truncated };
}
