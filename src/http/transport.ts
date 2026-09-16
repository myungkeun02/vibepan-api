import type { Request as ExpressRequest, Response as ExpressResponse } from 'express';
import type { CookieOptions, RequestContext } from './context';
import { HttpException } from '@nestjs/common';
import { responseHeaders } from '../lib/api-gateway';
export type HttpRequest = ExpressRequest & { context: RequestContext; outgoingCookies: Map<string, string> };
function encodeCookie(name: string, value: string, options: CookieOptions = {}) {
  if (!/^[\w-]+$/.test(name)) throw new Error('Invalid cookie name');
  const parts = [name + '=' + encodeURIComponent(value), 'Path=' + (options.path || '/')];
  if (options.maxAge !== undefined) parts.push('Max-Age=' + Math.floor(options.maxAge));
  if (options.expires) parts.push('Expires=' + options.expires.toUTCString());
  if (options.httpOnly) parts.push('HttpOnly');
  if (options.secure) parts.push('Secure');
  if (options.sameSite) parts.push('SameSite=' + options.sameSite);
  return parts.join('; ');
}
async function body(req: ExpressRequest) {
  if (['GET', 'HEAD'].includes(req.method)) return undefined;
  const limit = 6 * 1024 * 1024;
  if (Number(req.headers['content-length']) > limit) {
    req.resume();
    throw new HttpException('입력 내용이 너무 커요.', 413);
  }
  let size = 0;
  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    size += chunk.length;
    if (size <= limit) chunks.push(Buffer.from(chunk));
  }
  if (size > limit) throw new HttpException('입력 내용이 너무 커요.', 413);
  return new Uint8Array(Buffer.concat(chunks));
}
export async function createContext(req: HttpRequest, origin: string, admin: boolean) {
  const path = req.originalUrl;
  if (!path.startsWith('/') || path.startsWith('//') || /[\\\r\n]/.test(path))
    throw new HttpException('잘못된 요청입니다.', 400);
  const url = new URL(path, origin);
  const headers = new Headers();
  for (const [key, value] of Object.entries(req.headers)) {
    if (Array.isArray(value)) value.forEach((v) => headers.append(key, v));
    else if (value !== undefined) headers.set(key, value);
  }
  const request = new Request(url, { method: req.method, headers, body: await body(req) });
  const jar = new Map<string, string>();
  for (const part of (req.headers.cookie || '').split(';')) {
    const at = part.indexOf('=');
    if (at < 1) continue;
    try {
      jar.set(part.slice(0, at).trim(), decodeURIComponent(part.slice(at + 1)));
    } catch {}
  }
  req.outgoingCookies = new Map();
  req.context = {
    request,
    url,
    params: Object.fromEntries(
      Object.entries(req.params).map(([k, v]) => [k, Array.isArray(v) ? v.join('/') : v]),
    ),
    clientAddress: req.socket.remoteAddress || 'unknown',
    locals: { user: null, admin: null, adminSurface: admin, anon: '', csrf: '' },
    cookies: {
      get: (name) => (jar.has(name) ? { value: jar.get(name)! } : undefined),
      set(name, value, options) {
        jar.set(name, value);
        req.outgoingCookies.set(name, encodeCookie(name, value, options));
      },
      delete(name, options) {
        jar.delete(name);
        req.outgoingCookies.set(
          name,
          encodeCookie(name, '', { ...options, maxAge: 0, expires: new Date(0) }),
        );
      },
    },
    redirect: (location, status = 302) => new Response(null, { status, headers: { location } }),
  };
  return req.context;
}
export async function sendResponse(req: HttpRequest, res: ExpressResponse, input: Response) {
  const response = responseHeaders(input);
  res.status(response.status);
  response.headers.forEach((value, key) => {
    if (key !== 'set-cookie') res.setHeader(key, value);
  });
  const cookies = [...response.headers.getSetCookie(), ...(req.outgoingCookies?.values() || [])];
  if (cookies.length) res.setHeader('set-cookie', cookies);
  if (req.method === 'HEAD' || response.body === null) {
    res.end();
    return;
  }
  res.end(Buffer.from(await response.arrayBuffer()));
}
