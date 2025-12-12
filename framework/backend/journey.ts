import type { IncomingMessage, ServerResponse } from 'node:http';
import { camelize } from '../../app/src/assets/script/camelize';
import { TrafficOfficer } from './traffic_officer';
import { Logger } from './logger';
import { Sorter } from './journey/sorter';
import { Lib } from './lib';
import { RoadWorker } from './journey/road_worker';

export type Routes = Record<string, string>;
type ExtensionPaths = Record<string, string[]>;

const SAFE_ROADS = [
  { check: 'illegal', action: 'badRequest' },
  { check: 'notFound', action: 'notFound' },
  { check: 'appIcon', action: 'appIcon' },
  { check: 'sourceMap', action: 'sourceMap' },
  { check: 'script', action: 'script' },
  { check: 'css', action: 'css' },
] as const;

export function Journey({
  trafficOfficer,
  logger,
  sorter,
  lib,
}: {
  trafficOfficer: ReturnType<typeof TrafficOfficer>;
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

  const drawMap = ({ routes, extensions }: { routes: Routes; extensions: ExtensionPaths }) => {
    Object.assign(allowedRoutes, routes);
    Object.assign(extensionPaths, extensions);
  };

  const lookupAction = (req: IncomingMessage) => {
    const fullPath = allowedRoutes[req.url ?? ''];
    const targetFilePath = lib.url.extractEnd(fullPath);
    const camelized = camelize(targetFilePath);

    return lib.url.removeExtension(camelized);
  };

  const walk = async ({ req, res }: { req: IncomingMessage; res: ServerResponse }) => {
    await roadWorker.pavement(Object.keys(extensionPaths));

    for (const { check, action } of SAFE_ROADS) {
      if (sorter.lookup[check](req)) {
        return trafficOfficer.action[action](req, res);
      }
    }

    const actionName = lookupAction(req) as keyof typeof trafficOfficer.action;
    if (actionName === 'deliver') return;

    const action = trafficOfficer.action[actionName];
    if (action) {
      action(req, res);
    } else {
      trafficOfficer.action.deliver({ req, res, mimeType: 'html' });
    }
  };

  return {
    drawMap,
    walk,
    ensurePassable: roadWorker.ensurePassable,
    get allowedRoutes() {
      return allowedRoutes;
    },
  };
}
