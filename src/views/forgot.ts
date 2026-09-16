import type { RequestContext } from '../http/context';
import { mailAvailable } from '../lib/mail';
export async function load(ctx: RequestContext & { response: { status: number } }) {
  return {};
}
