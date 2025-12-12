import type { RouteDefinition } from './type';
import { Modules } from './server/modules';
import { Engine } from './server/engine';
import { Registrar } from './server/registrar';
import { Stock } from './suitcase/stock';
import { Config } from './config';
import { Journey } from './journey';
import { TrafficOfficer } from './traffic_officer';
import { Renderer } from './renderer';
import { Suitcase } from './suitcase';
import { Logger } from './logger';
import { Inspector } from './journey/inspector';
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
  inspector: ReturnType<typeof Inspector>;
  renderer: ReturnType<typeof Renderer>;
  trafficOfficer: ReturnType<typeof TrafficOfficer>;
  suitcase: ReturnType<typeof Suitcase>;
  lib: ReturnType<typeof Lib>;
};

export function Server(options: ServerOptions = {}) {
  const customRoutes: RouteDefinition[] = [];

  const modules = Modules(options);
  const engine = Engine({ modules, customRoutes });
  const registrar = Registrar({ customRoutes });
  const stock = Stock();

  modules.suitcase.put(stock.cors({ config: modules.config, lib: modules.lib }));
  modules.suitcase.put(stock.methods({ config: modules.config }));
  modules.suitcase.put(stock.type());

  return {
    start: engine.start,
    modules,
    use: modules.suitcase.put,
    ...registrar,
  };
}
