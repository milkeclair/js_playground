import type { Server, ServerResponse } from 'node:http';
import { type ServerDependencies } from '../../server';
import { Request } from '../request';
import { Response } from '../response';
import { RouteDefinition } from '../../type';

export function RequestDispatcher({
  dependencies,
  customRoutes,
}: {
  dependencies: ServerDependencies;
  customRoutes: RouteDefinition[];
}) {
  const runMiddleware = async ({
    req,
    res,
  }: {
    req: ReturnType<typeof Request>;
    res: ServerResponse;
  }): Promise<ServerResponse> => {
    const parsedReq = await req.parse(req);
    const urlPath = req.uri.pathname;
    const enhancedRes = Response({ res, requestPath: urlPath, dependencies });

    await dependencies.middlewareStack.run({
      req: parsedReq,
      res: enhancedRes,
    });

    return res;
  };

  const dispatchExplicitRoute = async ({
    req,
    res,
  }: {
    req: ReturnType<typeof Request>;
    res: ServerResponse;
  }): Promise<boolean> => {
    const customReq = req.routeMatcher.find({
      routes: customRoutes,
      method: req.method,
      url: req.url,
    });

    if (customReq) {
      const enhancedReq = await req.enhance(req, customReq.pathParams);
      const enhancedRes = Response({ res, requestPath: req.uri.pathname, dependencies });
      await customReq.handler({ req: enhancedReq, res: enhancedRes });

      return true;
    } else {
      return false;
    }
  };

  const dispatch = async ({
    req,
    res,
  }: {
    req: ReturnType<typeof Request>;
    res: ServerResponse;
  }): Promise<void> => {
    if (dependencies.config.routingMode === 'file') {
      await dependencies.fileRouter.handle({ req, res });
      return;
    }

    const matched = await dispatchExplicitRoute({ req, res });

    if (dependencies.config.routingMode === 'explicit') {
      if (!matched) dependencies.fileResponseHandler.action.notFound(req, res);
      return;
    }

    if (!matched) await dependencies.fileRouter.handle({ req, res });
  };

  const listen = (createServer: () => Server) => {
    const httpServer = createServer();

    httpServer.listen(dependencies.config.port, dependencies.config.host, () => {
      dependencies.logger.info.serverStarted();
      dependencies.logger.info.howToStop();
    });

    process.on('SIGINT', () => {
      dependencies.logger.info.exited();
      process.exit();
    });
  };

  return { listen, runMiddleware, dispatch };
}
