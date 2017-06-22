const assign = require('lodash/assign');
const each = require('lodash/each');
const forIn = require('lodash/forIn');
const isArray = require('lodash/isArray');
const keys = require('lodash/keys');
const map = require('lodash/map');
const uniq = require('lodash/uniq');
const simpleStatistics = require('simple-statistics');
const DataSet = require('../data-set');
const partition = require('../util/partition');

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
    const values = uniq(map(data, row => row[field]));
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
each(STATISTICS_METHODS, method => {
  aggregates[method] = (data, field) => {
    const values = map(data, row => row[field]);
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
  if (!isArray(operations) || !operations.length) {
    operations = [ DEFAULT_OPERATION ];
    outputNames = operations;
  }
  const groups = partition(rows, dims);
  const results = [];
  forIn(groups, group => {
    const result = {};
    each(operations, (operation, i) => {
      const outputName = outputNames[i];
      const field = fields[i];
      result[outputName] = aggregates[operation](group, field);
    });
    results.push(result);
  });
  dataView.rows = results;
}

DataSet.registerTransform('aggregate', transform);
// alias
DataSet.registerTransform('summary', transform);

DataSet.VALID_AGGREGATES = keys(aggregates);
