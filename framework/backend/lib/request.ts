import type { IncomingMessage } from 'node:http';

export function Request() {
  return {
    extractIpAddress: (req: IncomingMessage) => {
      const forwarded = req.headers['x-forwarded-for'];

      if (typeof forwarded === 'string') {
        return forwarded;
      } else if (Array.isArray(forwarded)) {
        return forwarded[0];
      } else {
        return req.socket?.remoteAddress || null;
      }
    },
  };
}
