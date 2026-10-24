import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'campuspulse-owner-test-'));
process.env.DB_PATH = path.join(tempDir, 'test.sqlite');
process.env.JWT_SECRET = 'test-secret-for-campus-pulse-at-least-24-characters';
process.env.CLIENT_ORIGIN = 'http://localhost:5173';

const { app } = await import('../src/app.js');
const { db } = await import('../src/config/database.js');
const { createServer } = await import('node:http');

const server = createServer(app);
await new Promise((resolve, reject) => {
  server.once('error', reject);
  server.listen(0, '127.0.0.1', resolve);
});
const baseUrl = `http://127.0.0.1:${server.address().port}`;

const passwordHash = bcrypt.hashSync('TestPassword123!', 4);
const insertUser = db.prepare(
  'INSERT INTO users(name,email,password_hash,role) VALUES(?,?,?,?)'
);

const ownerId = Number(insertUser.run(
  'Owner Organizer', 'owner@example.com', passwordHash, 'organizer'
).lastInsertRowid);

const otherId = Number(insertUser.run(
  'Other Organizer', 'other@example.com', passwordHash, 'organizer'
).lastInsertRowid);

function tokenFor(id, role = 'organizer') {
  return jwt.sign(
    { id, role, email: `${role}${id}@example.com`, name: role },
    process.env.JWT_SECRET,
    { expiresIn: '5m' }
  );
}

const ownerToken = tokenFor(ownerId);
const otherToken = tokenFor(otherId);

const category = db.prepare('SELECT id FROM categories LIMIT 1').get();
if (!category) {
  db.prepare('INSERT INTO categories(name) VALUES(?)').run('Test Category');
}
const categoryId = db.prepare('SELECT id FROM categories LIMIT 1').get().id;

const eventResult = db.prepare(`
  INSERT INTO events (
    category_id, organizer_id, title, description, location,
    start_at, end_at, capacity, status, image_url
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`).run(
  categoryId,
  ownerId,
  'Owner Test Event',
  'Event for ownership tests',
  'Campus Hall',
  '2030-01-10T09:00:00.000Z',
  '2030-01-10T11:00:00.000Z',
  20,
  'published',
  ''
);

const eventId = Number(eventResult.lastInsertRowid);

test('organizer cannot update another organizer event', async () => {
  const response = await fetch(`${baseUrl}/api/events/${eventId}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${otherToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ title: 'Unauthorized Change' })
  });

  assert.equal(response.status, 403);
});

test('organizer cannot delete another organizer event', async () => {
  const response = await fetch(`${baseUrl}/api/events/${eventId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${otherToken}` }
  });

  assert.equal(response.status, 403);

  const event = db.prepare('SELECT id FROM events WHERE id = ?').get(eventId);
  assert.ok(event, 'Event should still exist after rejected deletion');
});

test('event owner can update their own event', async () => {
  const response = await fetch(`${baseUrl}/api/events/${eventId}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${ownerToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ title: 'Updated Owner Event' })
  });

  assert.equal(response.status, 200);
  const body = await response.json();
  assert.equal(body.event.title, 'Updated Owner Event');
});

test.after(async () => {
  await new Promise((resolve, reject) => {
    server.close(error => error ? reject(error) : resolve());
  });
  db.close();
  fs.rmSync(tempDir, { recursive: true, force: true });
});
