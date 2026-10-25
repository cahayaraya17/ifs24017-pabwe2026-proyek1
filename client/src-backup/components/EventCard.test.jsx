import { describe, it, expect } from 'vitest';
import { render, screen, cleanup, within } from '@testing-library/react';
import { afterEach } from 'vitest';
import { renderWithProviders } from '../test-utils';
import EventCard from './EventCard';

afterEach(() => {
  cleanup();
});

const mockEvent = {
  id: 1,
  title: 'Seminar Teknologi Kampus',
  description: 'Seminar teknologi untuk mahasiswa.',
  location: 'Aula Kampus',
  category_name: 'Technology',
  start_at: '2026-11-15T09:00:00',
  registered_count: 25,
  image_url: null,
};

function renderEventCard(eventOverrides = {}, index = 0) {
  const event = { ...mockEvent, ...eventOverrides };

  return renderWithProviders(<EventCard event={event} index={index} />);
}

describe('EventCard', () => {
  it('menampilkan judul acara', () => {
    renderEventCard();

    expect(
      screen.getByRole('heading', {
        name: 'Seminar Teknologi Kampus',
      })
    ).toBeInTheDocument();
  });

  it('menampilkan deskripsi acara', () => {
    renderEventCard();

    expect(
      screen.getByText('Seminar teknologi untuk mahasiswa.')
    ).toBeInTheDocument();
  });

  it('menampilkan deskripsi default jika deskripsi kosong', () => {
    renderEventCard({ description: '' });

    expect(
      screen.getByText(
        'Temukan pengalaman baru dan terhubung dengan komunitas kampus.'
      )
    ).toBeInTheDocument();
  });

  it('menampilkan lokasi acara', () => {
    renderEventCard();

    expect(screen.getByText('Aula Kampus')).toBeInTheDocument();
  });

  it('menampilkan kategori acara', () => {
    renderEventCard();

    expect(screen.getByText('Technology')).toBeInTheDocument();
  });

  it('menampilkan kategori default jika kategori kosong', () => {
    renderEventCard({ category_name: '' });

    expect(screen.getByText('Campus event')).toBeInTheDocument();
  });

  it('menampilkan jumlah peserta terdaftar', () => {
    renderEventCard();

    expect(screen.getByText('25 joined')).toBeInTheDocument();
  });

  it('menampilkan nol peserta jika registered_count bernilai null', () => {
    renderEventCard({ registered_count: null });

    expect(screen.getByText('0 joined')).toBeInTheDocument();
  });

  it('menampilkan nol peserta jika registered_count tidak tersedia', () => {
  renderEventCard({ registered_count: undefined });

  expect(screen.getByText('0 joined')).toBeInTheDocument();
});

  it('menampilkan tanggal acara yang valid', () => {
    renderEventCard();

    const dateArtwork = document.querySelector('.art-date');

    expect(dateArtwork).not.toBeNull();
    expect(dateArtwork.querySelector('strong')).toHaveTextContent('15');
    expect(dateArtwork.querySelector('span')).toHaveTextContent('NOV');

    // Tanggal lengkap berada di bagian metadata acara.
    const metadata = document.querySelector('.event-meta');
    expect(metadata).not.toBeNull();
    expect(
      within(metadata).getByText('15 Nov 2026')
    ).toBeInTheDocument();
  });

  it('menampilkan placeholder jika tanggal tidak valid', () => {
    renderEventCard({ start_at: 'tanggal-tidak-valid' });

    expect(screen.getByText('—')).toBeInTheDocument();
    expect(screen.getByText('Jadwal menyusul')).toBeInTheDocument();
  });

  it('menampilkan tautan menuju detail acara', () => {
    renderEventCard();

    const link = screen.getByRole('link', {
      name: 'Lihat Seminar Teknologi Kampus',
    });

    expect(link).toHaveAttribute('href', '/events/1');
  });

  it('menggunakan palet ungu untuk index 0', () => {
    const { container } = renderEventCard({}, 0);

    expect(container.querySelector('.event-art'))
      .toHaveClass('event-art-purple');
  });

  it('menggunakan palet biru untuk index 1', () => {
    const { container } = renderEventCard({}, 1);

    expect(container.querySelector('.event-art'))
      .toHaveClass('event-art-blue');
  });

  it('menggunakan palet merah muda untuk index 2', () => {
    const { container } = renderEventCard({}, 2);

    expect(container.querySelector('.event-art'))
      .toHaveClass('event-art-pink');
  });

  it('menggunakan palet hijau untuk index 3', () => {
    const { container } = renderEventCard({}, 3);

    expect(container.querySelector('.event-art'))
      .toHaveClass('event-art-green');
  });

  it('mengulangi palet dari awal untuk index 4', () => {
    const { container } = renderEventCard({}, 4);

    expect(container.querySelector('.event-art'))
      .toHaveClass('event-art-purple');
  });
});