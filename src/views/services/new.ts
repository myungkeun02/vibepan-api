import type { APIContext } from 'astro';

export async function load(Astro: APIContext & { response: { status: number } }) {
  if (!Astro.locals.user) return Astro.redirect('/login?returnTo=' + encodeURIComponent('/services/new'));
  return {};
}
