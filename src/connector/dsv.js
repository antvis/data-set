const DataSet = require('../data-set');
const {
  dsvFormat,
  csvParse,
  tsvParse
} = require('d3-dsv');

DataSet.registerConnector('dsv', (str, options = {}) => {
  const delimiter = options.delimiter || ',';
  return dsvFormat(delimiter).parse(str);
});

DataSet.registerConnector('csv', str => {
  return csvParse(str);
});

DataSet.registerConnector('tsv', str => {
  return tsvParse(str);
});
