import { Save, X } from 'lucide-react';
import { EVENT_STATUS_OPTIONS } from '../../constants/events';

export default function EventFormModal({
  form,
  onChange,
  categories,
  isEditing,
  busy,
  onSubmit,
  onClose,
}) {
  /** Membuat handler onChange untuk satu field form. */
  const bind = (field) => (event) => onChange({ ...form, [field]: event.target.value });

  return (
    <div className="modal-backdrop">
      <form className="event-form-panel" onSubmit={onSubmit}>
        <div className="form-panel-heading">
          <div>
            <span className="eyebrow">EVENT MANAGEMENT</span>
            <h2>{isEditing ? 'Edit event' : 'Create an event'}</h2>
          </div>
          <button type="button" className="icon-button" onClick={onClose}>
            <X />
          </button>
        </div>

        <div className="form-grid">
          <label className="wide-field">
            Judul acara
            <input required minLength={3} value={form.title} onChange={bind('title')} />
          </label>

          <label>
            Kategori
            <select value={form.category_id} onChange={bind('category_id')}>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>

          <label>
            Status
            <select value={form.status} onChange={bind('status')}>
              {EVENT_STATUS_OPTIONS.map(({ value, label }) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>

          <label className="wide-field">
            Deskripsi
            <textarea rows="3" value={form.description} onChange={bind('description')} />
          </label>

          <label>
            Lokasi
            <input required value={form.location} onChange={bind('location')} />
          </label>

          <label>
            Kuota
            <input
              required
              type="number"
              min="1"
              value={form.capacity}
              onChange={bind('capacity')}
            />
          </label>

          <label>
            Mulai
            <input
              required
              type="datetime-local"
              value={form.start_at}
              onChange={bind('start_at')}
            />
          </label>

          <label>
            Selesai
            <input required type="datetime-local" value={form.end_at} onChange={bind('end_at')} />
          </label>
        </div>

        <div className="form-actions">
          <button type="button" className="button button-ghost" onClick={onClose}>
            Cancel
          </button>
          <button className="button" disabled={busy}>
            <Save size={16} />
            {busy ? 'Saving...' : 'Save event'}
          </button>
        </div>
      </form>
    </div>
  );
}
