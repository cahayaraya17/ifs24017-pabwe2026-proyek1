import bcrypt from 'bcryptjs';
import { config } from '../config/env.js';
import { ROLES } from '../constants/roles.js';
import { userRepository } from '../repositories/user.repository.js';
import { HttpError } from '../utils/httpError.js';
import { signToken } from '../utils/token.js';
import { parseLoginInput, parseRegistrationInput } from '../validators/auth.validator.js';

function toPublicUser({ id, name, email, role }) {
  return { id, name, email, role };
}

function buildSession(user) {
  const publicUser = toPublicUser(user);
  return { token: signToken(publicUser), user: publicUser };
}

function isUniqueViolation(error) {
  return String(error?.message).includes('UNIQUE');
}

export const authService = {
  register(body) {
    const { name, email, password } = parseRegistrationInput(body);
    const passwordHash = bcrypt.hashSync(password, config.bcryptRounds);

    try {
      const user = userRepository.create({ name, email, passwordHash, role: ROLES.STUDENT });
      return buildSession(user);
    } catch (error) {
      if (isUniqueViolation(error)) throw HttpError.conflict('Email sudah terdaftar.');
      throw error;
    }
  },

  login(body) {
    const { email, password } = parseLoginInput(body);
    const user = userRepository.findByEmail(email);

    if (!user || !bcrypt.compareSync(password, user.password_hash)) {
      throw HttpError.unauthorized('Email atau password salah.');
    }
    return buildSession(user);
  },

  getProfile(userId) {
    const user = userRepository.findById(userId);
    if (!user) throw HttpError.notFound('Pengguna tidak ditemukan.');
    return toPublicUser(user);
  },
};
