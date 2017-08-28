/*
 * for Arc Diagram (edges without weight) / Chord Diagram (edges with source and target weight)
 * graph data required (nodes, edges)
 */
const assign = require('lodash/assign');
const forIn = require('lodash/forIn');
const values = require('lodash/values');
const isArray = require('lodash/isArray');
const isFunction = require('lodash/isFunction');
const {
  registerTransform
} = require('../../data-set');

const DEFAULT_OPTIONS = {
  y: 0,
  thickness: 0.05, // thickness of the node, (0, 1)
  weight: true,
  marginRatio: 0.1, // margin ratio, [0, 1)
  id: node => node.id,
  source: edge => edge.source,
  target: edge => edge.target,
  sourceWeight: edge => edge.value || 1,
  targetWeight: edge => edge.value || 1,
  sortBy: null // optional, id | weight | frequency | {function}
};

function _nodesFromEdges(edges, options, map = {}) {
  edges.forEach(edge => {
    const sId = options.edgeSource(edge);
    const tId = options.edgeTarget(edge);
    if (!map[sId]) {
      map[sId] = {
        id: sId
      };
    }
    if (!map[tId]) {
      map[tId] = {
        id: tId
      };
    }
  });
  return values(map);
}

function _processGraph(nodeById, edges, options) {
  forIn(nodeById, (node, id) => {
    // in edges, out edges
    node.inEdges = edges.filter(edge => options.target(edge) === id);
    node.outEdges = edges.filter(edge => options.source(edge) === id);
    // frequency
    node.edges = node.outEdges.concat(node.inEdges);
    node.frequency = node.edges.length;
    // weight
    node.value = 0;
    node.inEdges.forEach(edge => {
      node.value += options.targetWeight(edge);
    });
    node.outEdges.forEach(edge => {
      node.value += options.sourceWeight(edge);
    });
  });
}

function _sortNodes(nodes, options) {
  const sortMethods = {
    weight: (a, b) => b.value - a.value,
    frequency: (a, b) => b.frequency - a.frequency,
    id: (a, b) => `${options.id(a)}`.localeCompare(`${options.id(b)}`)
  };
  let method = sortMethods[options.sortBy];
  if (!method && isFunction(options.sortBy)) {
    method = options.sortBy;
  }
  if (method) {
    nodes.sort(method);
  }
}

function _layoutNodes(nodes, options) {
  const len = nodes.length;
  if (!len) {
    throw new TypeError('Invalid nodes: it\'s empty');
  }
  if (options.weight) {
    const marginRatio = options.marginRatio;
    if (marginRatio < 0 || marginRatio >= 1) {
      throw new TypeError('Invalid marginRatio: it must be in range [0, 1)');
    }
    const margin = marginRatio / (2 * len);
    const thickness = options.thickness;
    if (thickness <= 0 || thickness >= 1) {
      throw new TypeError('Invalid thickness: it must be in range (0, 1)');
    }
    let totalValue = 0;
    nodes.forEach(node => {
      totalValue += node.value;
    });
    nodes.forEach(node => {
      node.weight = node.value / totalValue;
      node.width = node.weight * (1 - marginRatio);
      node.height = thickness;
      node.y = options.y;
    });
    nodes.forEach((node, index) => {
      // x
      let deltaX = 0;
      for (let i = index - 1; i >= 0; i--) {
        deltaX += nodes[i].width + 2 * margin;
      }
      node.x = margin + 0.5 * node.width + deltaX;
    });
  } else {
    const deltaX = 1 / len;
    nodes.forEach((node, index) => {
      node.x = (index + 0.5) * deltaX;
      node.y = options.y;
    });
  }
}

function _locatingEdges(nodeById, edges, options) {
  edges.forEach(edge => {
    const sNode = nodeById[options.source(edge)];
    const tNode = nodeById[options.target(edge)];
    if (sNode && tNode) {
      if (options.weight) {
        const sStart = sNode.x - 0.5 * sNode.width;
        const tStart = tNode.x - 0.5 * tNode.width;
        const sWeight = options.sourceWeight(edge) * sNode.width / sNode.value;
        const tWeight = options.targetWeight(edge) * tNode.width / tNode.value;
        const sEnd = sStart + sWeight;
        const tEnd = tStart + tWeight;
        edge.x = [ sStart, sEnd, tStart, tEnd ];
        edge.y = [ sNode.y, sNode.y, tNode.y, tNode.y ];
      } else {
        edge.x = [ sNode.x, tNode.x ];
        edge.y = [ sNode.y, tNode.y ];
      }
    }
  });
}

function transform(dv, options) {
  options = assign({}, DEFAULT_OPTIONS, options);
  const nodeById = {};
  let nodes = dv.nodes;
  const edges = dv.edges;
  if (!isArray(nodes) || nodes.length === 0) {
    nodes = _nodesFromEdges(edges, options, nodeById);
  }
  nodes.forEach(node => {
    const id = options.id(node);
    nodeById[id] = node;
  });
  _processGraph(nodeById, edges, options);
  _sortNodes(nodes, options);
  _layoutNodes(nodes, options);
  _locatingEdges(nodeById, edges, options);
  dv.nodes = nodes;
  dv.edges = edges;
}

registerTransform('diagram.arc', transform);
registerTransform('arc', transform);
