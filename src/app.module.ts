import { Module, Global } from '@nestjs/common';
import { APP_GUARD, APP_FILTER } from '@nestjs/core';
import { DatabaseService } from './http/database.service';
import { AccessGuard } from './http/access.guard';
import { ErrorsFilter } from './http/errors.filter';
import { HttpService } from './http/http.service';
import {
  HealthController,
  PresentationController,
  AuthenticationModule,
  CommunityModule,
  CatalogModule,
  EngagementModule,
  MediaModule,
  DiscoveryModule,
} from './features';
@Global()
@Module({ providers: [DatabaseService, HttpService], exports: [HttpService] })
class InfrastructureModule {}
@Module({
  imports: [
    InfrastructureModule,
    AuthenticationModule,
    CommunityModule,
    CatalogModule,
    EngagementModule,
    MediaModule,
    DiscoveryModule,
  ],
  controllers: [HealthController, PresentationController],
  providers: [
    { provide: APP_GUARD, useClass: AccessGuard },
    { provide: APP_FILTER, useClass: ErrorsFilter },
  ],
})
export class AppModule {}
