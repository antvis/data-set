import DataSet from '../data-set';
import { View } from '../view';

/*
 * options: {
 *   type: 'map',
 *   callback,
 * }
 */

interface Options {
  callback(item: any, index: number, arr: any[]): any;
}

function defaultCallback(row: any) {
  return row;
}

DataSet.registerTransform('map', (dataView: View, options?: Options) => {
  dataView.rows = dataView.rows.map((options && options.callback) || defaultCallback);
});
