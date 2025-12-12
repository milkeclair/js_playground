import { type Server as NodeServer, type ServerResponse } from 'node:http';
import { type Modules } from '../../server';
import { Request } from '../request';
import { Response } from '../response';
import { RouteDefinition } from '../../type';

export function Lifecycle({
  modules,
  customRoutes,
}: {
  modules: Modules;
  customRoutes: RouteDefinition[];
}) {
  const carrySuitcase = async ({
    req,
    res,
  }: {
    req: ReturnType<typeof Request>;
    res: ServerResponse;
  }): Promise<ServerResponse> => {
    const parsedReq = await req.parse(req);
    const urlPath = req.uri.pathname;
    const enhancedRes = Response({ res, requestPath: urlPath, modules });

    await modules.suitcase.zip({
      req: parsedReq,
      res: enhancedRes,
    });

    return res;
  };

  const handleCustomRequest = async ({
    req,
    res,
  }: {
    req: ReturnType<typeof Request>;
    res: ServerResponse;
  }): Promise<boolean> => {
    const customReq = req.custom.find({
      routes: customRoutes,
      method: req.method,
      url: req.url,
    });

    if (customReq) {
      const enhancedReq = await req.enhance(req, customReq.pathParams);
      const enhancedRes = Response({ res, requestPath: req.uri.pathname, modules });
      await customReq.handler({ req: enhancedReq, res: enhancedRes });

      return true;
    } else {
      return false;
    }
  };

  const handleRequest = async ({
    req,
    res,
  }: {
    req: ReturnType<typeof Request>;
    res: ServerResponse;
  }): Promise<void> => {
    if (modules.config.routingType === 'filebase') {
      await modules.journey.walk({ req, res });
      return;
    }

    const handledCustom = await handleCustomRequest({ req, res });

    if (modules.config.routingType === 'definitive') {
      if (!handledCustom) modules.trafficOfficer.action.notFound(req, res);
      return;
    }

    if (!handledCustom) await modules.journey.walk({ req, res });
  };

  const listenExit = () => {
    process.on('SIGINT', () => {
      modules.logger.info.exited();
      process.exit();
    });
  };

  const start = ({ createServer }: { createServer: () => NodeServer }) => {
    const httpServer = createServer();

    httpServer.listen(modules.config.port, modules.config.host, () => {
      modules.logger.info.serverStarted();
      modules.logger.info.howToStop();
    });

    listenExit();
  };

  return { start, carrySuitcase, handleRequest };
}
