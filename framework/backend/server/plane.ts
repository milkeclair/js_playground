import { createServer, type Server, type IncomingMessage } from 'node:http';
import { Request } from './request';
import { Guide } from './plane/guide';
import type { RouteDefinition } from '../type';
import type { Modules } from '../server';

export function Plane({
  modules,
  customRoutes,
}: {
  modules: Modules;
  customRoutes: RouteDefinition[];
}) {
  const { depart, carrySuitcase, navigate } = Guide({ modules, customRoutes });

  const loggingReceivedRequest = (req: IncomingMessage): void => {
    if (!modules.lib.url.hasExtension(req.url || '')) {
      modules.logger.info.receivedRequest(req);
    }
  };

  const itinerary = (): Server => {
    return createServer(async (_req, res) => {
      try {
        const req = Request({ req: _req });
        loggingReceivedRequest(req);

        const overriddenRes = await carrySuitcase({ req, res });

        await modules.journey.ensurePassable();

        await navigate({ req, res: overriddenRes });
      } catch (error) {
        modules.logger.error.custom(error instanceof Error ? error.message : String(error));
        if (!res.headersSent) {
          res.statusCode = 500;
          res.end('Internal Server Error');
        }
      }
    });
  };

  return { takeOff: () => depart(itinerary) };
}
