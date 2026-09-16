import type { RequestContext } from '../http/context';
import { all, postSelect } from '../lib/db';
import { editStatuses } from '../lib/service-schema';
import { getApp } from '../lib/apps';
export async function load(ctx: RequestContext & { response: { status: number } }) {
  const user = ctx.locals.user;
  if (!user) return ctx.redirect('/login?returnTo=/me');
  const mine = await all(
    postSelect + " WHERE p.user_id=? AND p.status='active' ORDER BY p.created_at DESC",
    user.id,
  );
  const comments = await all(
    "SELECT c.*,p.title FROM comments c JOIN posts p ON p.id=c.post_id WHERE c.user_id=? AND c.status='active' AND p.status='active' ORDER BY c.created_at DESC",
    user.id,
  );
  const saved = (await all('SELECT slug FROM bookmarks WHERE user_id=?', user.id))
    .map((x) => getApp(x.slug))
    .filter(Boolean);
  const voted = await all('SELECT slug,created_at FROM votes WHERE user_id=?', user.id);
  const savedPosts = await all(
    postSelect +
      " JOIN reactions r ON r.post_id=p.id WHERE r.user_id=? AND r.kind='bookmark' AND p.status='active'",
    user.id,
  );
  const suggestions = await all(
    'SELECT * FROM suggestions WHERE user_id=? ORDER BY created_at DESC',
    user.id,
  );
  const services = await all(
    'SELECT s.*,u.nickname FROM services s JOIN users u ON u.id=s.user_id WHERE s.user_id=? ORDER BY s.updated_at DESC',
    user.id,
  );
  const serviceEdits = await all(
    'SELECT e.*,s.name FROM service_edits e JOIN services s ON s.id=e.service_id WHERE e.user_id=? ORDER BY e.created_at DESC',
    user.id,
  );
  const labels: Record<string, string> = {
    pending: '검토 대기',
    accepted_pending_release: '채택 · 반영 대기',
    rejected: '반려',
    published: '게시 완료',
  };
  return { user, mine, comments, saved, voted, savedPosts, suggestions, services, serviceEdits, labels };
}
