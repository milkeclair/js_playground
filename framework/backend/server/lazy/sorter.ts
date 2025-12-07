import { Modules } from '../../server';

export function LazySorter(modules: Modules) {
  return {
    get lookup() {
      return modules.sorter?.lookup;
    },
  };
}
