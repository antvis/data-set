const DataSet = require('../data-set');
const map = require('lodash/map');

function defaultCallback(row) {
  return row;
}

DataSet.registerTransform('map', (dataView, options = {}) => {
  dataView.rows = map(dataView.rows, options.callback || defaultCallback);
});
