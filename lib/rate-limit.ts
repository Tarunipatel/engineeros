/**
 * In-memory sliding-window rate limiter. Good enough to slow down casual
 * brute-forcing on a small personal app; not a hard guarantee, since a
 * serverless function can spin up a fresh instance with its own empty
 * counter map at any time. A real guarantee needs shared state (e.g.
 * Vercel KV/Upstash) — deliberately not adding that dependency for two
 * users.
 */
const attempts = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(key: string, max: number, windowMs: number): boolean {
  const now = Date.now();
  const entry = attempts.get(key);

  if (!entry || now > entry.resetAt) {
    attempts.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (entry.count >= max) return false;

  entry.count++;
  return true;
}
