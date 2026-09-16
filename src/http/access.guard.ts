import { Injectable, HttpException, type CanActivate, type ExecutionContext } from '@nestjs/common';
import { trustedApi } from '../lib/api-gateway';
import { createContext, type HttpRequest } from './transport';
import { identity } from '../lib/security';
import { siteUrl as origin } from '../lib/config';
@Injectable()
export class AccessGuard implements CanActivate {
  async canActivate(execution: ExecutionContext) {
    const req = execution.switchToHttp().getRequest<HttpRequest>();
    const health = req.path === '/api/health' && ['GET', 'HEAD'].includes(req.method);
    if (
      !health &&
      !trustedApi(new Headers({ 'x-vibepan-api-key': String(req.headers['x-vibepan-api-key'] || '') }))
    )
      throw new HttpException('페이지를 찾을 수 없습니다.', 404);
    const ctx = await createContext(req, origin, false);
    if (health) return true;
    if (/^\/(?:api\/admin|admin)(?:\/|$)/.test(req.path))
      throw new HttpException('페이지를 찾을 수 없습니다.', 404);
    await identity(ctx);
    return true;
  }
}
