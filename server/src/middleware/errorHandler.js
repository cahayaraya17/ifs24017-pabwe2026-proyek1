import { HttpError } from '../utils/httpError.js';

export function notFound(req, res) {
  res.status(404).json({ error: 'Endpoint tidak ditemukan.' });
}

/** Penanganan error terpusat: detail teknis hanya dicatat di log, tidak dikirim ke klien. */
// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  if (res.headersSent) return next(err);

  if (err instanceof HttpError) {
    return res.status(err.status).json({ error: err.message });
  }

  if (err?.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'Format JSON tidak valid.' });
  }

  console.error(err);
  return res.status(500).json({ error: 'Terjadi kesalahan pada server.' });
}
