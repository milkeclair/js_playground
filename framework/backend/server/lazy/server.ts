import { Modules } from '../../server';
import { Journey } from '../../journey';

export function LazyServer(modules: Modules) {
  return {
    config: {
      get root() {
        return modules.config?.root;
      },
    },

    walk: (...args: Parameters<ReturnType<typeof Journey>['walk']>) =>
      modules.journey?.walk(...args),
  };
}
