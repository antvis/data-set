/*
 * for Sankey Diagram
 * graph data required (nodes, edges)
 */
import { assign, isString, isFunction } from '@antv/util';
import { sankey, sankeyLeft, sankeyRight, sankeyCenter, sankeyJustify } from 'd3-sankey';
import { DataSet } from '../../data-set';
import { View } from '../../view';

const ALIGN_METHOD = {
  sankeyLeft,
  sankeyRight,
  sankeyCenter,
  sankeyJustify,
};

const DEFAULT_OPTIONS: Partial<Options> = {
  // nodeId: node => node.index,
  value: (node) => node.value,
  source: (edge) => edge.source,
  target: (edge) => edge.target,
  nodeAlign: 'sankeyJustify',
  nodeWidth: 0.02,
  nodePadding: 0.02,
  sort: undefined,
};

export interface Options {
  nodeId?(node: any): any;

  value?(node: any): any;

  source?(edge: any): any;

  target?(edge: any): any;
  // sankey.nodeSort(undefined) is the default and resorts by ascending breadth during each iteration.
  // sankey.nodeSort(null) specifies the input order of nodes and never sorts.
  // sankey.nodeSort(function) specifies the given order as a comparator function and sorts once on initialization.
  sort?: null | undefined | ((a: any, b: any) => number);

  nodeAlign?: keyof typeof ALIGN_METHOD;
  nodeWidth?: number;
  nodePadding?: number;
}

function transform(dv: View, options: Options): void {
  options = assign({} as Options, DEFAULT_OPTIONS, options);
  let nodeAlign = null;
  if (isString(options.nodeAlign)) {
    nodeAlign = ALIGN_METHOD[options.nodeAlign];
  } else if (isFunction(options.nodeAlign)) {
    nodeAlign = options.nodeAlign;
  }
  const sankeyProcessor = sankey()
    .nodeSort(options.sort)
    .links((d: any) => d.edges)
    .nodeWidth(options.nodeWidth!)
    .nodePadding(options.nodePadding!)
    .extent([
      [0, 0],
      [1, 1],
    ]);
  if (isFunction(options.nodeId)) {
    sankeyProcessor.nodeId(options.nodeId);
  }
  if (nodeAlign) {
    sankeyProcessor.nodeAlign(nodeAlign);
  }
  // TODO:
  // @ts-ignore
  sankeyProcessor(dv);
  // post process (x, y), etc.
  dv.nodes.forEach((node) => {
    const { x0, x1, y0, y1 } = node;
    /* points
     * 3---2
     * |   |
     * 0---1
     */
    node.x = [x0, x1, x1, x0];
    node.y = [y0, y0, y1, y1];
  });
  dv.edges.forEach((edge) => {
    const { source, target } = edge;
    const sx = source.x1;
    const tx = target.x0;
    edge.x = [sx, sx, tx, tx];
    const offset = edge.width / 2;
    edge.y = [edge.y0 + offset, edge.y0 - offset, edge.y1 + offset, edge.y1 - offset];
  });
}

DataSet.registerTransform('diagram.sankey', transform);
DataSet.registerTransform('sankey', transform);
