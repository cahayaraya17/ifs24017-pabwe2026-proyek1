const GOOGLE_MAPS_SEARCH = 'https://www.google.com/maps/search/?api=1&query=';

export const CAMPUS_GOOGLE_MAPS_URL = `${GOOGLE_MAPS_SEARCH}Institut+Teknologi+Del+Sitoluama+Balige`;

export function googleMapsUrlFor({ lat, lng }) {
  return `${GOOGLE_MAPS_SEARCH}${lat},${lng}`;
}
