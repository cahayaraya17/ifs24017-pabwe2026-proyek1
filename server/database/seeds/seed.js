import bcrypt from 'bcryptjs';
import { db } from '../../src/config/database.js';
import {
  DEMO_PASSWORD,
  ORGANIZER_EMAIL,
  SEED_CATEGORIES,
  SEED_EVENTS,
  SEED_USERS,
} from './data.js';

const SEED_BCRYPT_ROUNDS = 10;
const ONE_DAY_MS = 24 * 60 * 60 * 1000;
const TWO_HOURS_MS = 2 * 60 * 60 * 1000;
const EVENT_START_HOUR = 9;

function seedCategories() {
  const insert = db.prepare('INSERT OR IGNORE INTO categories (name, description) VALUES (?, ?)');
  SEED_CATEGORIES.forEach((category) => insert.run(...category));
}

function seedUsers() {
  const passwordHash = bcrypt.hashSync(DEMO_PASSWORD, SEED_BCRYPT_ROUNDS);
  const insert = db.prepare(
    'INSERT OR IGNORE INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
  );
  SEED_USERS.forEach(({ name, email, role }) => insert.run(name, email, passwordHash, role));
}

function seedEvents() {
  const { count } = db.prepare('SELECT COUNT(*) AS count FROM events').get();
  if (count > 0) return;

  const organizerId = db.prepare('SELECT id FROM users WHERE email = ?').get(ORGANIZER_EMAIL).id;
  const findCategory = db.prepare('SELECT id FROM categories WHERE name = ?');
  const insert = db.prepare(
    `INSERT INTO events (category_id, organizer_id, title, description, location,
                         start_at, end_at, capacity, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'published')`,
  );
  const now = Date.now();

  for (const [category, title, description, location, daysAhead, capacity] of SEED_EVENTS) {
    const start = new Date(now + daysAhead * ONE_DAY_MS);
    start.setHours(EVENT_START_HOUR, 0, 0, 0);
    const end = new Date(start.getTime() + TWO_HOURS_MS);

    insert.run(
      findCategory.get(category).id,
      organizerId,
      title,
      description,
      location,
      start.toISOString(),
      end.toISOString(),
      capacity,
    );
  }
}

db.transaction(() => {
  seedCategories();
  seedUsers();
  seedEvents();
})();

console.log(`Database seeded. Demo accounts: ${SEED_USERS.map((user) => user.email).join(', ')}`);
db.close();
