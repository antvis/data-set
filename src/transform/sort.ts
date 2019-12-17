import DataSet from '../data-set';
import { View } from '../view';

/*
 * options: {
 *   type: 'sort',
 *   callback,
 * }
 */

interface Options {
  callback(a: any, b: any): number;
}

DataSet.registerTransform('sort', (dataView: View, options?: Options) => {
  const columnName = dataView.getColumnName(0);
  dataView.rows.sort((options && options.callback) || ((a, b) => a[columnName] - b[columnName]));
});
