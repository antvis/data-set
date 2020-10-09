import { isString } from '@antv/util';
import { dsvFormat, csvParse, tsvParse } from 'd3-dsv';

export interface Options {
  delimiter?: string;
}

function dsvConnector(str: string, options: Options = {}): any {
  const delimiter = options.delimiter || ',';
  if (!isString(delimiter)) {
    throw new TypeError('Invalid delimiter: must be a string!');
  }
  return dsvFormat(delimiter).parse(str);
}

function csvConnector(str: string): any {
  return csvParse(str);
}

function tsvConnector(str: string): any {
  return tsvParse(str);
}

export { dsvConnector, csvConnector, tsvConnector };
