import { Modules } from '../server';
import { LazyServer } from './lazy/server';
import { LazyConfig } from './lazy/config';
import { LazyJourney } from './lazy/journey';
import { LazyLogger } from './lazy/logger';
import { LazySorter } from './lazy/sorter';
import { LazyRenderer } from './lazy/renderer';
import { LazyController } from './lazy/controller';
import { LazyMiddleware } from './lazy/middleware';

export function Lazy(modules: Modules) {
  return {
    get server() {
      return LazyServer(modules);
    },

    get config() {
      return LazyConfig(modules);
    },

    get journey() {
      return LazyJourney(modules);
    },

    get logger() {
      return LazyLogger(modules);
    },

    get sorter() {
      return LazySorter(modules);
    },

    get renderer() {
      return LazyRenderer(modules);
    },

    get controller() {
      return LazyController(modules);
    },

    get middleware() {
      return LazyMiddleware(modules);
    },
  };
}
