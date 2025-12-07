import { Modules } from '../../server';

export function LazyMiddleware(modules: Modules) {
  return {
    use: modules.middleware?.use,
  };
}
