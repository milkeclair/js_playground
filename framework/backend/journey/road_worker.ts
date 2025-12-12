import path from 'node:path';
import { Logger } from '../logger';
import { Lib } from '../lib';
import type { Routes } from '../journey';
import { RoadClosure } from './road_closure';

export function RoadWorker({
  logger,
  lib,
  allowedRoutes,
  extensionPaths,
}: {
  logger: ReturnType<typeof Logger>;
  lib: ReturnType<typeof Lib>;
  allowedRoutes: Routes;
  extensionPaths: Record<string, string[]>;
}) {
  const roadClosure = RoadClosure();

  const formatRoute = (filePath: string, extension: string) => {
    if (extension === '.html' || extension === '.ejs') {
      return `/${lib.url.removeExtension(filePath)}`;
    } else if (extension === '.css' || extension === '.scss') {
      return `/assets/css/${filePath}`;
    } else {
      return `/${filePath}`;
    }
  };

  const isNotDirectory = (message: string) => {
    return message.includes('no such file or directory');
  };

  const extractTargetFiles = async (basePath: string, extension: string) => {
    const fullPath = path.resolve(basePath);

    try {
      const files = await lib.directory.asyncRead(fullPath);
      return files.filter((file: string) => file.endsWith(extension));
    } catch (error) {
      if (error instanceof Error && !isNotDirectory(error.message)) {
        logger.error.custom(error.message);
      }

      return [];
    }
  };

  const updateAllowedRoutes = async (basePath: string, extension: string) => {
    const files = await extractTargetFiles(basePath, extension);

    return files.reduce((routes: Routes, file: string) => {
      const route = formatRoute(file, extension);
      routes[route] = path.resolve(basePath, file);

      return routes;
    }, allowedRoutes);
  };

  const pavement = async (extensions: string[]) => {
    if (!roadClosure.isOpen()) return;

    roadClosure.close();
    logger.info.updatingAllowedRoutes();

    for (const extension of extensions) {
      for (const basePath of extensionPaths[extension]) {
        allowedRoutes = await updateAllowedRoutes(basePath, extension);
      }
    }

    logger.info.allowedRoutesUpdated();
  };

  const ensurePassable = async () => {
    await pavement(Object.keys(extensionPaths));
  };

  return {
    pavement,
    ensurePassable,
  };
}
