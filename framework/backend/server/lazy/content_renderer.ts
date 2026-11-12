import { ServerDependencies } from '../../server';
import { ContentRenderer } from '../../content_renderer';

export function LazyContentRenderer(dependencies: ServerDependencies) {
  return {
    render: (...args: Parameters<ReturnType<typeof ContentRenderer>['render']>) =>
      dependencies.contentRenderer?.render(...args),

    isNotFoundContent: (...args: Parameters<ReturnType<typeof ContentRenderer>['isNotFoundContent']>) =>
      dependencies.contentRenderer?.isNotFoundContent(...args),
  };
}
