import type { RequestContext } from '../http/context';
import { totals, posts } from '../lib/db';
import { categories } from '../lib/apps';
import { catalog } from '../lib/catalog';
import { publicServices } from '../lib/services';
export async function load(ctx: RequestContext & { response: { status: number } }) {
  const t = await totals();
  const recentBuilds = (await posts(new URLSearchParams({ board: 'builds' }))).items.slice(0, 3);
  const services = await publicServices(new URLSearchParams(), 3);
  const entries = (await catalog()).all;
  const groups = categories
    .map((c) => ({ ...c, count: entries.filter((a) => a.category === c.slug).length }))
    .filter((c) => c.count);
  return { t, recentBuilds, services, groups };
}
