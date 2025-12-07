import fs from 'node:fs';

export function File() {
  return {
    read: (path: string): string => {
      return fs.readFileSync(path, 'utf-8');
    },
  };
}
