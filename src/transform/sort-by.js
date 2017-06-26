const sortBy = require('lodash/sortBy');
const DataSet = require('../data-set');

/*
 * options: {
 *   type: 'sort-by',
 *   fields: [],
 * }
 */

function transform(dataView, options = {}) {
  dataView.rows = sortBy(dataView.rows, options.fields || [ dataView.getColumnName(0) ]);
}
DataSet.registerTransform('sort-by', transform);
DataSet.registerTransform('sortBy', transform);
