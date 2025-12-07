import type { IncomingMessage, ServerResponse } from 'node:http';
import { Renderer } from './renderer';
import { Logger } from './logger';

export const MIME_TYPES = {
  plain: 'text/plain',
  html: 'text/html',
  ejs: 'text/html',
  css: 'text/css',
  js: 'text/javascript',
  png: 'image/png',
  ico: 'image/x-icon',
  map: 'application/json',
} as const;

export function Controller({
  renderer,
  logger,
}: {
  renderer: ReturnType<typeof Renderer>;
  logger: ReturnType<typeof Logger>;
}) {
  const setStatusCode = (req: IncomingMessage, res: ServerResponse, view: string) => {
    res.statusCode = renderer.isNotFoundView(view) ? 404 : 200;
    if (res.statusCode === 404) {
      logger.warn.notFound(req);
    }
  };

  const action = {
    badRequest: (_req: IncomingMessage, res: ServerResponse) => {
      logger.warn.badRequest();

      res.statusCode = 400;
      res.setHeader('Content-Type', MIME_TYPES.plain);
      res.end('400 Bad Request');
    },

    notFound: (req: IncomingMessage, res: ServerResponse) => {
      const data = { message: `${req.url} not found` };
      const view = renderer.render({ url: '/404', data });

      setStatusCode(req, res, view);
      res.setHeader('Content-Type', MIME_TYPES.html);
      res.end(view);
    },

    appIcon: (req: IncomingMessage, res: ServerResponse) => {
      action.deliver({ req, res, mimeType: 'ico' });
    },

    script: (req: IncomingMessage, res: ServerResponse) => {
      action.deliver({ req, res, mimeType: 'js' });
    },

    sourceMap: (req: IncomingMessage, res: ServerResponse) => {
      action.deliver({ req, res, mimeType: 'map' });
    },

    css: (req: IncomingMessage, res: ServerResponse) => {
      action.deliver({ req, res, mimeType: 'css' });
    },

    deliver: ({
      req,
      res,
      mimeType = 'plain',
      data = {},
      loggable = false,
    }: {
      req: IncomingMessage;
      res: ServerResponse;
      mimeType?: keyof typeof MIME_TYPES;
      data?: Record<string, unknown>;
      loggable?: boolean;
    }) => {
      const content = renderer.render({ url: req.url || '', data, loggable });

      setStatusCode(req, res, content);
      res.setHeader('Content-Type', MIME_TYPES[mimeType]);
      res.end(content);
    },
  };

  return { action };
}
