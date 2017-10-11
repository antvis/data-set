const reverse = require('lodash/reverse');
const sortBy = require('lodash/sortBy');
const {
  registerTransform
} = require('../data-set');

/*
 * options: {
 *   type: 'sort-by',
 *   fields: [],
 *   order: 'ASC' // 'DESC'
 * }
 */

const VALID_ORDERS = [ 'ASC', 'DESC' ];

function transform(dataView, options = {}) {
  dataView.rows = sortBy(dataView.rows, options.fields || [ dataView.getColumnName(0) ]);
  const order = options.order;
  if (order && VALID_ORDERS.indexOf(order) === -1) {
    throw new TypeError(`Invalid order: ${order} must be one of ${VALID_ORDERS.join(',')}`);
  } else if (order === 'DESC') {
    dataView.rows = reverse(dataView.rows);
  }
}
registerTransform('sort-by', transform);
registerTransform('sortBy', transform);
