import { Config } from '../config';
import { Journey } from '../journey';
import { TrafficOfficer } from '../traffic_officer';
import { Renderer } from '../renderer';
import { Suitcase } from '../suitcase';
import { Logger } from '../logger';
import { Inspector } from '../journey/inspector';
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
  modules.inspector = Inspector({ journey: lazy.journey });
  modules.renderer = Renderer({
    server: lazy.server,
    journey: lazy.journey,
    logger: lazy.logger,
    lib: modules.lib,
  });

  modules.trafficOfficer = TrafficOfficer({
    renderer: lazy.renderer,
    logger: lazy.logger,
  });

  modules.journey = Journey({
    trafficOfficer: lazy.trafficOfficer,
    logger: lazy.logger,
    inspector: lazy.inspector,
    lib: modules.lib,
  });

  modules.config = Config({
    journey: lazy.journey,
    configs: {
      host: options.host,
      port: options.port,
      root: options.root,
      allowed: options.allowed,
      routingType: options.routingType,
    },
  });

  modules.suitcase = Suitcase();

  return modules;
}
