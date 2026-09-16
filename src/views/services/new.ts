import type { RequestContext } from '../../http/context';

export async function load(ctx: RequestContext & { response: { status: number } }) {
  if (!ctx.locals.user) return ctx.redirect('/login?returnTo=' + encodeURIComponent('/services/new'));
  return {};
}
