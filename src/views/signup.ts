import type { RequestContext } from '../http/context';
import { safeReturn } from '../lib/security';
export async function load(ctx: RequestContext & { response: { status: number } }) {
  const returnTo = safeReturn(ctx.url.searchParams.get('returnTo'));
  if (ctx.locals.user) return ctx.redirect(returnTo);
  return { returnTo };
}
