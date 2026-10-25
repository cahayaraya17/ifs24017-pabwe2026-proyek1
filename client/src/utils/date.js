const LOCALE = 'id-ID';

/** Mengembalikan objek Date atau `null` bila nilai bukan tanggal yang valid. */
export function toValidDate(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function formatLongDate(value) {
  return new Date(value).toLocaleDateString(LOCALE, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function formatShortDate(value) {
  return new Date(value).toLocaleDateString(LOCALE);
}

export function formatTime(value) {
  return new Date(value).toLocaleTimeString(LOCALE, { hour: '2-digit', minute: '2-digit' });
}

export function formatDateTime(value) {
  return new Date(value).toLocaleString(LOCALE, { dateStyle: 'medium', timeStyle: 'short' });
}

/** Bagian tanggal untuk kartu acara; memakai teks pengganti bila tanggal tidak valid. */
export function getEventDateParts(value) {
  const date = toValidDate(value);
  if (!date) return { day: '—', month: '', label: 'Jadwal menyusul' };

  return {
    day: date.toLocaleDateString(LOCALE, { day: '2-digit' }),
    month: date.toLocaleDateString(LOCALE, { month: 'short' }).toUpperCase(),
    label: date.toLocaleDateString(LOCALE, { day: 'numeric', month: 'short', year: 'numeric' }),
  };
}
