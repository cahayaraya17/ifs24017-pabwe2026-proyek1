import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import Navbar from './Navbar';

vi.mock('../../services/api', () => ({
  setToken: vi.fn(),
}));

import { setToken } from '../../services/api';

function LocationDisplay() {
  const location = useLocation();
  return <div data-testid="current-location">{location.pathname}</div>;
}

function renderNavbar(user = null, onAuthChange = vi.fn()) {
  render(
    <MemoryRouter initialEntries={['/map']}>
      <Navbar user={user} onAuthChange={onAuthChange} />
      <Routes>
        <Route path="*" element={<LocationDisplay />} />
      </Routes>
    </MemoryRouter>,
  );

  return { onAuthChange };
}

describe('Navbar', () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it('menampilkan tombol Sign in untuk pengunjung', () => {
    renderNavbar();

    expect(screen.getByRole('link', { name: /sign in/i })).toHaveAttribute('href', '/login');
    expect(screen.queryByRole('button', { name: /logout/i })).not.toBeInTheDocument();
  });

  it('menampilkan identitas dan tautan My events untuk mahasiswa', () => {
    renderNavbar({ name: 'Budi', role: 'student' });

    expect(screen.getByText('Budi')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /my events/i })).toHaveAttribute(
      'href',
      '/my-registrations',
    );
    expect(screen.queryByRole('link', { name: /dashboard/i })).not.toBeInTheDocument();
  });

  it('menampilkan Dashboard untuk organizer', () => {
    renderNavbar({ name: 'Sari', role: 'organizer' });

    expect(screen.getByRole('link', { name: /dashboard/i })).toHaveAttribute('href', '/dashboard');
  });

  it('menampilkan Dashboard untuk admin', () => {
    renderNavbar({ name: 'Admin', role: 'admin' });

    expect(screen.getByRole('link', { name: /dashboard/i })).toBeInTheDocument();
  });

  it('menghapus token, mengubah autentikasi, dan kembali ke halaman utama saat logout', async () => {
    const user = userEvent.setup();
    const onAuthChange = vi.fn();

    renderNavbar({ name: 'Budi', role: 'student' }, onAuthChange);

    await user.click(screen.getByRole('button', { name: /logout/i }));

    expect(setToken).toHaveBeenCalledWith(null);
    expect(onAuthChange).toHaveBeenCalledWith(null);
    expect(screen.getByTestId('current-location')).toHaveTextContent('/');
  });
});
