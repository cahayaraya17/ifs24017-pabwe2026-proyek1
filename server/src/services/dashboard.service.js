import { ROLES } from '../constants/roles.js';
import { statsRepository } from '../repositories/stats.repository.js';

export const dashboardService = {
  /** Admin melihat statistik seluruh kampus; organizer hanya acara miliknya. */
  getStats(user) {
    const organizerId = user.role === ROLES.ADMIN ? null : user.id;
    return statsRepository.forOrganizer(organizerId);
  },
};
