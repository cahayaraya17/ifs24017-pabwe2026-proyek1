import { MANAGER_ROLES } from '../constants';

export function isManager(user) {
  return Boolean(user) && MANAGER_ROLES.includes(user.role);
}
