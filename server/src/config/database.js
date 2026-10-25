import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import Database from 'better-sqlite3';
import { config } from './env.js';
import { SCHEMA_SQL } from './schema.js';

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const DEFAULT_DB_PATH = path.resolve(currentDir, '../../data/campuspulse.sqlite');

function resolveDatabasePath() {
  const configured = config.dbPath || DEFAULT_DB_PATH;
  return path.isAbsolute(configured) ? configured : path.resolve(process.cwd(), configured);
}

function openDatabase() {
  const dbPath = resolveDatabasePath();
  fs.mkdirSync(path.dirname(dbPath), { recursive: true });

  const connection = new Database(dbPath);
  connection.pragma('foreign_keys = ON');
  connection.pragma('journal_mode = WAL');
  connection.exec(SCHEMA_SQL);
  return connection;
}

export const db = openDatabase();

/** Menjalankan `work` di dalam satu transaksi; rollback otomatis jika `work` melempar error. */
export function withTransaction(work) {
  return db.transaction(work)();
}
