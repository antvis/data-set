import DataSet from '../data-set';
import Connector from './base';
import {
  dsvFormat,
  csvParse,
  tsvParse
} from 'd3-dsv';

DataSet.registerConnector('dsv', new Connector({
  parse(str, options = {}) {
    const delimiter = options.delimiter || ',';
    return dsvFormat(delimiter).parse(str);
  }
}));

DataSet.registerConnector('csv', new Connector({
  parse(str) {
    return csvParse(str);
  }
}));

DataSet.registerConnector('tsv', new Connector({
  parse(str) {
    return tsvParse(str);
  }
}));
