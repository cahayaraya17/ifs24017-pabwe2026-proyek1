import { beforeEach, describe, expect, it, vi } from 'vitest';
import { api, getToken } from './api';
import { fetchCurrentUser, signIn, signOut } from './authService';

vi.mock('./api', async (importOriginal) => {
  const original = await importOriginal();
  return { ...original, api: vi.fn() };
});

describe('authService', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('mengambil pengguna saat ini dari /auth/me', async () => {
    api.mockResolvedValueOnce({ user: { id: 1 } });

    await expect(fetchCurrentUser()).resolves.toEqual({ user: { id: 1 } });
    expect(api).toHaveBeenCalledWith('/auth/me');
  });

  it('signIn menyimpan token dan mengembalikan pengguna', async () => {
    api.mockResolvedValueOnce({ token: 'abc', user: { id: 7, role: 'student' } });

    await expect(signIn('login', { email: 'a@b.co', password: 'password123' })).resolves.toEqual({
      id: 7,
      role: 'student',
    });
    expect(api).toHaveBeenCalledWith('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: 'a@b.co', password: 'password123' }),
    });
    expect(getToken()).toBe('abc');
  });

  it('signOut menghapus token', () => {
    localStorage.setItem('campuspulse_token', 'abc');

    signOut();

    expect(getToken()).toBeNull();
  });
});
