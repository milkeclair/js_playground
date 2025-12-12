import { Journey } from './journey';
import type { ServerOptions } from './server';

export function Config({
  journey,
  configs = {},
}: {
  journey: ReturnType<typeof Journey>;
  configs?: ServerOptions;
}) {
  const host = configs.host || 'localhost';
  const port = configs.port || 3000;
  const root = configs.root || new URL('.', import.meta.url).pathname;
  const allowed = {
    origins: configs.allowed?.origins || ['http://localhost:3000'],
    ips: configs.allowed?.ips || ['::1', '127.0.0.1'],
    methods: configs.allowed?.methods || ['GET', 'POST', 'PUT', 'DELETE'],
  };
  const routingType = configs.routingType || 'hybrid';

  journey.drawMap({
    routes: {
      '/favicon.ico': `${root}assets/favicon.ico`,
      '/404': `${root}view/404.ejs`,
    },
    extensions: {
      '.html': [`${root}view/`],
      '.ejs': [`${root}view/`],
      '.css': [`${root}assets/css/`],
      '.scss': [`${root}assets/css/`],
      '.js': [`${root}assets/script/`],
      '.js.map': [`${root}assets/script/`],
    },
  });

  return {
    host,
    port,
    root,
    routingType,
    allowed,
  };
}
