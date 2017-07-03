const {
  hierarchy
} = require('d3-hierarchy');
const {
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
  dataView.dataType = 'hierarchy';
  const children = options && options.children ? options.children : null;

  dataView.root = hierarchy(data, children);
}

registerConnector('hierarchy', connector);
registerConnector('tree', connector);
