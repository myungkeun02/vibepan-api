export interface CookieOptions {
  path?: string;
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: 'lax' | 'strict' | 'none';
  maxAge?: number;
  expires?: Date;
  domain?: string;
}
export interface RequestContext {
  request: Request;
  url: URL;
  params: Record<string, string | undefined>;
  clientAddress: string;
  locals: { user: any; admin: any; adminSurface: boolean; anon: string; csrf: string; presentation?: any };
  cookies: {
    get(name: string): { value: string } | undefined;
    set(name: string, value: string, options?: CookieOptions): void;
    delete(name: string, options?: CookieOptions): void;
  };
  redirect(location: string, status?: number): Response;
}
export type RequestHandler = (context: RequestContext) => Response | Promise<Response>;
