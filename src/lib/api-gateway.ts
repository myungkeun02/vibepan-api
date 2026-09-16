import { timingSafeEqual } from 'node:crypto';
export function trustedApi(headers: Headers) {
  const expected = process.env.API_PROXY_SECRET || '';
  const actual = headers.get('x-vibepan-api-key') || '';
  return (
    expected.length >= 32 &&
    Buffer.byteLength(expected) === Buffer.byteLength(actual) &&
    timingSafeEqual(Buffer.from(expected), Buffer.from(actual))
  );
}
export function sanitize(value: any): any {
  if (value instanceof URLSearchParams) return { __vibepan_search__: value.toString() };
  if (Array.isArray(value)) return value.map(sanitize);
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value)
        .filter(
          ([k]) =>
            !['password', 'password_hash', 'google_subject', 'browser_hash', 'verifier', 'token'].includes(k),
        )
        .map(([k, v]) => [k, sanitize(v)]),
    );
  }
  return value;
}
export function responseHeaders(response: Response) {
  response.headers.set('cache-control', 'private, no-store');
  response.headers.set('x-content-type-options', 'nosniff');
  response.headers.set('x-frame-options', 'DENY');
  return response;
}
