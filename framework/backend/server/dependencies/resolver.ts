import type { ServerDependencies } from '../../server';

export function Resolver({ dependencies }: { dependencies: Partial<ServerDependencies> }) {
  const resolve = <T>(value: T | undefined, name: keyof ServerDependencies): T => {
    if (!value) {
      throw new Error(`Module "${name}" is not initialized.`);
    }
    return value;
  };

  return {
    get config() {
      return resolve(dependencies.config, 'config');
    },

    set config(value) {
      dependencies.config = value;
    },

    get fileRouter() {
      return resolve(dependencies.fileRouter, 'fileRouter');
    },

    set fileRouter(value) {
      dependencies.fileRouter = value;
    },

    get logger() {
      return resolve(dependencies.logger, 'logger');
    },

    set logger(value) {
      dependencies.logger = value;
    },

    get requestClassifier() {
      return resolve(dependencies.requestClassifier, 'requestClassifier');
    },

    set requestClassifier(value) {
      dependencies.requestClassifier = value;
    },

    get contentRenderer() {
      return resolve(dependencies.contentRenderer, 'contentRenderer');
    },

    set contentRenderer(value) {
      dependencies.contentRenderer = value;
    },

    get fileResponseHandler() {
      return resolve(dependencies.fileResponseHandler, 'fileResponseHandler');
    },

    set fileResponseHandler(value) {
      dependencies.fileResponseHandler = value;
    },

    get middlewareStack() {
      return resolve(dependencies.middlewareStack, 'middlewareStack');
    },

    set middlewareStack(value) {
      dependencies.middlewareStack = value;
    },

    get lib() {
      return resolve(dependencies.lib, 'lib');
    },

    set lib(value) {
      dependencies.lib = value;
    },
  };
}
