import ejs from 'ejs';
import { FileRouter } from './file_router';
import { Logger } from './logger';
import { Lib } from './lib';

export function ContentRenderer({
  server,
  fileRouter,
  logger,
  lib,
}: {
  server: { config: { root: string } };
  fileRouter: ReturnType<typeof FileRouter>;
  logger: ReturnType<typeof Logger>;
  lib: ReturnType<typeof Lib>;
}) {
  const renderFile = ({
    url,
    path,
    data,
    loggable,
  }: {
    url: string;
    path: string;
    data: Record<string, unknown>;
    loggable: boolean;
  }): string => {
    const viewData = {
      ...data,
      root: server.config.root,
      message: (data.message as string) || '',
    };

    try {
      if (loggable) logger.info.rendering(url);
      const content = lib.file.read(path);

      if (path.endsWith('.ejs')) return ejs.render(content, { ...viewData, filename: path });
      return content;
    } catch {
      if (loggable) logger.error.cannotRender(url);

      const content = lib.file.read(fileRouter.fileRoutes['/404']);
      return ejs.render(content, { ...viewData, filename: fileRouter.fileRoutes['/404'] });
    }
  };

  const render = ({
    url,
    data = {},
    loggable = false,
  }: {
    url: string;
    data?: Record<string, unknown>;
    loggable?: boolean;
  }): string => {
    const path = fileRouter.fileRoutes[url];
    const content = renderFile({ url, path, data, loggable });
    if (loggable) logger.info.rendered(url);

    return content;
  };

  const isNotFoundContent = (content: string): boolean => {
    return content.includes('<title>404</title>');
  };

  return { render, isNotFoundContent };
}
