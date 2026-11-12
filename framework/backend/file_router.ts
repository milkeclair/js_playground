import type { IncomingMessage, ServerResponse } from 'node:http';
import { camelize } from '../../app/src/assets/script/camelize';
import { FileResponseHandler } from './file_response_handler';
import { Logger } from './logger';
import { RequestClassifier } from './file_router/request_classifier';
import { Lib } from './lib';
import { FileRouteScanner } from './file_router/file_route_scanner';

export type Routes = Record<string, string>;
type ExtensionPaths = Record<string, string[]>;

const FILE_ROUTE_RULES = [
  { check: 'illegal', action: 'badRequest' },
  { check: 'notFound', action: 'notFound' },
  { check: 'appIcon', action: 'appIcon' },
  { check: 'sourceMap', action: 'sourceMap' },
  { check: 'script', action: 'script' },
  { check: 'css', action: 'css' },
] as const;

export function FileRouter({
  fileResponseHandler,
  logger,
  requestClassifier,
  lib,
}: {
  fileResponseHandler: ReturnType<typeof FileResponseHandler>;
  logger: ReturnType<typeof Logger>;
  requestClassifier: ReturnType<typeof RequestClassifier>;
  lib: ReturnType<typeof Lib>;
}) {
  const extensionPaths: ExtensionPaths = {};
  let fileRoutes: Routes = {};

  const fileRouteScanner = FileRouteScanner({
    logger,
    lib,
    fileRoutes,
    extensionPaths,
  });

  const configure = ({ routes, extensions }: { routes: Routes; extensions: ExtensionPaths }) => {
    Object.assign(fileRoutes, routes);
    Object.assign(extensionPaths, extensions);
  };

  const lookupAction = (req: IncomingMessage) => {
    const fullPath = fileRoutes[req.url ?? ''];
    const targetFilePath = lib.url.extractEnd(fullPath);
    const camelized = camelize(targetFilePath);

    return lib.url.removeExtension(camelized);
  };

  const handle = async ({ req, res }: { req: IncomingMessage; res: ServerResponse }) => {
    await fileRouteScanner.refreshIfNeeded(Object.keys(extensionPaths));

    for (const { check, action } of FILE_ROUTE_RULES) {
      if (requestClassifier.lookup[check](req)) {
        return fileResponseHandler.action[action](req, res);
      }
    }

    const actionName = lookupAction(req) as keyof typeof fileResponseHandler.action;
    if (actionName === 'deliver') return;

    const action = fileResponseHandler.action[actionName];
    if (action) {
      action(req, res);
    } else {
      fileResponseHandler.action.deliver({ req, res, mimeType: 'html' });
    }
  };

  return {
    configure,
    handle,
    refreshRoutesIfNeeded: fileRouteScanner.refreshRoutesIfNeeded,
    get fileRoutes() {
      return fileRoutes;
    },
  };
}
