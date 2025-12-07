import { Modules } from '../../server';
import { Renderer } from '../../renderer';

export function LazyRenderer(modules: Modules) {
  return {
    render: (...args: Parameters<ReturnType<typeof Renderer>['render']>) =>
      modules.renderer?.render(...args),

    isNotFoundView: (...args: Parameters<ReturnType<typeof Renderer>['isNotFoundView']>) =>
      modules.renderer?.isNotFoundView(...args),
  };
}
