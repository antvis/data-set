const assign = require('lodash/assign');
const each = require('lodash/each');
const {
  registerTransform
} = require('../data-set');
const partition = require('../util/partition');

const DEFAULT_OPTIONS = {
  // field: '', // required
  as: '..proportion'
};

registerTransform('proportion', (dataView, options = {}) => {
  options = assign({}, DEFAULT_OPTIONS, options);
  const field = options.field;
  const as = options.as;
  if (!field) {
    throw new TypeError('Invalid options');
  }
  const rows = dataView.rows;
  const groups = partition(rows, [ field ]);
  const result = [];
  each(groups, group => {
    const first = group[0];
    const row = {};
    row[field] = first[field];
    row[as] = group.length / rows.length;
    result.push(row);
  });
  dataView.rows = result;
});
