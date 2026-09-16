import type { RequestContext } from '../../http/context';
import { one, all, postSelect } from '../../lib/db';
export async function load(ctx: RequestContext & { response: { status: number } }) {
  const u = await one(
    "SELECT id,nickname,bio,created_at FROM users WHERE id=? AND status='active'",
    ctx.params.id || '',
  );
  if (!u) ctx.response.status = 404;
  const items = u
    ? await all(postSelect + " WHERE p.user_id=? AND p.status='active' ORDER BY p.created_at DESC", u.id)
    : [];
  return { u, items };
}
