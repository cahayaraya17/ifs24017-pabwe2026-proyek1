import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import App from './App';
import { api, getToken, setToken } from './services/api';

vi.mock('./services/api', () => ({
  api: vi.fn(),
  getToken: vi.fn(),
  setToken: vi.fn(),
}));

vi.mock('./components/Navbar', () => ({
  default: ({ user }) => (
    <div>
      <span>Navbar</span>
      <span>{user ? user.name : 'Guest'}</span>
    </div>
  ),
}));

vi.mock('./pages/HomePage', () => ({
  default: () => <h1>Home Page</h1>,
}));

vi.mock('./pages/AuthPage', () => ({
  default: ({ mode }) => <h1>{mode === 'login' ? 'Login Page' : 'Register Page'}</h1>,
}));

vi.mock('./pages/EventDetailPage', () => ({
  default: () => <h1>Event Detail Page</h1>,
}));

vi.mock('./pages/DashboardPage', () => ({
  default: () => <h1>Dashboard Page</h1>,
}));

vi.mock('./pages/MyRegistrationsPage', () => ({
  default: () => <h1>My Registrations Page</h1>,
}));

vi.mock('./pages/CampusMapPage', () => ({
  default: () => <h1>Campus Map Page</h1>,
}));

function renderApp(path = '/') {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  );
}

describe('App', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getToken.mockReturnValue(null);
    api.mockResolvedValue({ user: { id: 1, name: 'Budi', role: 'admin' } });
  });

  afterEach(() => {
    cleanup();
  });

  it('menampilkan halaman utama setelah aplikasi siap', async () => {
    renderApp('/');
    expect(await screen.findByRole('heading', { name: 'Home Page' })).toBeInTheDocument();
    expect(screen.getByText('Navbar')).toBeInTheDocument();
    expect(screen.getByText('Guest')).toBeInTheDocument();
  });

  it('menampilkan halaman login ketika membuka /login sebagai tamu', async () => {
    renderApp('/login');
    expect(await screen.findByRole('heading', { name: 'Login Page' })).toBeInTheDocument();
  });

  it('menampilkan halaman register ketika membuka /register sebagai tamu', async () => {
    renderApp('/register');
    expect(await screen.findByRole('heading', { name: 'Register Page' })).toBeInTheDocument();
  });

  it('menampilkan halaman login ketika membuka /auth/login tanpa redirect', async () => {
    renderApp('/auth/login');
    expect(await screen.findByRole('heading', { name: 'Login Page' })).toBeInTheDocument();
  });

  it('menampilkan halaman register ketika membuka /auth/register tanpa redirect', async () => {
    renderApp('/auth/register');
    expect(await screen.findByRole('heading', { name: 'Register Page' })).toBeInTheDocument();
  });

  it('menampilkan halaman detail acara', async () => {
    renderApp('/events/12');
    expect(await screen.findByRole('heading', { name: 'Event Detail Page' })).toBeInTheDocument();
  });

  it('menampilkan halaman peta kampus', async () => {
    renderApp('/map');
    expect(await screen.findByRole('heading', { name: 'Campus Map Page' })).toBeInTheDocument();
  });

  it('mengarahkan tamu dari halaman registrasi ke login', async () => {
    renderApp('/my-registrations');
    expect(await screen.findByRole('heading', { name: 'Login Page' })).toBeInTheDocument();
  });

  it('mengarahkan tamu dari dashboard ke login', async () => {
    renderApp('/dashboard');
    expect(await screen.findByRole('heading', { name: 'Login Page' })).toBeInTheDocument();
  });

  it('mengarahkan user yang tidak memiliki role sesuai ke halaman utama', async () => {
    getToken.mockReturnValue('valid-token');
    api.mockResolvedValue({ user: { id: 2, name: 'Sari', role: 'student' } });

    renderApp('/dashboard');

    expect(await screen.findByRole('heading', { name: 'Home Page' })).toBeInTheDocument();
  });

  it('mengizinkan admin membuka dashboard setelah token dipulihkan', async () => {
    getToken.mockReturnValue('valid-token');

    renderApp('/dashboard');

    expect(await screen.findByRole('heading', { name: 'Dashboard Page' })).toBeInTheDocument();
    expect(api).toHaveBeenCalledWith('/auth/me');
  });

  it('mengizinkan user login membuka halaman registrasi miliknya', async () => {
    getToken.mockReturnValue('valid-token');
    api.mockResolvedValue({ user: { id: 2, name: 'Budi', role: 'student' } });

    renderApp('/my-registrations');

    expect(
      await screen.findByRole('heading', { name: 'My Registrations Page' }),
    ).toBeInTheDocument();
  });

  it('mengarahkan user yang sudah login dari halaman login ke halaman utama', async () => {
    getToken.mockReturnValue('valid-token');

    renderApp('/login');

    expect(await screen.findByRole('heading', { name: 'Home Page' })).toBeInTheDocument();
  });

  it('menghapus token ketika pemulihan sesi gagal', async () => {
    getToken.mockReturnValue('expired-token');
    api.mockRejectedValue(new Error('Sesi tidak valid'));

    renderApp('/');

    expect(await screen.findByRole('heading', { name: 'Home Page' })).toBeInTheDocument();
    await waitFor(() => expect(setToken).toHaveBeenCalledWith(null));
  });

  it('mengarahkan path yang tidak dikenal ke halaman utama', async () => {
    renderApp('/halaman-tidak-ada');
    expect(await screen.findByRole('heading', { name: 'Home Page' })).toBeInTheDocument();
  });
});
