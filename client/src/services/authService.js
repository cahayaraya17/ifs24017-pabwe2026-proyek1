import { api, setToken } from './api';

export async function authenticate(mode, credentials) {
  const data = await api(`/auth/${mode}`, {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
  setToken(data.token);
  return data.user;
}

export async function fetchCurrentUser() {
  const data = await api('/auth/me');
  return data.user;
}

export function logout() {
  setToken(null);
}
