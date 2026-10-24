import bcrypt from 'bcryptjs';
import { db } from '../../src/config/database.js';

const seed = db.transaction(() => {
  const categories = [
    ['Seminar','Seminar dan diskusi kampus'],
    ['Workshop','Kegiatan belajar praktik'],
    ['Kompetisi','Lomba dan kompetisi mahasiswa'],
    ['Karier','Karier dan pengembangan profesional'],
    ['Komunitas','Kegiatan organisasi dan komunitas'],
    ['Olahraga','Kegiatan olahraga'],
    ['Seni','Seni, musik, dan budaya']
  ];
  const insertCategory = db.prepare('INSERT OR IGNORE INTO categories(name,description) VALUES(?,?)');
  categories.forEach(c=>insertCategory.run(...c));

  const demoPassword = 'CampusPulse123!';
  const insertUser = db.prepare('INSERT OR IGNORE INTO users(name,email,password_hash,role) VALUES(?,?,?,?)');
  insertUser.run('CampusPulse Admin','admin@campuspulse.local',bcrypt.hashSync(demoPassword,10),'admin');
  insertUser.run('Event Organizer','organizer@campuspulse.local',bcrypt.hashSync(demoPassword,10),'organizer');
  insertUser.run('Demo Student','student@campuspulse.local',bcrypt.hashSync(demoPassword,10),'student');

  const organizer = db.prepare("SELECT id FROM users WHERE email='organizer@campuspulse.local'").get().id;
  const count = db.prepare('SELECT COUNT(*) AS count FROM events').get().count;
  if (count === 0) {
    const getCat = db.prepare('SELECT id FROM categories WHERE name=?');
    const insertEvent = db.prepare(`INSERT INTO events(category_id,organizer_id,title,description,location,start_at,end_at,capacity,status)
      VALUES(?,?,?,?,?,?,?,?,?)`);
    const now = new Date();
    const eventData = [
      ['Workshop','Build Your First Web App','Workshop hands-on untuk membangun aplikasi web pertamamu bersama komunitas teknologi kampus.','Lab Komputer 2',3,45],
      ['Seminar','Future of Digital Innovation','Diskusi inspiratif tentang teknologi, inovasi, dan peluang karier digital bagi mahasiswa.','Auditorium Utama',2,120],
      ['Kompetisi','Campus Creative Challenge','Tunjukkan ide kreatifmu dan kolaborasi dengan mahasiswa lintas program studi.','Student Center',7,80],
      ['Karier','Career Ready: CV & Interview','Persiapkan diri memasuki dunia kerja lewat praktik CV dan simulasi wawancara.','Ruang Seminar A',5,60],
      ['Komunitas','Meet the Campus Community','Kenali organisasi dan komunitas yang bisa menjadi rumah kedua selama kuliah.','Lapangan Kampus',10,100],
      ['Seni','Acoustic Night','Malam santai untuk menikmati musik, bertemu teman baru, dan merayakan kreativitas.','Taman Kampus',14,150]
    ];
    for (const [cat,title,description,location,days,capacity] of eventData) {
      const start = new Date(now.getTime()+days*86400000); start.setHours(9,0,0,0);
      const end = new Date(start.getTime()+2*3600000);
      insertEvent.run(getCat.get(cat).id,organizer,title,description,location,start.toISOString(),end.toISOString(),capacity,'published');
    }
  }
});
seed();
console.log('Database seeded. Demo accounts: admin@campuspulse.local, organizer@campuspulse.local, student@campuspulse.local');
db.close();
