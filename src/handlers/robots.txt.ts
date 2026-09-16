import type { RequestHandler } from '../http/context';
import { absolute } from '../lib/config';
export const GET: RequestHandler = () =>
  new Response(
    'User-agent: *\nAllow: /\nDisallow: /api/\nDisallow: /admin\nDisallow: /me\nDisallow: /notifications\nDisallow: /auth/\nDisallow: /login\nDisallow: /signup\nDisallow: /onboarding\nDisallow: /verify-email\nDisallow: /reset\nDisallow: /forgot\nDisallow: /unsubscribe\nDisallow: /community/new\nDisallow: /services/new\nDisallow: /services/edits/\nDisallow: /services/*/edit\nDisallow: /suggest\nSitemap: ' +
      absolute('/sitemap.xml') +
      '\n',
    { headers: { 'Content-Type': 'text/plain;charset=utf-8' } },
  );
