import type { IncomingMessage } from 'node:http';
import { BaseLogger } from '../logger/base';

export function WarnLogger({ logger }: { logger: ReturnType<typeof BaseLogger> }) {
  return {
    custom: (message: string) => {
      logger.warn(message);
    },

    badRequest: () => {
      logger.warn('Bad Request: returning 400');
    },

    notFound: (req: IncomingMessage) => {
      logger.warn(`Not Found: ${req.url}, returning 404`);
    },
  };
}
