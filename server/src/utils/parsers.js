const DEFAULT_PAGE_SIZE = 30;
const MAX_PAGE_SIZE = 100;
const MAX_SEARCH_LENGTH = 100;

/** Mengubah nilai apa pun menjadi bilangan bulat positif, atau `null` bila tidak valid. */
export function parsePositiveInt(value) {
  const number = Number(value);
  return Number.isInteger(number) && number >= 1 ? number : null;
}

export function parsePagination(query = {}) {
  const page = Math.max(1, Number.parseInt(query.page || '1', 10) || 1);
  const limit = Math.min(
    MAX_PAGE_SIZE,
    Math.max(1, Number.parseInt(query.limit || String(DEFAULT_PAGE_SIZE), 10) || DEFAULT_PAGE_SIZE),
  );
  return { page, limit, offset: (page - 1) * limit };
}

export function parseSearchText(value) {
  return String(value || '')
    .trim()
    .slice(0, MAX_SEARCH_LENGTH);
}

export function normalizeEmail(value) {
  return String(value || '')
    .trim()
    .toLowerCase();
}
