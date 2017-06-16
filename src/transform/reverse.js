const reverse = require('lodash/reverse');
const DataSet = require('../data-set');

DataSet.registerTransform('pick', dataView => {
  dataView.rows = reverse(dataView.rows);
});

