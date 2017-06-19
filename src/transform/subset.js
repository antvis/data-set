const DataSet = require('../data-set');

DataSet.registerTransform('subset', (dataView, options = {}) => {
  const startIndex = options.startRowIndex || 0;
  const endIndex = options.endRowIndex || dataView.rows.length - 1;
  const columns = options.columns || dataView.getColumnNames();
  dataView.rows = dataView.getSubset(startIndex, endIndex, columns);
});
