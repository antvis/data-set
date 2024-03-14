/*
 * for DAG
 * graph data required (nodes, edges)
 */
import { assign } from '@antv/util';
import dagreFn from 'dagre';
import { View } from '../../view';

const DEFAULT_OPTIONS = {
  // nodeId: node => node.index,
  rankdir: 'TB',
  align: 'TB',
  nodesep: 50,
  edgesep: 10,
  ranksep: 50,
  source: (edge) => edge.source,
  target: (edge) => edge.target,
};

const dagre = (dvNodes: any[], dvEdges: any[], options) => {
  options = assign({}, DEFAULT_OPTIONS, options);
  const g = new dagreFn.graphlib.Graph();
  // Set an object for the graph label
  g.setGraph({});
  // Default to assigning a new object as a label for each new edge.
  g.setDefaultEdgeLabel(function () {
    return {};
  });

  dvNodes.forEach((node) => {
    const nodeId = options.nodeId ? options.nodeId(node) : node.id;
    if (!node.height && !node.width) {
      node.height = node.width = options.edgesep;
    }
    g.setNode(nodeId, node);
  });
  dvEdges.forEach((edge) => {
    g.setEdge(options.source(edge), options.target(edge));
  });
  dagreFn.layout(g);

  const nodes = [];
  const edges = [];

  g.nodes().forEach((node) => {
    const n = g.node(node);
    const { x, y, height, width } = n;
    /* points
     * 3---2
     * |   |
     * 0---1
     */
    // @ts-ignore
    n.x = [x - width / 2, x + width / 2, x + width / 2, x - width / 2];
    // @ts-ignore
    n.y = [y + height / 2, y + height / 2, y - height / 2, y - height / 2];
    nodes.push(n);
  });

  g.edges().forEach((edge) => {
    const { points } = g.edge(edge);
    const e: any = {};
    e.x = points.map((p) => p.x);
    e.y = points.map((p) => p.y);
    edges.push(e);
  });

  return {
    nodes,
    edges,
  };
};

function dagreTransform(dv: View, options) {
  const { nodes, edges } = dagre(dv.nodes, dv.edges, options);
  dv.nodes = nodes;
  dv.edges = edges;
}

export { dagre, dagreTransform };
