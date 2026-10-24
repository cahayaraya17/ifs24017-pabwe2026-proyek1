import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { api, getToken, setToken } from './api';

describe('API service', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('mengembalikan null jika token belum tersedia', () => {
    expect(getToken()).toBeNull();
  });

  it('menyimpan dan membaca token', () => {
    setToken('test-token');

    expect(getToken()).toBe('test-token');
  });

  it('menghapus token jika setToken dipanggil dengan null', () => {
    setToken('test-token');
    setToken(null);

    expect(getToken()).toBeNull();
  });

  it('mengirim request dengan header JSON', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      status: 200,
      ok: true,
      json: async () => ({ events: [] }),
    });
    vi.stubGlobal('fetch', fetchMock);

    await expect(api('/events')).resolves.toEqual({ events: [] });

    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:4000/api/events',
      {
        headers: { 'Content-Type': 'application/json' },
      },
    );
  });

  it('menambahkan bearer token ketika token tersedia', async () => {
    setToken('abc123');

    const fetchMock = vi.fn().mockResolvedValue({
      status: 200,
      ok: true,
      json: async () => ({ user: { id: 1 } }),
    });
    vi.stubGlobal('fetch', fetchMock);

    await api('/auth/me');

    expect(fetchMock.mock.calls[0][1].headers.Authorization).toBe(
      'Bearer abc123',
    );
  });

  it('mengembalikan null untuk respons 204', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        status: 204,
        ok: true,
        json: vi.fn(),
      }),
    );

    await expect(api('/events/1')).resolves.toBeNull();
  });

  it('menggunakan pesan error dari server', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        status: 400,
        ok: false,
        json: async () => ({ error: 'Data tidak valid' }),
      }),
    );

    await expect(api('/events', { method: 'POST' })).rejects.toThrow(
      'Data tidak valid',
    );
  });

  it('menggunakan pesan status jika server tidak menyediakan error', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        status: 500,
        ok: false,
        json: async () => ({}),
      }),
    );

    await expect(api('/events')).rejects.toThrow('Request gagal (500)');
  });

  it('tetap menangani respons yang bukan JSON', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        status: 200,
        ok: true,
        json: async () => {
          throw new Error('Invalid JSON');
        },
      }),
    );

    await expect(api('/events')).resolves.toEqual({});
  });
});
