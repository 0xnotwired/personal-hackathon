import test from 'node:test';
import assert from 'node:assert/strict';
import { allow } from '../app/lib/server/rate-limit';

test('rate limiter allows a burst, rejects the excess, and resets after the window', () => {
  const key = crypto.randomUUID();
  for (let i = 0; i < 30; i++) assert.equal(allow(key, 0), true);
  assert.equal(allow(key, 0), false);
  assert.equal(allow(key, 60_000), true);
});
