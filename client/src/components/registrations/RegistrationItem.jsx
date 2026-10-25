import { CalendarDays, MapPin, XCircle } from 'lucide-react';
import { formatDateTime } from '../../utils/date';

export default function RegistrationItem({ registration, onCancel }) {
  return (
    <article className="registration-item">
      <div className="registration-icon">
        <CalendarDays />
      </div>
      <div className="registration-copy">
        <strong>{registration.title}</strong>
        <span>
          <CalendarDays size={14} />
          {formatDateTime(registration.start_at)}
        </span>
        <span>
          <MapPin size={14} />
          {registration.location}
        </span>
      </div>
      <span className={`status-badge status-${registration.status}`}>{registration.status}</span>
      {registration.status === 'registered' && (
        <button
          className="button button-ghost button-small"
          onClick={() => onCancel(registration.id)}
        >
          <XCircle size={15} /> Cancel
        </button>
      )}
    </article>
  );
}
