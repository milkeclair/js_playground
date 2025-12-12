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

    get journey() {
      return resolve(modules.journey, 'journey');
    },

    set journey(value) {
      modules.journey = value;
    },

    get logger() {
      return resolve(modules.logger, 'logger');
    },

    set logger(value) {
      modules.logger = value;
    },

    get inspector() {
      return resolve(modules.inspector, 'inspector');
    },

    set inspector(value) {
      modules.inspector = value;
    },

    get renderer() {
      return resolve(modules.renderer, 'renderer');
    },

    set renderer(value) {
      modules.renderer = value;
    },

    get trafficOfficer() {
      return resolve(modules.trafficOfficer, 'trafficOfficer');
    },

    set trafficOfficer(value) {
      modules.trafficOfficer = value;
    },

    get suitcase() {
      return resolve(modules.suitcase, 'suitcase');
    },

    set suitcase(value) {
      modules.suitcase = value;
    },

    get lib() {
      return resolve(modules.lib, 'lib');
    },

    set lib(value) {
      modules.lib = value;
    },
  };
}
