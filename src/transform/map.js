const map = require('lodash/map');
const {
  registerTransform
} = require('../data-set');

/*
 * options: {
 *   type: 'map',
 *   callback,
 * }
 */

function defaultCallback(row) {
  return row;
}

registerTransform('map', (dataView, options = {}) => {
  dataView.rows = map(dataView.rows, options.callback || defaultCallback);
});
