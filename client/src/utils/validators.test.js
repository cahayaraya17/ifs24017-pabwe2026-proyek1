import { describe, expect, it } from 'vitest';
import { validateAuthForm, validateEventForm } from './validators';

const validAuth = { name: 'Budi', email: 'budi@example.com', password: 'password123' };
const validEvent = {
  title: 'Workshop',
  location: 'Lab 1',
  capacity: '25',
  start_at: '2027-05-10T09:00',
  end_at: '2027-05-10T11:00',
};

describe('validateAuthForm', () => {
  it('mengembalikan null untuk data login dan registrasi yang valid', () => {
    expect(validateAuthForm(validAuth, true)).toBeNull();
    expect(validateAuthForm({ ...validAuth, name: '' }, false)).toBeNull();
  });

  it('menolak nama pendek hanya pada mode registrasi', () => {
    expect(validateAuthForm({ ...validAuth, name: 'A' }, true)).toBe('Nama minimal 2 karakter.');
    expect(validateAuthForm({ ...validAuth, name: 'A' }, false)).toBeNull();
  });

  it('menolak email dan password yang tidak memenuhi syarat', () => {
    expect(validateAuthForm({ ...validAuth, email: 'budi@' }, false)).toBe(
      'Format email tidak valid.',
    );
    expect(validateAuthForm({ ...validAuth, password: '1234567' }, false)).toBe(
      'Password minimal 8 karakter.',
    );
  });
});

describe('validateEventForm', () => {
  it('mengembalikan null untuk form acara yang valid', () => {
    expect(validateEventForm(validEvent)).toBeNull();
  });

  it('memvalidasi tanggal, judul, lokasi, dan kuota secara berurutan', () => {
    expect(validateEventForm({ ...validEvent, start_at: '' })).toMatch(/wajib diisi/);
    expect(validateEventForm({ ...validEvent, end_at: validEvent.start_at })).toMatch(
      /setelah tanggal mulai/,
    );
    expect(validateEventForm({ ...validEvent, title: ' ab ' })).toMatch(/Judul acara/);
    expect(validateEventForm({ ...validEvent, location: '  ' })).toMatch(/Lokasi/);
    expect(validateEventForm({ ...validEvent, capacity: '0' })).toMatch(/Kuota/);
    expect(validateEventForm({ ...validEvent, capacity: '2.5' })).toMatch(/Kuota/);
  });
});
