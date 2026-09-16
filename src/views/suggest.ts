import type { RequestContext } from '../http/context';
import { apps } from '../lib/apps';
export async function load(ctx: RequestContext & { response: { status: number } }) {
  const user = ctx.locals.user;
  if (!user) return ctx.redirect('/login?returnTo=' + encodeURIComponent(ctx.url.pathname + ctx.url.search));
  return {};
}
