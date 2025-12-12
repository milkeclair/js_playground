import { Modules } from '../../server';
import { Sightsee } from '../../sightsee';

export function LazySightsee(modules: Modules) {
  return {
    takePhoto: (...args: Parameters<ReturnType<typeof Sightsee>['takePhoto']>) =>
      modules.sightsee?.takePhoto(...args),

    isNotFoundPhoto: (...args: Parameters<ReturnType<typeof Sightsee>['isNotFoundPhoto']>) =>
      modules.sightsee?.isNotFoundPhoto(...args),
  };
}
