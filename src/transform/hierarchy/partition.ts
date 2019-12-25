import * as d3Hierarchy from 'd3-hierarchy';
import { assign, isArray } from '@antv/util';
import { DataSet } from '../../data-set';
import { getField } from '../../util/option-parser';
import { View } from '../../view';

const DEFAULT_OPTIONS: Options = {
  field: 'value',
  size: [1, 1], // width, height
  round: false,
  // ratio: 1.618033988749895, // golden ratio
  padding: 0,
  sort: true,
  as: ['x', 'y'],
};

export interface Options {
  field: string;
  size?: [number, number];
  round?: boolean;
  ratio?: number;
  padding?: number;
  sort?: boolean;
  as?: [string, string];
}

function transform(dataView: View, options: Options): void {
  if (dataView.dataType !== DataSet.CONSTANTS.HIERARCHY) {
    throw new TypeError('Invalid DataView: This transform is for Hierarchy data only!');
  }
  const root = dataView.root;
  options = assign({} as Options, DEFAULT_OPTIONS, options);

  const as = options.as;
  if (!isArray(as) || as.length !== 2) {
    throw new TypeError('Invalid as: it must be an array with 2 strings (e.g. [ "x", "y" ])!');
  }

  let field;
  try {
    field = getField(options);
  } catch (e) {
    console.warn(e);
  }
  if (field) {
    root.sum((d) => d[field]);
  }

  const partitionLayout = d3Hierarchy.partition();
  partitionLayout
    .size(options.size)
    .round(options.round)
    .padding(options.padding);
  partitionLayout(root);

  /*
   * points:
   *   3  2
   *   0  1
   */
  const x = as[0];
  const y = as[1];
  root.each((node) => {
    node[x] = [node.x0, node.x1, node.x1, node.x0];
    node[y] = [node.y1, node.y1, node.y0, node.y0];
    ['x0', 'x1', 'y0', 'y1'].forEach((prop) => {
      if (as.indexOf(prop) === -1) {
        delete node[prop];
      }
    });
  });
}

DataSet.registerTransform('hierarchy.partition', transform);
DataSet.registerTransform('adjacency', transform);
