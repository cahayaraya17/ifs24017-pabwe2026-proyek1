import { db } from '../config/database.js';
import { REGISTRATION_STATUS } from '../constants/statuses.js';

export const registrationRepository = {
  findById(id) {
    return db.prepare('SELECT * FROM registrations WHERE id = ?').get(id);
  },

  findByEventAndUser(eventId, userId) {
    return db
      .prepare('SELECT * FROM registrations WHERE event_id = ? AND user_id = ?')
      .get(eventId, userId);
  },

  countActiveByEvent(eventId) {
    return db
      .prepare('SELECT COUNT(*) AS count FROM registrations WHERE event_id = ? AND status = ?')
      .get(eventId, REGISTRATION_STATUS.REGISTERED).count;
  },

  create(eventId, userId) {
    db.prepare('INSERT INTO registrations (event_id, user_id, status) VALUES (?, ?, ?)').run(
      eventId,
      userId,
      REGISTRATION_STATUS.REGISTERED,
    );
  },

  reactivate(id) {
    db.prepare(
      "UPDATE registrations SET status = ?, registered_at = datetime('now') WHERE id = ?",
    ).run(REGISTRATION_STATUS.REGISTERED, id);
  },

  cancel(id) {
    db.prepare('UPDATE registrations SET status = ? WHERE id = ?').run(
      REGISTRATION_STATUS.CANCELLED,
      id,
    );
  },

  listByUser(userId) {
    return db
      .prepare(
        `SELECT r.id, r.status, r.registered_at,
                e.id AS event_id, e.title, e.location, e.start_at, e.end_at,
                c.name AS category_name
         FROM registrations r
         JOIN events e ON e.id = r.event_id
         JOIN categories c ON c.id = e.category_id
         WHERE r.user_id = ?
         ORDER BY r.registered_at DESC`,
      )
      .all(userId);
  },

  listByEvent(eventId) {
    return db
      .prepare(
        `SELECT r.id, r.status, r.registered_at, u.name, u.email
         FROM registrations r
         JOIN users u ON u.id = r.user_id
         WHERE r.event_id = ?
         ORDER BY r.registered_at DESC`,
      )
      .all(eventId);
  },
};
