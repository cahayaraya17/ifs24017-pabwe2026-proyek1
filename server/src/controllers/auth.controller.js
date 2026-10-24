import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../config/database.js';

function publicUser(user) {
  return { id: user.id, name: user.name, email: user.email, role: user.role };
}
function issueToken(user) {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 24) throw new Error('JWT_SECRET harus berisi minimal 24 karakter.');
  return jwt.sign(publicUser(user), secret, { expiresIn: '8h' });
}

export function register(req, res) {
  const name = String(req.body?.name || '').trim();
  const email = String(req.body?.email || '').trim().toLowerCase();
  const password = String(req.body?.password || '');
  if (name.length < 2 || name.length > 100) return res.status(400).json({ error: 'Nama harus terdiri dari 2–100 karakter.' });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 190) return res.status(400).json({ error: 'Format email tidak valid.' });
  if (password.length < 8 || password.length > 100) return res.status(400).json({ error: 'Password harus terdiri dari 8–100 karakter.' });
  try {
    const hash = bcrypt.hashSync(password, 12);
    const result = db.prepare('INSERT INTO users(name,email,password_hash,role) VALUES(?,?,?,?)').run(name,email,hash,'student');
    const user = db.prepare('SELECT * FROM users WHERE id=?').get(result.lastInsertRowid);
    return res.status(201).json({ token: issueToken(user), user: publicUser(user) });
  } catch (err) {
    if (String(err.message).includes('UNIQUE')) return res.status(409).json({ error: 'Email sudah terdaftar.' });
    throw err;
  }
}

export function login(req, res) {
  const email = String(req.body?.email || '').trim().toLowerCase();
  const password = String(req.body?.password || '');
  const user = db.prepare('SELECT * FROM users WHERE email=?').get(email);
  if (!user || !bcrypt.compareSync(password, user.password_hash)) {
    return res.status(401).json({ error: 'Email atau password salah.' });
  }
  return res.json({ token: issueToken(user), user: publicUser(user) });
}

export function me(req, res) {
  const user = db.prepare('SELECT id,name,email,role FROM users WHERE id=?').get(req.user.id);
  if (!user) return res.status(404).json({ error: 'Pengguna tidak ditemukan.' });
  return res.json({ user });
}
