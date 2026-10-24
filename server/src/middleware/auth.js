import jwt from 'jsonwebtoken';

export function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Silakan login terlebih dahulu.' });
  try {
    const secret = process.env.JWT_SECRET;
    if (!secret || secret.length < 24) throw new Error('JWT_SECRET belum dikonfigurasi dengan aman.');
    req.user = jwt.verify(token, secret);
    return next();
  } catch {
    return res.status(401).json({ error: 'Sesi tidak valid atau telah kedaluwarsa.' });
  }
}

export function allowRoles(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Kamu tidak memiliki izin untuk tindakan ini.' });
    }
    return next();
  };
}
