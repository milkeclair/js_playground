import { ServerDependencies } from '../../server';

export function LazyConfig(dependencies: ServerDependencies) {
  return {
    get host() {
      return dependencies.config?.host;
    },

    get port() {
      return dependencies.config?.port;
    },

    get root() {
      return dependencies.config?.root;
    },

    get allowed() {
      return dependencies.config?.allowed;
    },

    get routingType() {
      return dependencies.config?.routingType;
    },
  };
}
