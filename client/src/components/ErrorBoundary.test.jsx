import { useState } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ErrorBoundary from './ErrorBoundary';

function Bomb({ explode }) {
  if (explode) throw new Error('boom');
  return <p>Aman</p>;
}

function Harness() {
  const [explode, setExplode] = useState(true);
  return (
    <>
      <button onClick={() => setExplode(false)}>perbaiki</button>
      <ErrorBoundary>
        <Bomb explode={explode} />
      </ErrorBoundary>
    </>
  );
}

describe('ErrorBoundary', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });
  afterEach(cleanup);

  it('menampilkan children ketika tidak ada error', () => {
    render(
      <ErrorBoundary>
        <Bomb explode={false} />
      </ErrorBoundary>,
    );
    expect(screen.getByText('Aman')).toBeInTheDocument();
  });

  it('menampilkan fallback ketika terjadi error render', () => {
    render(
      <ErrorBoundary>
        <Bomb explode />
      </ErrorBoundary>,
    );
    expect(screen.getByRole('alert')).toHaveTextContent('Terjadi kesalahan');
  });

  it('dapat dipulihkan lewat tombol coba lagi', async () => {
    const user = userEvent.setup();
    render(<Harness />);
    await user.click(screen.getByRole('button', { name: 'perbaiki' }));
    await user.click(screen.getByRole('button', { name: /Coba lagi/i }));
    expect(screen.getByText('Aman')).toBeInTheDocument();
  });
});
