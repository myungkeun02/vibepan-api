import type { APIContext } from 'astro';
import { categories } from '../../lib/apps';
import { catalog } from '../../lib/catalog';
import { absolute } from '../../lib/config';
export async function load(Astro: APIContext & { response: { status: number } }) {
  const cat = categories.find((c) => c.slug === Astro.params.cat);
  if (!cat) Astro.response.status = 404;
  const params = new URLSearchParams(Astro.url.searchParams);
  if (cat) params.set('category', cat.slug);
  const list = cat ? (await catalog(params)).items : [];
  const jsonld = cat
    ? [
        {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: '도구 탐색', item: absolute('/') },
            { '@type': 'ListItem', position: 2, name: cat.name, item: absolute('/category/' + cat.slug) },
          ],
        },
        {
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          itemListElement: list.map((a, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: a.name,
            url: absolute(a.href),
          })),
        },
      ]
    : [];
  return { cat, params, list, jsonld };
}
