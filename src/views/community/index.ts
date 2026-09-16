import type { APIContext } from 'astro';
import { posts } from '../../lib/db';
import { boards } from '../../lib/config';
export async function load(Astro: APIContext & { response: { status: number } }) {
  const r = await posts(Astro.url.searchParams);
  const link = (k: string, v: string) => {
    const p = new URLSearchParams(Astro.url.searchParams);
    p.delete('page');
    v ? p.set(k, v) : p.delete(k);
    return '/community?' + p;
  };
  return { r };
}
