export const CAMPUS_MAPS_URL =
  'https://www.google.com/maps/search/?api=1&query=Institut+Teknologi+Del+Sitoluama+Balige';

export function placeDirectionsUrl(place) {
  return `https://www.google.com/maps/search/?api=1&query=${place.lat},${place.lng}`;
}
