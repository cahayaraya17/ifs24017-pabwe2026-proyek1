import { ArrowUpRight, CalendarDays, MapPin, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { EVENT_PALETTES } from '../constants';
import { formatDateShort, formatDay, formatMonthShort, parseDate } from '../utils/date';

function EventArt({ event, date, paletteClass }) {
  return (
    <div className={`event-art ${paletteClass}`}>
      <span className="art-orb orb-one" />
      <span className="art-orb orb-two" />
      <span className="category-pill">{event.category_name || 'Campus event'}</span>
      <div className="art-date">
        <strong>{date ? formatDay(date) : '—'}</strong>
        <span>{date ? formatMonthShort(date) : ''}</span>
      </div>
      <span className="art-symbol">
        <CalendarDays size={34} />
      </span>
    </div>
  );
}

export default function EventCard({ event, index = 0 }) {
  const date = parseDate(event.start_at);
  const paletteClass = EVENT_PALETTES[index % EVENT_PALETTES.length];

  return (
    <article className="event-card">
      <EventArt event={event} date={date} paletteClass={paletteClass} />
      <div className="event-card-body">
        <div className="event-meta">
          <span>
            <CalendarDays size={14} />
            {date ? formatDateShort(date) : 'Jadwal menyusul'}
          </span>
          <span>
            <Users size={14} />
            {event.registered_count ?? 0} joined
          </span>
        </div>
        <h3>{event.title}</h3>
        <p className="muted event-description">
          {event.description || 'Temukan pengalaman baru dan terhubung dengan komunitas kampus.'}
        </p>
        <div className="event-card-footer">
          <span className="location">
            <MapPin size={15} />
            {event.location}
          </span>
          <Link
            to={`/events/${event.id}`}
            className="round-link"
            aria-label={`Lihat ${event.title}`}
          >
            <ArrowUpRight size={19} />
          </Link>
        </div>
      </div>
    </article>
  );
}
