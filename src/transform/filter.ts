import DataSet from '../data-set';
import { View } from '../view';

/*
 * options: {
 *   type: 'filter',
 *   callback,
 * }
 */

function defaultCallback(row: any) {
  return !!row;
}

interface Options {
  callback(item: any): boolean;
}

DataSet.registerTransform('filter', (dataView: View, options?: Options) => {
  dataView.rows = dataView.rows.filter((options && options.callback) || defaultCallback);
});
