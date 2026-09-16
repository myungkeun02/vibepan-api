import type { RequestContext } from '../../http/context';
import { posts } from '../../lib/db';
import { visibleService } from '../../lib/services';
import { servicePricing, serviceStatuses } from '../../lib/service-schema';
import { categoryName } from '../../lib/apps';
export async function load(ctx: RequestContext & { response: { status: number } }) {
  const s = await visibleService(ctx.params.id || '', ctx.locals.user);
  if (!s) ctx.response.status = 404;
  if (s?.catalog_slug) return ctx.redirect('/' + s.catalog_slug, 302);
  const builds = s ? (await posts(new URLSearchParams({ service: s.id, board: 'builds' }))).items : [];
  const owner = s && ctx.locals.user?.id === s.user_id;
  return { s, builds, owner };
}
