import { BaseLogger } from '../logger/base';

export function ErrorLogger({ logger }: { logger: ReturnType<typeof BaseLogger> }) {
  return {
    custom: (message: string) => {
      logger.error(message);
    },

    cannotRender: (url: string) => {
      logger.error(`Cannot render, url: ${url}`);
    },
  };
}
