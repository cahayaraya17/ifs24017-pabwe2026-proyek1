import { MapPin, Search } from 'lucide-react';
import { MAP_FILTERS } from '../../constants';

export default function MapSidebar({
  query,
  onQueryChange,
  filter,
  onFilterChange,
  places,
  selected,
  onSelect,
}) {
  return (
    <aside className="map-sidebar">
      <div className="map-search">
        <Search size={17} />
        <input
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Cari lokasi kampus..."
        />
      </div>
      <div className="map-filter-row">
        {MAP_FILTERS.map((item) => (
          <button
            key={item}
            onClick={() => onFilterChange(item)}
            className={filter === item ? 'filter-chip active' : 'filter-chip'}
          >
            {item}
          </button>
        ))}
      </div>
      <div className="map-location-heading">
        <strong>Lokasi utama</strong>
        <span>{places.length} lokasi</span>
      </div>
      <div className="map-place-list">
        {places.map((place) => (
          <button
            key={place.id}
            className={selected?.id === place.id ? 'map-place selected' : 'map-place'}
            onClick={() => onSelect(place)}
          >
            <span className="map-place-marker">
              <MapPin size={17} />
            </span>
            <span>
              <strong>{place.name}</strong>
              <small>{place.kind}</small>
            </span>
            <span className="place-chevron">›</span>
          </button>
        ))}
      </div>
      <div className="map-note">
        <strong>Catatan lokasi</strong>
        <p>
          Posisi pin adalah perkiraan awal dan perlu dicocokkan dengan lokasi bangunan/lapangan yang
          tepat. Penanda kegiatan akan muncul di sini setelah acara memiliki lokasi dan jadwal.
        </p>
      </div>
    </aside>
  );
}
