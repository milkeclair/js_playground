import type { IncomingMessage } from 'node:http';
import { FileRouter } from '../file_router';

export function RequestClassifier({ fileRouter }: { fileRouter: ReturnType<typeof FileRouter> }) {
  const isDirectoryTraversal = (req: IncomingMessage): boolean => {
    const hasParentRegexp = /(\.\.(\/|\\|$))/;
    return hasParentRegexp.test(req.url || '');
  };

  const lookup = {
    illegal: (req: IncomingMessage): boolean => {
      return req.method !== 'GET' || isDirectoryTraversal(req);
    },

    notFound: (req: IncomingMessage): boolean => {
      return !fileRouter.fileRoutes[req.url || ''] || req.url === '/404';
    },

    appIcon: (req: IncomingMessage): boolean => {
      return req.url === '/favicon.ico';
    },

    script: (req: IncomingMessage): boolean => {
      return (req.url || '').endsWith('.js');
    },

    sourceMap: (req: IncomingMessage): boolean => {
      return (req.url || '').endsWith('.js.map');
    },

    css: (req: IncomingMessage): boolean => {
      return (req.url || '').endsWith('.css') || (req.url || '').endsWith('.scss');
    },
  };

  return { lookup };
}
