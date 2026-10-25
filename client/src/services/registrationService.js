import { api } from './api';

export function listMyRegistrations() {
  return api('/registrations/me');
}

export function cancelRegistration(id) {
  return api(`/registrations/${id}`, { method: 'DELETE' });
}
