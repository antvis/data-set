const assign = require('lodash/assign');
const forIn = require('lodash/forIn');
const keys = require('lodash/keys');
// const pick = require('lodash/pick');
const uniq = require('lodash/uniq');
const simpleStatistics = require('simple-statistics');
const partition = require('../util/partition');
const {
  registerTransform
} = require('../data-set');

const DEFAULT_OPTIONS = {
  as: [],
  fields: [],
  groupBy: [],
  operations: []
};
const DEFAULT_OPERATION = 'count';

const aggregates = {
  count(data) {
    return data.length;
  },
  distinct(data, field) {
    const values = uniq(data.map(row => row[field]));
    return values.length;
  }
};
const STATISTICS_METHODS = [
  'max',
  'mean', // alias: average
  'median',
  'min',
  'mode',
  'product',
  'standardDeviation',
  'sum',
  'sumSimple',
  'variance'
];
STATISTICS_METHODS.forEach(method => {
  aggregates[method] = (data, field) => {
    const values = data.map(row => row[field]);
    return simpleStatistics[method](values);
  };
});
aggregates.average = aggregates.mean;

function transform(dataView, options) {
  options = assign({}, DEFAULT_OPTIONS, options);
  const rows = dataView.rows;
  const dims = options.groupBy;
  const fields = options.fields;
  let outputNames = options.as || [];
  let operations = options.operations;
  if (!Array.isArray(operations) || !operations.length) {
    console.warn('operations is not defined, will use [ "count" ] directly.');
    operations = [ DEFAULT_OPERATION ];
    outputNames = operations;
  }
  const groups = partition(rows, dims);
  const results = [];
  forIn(groups, group => {
    // const result = pick(group[0], dims);
    const result = group[0];
    operations.forEach((operation, i) => {
      const outputName = outputNames[i];
      const field = fields[i];
      result[outputName] = aggregates[operation](group, field);
    });
    results.push(result);
  });
  dataView.rows = results;
}

registerTransform('aggregate', transform);
registerTransform('summary', transform);

module.exports = {
  VALID_AGGREGATES: keys(aggregates)
};
