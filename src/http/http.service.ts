import { Injectable } from '@nestjs/common';
import type { Response as ExpressResponse } from 'express';
import { sendResponse, type HttpRequest } from './transport';
import type { RequestHandler } from './context';
@Injectable()
export class HttpService {
  async handle(
    req: HttpRequest,
    res: ExpressResponse,
    handler: RequestHandler,
    params?: Record<string, string>,
  ) {
    if (params) Object.assign(req.context.params, params);
    await sendResponse(req, res, await handler(req.context));
  }
}
