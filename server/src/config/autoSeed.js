import bcrypt from 'bcryptjs';

// Mengisi data demo (kategori, akun demo, acara contoh) secara idempoten.
// Dipakai di Vercel karena database SQLite di /tmp kosong setiap instance baru menyala.
export function seedDemoData(db) {
  const categories = [
    ['Seminar', 'Seminar dan diskusi kampus'],
    ['Workshop', 'Kegiatan belajar praktik'],
    ['Kompetisi', 'Lomba dan kompetisi mahasiswa'],
    ['Karier', 'Karier dan pengembangan profesional'],
    ['Komunitas', 'Kegiatan organisasi dan komunitas'],
    ['Olahraga', 'Kegiatan olahraga'],
    ['Seni', 'Seni, musik, dan budaya'],
  ];
  const events = [
    ['Workshop', 'Build Your First Web App', 'Workshop hands-on untuk membangun aplikasi web pertamamu bersama komunitas teknologi kampus.', 'Lab Komputer 2', 3, 45],
    ['Seminar', 'Future of Digital Innovation', 'Diskusi inspiratif tentang teknologi, inovasi, dan peluang karier digital bagi mahasiswa.', 'Auditorium Utama', 2, 120],
    ['Kompetisi', 'Campus Creative Challenge', 'Tunjukkan ide kreatifmu dan kolaborasi dengan mahasiswa lintas program studi.', 'Student Center', 7, 80],
    ['Karier', 'Career Ready: CV & Interview', 'Persiapkan diri memasuki dunia kerja lewat praktik CV dan simulasi wawancara.', 'Ruang Seminar A', 5, 60],
    ['Komunitas', 'Meet the Campus Community', 'Kenali organisasi dan komunitas yang bisa menjadi rumah kedua selama kuliah.', 'Lapangan Kampus', 10, 100],
    ['Seni', 'Acoustic Night', 'Malam santai untuk menikmati musik, bertemu teman baru, dan merayakan kreativitas.', 'Taman Kampus', 14, 150],
  ];

  const run = db.transaction(() => {
    const insertCategory = db.prepare('INSERT OR IGNORE INTO categories(name,description) VALUES(?,?)');
    categories.forEach((c) => insertCategory.run(...c));

    const hash = bcrypt.hashSync('CampusPulse123!', 10);
    const insertUser = db.prepare('INSERT OR IGNORE INTO users(name,email,password_hash,role) VALUES(?,?,?,?)');
    insertUser.run('CampusPulse Admin', 'admin@campuspulse.local', hash, 'admin');
    insertUser.run('Event Organizer', 'organizer@campuspulse.local', hash, 'organizer');
    insertUser.run('Demo Student', 'student@campuspulse.local', hash, 'student');

    if (db.prepare('SELECT COUNT(*) AS count FROM events').get().count > 0) return;
    const organizer = db.prepare("SELECT id FROM users WHERE email='organizer@campuspulse.local'").get().id;
    const getCategory = db.prepare('SELECT id FROM categories WHERE name=?');
    const insertEvent = db.prepare(`INSERT INTO events(category_id,organizer_id,title,description,location,start_at,end_at,capacity,status)
      VALUES(?,?,?,?,?,?,?,?,?)`);
    const now = Date.now();
    for (const [category, title, description, location, days, capacity] of events) {
      const start = new Date(now + days * 86400000);
      start.setHours(9, 0, 0, 0);
      const end = new Date(start.getTime() + 2 * 3600000);
      insertEvent.run(getCategory.get(category).id, organizer, title, description, location, start.toISOString(), end.toISOString(), capacity, 'published');
    }
  });

  try {
    run();
  } catch (err) {
    console.error('Seed otomatis gagal:', err);
  }
}
