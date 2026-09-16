import type { APIContext } from 'astro';
import { posts } from '../../lib/db';
import { visibleService } from '../../lib/services';
import { servicePricing, serviceStatuses } from '../../lib/service-schema';
import { categoryName } from '../../lib/apps';
export async function load(Astro: APIContext & { response: { status: number } }) {
  const s = await visibleService(Astro.params.id || '', Astro.locals.user);
  if (!s) Astro.response.status = 404;
  if (s?.catalog_slug) return Astro.redirect('/' + s.catalog_slug, 302);
  const builds = s ? (await posts(new URLSearchParams({ service: s.id, board: 'builds' }))).items : [];
  const owner = s && Astro.locals.user?.id === s.user_id;
  return { s, builds, owner };
}
