import { db } from '../config/database.js';
import { EVENT_STATUS, REGISTRATION_STATUS } from '../constants/statuses.js';

const EVENT_WITH_RELATIONS_SQL = `
  SELECT e.*, c.name AS category_name, u.name AS organizer_name,
    (SELECT COUNT(*) FROM registrations r
      WHERE r.event_id = e.id AND r.status = '${REGISTRATION_STATUS.REGISTERED}') AS registered_count
  FROM events e
  JOIN categories c ON c.id = e.category_id
  JOIN users u ON u.id = e.organizer_id
`;

/** Menyusun klausa WHERE beserta parameternya dari filter pencarian. */
function buildWhereClause({ publishedOnly, organizerId, text, categoryId, categoryName }) {
  const conditions = [];
  const params = [];

  if (publishedOnly) {
    conditions.push('e.status = ?');
    params.push(EVENT_STATUS.PUBLISHED);
  }
  if (organizerId) {
    conditions.push('e.organizer_id = ?');
    params.push(organizerId);
  }
  if (text) {
    conditions.push('(e.title LIKE ? OR e.description LIKE ? OR e.location LIKE ?)');
    params.push(`%${text}%`, `%${text}%`, `%${text}%`);
  }
  if (categoryId) {
    conditions.push('e.category_id = ?');
    params.push(categoryId);
  } else if (categoryName) {
    conditions.push('c.name = ? COLLATE NOCASE');
    params.push(categoryName);
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  return { where, params };
}

const EVENT_COLUMNS = {
  insert: `category_id, organizer_id, title, description, location,
           start_at, end_at, capacity, status, image_url`,
};

export const eventRepository = {
  search(filters, { limit, offset }) {
    const { where, params } = buildWhereClause(filters);

    const { count: total } = db
      .prepare(
        `SELECT COUNT(*) AS count
         FROM events e JOIN categories c ON c.id = e.category_id ${where}`,
      )
      .get(...params);

    const events = db
      .prepare(`${EVENT_WITH_RELATIONS_SQL} ${where} ORDER BY e.start_at ASC LIMIT ? OFFSET ?`)
      .all(...params, limit, offset);

    return { events, total };
  },

  /** Acara lengkap dengan kategori, penyelenggara, dan jumlah peserta. */
  findDetailedById(id) {
    return db.prepare(`${EVENT_WITH_RELATIONS_SQL} WHERE e.id = ?`).get(id);
  },

  /** Baris mentah tabel events (tanpa join). */
  findById(id) {
    return db.prepare('SELECT * FROM events WHERE id = ?').get(id);
  },

  findPublishedById(id) {
    return db
      .prepare('SELECT * FROM events WHERE id = ? AND status = ?')
      .get(id, EVENT_STATUS.PUBLISHED);
  },

  create(values) {
    const result = db
      .prepare(
        `INSERT INTO events (${EVENT_COLUMNS.insert})
         VALUES (@category_id, @organizer_id, @title, @description, @location,
                 @start_at, @end_at, @capacity, @status, @image_url)`,
      )
      .run(values);
    return result.lastInsertRowid;
  },

  update(id, values) {
    db.prepare(
      `UPDATE events
       SET category_id = @category_id, title = @title, description = @description,
           location = @location, start_at = @start_at, end_at = @end_at,
           capacity = @capacity, status = @status, image_url = @image_url
       WHERE id = @id`,
    ).run({ ...values, id });
  },

  markCancelled(id) {
    db.prepare('UPDATE events SET status = ? WHERE id = ?').run(EVENT_STATUS.CANCELLED, id);
  },

  delete(id) {
    db.prepare('DELETE FROM events WHERE id = ?').run(id);
  },
};
