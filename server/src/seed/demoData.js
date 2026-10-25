export const DEMO_PASSWORD = 'CampusPulse123!';

export const SEED_CATEGORIES = [
  ['Seminar', 'Seminar dan diskusi kampus'],
  ['Workshop', 'Kegiatan belajar praktik'],
  ['Kompetisi', 'Lomba dan kompetisi mahasiswa'],
  ['Karier', 'Karier dan pengembangan profesional'],
  ['Komunitas', 'Kegiatan organisasi dan komunitas'],
  ['Olahraga', 'Kegiatan olahraga'],
  ['Seni', 'Seni, musik, dan budaya'],
];

export const SEED_USERS = [
  { name: 'CampusPulse Admin', email: 'admin@campuspulse.local', role: 'admin' },
  { name: 'Event Organizer', email: 'organizer@campuspulse.local', role: 'organizer' },
  { name: 'Demo Student', email: 'student@campuspulse.local', role: 'student' },
];

export const ORGANIZER_EMAIL = 'organizer@campuspulse.local';

/** [kategori, judul, deskripsi, lokasi, jumlah hari dari sekarang, kuota] */
export const SEED_EVENTS = [
  [
    'Workshop',
    'Build Your First Web App',
    'Workshop hands-on untuk membangun aplikasi web pertamamu bersama komunitas teknologi kampus.',
    'Lab Komputer 2',
    3,
    45,
  ],
  [
    'Seminar',
    'Future of Digital Innovation',
    'Diskusi inspiratif tentang teknologi, inovasi, dan peluang karier digital bagi mahasiswa.',
    'Auditorium Utama',
    2,
    120,
  ],
  [
    'Kompetisi',
    'Campus Creative Challenge',
    'Tunjukkan ide kreatifmu dan kolaborasi dengan mahasiswa lintas program studi.',
    'Student Center',
    7,
    80,
  ],
  [
    'Karier',
    'Career Ready: CV & Interview',
    'Persiapkan diri memasuki dunia kerja lewat praktik CV dan simulasi wawancara.',
    'Ruang Seminar A',
    5,
    60,
  ],
  [
    'Komunitas',
    'Meet the Campus Community',
    'Kenali organisasi dan komunitas yang bisa menjadi rumah kedua selama kuliah.',
    'Lapangan Kampus',
    10,
    100,
  ],
  [
    'Seni',
    'Acoustic Night',
    'Malam santai untuk menikmati musik, bertemu teman baru, dan merayakan kreativitas.',
    'Taman Kampus',
    14,
    150,
  ],
];
