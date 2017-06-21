const sortBy = require('lodash/sortBy');
const DataSet = require('../data-set');

function transform(dataView, options = {}) {
  dataView.rows = sortBy(dataView.rows, options.columns || [ dataView.getColumnName(0) ]);
}
DataSet.registerTransform('sort-by', transform);
DataSet.registerTransform('sortBy', transform);
