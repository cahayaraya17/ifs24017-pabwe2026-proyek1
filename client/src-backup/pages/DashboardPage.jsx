import { useEffect, useState } from 'react';
import {
  Plus,
  CalendarDays,
  Users,
  ChartNoAxesColumn,
  Pencil,
  Trash2,
  X,
  Save,
} from 'lucide-react';
import { api } from '../services/api';

const emptyForm = {
  title: '',
  description: '',
  location: '',
  start_at: '',
  end_at: '',
  capacity: 30,
  category_id: 1,
  status: 'published',
};

export default function DashboardPage({ user }) {
  const [stats, setStats] = useState(null);
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [busy, setBusy] = useState(false);

  async function load() {
    try {
      const [s, e, c] = await Promise.all([
        api('/dashboard/stats'),
        api('/events?includeDrafts=true&limit=100'),
        api('/categories'),
      ]);

      setStats(s.stats);
      setEvents(e.events || []);
      setCategories(c.categories || []);
      setError('');
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function startCreate() {
    setEditing(null);
    setForm({
      ...emptyForm,
      category_id: categories[0]?.id || 1,
    });
    setShowForm(true);
  }

  function startEdit(event) {
    setEditing(event.id);
    setForm({
      ...event,
      start_at: event.start_at?.slice(0, 16) || '',
      end_at: event.end_at?.slice(0, 16) || '',
    });
    setShowForm(true);
  }

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError('');

    try {
      if (!form.start_at || !form.end_at) {
        throw new Error('Tanggal mulai dan selesai wajib diisi.');
      }

      const startDate = new Date(form.start_at);
      const endDate = new Date(form.end_at);

      if (endDate <= startDate) {
        throw new Error(
          'Tanggal selesai harus setelah tanggal mulai.'
        );
      }

      const payload = {
        ...form,
        capacity: Number(form.capacity),
        category_id: Number(form.category_id),
        start_at: startDate.toISOString(),
        end_at: endDate.toISOString(),
      };

      await api(editing ? `/events/${editing}` : '/events', {
        method: editing ? 'PATCH' : 'POST',
        body: JSON.stringify(payload),
      });

      setShowForm(false);
      await load();
    } catch (err) {
      setError(
        err.message || 'Terjadi kesalahan saat menyimpan acara.'
      );
    } finally {
      setBusy(false);
    }
  }

  async function remove(id) {
    if (!window.confirm('Hapus atau arsipkan acara ini?')) {
      return;
    }

    try {
      await api(`/events/${id}`, {
        method: 'DELETE',
      });
      await load();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <main className="container dashboard-page">
      <div className="dashboard-heading">
        <div>
          <span className="eyebrow">CAMPUS CONTROL CENTER</span>
          <h1>
            Event <span className="gradient-text">dashboard.</span>
          </h1>
          <p className="muted">
            Selamat datang, {user?.name}. Kelola acara dan pantau
            partisipasi kampus.
          </p>
        </div>

        <button className="button" onClick={startCreate}>
          <Plus size={17} /> Create event
        </button>
      </div>

      {error && (
        <div className="form-error dashboard-error">{error}</div>
      )}

      <div className="dashboard-stats">
        <div className="metric-card">
          <span className="metric-icon purple">
            <CalendarDays />
          </span>
          <span className="muted">Total events</span>
          <strong>{stats?.event_count ?? '—'}</strong>
          <small>Acara yang dikelola</small>
        </div>

        <div className="metric-card">
          <span className="metric-icon blue">
            <Users />
          </span>
          <span className="muted">Registrations</span>
          <strong>{stats?.registration_count ?? '—'}</strong>
          <small>Total pendaftaran aktif</small>
        </div>

        <div className="metric-card">
          <span className="metric-icon pink">
            <ChartNoAxesColumn />
          </span>
          <span className="muted">Published</span>
          <strong>{stats?.published_count ?? '—'}</strong>
          <small>Acara yang terlihat publik</small>
        </div>
      </div>

      {showForm && (
        <div className="modal-backdrop">
          <form className="event-form-panel" onSubmit={submit}>
            <div className="form-panel-heading">
              <div>
                <span className="eyebrow">EVENT MANAGEMENT</span>
                <h2>{editing ? 'Edit event' : 'Create an event'}</h2>
              </div>

              <button
                type="button"
                className="icon-button"
                onClick={() => setShowForm(false)}
              >
                <X />
              </button>
            </div>

            <div className="form-grid">
              <label className="wide-field">
                Judul acara
                <input
                  required
                  minLength={3}
                  value={form.title}
                  onChange={(e) =>
                    setForm({ ...form, title: e.target.value })
                  }
                />
              </label>

              <label>
                Kategori
                <select
                  value={form.category_id}
                  onChange={(e) =>
                    setForm({ ...form, category_id: e.target.value })
                  }
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Status
                <select
                  value={form.status}
                  onChange={(e) =>
                    setForm({ ...form, status: e.target.value })
                  }
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </label>

              <label className="wide-field">
                Deskripsi
                <textarea
                  rows="3"
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                />
              </label>

              <label>
                Lokasi
                <input
                  required
                  value={form.location}
                  onChange={(e) =>
                    setForm({ ...form, location: e.target.value })
                  }
                />
              </label>

              <label>
                Kuota
                <input
                  required
                  type="number"
                  min="1"
                  value={form.capacity}
                  onChange={(e) =>
                    setForm({ ...form, capacity: e.target.value })
                  }
                />
              </label>

              <label>
                Mulai
                <input
                  required
                  type="datetime-local"
                  value={form.start_at}
                  onChange={(e) =>
                    setForm({ ...form, start_at: e.target.value })
                  }
                />
              </label>

              <label>
                Selesai
                <input
                  required
                  type="datetime-local"
                  value={form.end_at}
                  onChange={(e) =>
                    setForm({ ...form, end_at: e.target.value })
                  }
                />
              </label>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="button button-ghost"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>

              <button className="button" disabled={busy}>
                <Save size={16} />
                {busy ? 'Saving...' : 'Save event'}
              </button>
            </div>
          </form>
        </div>
      )}

      <section className="management-table">
        <div className="table-heading">
          <div>
            <h2>Your events</h2>
            <p className="muted">
              Kelola acara yang telah dibuat.
            </p>
          </div>

          <span className="table-count">{events.length} items</span>
        </div>

        {events.length === 0 ? (
          <div className="state-panel">
            Belum ada acara. Buat acara pertamamu!
          </div>
        ) : (
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Event</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Capacity</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {events.map((event) => (
                  <tr key={event.id}>
                    <td>
                      <strong>{event.title}</strong>
                      <small>
                        {event.category_name} · {event.location}
                      </small>
                    </td>

                    <td>
                      {new Date(event.start_at).toLocaleDateString('id-ID')}
                    </td>

                    <td>
                      <span
                        className={`status-badge status-${event.status}`}
                      >
                        {event.status}
                      </span>
                    </td>

                    <td>
                      {event.registered_count}/{event.capacity}
                    </td>

                    <td>
                      <div className="table-actions">
                        <button
                          className="icon-button"
                          title="Edit"
                          onClick={() => startEdit(event)}
                        >
                          <Pencil size={16} />
                        </button>

                        <button
                          className="icon-button danger"
                          title="Delete"
                          onClick={() => remove(event.id)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}
