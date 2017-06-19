const assign = require('lodash/assign');
const difference = require('lodash/difference');
const each = require('lodash/each');
const isArray = require('lodash/isArray');
const pick = require('lodash/pick');
const DataSet = require('../data-set');

const DEFAULT_OPTIONS = {
  fields: [],
  retains: [],
  key: 'key',
  value: 'value'
};

DataSet.registerTransform('fold', (dataView, options) => {
  const columns = dataView.getColumnNames();
  options = assign({}, DEFAULT_OPTIONS, options);
  let fields = options.fields;
  if (!isArray(fields)) {
    throw new TypeError('Invalid option `fields`: expected an array.');
  }
  if (fields.length === 0) {
    fields = columns;
  }
  const key = options.key;
  const value = options.value;
  let retains = options.retains;
  if (retains.length === 0) {
    retains = difference(columns, fields);
  }
  const resultRows = [];
  each(dataView.rows, row => {
    each(fields, field => {
      const resultRow = pick(row, retains);
      resultRow[key] = field;
      resultRow[value] = row[field];
      resultRows.push(resultRow);
    });
  });
  dataView.rows = resultRows;
});
