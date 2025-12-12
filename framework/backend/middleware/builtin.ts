import type { EnhancedRequest, EnhancedResponse } from '../type';
import { Config } from '../config';
import { Lib } from '../lib';
import { MIME_TYPES } from '../traffic_officer';

export function Builtin() {
  return {
    cors: ({ config, lib }: { config: ReturnType<typeof Config>; lib: ReturnType<typeof Lib> }) => {
      return ({ req, res }: { req: EnhancedRequest; res: EnhancedResponse }): void => {
        const origin = req.headers.origin;
        const ip = lib.request.extractIpAddress(req);

        if (origin && config.allowed.origins.includes(origin)) {
          res.setHeader('Access-Control-Allow-Origin', origin);
        } else if (ip && config.allowed.ips.includes(ip)) {
          res.setHeader('Access-Control-Allow-Origin', '*');
        }
      };
    },

    methods: ({ config }: { config: ReturnType<typeof Config> }) => {
      return ({ res }: { res: EnhancedResponse }): void => {
        res.setHeader('Access-Control-Allow-Methods', config.allowed.methods.join(','));
      };
    },

    type: () => {
      return ({ res, type }: { res: EnhancedResponse; type?: keyof typeof MIME_TYPES }): void => {
        if (type && MIME_TYPES[type]) {
          res.setHeader('Content-Type', MIME_TYPES[type]);
        }
      };
    },
  };
}
