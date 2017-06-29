const filter = require('lodash/filter');
const {
  registerTransform
} = require('../data-set');

/*
 * options: {
 *   type: 'filter',
 *   callback,
 * }
 */

function defaultCallback(row) {
  return !!row;
}

registerTransform('filter', (dataView, options = {}) => {
  dataView.rows = filter(dataView.rows, options.callback || defaultCallback);
});
