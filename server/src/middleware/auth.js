import { HttpError } from '../utils/httpError.js';
import { verifyToken } from '../utils/token.js';

const BEARER_PREFIX = 'Bearer ';

function extractBearerToken(req) {
  const header = req.headers.authorization || '';
  return header.startsWith(BEARER_PREFIX) ? header.slice(BEARER_PREFIX.length) : null;
}

function attachUser(req, token) {
  try {
    req.user = verifyToken(token);
  } catch {
    throw HttpError.unauthorized('Sesi tidak valid atau telah kedaluwarsa.');
  }
}

/** Mewajibkan token JWT yang valid. */
export function requireAuth(req, res, next) {
  const token = extractBearerToken(req);
  if (!token) throw HttpError.unauthorized('Silakan login terlebih dahulu.');

  attachUser(req, token);
  next();
}

/** Token bersifat opsional, tetapi bila dikirim harus valid. */
export function optionalAuth(req, res, next) {
  const token = extractBearerToken(req);
  if (token) attachUser(req, token);
  next();
}

/** Membatasi akses berdasarkan peran pengguna. */
export function allowRoles(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      throw HttpError.forbidden('Kamu tidak memiliki izin untuk tindakan ini.');
    }
    next();
  };
}
