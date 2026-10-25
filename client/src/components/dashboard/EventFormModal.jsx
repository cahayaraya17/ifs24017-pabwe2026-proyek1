import { useEffect, useRef } from 'react';
import { Save, X } from 'lucide-react';

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

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
  const dialogRef = useRef(null);
  const closeButtonRef = useRef(null);

  useEffect(() => {
    const previousFocus = document.activeElement;
    closeButtonRef.current?.focus();

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== 'Tab' || !dialogRef.current) return;
      const focusable = Array.from(dialogRef.current.querySelectorAll(FOCUSABLE_SELECTOR));
      if (focusable.length === 0) {
        event.preventDefault();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      if (previousFocus instanceof HTMLElement) previousFocus.focus();
    };
  }, [onClose]);

  const bind = (field) => ({
    value: form[field],
    onChange: (e) => onChange(field, e.target.value),
  });

  return (
    <div className="modal-backdrop">
      <form
        ref={dialogRef}
        className="event-form-panel"
        onSubmit={onSubmit}
        role="dialog"
        aria-modal="true"
        aria-labelledby="event-form-title"
      >
        <div className="form-panel-heading">
          <div>
            <span className="eyebrow">EVENT MANAGEMENT</span>
            <h2 id="event-form-title">{editing ? 'Edit event' : 'Create an event'}</h2>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            className="icon-button"
            onClick={onClose}
            aria-label="Tutup formulir acara"
          >
            <X aria-hidden="true" />
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
            <Save size={16} aria-hidden="true" />
            {busy ? 'Saving...' : 'Save event'}
          </button>
        </div>
      </form>
    </div>
  );
}
