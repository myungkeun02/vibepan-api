import { catalog } from '../../../lib/catalog';
import { totals } from '../../../lib/db';
import { visibleService } from '../../../lib/services';
import { sanitize } from '../../../lib/api-gateway';
export async function GET(ctx: any) {
  const kind = ctx.params.kind;
  let value;
  if (kind === 'catalog')
    value = await catalog(
      new URLSearchParams(ctx.url.searchParams.get('query') || ''),
      Math.min(1000, Math.max(1, Number(ctx.url.searchParams.get('size')) || 20)),
    );
  else if (kind === 'totals') value = await totals();
  else if (kind === 'service')
    value = await visibleService(ctx.url.searchParams.get('id') || '', ctx.locals.user);
  else return new Response(null, { status: 404 });
  return Response.json(sanitize(value));
}
