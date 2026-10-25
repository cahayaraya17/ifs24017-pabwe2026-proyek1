import { describe, expect, it } from 'vitest';
import { buildEventPayload, createEmptyEventForm, toEventFormValues } from './eventForm';

const validForm = {
  title: 'Workshop',
  location: 'Lab',
  capacity: '25',
  category_id: '2',
  start_at: '2027-05-10T09:00',
  end_at: '2027-05-10T11:00',
};

describe('utils/eventForm', () => {
  it('createEmptyEventForm memakai kategori pertama atau kategori default', () => {
    expect(createEmptyEventForm([{ id: 5 }]).category_id).toBe(5);
    expect(createEmptyEventForm().category_id).toBe(1);
  });

  it('toEventFormValues memotong tanggal untuk input datetime-local', () => {
    const values = toEventFormValues({ start_at: '2027-05-10T09:00:00.000Z', end_at: null });

    expect(values.start_at).toBe('2027-05-10T09:00');
    expect(values.end_at).toBe('');
  });

  it('buildEventPayload mengubah angka dan tanggal ke format API', () => {
    const payload = buildEventPayload(validForm);

    expect(payload.capacity).toBe(25);
    expect(payload.category_id).toBe(2);
    expect(payload.start_at).toBe(new Date('2027-05-10T09:00').toISOString());
  });

  it('buildEventPayload menolak tanggal kosong atau urutan tanggal yang salah', () => {
    expect(() => buildEventPayload({ ...validForm, start_at: '' })).toThrow(/wajib diisi/);
    expect(() => buildEventPayload({ ...validForm, end_at: validForm.start_at })).toThrow(
      /setelah tanggal mulai/,
    );
  });
});
