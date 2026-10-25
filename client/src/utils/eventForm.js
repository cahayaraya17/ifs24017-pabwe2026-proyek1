import { EVENT_STATUS } from '../constants/events';
import { validateEventForm } from './validators';

const DATETIME_LOCAL_LENGTH = 16;
const DEFAULT_CATEGORY_ID = 1;

export const EMPTY_EVENT_FORM = Object.freeze({
  title: '',
  description: '',
  location: '',
  start_at: '',
  end_at: '',
  capacity: 30,
  category_id: DEFAULT_CATEGORY_ID,
  status: EVENT_STATUS.PUBLISHED,
});

export function createEmptyEventForm(categories = []) {
  return { ...EMPTY_EVENT_FORM, category_id: categories[0]?.id || DEFAULT_CATEGORY_ID };
}

/** Mengubah data acara dari API menjadi nilai yang cocok untuk input datetime-local. */
export function toEventFormValues(event) {
  return {
    ...event,
    start_at: event.start_at?.slice(0, DATETIME_LOCAL_LENGTH) || '',
    end_at: event.end_at?.slice(0, DATETIME_LOCAL_LENGTH) || '',
  };
}

/** Memvalidasi form dan membentuk payload API. Melempar Error berisi pesan untuk pengguna. */
export function buildEventPayload(form) {
  const validationError = validateEventForm(form);
  if (validationError) throw new Error(validationError);

  return {
    ...form,
    title: form.title.trim(),
    location: form.location.trim(),
    capacity: Number(form.capacity),
    category_id: Number(form.category_id),
    start_at: new Date(form.start_at).toISOString(),
    end_at: new Date(form.end_at).toISOString(),
  };
}
