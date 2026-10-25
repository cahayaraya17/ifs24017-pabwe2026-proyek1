import { describe, expect, it } from 'vitest';
import { isManager } from './roles';
import { placeDirectionsUrl } from './maps';
import { parseDate, toInputDateTime } from './date';

describe('utils', () => {
  it('isManager hanya true untuk admin dan organizer', () => {
    expect(isManager(null)).toBe(false);
    expect(isManager({ role: 'student' })).toBe(false);
    expect(isManager({ role: 'admin' })).toBe(true);
    expect(isManager({ role: 'organizer' })).toBe(true);
  });

  it('placeDirectionsUrl memuat koordinat', () => {
    expect(placeDirectionsUrl({ lat: 1, lng: 2 })).toContain('query=1,2');
  });

  it('parseDate mengembalikan null untuk tanggal tidak valid', () => {
    expect(parseDate('bukan tanggal')).toBeNull();
    expect(parseDate('2027-01-01T00:00:00Z')).toBeInstanceOf(Date);
  });

  it('toInputDateTime memotong ke format datetime-local', () => {
    expect(toInputDateTime('2027-01-01T09:00:00.000Z')).toBe('2027-01-01T09:00');
    expect(toInputDateTime(undefined)).toBe('');
  });
});
