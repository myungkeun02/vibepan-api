import type { RequestContext } from '../../http/context';

export async function load(ctx: RequestContext & { response: { status: number } }) {
  return ctx.redirect('/' + ctx.url.search + '#directory', 302);
  return {};
}
