import type { IncomingMessage, ServerResponse } from 'node:http';

export type EnhancedRequest = IncomingMessage & {
  pathParams: Record<string, string>;
  query: Record<string, string>;
  body?: unknown;
};

export type EnhancedResponse = ServerResponse & {
  json: (data: unknown) => void;
  html: (content: string) => void;
  text: (content: string, type?: string) => void;
  status: (code: number) => EnhancedResponse;
  render: (options?: { template?: string; params?: Record<string, unknown> }) => void;
};

export function isEnhancedRequest(req: IncomingMessage): req is EnhancedRequest {
  return 'pathParams' in req && 'query' in req;
}

export function isEnhancedResponse(res: ServerResponse): res is EnhancedResponse {
  return 'json' in res && 'html' in res && 'text' in res && 'status' in res && 'render' in res;
}

export type RequestHandler = (c: {
  req: EnhancedRequest;
  res: EnhancedResponse;
}) => void | Promise<void>;

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export type RouteDefinition = {
  method: HttpMethod;
  path: string;
  handler: RequestHandler;
};
