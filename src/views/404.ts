import type { APIContext } from 'astro';

export async function load(Astro: APIContext & { response: { status: number } }) {
  Astro.response.status = 404;
  return {};
}
