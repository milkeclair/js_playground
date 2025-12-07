import ejs from 'ejs';
import { Router } from './router';
import { Logger } from './logger';
import { Lib } from './lib';

export function Renderer({
  server,
  router,
  logger,
  lib,
}: {
  server: { config: { root: string } };
  router: ReturnType<typeof Router>;
  logger: ReturnType<typeof Logger>;
  lib: ReturnType<typeof Lib>;
}) {
  const renderView = ({
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

      const content = lib.file.read(router.allowedRoutes['/404']);
      return ejs.render(content, { ...viewData, filename: router.allowedRoutes['/404'] });
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
    const path = router.allowedRoutes[url];
    const content = renderView({ url, path, data, loggable });
    if (loggable) logger.info.rendered(url);

    return content;
  };

  const isNotFoundView = (view: string): boolean => {
    return view.includes('<title>404</title>');
  };

  return { render, isNotFoundView };
}
