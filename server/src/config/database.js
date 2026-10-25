import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import Database from 'better-sqlite3';
import { seedDemoData } from '../seed/seedDemoData.js';
import { config } from './env.js';
import { SCHEMA_SQL } from './schema.js';

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const LOCAL_DB_PATH = path.resolve(currentDir, '../../data/campuspulse.sqlite');
const SERVERLESS_DB_PATH = '/tmp/campuspulse.sqlite';

function resolveDatabasePath() {
  const defaultPath = config.isServerless ? SERVERLESS_DB_PATH : LOCAL_DB_PATH;
  const configured = config.dbPath || defaultPath;
  return path.isAbsolute(configured) ? configured : path.resolve(process.cwd(), configured);
}

/** Kegagalan seed tidak boleh menjatuhkan API; cukup dicatat di log. */
function seedSafely(connection) {
  try {
    seedDemoData(connection);
  } catch (error) {
    console.error('Seed otomatis gagal:', error);
  }
}

function openDatabase() {
  const dbPath = resolveDatabasePath();
  fs.mkdirSync(path.dirname(dbPath), { recursive: true });

  const connection = new Database(dbPath);
  connection.pragma('foreign_keys = ON');
  connection.pragma('journal_mode = WAL');
  connection.exec(SCHEMA_SQL);

  // Database /tmp selalu kosong saat instance serverless baru menyala, jadi isi data demo otomatis.
  if (config.isServerless) seedSafely(connection);
  return connection;
}

export const db = openDatabase();

/** Menjalankan `work` di dalam satu transaksi; rollback otomatis jika `work` melempar error. */
export function withTransaction(work) {
  return db.transaction(work)();
}
