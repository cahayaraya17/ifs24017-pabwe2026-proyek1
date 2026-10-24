import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import bcrypt from 'bcryptjs';

const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'campuspulse-events-test-'));
process.env.DB_PATH = path.join(tempDir, 'test.sqlite');
process.env.JWT_SECRET = 'test-secret-for-campus-pulse-at-least-24-characters';
process.env.CLIENT_ORIGIN = 'http://localhost:5173';

const { app } = await import('../src/app.js');
const { db } = await import('../src/config/database.js');
const { createServer } = await import('node:http');
const jwt = await import('jsonwebtoken');

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
const student = insertUser.run('Test Student', 'student@example.com', passwordHash, 'student');
const organizer = insertUser.run('Test Organizer', 'organizer@example.com', passwordHash, 'organizer');

function tokenFor(id, role) {
  return jwt.default.sign(
    { id, role, email: `${role}@example.com`, name: role },
    process.env.JWT_SECRET,
    { expiresIn: '5m' }
  );
}

test('POST /api/events rejects a request without a token', async () => {
  const response = await fetch(`${baseUrl}/api/events`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({})
  });
  assert.equal(response.status, 401);
});

test('POST /api/events rejects a student token', async () => {
  const response = await fetch(`${baseUrl}/api/events`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${tokenFor(student.lastInsertRowid, 'student')}`
    },
    body: JSON.stringify({})
  });
  assert.equal(response.status, 403);
});

test('POST /api/events allows an organizer through role checks but validates event data', async () => {
  const response = await fetch(`${baseUrl}/api/events`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${tokenFor(organizer.lastInsertRowid, 'organizer')}`
    },
    body: JSON.stringify({})
  });
  assert.equal(response.status, 400);
  const body = await response.json();
  assert.match(body.error, /Judul acara/);
});

test.after(async () => {
  await new Promise((resolve, reject) => {
    server.close(error => error ? reject(error) : resolve());
  });
  db.close();
  fs.rmSync(tempDir, { recursive: true, force: true });
});
