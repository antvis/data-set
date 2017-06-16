const DataSet = require('../data-set');
const sortBy = require('lodash/sortBy');

DataSet.registerTransform('sort-by', (dataView, options = {}) => {
  sortBy(dataView.rows, options.columns);
});
