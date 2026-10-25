import { Save, X } from 'lucide-react';

function Field({ label, className, children }) {
  return (
    <label className={className}>
      {label}
      {children}
    </label>
  );
}

export default function EventFormModal({
  form,
  categories,
  editing,
  busy,
  onChange,
  onSubmit,
  onClose,
}) {
  const bind = (field) => ({
    value: form[field],
    onChange: (e) => onChange(field, e.target.value),
  });

  return (
    <div className="modal-backdrop">
      <form className="event-form-panel" onSubmit={onSubmit}>
        <div className="form-panel-heading">
          <div>
            <span className="eyebrow">EVENT MANAGEMENT</span>
            <h2>{editing ? 'Edit event' : 'Create an event'}</h2>
          </div>
          <button type="button" className="icon-button" onClick={onClose}>
            <X />
          </button>
        </div>

        <div className="form-grid">
          <Field label="Judul acara" className="wide-field">
            <input required minLength={3} {...bind('title')} />
          </Field>
          <Field label="Kategori">
            <select {...bind('category_id')}>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Status">
            <select {...bind('status')}>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </Field>
          <Field label="Deskripsi" className="wide-field">
            <textarea rows="3" {...bind('description')} />
          </Field>
          <Field label="Lokasi">
            <input required {...bind('location')} />
          </Field>
          <Field label="Kuota">
            <input required type="number" min="1" {...bind('capacity')} />
          </Field>
          <Field label="Mulai">
            <input required type="datetime-local" {...bind('start_at')} />
          </Field>
          <Field label="Selesai">
            <input required type="datetime-local" {...bind('end_at')} />
          </Field>
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
