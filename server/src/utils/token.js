import jwt from 'jsonwebtoken';
import { config, isJwtSecretStrong } from '../config/env.js';

function requireSecret() {
  if (!isJwtSecretStrong()) {
    throw new Error('JWT_SECRET belum dikonfigurasi dengan aman.');
  }
  return config.jwt.secret;
}

export function signToken(payload) {
  return jwt.sign(payload, requireSecret(), { expiresIn: config.jwt.expiresIn });
}

export function verifyToken(token) {
  return jwt.verify(token, requireSecret());
}
