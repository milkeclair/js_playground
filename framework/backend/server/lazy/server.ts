import { Modules } from '../../server';
import { Router } from '../../router';

export function LazyServer(modules: Modules) {
  return {
    config: {
      get root() {
        return modules.config?.root;
      },
    },

    handle: (...args: Parameters<ReturnType<typeof Router>['handle']>) =>
      modules.router?.handle(...args),
  };
}
