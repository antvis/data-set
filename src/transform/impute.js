const assign = require('lodash/assign');
const each = require('lodash/each');
const filter = require('lodash/filter');
const has = require('lodash/has');
const isFunction = require('lodash/isFunction');
const isNil = require('lodash/isNil');
const map = require('lodash/map');
const simpleStatistics = require('simple-statistics');
const partition = require('../util/partition');
const {
  registerTransform
} = require('../data-set');

const DEFAULT_OPTIONS = {
  // field: '', // required
  // method: 'value', // required
  // value: 10, // required when method === 'value'
  groupBy: []
};

function notNilValues(values) {
  return filter(values, value => !isNil(value));
}

const STATISTICS_METHODS = [
  'mean',
  'median',
  'max',
  'min'
];
const imputations = {};
each(STATISTICS_METHODS, method => {
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
  each(groups, group => {
    let fieldValues = notNilValues(map(group, row => row[field]));
    if (fieldValues.length === 0) {
      fieldValues = column;
    }
    each(group, row => {
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
