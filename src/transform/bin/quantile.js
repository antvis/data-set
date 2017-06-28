const assign = require('lodash/assign');
const isArray = require('lodash/isArray');
const each = require('lodash/each');
const map = require('lodash/map');
const {
  histogram
} = require('d3-array');
const {
  quantile
} = require('simple-statistics');
const {
  registerTransform
} = require('../../data-set');
const partition = require('../../util/partition');
const pByFraction = require('../../util/p-by-fraction');

const DEFAULT_OPTIONS = {
  as: [ '_x', '_y' ],
  fraction: 4 // default
  // fields: ['x', 'y'], // required
  // domain: [/* min, max */],
  // thresholds: [/* min, max */],
  // TODO step?
};

function transform(dataView, options) {
  const histogramGenerator = histogram();
  options = assign({}, DEFAULT_OPTIONS, options);
  const fields = options.fields;
  if (!isArray(fields) || fields.length !== 2) {
    throw new TypeError('Invalid option: fields');
  }
  const groupingField = fields[0];
  const binningField = fields[1];
  const as = options.as;
  if (!isArray(as) || as.length !== 2) {
    throw new TypeError('Invalid option: as');
  }
  const groupingAs = as[0];
  const binningAs = as[1];
  const domain = options.domain;
  if (domain) {
    histogramGenerator.domain(domain);
  }
  const thresholds = options.thresholds;
  if (thresholds) {
    histogramGenerator.thresholds(thresholds);
  }
  const rows = dataView.rows;
  const column = dataView.getColumn(groupingField);
  const binByValue = {};
  each(histogramGenerator(column), bin => {
    each(bin, value => {
      const currentBin = binByValue[value] = {};
      currentBin[groupingAs] = (bin.x1 + bin.x0) / 2;
    });
  });
  each(rows, row => {
    const bin = binByValue[row[groupingField]];
    assign(row, bin);
  });
  // dealing with second dimension
  let pArray = options.p;
  const fraction = options.fraction;
  if (!isArray(pArray) || pArray.length === 0) {
    pArray = pByFraction(fraction);
  }
  const groups = partition(rows, [ groupingAs ]);
  each(groups, group => {
    const binningColumn = map(group, row => row[binningField]);
    const quantiles = map(pArray, p => quantile(binningColumn, p));
    each(group, row => {
      row[binningAs] = quantiles;
    });
  });
}

registerTransform('bin.quantile', transform);
