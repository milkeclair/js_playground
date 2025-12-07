import type { Modules } from '../../server';

export function Resolver({ modules }: { modules: Partial<Modules> }) {
  const resolve = <T>(value: T | undefined, name: keyof Modules): T => {
    if (!value) {
      throw new Error(`Module "${name}" is not initialized.`);
    }
    return value;
  };

  return {
    get config() {
      return resolve(modules.config, 'config');
    },

    set config(value) {
      modules.config = value;
    },

    get router() {
      return resolve(modules.router, 'router');
    },

    set router(value) {
      modules.router = value;
    },

    get logger() {
      return resolve(modules.logger, 'logger');
    },

    set logger(value) {
      modules.logger = value;
    },

    get sorter() {
      return resolve(modules.sorter, 'sorter');
    },

    set sorter(value) {
      modules.sorter = value;
    },

    get renderer() {
      return resolve(modules.renderer, 'renderer');
    },

    set renderer(value) {
      modules.renderer = value;
    },

    get controller() {
      return resolve(modules.controller, 'controller');
    },

    set controller(value) {
      modules.controller = value;
    },

    get middleware() {
      return resolve(modules.middleware, 'middleware');
    },

    set middleware(value) {
      modules.middleware = value;
    },

    get lib() {
      return resolve(modules.lib, 'lib');
    },

    set lib(value) {
      modules.lib = value;
    },
  };
}
