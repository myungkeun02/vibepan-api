import { defineMiddleware } from 'astro:middleware';
import { trustedApi, responseHeaders } from './lib/api-gateway';
import { migrateDatabase, run, syncTools } from './lib/db';
import { identity } from './lib/security';
import { apps } from './lib/apps';
let ready: Promise<void> | undefined;
export const onRequest = defineMiddleware(async (ctx, next) => {
  if (!trustedApi(ctx.request.headers) && ctx.url.pathname !== '/api/health')
    return responseHeaders(new Response(null, { status: 404 }));
  try {
    await (ready ??= (async () => {
      await migrateDatabase();
      await syncTools(apps);
    })().catch((error) => {
      ready = undefined;
      throw error;
    }));
    if (ctx.url.pathname === '/api/health') return Response.json({ ok: true });
    ctx.locals.adminSurface = false;
    ctx.locals.admin = null;
    ctx.locals.user = null;
    ctx.locals.anon = '';
    if (/^\/(?:api\/admin|admin)(?:\/|$)/.test(ctx.url.pathname)) return new Response(null, { status: 404 });
    await identity(ctx);
    const response = await next();
    if (Date.now() % 97 === 0) {
      await run('DELETE FROM sessions WHERE expires<?', Date.now());
      await run('DELETE FROM auth_tokens WHERE expires<?', Date.now());
    }
    return responseHeaders(response);
  } catch (error) {
    console.error('api_request_failed', error instanceof Error ? error.name : 'Error');
    return responseHeaders(
      Response.json({ ok: false, error: '처리 중 문제가 생겼습니다.' }, { status: 500 }),
    );
  }
});
