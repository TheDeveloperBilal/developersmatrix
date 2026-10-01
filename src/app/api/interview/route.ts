import { NextRequest, NextResponse } from 'next/server';
import { getQuestion, isCategory, isLevel, isRole, pickQuestion } from '@/lib/interview/bank';
import { categoryLabel, LEVELS } from '@/lib/interview/bank-types';
import { evaluateAnswer } from '@/lib/interview/evaluate';
import { rateLimit, callerKey } from '@/lib/website-audit/rate-limit';

export const runtime = 'nodejs';

/**
 * Stateless on purpose. Serverless instances do not share memory, so the
 * browser keeps the session (questions asked, scores) and sends what we need
 * with each request. Checking an answer takes a few milliseconds.
 */

const LIMIT = 40;
const WINDOW_MS = 60_000;
const MAX_ANSWER_CHARS = 6000;
const MAX_EXCLUDE = 200;

type Body = {
  mode?: unknown;
  role?: unknown;
  category?: unknown;
  level?: unknown;
  exclude?: unknown;
  questionId?: unknown;
  answer?: unknown;
};

function bad(error: string, status = 400) {
  return NextResponse.json({ success: false, error }, { status });
}

export async function POST(request: NextRequest) {
  const limit = rateLimit(`interview:${callerKey(request)}`, LIMIT, WINDOW_MS);
  if (!limit.allowed) {
    return NextResponse.json(
      { success: false, error: 'Too many requests in a short time. Please wait a moment and try again.' },
      { status: 429, headers: { 'Retry-After': String(limit.retryAfterSeconds) } }
    );
  }

  let body: Body;
  try {
    body = await request.json();
  } catch {
    return bad('Invalid request. Please refresh the page and try again.');
  }

  const level = isLevel(body.level) ? body.level : 'mid';
  const role = isRole(body.role) ? body.role : null;

  if (body.mode === 'question') {
    if (!role) return bad('Please choose a role.');
    if (!isCategory(body.category)) return bad('Please choose a round.');

    const exclude = Array.isArray(body.exclude)
      ? body.exclude.filter((id): id is string => typeof id === 'string').slice(0, MAX_EXCLUDE)
      : [];

    const q = pickQuestion(role, body.category, level, exclude);
    if (!q) return bad('No questions are available for that combination yet.', 404);

    return NextResponse.json({
      success: true,
      question: {
        id: q.id,
        text: q.question,
        hints: q.hints,
        category: q.category,
        roundLabel: categoryLabel(role, q.category),
        level,
        targetWords: LEVELS.find((l) => l.key === level)?.targetWords ?? 100,
      },
    });
  }

  if (body.mode === 'feedback') {
    const q = typeof body.questionId === 'string' ? getQuestion(body.questionId) : undefined;
    if (!q) return bad('That question could not be found. Please start a new question.');

    const answer = typeof body.answer === 'string' ? body.answer : '';
    if (!answer.trim()) return bad('Write an answer before submitting.');
    if (answer.length > MAX_ANSWER_CHARS) {
      return bad(`That answer is very long. Please keep it under ${MAX_ANSWER_CHARS.toLocaleString()} characters, about two minutes spoken.`);
    }

    try {
      const result = evaluateAnswer(q, answer, level, role);
      return NextResponse.json({ success: true, result });
    } catch (error) {
      console.error('Interview feedback error:', error);
      return bad('Something went wrong while checking your answer. Please try again.', 500);
    }
  }

  return bad('Unknown request.');
}

export async function GET() {
  return NextResponse.json({
    success: true,
    endpoint: 'POST /api/interview',
    modes: {
      question: { role: 'role key', category: 'behavioral | technical | system', level: 'entry | mid | senior', exclude: 'question ids already asked' },
      feedback: { questionId: 'id from the question response', answer: 'string', level: 'entry | mid | senior', role: 'role key' },
    },
  });
}
