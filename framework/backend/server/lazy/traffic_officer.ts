import { Modules } from '../../server';

export function LazyTrafficOfficer(modules: Modules) {
  return {
    action: modules.trafficOfficer?.action,
  };
}
