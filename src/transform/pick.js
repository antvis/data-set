const DataSet = require('../data-set');
const pick = require('lodash/pick');
const map = require('lodash/map');

DataSet.registerTransform('pick', (dataView, options = {}) => {
  const columns = options.columns || dataView.getColumnNames();
  dataView.rows = map(dataView.rows, row => pick(row, columns));
});
