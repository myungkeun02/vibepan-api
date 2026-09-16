import type { APIContext } from 'astro';
import { readFileSync } from 'node:fs';
export async function load(Astro: APIContext & { response: { status: number } }) {
  const prompt = readFileSync('public/prompts/korean-rebuild.txt', 'utf8');
  const original = prompt.slice(prompt.indexOf('Build me a directory site called'));
  return { prompt, original };
}
