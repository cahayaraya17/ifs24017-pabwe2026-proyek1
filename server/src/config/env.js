import path from 'node:path';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const MIN_JWT_SECRET_LENGTH = 24;
const FIFTEEN_MINUTES_MS = 15 * 60 * 1000;

function toNumber(value, fallback) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

/** Konfigurasi aplikasi yang dibaca sekali dari environment variables. */
export const config = Object.freeze({
  port: toNumber(process.env.PORT, 4000),
  dbPath: process.env.DB_PATH || '',
  clientOrigins: (process.env.CLIENT_ORIGIN || 'http://localhost:5173')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean),
  jwt: Object.freeze({
    secret: process.env.JWT_SECRET || '',
    expiresIn: '8h',
  }),
  bcryptRounds: 12,
  authRateLimit: Object.freeze({
    windowMs: FIFTEEN_MINUTES_MS,
    max: toNumber(process.env.AUTH_RATE_LIMIT_MAX, 100),
  }),
});

export function isJwtSecretStrong(secret = config.jwt.secret) {
  return typeof secret === 'string' && secret.length >= MIN_JWT_SECRET_LENGTH;
}

/** Dipanggil saat server start agar konfigurasi yang tidak aman langsung gagal (fail fast). */
export function assertConfig() {
  if (!isJwtSecretStrong()) {
    throw new Error(`JWT_SECRET wajib diisi dengan minimal ${MIN_JWT_SECRET_LENGTH} karakter.`);
  }
}
