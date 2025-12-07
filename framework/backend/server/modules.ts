import { Config } from '../config';
import { Router } from '../router';
import { Controller } from '../controller';
import { Renderer } from '../renderer';
import { Middleware } from '../middleware';
import { Logger } from '../logger';
import { Sorter } from '../router/sorter';
import { Lib } from '../lib';
import { Lazy } from './lazy';
import { Resolver } from './modules/resolver';
import type { ServerOptions, Modules } from '../server';

export function Modules(options: ServerOptions = {}): Modules {
  const _modules: Partial<Modules> = {};
  const modules = Resolver({ modules: _modules });
  const lazy = Lazy(modules);

  modules.lib = Lib();
  modules.logger = Logger({ config: lazy.config, lib: modules.lib });
  modules.sorter = Sorter({ router: lazy.router });

  modules.renderer = Renderer({
    server: lazy.server,
    router: lazy.router,
    logger: lazy.logger,
    lib: modules.lib,
  });

  modules.controller = Controller({
    renderer: lazy.renderer,
    logger: lazy.logger,
  });

  modules.router = Router({
    controller: lazy.controller,
    logger: lazy.logger,
    sorter: lazy.sorter,
    lib: modules.lib,
  });

  modules.config = Config({
    router: lazy.router,
    configs: {
      host: options.host,
      port: options.port,
      root: options.root,
      allowed: options.allowed,
    },
  });

  modules.middleware = Middleware();

  return modules;
}
