const {
  dsvFormat,
  csvParse,
  tsvParse
} = require('d3-dsv');
const {
  registerConnector
} = require('../data-set');

registerConnector('dsv', (str, options = {}) => {
  const delimiter = options.delimiter || ',';
  return dsvFormat(delimiter).parse(str);
});

registerConnector('csv', str => {
  return csvParse(str);
});

registerConnector('tsv', str => {
  return tsvParse(str);
});
