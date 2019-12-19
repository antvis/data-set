import { assign, isFunction } from '@antv/util';
import { DataSet } from '../data-set';
import { View } from '../view';

const DEFAULT_OPTIONS: Options = {
  nodes(d: any) {
    // optional
    return d.nodes;
  },
  edges(d: any) {
    // optional
    return d.edges;
  },
};

export interface Options {
  nodes?(data: any): any[];
  edges?(data: any): any[];
}

function connector(data: any, options: Options, dataView: View): any {
  options = assign({}, DEFAULT_OPTIONS, options);
  dataView.dataType = DataSet.CONSTANTS.GRAPH;
  const { nodes, edges } = options;
  if (nodes && !isFunction(nodes)) {
    throw new TypeError('Invalid nodes: must be a function!');
  }
  if (edges && !isFunction(edges)) {
    throw new TypeError('Invalid edges: must be a function!');
  }
  // @ts-ignore
  dataView.rows = dataView.graph = {
    nodes: nodes!(data),
    edges: edges!(data),
  };
  assign(dataView, dataView.graph);
  return dataView.rows;
}

DataSet.registerConnector('graph', connector);
DataSet.registerConnector('diagram', connector);
