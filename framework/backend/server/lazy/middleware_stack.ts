import { ServerDependencies } from '../../server';

export function LazyMiddlewareStack(dependencies: ServerDependencies) {
  return {
    use: dependencies.middlewareStack?.use,
  };
}
