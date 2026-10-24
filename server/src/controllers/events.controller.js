
import { db, eventSelect } from '../config/database.js';

// GET /api/events
export function listEvents(req, res) {
  try {
    const q = String(req.query.q || '').trim().slice(0, 100);
    const category = String(req.query.category || '').trim();

    const includeDrafts =
      ['admin', 'organizer'].includes(req.user?.role) &&
      req.query.includeDrafts === 'true';

    const page = Math.max(
      1,
      Number.parseInt(req.query.page || '1', 10) || 1
    );

    const limit = Math.min(
      100,
      Math.max(1, Number.parseInt(req.query.limit || '30', 10) || 30)
    );

    const conditions = [];
    const params = [];

    if (!includeDrafts) {
      conditions.push("e.status = 'published'");
    }

    if (includeDrafts && req.user?.role === 'organizer') {
      conditions.push('e.organizer_id = ?');
      params.push(req.user.id);
    }

    if (q) {
      conditions.push(
        '(e.title LIKE ? OR e.description LIKE ? OR e.location LIKE ?)'
      );
      params.push(`%${q}%`, `%${q}%`, `%${q}%`);
    }

    if (category) {
      if (/^\d+$/.test(category)) {
        conditions.push('e.category_id = ?');
        params.push(Number(category));
      } else {
        conditions.push('c.name = ? COLLATE NOCASE');
        params.push(category);
      }
    }

    const where = conditions.length
      ? `WHERE ${conditions.join(' AND ')}`
      : '';

    const total = db.prepare(`
      SELECT COUNT(*) AS count
      FROM events e
      JOIN categories c ON c.id = e.category_id
      ${where}
    `).get(...params).count;

    const events = db.prepare(`
      ${eventSelect(where)}
      ORDER BY e.start_at ASC
      LIMIT ? OFFSET ?
    `).all(...params, limit, (page - 1) * limit);

    return res.json({
      events,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('LIST EVENTS ERROR:', error);
    return res.status(500).json({
      error: 'Gagal mengambil daftar acara.'
    });
  }
}

// GET /api/events/:id
export function getEvent(req, res) {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id < 1) {
      return res.status(400).json({
        error: 'ID acara tidak valid.'
      });
    }

    const event = db.prepare(
      `${eventSelect('WHERE e.id = ?')}`
    ).get(id);

    if (!event) {
      return res.status(404).json({
        error: 'Acara tidak ditemukan.'
      });
    }

    const isOwner =
      req.user &&
      String(req.user.id) === String(event.organizer_id);

    const canViewUnpublished =
      req.user?.role === 'admin' ||
      (req.user?.role === 'organizer' && isOwner);

    if (event.status !== 'published' && !canViewUnpublished) {
      return res.status(404).json({
        error: 'Acara tidak ditemukan.'
      });
    }

    return res.json({ event });
  } catch (error) {
    console.error('GET EVENT ERROR:', error);
    return res.status(500).json({
      error: 'Gagal mengambil detail acara.'
    });
  }
}

// POST /api/events
export function createEvent(req, res) {
  try {
    if (!req.user || !['admin', 'organizer'].includes(req.user.role)) {
      return res.status(403).json({
        error: 'Hanya admin atau event organizer yang dapat membuat acara.'
      });
    }

    const v = validateEvent(req.body);

    if (v.error) {
      return res.status(400).json({ error: v.error });
    }

    const result = db.prepare(`
      INSERT INTO events (
        category_id,
        organizer_id,
        title,
        description,
        location,
        start_at,
        end_at,
        capacity,
        status,
        image_url
      )
      VALUES (
        @category_id,
        @organizer_id,
        @title,
        @description,
        @location,
        @start_at,
        @end_at,
        @capacity,
        @status,
        @image_url
      )
    `).run({
      ...v.value,
      organizer_id: req.user.id
    });

    const event = db.prepare(
      `${eventSelect('WHERE e.id = ?')}`
    ).get(result.lastInsertRowid);

    return res.status(201).json({
      message: 'Acara berhasil dibuat.',
      event
    });
  } catch (error) {
    console.error('CREATE EVENT ERROR:', error);
    return res.status(500).json({
      error: 'Gagal menyimpan acara.',
      detail: error.message
    });
  }
}

