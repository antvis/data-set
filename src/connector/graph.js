const assign = require('lodash/assign');
const {
  registerConnector
} = require('../data-set');

const DEFAULT_OPTIONS = {
  nodes(d) { // optional
    return d.nodes;
  },
  edges(d) { // optional
    return d.edges;
  }
};

function connector(data, options, dataView) {
  options = assign({}, DEFAULT_OPTIONS, options);
  dataView.dataType = 'graph';
  dataView.rows = dataView.graph = {
    nodes: options.nodes(data),
    edges: options.edges(data)
  };
  assign(dataView, dataView.graph);
  return dataView.rows;
}

registerConnector('graph', connector);
registerConnector('diagram', connector);
