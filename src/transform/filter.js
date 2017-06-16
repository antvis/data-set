const filter = require('lodash/filter');
const DataSet = require('../data-set');

function defaultCallback(row) {
  return !!row;
}

DataSet.registerTransform('filter', (dataView, options = {}) => {
  dataView.rows = filter(dataView.rows, options.callback || defaultCallback);
});
