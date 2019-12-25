import { values, assign } from '@antv/util';
import partition from '../util/partition';
import { DataSet } from '../data-set';
import { View } from '../view';

const DEFAULT_OPTIONS: Options = {
  groupBy: [], // optional
  orderBy: [],
};

export interface Options {
  groupBy: string[];
  orderBy?: string[];
}

DataSet.registerTransform('partition', (dataView: View, options: Options) => {
  options = assign({} as Options, DEFAULT_OPTIONS, options);
  // TODO: rows 是否都只能是数组
  // @ts-ignore;
  dataView.rows = partition(dataView.rows, options.groupBy, options.orderBy);
});

function group(dataView: View, options: Options): void {
  options = assign({} as Options, DEFAULT_OPTIONS, options);
  dataView.rows = values(partition(dataView.rows, options.groupBy, options.orderBy));
}

DataSet.registerTransform('group', group);
DataSet.registerTransform('groups', group);
