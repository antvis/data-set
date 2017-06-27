const indexOf = require('lodash/indexOf');
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
  if (order && indexOf(VALID_ORDERS, order) === -1) {
    console.warn('Invalid order');
  } else if (order === 'DESC') {
    dataView.rows = reverse(dataView.rows);
  }
}
registerTransform('sort-by', transform);
registerTransform('sortBy', transform);
