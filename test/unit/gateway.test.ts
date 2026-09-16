import { test, expect, afterEach, vi } from 'vitest';
import { trustedApi, sanitize } from '../../src/lib/api-gateway';
afterEach(() => vi.unstubAllEnvs());
test('requires the dedicated frontend key, not a host header or public session', () => {
  const key = 'api-test-only-'.repeat(4);
  vi.stubEnv('API_PROXY_SECRET', key);
  expect(
    trustedApi(new Headers({ 'x-forwarded-host': 'admin.vibepan.com', cookie: 'session=pretend' })),
  ).toBe(false);
  expect(trustedApi(new Headers({ 'x-vibepan-api-key': 'wrong' }))).toBe(false);
  expect(trustedApi(new Headers({ 'x-vibepan-api-key': 'é'.repeat(52) }))).toBe(false);
  expect(trustedApi(new Headers({ 'x-vibepan-api-key': key }))).toBe(true);
});
test('view payloads omit stored credentials and Google identity identifiers recursively', () => {
  expect(
    sanitize({
      user: { id: 'u', password: 'hash', email: 'u@example.test' },
      nested: [{ token: 'private', google_subject: 'subject', csrf: 'intentional-csrf' }],
    }),
  ).toEqual({ user: { id: 'u', email: 'u@example.test' }, nested: [{ csrf: 'intentional-csrf' }] });
});
