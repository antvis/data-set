const pick = require('lodash/pick');
const {
  registerTransform
} = require('../data-set');
const {
  getFields
} = require('../util/option-parser');

/*
 * options: {
 *   type: 'pick',
 *   fields: [],
 * }
 */

registerTransform('pick', (dataView, options = {}) => {
  const columns = getFields(options, dataView.getColumnNames());
  dataView.rows = dataView.rows.map(row => pick(row, columns));
});
