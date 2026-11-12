import { ServerDependencies } from '../../server';

export function LazyRequestClassifier(dependencies: ServerDependencies) {
  return {
    get lookup() {
      return dependencies.requestClassifier?.lookup;
    },
  };
}
