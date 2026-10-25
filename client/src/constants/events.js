export const ALL_CATEGORIES = 'Semua';

export const EVENT_CATEGORIES = Object.freeze([
  ALL_CATEGORIES,
  'Seminar',
  'Workshop',
  'Kompetisi',
  'Karier',
  'Komunitas',
  'Olahraga',
  'Seni',
]);

export const EVENT_STATUS = Object.freeze({
  DRAFT: 'draft',
  PUBLISHED: 'published',
  CANCELLED: 'cancelled',
});

export const EVENT_STATUS_OPTIONS = Object.freeze([
  { value: EVENT_STATUS.DRAFT, label: 'Draft' },
  { value: EVENT_STATUS.PUBLISHED, label: 'Published' },
  { value: EVENT_STATUS.CANCELLED, label: 'Cancelled' },
]);

export const REGISTRATION_STATUS = Object.freeze({
  REGISTERED: 'registered',
  CANCELLED: 'cancelled',
});
