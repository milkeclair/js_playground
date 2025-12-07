import { IncomingMessage } from 'node:http';
import type { EnhancedRequest } from '../../type';

export function Parser({ req }: { req: IncomingMessage }) {
  const proxyProtocol = () => {
    const protocol = req.headers['x-forwarded-proto'];
    if (!protocol) return null;

    return Array.isArray(protocol) ? protocol[0] : protocol;
  };

  const protocol = (): string => {
    return proxyProtocol() ?? 'http';
  };

  const uri = (protocol: string) => {
    return new URL(req.url || '', `${protocol}://${req.headers.host ?? 'localhost'}`);
  };

  const parseBody = async (): Promise<void> => {
    if ('body' in req) return;

    return new Promise((resolve, reject) => {
      let body = '';
      req.on('data', (chunk) => {
        body += chunk.toString();
      });
      req.on('end', () => {
        if (body) {
          try {
            Object.assign(req, { body: JSON.parse(body) });
          } catch (e) {
            Object.assign(req, { body });
          }
        } else {
          Object.assign(req, { body: undefined });
        }

        resolve();
      });
      req.on('error', (err) => {
        reject(err);
      });
    });
  };

  const parseRequest = async (
    req: IncomingMessage,
    pathParams: Record<string, string> = {}
  ): Promise<EnhancedRequest> => {
    const query: Record<string, string> = {};

    uri(protocol()).searchParams.forEach((value, key) => {
      query[key] = value;
    });

    await parseBody();

    return Object.assign(req, { pathParams, query });
  };

  return {
    protocol: protocol(),
    uri: uri(protocol()),
    request: parseRequest,
    enhance: parseRequest,
  };
}
