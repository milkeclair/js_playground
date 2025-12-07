import type { IncomingMessage } from 'node:http';
import { BaseLogger } from '../logger/base';
import { Config } from '../config';
import { Lib } from '../lib';

export function InfoLogger({
  logger,
  config,
  lib,
}: {
  logger: ReturnType<typeof BaseLogger>;
  config: ReturnType<typeof Config>;
  lib: ReturnType<typeof Lib>;
}) {
  return {
    custom: (message: string) => {
      logger.info(message);
    },

    serverStarted: () => {
      logger.info(`Server running at http://${config.host}:${config.port}`, {
        lineBreak: 'before',
      });
    },

    howToStop: () => {
      logger.info('Press Ctrl+C to stop the server', { lineBreak: 'after' });
    },

    receivedRequest: (req: IncomingMessage) => {
      const method = req.method?.toUpperCase() || 'UNKNOWN';
      const url = req.url || '';
      const ip = lib.request.extractIpAddress(req) || 'unknown';
      logger.info(`Starting ${method}, url: ${url}, ip: ${ip}`);
    },

    exited: () => {
      logger.info('Gracefully stopping the server...', { lineBreak: 'before' });
      logger.info('Goodbye!');
    },

    updatingAllowedRoutes: () => {
      logger.info('Updating allowed routes...');
    },

    allowedRoutesUpdated: () => {
      logger.info('Allowed routes updated.');
    },

    rendering: (url: string) => {
      logger.info(`Rendering, url: ${url}`);
    },

    rendered: (url: string) => {
      logger.info(`Rendered!, url: ${url}`);
    },
  };
}
