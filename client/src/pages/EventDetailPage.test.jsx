import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import EventDetailPage from './EventDetailPage';
import { api } from '../services/api';

vi.mock('../services/api', () => ({
  api: vi.fn(),
}));

function LocationDisplay() {
  const location = useLocation();
  return (
    <div data-testid="location">
      {location.pathname}
      {location.state?.from}
    </div>
  );
}

const event = {
  id: 1,
  title: 'Seminar Teknologi',
  category_name: 'Academic',
  description: 'Belajar teknologi terbaru.',
  start_at: '2026-11-15T09:00:00.000Z',
  location: 'Auditorium Kampus',
  registered_count: 10,
  capacity: 100,
  status: 'published',
};

function renderPage({ user = null, id = '1' } = {}) {
  return render(
    <MemoryRouter initialEntries={[`/events/${id}`]}>
      <Routes>
        <Route path="/events/:id" element={<EventDetailPage user={user} />} />
        <Route path="/login" element={<LocationDisplay />} />
        <Route path="/" element={<LocationDisplay />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('EventDetailPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it('menampilkan status loading saat detail belum tersedia', () => {
    api.mockReturnValue(new Promise(() => {}));

    renderPage();

    expect(screen.getByText('Memuat detail acara...')).toBeInTheDocument();
  });

  it('menampilkan detail acara setelah API berhasil', async () => {
    api.mockResolvedValue({ event });

    renderPage();

    expect(await screen.findByRole('heading', { name: 'Seminar Teknologi' })).toBeInTheDocument();

    expect(screen.getByText('Belajar teknologi terbaru.')).toBeInTheDocument();
    expect(screen.getByText('Auditorium Kampus')).toBeInTheDocument();
    expect(screen.getByText('10 / 100')).toBeInTheDocument();
    expect(screen.getByText('90 tempat tersisa')).toBeInTheDocument();
    expect(api).toHaveBeenCalledWith('/events/1');
  });

  it('menampilkan error jika detail acara gagal dimuat', async () => {
    api.mockRejectedValue(new Error('Acara tidak ditemukan'));

    renderPage();

    expect(await screen.findByText('Acara tidak ditemukan')).toBeInTheDocument();

    expect(screen.getByRole('link', { name: 'Kembali' })).toHaveAttribute('href', '/');
  });

  it('mengarahkan pengunjung yang belum login ke halaman login', async () => {
    const user = userEvent.setup();
    api.mockResolvedValue({ event });

    renderPage();

    await user.click(await screen.findByRole('button', { name: /register for event/i }));

    expect(screen.getByTestId('location')).toHaveTextContent('/login/events/1');
    expect(api).toHaveBeenCalledTimes(1);
  });

  it('mendaftarkan pengguna yang sudah login', async () => {
    const user = userEvent.setup();

    api
      .mockResolvedValueOnce({ event })
      .mockResolvedValueOnce({ message: 'Pendaftaran berhasil!' });

    renderPage({ user: { id: 7, name: 'Budi', role: 'student' } });

    await user.click(await screen.findByRole('button', { name: /register for event/i }));

    expect(await screen.findByText('Pendaftaran berhasil!')).toBeInTheDocument();

    expect(api).toHaveBeenNthCalledWith(2, '/events/1/register', {
      method: 'POST',
    });

    expect(screen.getByText('11 / 100')).toBeInTheDocument();
  });

  it('menampilkan error jika pendaftaran gagal', async () => {
    const user = userEvent.setup();

    api.mockResolvedValueOnce({ event }).mockRejectedValueOnce(new Error('Pendaftaran ditutup'));

    renderPage({ user: { id: 7, name: 'Budi', role: 'student' } });

    await user.click(await screen.findByRole('button', { name: /register for event/i }));

    expect(await screen.findByText('Pendaftaran ditutup')).toBeInTheDocument();

    expect(screen.getByRole('button', { name: /register for event/i })).toBeEnabled();
  });

  it('menonaktifkan tombol jika acara tidak dipublikasikan', async () => {
    api.mockResolvedValue({
      event: { ...event, status: 'draft' },
    });

    renderPage();

    expect(await screen.findByRole('button', { name: /register for event/i })).toBeDisabled();
  });

  it('menonaktifkan tombol jika kuota penuh', async () => {
    api.mockResolvedValue({
      event: { ...event, registered_count: 100, capacity: 100 },
    });

    renderPage();

    expect(await screen.findByRole('button', { name: /kuota penuh/i })).toBeDisabled();

    expect(screen.getByText('0 tempat tersisa')).toBeInTheDocument();
  });

  it('menggunakan nilai kategori cadangan jika kategori kosong', async () => {
    api.mockResolvedValue({
      event: { ...event, category_name: '' },
    });

    renderPage();

    expect(await screen.findByText('CAMPUS EVENT')).toBeInTheDocument();
  });

  it('menggunakan pesan sukses cadangan jika API tidak mengirim message', async () => {
    const user = userEvent.setup();

    api.mockResolvedValueOnce({ event }).mockResolvedValueOnce({});

    renderPage({ user: { id: 7, name: 'Budi', role: 'student' } });

    await user.click(await screen.findByRole('button', { name: /register for event/i }));

    expect(await screen.findByText('Pendaftaran berhasil!')).toBeInTheDocument();
  });

  it('memakai pesan default dan hitungan awal 0 saat respons pendaftaran minimal', async () => {
    const user = userEvent.setup();
    api
      .mockResolvedValueOnce({
        event: { ...event, registered_count: undefined },
      })
      .mockResolvedValueOnce({});

    renderPage({ user: { id: 1, name: 'Budi', role: 'student' } });

    await user.click(await screen.findByRole('button', { name: 'Register for event' }));

    expect(await screen.findByText('Pendaftaran berhasil!')).toBeInTheDocument();
    expect(screen.getByText('1 / 100')).toBeInTheDocument();
  });
});
