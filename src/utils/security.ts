/**
 * Security utilities for the application
 */

/**
 * Rate limiting store for client-side rate limiting
 */
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

/**
 * Client-side rate limiting function
 * @param key - Unique identifier for the operation (e.g., user ID + action)
 * @param limit - Maximum number of requests allowed
 * @param windowMs - Time window in milliseconds
 * @returns true if request is allowed, false if rate limited
 */
export const isRateLimited = (key: string, limit: number, windowMs: number): boolean => {
  const now = Date.now();
  const entry = rateLimitStore.get(key);

  if (!entry || now > entry.resetTime) {
    // First request or window has reset
    rateLimitStore.set(key, { count: 1, resetTime: now + windowMs });
    return false;
  }

  if (entry.count >= limit) {
    // Rate limit exceeded
    return true;
  }

  // Increment count
  entry.count++;
  rateLimitStore.set(key, entry);
  return false;
};

/**
 * Secure random string generator
 * @param length - Length of the random string
 * @returns Cryptographically secure random string
 */
export const generateSecureRandom = (length: number): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, byte => chars[byte % chars.length]).join('');
};

/**
 * Constant-time string comparison to prevent timing attacks
 * @param a - First string
 * @param b - Second string
 * @returns true if strings are equal
 */
export const constantTimeCompare = (a: string, b: string): boolean => {
  if (a.length !== b.length) {
    return false;
  }

  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }

  return result === 0;
};

/**
 * Clean up old rate limit entries
 */
export const cleanupRateLimit = (): void => {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetTime) {
      rateLimitStore.delete(key);
    }
  }
};

// Clean up every 5 minutes
if (typeof window !== 'undefined') {
  setInterval(cleanupRateLimit, 5 * 60 * 1000);
}