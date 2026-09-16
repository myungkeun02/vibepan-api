import type { APIContext } from 'astro';
import { verified } from '../lib/security';
export async function load(Astro: APIContext & { response: { status: number } }) {
  const signed = verified(Astro.cookies.get('oauth_pending')?.value);
  if (!signed) return Astro.redirect('/login');
  let pending;
  try {
    pending = JSON.parse(Buffer.from(signed, 'base64url').toString());
  } catch {
    return Astro.redirect('/login');
  }
  if (pending.expires < Date.now()) return Astro.redirect('/login');
  return {};
}
