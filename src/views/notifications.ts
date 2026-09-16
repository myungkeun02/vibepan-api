import type { APIContext } from 'astro';
import { all } from '../lib/db';
export async function load(Astro: APIContext & { response: { status: number } }) {
  const user = Astro.locals.user;
  if (!user) return Astro.redirect('/login?returnTo=/notifications');
  const items = await all(
    "SELECT n.*,p.title FROM notifications n JOIN posts p ON p.id=n.post_id LEFT JOIN comments c ON c.id=n.comment_id WHERE n.user_id=? AND p.status='active' AND (c.id IS NULL OR c.status='active') ORDER BY n.created_at DESC",
    user.id,
  );
  return { items };
}
