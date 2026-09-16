import type { APIContext } from 'astro';
import { categories } from '../lib/apps';
import { catalog } from '../lib/catalog';
import { absolute, boards } from '../lib/config';
import { posts } from '../lib/db';
export async function load(Astro: APIContext & { response: { status: number } }) {
  const recent = (await posts(new URLSearchParams({ board: 'builds' }))).items.slice(0, 3);
  const r = await catalog(Astro.url.searchParams);
  const jsonld = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: '바이브코딩가능?',
      url: absolute('/'),
      potentialAction: {
        '@type': 'SearchAction',
        target: absolute('/?q={search_term_string}'),
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      itemListElement: r.items.map((a, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: a.name,
        url: absolute(a.href),
      })),
    },
  ];
  return { recent, r, jsonld };
}
