import { values, assign } from '@antv/util';
import partition from '../util/partition';
import { View } from '../view';

export interface Options {
  groupBy: string[];
  orderBy?: string[];
}

const DEFAULT_OPTIONS: Options = {
  groupBy: [], // optional
  orderBy: [],
};

const group = (items: View['rows'], options: Options): any[] => {
  const rows = [...(items || [])];
  options = assign({} as Options, DEFAULT_OPTIONS, options);
  return values(partition(rows, options.groupBy, options.orderBy));
};

const groupTransform = (dataView: View, options: Options): void => {
  dataView.rows = group(dataView.rows, options);
};

export { group, groupTransform };
