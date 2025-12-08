import type { EnhancedRequest, EnhancedResponse } from './type';
import { Combine } from './middleware/combine';

export type MiddlewareHandler = (c: {
  req: EnhancedRequest;
  res: EnhancedResponse;
}) => void | Promise<void>;

export function Middleware() {
  const middlewares: MiddlewareHandler[] = [];

  const use = (middleware: MiddlewareHandler): void => {
    middlewares.push(middleware);
  };

  const run = async ({
    req,
    res,
  }: {
    req: EnhancedRequest;
    res: EnhancedResponse;
  }): Promise<void> => {
    const combined = Combine(middlewares);

    await combined({ req, res });
  };

  return {
    run,
    use,
  };
}
