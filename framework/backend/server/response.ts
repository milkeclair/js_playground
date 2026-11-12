import type { ServerResponse } from 'http';
import type { EnhancedResponse } from '../type';
import type { ServerDependencies } from '../server';

export function Response({
  res,
  requestPath,
  dependencies,
}: {
  res: ServerResponse;
  requestPath: string;
  dependencies: ServerDependencies;
}): EnhancedResponse {
  let statusCode = 200;

  const resolveTemplatePath = (template: string | undefined) => {
    if (template) {
      return template.startsWith('/') ? template : `/${template}`;
    } else {
      const withoutEndSlashPath = requestPath.slice(0, -1);
      return requestPath.endsWith('/') ? withoutEndSlashPath : requestPath;
    }
  };

  const handleNotFound = ({ template }: { template: string }) => {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/html');
    const notFoundContent = dependencies.contentRenderer.render({
      url: '/404',
      data: { message: `View not found: ${template}` },
      loggable: true,
    });
    res.end(notFoundContent);
  };

  const enhanced: EnhancedResponse = Object.assign(res, {
    status(code: number): EnhancedResponse {
      statusCode = code;
      res.statusCode = code;
      return enhanced;
    },

    json(data: unknown): void {
      res.statusCode = statusCode;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(data));
    },

    html(content: string): void {
      res.statusCode = statusCode;
      res.setHeader('Content-Type', 'text/html');
      res.end(content);
    },

    text(content: string, type = 'text/plain'): void {
      res.statusCode = statusCode;
      res.setHeader('Content-Type', type);
      res.end(content);
    },

    render(options: { template?: string; params?: Record<string, unknown> } = {}): void {
      const { template, params = {} } = options;
      const templatePath = resolveTemplatePath(template);

      if (!dependencies.fileRouter.fileRoutes[templatePath]) {
        handleNotFound({ template: templatePath });
        return;
      }

      const content = dependencies.contentRenderer.render({
        url: templatePath,
        data: params,
        loggable: true,
      });
      res.statusCode = statusCode;
      res.setHeader('Content-Type', 'text/html');
      res.end(content);
    },
  });

  return enhanced;
}
