import type { RequestContext } from '../../http/context';
import { posts } from '../../lib/db';
import { boards } from '../../lib/config';
export async function load(ctx: RequestContext & { response: { status: number } }) {
  const r = await posts(ctx.url.searchParams);
  const link = (k: string, v: string) => {
    const p = new URLSearchParams(ctx.url.searchParams);
    p.delete('page');
    v ? p.set(k, v) : p.delete(k);
    return '/community?' + p;
  };
  return { r };
}
