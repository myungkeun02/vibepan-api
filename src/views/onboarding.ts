import type { RequestContext } from '../http/context';
import { verified } from '../lib/security';
export async function load(ctx: RequestContext & { response: { status: number } }) {
  const signed = verified(ctx.cookies.get('oauth_pending')?.value);
  if (!signed) return ctx.redirect('/login');
  let pending;
  try {
    pending = JSON.parse(Buffer.from(signed, 'base64url').toString());
  } catch {
    return ctx.redirect('/login');
  }
  if (pending.expires < Date.now()) return ctx.redirect('/login');
  return {};
}
