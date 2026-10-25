import { HttpError } from '../utils/httpError.js';

/**
 * Pembatas laju sederhana berbasis memori (per alamat IP).
 * Cukup untuk satu instance; gunakan penyimpanan terdistribusi bila server di-scale horizontal.
 */
export function createRateLimiter({ windowMs, max }) {
  const hits = new Map();

  return function rateLimiter(req, res, next) {
    const now = Date.now();
    const key = req.ip;
    const entry = hits.get(key);

    if (!entry || entry.resetAt <= now) {
      hits.set(key, { count: 1, resetAt: now + windowMs });
      return next();
    }

    entry.count += 1;
    if (entry.count > max) {
      res.setHeader('Retry-After', Math.ceil((entry.resetAt - now) / 1000));
      throw new HttpError(429, 'Terlalu banyak percobaan. Coba lagi beberapa saat lagi.');
    }
    return next();
  };
}
