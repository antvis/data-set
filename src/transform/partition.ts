import { assign } from '@antv/util';
import partitionFn from '../util/partition';
import { View } from '../view';

const DEFAULT_OPTIONS: Options = {
  groupBy: [], // optional
  orderBy: [],
};

export interface Options {
  groupBy: string[];
  orderBy?: string[];
}

const partition = (items: View['rows'], options: Options): any[] => {
  const rows = [...(items || [])];
  options = assign({} as Options, DEFAULT_OPTIONS, options);
  // TODO: rows 是否都只能是数组
  // @ts-ignore;
  return partitionFn(rows, options.groupBy, options.orderBy);
};

const partitionTransform = (dataView: View, options: Options): void => {
  dataView.rows = partition(dataView.rows, options);
};

export { partition, partitionTransform };
