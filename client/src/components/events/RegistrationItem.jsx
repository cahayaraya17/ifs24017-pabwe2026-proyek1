import { CalendarDays, MapPin, XCircle } from 'lucide-react';
import { REGISTRATION_STATUS } from '../../constants/events';
import { formatDateTime } from '../../utils/date';

export default function RegistrationItem({ registration, onCancel }) {
  const { id, title, start_at: startAt, location, status } = registration;

  return (
    <article className="registration-item">
      <div className="registration-icon">
        <CalendarDays />
      </div>
      <div className="registration-copy">
        <strong>{title}</strong>
        <span>
          <CalendarDays size={14} />
          {formatDateTime(startAt)}
        </span>
        <span>
          <MapPin size={14} />
          {location}
        </span>
      </div>
      <span className={`status-badge status-${status}`}>{status}</span>
      {status === REGISTRATION_STATUS.REGISTERED && (
        <button className="button button-ghost button-small" onClick={() => onCancel(id)}>
          <XCircle size={15} /> Cancel
        </button>
      )}
    </article>
  );
}
