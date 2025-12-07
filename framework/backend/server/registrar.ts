import type { RequestHandler, RouteDefinition, HttpMethod } from '../type';

export function Registrar({ customRoutes }: { customRoutes: RouteDefinition[] }) {
  const METHODS = {
    GET: 'GET',
    POST: 'POST',
    PUT: 'PUT',
    DELETE: 'DELETE',
    PATCH: 'PATCH',
  } as const;

  const register = (method: HttpMethod, path: string, handler: RequestHandler): void => {
    customRoutes.push({ method, path, handler });
  };

  const get = (path: string, handler: RequestHandler) => register(METHODS.GET, path, handler);
  const post = (path: string, handler: RequestHandler) => register(METHODS.POST, path, handler);
  const put = (path: string, handler: RequestHandler) => register(METHODS.PUT, path, handler);
  const del = (path: string, handler: RequestHandler) => register(METHODS.DELETE, path, handler);
  const patch = (path: string, handler: RequestHandler) => register(METHODS.PATCH, path, handler);

  return {
    get,
    post,
    put,
    delete: del,
    patch,
  };
}
