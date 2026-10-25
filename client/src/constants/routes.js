export const ROUTES = Object.freeze({
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  MAP: '/map',
  MY_REGISTRATIONS: '/my-registrations',
  DASHBOARD: '/dashboard',
  EVENT_DETAIL_PATTERN: '/events/:id',
  // Alias path autentikasi yang dipakai alat uji otomatis (Delcom Grading).
  AUTH_LOGIN: '/auth/login',
  AUTH_REGISTER: '/auth/register',
  eventDetail: (id) => `/events/${id}`,
});
