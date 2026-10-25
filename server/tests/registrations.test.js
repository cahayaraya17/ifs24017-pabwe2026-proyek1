import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'campuspulse-registration-test-'));
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
const insertUser = db.prepare('INSERT INTO users(name,email,password_hash,role) VALUES(?,?,?,?)');

const student1 = Number(
  insertUser.run('Student One', 'student1@example.com', passwordHash, 'student').lastInsertRowid,
);

const student2 = Number(
  insertUser.run('Student Two', 'student2@example.com', passwordHash, 'student').lastInsertRowid,
);

const organizerId = Number(
  insertUser.run('Organizer', 'organizer@example.com', passwordHash, 'organizer').lastInsertRowid,
);

function tokenFor(id, role = 'student') {
  return jwt.sign(
    { id, role, email: `${role}${id}@example.com`, name: role },
    process.env.JWT_SECRET,
    { expiresIn: '5m' },
  );
}

const student1Token = tokenFor(student1);
const student2Token = tokenFor(student2);

const existingCategory = db.prepare('SELECT id FROM categories LIMIT 1').get();
if (!existingCategory) {
  db.prepare('INSERT INTO categories(name) VALUES(?)').run('Test Category');
}
const categoryId = db.prepare('SELECT id FROM categories LIMIT 1').get().id;

function createEvent(title, capacity) {
  return Number(
    db
      .prepare(
        `
    INSERT INTO events (
      category_id, organizer_id, title, description, location,
      start_at, end_at, capacity, status, image_url
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `,
      )
      .run(
        categoryId,
        organizerId,
        title,
        'Registration test event',
        'Campus Hall',
        '2030-01-10T09:00:00.000Z',
        '2030-01-10T11:00:00.000Z',
        capacity,
        'published',
        '',
      ).lastInsertRowid,
  );
}

test('student can register for a published event', async () => {
  const eventId = createEvent('Available Event', 10);

  const response = await fetch(`${baseUrl}/api/events/${eventId}/register`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${student1Token}` },
  });

  assert.equal(response.status, 201);

  const registration = db
    .prepare('SELECT status FROM registrations WHERE event_id=? AND user_id=?')
    .get(eventId, student1);

  assert.equal(registration.status, 'registered');
});

test('duplicate registration is rejected', async () => {
  const eventId = createEvent('Duplicate Test Event', 10);

  const first = await fetch(`${baseUrl}/api/events/${eventId}/register`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${student1Token}` },
  });
  assert.equal(first.status, 201);

  const second = await fetch(`${baseUrl}/api/events/${eventId}/register`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${student1Token}` },
  });

  assert.equal(second.status, 409);
});

test('registration is rejected when event capacity is full', async () => {
  const eventId = createEvent('Full Capacity Event', 1);

  const first = await fetch(`${baseUrl}/api/events/${eventId}/register`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${student1Token}` },
  });
  assert.equal(first.status, 201);

  const second = await fetch(`${baseUrl}/api/events/${eventId}/register`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${student2Token}` },
  });

  assert.equal(second.status, 409);
  const body = await second.json();
  assert.match(body.error, /kuota.*penuh/i);
});

test.after(async () => {
  await new Promise((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
  db.close();
  fs.rmSync(tempDir, { recursive: true, force: true });
});
