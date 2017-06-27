const DataSet = require('../data-set');
const map = require('lodash/map');

/*
 * options: {
 *   type: 'map',
 *   callback,
 * }
 */

function defaultCallback(row) {
  return row;
}

DataSet.registerTransform('map', (dataView, options = {}) => {
  dataView.rows = map(dataView.rows, options.callback || defaultCallback);
});
