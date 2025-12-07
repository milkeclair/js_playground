import { Url } from './lib/url';
import { Directory } from './lib/directory';
import { File } from './lib/file';
import { Request } from './lib/request';

export function Lib() {
  return {
    url: Url(),
    directory: Directory(),
    file: File(),
    request: Request(),
  };
}
