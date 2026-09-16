import { Controller, Get, Post, Req, Res, Inject, Module } from '@nestjs/common';
import type { Response as ExpressResponse } from 'express';
import type { HttpRequest } from './http/transport';
import { HttpService } from './http/http.service';
import { GET as presentation } from './handlers/api/presentation';
import { GET as resources } from './handlers/api/resources/[kind]';
import { POST as action, GET as actionRead } from './handlers/api/[...action]';
import { GET as oauth } from './handlers/auth/[...path]';
import { GET as callback } from './handlers/api/auth/callback/[provider]';
import { POST as upload } from './handlers/api/upload';
import { GET as media } from './handlers/media/[id]';
import { GET as sitemap } from './handlers/sitemap.xml';
import { GET as robots } from './handlers/robots.txt';
@Controller()
export class HealthController {
  constructor(@Inject(HttpService) private readonly http: HttpService) {}
  @Get('api/health')
  health(@Req() req: HttpRequest, @Res() res: ExpressResponse) {
    return this.http.handle(req, res, () => Response.json({ ok: true }));
  }
}
@Controller()
export class PresentationController {
  @Get('api/session')
  session(@Req() req: HttpRequest, @Res() res: ExpressResponse) {
    return this.http.handle(req, res, () => Response.json({ ok: true }));
  }

  @Get('api/totals')
  totals(@Req() req: HttpRequest, @Res() res: ExpressResponse) {
    return this.http.handle(req, res, actionRead, { action: 'totals' });
  }

  constructor(@Inject(HttpService) private readonly http: HttpService) {}
  @Get('api/presentation')
  presentation(@Req() req: HttpRequest, @Res() res: ExpressResponse) {
    return this.http.handle(req, res, presentation);
  }
  @Get('api/resources/:kind')
  resource(@Req() req: HttpRequest, @Res() res: ExpressResponse) {
    return this.http.handle(req, res, resources);
  }
}
@Controller()
export class AuthenticationController {
  constructor(@Inject(HttpService) private readonly http: HttpService) {}
  @Post([
    'api/auth/register',
    'api/auth/oauth-register',
    'api/auth/login',
    'api/auth/logout',
    'api/auth/forgot',
    'api/auth/send-verification',
    'api/auth/verify-email',
    'api/auth/reset',
    'api/profile/update',
    'api/profile/delete',
  ])
  write(@Req() req: HttpRequest, @Res() res: ExpressResponse) {
    return this.http.handle(req, res, action, { action: req.path.slice('/api/'.length) });
  }
  @Get('auth/{*path}')
  oauth(@Req() req: HttpRequest, @Res() res: ExpressResponse) {
    return this.http.handle(req, res, oauth);
  }
  @Get('api/auth/callback/:provider')
  callback(@Req() req: HttpRequest, @Res() res: ExpressResponse) {
    return this.http.handle(req, res, callback);
  }
}
@Controller()
export class CommunityController {
  constructor(@Inject(HttpService) private readonly http: HttpService) {}
  @Post([
    'api/posts/create',
    'api/posts/update',
    'api/posts/delete',
    'api/comments/create',
    'api/comments/update',
    'api/comments/delete',
    'api/posts/react',
    'api/report',
  ])
  write(@Req() req: HttpRequest, @Res() res: ExpressResponse) {
    return this.http.handle(req, res, action, { action: req.path.slice('/api/'.length) });
  }
}
@Controller()
export class CatalogController {
  constructor(@Inject(HttpService) private readonly http: HttpService) {}
  @Post([
    'api/services/create',
    'api/services/update',
    'api/services/edits/cancel',
    'api/services/delete',
    'api/tool/bookmark',
    'api/vote',
  ])
  write(@Req() req: HttpRequest, @Res() res: ExpressResponse) {
    return this.http.handle(req, res, action, { action: req.path.slice('/api/'.length) });
  }
}
@Controller()
export class EngagementController {
  constructor(@Inject(HttpService) private readonly http: HttpService) {}
  @Post(['api/suggest', 'api/notifications/read', 'api/waitlist', 'api/waitlist/withdraw', 'api/analytics'])
  write(@Req() req: HttpRequest, @Res() res: ExpressResponse) {
    return this.http.handle(req, res, action, { action: req.path.slice('/api/'.length) });
  }
}
@Controller()
export class MediaController {
  constructor(@Inject(HttpService) private readonly http: HttpService) {}
  @Post('api/upload')
  upload(@Req() req: HttpRequest, @Res() res: ExpressResponse) {
    return this.http.handle(req, res, upload);
  }
  @Get('media/:id')
  media(@Req() req: HttpRequest, @Res() res: ExpressResponse) {
    return this.http.handle(req, res, media);
  }
}
@Controller()
export class DiscoveryController {
  constructor(@Inject(HttpService) private readonly http: HttpService) {}
  @Get('sitemap.xml')
  sitemap(@Req() req: HttpRequest, @Res() res: ExpressResponse) {
    return this.http.handle(req, res, sitemap);
  }
  @Get('robots.txt')
  robots(@Req() req: HttpRequest, @Res() res: ExpressResponse) {
    return this.http.handle(req, res, robots);
  }
}
@Module({ controllers: [AuthenticationController] })
export class AuthenticationModule {}
@Module({ controllers: [CommunityController] })
export class CommunityModule {}
@Module({ controllers: [CatalogController] })
export class CatalogModule {}
@Module({ controllers: [EngagementController] })
export class EngagementModule {}
@Module({ controllers: [MediaController] })
export class MediaModule {}
@Module({ controllers: [DiscoveryController] })
export class DiscoveryModule {}
