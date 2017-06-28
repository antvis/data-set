const assign = require('lodash/assign');
const each = require('lodash/each');
const {
  sum
} = require('simple-statistics');
const {
  registerTransform
} = require('../data-set');

const DEFAULT_OPTIONS = {
  // field: '', // required
  as: '..percent'
};

registerTransform('percent', (dataView, options = {}) => {
  options = assign({}, DEFAULT_OPTIONS, options);
  const field = options.field;
  const as = options.as;
  if (!field) {
    throw new TypeError('Invalid options');
  }
  const rows = dataView.rows;
  const column = dataView.getColumn(field);
  const total = sum(column);
  each(rows, row => {
    row[as] = row[field] / total;
  });
});
