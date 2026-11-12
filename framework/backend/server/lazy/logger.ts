import { ServerDependencies } from '../../server';

export function LazyLogger(dependencies: ServerDependencies) {
  return {
    get info() {
      return dependencies.logger?.info;
    },

    get warn() {
      return dependencies.logger?.warn;
    },

    get error() {
      return dependencies.logger?.error;
    },
  };
}
