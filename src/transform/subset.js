const DataSet = require('../data-set');

DataSet.registerTransform('pick', (dataView, options = {}) => {
  const startIndex = options.startRowIndex || 0;
  const endIndex = options.endRowIndex || dataView.rows.length;
  const columns = dataView.getColumnNames();
  dataView.rows = dataView.getSubset(startIndex, endIndex, columns);
});
