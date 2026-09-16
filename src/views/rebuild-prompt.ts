import type { RequestContext } from '../http/context';
import { readFileSync } from 'node:fs';
export async function load(ctx: RequestContext & { response: { status: number } }) {
  const prompt = readFileSync('public/prompts/korean-rebuild.txt', 'utf8');
  const original = prompt.slice(prompt.indexOf('Build me a directory site called'));
  return { prompt, original };
}
