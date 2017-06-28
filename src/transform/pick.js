const pick = require('lodash/pick');
const map = require('lodash/map');
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
  dataView.rows = map(dataView.rows, row => pick(row, columns));
});
