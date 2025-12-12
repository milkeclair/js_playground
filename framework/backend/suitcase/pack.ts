import { Luggage } from '../suitcase';

type ReadyLuggage = Luggage & { readonly __brand: 'ReadyLuggage' };
type FirstMiddlewareContext = Parameters<Luggage>[0];

export function Pack(middlewares: Luggage[]): ReadyLuggage {
  const packed = Object.assign(
    async (c: FirstMiddlewareContext) => {
      await middlewares.reduce<Promise<void>>(
        (chain, middleware) => chain.then(() => middleware(c)),
        Promise.resolve()
      );
    },
    { __brand: 'ReadyLuggage' } satisfies { readonly __brand: 'ReadyLuggage' }
  );

  return packed;
}
