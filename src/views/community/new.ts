import type { APIContext } from 'astro';

export async function load(Astro: APIContext & { response: { status: number } }) {
  if (!Astro.locals.user)
    return Astro.redirect('/login?returnTo=' + encodeURIComponent(Astro.url.pathname + Astro.url.search));
  return {};
}
