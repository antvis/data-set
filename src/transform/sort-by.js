const DataSet = require('../data-set');
const sortBy = require('lodash/sortBy');

function transform(dataView, options = {}) {
  dataView.rows = sortBy(dataView.rows, options.columns || [ dataView.getColumnName(0) ]);
}
DataSet.registerTransform('sort-by', transform);
DataSet.registerTransform('sortBy', transform);
