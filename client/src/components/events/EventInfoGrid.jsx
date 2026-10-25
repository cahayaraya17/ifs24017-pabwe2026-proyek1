import { CalendarDays, Clock, MapPin, Users } from 'lucide-react';
import { formatLongDate, formatTime } from '../../utils/date';

export default function EventInfoGrid({ event }) {
  const items = [
    { icon: CalendarDays, label: 'Tanggal', value: formatLongDate(event.start_at) },
    { icon: Clock, label: 'Waktu', value: formatTime(event.start_at) },
    { icon: MapPin, label: 'Lokasi', value: event.location },
    { icon: Users, label: 'Peserta', value: `${event.registered_count} / ${event.capacity}` },
  ];

  return (
    <div className="detail-info-grid">
      {items.map(({ icon: Icon, label, value }) => (
        <div key={label}>
          <Icon />
          <span>
            <small>{label}</small>
            <strong>{value}</strong>
          </span>
        </div>
      ))}
    </div>
  );
}