// PATCH /api/events/:id
export function updateEvent(req, res) {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id < 1) {
      return res.status(400).json({
        error: 'ID acara tidak valid.'
      });
    }

    const existing = db.prepare(
      'SELECT * FROM events WHERE id = ?'
    ).get(id);

    if (!existing) {
      return res.status(404).json({
        error: 'Acara tidak ditemukan.'
      });
    }

    const isOwner =
      String(existing.organizer_id) === String(req.user.id);

    if (req.user.role !== 'admin' && !isOwner) {
      return res.status(403).json({
        error: 'Kamu hanya dapat mengubah acara milikmu.'
      });
    }

    const v = validateEvent({
      ...existing,
      ...req.body
    });

    if (v.error) {
      return res.status(400).json({ error: v.error });
    }

    const activeCount = db.prepare(`
      SELECT COUNT(*) AS count
      FROM registrations
      WHERE event_id = ? AND status = 'registered'
    `).get(id).count;

    if (v.value.capacity < activeCount) {
      return res.status(400).json({
        error: 'Kuota tidak boleh lebih kecil dari jumlah peserta terdaftar.'
      });
    }

    db.prepare(`
      UPDATE events
      SET
        category_id = @category_id,
        title = @title,
        description = @description,
        location = @location,
        start_at = @start_at,
        end_at = @end_at,
        capacity = @capacity,
        status = @status,
        image_url = @image_url
      WHERE id = @id
    `).run({
      ...v.value,
      id
    });

    const event = db.prepare(
      `${eventSelect('WHERE e.id = ?')}`
    ).get(id);

    return res.json({
      message: 'Acara berhasil diperbarui.',
      event
    });
  } catch (error) {
    console.error('UPDATE EVENT ERROR:', error);
    return res.status(500).json({
      error: 'Gagal memperbarui acara.',
      detail: error.message
    });
  }
}

// DELETE /api/events/:id
export function deleteEvent(req, res) {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id < 1) {
      return res.status(400).json({
        error: 'ID acara tidak valid.'
      });
    }

    const existing = db.prepare(
      'SELECT * FROM events WHERE id = ?'
    ).get(id);

    if (!existing) {
      return res.status(404).json({
        error: 'Acara tidak ditemukan.'
      });
    }

    const isOwner =
      String(existing.organizer_id) === String(req.user.id);

    if (req.user.role !== 'admin' && !isOwner) {
      return res.status(403).json({
        error: 'Kamu hanya dapat menghapus acara milikmu.'
      });
    }

    const registrations = db.prepare(`
      SELECT COUNT(*) AS count
      FROM registrations
      WHERE event_id = ? AND status = 'registered'
    `).get(id).count;

    if (registrations > 0) {
      db.prepare(`
        UPDATE events
        SET status = 'cancelled'
        WHERE id = ?
      `).run(id);

      return res.json({
        message:
          'Acara memiliki peserta aktif sehingga statusnya diubah menjadi cancelled.'
      });
    }

    db.prepare(
      'DELETE FROM events WHERE id = ?'
    ).run(id);

    return res.status(204).end();
  } catch (error) {
    console.error('DELETE EVENT ERROR:', error);
    return res.status(500).json({
      error: 'Gagal menghapus acara.',
      detail: error.message
    });
  }
}

// Validasi data acara
function validateEvent(body = {}) {
  const title = String(body.title || '').trim();
  const description = String(body.description || '').trim();
  const location = String(body.location || '').trim();

  const category_id =
    body.category_id === '' || body.category_id == null
      ? NaN
      : Number(body.category_id);

  const capacity =
    body.capacity === '' || body.capacity == null
      ? NaN
      : Number(body.capacity);

  const status = String(body.status || 'draft').trim();

  const start = new Date(body.start_at);
  const end = new Date(body.end_at);

  const image_url = String(body.image_url || '').trim();

  if (title.length < 3 || title.length > 160) {
    return {
      error: 'Judul acara harus terdiri dari 3–160 karakter.'
    };
  }

  if (!location || location.length > 180) {
    return {
      error: 'Lokasi wajib diisi (maksimal 180 karakter).'
    };
  }

  if (
    !Number.isInteger(category_id) ||
    !db.prepare('SELECT id FROM categories WHERE id = ?')
      .get(category_id)
  ) {
    return { error: 'Kategori tidak valid. Pilih kategori yang tersedia.' };
  }

  if (
    !Number.isInteger(capacity) ||
    capacity < 1 ||
    capacity > 100000
  ) {
    return {
      error: 'Kuota harus berupa angka antara 1 dan 100000.'
    };
  }

  if (
    Number.isNaN(start.getTime()) ||
    Number.isNaN(end.getTime()) ||
    end <= start
  ) {
    return {
      error: 'Tanggal tidak valid atau waktu selesai harus setelah waktu mulai.'
    };
  }

  if (!['draft', 'published', 'cancelled'].includes(status)) {
    return { error: 'Status acara tidak valid.' };
  }

  if (
    image_url &&
    (!/^https?:\/\/.{1,500}$/i.test(image_url))
  ) {
    return {
      error: 'URL gambar harus menggunakan HTTP atau HTTPS.'
    };
  }

  return {
    value: {
      category_id,
      title,
      description: description.slice(0, 10000),
      location,
      start_at: start.toISOString(),
      end_at: end.toISOString(),
      capacity,
      status,
      image_url
    }
  };
}
