import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import AuthPage from './AuthPage';
import { api, setToken } from '../services/api';

vi.mock('../services/api', () => ({
  api: vi.fn(),
  setToken: vi.fn(),
}));

function LocationDisplay() {
  const location = useLocation();

  return (
    <div data-testid="current-location">
      {location.pathname}
      {location.state?.from ? `|${location.state.from}` : ''}
    </div>
  );
}

function renderAuth({ mode = 'login', initialEntry = '/login', onAuthChange = vi.fn() } = {}) {
  render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <Routes>
        <Route path="/login" element={<AuthPage mode={mode} onAuthChange={onAuthChange} />} />
        <Route path="/register" element={<AuthPage mode={mode} onAuthChange={onAuthChange} />} />
        <Route path="/dashboard" element={<LocationDisplay />} />
        <Route path="/" element={<LocationDisplay />} />
        <Route path="/events/:id" element={<LocationDisplay />} />
      </Routes>
    </MemoryRouter>,
  );

  return { onAuthChange };
}

describe('AuthPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it('menampilkan halaman login dan pilihan akun demo', () => {
    renderAuth();

    expect(screen.getByRole('heading', { name: 'Good to see you.' })).toBeInTheDocument();

    expect(screen.getByLabelText('Pilih jenis akun')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Mahasiswa/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Organizer/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Admin/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign in' })).toBeInTheDocument();
  });

  it('mengisi email dan password demo mahasiswa', async () => {
    const user = userEvent.setup();
    renderAuth();

    await user.click(screen.getByRole('button', { name: /Mahasiswa/i }));

    expect(screen.getByLabelText('Email kampus')).toHaveValue('student@campuspulse.local');
    expect(screen.getByLabelText('Password')).toHaveValue('CampusPulse123!');
  });

  it('mengisi email dan password demo organizer', async () => {
    const user = userEvent.setup();
    renderAuth();

    await user.click(screen.getByRole('button', { name: /Organizer/i }));

    expect(screen.getByLabelText('Email kampus')).toHaveValue('organizer@campuspulse.local');
    expect(screen.getByLabelText('Password')).toHaveValue('CampusPulse123!');
  });

  it('mengisi email dan password demo admin', async () => {
    const user = userEvent.setup();
    renderAuth();

    await user.click(screen.getByRole('button', { name: /Admin/i }));

    expect(screen.getByLabelText('Email kampus')).toHaveValue('admin@campuspulse.local');
    expect(screen.getByLabelText('Password')).toHaveValue('CampusPulse123!');
  });

  it('login berhasil dan mengarahkan mahasiswa ke beranda', async () => {
    const user = userEvent.setup();
    const onAuthChange = vi.fn();

    api.mockResolvedValueOnce({
      token: 'student-token',
      user: { id: 1, role: 'student' },
    });

    renderAuth({ onAuthChange });

    await user.type(screen.getByLabelText('Email kampus'), 'student@test.com');
    await user.type(screen.getByLabelText('Password'), 'password123');
    await user.click(screen.getByRole('button', { name: 'Sign in' }));

    await waitFor(() => {
      expect(api).toHaveBeenCalledWith('/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          name: '',
          email: 'student@test.com',
          password: 'password123',
        }),
      });
    });

    expect(setToken).toHaveBeenCalledWith('student-token');
    expect(onAuthChange).toHaveBeenCalledWith({
      id: 1,
      role: 'student',
    });
    expect(await screen.findByTestId('current-location')).toHaveTextContent('/');
  });

  it('login berhasil dan mengarahkan admin ke dashboard', async () => {
    const user = userEvent.setup();

    api.mockResolvedValueOnce({
      token: 'admin-token',
      user: { id: 2, role: 'admin' },
    });

    renderAuth();

    await user.type(screen.getByLabelText('Email kampus'), 'admin@test.com');
    await user.type(screen.getByLabelText('Password'), 'password123');
    await user.click(screen.getByRole('button', { name: 'Sign in' }));

    expect(await screen.findByTestId('current-location')).toHaveTextContent('/dashboard');
  });

  it('mengarahkan organizer ke dashboard', async () => {
    const user = userEvent.setup();

    api.mockResolvedValueOnce({
      token: 'organizer-token',
      user: { id: 3, role: 'organizer' },
    });

    renderAuth();

    await user.type(screen.getByLabelText('Email kampus'), 'organizer@test.com');
    await user.type(screen.getByLabelText('Password'), 'password123');
    await user.click(screen.getByRole('button', { name: 'Sign in' }));

    expect(await screen.findByTestId('current-location')).toHaveTextContent('/dashboard');
  });

  it('mengutamakan alamat tujuan sebelumnya setelah login', async () => {
    const user = userEvent.setup();

    api.mockResolvedValueOnce({
      token: 'student-token',
      user: { id: 1, role: 'student' },
    });

    renderAuth({
      initialEntry: {
        pathname: '/login',
        state: { from: '/events/42' },
      },
    });

    await user.type(screen.getByLabelText('Email kampus'), 'student@test.com');
    await user.type(screen.getByLabelText('Password'), 'password123');
    await user.click(screen.getByRole('button', { name: 'Sign in' }));

    expect(await screen.findByTestId('current-location')).toHaveTextContent('/events/42');
  });

  it('menampilkan error ketika login gagal', async () => {
    const user = userEvent.setup();

    api.mockRejectedValueOnce(new Error('Email atau password salah'));

    renderAuth();

    await user.type(screen.getByLabelText('Email kampus'), 'wrong@test.com');
    await user.type(screen.getByLabelText('Password'), 'wrongpass123');
    await user.click(screen.getByRole('button', { name: 'Sign in' }));

    expect(await screen.findByText('Email atau password salah')).toBeInTheDocument();

    expect(setToken).not.toHaveBeenCalled();
  });

  it('menampilkan form registrasi dengan input nama', () => {
    renderAuth({ mode: 'register', initialEntry: '/register' });

    expect(screen.getByRole('heading', { name: 'Create your account' })).toBeInTheDocument();

    expect(screen.getByLabelText('Nama lengkap')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Create account' })).toBeInTheDocument();
  });

  it('registrasi berhasil dan mengarahkan pengguna ke beranda', async () => {
    const user = userEvent.setup();
    const onAuthChange = vi.fn();

    api.mockResolvedValueOnce({
      token: 'new-user-token',
      user: { id: 4, role: 'student' },
    });

    renderAuth({
      mode: 'register',
      initialEntry: '/register',
      onAuthChange,
    });

    await user.type(screen.getByLabelText('Nama lengkap'), 'Budi Santoso');
    await user.type(screen.getByLabelText('Email kampus'), 'budi@test.com');
    await user.type(screen.getByLabelText('Password'), 'password123');
    await user.click(screen.getByRole('button', { name: 'Create account' }));

    await waitFor(() => {
      expect(api).toHaveBeenCalledWith('/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          name: 'Budi Santoso',
          email: 'budi@test.com',
          password: 'password123',
        }),
      });
    });

    expect(setToken).toHaveBeenCalledWith('new-user-token');
    expect(onAuthChange).toHaveBeenCalledWith({
      id: 4,
      role: 'student',
    });
    expect(await screen.findByTestId('current-location')).toHaveTextContent('/');
  });

  it('menampilkan error ketika registrasi gagal', async () => {
    const user = userEvent.setup();

    api.mockRejectedValueOnce(new Error('Email sudah digunakan'));

    renderAuth({
      mode: 'register',
      initialEntry: '/register',
    });

    await user.type(screen.getByLabelText('Nama lengkap'), 'Budi Santoso');
    await user.type(screen.getByLabelText('Email kampus'), 'budi@test.com');
    await user.type(screen.getByLabelText('Password'), 'password123');
    await user.click(screen.getByRole('button', { name: 'Create account' }));

    expect(await screen.findByText('Email sudah digunakan')).toBeInTheDocument();

    expect(setToken).not.toHaveBeenCalled();
  });

  it('menonaktifkan tombol saat permintaan masih diproses', async () => {
    const user = userEvent.setup();

    let resolveRequest;
    api.mockReturnValueOnce(
      new Promise((resolve) => {
        resolveRequest = resolve;
      }),
    );

    renderAuth();

    await user.type(screen.getByLabelText('Email kampus'), 'student@test.com');
    await user.type(screen.getByLabelText('Password'), 'password123');
    await user.click(screen.getByRole('button', { name: 'Sign in' }));

    expect(await screen.findByRole('button', { name: 'Memproses...' })).toBeDisabled();

    resolveRequest({
      token: 'student-token',
      user: { id: 1, role: 'student' },
    });

    await waitFor(() => {
      expect(screen.queryByRole('button', { name: 'Memproses...' })).not.toBeInTheDocument();
    });
  });
});
