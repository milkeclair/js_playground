import type { RouteDefinition } from './type';
import { createServerDependencies } from './server/dependencies';
import { HttpServer } from './server/http_server';
import { RouteRegistrar } from './server/route_registrar';
import { BuiltinMiddleware } from './middleware_stack/builtin_middleware';
import { Config } from './config';
import { FileRouter } from './file_router';
import { FileResponseHandler } from './file_response_handler';
import { ContentRenderer } from './content_renderer';
import { MiddlewareStack } from './middleware_stack';
import { Logger } from './logger';
import { RequestClassifier } from './file_router/request_classifier';
import { Lib } from './lib';

export type ServerOptions = {
  host?: string;
  port?: number;
  root?: string;
  allowed?: {
    origins?: string[];
    ips?: string[];
    methods?: string[];
  };
  routingType?: 'definitive' | 'filebase' | 'hybrid';
};

export type ServerDependencies = {
  config: ReturnType<typeof Config>;
  fileRouter: ReturnType<typeof FileRouter>;
  logger: ReturnType<typeof Logger>;
  requestClassifier: ReturnType<typeof RequestClassifier>;
  contentRenderer: ReturnType<typeof ContentRenderer>;
  fileResponseHandler: ReturnType<typeof FileResponseHandler>;
  middlewareStack: ReturnType<typeof MiddlewareStack>;
  lib: ReturnType<typeof Lib>;
};

export function Server(options: ServerOptions = {}) {
  const customRoutes: RouteDefinition[] = [];

  const dependencies = createServerDependencies(options);
  const httpServer = HttpServer({ dependencies, customRoutes });
  const routeRegistrar = RouteRegistrar({ customRoutes });
  const builtinMiddleware = BuiltinMiddleware();

  dependencies.middlewareStack.use(builtinMiddleware.cors({ config: dependencies.config, lib: dependencies.lib }));
  dependencies.middlewareStack.use(builtinMiddleware.methods({ config: dependencies.config }));
  dependencies.middlewareStack.use(builtinMiddleware.type());

  return {
    start: httpServer.start,
    dependencies,
    use: dependencies.middlewareStack.use,
    ...routeRegistrar,
  };
}
