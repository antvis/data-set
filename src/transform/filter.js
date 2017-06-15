const filter = require('lodash/filter');
const DataSet = require('../data-set');
const Transform = require('./base');

function defaultCallback(row) {
  return !!row;
}

DataSet.registerConnector(
  'filter',
  new Transform({
    execute(dataView, options = {}) {
      dataView.rows = filter(dataView.rows, options.callback || defaultCallback);
    }
  })
);
