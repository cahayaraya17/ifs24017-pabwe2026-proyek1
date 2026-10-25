import { ROLES } from './roles';

/** Akun demo dari seed backend; hanya dipakai sebagai pintasan pengisian form login. */
export const DEMO_PASSWORD = 'CampusPulse123!';

export const DEMO_EMAILS = Object.freeze({
  [ROLES.STUDENT]: 'student@campuspulse.local',
  [ROLES.ORGANIZER]: 'organizer@campuspulse.local',
  [ROLES.ADMIN]: 'admin@campuspulse.local',
});
