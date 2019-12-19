import { readFileSync } from 'fs';
import { resolve } from 'path';

export default (pathname: string): string => {
  return readFileSync(resolve(process.cwd(), pathname), 'utf8');
};
