import { api } from './api';

export function fetchCurrentUser() {
  return api('/auth/me');
}

/** `mode` bernilai 'login' atau 'register'. */
export function authenticate(mode, credentials) {
  return api(`/auth/${mode}`, { method: 'POST', body: JSON.stringify(credentials) });
}
