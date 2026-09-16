import type { APIContext } from 'astro';
import { safeReturn } from '../lib/security';
export async function load(Astro: APIContext & { response: { status: number } }) {
  const returnTo = safeReturn(Astro.url.searchParams.get('returnTo'));
  if (Astro.locals.user) return Astro.redirect(returnTo);
  return { returnTo };
}
