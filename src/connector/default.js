const isString = require('lodash/isString');
const cloneDeep = require('lodash/cloneDeep');
const {
  registerConnector
} = require('../data-set');

registerConnector('default', (dataView, dataSet) => {
  if (isString(dataView)) {
    dataView = dataSet.getView(dataView);
  }
  if (!dataView) {
    throw new TypeError('Invalid dataView');
  }
  return cloneDeep(dataView.rows);
});
