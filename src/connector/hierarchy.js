const {
  hierarchy
} = require('d3-hierarchy');
const {
  HIERARCHY,
  registerConnector
} = require('../data-set');

/*
 * options: {
 *   children(d) { // optional
 *     return d.children
 *   },
 * }
 */

function connector(data, options, dataView) {
  dataView.dataType = HIERARCHY;
  const children = options && options.children ? options.children : null;

  dataView.rows = dataView.root = hierarchy(data, children);
  return data;
}

registerConnector('hierarchy', connector);
registerConnector('tree', connector);
