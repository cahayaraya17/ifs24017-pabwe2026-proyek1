import { describe, expect, it } from 'vitest';
import { buildEventPayload, validateAuthForm, validateEventForm } from './validators';

const validEvent = {
  title: 'Seminar',
  location: 'Aula',
  start_at: '2027-01-01T09:00',
  end_at: '2027-01-01T11:00',
  capacity: 10,
  category_id: '2',
};

describe('validateAuthForm', () => {
  const valid = { name: 'Budi', email: 'budi@del.ac.id', password: 'password123' };

  it('menerima data valid', () => {
    expect(validateAuthForm(valid, true)).toBeNull();
    expect(validateAuthForm({ ...valid, name: '' }, false)).toBeNull();
  });

  it('menolak nama pendek saat register', () => {
    expect(validateAuthForm({ ...valid, name: 'B' }, true)).toMatch(/Nama/);
  });

  it('menolak email tidak valid', () => {
    expect(validateAuthForm({ ...valid, email: 'salah' }, false)).toMatch(/email/i);
  });

  it('menolak password pendek', () => {
    expect(validateAuthForm({ ...valid, password: '123' }, false)).toMatch(/Password/);
  });
});

describe('validateEventForm', () => {
  it('menerima data valid', () => {
    expect(validateEventForm(validEvent)).toBeNull();
  });

  it('menolak tanggal kosong atau tidak berurutan', () => {
    expect(validateEventForm({ ...validEvent, start_at: '' })).toMatch(/wajib/);
    expect(validateEventForm({ ...validEvent, end_at: validEvent.start_at })).toMatch(/setelah/);
  });

  it('menolak judul, lokasi, dan kuota tidak valid', () => {
    expect(validateEventForm({ ...validEvent, title: 'ab' })).toMatch(/Judul/);
    expect(validateEventForm({ ...validEvent, location: '  ' })).toMatch(/Lokasi/);
    expect(validateEventForm({ ...validEvent, capacity: 0 })).toMatch(/Kuota/);
    expect(validateEventForm({ ...validEvent, capacity: 2.5 })).toMatch(/Kuota/);
  });
});

describe('buildEventPayload', () => {
  it('mengonversi tipe data dan tanggal ISO', () => {
    const payload = buildEventPayload({ ...validEvent, title: '  Seminar  ' });
    expect(payload.title).toBe('Seminar');
    expect(payload.capacity).toBe(10);
    expect(payload.category_id).toBe(2);
    expect(payload.start_at).toMatch(/T.*Z$/);
  });
});
