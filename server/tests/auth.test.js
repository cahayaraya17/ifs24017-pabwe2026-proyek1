import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'campuspulse-test-'));
process.env.DB_PATH = path.join(tempDir, 'test.sqlite');
process.env.JWT_SECRET = 'test-secret-for-campus-pulse-at-least-24-characters';
process.env.CLIENT_ORIGIN = 'http://localhost:5173';

const { app } = await import('../src/app.js');
const { db } = await import('../src/config/database.js');
const { createServer } = await import('node:http');

const server = createServer(app);
await new Promise((resolve, reject) => {
  server.listen(0, '127.0.0.1', resolve);
  server.once('error', reject);
});

const baseUrl = `http://127.0.0.1:${server.address().port}`;

test('POST /api/auth/register creates a student account', async () => {
  const response = await fetch(`${baseUrl}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Test Student',
      email: 'student-test@example.com',
      password: 'StrongPass123!',
    }),
  });

  assert.equal(response.status, 201);
  const body = await response.json();
  assert.equal(body.user.email, 'student-test@example.com');
  assert.equal(body.user.role, 'student');
  assert.ok(body.token);
});

test('POST /api/auth/register rejects a duplicate email', async () => {
  const response = await fetch(`${baseUrl}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Test Student',
      email: 'student-test@example.com',
      password: 'StrongPass123!',
    }),
  });

  assert.equal(response.status, 409);
});

test('POST /api/auth/login rejects an incorrect password', async () => {
  const response = await fetch(`${baseUrl}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'student-test@example.com',
      password: 'WrongPassword123!',
    }),
  });

  assert.equal(response.status, 401);
});

test('GET /api/auth/me rejects a request without a token', async () => {
  const response = await fetch(`${baseUrl}/api/auth/me`);
  assert.equal(response.status, 401);
});

test.after(async () => {
  await new Promise((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
  db.close();
  fs.rmSync(tempDir, { recursive: true, force: true });
});
