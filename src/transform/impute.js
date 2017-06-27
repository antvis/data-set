const assign = require('lodash/assign');
const partition = require('../util/partition');
const {
  registerTransform
} = require('../data-set');

const DEFAULT_OPTIONS = {
  // field: '', // required
  groupBy: []
};

function transform(dataView, options = {}) {
  options = assign({}, DEFAULT_OPTIONS, options);
  const rows = dataView.rows;
  const groupBy = options.groupBy;
  const groups = partition(rows, groupBy);
  console.log(groups);
}

registerTransform('impute', transform);
