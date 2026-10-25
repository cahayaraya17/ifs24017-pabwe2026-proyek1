import { HttpError } from '../utils/httpError.js';
import { normalizeEmail } from '../utils/parsers.js';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const NAME_LENGTH = { min: 2, max: 100 };
const PASSWORD_LENGTH = { min: 8, max: 100 };
const MAX_EMAIL_LENGTH = 190;

const isBetween = (text, { min, max }) => text.length >= min && text.length <= max;

/** Memvalidasi dan menormalkan data pendaftaran akun baru. */
export function parseRegistrationInput(body = {}) {
  const name = String(body?.name || '').trim();
  const email = normalizeEmail(body?.email);
  const password = String(body?.password || '');

  if (!isBetween(name, NAME_LENGTH)) {
    throw HttpError.badRequest('Nama harus terdiri dari 2–100 karakter.');
  }
  if (!EMAIL_PATTERN.test(email) || email.length > MAX_EMAIL_LENGTH) {
    throw HttpError.badRequest('Format email tidak valid.');
  }
  if (!isBetween(password, PASSWORD_LENGTH)) {
    throw HttpError.badRequest('Password harus terdiri dari 8–100 karakter.');
  }
  return { name, email, password };
}

/** Menormalkan kredensial login (validasi format sengaja tidak dilakukan agar tidak membocorkan info). */
export function parseLoginInput(body = {}) {
  return {
    email: normalizeEmail(body?.email),
    password: String(body?.password || ''),
  };
}
