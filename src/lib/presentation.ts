import { load as view0 } from '../views/rebuild-prompt';
import { load as view1 } from '../views/community/new';
import { load as view2 } from '../views/notifications';
import { load as view3 } from '../views/services/new';
import { load as view4 } from '../views/verify-email';
import { load as view5 } from '../views/unsubscribe';
import { load as view6 } from '../views/onboarding';
import { load as view7 } from '../views/community/index';
import { load as view8 } from '../views/services/index';
import { load as view9 } from '../views/privacy';
import { load as view10 } from '../views/suggest';
import { load as view11 } from '../views/forgot';
import { load as view12 } from '../views/signup';
import { load as view13 } from '../views/login';
import { load as view14 } from '../views/reset';
import { load as view15 } from '../views/stats';
import { load as view16 } from '../views/terms';
import { load as view17 } from '../views/404';
import { load as view18 } from '../views/me';
import { load as view19 } from '../views/index';
import { load as view20 } from '../views/community/[id]/edit';
import { load as view21 } from '../views/services/edits/[id]';
import { load as view22 } from '../views/services/[id]/edit';
import { load as view23 } from '../views/category/[cat]';
import { load as view24 } from '../views/community/[id]';
import { load as view25 } from '../views/services/[id]';
import { load as view26 } from '../views/profile/[id]';
import { load as view27 } from '../views/[slug]';
import { one, event } from './db';
import { mailAvailable } from './mail';
import { sanitize } from './api-gateway';
const routes = [
  { pattern: '/rebuild-prompt', re: new RegExp('^/rebuild-prompt/?$'), names: [], load: view0 },
  { pattern: '/community/new', re: new RegExp('^/community/new/?$'), names: [], load: view1 },
  { pattern: '/notifications', re: new RegExp('^/notifications/?$'), names: [], load: view2 },
  { pattern: '/services/new', re: new RegExp('^/services/new/?$'), names: [], load: view3 },
  { pattern: '/verify-email', re: new RegExp('^/verify-email/?$'), names: [], load: view4 },
  { pattern: '/unsubscribe', re: new RegExp('^/unsubscribe/?$'), names: [], load: view5 },
  { pattern: '/onboarding', re: new RegExp('^/onboarding/?$'), names: [], load: view6 },
  { pattern: '/community', re: new RegExp('^/community/?$'), names: [], load: view7 },
  { pattern: '/services', re: new RegExp('^/services/?$'), names: [], load: view8 },
  { pattern: '/privacy', re: new RegExp('^/privacy/?$'), names: [], load: view9 },
  { pattern: '/suggest', re: new RegExp('^/suggest/?$'), names: [], load: view10 },
  { pattern: '/forgot', re: new RegExp('^/forgot/?$'), names: [], load: view11 },
  { pattern: '/signup', re: new RegExp('^/signup/?$'), names: [], load: view12 },
  { pattern: '/login', re: new RegExp('^/login/?$'), names: [], load: view13 },
  { pattern: '/reset', re: new RegExp('^/reset/?$'), names: [], load: view14 },
  { pattern: '/stats', re: new RegExp('^/stats/?$'), names: [], load: view15 },
  { pattern: '/terms', re: new RegExp('^/terms/?$'), names: [], load: view16 },
  { pattern: '/404', re: new RegExp('^/404/?$'), names: [], load: view17 },
  { pattern: '/me', re: new RegExp('^/me/?$'), names: [], load: view18 },
  { pattern: '/', re: new RegExp('^//?$'), names: [], load: view19 },
  {
    pattern: '/community/[id]/edit',
    re: new RegExp('^/community/([^/]+)/edit/?$'),
    names: ['id'],
    load: view20,
  },
  {
    pattern: '/services/edits/[id]',
    re: new RegExp('^/services/edits/([^/]+)/?$'),
    names: ['id'],
    load: view21,
  },
  {
    pattern: '/services/[id]/edit',
    re: new RegExp('^/services/([^/]+)/edit/?$'),
    names: ['id'],
    load: view22,
  },
  { pattern: '/category/[cat]', re: new RegExp('^/category/([^/]+)/?$'), names: ['cat'], load: view23 },
  { pattern: '/community/[id]', re: new RegExp('^/community/([^/]+)/?$'), names: ['id'], load: view24 },
  { pattern: '/services/[id]', re: new RegExp('^/services/([^/]+)/?$'), names: ['id'], load: view25 },
  { pattern: '/profile/[id]', re: new RegExp('^/profile/([^/]+)/?$'), names: ['id'], load: view26 },
  { pattern: '/[slug]', re: new RegExp('^/([^/]+)/?$'), names: ['slug'], load: view27 },
];
export async function pagePresentation(ctx: any) {
  const origin = new URL(process.env.SITE_URL!);
  const requested = ctx.url.searchParams.get('path') || '/';
  if (!requested.startsWith('/') || requested.startsWith('//') || /[\\\r\n]/.test(requested))
    return new Response(null, { status: 400 });
  const url = new URL(requested, origin);
  if (url.origin !== origin.origin) return new Response(null, { status: 400 });

  let route = routes.find((r) => r.re.test(url.pathname));
  if (!route) route = routes.find((r) => r.pattern === '/404');
  if (!route) return new Response(null, { status: 404 });
  const match = url.pathname.match(route.re) || [];
  const params = Object.fromEntries(
    route.names.map((name, i) => [name, decodeURIComponent(match[i + 1] || '')]),
  );
  const response = { status: 200 };
  const data = await route.load({ ...ctx, url, params, response });
  if (data instanceof Response) return data;
  const user = ctx.locals.user;
  const unread = user
    ? (await one(
        "SELECT COUNT(*) AS n FROM notifications n JOIN posts p ON p.id=n.post_id LEFT JOIN comments c ON c.id=n.comment_id WHERE n.user_id=? AND n.is_read=0 AND p.status='active' AND (c.id IS NULL OR c.status='active')",
        user.id,
      ))!.n
    : 0;
  if (
    response.status < 300 &&
    !/^\/(?:api|admin|me|login|signup|reset|forgot|verify-email|onboarding|unsubscribe|notifications|services\/new|services\/edits|services\/[^/]+\/edit)/.test(
      url.pathname,
    )
  )
    await event('pageview', route.pattern);
  return Response.json(
    sanitize({
      data,
      status: response.status,
      unread,
      features: { mail: mailAvailable() },
      locals: {
        user: ctx.locals.user || null,
        admin: ctx.locals.admin || null,
        csrf: ctx.locals.csrf,
        anon: '',
        adminSurface: false,
      },
    }),
  );
}
