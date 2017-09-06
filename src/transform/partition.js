const assign = require('lodash/assign');
const {
  registerTransform
} = require('../data-set');
const partition = require('../util/partition');

const DEFAULT_OPTIONS = {
  groupBy: [], // optional
  orderBy: []
};

function transform(dataView, options = {}) {
  options = assign({}, DEFAULT_OPTIONS, options);
  dataView.rows = partition(dataView.rows, options.groupBy, options.orderBy);
}

registerTransform('partition', transform);
registerTransform('group', transform);
