import { Modules } from '../../server';

export function LazyInspector(modules: Modules) {
  return {
    get lookup() {
      return modules.inspector?.lookup;
    },
  };
}
