import { Modules } from '../../server';

export function LazyConfig(modules: Modules) {
  return {
    get host() {
      return modules.config?.host;
    },

    get port() {
      return modules.config?.port;
    },

    get root() {
      return modules.config?.root;
    },

    get allowed() {
      return modules.config?.allowed;
    },
  };
}
