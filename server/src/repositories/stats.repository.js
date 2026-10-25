import { db } from '../config/database.js';
import { EVENT_STATUS, REGISTRATION_STATUS } from '../constants/statuses.js';

/**
 * Statistik dashboard. Jika `organizerId` diisi, hitungan dibatasi pada acara miliknya;
 * jika `null` (admin), hitungan mencakup seluruh acara.
 */
export const statsRepository = {
  forOrganizer(organizerId = null) {
    const ownerFilter = organizerId ? 'AND e.organizer_id = ?' : '';
    const params = organizerId ? [organizerId] : [];

    const countEvents = (statusFilter = '') =>
      db
        .prepare(
          `SELECT COUNT(*) AS count FROM events e WHERE 1 = 1 ${statusFilter} ${ownerFilter}`,
        )
        .get(...params).count;

    const registration_count = db
      .prepare(
        `SELECT COUNT(*) AS count
         FROM registrations r JOIN events e ON e.id = r.event_id
         WHERE r.status = '${REGISTRATION_STATUS.REGISTERED}' ${ownerFilter}`,
      )
      .get(...params).count;

    return {
      event_count: countEvents(),
      published_count: countEvents(`AND e.status = '${EVENT_STATUS.PUBLISHED}'`),
      registration_count,
    };
  },
};
