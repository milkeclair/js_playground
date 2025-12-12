import { Modules } from '../../server';
import { Journey } from '../../journey';

export function LazyJourney(modules: Modules) {
  return {
    drawMap: (...args: Parameters<ReturnType<typeof Journey>['drawMap']>) =>
      modules.journey?.drawMap(...args),
    walk: (...args: Parameters<ReturnType<typeof Journey>['walk']>) =>
      modules.journey?.walk(...args),

    ensurePassable: (...args: Parameters<ReturnType<typeof Journey>['ensurePassable']>) =>
      modules.journey?.ensurePassable(...args),

    get allowedRoutes() {
      return modules.journey?.allowedRoutes;
    },
  };
}
