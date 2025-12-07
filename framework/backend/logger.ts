import { BaseLogger } from './logger/base';
import { Config } from './config';
import { Lib } from './lib';
import { InfoLogger } from './logger/info';
import { WarnLogger } from './logger/warn';
import { ErrorLogger } from './logger/error';

export function Logger({
  config,
  lib,
}: {
  config: ReturnType<typeof Config>;
  lib: ReturnType<typeof Lib>;
}) {
  const logger = BaseLogger();

  return {
    info: InfoLogger({ logger, config, lib }),
    warn: WarnLogger({ logger }),
    error: ErrorLogger({ logger }),
  };
}
