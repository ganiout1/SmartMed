/**
 * In-memory rate limiter using a sliding window approach.
 * Works well for Vercel serverless — provides per-instance rate limiting.
 * For production-grade DDoS protection, use Cloudflare or Vercel Firewall.
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

interface RateLimitConfig {
  interval: number; // Window duration in milliseconds
  maxRequests: number; // Max requests per window
}

interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  resetTime: number;
}

// Global store (persists across requests within the same serverless instance)
const rateLimitStore = new Map<string, RateLimitEntry>();

// Periodic cleanup to prevent memory leaks (every 5 minutes)
let lastCleanup = Date.now();
const CLEANUP_INTERVAL = 5 * 60 * 1000;

function cleanup() {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL) return;
  lastCleanup = now;

  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}

/**
 * Check if a request should be rate limited.
 * @param identifier - Unique identifier for the client (e.g., IP address)
 * @param config - Rate limit configuration
 * @returns RateLimitResult with success=false if rate limited
 */
export function rateLimit(
  identifier: string,
  config: RateLimitConfig
): RateLimitResult {
  cleanup();

  const now = Date.now();
  const key = identifier;
  const entry = rateLimitStore.get(key);

  // If no entry or window expired, create new entry
  if (!entry || now > entry.resetTime) {
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + config.interval,
    });
    return {
      success: true,
      limit: config.maxRequests,
      remaining: config.maxRequests - 1,
      resetTime: now + config.interval,
    };
  }

  // Window still active
  if (entry.count < config.maxRequests) {
    entry.count++;
    return {
      success: true,
      limit: config.maxRequests,
      remaining: config.maxRequests - entry.count,
      resetTime: entry.resetTime,
    };
  }

  // Rate limited
  return {
    success: false,
    limit: config.maxRequests,
    remaining: 0,
    resetTime: entry.resetTime,
  };
}

/**
 * Get the client IP address from request headers.
 * Supports Vercel, Cloudflare, and standard proxies.
 */
export function getClientIp(headers: Headers): string {
  return (
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headers.get("x-real-ip") ||
    headers.get("cf-connecting-ip") ||
    "unknown"
  );
}

// Pre-configured rate limit configs for common use cases
export const RATE_LIMITS = {
  login: { interval: 60_000, maxRequests: 10 },       // 10 per minute
  signup: { interval: 60_000, maxRequests: 5 },        // 5 per minute
  forgotPassword: { interval: 60_000, maxRequests: 3 },// 3 per minute
  authCallback: { interval: 60_000, maxRequests: 10 }, // 10 per minute
  general: { interval: 60_000, maxRequests: 100 },     // 100 per minute
} as const;
