import { ROLES } from '../constants/roles.js';

/** Admin boleh mengelola semua acara; organizer hanya acara miliknya. */
export function canManageEvent(user, event) {
  if (!user) return false;
  if (user.role === ROLES.ADMIN) return true;
  return user.role === ROLES.ORGANIZER && String(user.id) === String(event.organizer_id);
}

/** Admin dan organizer boleh melihat draft pada daftar acara. */
export function canListDrafts(user) {
  return user?.role === ROLES.ADMIN || user?.role === ROLES.ORGANIZER;
}
