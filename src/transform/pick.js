const DataSet = require('../data-set');
const pick = require('lodash/pick');
const map = require('lodash/map');

/*
 * options: {
 *   type: 'pick',
 *   fields: [],
 * }
 */

DataSet.registerTransform('pick', (dataView, options = {}) => {
  const columns = options.fields || dataView.getColumnNames();
  dataView.rows = map(dataView.rows, row => pick(row, columns));
});
