const LOCALE = 'id-ID';

export function parseDate(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function formatDay(date) {
  return date.toLocaleDateString(LOCALE, { day: '2-digit' });
}

export function formatMonthShort(date) {
  return date.toLocaleDateString(LOCALE, { month: 'short' }).toUpperCase();
}

export function formatDateShort(date) {
  return date.toLocaleDateString(LOCALE, { day: 'numeric', month: 'short', year: 'numeric' });
}

export function formatDateLong(date) {
  return date.toLocaleDateString(LOCALE, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function formatTime(date) {
  return date.toLocaleTimeString(LOCALE, { hour: '2-digit', minute: '2-digit' });
}

export function formatDateTime(value) {
  return new Date(value).toLocaleString(LOCALE, { dateStyle: 'medium', timeStyle: 'short' });
}

export function formatDateNumeric(value) {
  return new Date(value).toLocaleDateString(LOCALE);
}

export function toInputDateTime(value) {
  return value?.slice(0, 16) || '';
}
