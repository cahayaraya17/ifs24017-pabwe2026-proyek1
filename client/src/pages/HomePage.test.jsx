import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../test-utils';
import HomePage from './HomePage';

vi.mock('../services/api', () => ({
  api: vi.fn(),
}));

vi.mock('../components/events/EventCard', () => ({
  default: ({ event }) => (
    <article data-testid="event-card">{event.title || event.name || `Event ${event.id}`}</article>
  ),
}));

import { api } from '../services/api';

function renderHomePage() {
  return renderWithProviders(<HomePage />);
}

describe('HomePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it('menampilkan status loading saat acara sedang dimuat', () => {
    api.mockReturnValue(new Promise(() => {}));

    renderHomePage();

    expect(screen.getByText('Memuat acara kampus...')).toBeInTheDocument();
  });

  it('menampilkan daftar acara setelah API berhasil', async () => {
    api.mockResolvedValue({
      events: [
        { id: 1, title: 'Seminar Teknologi' },
        { id: 2, title: 'Workshop React' },
      ],
    });

    renderHomePage();

    expect(await screen.findByText('Seminar Teknologi')).toBeInTheDocument();
    expect(screen.getByText('Workshop React')).toBeInTheDocument();
    expect(screen.getByText('2 events found')).toBeInTheDocument();
  });

  it('menampilkan pesan ketika tidak ada acara yang cocok', async () => {
    api.mockResolvedValue({ events: [] });

    renderHomePage();

    expect(await screen.findByText('Belum ada acara yang cocok.')).toBeInTheDocument();
    expect(screen.getByText('0 events found')).toBeInTheDocument();
  });

  it('menampilkan pesan error ketika API gagal', async () => {
    api.mockRejectedValue(new Error('Server tidak tersedia'));

    renderHomePage();

    expect(await screen.findByText('Belum dapat memuat acara.')).toBeInTheDocument();
    expect(screen.getByText('Server tidak tersedia')).toBeInTheDocument();
  });

  it('mengirim kata kunci pencarian yang sudah di-trim ke API', async () => {
    const user = userEvent.setup();
    api.mockResolvedValue({ events: [] });

    renderHomePage();

    await screen.findByText('Belum ada acara yang cocok.');

    await user.type(screen.getByPlaceholderText('Cari acara, seminar, workshop...'), '  seminar  ');

    await waitFor(() => {
      expect(api).toHaveBeenLastCalledWith('/events?q=seminar');
    });
  });

  it('mengirim kategori pilihan ke API', async () => {
    const user = userEvent.setup();
    api.mockResolvedValue({ events: [] });

    renderHomePage();

    await screen.findByText('Belum ada acara yang cocok.');
    await user.click(screen.getByRole('button', { name: 'Workshop' }));

    await waitFor(() => {
      expect(api).toHaveBeenLastCalledWith('/events?category=Workshop');
    });
  });

  it('mengirim pencarian dan kategori secara bersamaan', async () => {
    const user = userEvent.setup();
    api.mockResolvedValue({ events: [] });

    renderHomePage();

    await screen.findByText('Belum ada acara yang cocok.');

    await user.type(screen.getByPlaceholderText('Cari acara, seminar, workshop...'), 'React');
    await user.click(screen.getByRole('button', { name: 'Workshop' }));

    await waitFor(() => {
      expect(api).toHaveBeenLastCalledWith('/events?q=React&category=Workshop');
    });
  });

  it('mengirim ulang permintaan tanpa filter saat kategori Semua dipilih', async () => {
    const user = userEvent.setup();
    api.mockResolvedValue({ events: [] });

    renderHomePage();

    await screen.findByText('Belum ada acara yang cocok.');

    await user.click(screen.getByRole('button', { name: 'Kompetisi' }));
    await waitFor(() => {
      expect(api).toHaveBeenLastCalledWith('/events?category=Kompetisi');
    });

    await user.click(screen.getByRole('button', { name: 'Semua' }));
    await waitFor(() => {
      expect(api).toHaveBeenLastCalledWith('/events?');
    });
  });

  it('menganggap respons tanpa daftar acara sebagai daftar kosong', async () => {
    api.mockResolvedValue({});

    renderHomePage();

    expect(await screen.findByText('Belum ada acara yang cocok.')).toBeInTheDocument();
    expect(screen.getByText('0 events found')).toBeInTheDocument();
  });
});
