import { EVENT_STATUS, EVENT_STATUS_VALUES } from '../constants/statuses.js';
import { HttpError } from '../utils/httpError.js';

const TITLE_LENGTH = { min: 3, max: 160 };
const MAX_LOCATION_LENGTH = 180;
const MAX_DESCRIPTION_LENGTH = 10000;
const CAPACITY_RANGE = { min: 1, max: 100000 };
const IMAGE_URL_PATTERN = /^https?:\/\/.{1,500}$/i;

function toOptionalNumber(value) {
  return value === '' || value == null ? Number.NaN : Number(value);
}

function parseDateRange(startValue, endValue) {
  const start = new Date(startValue);
  const end = new Date(endValue);
  const isValid = !Number.isNaN(start.getTime()) && !Number.isNaN(end.getTime()) && end > start;

  if (!isValid) {
    throw HttpError.badRequest('Tanggal tidak valid atau waktu selesai harus setelah waktu mulai.');
  }
  return { start, end };
}

/**
 * Memvalidasi payload acara dan mengembalikan nilai yang sudah dinormalkan.
 * Fungsi ini murni (tanpa akses database); keberadaan kategori dicek di service.
 */
export function parseEventInput(body = {}) {
  const title = String(body.title || '').trim();
  const description = String(body.description || '').trim();
  const location = String(body.location || '').trim();
  const status = String(body.status || EVENT_STATUS.DRAFT).trim();
  const imageUrl = String(body.image_url || '').trim();
  const categoryId = toOptionalNumber(body.category_id);
  const capacity = toOptionalNumber(body.capacity);

  if (title.length < TITLE_LENGTH.min || title.length > TITLE_LENGTH.max) {
    throw HttpError.badRequest('Judul acara harus terdiri dari 3–160 karakter.');
  }
  if (!location || location.length > MAX_LOCATION_LENGTH) {
    throw HttpError.badRequest('Lokasi wajib diisi (maksimal 180 karakter).');
  }
  if (!Number.isInteger(categoryId)) {
    throw HttpError.badRequest('Kategori tidak valid. Pilih kategori yang tersedia.');
  }
  if (
    !Number.isInteger(capacity) ||
    capacity < CAPACITY_RANGE.min ||
    capacity > CAPACITY_RANGE.max
  ) {
    throw HttpError.badRequest('Kuota harus berupa angka antara 1 dan 100000.');
  }

  const { start, end } = parseDateRange(body.start_at, body.end_at);

  if (!EVENT_STATUS_VALUES.includes(status)) {
    throw HttpError.badRequest('Status acara tidak valid.');
  }
  if (imageUrl && !IMAGE_URL_PATTERN.test(imageUrl)) {
    throw HttpError.badRequest('URL gambar harus menggunakan HTTP atau HTTPS.');
  }

  return {
    category_id: categoryId,
    title,
    description: description.slice(0, MAX_DESCRIPTION_LENGTH),
    location,
    start_at: start.toISOString(),
    end_at: end.toISOString(),
    capacity,
    status,
    image_url: imageUrl,
  };
}
