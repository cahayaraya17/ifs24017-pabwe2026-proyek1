export const ROLES = Object.freeze({
  STUDENT: 'student',
  ORGANIZER: 'organizer',
  ADMIN: 'admin',
});

/** Peran yang boleh mengelola acara dan membuka dashboard. */
export const MANAGER_ROLES = Object.freeze([ROLES.ADMIN, ROLES.ORGANIZER]);
