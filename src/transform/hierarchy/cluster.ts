import * as d3Hierarchy from 'd3-hierarchy';
import { assign, isArray } from '@antv/util';
import { DataSet } from '../../data-set';
import { getField } from '../../util/option-parser';
import { View } from '../../view';

const DEFAULT_OPTIONS = {
  field: 'value',
  size: [1, 1], // width, height
  nodeSize: null,
  separation: null,
  as: ['x', 'y'],
};

interface Options {
  field: string;
  size: [number, number];
  nodeSize: any;
  separation: any;
  as: [string, string];
}

function transform(dataView: View, options: Options) {
  if (dataView.dataType !== DataSet.CONSTANTS.HIERARCHY || !dataView.root) {
    throw new TypeError('Invalid DataView: This transform is for Hierarchy data only!');
  }
  const root = dataView.root;
  options = assign({} as Options, DEFAULT_OPTIONS, options);

  const as = options.as;
  if (!isArray(as) || as.length !== 2) {
    throw new TypeError('Invalid as: it must be an array with 2 strings (e.g. [ "x", "y" ])!');
  }

  let field: string | undefined = undefined;
  try {
    field = getField(options);
  } catch (e) {
    console.warn(e);
  }

  if (field) {
    root.sum((d: any) => d[field!]);
  }

  const clusterLayout = d3Hierarchy.cluster();
  clusterLayout.size(options.size);
  if (options.nodeSize) {
    clusterLayout.nodeSize(options.nodeSize);
  }
  if (options.separation) {
    clusterLayout.separation(options.separation);
  }
  clusterLayout(root);

  const x = as[0];
  const y = as[1];
  root.each((node: any) => {
    node[x] = node.x;
    node[y] = node.y;
  });
}

DataSet.registerTransform('hierarchy.cluster', transform);
DataSet.registerTransform('dendrogram', transform);
