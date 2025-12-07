import { Modules } from '../../server';

export function LazyLogger(modules: Modules) {
  return {
    get info() {
      return modules.logger?.info;
    },

    get warn() {
      return modules.logger?.warn;
    },

    get error() {
      return modules.logger?.error;
    },
  };
}
