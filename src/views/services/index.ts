import type { APIContext } from 'astro';

export async function load(Astro: APIContext & { response: { status: number } }) {
  return Astro.redirect('/' + Astro.url.search + '#directory', 302);
  return {};
}
