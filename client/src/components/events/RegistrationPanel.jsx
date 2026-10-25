import { CheckCircle2 } from 'lucide-react';
import { EVENT_STATUS } from '../../constants/events';

function getButtonLabel({ busy, isFull }) {
  if (busy) return 'Memproses...';
  return isFull ? 'Kuota penuh' : 'Register for event';
}

export default function RegistrationPanel({ event, message, error, busy, onRegister }) {
  const isFull = event.registered_count >= event.capacity;
  const filledPercent = Math.min(100, (event.registered_count / event.capacity) * 100);
  const seatsLeft = Math.max(0, event.capacity - event.registered_count);
  const canRegister = event.status === EVENT_STATUS.PUBLISHED && !isFull;

  return (
    <aside className="registration-panel">
      <span className="eyebrow">SAVE YOUR SPOT</span>
      <h2>Be part of it.</h2>
      <p className="muted">Daftar dan jadikan acara ini bagian dari pengalaman kampusmu.</p>
      <div className="capacity-bar">
        <span style={{ width: `${filledPercent}%` }} />
      </div>
      <small className="muted">{seatsLeft} tempat tersisa</small>
      {message && (
        <div className="success-message">
          <CheckCircle2 size={17} />
          {message}
        </div>
      )}
      {error && <div className="form-error">{error}</div>}
      <button className="button button-full" disabled={busy || !canRegister} onClick={onRegister}>
        {getButtonLabel({ busy, isFull })}
      </button>
      <small className="muted panel-footnote">Pendaftaran mengikuti kuota yang tersedia.</small>
    </aside>
  );
}
