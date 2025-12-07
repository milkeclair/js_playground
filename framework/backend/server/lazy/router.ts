import { Modules } from '../../server';
import { Router } from '../../router';

export function LazyRouter(modules: Modules) {
  return {
    draw: (...args: Parameters<ReturnType<typeof Router>['draw']>) => modules.router?.draw(...args),

    handle: (...args: Parameters<ReturnType<typeof Router>['handle']>) =>
      modules.router?.handle(...args),

    ensurePassable: (...args: Parameters<ReturnType<typeof Router>['ensurePassable']>) =>
      modules.router?.ensurePassable(...args),

    get allowedRoutes() {
      return modules.router?.allowedRoutes;
    },
  };
}
