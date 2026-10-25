import { CalendarDays, Clock, MapPin, Users } from 'lucide-react';
import { formatDateLong, formatTime } from '../../utils/date';

function InfoItem({ icon: Icon, label, value }) {
  return (
    <div>
      <Icon />
      <span>
        <small>{label}</small>
        <strong>{value}</strong>
      </span>
    </div>
  );
}

export default function EventInfoGrid({ event }) {
  const date = new Date(event.start_at);
  return (
    <div className="detail-info-grid">
      <InfoItem icon={CalendarDays} label="Tanggal" value={formatDateLong(date)} />
      <InfoItem icon={Clock} label="Waktu" value={formatTime(date)} />
      <InfoItem icon={MapPin} label="Lokasi" value={event.location} />
      <InfoItem
        icon={Users}
        label="Peserta"
        value={`${event.registered_count} / ${event.capacity}`}
      />
    </div>
  );
}
