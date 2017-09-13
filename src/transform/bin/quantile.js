const assign = require('lodash/assign');
const forIn = require('lodash/forIn');
const isArray = require('lodash/isArray');
const map = require('lodash/map');
// const pick = require('lodash/pick');
const {
  quantile
} = require('simple-statistics');
const {
  registerTransform
} = require('../../data-set');
const partition = require('../../util/partition');
const pByFraction = require('../../util/p-by-fraction');

const DEFAULT_OPTIONS = {
  as: '_bin',
  groupBy: [], // optional
  fraction: 4 // default
  // p: [0.5, 0.3], // array of p parameter
  // field: 'y', // required
};

function transform(dataView, options) {
  options = assign({}, DEFAULT_OPTIONS, options);
  const field = options.field;
  if (!field) {
    throw new TypeError('Invalid option: field');
  }
  let pArray = options.p;
  const fraction = options.fraction;
  if (!isArray(pArray) || pArray.length === 0) {
    pArray = pByFraction(fraction);
  }
  const rows = dataView.rows;
  const groupBy = options.groupBy;
  const groups = partition(rows, groupBy);
  const result = [];
  forIn(groups, group => {
    // const resultRow = pick(group[0], groupBy);
    const resultRow = group[0];
    const binningColumn = map(group, row => row[field]);
    const quantiles = map(pArray, p => quantile(binningColumn, p));
    resultRow[options.as] = quantiles;
    result.push(resultRow);
  });
  dataView.rows = result;
}

registerTransform('bin.quantile', transform);
