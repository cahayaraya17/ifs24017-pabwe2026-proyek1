import test from 'node:test';
import assert from 'node:assert/strict';
import { parsePagination, parsePositiveInt, parseSearchText } from '../src/utils/parsers.js';

test('parsePositiveInt accepts only positive integers', () => {
  assert.equal(parsePositiveInt('7'), 7);
  for (const value of ['0', '-1', '1.5', 'abc', undefined, null]) {
    assert.equal(parsePositiveInt(value), null);
  }
});

test('parsePagination applies defaults and limits', () => {
  assert.deepEqual(parsePagination({}), { page: 1, limit: 30, offset: 0 });
  assert.deepEqual(parsePagination({ page: '3', limit: '10' }), { page: 3, limit: 10, offset: 20 });
  assert.equal(parsePagination({ limit: '9999' }).limit, 100);
  assert.equal(parsePagination({ page: '-4', limit: 'abc' }).page, 1);
});

test('parseSearchText trims and caps the length', () => {
  assert.equal(parseSearchText('  halo  '), 'halo');
  assert.equal(parseSearchText('a'.repeat(500)).length, 100);
});
