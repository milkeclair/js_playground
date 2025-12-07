import { IncomingMessage } from 'node:http';
import type { RouteDefinition, RequestHandler } from '../../type';

export function Custom({ req, protocol }: { req: IncomingMessage; protocol: string }) {
  const segments = ({
    targetRoute,
    uriPath,
  }: {
    targetRoute: RouteDefinition;
    uriPath: string;
  }): { route: string[]; uri: string[] } => {
    const targetRouteSegments = targetRoute.path.split('/');
    const uriPathSegments = uriPath.split('/');

    return {
      route: targetRouteSegments,
      uri: uriPathSegments,
    };
  };

  const matchPathParams = ({
    routeSegments,
    uriSegments,
  }: {
    routeSegments: string[];
    uriSegments: string[];
  }) => {
    const pathParams: Record<string, string> = {};
    let matched = true;

    routeSegments.forEach((routeSegment, i) => {
      if (routeSegment.startsWith(':')) {
        const withoutColon = routeSegment.slice(1);
        pathParams[withoutColon] = uriSegments[i];
      } else if (routeSegment !== uriSegments[i]) {
        matched = false;
      }
    });

    return { matched, pathParams };
  };

  const find = ({
    routes,
    method,
    url,
  }: {
    method?: string;
    url?: string;
    routes: RouteDefinition[];
  }): { handler: RequestHandler; pathParams: Record<string, string> } | null => {
    if (!method || !url) return null;

    const host = req.headers.host ?? 'localhost';
    const urlPath = new URL(url, `${protocol}://${host}`).pathname;

    for (const route of routes) {
      if (route.method !== method) continue;

      const { route: routeSegments, uri: uriSegments } = segments({
        targetRoute: route,
        uriPath: urlPath,
      });

      if (routeSegments.length !== uriSegments.length) continue;

      const { matched, pathParams } = matchPathParams({
        routeSegments,
        uriSegments,
      });

      if (matched) return { handler: route.handler, pathParams };
    }

    return null;
  };

  return { find };
}
