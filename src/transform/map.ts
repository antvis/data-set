import { DataSet } from '../data-set';
import { View } from '../view';

export interface Options {
  callback?(item: any, index: number, arr: any[]): any;
}

function defaultCallback(row: any): any {
  return row;
}

DataSet.registerTransform('map', (dataView: View, options: Options) => {
  dataView.rows = dataView.rows.map(options.callback || defaultCallback);
});
