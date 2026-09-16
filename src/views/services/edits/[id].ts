import type { RequestContext } from '../../../http/context';
import { visibleServiceEdit, serviceHref } from '../../../lib/services';
import { editStatuses } from '../../../lib/service-schema';
export async function load(ctx: RequestContext & { response: { status: number } }) {
  if (!ctx.locals.user) return ctx.redirect('/login?returnTo=' + encodeURIComponent(ctx.url.pathname));
  const e = await visibleServiceEdit(ctx.params.id || '', ctx.locals.user);
  if (!e) ctx.response.status = 404;
  return { e };
}
