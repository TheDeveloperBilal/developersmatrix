import { NextRequest, NextResponse } from 'next/server';
import { rateLimit, callerKey } from '@/lib/website-audit/rate-limit';
import { BlockedUrlError } from '@/lib/website-audit/safe-fetch';
import { checkSite, CheckInputError } from '@/lib/ai-crawlers/check';

export const runtime = 'nodejs';
export const maxDuration = 20;

// Two small text files per check, so this can be looser than the full audit.
const LIMIT = 12;
const WINDOW_MS = 60_000;

export async function POST(request: NextRequest) {
  const limit = rateLimit(`crawler-check:${callerKey(request)}`, LIMIT, WINDOW_MS);
  if (!limit.allowed) {
    return NextResponse.json(
      { error: `You have run a lot of checks in the last minute. Please wait about ${Math.max(1, limit.retryAfterSeconds)} seconds and try again.` },
      { status: 429, headers: { 'Retry-After': String(limit.retryAfterSeconds) } },
    );
  }

  let body: { url?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Enter a website address, such as example.com.' }, { status: 400 });
  }

  try {
    const result = await checkSite(body.url);
    return NextResponse.json(result, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    if (error instanceof CheckInputError || error instanceof BlockedUrlError) {
      // The shared URL guard words its errors for the audit.
      return NextResponse.json({ error: error.message.replace('can be audited', 'can be checked') }, { status: 400 });
    }
    return NextResponse.json({ error: 'We could not check that site just now. Please try again in a moment.' }, { status: 502 });
  }
}
