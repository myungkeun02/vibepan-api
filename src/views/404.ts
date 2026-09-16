import type { RequestContext } from '../http/context';

export async function load(ctx: RequestContext & { response: { status: number } }) {
  ctx.response.status = 404;
  return {};
}
