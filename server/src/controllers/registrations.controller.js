import { db } from '../config/database.js';

export function registerForEvent(req, res) {
  const eventId = Number(req.params.id);
  const transaction = db.transaction(() => {
    const event = db.prepare("SELECT * FROM events WHERE id=? AND status='published'").get(eventId);
    if (!event) return { status: 404, error: 'Acara tidak ditemukan atau belum diterbitkan.' };
    const previous = db.prepare('SELECT * FROM registrations WHERE event_id=? AND user_id=?').get(eventId,req.user.id);
    if (previous?.status === 'registered') return { status: 409, error: 'Kamu sudah terdaftar pada acara ini.' };
    const count = db.prepare("SELECT COUNT(*) AS count FROM registrations WHERE event_id=? AND status='registered'").get(eventId).count;
    if (count >= event.capacity) return { status: 409, error: 'Maaf, kuota acara sudah penuh.' };
    if (previous) {
      db.prepare("UPDATE registrations SET status='registered',registered_at=datetime('now') WHERE id=?").run(previous.id);
    } else {
      db.prepare("INSERT INTO registrations(event_id,user_id,status) VALUES(?,?,'registered')").run(eventId,req.user.id);
    }
    return { status: 201, message: 'Pendaftaran acara berhasil.' };
  });
  const result = transaction();
  if (result.error) return res.status(result.status).json({ error: result.error });
  return res.status(result.status).json({ message: result.message });
}

export function myRegistrations(req, res) {
  const registrations = db.prepare(`
    SELECT r.id,r.status,r.registered_at,e.id AS event_id,e.title,e.location,e.start_at,e.end_at,c.name AS category_name
    FROM registrations r JOIN events e ON e.id=r.event_id JOIN categories c ON c.id=e.category_id
    WHERE r.user_id=? ORDER BY r.registered_at DESC
  `).all(req.user.id);
  res.json({ registrations });
}

export function cancelRegistration(req, res) {
  const id = Number(req.params.id);
  const row = db.prepare('SELECT * FROM registrations WHERE id=?').get(id);
  if (!row) return res.status(404).json({ error: 'Pendaftaran tidak ditemukan.' });
  if (row.user_id !== req.user.id && req.user.role !== 'admin') return res.status(403).json({ error: 'Kamu tidak dapat membatalkan pendaftaran pengguna lain.' });
  if (row.status === 'cancelled') return res.json({ message: 'Pendaftaran sudah dibatalkan.' });
  db.prepare("UPDATE registrations SET status='cancelled' WHERE id=?").run(id);
  res.json({ message: 'Pendaftaran berhasil dibatalkan.' });
}

export function eventRegistrations(req, res) {
  const eventId = Number(req.params.id);
  const event = db.prepare('SELECT id,organizer_id FROM events WHERE id=?').get(eventId);
  if (!event) return res.status(404).json({ error: 'Acara tidak ditemukan.' });
  if (req.user.role !== 'admin' && event.organizer_id !== req.user.id) return res.status(403).json({ error: 'Kamu tidak dapat melihat peserta acara ini.' });
  const registrations = db.prepare(`SELECT r.id,r.status,r.registered_at,u.name,u.email
    FROM registrations r JOIN users u ON u.id=r.user_id WHERE r.event_id=? ORDER BY r.registered_at DESC`).all(eventId);
  res.json({ registrations });
}

export function dashboardStats(req, res) {
  const isAdmin = req.user.role === 'admin';
  const scope = isAdmin ? '' : 'WHERE organizer_id=?';
  const args = isAdmin ? [] : [req.user.id];
  const event_count = db.prepare(`SELECT COUNT(*) AS count FROM events ${scope}`).get(...args).count;
  const published_count = db.prepare(`SELECT COUNT(*) AS count FROM events ${scope ? `${scope} AND status='published'` : "WHERE status='published'"}`).get(...args).count;
  const registration_count = db.prepare(`SELECT COUNT(*) AS count FROM registrations r JOIN events e ON e.id=r.event_id ${isAdmin ? "WHERE r.status='registered'" : "WHERE r.status='registered' AND e.organizer_id=?"}`).get(...(isAdmin?[]:[req.user.id])).count;
  res.json({ stats: { event_count, published_count, registration_count } });
}
