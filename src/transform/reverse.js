const reverse = require('lodash/reverse');
const DataSet = require('../data-set');

/*
 * options: {
 *   type: 'reverse',
 * }
 */

DataSet.registerTransform('reverse', dataView => {
  dataView.rows = reverse(dataView.rows);
});

