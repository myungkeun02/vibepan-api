import { Catch, HttpException, type ExceptionFilter, type ArgumentsHost } from '@nestjs/common';
import type { Response as ExpressResponse } from 'express';
import { sendResponse, type HttpRequest } from './transport';
@Catch()
export class ErrorsFilter implements ExceptionFilter {
  async catch(error: unknown, host: ArgumentsHost) {
    const status = error instanceof HttpException ? error.getStatus() : 500;
    if (status >= 500) console.error('api_request_failed', error instanceof Error ? error.name : 'Error');
    const message =
      status >= 500
        ? '처리 중 문제가 생겼습니다.'
        : error instanceof HttpException
          ? error.message
          : '잘못된 요청입니다.';
    await sendResponse(
      host.switchToHttp().getRequest<HttpRequest>(),
      host.switchToHttp().getResponse<ExpressResponse>(),
      Response.json({ ok: false, error: message }, { status }),
    );
  }
}
