import type { IncomingMessage, ServerResponse } from 'node:http';
import { camelize } from '../../app/src/assets/script/camelize';
import { Controller } from './controller';
import { Logger } from './logger';
import { Sorter } from './router/sorter';
import { Lib } from './lib';
import { RoadWorker } from './router/road_worker';

export type Routes = Record<string, string>;
type ExtensionPaths = Record<string, string[]>;

const VALIDATION_MAP = [
  { check: 'illegal', handler: 'badRequest' },
  { check: 'notFound', handler: 'notFound' },
  { check: 'appIcon', handler: 'appIcon' },
  { check: 'sourceMap', handler: 'sourceMap' },
  { check: 'script', handler: 'script' },
  { check: 'css', handler: 'css' },
] as const;

export function Router({
  controller,
  logger,
  sorter,
  lib,
}: {
  controller: ReturnType<typeof Controller>;
  logger: ReturnType<typeof Logger>;
  sorter: ReturnType<typeof Sorter>;
  lib: ReturnType<typeof Lib>;
}) {
  const extensionPaths: ExtensionPaths = {};
  let allowedRoutes: Routes = {};

  const roadWorker = RoadWorker({
    logger,
    lib,
    allowedRoutes,
    extensionPaths,
  });

  const draw = ({ routes, extensions }: { routes: Routes; extensions: ExtensionPaths }) => {
    Object.assign(allowedRoutes, routes);
    Object.assign(extensionPaths, extensions);
  };

  const getAction = (req: IncomingMessage) => {
    const fullPath = allowedRoutes[req.url ?? ''];
    const targetFilePath = lib.url.extractEnd(fullPath);
    const camelized = camelize(targetFilePath);

    return lib.url.removeExtension(camelized);
  };

  const handle = async ({ req, res }: { req: IncomingMessage; res: ServerResponse }) => {
    await roadWorker.pavement(Object.keys(extensionPaths));

    for (const { check, handler } of VALIDATION_MAP) {
      if (sorter.lookup[check](req)) {
        return controller.action[handler](req, res);
      }
    }

    const actionName = getAction(req) as keyof typeof controller.action;
    if (actionName === 'deliver') return;

    const handler = controller.action[actionName];
    if (handler) {
      handler(req, res);
    }
  };

  return {
    draw,
    handle,
    ensurePassable: roadWorker.ensurePassable,
    get allowedRoutes() {
      return allowedRoutes;
    },
  };
}
