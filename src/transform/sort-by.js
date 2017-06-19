const DataSet = require('../data-set');
const sortBy = require('lodash/sortBy');

DataSet.registerTransform('sort-by', (dataView, options = {}) => {
  dataView.rows = sortBy(dataView.rows, options.columns || [ dataView.getColumnName(0) ]);
});
