import type { EnhancedRequest, EnhancedResponse } from './type';
import { composeMiddleware } from './middleware_stack/compose_middleware';

export type Middleware = (c: { req: EnhancedRequest; res: EnhancedResponse }) => void | Promise<void>;

export function MiddlewareStack() {
  const middlewares: Middleware[] = [];

  const use = (middleware: Middleware): void => {
    middlewares.push(middleware);
  };

  const run = async ({
    req,
    res,
  }: {
    req: EnhancedRequest;
    res: EnhancedResponse;
  }): Promise<void> => {
    const composedMiddleware = composeMiddleware(middlewares);

    await composedMiddleware({ req, res });
  };

  return {
    run,
    use,
  };
}
