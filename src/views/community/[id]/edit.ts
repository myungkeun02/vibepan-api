import type { RequestContext } from '../../../http/context';
import { getPost } from '../../../lib/db';
export async function load(ctx: RequestContext & { response: { status: number } }) {
  if (!ctx.locals.user) return ctx.redirect('/login?returnTo=' + encodeURIComponent(ctx.url.pathname));
  const p = await getPost(ctx.params.id || '');
  const allowed = p && p.user_id === ctx.locals.user.id;
  if (!allowed) ctx.response.status = p ? 403 : 404;
  return { p, allowed };
}
