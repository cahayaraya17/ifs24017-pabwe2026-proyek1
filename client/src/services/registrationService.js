import { api } from './api';

export async function listMyRegistrations() {
  const data = await api('/registrations/me');
  return data.registrations || [];
}

export function cancelRegistration(id) {
  return api(`/registrations/${id}`, { method: 'DELETE' });
}
