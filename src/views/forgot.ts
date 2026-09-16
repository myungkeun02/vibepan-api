import type { APIContext } from 'astro';
import { mailAvailable } from '../lib/mail';
export async function load(Astro: APIContext & { response: { status: number } }) {
  return {};
}
