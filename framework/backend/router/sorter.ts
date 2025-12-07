import type { IncomingMessage } from 'node:http';
import { Router } from '../router';

export function Sorter({ router }: { router: ReturnType<typeof Router> }) {
  const isDirectoryTraversal = (req: IncomingMessage): boolean => {
    const hasParentRegexp = /(\.\.(\/|\\|$))/;
    return hasParentRegexp.test(req.url || '');
  };

  const lookup = {
    illegal: (req: IncomingMessage): boolean => {
      return req.method !== 'GET' || isDirectoryTraversal(req);
    },

    notFound: (req: IncomingMessage): boolean => {
      return !router.allowedRoutes[req.url || ''] || req.url === '/404';
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
