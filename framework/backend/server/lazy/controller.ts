import { Modules } from '../../server';

export function LazyController(modules: Modules) {
  return {
    action: modules.controller?.action,
  };
}
