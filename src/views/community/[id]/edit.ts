import type { APIContext } from 'astro';
import { getPost } from '../../../lib/db';
export async function load(Astro: APIContext & { response: { status: number } }) {
  if (!Astro.locals.user) return Astro.redirect('/login?returnTo=' + encodeURIComponent(Astro.url.pathname));
  const p = await getPost(Astro.params.id || '');
  const allowed = p && p.user_id === Astro.locals.user.id;
  if (!allowed) Astro.response.status = p ? 403 : 404;
  return { p, allowed };
}
