import { ServerDependencies } from '../../server';
import { FileRouter } from '../../file_router';

export function LazyServer(dependencies: ServerDependencies) {
  return {
    config: {
      get root() {
        return dependencies.config?.root;
      },
    },

    handle: (...args: Parameters<ReturnType<typeof FileRouter>['handle']>) =>
      dependencies.fileRouter?.handle(...args),
  };
}
