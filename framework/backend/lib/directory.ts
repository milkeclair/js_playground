import fs from 'node:fs';

export function Directory() {
  return {
    asyncRead: async (path: string): Promise<string[]> => {
      return fs.promises.readdir(path, { recursive: true });
    },
  };
}
