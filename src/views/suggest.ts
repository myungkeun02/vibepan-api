import type { APIContext } from 'astro';
import { apps } from '../lib/apps';
export async function load(Astro: APIContext & { response: { status: number } }) {
  const user = Astro.locals.user;
  if (!user)
    return Astro.redirect('/login?returnTo=' + encodeURIComponent(Astro.url.pathname + Astro.url.search));
  return {};
}
