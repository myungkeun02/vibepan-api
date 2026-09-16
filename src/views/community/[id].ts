import type { RequestContext } from '../../http/context';
import { getPost, getComments, one } from '../../lib/db';
import { markdown, plainText } from '../../lib/markdown';
import { boards } from '../../lib/config';
import { getApp } from '../../lib/apps';
import { visibleService, serviceHref } from '../../lib/services';
export async function load(ctx: RequestContext & { response: { status: number } }) {
  const p = await getPost(ctx.params.id || '');
  if (!p) ctx.response.status = 404;
  const linkedService = p?.service_id ? await visibleService(p.service_id) : null;
  const user = ctx.locals.user;
  const comments = p ? await getComments(p.id) : [];
  const build = p ? JSON.parse(p.build) : {};
  const reactions =
    p && user
      ? {
          like: Boolean(
            await one("SELECT 1 FROM reactions WHERE user_id=? AND post_id=? AND kind='like'", user.id, p.id),
          ),
          bookmark: Boolean(
            await one(
              "SELECT 1 FROM reactions WHERE user_id=? AND post_id=? AND kind='bookmark'",
              user.id,
              p.id,
            ),
          ),
        }
      : { like: false, bookmark: false };
  return { p, linkedService, user, comments, build, reactions };
}
