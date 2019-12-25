import { DataSet } from '../data-set';
import { View } from '../view';

function defaultCallback(row: any): boolean {
  return !!row;
}

export interface Options {
  callback?(item: any): boolean;
}

DataSet.registerTransform('filter', (dataView: View, options: Options) => {
  dataView.rows = dataView.rows.filter(options.callback || defaultCallback);
});
