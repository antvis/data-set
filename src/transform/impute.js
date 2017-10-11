const assign = require('lodash/assign');
const forIn = require('lodash/forIn');
const has = require('lodash/has');
const isFunction = require('lodash/isFunction');
const isNil = require('lodash/isNil');
const simpleStatistics = require('simple-statistics');
const partition = require('../util/partition');
const {
  registerTransform
} = require('../data-set');

const DEFAULT_OPTIONS = {
  // field: '', // required
  // method: 'value', // required
  // value: 10, // required if (method === 'value')
  groupBy: []
};

function notNilValues(values) {
  return values.filter(value => !isNil(value));
}

const STATISTICS_METHODS = [
  'mean',
  'median',
  'max',
  'min'
];
const imputations = {};
STATISTICS_METHODS.forEach(method => {
  imputations[method] = (row, values) => simpleStatistics[method](values);
});
imputations.value = (row, values, value) => value;

function transform(dataView, options = {}) {
  const rows = dataView.rows;
  options = assign({}, DEFAULT_OPTIONS, options);
  const field = options.field;
  const method = options.method;
  const groupBy = options.groupBy;
  if (!field || !method || (method === 'value' && !has(options, 'value'))) {
    throw new TypeError('Invalid options');
  }
  const column = notNilValues(dataView.getColumn(field));
  const groups = partition(rows, groupBy);
  forIn(groups, group => {
    let fieldValues = notNilValues(group.map(row => row[field]));
    if (fieldValues.length === 0) {
      fieldValues = column;
    }
    group.forEach(row => {
      if (isNil(row[field])) {
        if (isFunction(method)) {
          row[field] = method(row, fieldValues, options.value, group);
        } else {
          row[field] = imputations[method](row, fieldValues, options.value);
        }
      }
    });
  });
}

registerTransform('impute', transform);
