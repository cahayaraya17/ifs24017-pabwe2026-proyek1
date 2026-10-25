import test from 'node:test';
import assert from 'node:assert/strict';
import os from 'node:os';
import path from 'node:path';

process.env.DB_PATH = path.join(
  os.tmpdir(),
  `campuspulse-seed-${process.pid}-${Date.now()}.sqlite`,
);
process.env.JWT_SECRET = 'test-secret-test-secret-test-secret-1234';

const { db } = await import('../src/config/database.js');
const { seedDemoData } = await import('../src/seed/seedDemoData.js');
const { SEED_CATEGORIES, SEED_EVENTS, SEED_USERS } = await import('../src/seed/demoData.js');

const countOf = (table) => db.prepare(`SELECT COUNT(*) AS count FROM ${table}`).get().count;

test('seedDemoData fills categories, demo users, and events', () => {
  seedDemoData(db);

  assert.equal(countOf('categories'), SEED_CATEGORIES.length);
  assert.equal(countOf('users'), SEED_USERS.length);
  assert.equal(countOf('events'), SEED_EVENTS.length);
});

test('seedDemoData is idempotent when run again', () => {
  seedDemoData(db);

  assert.equal(countOf('categories'), SEED_CATEGORIES.length);
  assert.equal(countOf('users'), SEED_USERS.length);
  assert.equal(countOf('events'), SEED_EVENTS.length);
});
