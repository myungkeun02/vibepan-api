import type { RequestContext } from '../../../http/context';
import { visibleService } from '../../../lib/services';
export async function load(ctx: RequestContext & { response: { status: number } }) {
  if (!ctx.locals.user) return ctx.redirect('/login?returnTo=' + encodeURIComponent(ctx.url.pathname));
  const s = await visibleService(ctx.params.id || '', ctx.locals.user);
  const allowed = s && (s.status === 'published' || s.user_id === ctx.locals.user.id);
  if (!allowed) ctx.response.status = s ? 403 : 404;
  return { s, allowed };
}
