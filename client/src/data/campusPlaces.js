// Koordinat adalah perkiraan awal di sekitar Institut Teknologi Del;
// cocokkan tiap titik langsung di lokasi sebelum dipakai di produksi.
export const CAMPUS_PLACES = Object.freeze([
  { id: 'library', name: 'Perpustakaan', lat: 2.38465, lng: 99.1472, kind: 'Fasilitas' },
  { id: 'na70', name: 'Lapangan NA70', lat: 2.3842, lng: 99.14615, kind: 'Lapangan' },
  { id: 'green', name: 'Lapangan Hijau', lat: 2.38505, lng: 99.14595, kind: 'Lapangan' },
  { id: 'ot', name: 'Open Theater (OT)', lat: 2.38542, lng: 99.1471, kind: 'Kegiatan' },
  { id: 'eh', name: 'Entrance Hall (EH)', lat: 2.3839, lng: 99.14772, kind: 'Fasilitas' },
  { id: 'pniel', name: 'Lapangan Pniel', lat: 2.38345, lng: 99.1466, kind: 'Lapangan' },
  { id: 'old-canteen', name: 'Kantin Lama', lat: 2.38472, lng: 99.14802, kind: 'Kuliner' },
  { id: 'new-canteen', name: 'Kantin Baru', lat: 2.38512, lng: 99.14812, kind: 'Kuliner' },
  { id: 'auditorium', name: 'Auditorium', lat: 2.38555, lng: 99.14635, kind: 'Fasilitas' },
]);

export const CAMPUS_CENTER = [2.38465, 99.14695];
export const DEFAULT_ZOOM = 17;
export const SELECTED_ZOOM = 18;

export const ALL_KINDS = 'Semua';
export const PLACE_KINDS = Object.freeze([
  ALL_KINDS,
  'Fasilitas',
  'Lapangan',
  'Kegiatan',
  'Kuliner',
]);
