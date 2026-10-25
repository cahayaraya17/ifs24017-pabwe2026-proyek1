import { useEffect } from 'react';
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import { MapPin } from 'lucide-react';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { CAMPUS_CENTER, CAMPUS_PLACES } from '../../constants';
import { placeDirectionsUrl } from '../../utils/maps';

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

function MapRecenter({ place }) {
  const map = useMap();

  useEffect(() => {
    if (place) map.flyTo([place.lat, place.lng], 18, { duration: 0.5 });
  }, [map, place]);

  return null;
}

function SelectedPlaceCard({ place, onClose }) {
  return (
    <div className="map-selected-card">
      <button type="button" className="map-close" onClick={onClose} aria-label="Tutup lokasi dipilih">
        ×
      </button>
      <span className="eyebrow">LOKASI DIPILIH</span>
      <h3>{place.name}</h3>
      <p>{place.kind} · Institut Teknologi Del</p>
      <a href={placeDirectionsUrl(place)} target="_blank" rel="noreferrer">
        <MapPin size={14} /> Buka lokasi di Google Maps
      </a>
    </div>
  );
}

export default function CampusMapCanvas({ selected, onSelect }) {
  return (
    <div className="map-canvas-wrap">
      <MapContainer center={CAMPUS_CENTER} zoom={17} scrollWheelZoom className="campus-leaflet-map">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapRecenter place={selected} />
        {CAMPUS_PLACES.map((place) => (
          <Marker
            key={place.id}
            position={[place.lat, place.lng]}
            eventHandlers={{ click: () => onSelect(place) }}
          >
            <Popup>
              <strong>{place.name}</strong>
              <br />
              {place.kind}
              <br />
              <a href={placeDirectionsUrl(place)} target="_blank" rel="noreferrer">
                Buka petunjuk arah
              </a>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      <div className="map-legend">
        <span>
          <i className="legend-dot place-dot" /> Lokasi kampus
        </span>
        <span>
          <i className="legend-dot event-dot" /> Kegiatan kampus
        </span>
      </div>
      {selected && <SelectedPlaceCard place={selected} onClose={() => onSelect(null)} />}
    </div>
  );
}
