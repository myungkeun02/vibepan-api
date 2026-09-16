import { test, expect } from 'vitest';
import { Readable } from 'node:stream';
import { createContext, sendResponse, type HttpRequest } from '../../src/http/transport';
function request(path = '/api/totals', method = 'GET', headers = {}, body: Buffer[] = []) {
  return Object.assign(Readable.from(body), {
    originalUrl: path,
    method,
    headers,
    params: { action: ['services', 'create'] },
    socket: { remoteAddress: '127.0.0.1' },
  }) as unknown as HttpRequest;
}
test('uses configured external origin and ignores client forwarded host', async () => {
  const req = request('/api/totals?filter=one', 'GET', {
    'x-forwarded-host': 'evil.example',
    cookie: 'name=%ED%95%9C%EA%B8%80',
  });
  const ctx = await createContext(req, 'https://vibepan.com', false);
  expect(ctx.url.href).toBe('https://vibepan.com/api/totals?filter=one');
  expect(ctx.cookies.get('name')?.value).toBe('한글');
  expect(ctx.params.action).toBe('services/create');
  await expect(createContext(request('//evil.example/'), 'https://vibepan.com', false)).rejects.toMatchObject(
    { status: 400 },
  );
});
test('preserves secure cookies, expiration, content and response status', async () => {
  const req = request();
  const ctx = await createContext(req, 'https://vibepan.com', false);
  ctx.cookies.set('__Host-session', 'one', { secure: true, httpOnly: true, sameSite: 'lax', maxAge: 60 });
  ctx.cookies.delete('old', { httpOnly: true, path: '/' });
  const output: any = {
    headers: {},
    status(n: number) {
      this.code = n;
      return this;
    },
    setHeader(k: string, v: any) {
      this.headers[k] = v;
    },
    end(data: Buffer) {
      this.body = data;
    },
  };
  await sendResponse(req, output, Response.json({ ok: true }, { status: 201 }));
  expect(output.code).toBe(201);
  expect(output.headers['set-cookie']).toEqual([
    '__Host-session=one; Path=/; Max-Age=60; HttpOnly; Secure; SameSite=lax',
    'old=; Path=/; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly',
  ]);
  expect(output.headers['cache-control']).toBe('private, no-store');
  expect(JSON.parse(output.body.toString())).toEqual({ ok: true });
});
test('enforces the body limit even without content-length', async () => {
  const req = request('/api/upload', 'POST', {}, [Buffer.alloc(6 * 1024 * 1024), Buffer.alloc(1)]);
  await expect(createContext(req, 'http://localhost:4310', false)).rejects.toMatchObject({ status: 413 });
});
