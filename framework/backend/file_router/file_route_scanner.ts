import path from 'node:path';
import { Logger } from '../logger';
import { Lib } from '../lib';
import type { Routes } from '../file_router';
import { RefreshThrottle } from './refresh_throttle';

export function FileRouteScanner({
  logger,
  lib,
  fileRoutes,
  extensionPaths,
}: {
  logger: ReturnType<typeof Logger>;
  lib: ReturnType<typeof Lib>;
  fileRoutes: Routes;
  extensionPaths: Record<string, string[]>;
}) {
  const refreshThrottle = RefreshThrottle();

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

  const updateFileRoutes = async (basePath: string, extension: string) => {
    const files = await extractTargetFiles(basePath, extension);

    return files.reduce((routes: Routes, file: string) => {
      const route = formatRoute(file, extension);
      routes[route] = path.resolve(basePath, file);

      return routes;
    }, fileRoutes);
  };

  const refreshIfNeeded = async (extensions: string[]) => {
    if (!refreshThrottle.shouldRefresh()) return;

    refreshThrottle.markRefreshed();
    logger.info.updatingFileRoutes();

    for (const extension of extensions) {
      for (const basePath of extensionPaths[extension]) {
        fileRoutes = await updateFileRoutes(basePath, extension);
      }
    }

    logger.info.fileRoutesUpdated();
  };

  const refreshRoutesIfNeeded = async () => {
    await refreshIfNeeded(Object.keys(extensionPaths));
  };

  return {
    refreshIfNeeded,
    refreshRoutesIfNeeded,
  };
}
