import { TOKEN_STORAGE_KEY } from '../constants/storage';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';
const NO_CONTENT = 204;

export function getToken() {
  return localStorage.getItem(TOKEN_STORAGE_KEY);
}

export function setToken(token) {
  if (token) localStorage.setItem(TOKEN_STORAGE_KEY, token);
  else localStorage.removeItem(TOKEN_STORAGE_KEY);
}

/** Klien HTTP tunggal: menyisipkan token, mem-parsing JSON, dan melempar Error berpesan jelas. */
export async function api(path, options = {}) {
  const token = getToken();
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const data = response.status === NO_CONTENT ? null : await response.json().catch(() => ({}));

  if (!response.ok) throw new Error(data?.error || `Request gagal (${response.status})`);
  return data;
}
