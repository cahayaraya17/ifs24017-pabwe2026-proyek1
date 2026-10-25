import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../test-utils';
import MyRegistrationsPage from './MyRegistrationsPage';
import { api } from '../services/api';

vi.mock('../services/api', () => ({
  api: vi.fn(),
}));

function renderPage() {
  return renderWithProviders(<MyRegistrationsPage />);
}

const registration = {
  id: 1,
  title: 'Seminar Teknologi',
  start_at: '2026-11-15T09:00:00.000Z',
  location: 'Auditorium Kampus',
  status: 'registered',
};

describe('MyRegistrationsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(window, 'confirm').mockReturnValue(true);
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it('menampilkan pesan saat belum ada pendaftaran', async () => {
    api.mockResolvedValue({ registrations: [] });

    renderPage();

    expect(
      await screen.findByText(/belum mendaftar acara/i),
    ).toBeInTheDocument();

    expect(
      screen.getByRole('link', { name: /jelajahi acara/i }),
    ).toHaveAttribute('href', '/');
  });

  it('menampilkan daftar acara yang diikuti', async () => {
    api.mockResolvedValue({ registrations: [registration] });

    renderPage();

    expect(
      await screen.findByText('Seminar Teknologi'),
    ).toBeInTheDocument();

    expect(screen.getByText('Auditorium Kampus')).toBeInTheDocument();
    expect(screen.getByText('registered')).toBeInTheDocument();
    expect(api).toHaveBeenCalledWith('/registrations/me');
  });

  it('menampilkan pesan error ketika pemuatan gagal', async () => {
    api.mockRejectedValue(new Error('Gagal memuat pendaftaran'));

    renderPage();

    expect(
      await screen.findByText('Gagal memuat pendaftaran'),
    ).toBeInTheDocument();
  });

  it('mendukung respons tanpa properti registrations', async () => {
    api.mockResolvedValue({});

    renderPage();

    expect(
      await screen.findByText(/belum mendaftar acara/i),
    ).toBeInTheDocument();
  });

  it('membatalkan pendaftaran setelah konfirmasi', async () => {
    const user = userEvent.setup();

    api
      .mockResolvedValueOnce({ registrations: [registration] })
      .mockResolvedValueOnce({})
      .mockResolvedValueOnce({ registrations: [] });

    renderPage();

    await user.click(
      await screen.findByRole('button', { name: /cancel/i }),
    );

    expect(window.confirm).toHaveBeenCalledWith(
      'Batalkan pendaftaran acara ini?',
    );

    await waitFor(() => {
      expect(api).toHaveBeenNthCalledWith(2, '/registrations/1', {
        method: 'DELETE',
      });
      expect(api).toHaveBeenCalledTimes(3);
    });

    expect(
      await screen.findByText(/belum mendaftar acara/i),
    ).toBeInTheDocument();
  });

  it('tidak membatalkan pendaftaran jika konfirmasi ditolak', async () => {
    const user = userEvent.setup();
    vi.mocked(window.confirm).mockReturnValue(false);
    api.mockResolvedValue({ registrations: [registration] });

    renderPage();

    await user.click(
      await screen.findByRole('button', { name: /cancel/i }),
    );

    expect(api).toHaveBeenCalledTimes(1);
    expect(screen.getByText('Seminar Teknologi')).toBeInTheDocument();
  });

  it('menampilkan error ketika pembatalan gagal', async () => {
    const user = userEvent.setup();

    api
      .mockResolvedValueOnce({ registrations: [registration] })
      .mockRejectedValueOnce(new Error('Pembatalan gagal'));

    renderPage();

    await user.click(
      await screen.findByRole('button', { name: /cancel/i }),
    );

    expect(
      await screen.findByText('Pembatalan gagal'),
    ).toBeInTheDocument();
  });

  it('tidak menampilkan tombol Cancel untuk pendaftaran yang sudah selesai statusnya', async () => {
    api.mockResolvedValue({
      registrations: [{ ...registration, status: 'cancelled' }],
    });

    renderPage();

    expect(
      await screen.findByText('cancelled'),
    ).toBeInTheDocument();

    expect(
      screen.queryByRole('button', { name: /cancel/i }),
    ).not.toBeInTheDocument();
  });
});