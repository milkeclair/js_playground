import { ServerDependencies } from '../../server';

export function LazyFileResponseHandler(dependencies: ServerDependencies) {
  return {
    action: dependencies.fileResponseHandler?.action,
  };
}
