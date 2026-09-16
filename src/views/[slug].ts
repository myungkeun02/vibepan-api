import type { APIContext } from 'astro';
import { related, categoryName, priceLabel } from '../lib/apps';
import { verdicts, absolute, boards } from '../lib/config';
import { one, voteCounts, posts } from '../lib/db';
import { serviceBySlug } from '../lib/services';
import { catalogApp } from '../lib/catalog';
export async function load(Astro: APIContext & { response: { status: number } }) {
  const service = await serviceBySlug(Astro.params.slug || '', Astro.locals.user);
  const a = service ? catalogApp(service) : null;
  if (!a) {
    Astro.response.status = 404;
  }
  const v = a ? verdicts[a.verdict] : null;
  const user = Astro.locals.user;
  const voted = a
    ? Boolean(
        await one(
          'SELECT id FROM votes WHERE slug=? AND ' + (user ? 'user_id=?' : 'anonymous=?'),
          a.slug,
          user?.id || Astro.locals.anon,
        ),
      )
    : false;
  const bookmarked =
    a && user
      ? Boolean(await one('SELECT 1 FROM bookmarks WHERE user_id=? AND slug=?', user.id, a.slug))
      : false;
  const count = a ? (await voteCounts())[a.slug] || 0 : 0;
  const builds = a
    ? (await posts(new URLSearchParams({ tool: a.slug, board: 'builds' }))).items.slice(0, 4)
    : [];
  const jsonld = a
    ? [
        {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: a.faq.map((f) => ({
            '@type': 'Question',
            name: f.q,
            acceptedAnswer: { '@type': 'Answer', text: f.a },
          })),
        },
        {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { name: '도구 탐색', url: '/' },
            { name: categoryName(a.category), url: '/category/' + a.category },
            { name: a.name, url: '/' + a.slug },
          ].map((x, i) => ({ '@type': 'ListItem', position: i + 1, name: x.name, item: absolute(x.url) })),
        },
      ]
    : [];
  return { service, a, v, voted, bookmarked, count, builds, jsonld };
}
