import { api, setToken } from './api';

export function fetchCurrentUser() {
  return api('/auth/me');
}

/** `mode` bernilai 'login' atau 'register'. */
export function authenticate(mode, credentials) {
  return api(`/auth/${mode}`, { method: 'POST', body: JSON.stringify(credentials) });
}

/** Autentikasi + menyimpan token sesi. Mengembalikan data pengguna. */
export async function signIn(mode, credentials) {
  const data = await authenticate(mode, credentials);
  setToken(data.token);
  return data.user;
}

/** Menghapus token sesi di sisi klien. */
export function signOut() {
  setToken(null);
}
