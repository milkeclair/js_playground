import { Modules } from '../../server';

export function LazySuitcase(modules: Modules) {
  return {
    put: modules.suitcase?.put,
  };
}
