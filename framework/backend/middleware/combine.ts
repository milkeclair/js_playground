import { MiddlewareHandler } from '../middleware';

type MiddlewareChain = MiddlewareHandler & { readonly __brand: 'MiddlewareChain' };
type FirstMiddlewareContext = Parameters<MiddlewareHandler>[0];

export function Combine(middlewares: MiddlewareHandler[]): MiddlewareChain {
  const combined = Object.assign(
    async (c: FirstMiddlewareContext) => {
      await middlewares.reduce<Promise<void>>(
        (chain, middleware) => chain.then(() => middleware(c)),
        Promise.resolve()
      );
    },
    { __brand: 'MiddlewareChain' } satisfies { readonly __brand: 'MiddlewareChain' }
  );

  return combined;
}
