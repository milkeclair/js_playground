import { Url } from './lib/url';
import { Directory } from './lib/directory';
import { File } from './lib/file';
import { RequestUtils } from './lib/request_utils';

export function Lib() {
  return {
    url: Url(),
    directory: Directory(),
    file: File(),
    request: RequestUtils(),
  };
}
