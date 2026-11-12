import { Config } from '../config';
import { FileRouter } from '../file_router';
import { FileResponseHandler } from '../file_response_handler';
import { ContentRenderer } from '../content_renderer';
import { MiddlewareStack } from '../middleware_stack';
import { Logger } from '../logger';
import { RequestClassifier } from '../file_router/request_classifier';
import { Lib } from '../lib';
import { Lazy } from './lazy';
import { Resolver } from './dependencies/resolver';
import type { ServerOptions, ServerDependencies } from '../server';

export function createServerDependencies(options: ServerOptions = {}): ServerDependencies {
  const _dependencies: Partial<ServerDependencies> = {};
  const dependencies = Resolver({ dependencies: _dependencies });
  const lazy = Lazy(dependencies);

  dependencies.lib = Lib();
  dependencies.logger = Logger({ config: lazy.config, lib: dependencies.lib });
  dependencies.requestClassifier = RequestClassifier({ fileRouter: lazy.fileRouter });
  dependencies.contentRenderer = ContentRenderer({
    server: lazy.server,
    fileRouter: lazy.fileRouter,
    logger: lazy.logger,
    lib: dependencies.lib,
  });

  dependencies.fileResponseHandler = FileResponseHandler({
    contentRenderer: lazy.contentRenderer,
    logger: lazy.logger,
  });

  dependencies.fileRouter = FileRouter({
    fileResponseHandler: lazy.fileResponseHandler,
    logger: lazy.logger,
    requestClassifier: lazy.requestClassifier,
    lib: dependencies.lib,
  });

  dependencies.config = Config({
    fileRouter: lazy.fileRouter,
    configs: {
      host: options.host,
      port: options.port,
      root: options.root,
      allowed: options.allowed,
      routingMode: options.routingMode,
    },
  });

  dependencies.middlewareStack = MiddlewareStack();

  return dependencies;
}
