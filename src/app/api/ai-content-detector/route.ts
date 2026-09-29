import { NextRequest, NextResponse } from 'next/server';
import { analyzeContent, MIN_WORDS } from '@/lib/ai-detector/engine';
import { rateLimit, callerKey } from '@/lib/website-audit/rate-limit';

export const runtime = 'nodejs';

const MAX_CHARS = 50000;
// The check runs in a few milliseconds, so this is about stopping scripted
// abuse, not protecting capacity. Thirty a minute is far more than a person needs.
const LIMIT = 30;
const WINDOW_MS = 60_000;

export async function POST(request: NextRequest) {
  const limit = rateLimit(`detector:${callerKey(request)}`, LIMIT, WINDOW_MS);
  if (!limit.allowed) {
    return NextResponse.json(
      { success: false, error: 'Too many checks in a short time. Please wait a moment and try again.' },
      { status: 429, headers: { 'Retry-After': String(limit.retryAfterSeconds) } }
    );
  }

  let body: { text?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid request.' }, { status: 400 });
  }

  const text = typeof body.text === 'string' ? body.text.trim() : '';
  if (!text) {
    return NextResponse.json({ success: false, error: 'Paste some text to check.' }, { status: 400 });
  }

  if (text.length > MAX_CHARS) {
    return NextResponse.json(
      { success: false, error: `That is too long. Please check up to ${MAX_CHARS.toLocaleString()} characters at a time.` },
      { status: 400 }
    );
  }

  const wordCount = (text.match(/[A-Za-z']+/g) || []).length;
  if (wordCount < MIN_WORDS) {
    return NextResponse.json(
      {
        success: false,
        error: `Please paste at least ${MIN_WORDS} words. You have ${wordCount}. Shorter samples do not carry enough signal to judge.`,
      },
      { status: 400 }
    );
  }

  try {
    const result = analyzeContent(text);
    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error('AI content detector error:', error);
    return NextResponse.json({ success: false, error: 'Something went wrong while checking. Please try again.' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    success: true,
    endpoint: 'POST /api/ai-content-detector',
    body: { text: 'string' },
    limits: { minWords: MIN_WORDS, maxCharacters: MAX_CHARS },
  });
}
