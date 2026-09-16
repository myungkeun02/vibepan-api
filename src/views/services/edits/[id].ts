import type { APIContext } from 'astro';
import { visibleServiceEdit, serviceHref } from '../../../lib/services';
import { editStatuses } from '../../../lib/service-schema';
export async function load(Astro: APIContext & { response: { status: number } }) {
  if (!Astro.locals.user) return Astro.redirect('/login?returnTo=' + encodeURIComponent(Astro.url.pathname));
  const e = await visibleServiceEdit(Astro.params.id || '', Astro.locals.user);
  if (!e) Astro.response.status = 404;
  return { e };
}
