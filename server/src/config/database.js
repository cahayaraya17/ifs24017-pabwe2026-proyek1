import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import Database from 'better-sqlite3';
import dotenv from 'dotenv';
import { seedDemoData } from './autoSeed.js';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });
const here = path.dirname(fileURLToPath(import.meta.url));
// Di Vercel hanya /tmp yang dapat ditulis; di lokal tetap memakai server/data.
const defaultPath = process.env.VERCEL
  ? '/tmp/campuspulse.sqlite'
  : path.resolve(here, '../../data/campuspulse.sqlite');
const configured = process.env.DB_PATH || defaultPath;
const dbPath = path.isAbsolute(configured) ? configured : path.resolve(process.cwd(), configured);
fs.mkdirSync(path.dirname(dbPath), { recursive: true });

export const db = new Database(dbPath);
db.pragma('foreign_keys = ON');
db.pragma('journal_mode = WAL');

db.exec(`
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE COLLATE NOCASE,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'student' CHECK(role IN ('student','organizer','admin')),
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  description TEXT DEFAULT ''
);
CREATE TABLE IF NOT EXISTS events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  category_id INTEGER NOT NULL REFERENCES categories(id),
  organizer_id INTEGER NOT NULL REFERENCES users(id),
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  location TEXT NOT NULL,
  start_at TEXT NOT NULL,
  end_at TEXT NOT NULL,
  capacity INTEGER NOT NULL CHECK(capacity > 0),
  status TEXT NOT NULL DEFAULT 'draft' CHECK(status IN ('draft','published','cancelled')),
  image_url TEXT DEFAULT '',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS registrations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  event_id INTEGER NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'registered' CHECK(status IN ('registered','cancelled')),
  registered_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE(event_id, user_id)
);
CREATE INDEX IF NOT EXISTS idx_events_start_at ON events(start_at);
CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);
CREATE INDEX IF NOT EXISTS idx_registrations_event ON registrations(event_id, status);
`);

// Di Vercel database /tmp selalu kosong saat instance baru menyala, jadi isi data demo otomatis.
if (process.env.VERCEL) seedDemoData(db);

export function eventSelect(where = '') {
  return `
    SELECT e.*, c.name AS category_name, u.name AS organizer_name,
      (SELECT COUNT(*) FROM registrations r WHERE r.event_id=e.id AND r.status='registered') AS registered_count
    FROM events e
    JOIN categories c ON c.id=e.category_id
    JOIN users u ON u.id=e.organizer_id
    ${where}
  `;
}