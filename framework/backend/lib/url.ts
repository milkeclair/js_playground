import { MIME_TYPES } from '../traffic_officer';

export function Url() {
  return {
    hasExtension: (urlPath: string) => {
      const ext = urlPath.split('.').pop() || '';
      return ext in MIME_TYPES;
    },

    removeExtension: (urlPath: string) => {
      return urlPath.split('.').shift() || '';
    },

    extractEnd: (urlPath: string) => {
      return urlPath.split('/').pop() || '';
    },
  };
}
