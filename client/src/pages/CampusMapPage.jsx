import { ArrowLeft, CalendarDays, ExternalLink, Radio } from 'lucide-react';
import { Link } from 'react-router-dom';
import CampusMapCanvas from '../components/map/CampusMapCanvas';
import MapSidebar from '../components/map/MapSidebar';
import { useCampusMap } from '../hooks/useCampusMap';
import { CAMPUS_MAPS_URL } from '../utils/maps';

export default function CampusMapPage() {
  const { query, setQuery, filter, setFilter, selected, setSelected, filtered } = useCampusMap();

  return (
    <main className="campus-map-page container">
      <div className="map-page-heading">
        <div>
          <Link to="/" className="back-link">
            <ArrowLeft size={16} /> Kembali
          </Link>
          <div className="eyebrow">
            <Radio size={13} /> CAMPUS LIVE MAP
          </div>
          <h1>
            Explore your <span className="gradient-text">campus.</span>
          </h1>
          <p className="muted">
            Temukan lokasi penting dan lihat titik kegiatan di Institut Teknologi Del.
          </p>
        </div>
        <a className="button button-ghost" href={CAMPUS_MAPS_URL} target="_blank" rel="noreferrer">
          <ExternalLink size={16} /> Google Maps
        </a>
      </div>
      <div className="map-layout">
        <MapSidebar
          query={query}
          onQueryChange={setQuery}
          filter={filter}
          onFilterChange={setFilter}
          places={filtered}
          selected={selected}
          onSelect={setSelected}
        />
        <CampusMapCanvas selected={selected} onSelect={setSelected} />
      </div>
      <section className="map-events-hint">
        <CalendarDays size={19} />
        <div>
          <strong>Acara di sekitar kampus</strong>
          <p>
            Berikutnya: hubungkan lokasi acara dari dashboard organizer agar acara yang sedang
            berlangsung atau akan datang tampil sebagai penanda di peta.
          </p>
        </div>
      </section>
    </main>
  );
}
