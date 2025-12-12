import { Modules } from '../server';
import { LazyServer } from './lazy/server';
import { LazyConfig } from './lazy/config';
import { LazyJourney } from './lazy/journey';
import { LazyLogger } from './lazy/logger';
import { LazyInspector } from './lazy/inspector';
import { LazyRenderer } from './lazy/renderer';
import { LazyTrafficOfficer } from './lazy/traffic_officer';
import { LazySuitcase } from './lazy/suitcase';

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

    get inspector() {
      return LazyInspector(modules);
    },

    get renderer() {
      return LazyRenderer(modules);
    },

    get trafficOfficer() {
      return LazyTrafficOfficer(modules);
    },

    get suitcase() {
      return LazySuitcase(modules);
    },
  };
}
