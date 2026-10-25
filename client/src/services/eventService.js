import { api } from './api';

export function listEvents(queryString) {
  return api(`/events?${queryString}`);
}

/** Daftar acara untuk pengelola, termasuk draft. */
export function listManagedEvents() {
  return api('/events?includeDrafts=true&limit=100');
}

export function getEvent(id) {
  return api(`/events/${id}`);
}

export function registerForEvent(id) {
  return api(`/events/${id}/register`, { method: 'POST' });
}

/** Membuat acara baru, atau memperbarui acara bila `id` diberikan. */
export function saveEvent(id, payload) {
  return api(id ? `/events/${id}` : '/events', {
    method: id ? 'PATCH' : 'POST',
    body: JSON.stringify(payload),
  });
}

export function deleteEvent(id) {
  return api(`/events/${id}`, { method: 'DELETE' });
}
