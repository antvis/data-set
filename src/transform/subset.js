const {
  registerTransform
} = require('../data-set');

/*
 * options: {
 *   type: 'subset',
 *   startRowIndex: 0,
 *   endRowIndex: 1,
 *   fields: [],
 * }
 */

registerTransform('subset', (dataView, options = {}) => {
  const startIndex = options.startRowIndex || 0;
  const endIndex = options.endRowIndex || dataView.rows.length - 1;
  const columns = options.fields || dataView.getColumnNames();
  dataView.rows = dataView.getSubset(startIndex, endIndex, columns);
});
