import type { RouteDefinition } from './type';
import { Modules } from './server/modules';
import { Engine } from './server/engine';
import { Registrar } from './server/registrar';
import { Builtin } from './middleware/builtin';
import { Config } from './config';
import { Journey } from './journey';
import { Controller } from './controller';
import { Renderer } from './renderer';
import { Middleware } from './middleware';
import { Logger } from './logger';
import { Sorter } from './journey/sorter';
import { Lib } from './lib';

export type ServerOptions = {
  host?: string;
  port?: number;
  root?: string;
  allowed?: {
    origins?: string[];
    ips?: string[];
    methods?: string[];
  };
  routingType?: 'definitive' | 'filebase' | 'hybrid';
};

export type Modules = {
  config: ReturnType<typeof Config>;
  journey: ReturnType<typeof Journey>;
  logger: ReturnType<typeof Logger>;
  sorter: ReturnType<typeof Sorter>;
  renderer: ReturnType<typeof Renderer>;
  controller: ReturnType<typeof Controller>;
  middleware: ReturnType<typeof Middleware>;
  lib: ReturnType<typeof Lib>;
};

export function Server(options: ServerOptions = {}) {
  const customRoutes: RouteDefinition[] = [];

  const modules = Modules(options);
  const engine = Engine({ modules, customRoutes });
  const registrar = Registrar({ customRoutes });
  const builtin = Builtin();

  modules.middleware.use(builtin.cors({ config: modules.config, lib: modules.lib }));
  modules.middleware.use(builtin.methods({ config: modules.config }));
  modules.middleware.use(builtin.type());

  return {
    start: engine.start,
    modules,
    use: modules.middleware.use,
    ...registrar,
  };
}
