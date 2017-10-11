const pick = require('lodash/pick');
const {
  registerTransform
} = require('../data-set');

/*
 * options: {
 *   type: 'pick',
 *   fields: [],
 * }
 */

registerTransform('pick', (dataView, options = {}) => {
  const columns = options.fields || dataView.getColumnNames();
  dataView.rows = dataView.rows.map(row => pick(row, columns));
});
