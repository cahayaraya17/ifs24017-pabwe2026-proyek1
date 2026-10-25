import { CalendarDays } from 'lucide-react';
import EventCard from '../EventCard';
import StatePanel from '../StatePanel';

export default function EventList({ events, loading, error }) {
  if (loading) return <StatePanel>Memuat acara kampus...</StatePanel>;

  if (error) {
    return (
      <StatePanel variant="error">
        <strong>Belum dapat memuat acara.</strong>
        <p>{error}</p>
        <small>Pastikan backend berjalan di port 4000 dan database sudah di-seed.</small>
      </StatePanel>
    );
  }

  if (!events.length) {
    return (
      <StatePanel>
        <span className="empty-icon">
          <CalendarDays size={24} />
        </span>
        <strong>Belum ada acara yang cocok.</strong>
        <p>Coba kata kunci atau kategori lain.</p>
      </StatePanel>
    );
  }

  return (
    <div className="event-grid">
      {events.map((event, index) => (
        <EventCard key={event.id} event={event} index={index} />
      ))}
    </div>
  );
}
