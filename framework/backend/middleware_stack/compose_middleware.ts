import { Middleware } from '../middleware_stack';

type ComposedMiddleware = Middleware & { readonly __brand: 'ComposedMiddleware' };
type MiddlewareContext = Parameters<Middleware>[0];

export function composeMiddleware(middlewares: Middleware[]): ComposedMiddleware {
  const composedMiddleware = Object.assign(
    async (c: MiddlewareContext) => {
      await middlewares.reduce<Promise<void>>(
        (chain, middleware) => chain.then(() => middleware(c)),
        Promise.resolve()
      );
    },
    { __brand: 'ComposedMiddleware' } satisfies { readonly __brand: 'ComposedMiddleware' }
  );

  return composedMiddleware;
}
