import test from 'node:test';
import assert from 'node:assert/strict';
import { parseEventInput } from '../src/validators/event.validator.js';
import { parseLoginInput, parseRegistrationInput } from '../src/validators/auth.validator.js';

const validEvent = {
  title: 'Workshop Node.js',
  description: 'Belajar Node.js',
  location: 'Lab 1',
  category_id: 1,
  capacity: 30,
  status: 'published',
  start_at: '2030-01-01T09:00:00.000Z',
  end_at: '2030-01-01T11:00:00.000Z',
};

test('parseEventInput normalizes a valid payload', () => {
  const result = parseEventInput({ ...validEvent, title: '  Workshop Node.js  ', capacity: '30' });
  assert.equal(result.title, 'Workshop Node.js');
  assert.equal(result.capacity, 30);
  assert.equal(result.start_at, '2030-01-01T09:00:00.000Z');
});

test('parseEventInput rejects invalid fields with a 400 error', () => {
  const cases = [
    [{ title: 'ab' }, /Judul acara/],
    [{ location: '' }, /Lokasi/],
    [{ category_id: '' }, /Kategori/],
    [{ capacity: 0 }, /Kuota/],
    [{ end_at: validEvent.start_at }, /Tanggal/],
    [{ status: 'archived' }, /Status/],
    [{ image_url: 'ftp://example.com/a.png' }, /URL gambar/],
  ];

  for (const [override, message] of cases) {
    assert.throws(
      () => parseEventInput({ ...validEvent, ...override }),
      (error) => error.status === 400 && message.test(error.message),
    );
  }
});

test('parseRegistrationInput trims input and lowercases the email', () => {
  const result = parseRegistrationInput({
    name: '  Budi  ',
    email: ' BUDI@Example.COM ',
    password: 'password123',
  });
  assert.deepEqual(result, { name: 'Budi', email: 'budi@example.com', password: 'password123' });
});

test('parseRegistrationInput rejects invalid name, email, and password', () => {
  const valid = { name: 'Budi', email: 'budi@example.com', password: 'password123' };
  for (const override of [{ name: 'B' }, { email: 'bukan-email' }, { password: 'short' }]) {
    assert.throws(
      () => parseRegistrationInput({ ...valid, ...override }),
      (error) => error.status === 400,
    );
  }
});

test('parseLoginInput never throws for missing fields', () => {
  assert.deepEqual(parseLoginInput(undefined), { email: '', password: '' });
});
