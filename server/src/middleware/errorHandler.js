export function notFound(req, res) {
  res.status(404).json({ error: 'Endpoint tidak ditemukan.' });
}
export function errorHandler(err, req, res, next) {
  console.error(err);
  if (res.headersSent) return next(err);
  res.status(500).json({ error: 'Terjadi kesalahan pada server.' });
}
