import { ServerDependencies } from '../server';
import { LazyServer } from './lazy/server';
import { LazyConfig } from './lazy/config';
import { LazyFileRouter } from './lazy/file_router';
import { LazyLogger } from './lazy/logger';
import { LazyRequestClassifier } from './lazy/request_classifier';
import { LazyContentRenderer } from './lazy/content_renderer';
import { LazyFileResponseHandler } from './lazy/file_response_handler';
import { LazyMiddlewareStack } from './lazy/middleware_stack';

export function Lazy(dependencies: ServerDependencies) {
  return {
    get server() {
      return LazyServer(dependencies);
    },

    get config() {
      return LazyConfig(dependencies);
    },

    get fileRouter() {
      return LazyFileRouter(dependencies);
    },

    get logger() {
      return LazyLogger(dependencies);
    },

    get requestClassifier() {
      return LazyRequestClassifier(dependencies);
    },

    get contentRenderer() {
      return LazyContentRenderer(dependencies);
    },

    get fileResponseHandler() {
      return LazyFileResponseHandler(dependencies);
    },

    get middlewareStack() {
      return LazyMiddlewareStack(dependencies);
    },
  };
}
