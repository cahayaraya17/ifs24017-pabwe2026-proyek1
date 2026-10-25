import { ArrowUpRight, CalendarDays, MapPin, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import { getEventDateParts } from '../../utils/date';

const ART_PALETTES = ['event-art-purple', 'event-art-blue', 'event-art-pink', 'event-art-green'];
const DEFAULT_CATEGORY = 'Campus event';
const DEFAULT_DESCRIPTION = 'Temukan pengalaman baru dan terhubung dengan komunitas kampus.';

export default function EventCard({ event, index = 0 }) {
  const { day, month, label } = getEventDateParts(event.start_at);

  return (
    <article className="event-card">
      <div className={`event-art ${ART_PALETTES[index % ART_PALETTES.length]}`}>
        <span className="art-orb orb-one" />
        <span className="art-orb orb-two" />
        <span className="category-pill">{event.category_name || DEFAULT_CATEGORY}</span>
        <div className="art-date">
          <strong>{day}</strong>
          <span>{month}</span>
        </div>
        <span className="art-symbol">
          <CalendarDays size={34} />
        </span>
      </div>

      <div className="event-card-body">
        <div className="event-meta">
          <span>
            <CalendarDays size={14} />
            {label}
          </span>
          <span>
            <Users size={14} />
            {event.registered_count ?? 0} joined
          </span>
        </div>
        <h3>{event.title}</h3>
        <p className="muted event-description">{event.description || DEFAULT_DESCRIPTION}</p>
        <div className="event-card-footer">
          <span className="location">
            <MapPin size={15} />
            {event.location}
          </span>
          <Link
            to={ROUTES.eventDetail(event.id)}
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
