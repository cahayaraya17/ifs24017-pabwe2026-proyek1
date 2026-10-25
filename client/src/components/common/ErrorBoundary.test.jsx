import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ErrorBoundary from './ErrorBoundary';

function Bomb() {
  throw new Error('boom');
}

describe('ErrorBoundary', () => {
  afterEach(() => {
    cleanup();
  });

  it('menampilkan anak komponen ketika tidak ada error', () => {
    render(
      <ErrorBoundary>
        <p>Aman</p>
      </ErrorBoundary>,
    );

    expect(screen.getByText('Aman')).toBeInTheDocument();
  });

  it('menampilkan pesan pengganti dan mencatat error ketika anak melempar error', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <Bomb />
      </ErrorBoundary>,
    );

    expect(screen.getByRole('heading', { name: 'Terjadi kesalahan.' })).toBeInTheDocument();
    expect(consoleError).toHaveBeenCalledWith(
      'Unhandled UI error:',
      expect.any(Error),
      expect.any(String),
    );
  });

  it('memuat ulang halaman ketika tombol Muat ulang ditekan', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const reload = vi.fn();
    vi.stubGlobal('location', { ...window.location, reload });

    render(
      <ErrorBoundary>
        <Bomb />
      </ErrorBoundary>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Muat ulang' }));

    expect(reload).toHaveBeenCalledTimes(1);
    vi.unstubAllGlobals();
  });
});
