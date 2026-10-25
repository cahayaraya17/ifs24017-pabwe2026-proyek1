import { api } from './api';

export async function listEvents({ q = '', category = 'Semua' } = {}) {
  const params = new URLSearchParams();
  if (q.trim()) params.set('q', q.trim());
  if (category !== 'Semua') params.set('category', category);
  const data = await api(`/events?${params.toString()}`);
  return data.events || [];
}

export async function getEvent(id) {
  const data = await api(`/events/${id}`);
  return data.event;
}

export function registerForEvent(id) {
  return api(`/events/${id}/register`, { method: 'POST' });
}

export function saveEvent(payload, editingId = null) {
  return api(editingId ? `/events/${editingId}` : '/events', {
    method: editingId ? 'PATCH' : 'POST',
    body: JSON.stringify(payload),
  });
}

export function deleteEvent(id) {
  return api(`/events/${id}`, { method: 'DELETE' });
}
