import { ArrowRight, CalendarDays, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import StatePanel from '../common/StatePanel';
import EventCard from '../events/EventCard';
import { EVENT_CATEGORIES } from '../../constants/events';
import { ROUTES } from '../../constants/routes';

function EventResults({ events, loading, error }) {
  if (loading) return <StatePanel>Memuat acara kampus...</StatePanel>;

  if (error) {
    return (
      <StatePanel variant="error-state">
        <strong>Belum dapat memuat acara.</strong>
        <p>{error}</p>
        <small>Pastikan backend berjalan di port 4000 dan database sudah di-seed.</small>
      </StatePanel>
    );
  }

  if (events.length === 0) {
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

export default function EventDiscovery({
  events,
  loading,
  error,
  query,
  onQueryChange,
  category,
  onCategoryChange,
}) {
  return (
    <section className="discover-section container" id="discover">
      <div className="section-heading">
        <div>
          <div className="eyebrow">FIND YOUR NEXT EXPERIENCE</div>
          <h2>
            What&apos;s happening <span className="gradient-text">on campus?</span>
          </h2>
          <p className="muted">Satu tempat untuk menemukan hal-hal menarik di kampusmu.</p>
        </div>
        <Link className="button button-small" to={ROUTES.MAP}>
          Lihat Peta Kampus <ArrowRight size={15} />
        </Link>
        <span className="section-count">{events.length} events found</span>
      </div>

      <div className="event-toolbar">
        <label className="search-box">
          <Search size={18} />
          <input
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Cari acara, seminar, workshop..."
          />
        </label>
        <div className="category-filters">
          {EVENT_CATEGORIES.map((name) => (
            <button
              key={name}
              onClick={() => onCategoryChange(name)}
              className={`filter-chip ${category === name ? 'active' : ''}`}
            >
              {name}
            </button>
          ))}
        </div>
      </div>

      <EventResults events={events} loading={loading} error={error} />
    </section>
  );
}
