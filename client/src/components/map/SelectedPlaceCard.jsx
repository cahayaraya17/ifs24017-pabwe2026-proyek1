import { MapPin } from 'lucide-react';
import { googleMapsUrlFor } from '../../utils/maps';

export default function SelectedPlaceCard({ place, onClose }) {
  return (
    <div className="map-selected-card">
      <button className="map-close" onClick={onClose} aria-label="Tutup">
        ×
      </button>
      <span className="eyebrow">LOKASI DIPILIH</span>
      <h3>{place.name}</h3>
      <p>{place.kind} · Institut Teknologi Del</p>
      <a href={googleMapsUrlFor(place)} target="_blank" rel="noreferrer">
        <MapPin size={14} /> Buka lokasi di Google Maps
      </a>
    </div>
  );
}
