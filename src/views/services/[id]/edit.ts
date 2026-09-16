import type { APIContext } from 'astro';
import { visibleService } from '../../../lib/services';
export async function load(Astro: APIContext & { response: { status: number } }) {
  if (!Astro.locals.user) return Astro.redirect('/login?returnTo=' + encodeURIComponent(Astro.url.pathname));
  const s = await visibleService(Astro.params.id || '', Astro.locals.user);
  const allowed = s && (s.status === 'published' || s.user_id === Astro.locals.user.id);
  if (!allowed) Astro.response.status = s ? 403 : 404;
  return { s, allowed };
}
