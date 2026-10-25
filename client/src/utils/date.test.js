import { describe, expect, it } from 'vitest';
import {
  formatDateTime,
  formatLongDate,
  formatShortDate,
  formatTime,
  getEventDateParts,
  toValidDate,
} from './date';

describe('utils/date', () => {
  it('toValidDate mengembalikan Date untuk nilai valid dan null untuk nilai tidak valid', () => {
    expect(toValidDate('2027-05-10T09:00:00.000Z')).toBeInstanceOf(Date);
    expect(toValidDate('bukan tanggal')).toBeNull();
  });

  it('memformat tanggal dan waktu memakai locale Indonesia', () => {
    const value = '2027-05-10T09:00:00.000Z';

    expect(formatLongDate(value)).toMatch(/2027/);
    expect(formatShortDate(value)).toMatch(/2027/);
    expect(formatTime(value)).toMatch(/\d{2}[.:]\d{2}/);
    expect(formatDateTime(value)).toMatch(/2027/);
  });

  it('getEventDateParts memberi teks pengganti ketika tanggal tidak valid', () => {
    expect(getEventDateParts('bukan tanggal')).toEqual({
      day: '—',
      month: '',
      label: 'Jadwal menyusul',
    });
  });

  it('getEventDateParts menghasilkan hari, bulan singkat kapital, dan label lengkap', () => {
    const parts = getEventDateParts('2027-05-10T09:00:00.000Z');

    expect(parts.day).toBe('10');
    expect(parts.month).toBe(parts.month.toUpperCase());
    expect(parts.label).toMatch(/2027/);
  });
});
