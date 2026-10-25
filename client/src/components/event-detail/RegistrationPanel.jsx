import { CheckCircle2 } from 'lucide-react';

export default function RegistrationPanel({ event, message, error, busy, onRegister }) {
  const isFull = event.registered_count >= event.capacity;
  const fillPercent = Math.min(100, (event.registered_count / event.capacity) * 100);
  const remaining = Math.max(0, event.capacity - event.registered_count);

  return (
    <aside className="registration-panel">
      <span className="eyebrow">SAVE YOUR SPOT</span>
      <h2>Be part of it.</h2>
      <p className="muted">Daftar dan jadikan acara ini bagian dari pengalaman kampusmu.</p>
      <div className="capacity-bar">
        <span style={{ width: `${fillPercent}%` }} />
      </div>
      <small className="muted">{remaining} tempat tersisa</small>
      {message && (
        <div className="success-message">
          <CheckCircle2 size={17} />
          {message}
        </div>
      )}
      {error && <div className="form-error">{error}</div>}
      <button
        className="button button-full"
        disabled={busy || event.status !== 'published' || isFull}
        onClick={onRegister}
      >
        {busy ? 'Memproses...' : isFull ? 'Kuota penuh' : 'Register for event'}
      </button>
      <small className="muted panel-footnote">Pendaftaran mengikuti kuota yang tersedia.</small>
    </aside>
  );
}
