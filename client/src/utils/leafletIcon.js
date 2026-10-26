import L from 'leaflet';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

/**
 * Ikon marker eksplisit. Bundler mengubah path gambar bawaan Leaflet sehingga ikon default
 * tidak termuat; mengimpor aset secara langsung menjamin URL-nya benar di dev maupun produksi.
 */
export const defaultMarkerIcon = L.icon({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});
