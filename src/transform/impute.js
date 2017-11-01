const assign = require('lodash/assign');
const forIn = require('lodash/forIn');
const has = require('lodash/has');
const isFunction = require('lodash/isFunction');
const isUndefined = require('lodash/isUndefined');
const isString = require('lodash/isString');
const simpleStatistics = require('simple-statistics');
const partition = require('../util/partition');
const {
  registerTransform
} = require('../data-set');
const {
  getField
} = require('../util/option-parser');

const DEFAULT_OPTIONS = {
  // field: '', // required
  // method: 'value', // required
  // value: 10, // required if (method === 'value')
  groupBy: []
};

function notUndefinedValues(values) {
  return values.filter(value => !isUndefined(value));
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
  const field = getField(options);
  const method = options.method;
  const groupBy = options.groupBy;
  if (!method) {
    throw new TypeError('Invalid method!');
  }
  if ((method === 'value' && !has(options, 'value'))) {
    throw new TypeError('Invalid value: it is nil.');
  }
  const column = notUndefinedValues(dataView.getColumn(field));
  const groups = partition(rows, groupBy);
  forIn(groups, group => {
    let fieldValues = notUndefinedValues(group.map(row => row[field]));
    if (fieldValues.length === 0) {
      fieldValues = column;
    }
    group.forEach(row => {
      if (isUndefined(row[field])) {
        if (isFunction(method)) {
          row[field] = method(row, fieldValues, options.value, group);
        } else if (isString(method)) {
          row[field] = imputations[method](row, fieldValues, options.value);
        } else {
          throw new TypeError(`Invalid method: must be a function or one of ${STATISTICS_METHODS.join(', ')}`);
        }
      }
    });
  });
}

registerTransform('impute', transform);
