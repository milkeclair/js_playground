import { createServer, type Server, type IncomingMessage } from 'node:http';
import { Request } from './request';
import { RequestDispatcher } from './http_server/request_dispatcher';
import type { RouteDefinition } from '../type';
import type { ServerDependencies } from '../server';

export function HttpServer({
  dependencies,
  customRoutes,
}: {
  dependencies: ServerDependencies;
  customRoutes: RouteDefinition[];
}) {
  const { listen, runMiddleware, dispatch } = RequestDispatcher({ dependencies, customRoutes });

  const loggingReceivedRequest = (req: IncomingMessage): void => {
    if (!dependencies.lib.url.hasExtension(req.url || '')) {
      dependencies.logger.info.receivedRequest(req);
    }
  };

  const createHttpServer = (): Server => {
    return createServer(async (_req, res) => {
      try {
        const req = Request({ req: _req });
        loggingReceivedRequest(req);

        const overriddenRes = await runMiddleware({ req, res });

        await dependencies.fileRouter.refreshRoutesIfNeeded();

        await dispatch({ req, res: overriddenRes });
      } catch (error) {
        dependencies.logger.error.custom(error instanceof Error ? error.message : String(error));
        if (!res.headersSent) {
          res.statusCode = 500;
          res.end('Internal Server Error');
        }
      }
    });
  };

  return { start: () => listen(createHttpServer) };
}
