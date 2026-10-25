import { useMemo, useState } from 'react';
import { ArrowLeft, CalendarDays, ExternalLink, Radio } from 'lucide-react';
import { Link } from 'react-router-dom';
import CampusMap from '../components/map/CampusMap';
import MapSidebar from '../components/map/MapSidebar';
import { ROUTES } from '../constants/routes';
import { ALL_KINDS, CAMPUS_PLACES } from '../data/campusPlaces';
import { CAMPUS_GOOGLE_MAPS_URL } from '../utils/maps';

function filterPlaces(query, kind) {
  const keyword = query.toLowerCase();
  return CAMPUS_PLACES.filter(
    (place) =>
      place.name.toLowerCase().includes(keyword) && (kind === ALL_KINDS || place.kind === kind),
  );
}

export default function CampusMapPage() {
  const [query, setQuery] = useState('');
  const [kind, setKind] = useState(ALL_KINDS);
  const [selected, setSelected] = useState(null);
  const places = useMemo(() => filterPlaces(query, kind), [query, kind]);

  return (
    <main className="campus-map-page container">
      <div className="map-page-heading">
        <div>
          <Link to={ROUTES.HOME} className="back-link">
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
        <a
          className="button button-ghost"
          href={CAMPUS_GOOGLE_MAPS_URL}
          target="_blank"
          rel="noreferrer"
        >
          <ExternalLink size={16} /> Google Maps
        </a>
      </div>

      <div className="map-layout">
        <MapSidebar
          query={query}
          onQueryChange={setQuery}
          kind={kind}
          onKindChange={setKind}
          places={places}
          selected={selected}
          onSelect={setSelected}
        />
        <CampusMap
          selected={selected}
          onSelect={setSelected}
          onClearSelection={() => setSelected(null)}
        />
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
