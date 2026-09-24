/**
 * Small in memory rate limiter for the public audit endpoints.
 *
 * Why this exists: the PageSpeed endpoint proxies our own Google API key.
 * Without a limit, anyone who finds the URL can loop it against a thousand
 * addresses and burn the daily quota, and every one of those is a cache miss
 * so the CDN does not protect us.
 *
 * Honest limitation: serverless instances do not share memory, so a burst
 * spread across many cold instances gets a higher effective limit than the
 * number below suggests. It stops casual scraping and accidental loops, which
 * is what actually happens. If this ever needs to be exact, it has to move to
 * Redis or Vercel KV.
 */

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

/** Stop the map growing without bound on a long lived instance. */
function sweep(now: number) {
  if (buckets.size < 5000) return;
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key);
  }
}

export type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds: number;
};

export function rateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now();
  sweep(now);

  const existing = buckets.get(key);

  if (!existing || existing.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1, retryAfterSeconds: 0 };
  }

  existing.count += 1;

  if (existing.count > limit) {
    return {
      allowed: false,
      remaining: 0,
      retryAfterSeconds: Math.max(1, Math.ceil((existing.resetAt - now) / 1000)),
    };
  }

  return {
    allowed: true,
    remaining: limit - existing.count,
    retryAfterSeconds: 0,
  };
}

/**
 * Best available caller identity. Vercel sets x-forwarded-for; the first entry
 * is the real client. Anything missing falls back to a shared bucket, which is
 * stricter rather than looser.
 */
export function callerKey(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return request.headers.get('x-real-ip') || 'unknown';
}

/** True when the request did not come from one of our own pages. */
export function isOffSiteRequest(request: Request, allowedHosts: string[]): boolean {
  const origin = request.headers.get('origin') || request.headers.get('referer');
  if (!origin) return true;

  try {
    const host = new URL(origin).hostname;
    return !allowedHosts.some((allowed) => host === allowed || host.endsWith(`.${allowed}`));
  } catch {
    return true;
  }
}
