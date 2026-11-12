import { IncomingMessage } from 'node:http';
import type { EnhancedRequest } from '../type';
import { RouteMatcher } from './request/route_matcher';
import { Parser } from './request/parser';

export function Request({ req }: { req: IncomingMessage }): IncomingMessage & {
  protocol: string;
  uri: URL;
  parse: (req: IncomingMessage, pathParams?: Record<string, string>) => Promise<EnhancedRequest>;
  enhance: (req: IncomingMessage, pathParams?: Record<string, string>) => Promise<EnhancedRequest>;
  routeMatcher: ReturnType<typeof RouteMatcher>;
  body?: unknown;
} {
  const parser = Parser({ req });
  const routeMatcher = RouteMatcher({ req, protocol: parser.protocol });

  return Object.assign(req, {
    protocol: parser.protocol,
    uri: parser.uri,
    parse: parser.request,
    enhance: parser.request,
    routeMatcher,
  });
}
