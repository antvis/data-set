const DataSet = require('../data-set');
const pick = require('lodash/pick');

DataSet.registerTransform('pick', (dataView, options = {}) => {
  dataView.rows = pick(dataView.rows, options.columns);
});
