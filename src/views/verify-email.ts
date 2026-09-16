import type { APIContext } from 'astro';

export async function load(Astro: APIContext & { response: { status: number } }) {
  return {};
}
