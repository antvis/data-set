const {
  registerConnector
} = require('../data-set');
const {
  dsvFormat,
  csvParse,
  tsvParse
} = require('d3-dsv');

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
