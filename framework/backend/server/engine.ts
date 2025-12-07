import {
  createServer as createNodeServer,
  type Server as NodeServer,
  type IncomingMessage,
} from 'node:http';
import { Request } from './request';
import { Lifecycle } from './engine/lifecycle';
import type { RouteDefinition } from '../type';
import type { Modules } from '../server';

export function Engine({
  modules,
  customRoutes,
}: {
  modules: Modules;
  customRoutes: RouteDefinition[];
}) {
  const { start, executeMiddlewares, handleRequest } = Lifecycle({ modules, customRoutes });

  const loggingReceivedRequest = (req: IncomingMessage): void => {
    if (!modules.lib.url.hasExtension(req.url || '')) {
      modules.logger.info.receivedRequest(req);
    }
  };

  const createServer = (): NodeServer => {
    return createNodeServer(async (_req, res) => {
      try {
        const req = Request({ req: _req });
        loggingReceivedRequest(req);

        const overriddenRes = await executeMiddlewares({ req, res });

        await modules.router.ensurePassable();

        await handleRequest({ req, res: overriddenRes });
      } catch (error) {
        modules.logger.error.custom(error instanceof Error ? error.message : String(error));
        if (!res.headersSent) {
          res.statusCode = 500;
          res.end('Internal Server Error');
        }
      }
    });
  };

  return { start: () => start({ createServer }) };
}
