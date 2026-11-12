import { ServerDependencies } from '../../server';
import { FileRouter } from '../../file_router';

export function LazyFileRouter(dependencies: ServerDependencies) {
  return {
    configure: (...args: Parameters<ReturnType<typeof FileRouter>['configure']>) =>
      dependencies.fileRouter?.configure(...args),
    handle: (...args: Parameters<ReturnType<typeof FileRouter>['handle']>) =>
      dependencies.fileRouter?.handle(...args),

    refreshRoutesIfNeeded: (...args: Parameters<ReturnType<typeof FileRouter>['refreshRoutesIfNeeded']>) =>
      dependencies.fileRouter?.refreshRoutesIfNeeded(...args),

    get fileRoutes() {
      return dependencies.fileRouter?.fileRoutes;
    },
  };
}
