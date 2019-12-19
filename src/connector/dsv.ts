import { isString } from '@antv/util';
import { dsvFormat, csvParse, tsvParse } from 'd3-dsv';
import { DataSet } from '../data-set';

export interface Options {
  delimiter?: string;
}

DataSet.registerConnector('dsv', (str: string, options: Options = {}) => {
  const delimiter = options.delimiter || ',';
  if (!isString(delimiter)) {
    throw new TypeError('Invalid delimiter: must be a string!');
  }
  return dsvFormat(delimiter).parse(str);
});

DataSet.registerConnector('csv', (str: string) => {
  return csvParse(str);
});

DataSet.registerConnector('tsv', (str: string) => {
  return tsvParse(str);
});
