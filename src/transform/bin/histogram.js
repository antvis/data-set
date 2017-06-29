const assign = require('lodash/assign');
const each = require('lodash/each');
const {
  histogram
} = require('d3-array');
const {
  registerTransform
} = require('../../data-set');

const DEFAULT_OPTIONS = {
  as: 'x'
  // field: '', // required
  // domain: [/* min, max */],
  // thresholds: [/* min, max */],
  // TODO step?
};

function transform(dataView, options) {
  const histogramGenerator = histogram();
  options = assign({}, DEFAULT_OPTIONS, options);
  const field = options.field;
  const domain = options.domain;
  const thresholds = options.thresholds;
  if (!field) {
    throw new TypeError('Invalid option: field');
  }
  const rows = dataView.rows;
  const column = dataView.getColumn(field);
  if (domain) {
    histogramGenerator.domain(domain);
  }
  if (thresholds) {
    histogramGenerator.thresholds(thresholds);
  }
  const binByValue = {};
  each(histogramGenerator(column), bin => {
    each(bin, value => {
      const currentBin = binByValue[value] = {};
      currentBin[options.as] = [ bin.x0, bin.x1 ];
    });
  });
  each(rows, row => {
    const bin = binByValue[row[field]];
    assign(row, bin);
  });
}

registerTransform('bin.histogram', transform);
registerTransform('bin.dot', transform);
