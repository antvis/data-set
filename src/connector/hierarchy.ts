import { isFunction } from '@antv/util';
import { hierarchy } from 'd3-hierarchy';
import { DataSet } from '../data-set';
import { View } from '../view';

/*
 * options: {
 *   children(d) { // optional
 *     return d.children
 *   },
 * }
 */

export interface Options {
  children?(data: any): any[];
  pureData?: boolean;
}

function connector(data: any, options: Options, dataView: View): any {
  dataView.dataType = DataSet.CONSTANTS.HIERARCHY;
  const children = options && options.children ? options.children : null;

  if (children && !isFunction(children)) {
    throw new TypeError('Invalid children: must be a function!');
  }

  if (!options.pureData) {
    // @ts-ignore
    dataView.rows = dataView.root = hierarchy(data, children);
  } else {
    dataView.rows = dataView.root = data;
  }
  return data;
}

DataSet.registerConnector('hierarchy', connector);
DataSet.registerConnector('tree', connector);
