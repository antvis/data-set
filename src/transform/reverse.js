const reverse = require('lodash/reverse');
const DataSet = require('../data-set');

DataSet.registerTransform('reverse', dataView => {
  dataView.rows = reverse(dataView.rows);
});

