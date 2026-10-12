import { createHash, randomBytes } from "node:crypto";

/**
 * Contact-form rate limiting.
 *
 * - With UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN set, limits are
 *   shared across every server instance (recommended for serverless hosting).
 * - Otherwise an in-memory limiter is used. It is accurate on a single
 *   long-running server but only best-effort on serverless platforms, where
 *   each instance keeps its own counters.
 *
 * IP addresses are never stored: keys are salted SHA-256 hashes that expire
 * with the window.
 */
export const RATE_LIMIT = { max: 5, windowMs: 10 * 60 * 1000 } as const;

type Limit = { max: number; windowMs: number };
type Result = { allowed: boolean };

const memory = new Map<string, { count: number; resetAt: number }>();
const processSalt = randomBytes(16).toString("hex");

export function memoryLimit(key: string, now = Date.now(), limit: Limit = RATE_LIMIT): Result {
  if (memory.size > 10_000) {
    for (const [k, entry] of memory) if (entry.resetAt <= now) memory.delete(k);
  }
  const entry = memory.get(key);
  if (!entry || entry.resetAt <= now) {
    memory.set(key, { count: 1, resetAt: now + limit.windowMs });
    return { allowed: true };
  }
  entry.count += 1;
  return { allowed: entry.count <= limit.max };
}

export function resetMemoryLimiter() {
  memory.clear();
}

async function upstashLimit(url: string, token: string, key: string): Promise<Result> {
  const response = await fetch(`${url.replace(/\/$/, "")}/pipeline`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify([
      ["SET", key, "0", "PX", String(RATE_LIMIT.windowMs), "NX"],
      ["INCR", key],
    ]),
    signal: AbortSignal.timeout(3000),
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`Upstash responded with ${response.status}`);
  const results = (await response.json()) as Array<{ result?: unknown }>;
  const count = Number(results[1]?.result);
  if (!Number.isFinite(count)) throw new Error("Unexpected Upstash response");
  return { allowed: count <= RATE_LIMIT.max };
}

export function clientKey(ip: string, salt: string): string {
  return "contact:" + createHash("sha256").update(`${salt}:${ip}`).digest("hex").slice(0, 32);
}

export function usesSharedRateLimiter(env: NodeJS.ProcessEnv = process.env): boolean {
  return Boolean(env.UPSTASH_REDIS_REST_URL?.trim() && env.UPSTASH_REDIS_REST_TOKEN?.trim());
}

export async function checkRateLimit(ip: string, env: NodeJS.ProcessEnv = process.env): Promise<Result> {
  const url = env.UPSTASH_REDIS_REST_URL?.trim();
  const token = env.UPSTASH_REDIS_REST_TOKEN?.trim();
  if (url && token) {
    // A salt derived from the secret token keeps keys stable across instances.
    const salt = createHash("sha256").update(token).digest("hex");
    try {
      return await upstashLimit(url, token, clientKey(ip, salt));
    } catch {
      console.warn("[contact] shared rate limiter unavailable; falling back to in-memory limiter");
    }
  }
  return memoryLimit(clientKey(ip, processSalt));
}

/** Best-effort client IP from proxy headers set by the hosting platform. Cloudflare's header wins when present. */
export function getClientIp(headers: Headers): string {
  const cloudflare = headers.get("cf-connecting-ip")?.trim();
  const forwarded = headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return cloudflare || forwarded || headers.get("x-real-ip")?.trim() || "unknown";
}
