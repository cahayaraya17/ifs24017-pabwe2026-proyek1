import test from 'node:test';
import assert from 'node:assert/strict';
import { createRateLimiter } from '../src/middleware/rateLimit.js';
import { errorHandler } from '../src/middleware/errorHandler.js';
import { securityHeaders } from '../src/middleware/securityHeaders.js';
import { HttpError } from '../src/utils/httpError.js';

function createResponse() {
  return {
    headers: {},
    statusCode: null,
    body: null,
    setHeader(name, value) {
      this.headers[name] = value;
    },
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.body = payload;
      return this;
    },
  };
}

test('rate limiter blocks requests above the maximum within the window', () => {
  const limiter = createRateLimiter({ windowMs: 60_000, max: 2 });
  const req = { ip: '10.0.0.1' };
  let passed = 0;

  limiter(req, createResponse(), () => (passed += 1));
  limiter(req, createResponse(), () => (passed += 1));

  assert.throws(
    () => limiter(req, createResponse(), () => (passed += 1)),
    (error) => error.status === 429,
  );
  assert.equal(passed, 2);
});

test('rate limiter tracks each client separately', () => {
  const limiter = createRateLimiter({ windowMs: 60_000, max: 1 });
  let passed = 0;
  limiter({ ip: 'a' }, createResponse(), () => (passed += 1));
  limiter({ ip: 'b' }, createResponse(), () => (passed += 1));
  assert.equal(passed, 2);
});

test('errorHandler exposes HttpError messages only and hides internal errors', () => {
  const original = console.error;
  console.error = () => {};

  const known = createResponse();
  errorHandler(HttpError.notFound('Tidak ada.'), {}, known, () => {});
  assert.equal(known.statusCode, 404);
  assert.deepEqual(known.body, { error: 'Tidak ada.' });

  const unknown = createResponse();
  errorHandler(new Error('SQLITE: secret detail'), {}, unknown, () => {});
  assert.equal(unknown.statusCode, 500);
  assert.equal(JSON.stringify(unknown.body).includes('secret'), false);

  console.error = original;
});

test('securityHeaders sets protective headers', () => {
  const res = createResponse();
  securityHeaders({}, res, () => {});
  assert.equal(res.headers['X-Content-Type-Options'], 'nosniff');
  assert.equal(res.headers['X-Frame-Options'], 'DENY');
});
