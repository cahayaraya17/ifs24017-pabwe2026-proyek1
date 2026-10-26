import { useEffect } from 'react';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { CAMPUS_CENTER, CAMPUS_PLACES, DEFAULT_ZOOM, SELECTED_ZOOM } from '../../data/campusPlaces';
import { defaultMarkerIcon } from '../../utils/leafletIcon';
import { googleMapsUrlFor } from '../../utils/maps';
import SelectedPlaceCard from './SelectedPlaceCard';

const TILE_URL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const TILE_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
const FLY_DURATION_SECONDS = 0.5;

/** Menggeser peta ke lokasi yang dipilih. */
function MapRecenter({ place }) {
  const map = useMap();

  useEffect(() => {
    if (place) map.flyTo([place.lat, place.lng], SELECTED_ZOOM, { duration: FLY_DURATION_SECONDS });
  }, [map, place]);

  return null;
}

export default function CampusMap({ selected, onSelect, onClearSelection }) {
  return (
    <div className="map-canvas-wrap">
      <MapContainer
        center={CAMPUS_CENTER}
        zoom={DEFAULT_ZOOM}
        scrollWheelZoom
        className="campus-leaflet-map"
      >
        <TileLayer attribution={TILE_ATTRIBUTION} url={TILE_URL} />
        <MapRecenter place={selected} />
        {CAMPUS_PLACES.map((place) => (
          <Marker
            key={place.id}
            position={[place.lat, place.lng]}
            icon={defaultMarkerIcon}
            eventHandlers={{ click: () => onSelect(place) }}
          >
            <Popup>
              <strong>{place.name}</strong>
              <br />
              {place.kind}
              <br />
              <a href={googleMapsUrlFor(place)} target="_blank" rel="noreferrer">
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

      {selected && <SelectedPlaceCard place={selected} onClose={onClearSelection} />}
    </div>
  );
}
