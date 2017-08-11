const isString = require('lodash/isString');
const cloneItems = require('../util/clone-items');
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
  return cloneItems(dataView.rows);
});
