import type { RequestContext } from '../http/context';
import { safeReturn } from '../lib/security';
export async function load(ctx: RequestContext & { response: { status: number } }) {
  const returnTo = safeReturn(ctx.url.searchParams.get('returnTo'));
  if (ctx.locals.user) return ctx.redirect(returnTo);
  const providers = [
    ['github', 'GitHub'],
    ['google', 'Google'],
  ].filter(
    ([id]) =>
      process.env[id.toUpperCase() + '_CLIENT_ID'] && process.env[id.toUpperCase() + '_CLIENT_SECRET'],
  );
  return { returnTo, providers };
}
